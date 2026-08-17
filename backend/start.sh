#!/bin/bash
# Start script for Render deployment

# The $PORT environment variable is provided automatically by Render
# If it's not set, fallback to 10000
export PORT=${PORT:-10000}

echo "Starting Uvicorn server on port $PORT..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT
