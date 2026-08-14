from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.admin import Admin
from app.schemas.auth import Token, AdminResponse
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == form_data.username).first()
    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not admin.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = create_access_token(subject=admin.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AdminResponse)
def get_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin
