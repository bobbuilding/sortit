from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Base
from app.core.config import settings

# For PostgreSQL, we ensure the URL uses 'postgresql://' instead of 'postgres://' (SQLAlchemy requirement)
db_url = settings.SQLALCHEMY_DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
