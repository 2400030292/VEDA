import sys
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.event import Event
from app.models.admin import Admin
from datetime import datetime, date, time

def seed_events():
    db = SessionLocal()
    admin = db.query(Admin).first()
    if not admin:
        print("No admin found. Please run seed.py first.")
        return
        
    events_data = [
        {
            "title": "VEDA Core Recruitment",
            "description": "Join the central hub for VLSI & Embedded systems. Showcase your skills to become part of the core team.",
            "category": "TECHNICAL",
            "venue": "C-Block, Lab 3",
            "event_date": date(2026, 8, 22),
            "start_time": time(10, 0),
            "status": "PUBLISHED",
            "created_by": admin.id,
            "poster_url": "https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"
        },
        {
            "title": "IoTRIX Smart Campus Hackathon",
            "description": "A 48-hour challenge to build connected solutions for a smarter, more sustainable university campus.",
            "category": "TECHNICAL",
            "venue": "Main Auditorium",
            "event_date": date(2026, 8, 25),
            "start_time": time(9, 0),
            "status": "PUBLISHED",
            "created_by": admin.id,
            "poster_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCWra7o7JWN5fD4A9hvZyUCAOVmQnU1oPV2QEEvvfQ_m9JNoGBfxqN93RVtqiBX8HogiBQemU1S_iH1c8TQpAdq8MsHzvXV2SNNdr6suXOuvD27wVVcG0Qj7iArfEjTezgKW9C2dVXDwMqu8Q05vNgVvh9K8hf_BdRxkgJsayIP6YRlmkt9INuwFEr3S8JAaSxw8I61iS-rS3mqvvv20LR6lEyQ39LxGfGd7WKXo4qkrn6biFyY3ZkpwgNrVMZ2HwySKA"
        }
    ]

    for ed in events_data:
        e = Event(**ed)
        db.add(e)
        
    db.commit()
    print("Extra events seeded into the database successfully!")
    db.close()

if __name__ == "__main__":
    seed_events()
