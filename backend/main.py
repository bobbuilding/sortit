from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import database
import schemas

# Initialize database
database.init_db()

app = FastAPI(title="SortIT API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to SortIT MVP API"}

@app.get("/api/system/status", response_model=schemas.Node)
def get_system_status():
    # Returning mock data for initial UI testing
    return {
        "id": 1,
        "name": "PRIMARY_NODE",
        "identifier": "ND-774-ALPHA",
        "status": "active",
        "assets": [
            {"id": 1, "name": "Institutional Cash", "type": "Cash", "balance": 4821093.0, "currency": "INR", "transactions": []}
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
