from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from app.core.database import get_db
from app.models.event import Event
from app.models.registration import Registration
from app.models.attendance import Attendance
from app.models.admin import Admin
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/api/admin/stats", tags=["admin_stats"])

class DashboardStats(BaseModel):
    total_events: int
    published_events: int
    total_registrations: int
    total_attendances: int
    attendance_rate: float

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    total_events = db.query(Event).count()
    published_events = db.query(Event).filter(Event.status == "PUBLISHED").count()
    
    total_registrations = db.query(Registration).count()
    total_attendances = db.query(Attendance).count()
    
    attendance_rate = 0.0
    if total_registrations > 0:
        attendance_rate = round((total_attendances / total_registrations) * 100, 2)
        
    return DashboardStats(
        total_events=total_events,
        published_events=published_events,
        total_registrations=total_registrations,
        total_attendances=total_attendances,
        attendance_rate=attendance_rate
    )
