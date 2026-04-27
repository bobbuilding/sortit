"""Registry of all supported integration providers.

This is the single source of truth for which platforms SortIT can connect to.
The frontend reads this via the /api/v1/integrations/providers endpoint to
dynamically render the Integrations Hub.
"""

PROVIDER_REGISTRY = [
    # ─── Accounting & ERP ──────────────────────────────────
    {
        "name": "odoo_cloud",
        "display_name": "Odoo (Cloud)",
        "type": "accounting",
        "auth_type": "api_key",
        "required_fields": ["url", "database", "username", "api_key"],
        "description": "Connect your Odoo SaaS ERP (e.g., https://mycompany.odoo.com) using an API Key.",
        "icon": "FileSpreadsheet",
    },
    {
        "name": "odoo_local",
        "display_name": "Odoo (Self-Hosted)",
        "type": "accounting",
        "auth_type": "password",
        "required_fields": ["url", "database", "username", "password"],
        "description": "Connect your local/self-hosted Odoo ERP (e.g., http://localhost:8069) using your password.",
        "icon": "FileSpreadsheet",
    },
    {
        "name": "tally",
        "display_name": "TallyPrime",
        "type": "accounting",
        "auth_type": "api_key",
        "required_fields": ["gateway_url", "company_name"],
        "description": "Sync your TallyPrime ledger and voucher data via the Tally Gateway.",
        "icon": "BookOpen",
    },
    {
        "name": "quickbooks",
        "display_name": "QuickBooks Online",
        "type": "accounting",
        "auth_type": "oauth2",
        "required_fields": ["client_id", "client_secret", "realm_id"],
        "description": "Connect QuickBooks Online to sync accounts, transactions, and reports.",
        "icon": "Calculator",
    },
    {
        "name": "xero",
        "display_name": "Xero",
        "type": "accounting",
        "auth_type": "oauth2",
        "required_fields": ["client_id", "client_secret"],
        "description": "Sync your Xero bank transactions, invoices, and contact ledgers.",
        "icon": "FileText",
    },
    {
        "name": "zoho_books",
        "display_name": "Zoho Books",
        "type": "accounting",
        "auth_type": "oauth2",
        "required_fields": ["client_id", "client_secret", "organization_id"],
        "description": "Connect Zoho Books to pull bank accounts, journal entries, and bills.",
        "icon": "Layers",
    },
    # ─── Payment Gateways ──────────────────────────────────
    {
        "name": "razorpay",
        "display_name": "Razorpay",
        "type": "payment_gateway",
        "auth_type": "api_key",
        "required_fields": ["key_id", "key_secret"],
        "description": "Track live settlements, refunds, and payment volumes from Razorpay.",
        "icon": "CreditCard",
    },
    {
        "name": "stripe",
        "display_name": "Stripe",
        "type": "payment_gateway",
        "auth_type": "api_key",
        "required_fields": ["api_key"],
        "description": "Sync your Stripe balance, payouts, and charge history.",
        "icon": "Zap",
    },
    {
        "name": "payu",
        "display_name": "PayU",
        "type": "payment_gateway",
        "auth_type": "api_key",
        "required_fields": ["merchant_key", "merchant_salt"],
        "description": "Pull transaction reports and settlement data from PayU.",
        "icon": "DollarSign",
    },
    {
        "name": "billdesk",
        "display_name": "BillDesk",
        "type": "payment_gateway",
        "auth_type": "api_key",
        "required_fields": ["merchant_id", "security_id", "checksum_key"],
        "description": "Fetch daily settlement reports and payment status from BillDesk.",
        "icon": "Receipt",
    },
    # ─── Banking & Aggregators ─────────────────────────────
    {
        "name": "plaid",
        "display_name": "Plaid",
        "type": "banking",
        "auth_type": "oauth2",
        "required_fields": ["client_id", "secret", "access_token"],
        "description": "Connect bank accounts globally via Plaid for real-time balance and transaction data.",
        "icon": "Landmark",
    },
    {
        "name": "setu_aa",
        "display_name": "Setu Account Aggregator",
        "type": "banking",
        "auth_type": "api_key",
        "required_fields": ["client_id", "client_secret"],
        "description": "Leverage India's Account Aggregator framework to fetch consented bank data.",
        "icon": "Shield",
    },
]


def get_provider_config(provider_name: str) -> dict | None:
    """Look up a provider's configuration by name."""
    for provider in PROVIDER_REGISTRY:
        if provider["name"] == provider_name:
            return provider
    return None


def get_providers_by_type(provider_type: str) -> list[dict]:
    """Return all providers of a given type (accounting, payment_gateway, banking)."""
    return [p for p in PROVIDER_REGISTRY if p["type"] == provider_type]
