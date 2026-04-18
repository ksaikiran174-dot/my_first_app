# Backend — FastAPI user API

## Local setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env: set ADMIN_COMPANY_CODE and optionally JWT_SECRET_KEY (32+ chars)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Without `DATABASE_URL`, development uses SQLite at `./local_dev.db`.

## Production environment

| Variable | Required when | Notes |
|----------|----------------|-------|
| `ENVIRONMENT=production` | Production | Enables strict JWT and `DATABASE_URL` |
| `JWT_SECRET_KEY` | `ENVIRONMENT=production` | Min 32 characters |
| `DATABASE_URL` | `ENVIRONMENT=production` | PostgreSQL URL |
| `CORS_ORIGINS` | Always | Comma-separated, e.g. `https://app.example,https://www.app.example` |
| `ADMIN_COMPANY_CODE` | When signup enabled | No default in code |
| `ENABLE_PUBLIC_SIGNUP` | Production bootstrap | Default **off** in production; set `true` once to create admin, then `false` |

OpenAPI `/docs` is **disabled in production** unless you set `ENABLE_OPENAPI_DOCS=true`.

## Rate limits (per IP)

- `POST /users/login` — 12/minute  
- `POST /users/signup` — 5/minute  
- `POST /users/` (create directory user) — 30/minute  

Adjust decorators in `app/routes/user.py` if needed.
