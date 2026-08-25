from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Domain(Base):
    __tablename__ = "domains"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    members = relationship("Member", back_populates="domain", cascade="all, delete-orphan", order_by="Member.name")

class Member(Base):
    __tablename__ = "members"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    domain_id = Column(String, ForeignKey("domains.id"), nullable=False)
    name = Column(String, nullable=False)
    student_id = Column(String, nullable=False)
    role = Column(String, nullable=True) # e.g., "Lead", "Core Member"
    profile_image_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    domain = relationship("Domain", back_populates="members")
