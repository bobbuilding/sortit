"""Odoo ERP connector — uses XML-RPC External API."""

import xmlrpc.client
import logging
from datetime import datetime
from typing import List

from app.integrations.base import BaseConnector, NormalizedAsset, NormalizedTransaction

logger = logging.getLogger(__name__)


class OdooConnector(BaseConnector):
    """Connects to an Odoo instance via XML-RPC to fetch accounting data."""

    def __init__(self, credentials: dict):
        super().__init__(credentials)
        self.url = credentials["url"]
        self.db = credentials["database"]
        self.username = credentials["username"]
        self.api_key = credentials.get("api_key") or credentials.get("password")
        self.uid = None

    def authenticate(self) -> bool:
        try:
            common = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/common")
            self.uid = common.authenticate(self.db, self.username, self.api_key, {})
            if self.uid:
                logger.info("Odoo auth success for %s (uid=%s)", self.username, self.uid)
                return True
            logger.warning("Odoo auth failed for %s", self.username)
            return False
        except Exception as e:
            logger.error("Odoo auth error: %s", str(e))
            return False

    def _call(self, model: str, method: str, args: list, kwargs: dict = None) -> list:
        """Execute an XML-RPC call against the Odoo models API."""
        if kwargs is None:
            kwargs = {}
        models_proxy = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/object")
        return models_proxy.execute_kw(
            self.db, self.uid, self.api_key,
            model, method,
            args,
            kwargs
        )

    def fetch_balances(self) -> List[NormalizedAsset]:
        """Fetch Bank & Cash journal balances from Odoo."""
        journals = self._call(
            "account.journal", "search_read",
            [[["type", "in", ["bank", "cash"]]]],
            {"fields": ["id", "name", "type", "currency_id", "default_account_id"]}
        )

        assets = []
        for j in journals:
            # Get the current balance from account.move.line
            move_lines = self._call(
                "account.move.line", "read_group",
                [[["journal_id", "=", j["id"]], ["parent_state", "=", "posted"]]],
                {"fields": ["balance"], "groupby": []}
            )
            balance = move_lines[0]["balance"] if move_lines else 0.0
            currency = j.get("currency_id", [None, "INR"])
            currency_code = currency[1] if isinstance(currency, list) and len(currency) > 1 else "INR"

            assets.append(NormalizedAsset(
                external_account_id=f"odoo_journal_{j['id']}",
                name=j["name"],
                type="Cash" if j["type"] == "cash" else "Bank",
                balance=abs(balance),
                currency=currency_code,
            ))

        return assets

    def fetch_transactions(self, since: datetime) -> List[NormalizedTransaction]:
        """Fetch posted journal items since a given date."""
        since_str = since.strftime("%Y-%m-%d")
        move_lines = self._call(
            "account.move.line", "search_read",
            [[
                ["parent_state", "=", "posted"],
                ["date", ">=", since_str],
            ]],
            {"fields": ["id", "name", "debit", "credit", "date", "journal_id", "account_id"]}
        )

        transactions = []
        for ml in move_lines:
            amount = ml["debit"] - ml["credit"]
            journal_name = ml["journal_id"][1] if isinstance(ml["journal_id"], list) else "Unknown"
            transactions.append(NormalizedTransaction(
                external_txn_id=f"odoo_ml_{ml['id']}",
                description=ml.get("name") or f"Journal: {journal_name}",
                amount=amount,
                timestamp=datetime.strptime(ml["date"], "%Y-%m-%d"),
                category=journal_name,
                asset_external_id=f"odoo_journal_{ml['journal_id'][0]}" if isinstance(ml["journal_id"], list) else None,
            ))

        return transactions
