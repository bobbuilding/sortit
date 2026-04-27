"""Abstract base class for all integration connectors."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


@dataclass
class NormalizedAsset:
    """Standardized asset format that all connectors must output."""
    external_account_id: str
    name: str
    type: str
    balance: float
    currency: str = "INR"


@dataclass
class NormalizedTransaction:
    """Standardized transaction format that all connectors must output."""
    external_txn_id: str
    description: str
    amount: float
    timestamp: datetime
    category: Optional[str] = None
    asset_external_id: Optional[str] = None


@dataclass
class SyncResult:
    """Result of a connector sync operation."""
    assets: List[NormalizedAsset] = field(default_factory=list)
    transactions: List[NormalizedTransaction] = field(default_factory=list)
    success: bool = True
    message: str = "Sync completed"


class BaseConnector(ABC):
    """Abstract connector that all providers (Odoo, Razorpay, etc.) must implement."""

    def __init__(self, credentials: dict):
        self.credentials = credentials

    @abstractmethod
    def authenticate(self) -> bool:
        """Verify that the provided credentials are valid.
        
        Returns True if authentication succeeds.
        """
        pass

    @abstractmethod
    def fetch_balances(self) -> List[NormalizedAsset]:
        """Fetch current account/wallet balances from the provider.
        
        Returns a list of NormalizedAsset objects.
        """
        pass

    @abstractmethod
    def fetch_transactions(self, since: datetime) -> List[NormalizedTransaction]:
        """Fetch transactions from the provider since the given date.
        
        Returns a list of NormalizedTransaction objects.
        """
        pass

    def sync(self, since: datetime) -> SyncResult:
        """Full sync operation: authenticate, fetch balances, fetch transactions.
        
        This is the entry point called by the sync engine.
        """
        try:
            if not self.authenticate():
                return SyncResult(success=False, message="Authentication failed")

            assets = self.fetch_balances()
            transactions = self.fetch_transactions(since)

            return SyncResult(
                assets=assets,
                transactions=transactions,
                success=True,
                message=f"Synced {len(assets)} assets and {len(transactions)} transactions",
            )
        except Exception as e:
            return SyncResult(success=False, message=f"Sync error: {str(e)}")
