"""
FastAPI application entry point for Wedding Planner V1.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.db import init_db
from backend.app.routers import weddings, guests, expenses, summary

app = FastAPI(
    title="Wedding Planner API",
    description="Simple Wedding Planner V1 - Manage weddings, events, guests, and expenses.",
    version="1.0.0",
)

# CORS middleware for Flutter app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(weddings.router, tags=["Weddings & Events"])
app.include_router(guests.router, tags=["Guests"])
app.include_router(expenses.router, tags=["Expenses"])
app.include_router(summary.router, tags=["Summary"])


@app.on_event("startup")
def on_startup():
    """Initialize database tables on startup."""
    init_db()


@app.get("/", tags=["Health"])
def root():
    return {"message": "Wedding Planner API is running", "version": "1.0.0"}