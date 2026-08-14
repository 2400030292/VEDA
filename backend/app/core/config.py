import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "College Club Event Management System"
    db_url: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    if db_url.startswith("postgres://") or db_url.startswith("postgresql://"):
        if "?" in db_url:
            db_url = db_url.split("?")[0]
            
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql+pg8000://", 1)
        elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+pg8000://"):
            db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)
    
    DATABASE_URL: str = db_url
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecret")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week

settings = Settings()
