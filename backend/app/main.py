from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import asyncio
from datetime import datetime, timezone, timedelta
import random
import urllib.request
import json

from app.models import models
from app.db import session as database
from app.schemas import schemas
from app.core.config import settings

def fetch_crypto_price(symbol: str) -> float:
    try:
        url = f"{settings.BINANCE_API_URL}?symbol={symbol}USDT"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            return float(data["price"])
    except Exception:
        return 0.0

# Initialize database
database.init_db()

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to SortIT MVP API"}

@app.get("/api/v1/terminal/summary", response_model=schemas.TerminalSummary)
def get_terminal_summary(db: Session = Depends(database.get_db)):
    assets = db.query(models.Asset).all()
    nav_total = sum(a.balance for a in assets)
    
    from collections import defaultdict
    category_totals = defaultdict(float)
    for a in assets:
        category_totals[a.type or "Unknown"] += a.balance
        
    distribution = []
    if nav_total > 0:
        for cat, val in category_totals.items():
            distribution.append({"category": cat, "value": (val / nav_total) * 100})
            
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_txns = db.query(models.Transaction).filter(
        models.Transaction.timestamp >= thirty_days_ago,
        models.Transaction.amount < 0
    ).all()
    
    burn_rate_monthly = sum(abs(t.amount) for t in recent_txns)
    runway_months = (nav_total / burn_rate_monthly) if burn_rate_monthly > 0 else 0.0

    return {
        "nav_total": f"{nav_total:.2f}",
        "currency": "USD",
        "burn_rate_monthly": f"{burn_rate_monthly:.2f}",
        "runway_months": f"{runway_months:.1f}",
        "delta_24h": "0.0%",
        "distribution": distribution
    }

@app.get("/api/v1/nodes", response_model=List[schemas.Node])
def get_nodes(db: Session = Depends(database.get_db)):
    return db.query(models.Node).all()

@app.get("/api/v1/nodes/{node_id}/health", response_model=schemas.NodeHealth)
def get_node_health(node_id: str):
    return {
        "node_id": node_id,
        "status": "ACTIVE",
        "uptime": "Unknown",
        "latency_ms": 0,
        "last_sync": datetime.now(timezone.utc).isoformat(),
        "alerts": []
    }

@app.get("/api/v1/market/prices", response_model=List[schemas.MarketPrice])
def get_market_prices():
    btc_price = fetch_crypto_price("BTC")
    eth_price = fetch_crypto_price("ETH")
    return [
        {
            "asset_id": "BTC",
            "current_price": f"{btc_price:.2f}",
            "currency": "USD",
            "last_updated": datetime.now(timezone.utc).isoformat()
        },
        {
            "asset_id": "ETH",
            "current_price": f"{eth_price:.2f}",
            "currency": "USD",
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
    ]

# WebSocket for Market Stream
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

manager = ConnectionManager()

@app.websocket("/api/v1/market/stream")
async def market_stream(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(5)
            btc_price = await asyncio.to_thread(fetch_crypto_price, "BTC")
            eth_price = await asyncio.to_thread(fetch_crypto_price, "ETH")
            
            tick = {
                "BTC": f"{btc_price:.2f}",
                "ETH": f"{eth_price:.2f}",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            await websocket.send_json(tick)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/v1/assets", response_model=List[schemas.Asset])
def get_assets(db: Session = Depends(database.get_db)):
    return db.query(models.Asset).all()

@app.get("/api/v1/ledger", response_model=List[schemas.Transaction])
def get_ledger(db: Session = Depends(database.get_db)):
    return db.query(models.Transaction).order_by(models.Transaction.timestamp.desc()).all()

@app.get("/api/v1/flows")
def get_flows(db: Session = Depends(database.get_db)):
    nodes = db.query(models.Node).all()
    
    sankey_nodes = []
    sankey_links = []
    
    # Track unique names for nodes
    seen_names = set()
    
    def add_node(name):
        if name not in seen_names:
            sankey_nodes.append({"id": name})
            seen_names.add(name)
            
    for node in nodes:
        add_node(node.name)
        for asset in node.assets:
            add_node(asset.name)
            if asset.balance > 0:
                sankey_links.append({
                    "source": node.name,
                    "target": asset.name,
                    "value": asset.balance
                })
                
    return {"nodes": sankey_nodes, "links": sankey_links}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
