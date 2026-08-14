from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from app.core.database import get_db
from app.models.event import Event
from app.models.registration import Registration
from app.models.attendance import Attendance
from app.models.admin import Admin
from app.schemas.attendance import AttendanceScan, AttendanceBulkRequest, AttendanceResponse
from app.dependencies.auth import get_current_admin

# Admin endpoints (since only admins can scan/mark attendance)
router = APIRouter(prefix="/api/admin/events/{event_id}/attendance", tags=["attendance"])

@router.post("/bulk", response_model=dict)
def mark_bulk_attendance(
    event_id: int, 
    bulk_data: AttendanceBulkRequest, 
    db: Session = Depends(get_db), 
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Endpoint for admins to bulk mark attendance using a checklist approach.
    All registered participants NOT in the absent list will be marked as PRESENT.
    """
    # Verify event exists
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Get all registrations for this event
    all_registrations = db.query(Registration).filter(Registration.event_id == event_id).all()
    
    # Existing attendance to avoid duplicates
    existing_attendance = db.query(Attendance).filter(Attendance.event_id == event_id).all()
    existing_reg_ids = {att.registration_id for att in existing_attendance}
    
    present_count = 0
    absent_count = len(bulk_data.absent_registration_ids)
    
    new_attendances = []
    
    for reg in all_registrations:
        if reg.id not in existing_reg_ids:
            status_val = "ABSENT" if reg.id in bulk_data.absent_registration_ids else "PRESENT"
            new_att = Attendance(
                event_id=event_id,
                registration_id=reg.id,
                marked_by=current_admin.id,
                status=status_val
            )
            new_attendances.append(new_att)
            if status_val == "PRESENT":
                present_count += 1
            
    if new_attendances:
        db.add_all(new_attendances)
        db.commit()
        
    return {
        "message": "Bulk attendance processed successfully",
        "marked_present": present_count,
        "marked_absent": absent_count
    }

@router.post("/scan", response_model=AttendanceResponse)
def scan_qr_and_mark_attendance(
    event_id: int, 
    scan_data: AttendanceScan, 
    db: Session = Depends(get_db), 
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Endpoint for admins to scan a QR code and mark the participant as present.
    Payload `qr_data` is expected to be "event_id:registration_code".
    """
    qr_parts = scan_data.qr_data.split(":")
    if len(qr_parts) != 2:
        raise HTTPException(status_code=400, detail="Invalid QR code format")
        
    scanned_event_id_str, reg_code = qr_parts
    
    # 1. Verify event ID matches the QR
    if str(event_id) != scanned_event_id_str:
        raise HTTPException(status_code=400, detail="QR code belongs to a different event")
        
    # 2. Check if registration exists and belongs to this event
    registration = db.query(Registration).filter(
        Registration.registration_code == reg_code,
        Registration.event_id == event_id
    ).first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found or invalid for this event")
        
    # 3. Mark attendance
    new_attendance = Attendance(
        event_id=event_id,
        registration_id=registration.id,
        marked_by=current_admin.id,
        status="PRESENT"
    )
    
    try:
        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Attendance already marked for this participant")
        
    # Build response with nested info
    response = AttendanceResponse(
        id=new_attendance.id,
        event_id=new_attendance.event_id,
        registration_id=new_attendance.registration_id,
        marked_by=new_attendance.marked_by,
        status=new_attendance.status,
        marked_at=new_attendance.marked_at,
        registration_name=registration.name,
        registration_code=registration.registration_code
    )
    return response

@router.get("", response_model=List[AttendanceResponse])
def get_event_attendance(
    event_id: int, 
    db: Session = Depends(get_db), 
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Get all attendance records for a specific event.
    """
    attendances = db.query(Attendance).join(Registration).filter(Attendance.event_id == event_id).all()
    
    # Map to schema manually to include the joined registration name
    results = []
    for att in attendances:
        results.append(AttendanceResponse(
            id=att.id,
            event_id=att.event_id,
            registration_id=att.registration_id,
            marked_by=att.marked_by,
            status=att.status,
            marked_at=att.marked_at,
            registration_name=att.registration.name,
            registration_code=att.registration.registration_code
        ))
    return results
