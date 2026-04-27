"""Stripe connector — uses Stripe REST API with Bearer token auth."""

import json
import logging
import urllib.request
from datetime import datetime
from typing import List

from app.integrations.base import BaseConnector, NormalizedAsset, NormalizedTransaction

logger = logging.getLogger(__name__)

STRIPE_API_BASE = "https://api.stripe.com/v1"


class StripeConnector(BaseConnector):
    """Connects to Stripe to fetch balance and charge history."""

    def __init__(self, credentials: dict):
        super().__init__(credentials)
        self.api_key = credentials["api_key"]

    def _get(self, endpoint: str, params: dict | None = None) -> dict | None:
        """Make an authenticated GET request to the Stripe API."""
        url = f"{STRIPE_API_BASE}/{endpoint}"
        if params:
            query = "&".join(f"{k}={v}" for k, v in params.items())
            url = f"{url}?{query}"

        try:
            req = urllib.request.Request(url, headers={
                "Authorization": f"Bearer {self.api_key}",
            })
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            logger.error("Stripe API error (%s): %s", endpoint, str(e))
            return None

    def authenticate(self) -> bool:
        result = self._get("balance")
        if result and "available" in result:
            logger.info("Stripe auth success")
            return True
        return False

    def fetch_balances(self) -> List[NormalizedAsset]:
        data = self._get("balance")
        if not data:
            return []

        assets = []
        for entry in data.get("available", []):
            amount = entry.get("amount", 0) / 100.0
            currency = entry.get("currency", "usd").upper()
            assets.append(NormalizedAsset(
                external_account_id=f"stripe_{currency.lower()}",
                name=f"Stripe Balance ({currency})",
                type="Payment Gateway",
                balance=amount,
                currency=currency,
            ))
        return assets

    def fetch_transactions(self, since: datetime) -> List[NormalizedTransaction]:
        since_epoch = int(since.timestamp())
        data = self._get("charges", {"created[gte]": since_epoch, "limit": 100})
        if not data or "data" not in data:
            return []

        transactions = []
        for charge in data["data"]:
            if charge.get("status") != "succeeded":
                continue
            amount = charge.get("amount", 0) / 100.0
            currency = charge.get("currency", "usd").upper()
            created_at = datetime.fromtimestamp(charge.get("created", 0))
            transactions.append(NormalizedTransaction(
                external_txn_id=f"stripe_{charge['id']}",
                description=charge.get("description") or f"Charge {charge['id']}",
                amount=amount,
                timestamp=created_at,
                category="charge",
                asset_external_id=f"stripe_{currency.lower()}",
            ))
        return transactions
