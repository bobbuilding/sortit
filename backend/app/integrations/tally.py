"""TallyPrime connector — uses Tally's XML Gateway (HTTP + TDSL)."""

import logging
from datetime import datetime
from typing import List
from xml.etree import ElementTree

from app.core.utils import fetch_external_json
from app.integrations.base import BaseConnector, NormalizedAsset, NormalizedTransaction

logger = logging.getLogger(__name__)


class TallyConnector(BaseConnector):
    """Connects to TallyPrime via its local HTTP XML Gateway."""

    def __init__(self, credentials: dict):
        super().__init__(credentials)
        self.gateway_url = credentials["gateway_url"]
        self.company_name = credentials["company_name"]

    def _send_tdsl(self, xml_payload: str) -> ElementTree.Element | None:
        """Send a TDSL XML request to the Tally Gateway and parse the response."""
        import urllib.request
        try:
            req = urllib.request.Request(
                self.gateway_url,
                data=xml_payload.encode("utf-8"),
                headers={"Content-Type": "application/xml"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                return ElementTree.fromstring(resp.read().decode("utf-8"))
        except Exception as e:
            logger.error("Tally gateway error: %s", str(e))
            return None

    def authenticate(self) -> bool:
        """Verify Tally gateway is reachable and the company exists."""
        xml = f"""
        <ENVELOPE>
            <HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER>
            <BODY>
                <EXPORTDATA><REQUESTDESC>
                    <REPORTNAME>List of Companies</REPORTNAME>
                </REQUESTDESC></EXPORTDATA>
            </BODY>
        </ENVELOPE>
        """
        root = self._send_tdsl(xml.strip())
        if root is None:
            return False

        companies = [el.text for el in root.iter("SMPCOMPANYNAME") if el.text]
        if self.company_name in companies:
            logger.info("Tally auth success for company: %s", self.company_name)
            return True

        logger.warning("Company '%s' not found in Tally. Available: %s", self.company_name, companies)
        return False

    def fetch_balances(self) -> List[NormalizedAsset]:
        """Fetch ledger balances (Bank & Cash groups) from Tally."""
        xml = f"""
        <ENVELOPE>
            <HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER>
            <BODY>
                <EXPORTDATA><REQUESTDESC>
                    <STATICVARIABLES>
                        <SVCURRENTCOMPANY>{self.company_name}</SVCURRENTCOMPANY>
                    </STATICVARIABLES>
                    <REPORTNAME>Balance Sheet</REPORTNAME>
                </REQUESTDESC></EXPORTDATA>
            </BODY>
        </ENVELOPE>
        """
        root = self._send_tdsl(xml.strip())
        if root is None:
            return []

        assets = []
        for ledger in root.iter("DSPACCNAME"):
            name = ledger.text
            # Find the corresponding closing balance
            parent = ledger.getparent() if hasattr(ledger, "getparent") else None
            balance = 0.0
            if parent is not None:
                bal_el = parent.find("DSPCLAMT")
                if bal_el is not None and bal_el.text:
                    try:
                        balance = abs(float(bal_el.text.replace(",", "")))
                    except ValueError:
                        balance = 0.0

            if name:
                assets.append(NormalizedAsset(
                    external_account_id=f"tally_{name.replace(' ', '_').lower()}",
                    name=name,
                    type="Cash",
                    balance=balance,
                    currency="INR",
                ))

        return assets

    def fetch_transactions(self, since: datetime) -> List[NormalizedTransaction]:
        """Fetch voucher (transaction) data from Tally since a given date."""
        since_str = since.strftime("%Y%m%d")
        xml = f"""
        <ENVELOPE>
            <HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER>
            <BODY>
                <EXPORTDATA><REQUESTDESC>
                    <STATICVARIABLES>
                        <SVCURRENTCOMPANY>{self.company_name}</SVCURRENTCOMPANY>
                        <SVFROMDATE>{since_str}</SVFROMDATE>
                    </STATICVARIABLES>
                    <REPORTNAME>Day Book</REPORTNAME>
                </REQUESTDESC></EXPORTDATA>
            </BODY>
        </ENVELOPE>
        """
        root = self._send_tdsl(xml.strip())
        if root is None:
            return []

        transactions = []
        for voucher in root.iter("VOUCHER"):
            vch_date = voucher.findtext("DATE", "")
            vch_type = voucher.findtext("VOUCHERTYPENAME", "")
            narration = voucher.findtext("NARRATION", "")
            amount_text = voucher.findtext("AMOUNT", "0")

            try:
                amount = float(amount_text.replace(",", ""))
            except ValueError:
                amount = 0.0

            try:
                timestamp = datetime.strptime(vch_date, "%Y%m%d")
            except ValueError:
                timestamp = datetime.utcnow()

            vch_number = voucher.findtext("VOUCHERNUMBER", "")
            transactions.append(NormalizedTransaction(
                external_txn_id=f"tally_vch_{vch_number}_{vch_date}",
                description=narration or f"{vch_type} Voucher",
                amount=amount,
                timestamp=timestamp,
                category=vch_type,
            ))

        return transactions
