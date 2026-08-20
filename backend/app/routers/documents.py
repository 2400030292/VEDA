import os
import shutil
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.document import Document
from app.models.admin import Admin
from app.schemas.document import DocumentResponse
from app.dependencies.auth import get_current_admin

# Admin endpoints
admin_router = APIRouter(prefix="/api/admin/documents", tags=["admin_documents"])

# Public endpoints
public_router = APIRouter(prefix="/api/documents", tags=["documents"])

@public_router.get("", response_model=List[DocumentResponse])
def list_public_documents(
    event_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Fetch all PUBLIC documents for students to view/download.
    """
    query = db.query(Document).filter(Document.visibility == "PUBLIC")
    if event_id:
        query = query.filter(Document.event_id == event_id)
    return query.all()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@admin_router.post("/upload", response_model=DocumentResponse)
def upload_document(
    file: Optional[UploadFile] = File(None),
    external_url: Optional[str] = Form(None),
    file_name: Optional[str] = Form(None),
    event_id: Optional[int] = Form(None),
    visibility: str = Form("PRIVATE"),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Upload a new document (e.g., event poster, pdf material) or external link.
    """
    if not file and not external_url:
        raise HTTPException(status_code=400, detail="Must provide either a file or an external URL")
        
    if external_url:
        if not file_name:
            raise HTTPException(status_code=400, detail="File name is required for external URLs")
            
        new_doc = Document(
            event_id=event_id,
            file_name=file_name,
            file_url=external_url,
            file_type="external/link",
            file_size=0,
            visibility=visibility,
            uploaded_by=current_admin.id
        )
    else:
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = os.path.getsize(file_path)
        file_url = f"/static/uploads/{unique_filename}"  # assuming we mount static route in main.py
        
        new_doc = Document(
            event_id=event_id,
            file_name=file.filename,
            file_url=file_url,
            file_type=file.content_type,
            file_size=file_size,
            visibility=visibility,
            uploaded_by=current_admin.id
        )

    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    return new_doc

@admin_router.get("", response_model=List[DocumentResponse])
def list_documents(
    event_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    query = db.query(Document)
    if event_id:
        query = query.filter(Document.event_id == event_id)
    return query.all()

@admin_router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Attempt to delete local file if not external link
    if doc.file_type != "external/link":
        filename = doc.file_url.split("/")[-1]
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
        
    db.delete(doc)
    db.commit()
    return None
