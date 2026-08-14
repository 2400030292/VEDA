from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.event import Event
from app.models.admin import Admin
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.dependencies.auth import get_current_admin

# Router for public event endpoints
router = APIRouter(prefix="/api/events", tags=["events"])

# Router for admin event endpoints
admin_router = APIRouter(prefix="/api/admin/events", tags=["admin_events"])

# PUBLIC ENDPOINTS
@router.get("", response_model=List[EventResponse])
def get_published_events(db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.status == "PUBLISHED").all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# ADMIN ENDPOINTS
@admin_router.get("", response_model=List[EventResponse])
def get_all_events(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    events = db.query(Event).all()
    return events

@admin_router.post("", response_model=EventResponse)
def create_event(event_data: EventCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    new_event = Event(**event_data.model_dump(), created_by=current_admin.id)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@admin_router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event_data: EventUpdate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
        
    db.commit()
    db.refresh(event)
    return event

@admin_router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return None

@admin_router.post("/{event_id}/publish", response_model=EventResponse)
def publish_event(event_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.status = "PUBLISHED"
    db.commit()
    db.refresh(event)
    return event

@admin_router.post("/{event_id}/close", response_model=EventResponse)
def close_event(event_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.status = "CLOSED"
    db.commit()
    db.refresh(event)
    return event
