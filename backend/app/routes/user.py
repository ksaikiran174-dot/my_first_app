import os
from sqlalchemy import or_
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, verify_password
from app.dependencies import get_db, get_current_user
from app.limiter import limiter
from app.models.user import User
from app.schemas.user import userCreate, userLogin, userResponse, userSimple

router = APIRouter(prefix="/users", tags=["Users"])

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()


def _signup_enabled() -> bool:
    raw = (os.getenv("ENABLE_PUBLIC_SIGNUP") or "").strip().lower()
    if raw in ("1", "true", "yes"):
        return True
    if raw in ("0", "false", "no"):
        return False
    return ENVIRONMENT != "production"


def _admin_company_code() -> str | None:
    code = (os.getenv("ADMIN_COMPANY_CODE") or "").strip()
    return code or None


@router.post("/", response_model=userResponse)
@limiter.limit("30/minute")
async def create_user(
    request: Request,
    user: userSimple,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
        )

    new_user = User(name=user.name, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/", response_model=list[userResponse])
async def get_users(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return (
        db.query(User)
        .filter(or_(User.password.is_(None), User.password == ""))
        .all()
    )


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted!"}


@router.patch("/{user_id}")
def update_user(
    user_id: int,
    user: userSimple,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing_user = db.query(User).filter(User.id == user_id).first()

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    email_owner = db.query(User).filter(User.email == user.email).first()
    if email_owner and email_owner.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
        )

    existing_user.name = user.name
    existing_user.email = user.email

    db.commit()
    db.refresh(existing_user)

    return existing_user


@router.post("/signup")
@limiter.limit("5/minute")
def signup(request: Request, user: userCreate, db: Session = Depends(get_db)):
    if not _signup_enabled():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Not found"
        )

    expected_code = _admin_company_code()
    if not expected_code:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Registration is not available",
        )
    if user.company_code != expected_code:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid company code"
        )

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
        )

    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created"}


@router.post("/login")
@limiter.limit("12/minute")
def login(request: Request, user: userLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    stored = db_user.password
    if not stored or not str(stored).strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    if not verify_password(user.password, stored):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    token = create_access_token({"sub": db_user.email})

    return {"access_token": token, "token_type": "bearer"}
