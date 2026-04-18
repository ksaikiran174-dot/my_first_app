import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.database import engine
from app.limiter import limiter
from app.models.user import Base
from app.routes import user

Base.metadata.create_all(bind=engine)

_env = os.getenv("ENVIRONMENT", "development").lower()
_expose_docs = os.getenv(
    "ENABLE_OPENAPI_DOCS",
    "false" if _env == "production" else "true",
).lower() in ("1", "true", "yes")

app = FastAPI(
    title="User API",
    version="1.0.0",
    docs_url="/docs" if _expose_docs else None,
    redoc_url="/redoc" if _expose_docs else None,
    openapi_url="/openapi.json" if _expose_docs else None,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


def _cors_origins() -> list[str]:
    raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    )
    origins = [o.strip() for o in raw.split(",") if o.strip()]
    if not origins:
        raise RuntimeError(
            "CORS_ORIGINS must list at least one origin (comma-separated), "
            "e.g. https://your-frontend.example"
        )
    return origins


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(user.router)
