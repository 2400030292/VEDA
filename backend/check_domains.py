from app.core.database import SessionLocal
from app.models.team import Domain

db = SessionLocal()
try:
    domains = db.query(Domain).all()
    print(f"Found {len(domains)} domains.")
    for d in domains:
        print(f"- {d.id} | {d.name} | {d.order}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
