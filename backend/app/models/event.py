from sqlalchemy import Column, Integer, String, Text, Date, Time, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)
    venue = Column(String)
    event_date = Column(Date)
    start_time = Column(Time)
    end_time = Column(Time)
    registration_open_at = Column(DateTime(timezone=True))
    registration_close_at = Column(DateTime(timezone=True))
    capacity = Column(Integer)
    poster_url = Column(String)
    status = Column(String, default="DRAFT")  # DRAFT, PUBLISHED, CLOSED, CANCELLED, COMPLETED
    created_by = Column(Integer, ForeignKey("admins.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="event", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="event", cascade="all, delete-orphan")
