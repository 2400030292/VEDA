import sys
import getpass
from app.core.database import SessionLocal, engine, Base
from app.models.admin import Admin
from app.core.security import get_password_hash
from app.models import *

def create_admin():
    print("=== VEDA Admin Creation Tool ===")
    name = input("Enter admin name: ")
    email = input("Enter admin email: ")
    password = getpass.getpass("Enter admin password: ")
    
    db = SessionLocal()
    
    # Check if exists
    existing = db.query(Admin).filter(Admin.email == email).first()
    if existing:
        print(f"\nError: An admin with email {email} already exists!")
        db.close()
        return

    # Create new admin
    new_admin = Admin(
        name=name,
        email=email,
        password_hash=get_password_hash(password),
        role="admin"
    )
    
    db.add(new_admin)
    db.commit()
    print(f"\nSuccess! Admin account '{email}' has been created.")
    print("You can now log in using these credentials.")
    db.close()

if __name__ == "__main__":
    create_admin()
