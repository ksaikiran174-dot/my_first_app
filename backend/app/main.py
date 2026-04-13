from fastapi import FastAPI 
from app.routes import user
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models.user import Base
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] ,
    allow_credentials= True ,
    allow_methods= ["*"] ,
    allow_headers= ["*"]
)

app.include_router(user.router)