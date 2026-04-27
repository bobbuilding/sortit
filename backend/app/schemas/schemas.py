from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TransactionBase(BaseModel):
    description: str
    amount: float
    category: Optional[str] = None

class Transaction(TransactionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AssetBase(BaseModel):
    name: str
    type: str
    balance: float
    currency: str = "INR"
    yield_rate: float = 0.0
    custodian: Optional[str] = None
    risk_level: Optional[str] = None

class Asset(AssetBase):
    id: int
    transactions: List[Transaction] = []

    class Config:
        from_attributes = True

class NodeBase(BaseModel):
    name: str
    identifier: str
    status: str

class Node(NodeBase):
    id: int
    assets: List[Asset] = []

    class Config:
        from_attributes = True

class AssetDistribution(BaseModel):
    category: str
    value: float

class TerminalSummary(BaseModel):
    nav_total: str
    currency: str = "INR"
    burn_rate_monthly: str
    runway_months: str
    delta_24h: str
    distribution: List[AssetDistribution]

class NodeHealth(BaseModel):
    node_id: str
    status: str
    uptime: str
    latency_ms: int
    last_sync: str
    alerts: List[str] = []

class MarketPrice(BaseModel):
    asset_id: str
    current_price: str
    currency: str
    last_updated: str
