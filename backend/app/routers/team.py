from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.team import Domain, Member
from app.schemas import team as team_schemas
from app.routers.auth import get_current_admin

admin_router = APIRouter(prefix="/api/admin", tags=["Admin Team Management"])
public_router = APIRouter(prefix="/api/team", tags=["Public Team"])

# --- PUBLIC ROUTE ---

@public_router.get("", response_model=List[team_schemas.Domain])
def get_team(db: Session = Depends(get_db)):
    """Fetch all domains and their members for the public Team page."""
    domains = db.query(Domain).order_by(Domain.order.asc()).all()
    return domains

# --- ADMIN DOMAIN ROUTES ---

@admin_router.get("/domains", response_model=List[team_schemas.Domain])
def get_all_domains(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(Domain).order_by(Domain.order.asc()).all()

@admin_router.post("/domains", response_model=team_schemas.Domain)
def create_domain(domain: team_schemas.DomainCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_domain = Domain(**domain.dict())
    db.add(db_domain)
    try:
        db.commit()
        db.refresh(db_domain)
        return db_domain
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Domain already exists or invalid data.")

@admin_router.put("/domains/{domain_id}", response_model=team_schemas.Domain)
def update_domain(domain_id: str, domain_update: team_schemas.DomainUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not db_domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    update_data = domain_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_domain, key, value)
        
    db.commit()
    db.refresh(db_domain)
    return db_domain

@admin_router.delete("/domains/{domain_id}")
def delete_domain(domain_id: str, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_domain = db.query(Domain).filter(Domain.id == domain_id).first()
    if not db_domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    
    db.delete(db_domain)
    db.commit()
    return {"message": "Domain and all its members deleted successfully"}

# --- ADMIN MEMBER ROUTES ---

@admin_router.post("/members", response_model=team_schemas.Member)
def create_member(member: team_schemas.MemberCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_domain = db.query(Domain).filter(Domain.id == member.domain_id).first()
    if not db_domain:
        raise HTTPException(status_code=404, detail="Domain not found")
        
    db_member = Member(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@admin_router.put("/members/{member_id}", response_model=team_schemas.Member)
def update_member(member_id: str, member_update: team_schemas.MemberUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_member = db.query(Member).filter(Member.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if member_update.domain_id:
        db_domain = db.query(Domain).filter(Domain.id == member_update.domain_id).first()
        if not db_domain:
            raise HTTPException(status_code=404, detail="Domain not found")
            
    update_data = member_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_member, key, value)
        
    db.commit()
    db.refresh(db_member)
    return db_member

@admin_router.delete("/members/{member_id}")
def delete_member(member_id: str, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    db_member = db.query(Member).filter(Member.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db.delete(db_member)
    db.commit()
    return {"message": "Member deleted successfully"}
