from app.core.database import SessionLocal, engine, Base
from app.models.admin import Admin
from app.models.event import Event
from app.core.security import get_password_hash
from app.models import * # Ensure all models are loaded

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if admin exists
admin = db.query(Admin).filter(Admin.email == "admin@kluniversity.in").first()
if not admin:
    print("Creating default admin account...")
    admin = Admin(
        name="System Admin",
        email="admin@kluniversity.in",
        password_hash=get_password_hash("password123"),
        role="admin"
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print("Admin account created! Email: admin@kluniversity.in | Password: password123")
    
# Create a sample event if none exists
event = db.query(Event).filter(Event.title == "Welcome Hackathon 2026").first()
if not event:
    print("Creating sample event...")
    event = Event(
        title="Welcome Hackathon 2026",
        description="A 24-hour hackathon for all incoming tech enthusiasts.",
        category="TECHNICAL",
        venue="Main Auditorium",
        status="PUBLISHED",
        capacity=100,
        created_by=admin.id
    )
    db.add(event)
    db.commit()
    print("Sample event created!")

db.close()
print("Database seeding complete.")
