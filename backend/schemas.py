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
