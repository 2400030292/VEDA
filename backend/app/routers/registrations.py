import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.event import Event
from app.models.registration import Registration
from app.models.admin import Admin
from app.schemas.registration import RegistrationCreate, RegistrationResponse, RegistrationSuccessResponse
from app.dependencies.auth import get_current_admin

# Public endpoints
router = APIRouter(prefix="/api/events/{event_id}/register", tags=["registrations"])

# Admin endpoints
admin_router = APIRouter(prefix="/api/admin", tags=["admin_registrations"])

def generate_registration_code():
    chars = string.ascii_uppercase + string.digits
    random_str = ''.join(random.choice(chars) for _ in range(8))
    return f"EVT-{random_str}"

@router.post("", response_model=RegistrationSuccessResponse)
def register_for_event(event_id: int, reg_data: RegistrationCreate, db: Session = Depends(get_db)):
    # 1. Check event exists and is published
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.status != "PUBLISHED":
        raise HTTPException(status_code=400, detail="Registration is not open for this event")
        
    # 2. Check registration deadline
    now = datetime.now()
    if event.registration_open_at and event.registration_open_at > now:
        raise HTTPException(status_code=400, detail="Registration has not opened yet")
    if event.registration_close_at and event.registration_close_at < now:
        raise HTTPException(status_code=400, detail="Registration is closed")
        
    # 3. Check capacity
    if event.capacity:
        current_registrations = db.query(Registration).filter(Registration.event_id == event_id).count()
        if current_registrations >= event.capacity:
            raise HTTPException(status_code=400, detail="Event capacity reached")
            
    # 4. Generate unique registration code
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    reg_code = f"EVT-{code}"
    
    roll_num = reg_data.email.split('@')[0]
    
    new_reg = Registration(
        **reg_data.model_dump(),
        event_id=event_id,
        registration_code=reg_code,
        roll_number=roll_num
    )
    
    try:
        db.add(new_reg)
        db.commit()
        db.refresh(new_reg)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="You are already registered for this event")
        
    # Trigger confirmation email
    from app.core.qr import generate_qr_code_base64
    from app.core.email import send_registration_email
    
    qr_data = f"{event_id}:{code}" # Simple payload, can be encrypted
    qr_base64 = generate_qr_code_base64(qr_data)
    
    send_registration_email(
        to_email=new_reg.email,
        name=new_reg.name,
        event_title=event.title,
        qr_code_base64=qr_base64,
        registration_code=code
    )
    
    return {
        "registration": new_reg,
        "qr_code": qr_base64
    }

@admin_router.get("/events/{event_id}/registrations", response_model=List[RegistrationResponse])
def get_event_registrations(event_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    registrations = db.query(Registration).filter(Registration.event_id == event_id).all()
    return registrations

@admin_router.get("/registrations/{registration_id}", response_model=RegistrationResponse)
def get_registration(registration_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    reg = db.query(Registration).filter(Registration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    return reg
