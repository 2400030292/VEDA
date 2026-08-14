from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    registration_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    roll_number = Column(String)
    department = Column(String)
    year = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Constraints to prevent duplicate registrations for the same event
    __table_args__ = (
        UniqueConstraint('event_id', 'email', name='uq_event_email'),
        UniqueConstraint('event_id', 'roll_number', name='uq_event_roll_number'),
    )

    event = relationship("Event", back_populates="registrations")
    attendance = relationship("Attendance", back_populates="registration", uselist=False)

    @property
    def attendance_status(self):
        return self.attendance.status if self.attendance else None
