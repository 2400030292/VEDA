from app.core.database import engine, Base
from app.models.team import Domain, Member
from app.models.admin import Admin
from app.models.event import Event
from app.models.registration import Registration
from app.models.attendance import Attendance
from app.models.document import Document

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
