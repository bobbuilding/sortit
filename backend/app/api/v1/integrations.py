"""API routes for the Integrations Hub."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.models import Integration, ProviderType
from app.schemas.schemas import (
    IntegrationCreate,
    IntegrationResponse,
    IntegrationSyncResult,
    ProviderInfo,
)
from app.integrations.registry import PROVIDER_REGISTRY, get_provider_config
from app.integrations.engine import sync_integration, get_connector

router = APIRouter(prefix="/integrations", tags=["Integrations"])


@router.get("/providers", response_model=List[ProviderInfo])
def list_providers():
    """Return all supported integration providers.
    
    The frontend uses this to dynamically render the Integrations Hub
    without hardcoding any provider details.
    """
    return PROVIDER_REGISTRY


@router.get("/", response_model=List[IntegrationResponse])
def list_integrations(db: Session = Depends(get_db)):
    """Return all integrations the user has connected."""
    return db.query(Integration).all()


@router.post("/", response_model=IntegrationResponse)
def create_integration(payload: IntegrationCreate, db: Session = Depends(get_db)):
    """Connect a new platform (Odoo, Razorpay, etc.).
    
    1. Validates the provider exists in the registry
    2. Validates the required credential fields are present
    3. Tests authentication before saving
    4. Stores the integration record
    """
    provider_config = get_provider_config(payload.provider_name)
    if not provider_config:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {payload.provider_name}")

    # Validate required fields
    missing = [f for f in provider_config["required_fields"] if f not in payload.credentials]
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required credential fields: {', '.join(missing)}"
        )

    # Test authentication before saving
    connector = get_connector(payload.provider_name, payload.credentials)
    if connector is None:
        raise HTTPException(status_code=501, detail=f"Connector not implemented for: {payload.provider_name}")

    if not connector.authenticate():
        raise HTTPException(status_code=401, detail="Authentication failed with the provided credentials")

    # Check for duplicate connection
    existing = db.query(Integration).filter_by(
        provider_name=payload.provider_name,
        is_active=True,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"{payload.provider_name} is already connected")

    integration = Integration(
        provider_name=payload.provider_name,
        provider_type=ProviderType(payload.provider_type),
        credentials=payload.credentials,
        is_active=True,
    )
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@router.post("/{integration_id}/sync", response_model=IntegrationSyncResult)
def trigger_sync(integration_id: int, db: Session = Depends(get_db)):
    """Manually trigger a sync for a specific integration.
    
    Fetches fresh data from the provider and upserts it into the database.
    """
    integration = db.query(Integration).filter_by(id=integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    result = sync_integration(db, integration)

    return IntegrationSyncResult(
        integration_id=integration.id,
        provider_name=integration.provider_name,
        assets_synced=result.get("assets_synced", 0),
        transactions_synced=result.get("transactions_synced", 0),
        status=result["status"],
        message=result["message"],
    )


@router.delete("/{integration_id}")
def disconnect_integration(integration_id: int, db: Session = Depends(get_db)):
    """Disconnect (soft-delete) an integration."""
    integration = db.query(Integration).filter_by(id=integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration.is_active = False
    db.commit()
    return {"message": f"{integration.provider_name} disconnected"}
