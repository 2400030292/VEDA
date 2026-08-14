from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    file_name = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(String)
    file_size = Column(Integer)
    visibility = Column(String, default="PRIVATE") # PUBLIC or PRIVATE
    uploaded_by = Column(Integer, ForeignKey("admins.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    event = relationship("Event", back_populates="documents")
