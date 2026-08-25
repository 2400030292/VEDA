from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MemberBase(BaseModel):
    name: str
    student_id: str
    role: Optional[str] = None
    profile_image_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class MemberCreate(MemberBase):
    domain_id: str

class MemberUpdate(BaseModel):
    domain_id: Optional[str] = None
    name: Optional[str] = None
    student_id: Optional[str] = None
    role: Optional[str] = None
    profile_image_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class Member(MemberBase):
    id: str
    domain_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class DomainBase(BaseModel):
    name: str
    order: Optional[int] = 0

class DomainCreate(DomainBase):
    pass

class DomainUpdate(BaseModel):
    name: Optional[str] = None
    order: Optional[int] = None

class Domain(DomainBase):
    id: str
    created_at: datetime
    members: List[Member] = []

    class Config:
        from_attributes = True
