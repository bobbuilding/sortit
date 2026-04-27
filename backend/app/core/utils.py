"""Shared utility functions used across the application."""

import urllib.request
import json
import logging
from datetime import datetime, timezone
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


def fetch_external_json(url: str, timeout: int = 5) -> Optional[dict]:
    """Make a GET request to an external URL and return parsed JSON.
    
    Used by crypto price fetcher, and can be reused by any connector
    that needs a simple HTTP GET.
    """
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "SortIT/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        logger.warning("External fetch failed for %s: %s", url, str(e))
        return None


def fetch_crypto_price(symbol: str) -> float:
    """Fetch the current USDT price for a given crypto symbol from Binance."""
    url = f"{settings.BINANCE_API_URL}?symbol={symbol}USDT"
    data = fetch_external_json(url)
    if data and "price" in data:
        return float(data["price"])
    return 0.0


def utc_now() -> datetime:
    """Return the current UTC datetime (timezone-aware)."""
    return datetime.now(timezone.utc)


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Safely divide two numbers, returning default on zero denominator."""
    if denominator == 0:
        return default
    return numerator / denominator
