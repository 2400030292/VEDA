from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import auth, events, registrations, attendance, documents, stats

app = FastAPI(title="College Club Event Management API")

import os

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
]

if os.getenv("ALLOWED_ORIGINS"):
    origins.extend(os.getenv("ALLOWED_ORIGINS").split(","))

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/")
def read_root():
    return {"message": "Welcome to the College Club Event Management API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

