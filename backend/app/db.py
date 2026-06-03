"""
Database setup for Wedding Planner V1.
Uses SQLAlchemy with SQLite (initially).
"""

from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Database path: data/database/wedding_planner.db
DB_DIR = Path(__file__).parent.parent.parent / "data" / "database"
DB_DIR.mkdir(parents=True, exist_ok=True)
DATABASE_URL = f"sqlite:///{DB_DIR / 'wedding_planner.db'}"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all database tables."""
    from backend.app.models import Wedding, Event, Guest, Expense  # noqa: F401
    Base.metadata.create_all(bind=engine)