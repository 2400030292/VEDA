from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: str = None

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True
