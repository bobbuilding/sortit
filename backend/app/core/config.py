import os
from typing import List

class Settings:
    PROJECT_NAME: str = "SortIT API"
    VERSION: str = "0.1.0"
    
    # CORS Configurations
    # Reads from environment or defaults to local Next.js frontend
    BACKEND_CORS_ORIGINS: List[str] = [
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://127.0.0.1:3000"
    ]
    
    # External Integrations
    BINANCE_API_URL: str = os.getenv(
        "BINANCE_API_URL", 
        "https://api.binance.com/api/v3/ticker/price"
    )
    
    SQLALCHEMY_DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./sortit.db"
    )

# Instantiate a global settings object to be imported across the app
settings = Settings()
