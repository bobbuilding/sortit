from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
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

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    nodes = relationship("Node", back_populates="owner")

class Node(Base):
    __tablename__ = "nodes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    identifier = Column(String, unique=True, index=True) # e.g., ND-774-ALPHA
    status = Column(Enum(NodeStatus), default=NodeStatus.ACTIVE)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="nodes")
    assets = relationship("Asset", back_populates="parent_node")

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String) # e.g., Cash, Equity, Crypto
    balance = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    yield_rate = Column(Float, default=0.0)
    custodian = Column(String)
    risk_level = Column(String) # LOW, MEDIUM, HIGH
    node_id = Column(Integer, ForeignKey("nodes.id"))
    
    parent_node = relationship("Node", back_populates="assets")
    transactions = relationship("Transaction", back_populates="asset")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    category = Column(String)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    
    asset = relationship("Asset", back_populates="transactions")
