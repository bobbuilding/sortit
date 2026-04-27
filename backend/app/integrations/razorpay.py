"""Razorpay connector — uses Razorpay REST API with Basic Auth."""

import base64
import json
import logging
import urllib.request
from datetime import datetime
from typing import List

from app.integrations.base import BaseConnector, NormalizedAsset, NormalizedTransaction

logger = logging.getLogger(__name__)

RAZORPAY_API_BASE = "https://api.razorpay.com/v1"


class RazorpayConnector(BaseConnector):
    """Connects to Razorpay to fetch settlements and payment data."""

    def __init__(self, credentials: dict):
        super().__init__(credentials)
        self.key_id = credentials["key_id"]
        self.key_secret = credentials["key_secret"]
        self._auth_header = self._build_auth_header()

    def _build_auth_header(self) -> str:
        token = base64.b64encode(f"{self.key_id}:{self.key_secret}".encode()).decode()
        return f"Basic {token}"

    def _get(self, endpoint: str, params: dict | None = None) -> dict | None:
        """Make an authenticated GET request to the Razorpay API."""
        url = f"{RAZORPAY_API_BASE}/{endpoint}"
        if params:
            query = "&".join(f"{k}={v}" for k, v in params.items())
            url = f"{url}?{query}"

        try:
            req = urllib.request.Request(url, headers={
                "Authorization": self._auth_header,
                "Content-Type": "application/json",
            })
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            logger.error("Razorpay API error (%s): %s", endpoint, str(e))
            return None

    def authenticate(self) -> bool:
        """Verify credentials by fetching account balance."""
        result = self._get("balance")
        if result is not None:
            logger.info("Razorpay auth success for key: %s***", self.key_id[:8])
            return True
        return False

    def fetch_balances(self) -> List[NormalizedAsset]:
        """Fetch the current Razorpay account balance."""
        data = self._get("balance")
        if not data:
            return []

        balance_paise = data.get("balance", 0)
        balance_inr = balance_paise / 100.0

        return [NormalizedAsset(
            external_account_id=f"razorpay_{self.key_id}",
            name="Razorpay Balance",
            type="Payment Gateway",
            balance=balance_inr,
            currency="INR",
        )]

    def fetch_transactions(self, since: datetime) -> List[NormalizedTransaction]:
        """Fetch settled payments from Razorpay since the given date."""
        since_epoch = int(since.timestamp())
        payments_data = self._get("payments", {
            "from": since_epoch,
            "count": 100,
        })

        if not payments_data or "items" not in payments_data:
            return []

        transactions = []
        for p in payments_data["items"]:
            if p.get("status") != "captured":
                continue

            amount_inr = p.get("amount", 0) / 100.0
            created_at = datetime.fromtimestamp(p.get("created_at", 0))

            transactions.append(NormalizedTransaction(
                external_txn_id=f"razorpay_{p['id']}",
                description=p.get("description") or f"Payment {p['id']}",
                amount=amount_inr,
                timestamp=created_at,
                category=p.get("method", "payment"),
                asset_external_id=f"razorpay_{self.key_id}",
            ))

        return transactions
