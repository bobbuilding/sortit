import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "SortIT API"
    VERSION: str = "0.1.0"

    # ─── CORS ──────────────────────────────────────────────
    BACKEND_CORS_ORIGINS: List[str] = [
        o.strip()
        for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    ]

    # ─── Database (Supabase PostgreSQL) ────────────────────
    SQLALCHEMY_DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@db.supabase.co:5432/postgres"
    )

    # ─── External APIs ─────────────────────────────────────
    BINANCE_API_URL: str = os.getenv(
        "BINANCE_API_URL",
        "https://api.binance.com/api/v3/ticker/price"
    )

    # ─── Sync Configuration ────────────────────────────────
    SYNC_INTERVAL_SECONDS: int = int(os.getenv("SYNC_INTERVAL_SECONDS", "3600"))
    SYNC_HISTORY_DAYS: int = int(os.getenv("SYNC_HISTORY_DAYS", "90"))
    BURN_RATE_WINDOW_DAYS: int = int(os.getenv("BURN_RATE_WINDOW_DAYS", "30"))


settings = Settings()
