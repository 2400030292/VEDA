from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
import re

class RegistrationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None

    @validator('email')
    def validate_kl_email(cls, v):
        if not re.match(r'^\d{10}@kluniversity\.in$', v):
            raise ValueError('Email must be a valid KL University ID (10 digits followed by @kluniversity.in)')
        return v

class RegistrationResponse(BaseModel):
    id: int
    event_id: int
    registration_code: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    roll_number: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    created_at: datetime
    attendance_status: Optional[str] = None

    class Config:
        from_attributes = True

class RegistrationSuccessResponse(BaseModel):
    registration: RegistrationResponse
    qr_code: str
