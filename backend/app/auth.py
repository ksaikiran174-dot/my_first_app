import logging
import os
from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def _load_secret_key() -> str:
    key = (os.getenv("JWT_SECRET_KEY") or "").strip()
    if ENVIRONMENT == "production":
        if len(key) < 32:
            raise RuntimeError(
                "Production requires JWT_SECRET_KEY with at least 32 characters."
            )
        return key
    if len(key) >= 32:
        return key
    dev_key = "local-dev-only-not-for-production-use-32+"
    logger.warning(
        "JWT_SECRET_KEY missing or short; using insecure development default. "
        "Set JWT_SECRET_KEY in backend/.env."
    )
    return dev_key


SECRET_KEY = _load_secret_key()


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    if not hashed or not str(hashed).strip():
        return False
    return pwd_context.verify(plain, hashed)
