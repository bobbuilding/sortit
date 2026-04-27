from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()


class NodeStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    WARNING = "warning"
    CRITICAL = "critical"


class ProviderType(enum.Enum):
    ACCOUNTING = "accounting"
    PAYMENT_GATEWAY = "payment_gateway"
    BANKING = "banking"
    CRYPTO = "crypto"


class SyncStatus(enum.Enum):
    PENDING = "pending"
    SYNCING = "syncing"
    SUCCESS = "success"
    FAILED = "failed"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    nodes = relationship("Node", back_populates="owner")
    integrations = relationship("Integration", back_populates="owner")


class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    identifier = Column(String, unique=True, index=True)
    status = Column(Enum(NodeStatus), default=NodeStatus.ACTIVE)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="nodes")
    assets = relationship("Asset", back_populates="parent_node")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String)
    balance = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    yield_rate = Column(Float, default=0.0)
    custodian = Column(String)
    risk_level = Column(String)
    node_id = Column(Integer, ForeignKey("nodes.id"))
    # Integration traceability
    provider_id = Column(Integer, ForeignKey("integrations.id"), nullable=True)
    external_account_id = Column(String, nullable=True)

    parent_node = relationship("Node", back_populates="assets")
    transactions = relationship("Transaction", back_populates="asset")
    provider = relationship("Integration", back_populates="assets")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    category = Column(String)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    # Integration traceability
    provider_id = Column(Integer, ForeignKey("integrations.id"), nullable=True)
    external_txn_id = Column(String, nullable=True, unique=True)

    asset = relationship("Asset", back_populates="transactions")
    provider = relationship("Integration", back_populates="transactions")


class Integration(Base):
    """Represents a connected third-party platform (Odoo, Razorpay, etc.)."""
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String, nullable=False)
    provider_type = Column(Enum(ProviderType), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Encrypted credentials stored as JSON blob
    credentials = Column(JSON, nullable=True)

    # Sync metadata
    last_sync_at = Column(DateTime, nullable=True)
    last_sync_status = Column(Enum(SyncStatus), default=SyncStatus.PENDING)
    sync_error = Column(Text, nullable=True)

    owner = relationship("User", back_populates="integrations")
    assets = relationship("Asset", back_populates="provider")
    transactions = relationship("Transaction", back_populates="provider")
