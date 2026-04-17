from pydantic import BaseModel

class userCreate(BaseModel):
    name: str
    email: str
    password: str
    company_code: str

class userLogin(BaseModel):
    email: str
    password: str

class userSimple(BaseModel):
    name: str
    email: str

class userResponse(userSimple):
    id: int

    class Config:
        orm_mode= True