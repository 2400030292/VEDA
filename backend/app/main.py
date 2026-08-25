from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import auth, events, registrations, attendance, documents, stats, team
from app.core.database import engine
from app.models import Base

app = FastAPI(title="College Club Event Management API")

# Auto-create tables (will create new team tables)
Base.metadata.create_all(bind=engine)


import os

from fastapi.responses import JSONResponse
from fastapi import Request
import traceback

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://kl-veda.vercel.app"
]

if os.getenv("ALLOWED_ORIGINS"):
    origins.extend(os.getenv("ALLOWED_ORIGINS").split(","))

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"FATAL ERROR: {exc}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
        headers={"Access-Control-Allow-Origin": request.headers.get("origin", "*"), "Access-Control-Allow-Credentials": "true"}
    )

os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(events.admin_router)
app.include_router(registrations.router)
app.include_router(registrations.admin_router)
app.include_router(attendance.router)
app.include_router(documents.admin_router)
app.include_router(documents.public_router)
app.include_router(stats.router)
app.include_router(team.admin_router)
app.include_router(team.public_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the College Club Event Management API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

