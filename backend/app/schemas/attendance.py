from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttendanceScan(BaseModel):
    qr_data: str # Format: "event_id:registration_code"

class AttendanceBulkRequest(BaseModel):
    absent_registration_ids: list[int]

class AttendanceResponse(BaseModel):
    id: int
    event_id: int
    registration_id: int
    marked_by: int
    status: str
    marked_at: datetime
    
    # Nested registration info for the frontend to show who checked in
    registration_name: Optional[str] = None
    registration_code: Optional[str] = None

    class Config:
        from_attributes = True
