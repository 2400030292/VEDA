import ssl
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

connect_args = {}
if "pg8000" in settings.DATABASE_URL:
    context = ssl.create_default_context()
    connect_args = {"ssl_context": context}

# If using Neon (Postgres), the driver will be pg8000
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
