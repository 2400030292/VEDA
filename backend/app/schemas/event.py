from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time, datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    venue: Optional[str] = None
    event_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    registration_open_at: Optional[datetime] = None
    registration_close_at: Optional[datetime] = None
    capacity: Optional[int] = None
    poster_url: Optional[str] = None
    status: Optional[str] = "DRAFT"

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    title: Optional[str] = None

class EventResponse(EventBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
