from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    registration_id = Column(Integer, ForeignKey("registrations.id"), nullable=False)
    marked_by = Column(Integer, ForeignKey("admins.id"), nullable=False)
    status = Column(String, default="PRESENT")
    marked_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints to prevent duplicate attendance
    __table_args__ = (
        UniqueConstraint('event_id', 'registration_id', name='uq_event_registration_attendance'),
    )

    event = relationship("Event", back_populates="attendances")
    registration = relationship("Registration", back_populates="attendance")
