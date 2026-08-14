from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    event_id: Optional[int] = None
    file_name: str
    file_url: str
    file_type: str
    file_size: int
    visibility: str
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True
