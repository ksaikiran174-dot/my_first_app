from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import userCreate ,userLogin, userResponse, userSimple
from app.dependencies import get_db, get_current_user
from passlib.context import CryptContext
from app.auth import pwd_context , create_access_token , hash_password

router= APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=userResponse)
async def create_user(user: userSimple, db: Session = Depends(get_db)):
    new_user= User(name= user.name, email= user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/", response_model= list[userResponse])
async def get_users(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(User).all()

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user: 
        return {"error": "User not found"}
    
    db.delete(user)
    db.commit()

    return {"message": "User deleted!"}

@router.patch("/{user_id}")
def update_user(user_id: int, user: userSimple, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.id == user_id).first()

    if not existing_user:
        return {"error": "User not found"}

    existing_user.name = user.name
    existing_user.email = user.email

    db.commit()
    db.refresh(existing_user)

    return existing_user

@router.post("/signup")
def signup(user: userCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created"}

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

@router.post("/login")
def login(user: userLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}

    token = create_access_token({"sub": db_user.email})

    return {"access_token": token}