from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ─── Transaction ───────────────────────────────────────────
class TransactionBase(BaseModel):
    description: str
    amount: float
    category: Optional[str] = None


class Transaction(TransactionBase):
    id: int
    timestamp: datetime
    provider_id: Optional[int] = None
    external_txn_id: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Asset ─────────────────────────────────────────────────
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
    provider_id: Optional[int] = None
    external_account_id: Optional[str] = None
    transactions: List[Transaction] = []

    class Config:
        from_attributes = True


# ─── Node ──────────────────────────────────────────────────
class NodeBase(BaseModel):
    name: str
    identifier: str
    status: str


class Node(NodeBase):
    id: int
    assets: List[Asset] = []

    class Config:
        from_attributes = True


# ─── Dashboard Aggregations ───────────────────────────────
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


# ─── Integration Schemas ──────────────────────────────────
class IntegrationCreate(BaseModel):
    provider_name: str
    provider_type: str
    credentials: dict


class IntegrationResponse(BaseModel):
    id: int
    provider_name: str
    provider_type: str
    is_active: bool
    created_at: datetime
    last_sync_at: Optional[datetime] = None
    last_sync_status: Optional[str] = None
    sync_error: Optional[str] = None

    class Config:
        from_attributes = True


class IntegrationSyncResult(BaseModel):
    integration_id: int
    provider_name: str
    assets_synced: int
    transactions_synced: int
    status: str
    message: str


# ─── Provider Registry ────────────────────────────────────
class ProviderInfo(BaseModel):
    name: str
    display_name: str
    type: str
    auth_type: str
    required_fields: List[str]
    description: str
    icon: str
