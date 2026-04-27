"""Sync engine — orchestrates data ingestion from connected providers into the database."""

import logging
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.utils import utc_now
from app.models.models import Integration, Asset, Transaction, SyncStatus
from app.integrations.base import BaseConnector, NormalizedAsset, NormalizedTransaction
from app.integrations.registry import get_provider_config

logger = logging.getLogger(__name__)

# ─── Connector Factory ────────────────────────────────────
_CONNECTOR_MAP = {}


def _lazy_load_connectors():
    """Lazy-load connector classes to avoid circular imports."""
    global _CONNECTOR_MAP
    if _CONNECTOR_MAP:
        return

    from app.integrations.odoo import OdooConnector
    from app.integrations.tally import TallyConnector
    from app.integrations.razorpay import RazorpayConnector
    from app.integrations.stripe import StripeConnector

    _CONNECTOR_MAP = {
        "odoo_cloud": OdooConnector,
        "odoo_local": OdooConnector,
        "tally": TallyConnector,
        "razorpay": RazorpayConnector,
        "stripe": StripeConnector,
    }


def get_connector(provider_name: str, credentials: dict) -> Optional[BaseConnector]:
    """Factory: return the correct connector instance for a provider name."""
    _lazy_load_connectors()
    connector_class = _CONNECTOR_MAP.get(provider_name)
    if connector_class is None:
        logger.warning("No connector implemented for provider: %s", provider_name)
        return None
    return connector_class(credentials)


# ─── Upsert Logic ─────────────────────────────────────────
def _upsert_asset(
    db: Session,
    normalized: NormalizedAsset,
    integration: Integration,
    node_id: Optional[int],
) -> Asset:
    """Insert or update an asset based on its external_account_id."""
    existing = db.query(Asset).filter_by(
        external_account_id=normalized.external_account_id,
        provider_id=integration.id,
    ).first()

    if existing:
        existing.balance = normalized.balance
        existing.currency = normalized.currency
        existing.name = normalized.name
        existing.type = normalized.type
        return existing

    asset = Asset(
        name=normalized.name,
        type=normalized.type,
        balance=normalized.balance,
        currency=normalized.currency,
        node_id=node_id,
        provider_id=integration.id,
        external_account_id=normalized.external_account_id,
    )
    db.add(asset)
    db.flush()
    return asset


def _upsert_transaction(
    db: Session,
    normalized: NormalizedTransaction,
    integration: Integration,
    asset_map: dict,
) -> bool:
    """Insert a transaction if its external_txn_id doesn't already exist (dedup)."""
    exists = db.query(Transaction).filter_by(
        external_txn_id=normalized.external_txn_id
    ).first()
    if exists:
        return False

    asset_id = None
    if normalized.asset_external_id and normalized.asset_external_id in asset_map:
        asset_id = asset_map[normalized.asset_external_id]

    txn = Transaction(
        description=normalized.description,
        amount=normalized.amount,
        timestamp=normalized.timestamp,
        category=normalized.category,
        asset_id=asset_id,
        provider_id=integration.id,
        external_txn_id=normalized.external_txn_id,
    )
    db.add(txn)
    return True


# ─── Main Sync Function ───────────────────────────────────
def sync_integration(db: Session, integration: Integration, node_id: Optional[int] = None) -> dict:
    """Run a full sync for a single integration.
    
    1. Instantiate the correct connector
    2. Call sync() to fetch normalized data
    3. Upsert assets and transactions into the database
    4. Update the integration's sync metadata
    """
    connector = get_connector(integration.provider_name, integration.credentials or {})
    if connector is None:
        integration.last_sync_status = SyncStatus.FAILED
        integration.sync_error = f"No connector for provider: {integration.provider_name}"
        db.commit()
        return {"status": "error", "message": integration.sync_error}

    since = datetime.utcnow() - timedelta(days=settings.SYNC_HISTORY_DAYS)
    integration.last_sync_status = SyncStatus.SYNCING
    db.commit()

    result = connector.sync(since)

    if not result.success:
        integration.last_sync_status = SyncStatus.FAILED
        integration.sync_error = result.message
        integration.last_sync_at = utc_now()
        db.commit()
        return {"status": "error", "message": result.message}

    # Upsert assets and build a mapping of external_id -> db id
    asset_map = {}
    assets_synced = 0
    for norm_asset in result.assets:
        asset = _upsert_asset(db, norm_asset, integration, node_id)
        asset_map[norm_asset.external_account_id] = asset.id
        assets_synced += 1

    # Upsert transactions with deduplication
    txns_synced = 0
    for norm_txn in result.transactions:
        if _upsert_transaction(db, norm_txn, integration, asset_map):
            txns_synced += 1

    integration.last_sync_status = SyncStatus.SUCCESS
    integration.last_sync_at = utc_now()
    integration.sync_error = None
    db.commit()

    msg = f"Synced {assets_synced} assets, {txns_synced} new transactions"
    logger.info("Integration %s: %s", integration.provider_name, msg)
    return {
        "status": "success",
        "assets_synced": assets_synced,
        "transactions_synced": txns_synced,
        "message": msg,
    }


def sync_all_active(db: Session):
    """Sync all active integrations. Called by background scheduler."""
    integrations = db.query(Integration).filter_by(is_active=True).all()
    results = []
    for integration in integrations:
        result = sync_integration(db, integration)
        results.append({"provider": integration.provider_name, **result})
    return results
