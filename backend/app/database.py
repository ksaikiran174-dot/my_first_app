import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
SQLALCHEMY_DATABASE_URL = (os.getenv("DATABASE_URL") or "").strip()

if not SQLALCHEMY_DATABASE_URL:
    if ENVIRONMENT == "production":
        raise RuntimeError("DATABASE_URL is required when ENVIRONMENT=production.")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./local_dev.db"

engine_kwargs: dict = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = int(os.getenv("DB_POOL_RECYCLE", "280"))

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
