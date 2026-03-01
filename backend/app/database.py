"""SQLAlchemy database engine and session configuration for Supabase PostgreSQL."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

# Supabase PostgreSQL connection
engine = create_engine(
    settings.database_url,
    echo=settings.database_echo,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables (dev convenience -- production uses Alembic)."""
    from app.models import database_models  # noqa: F401
    Base.metadata.create_all(bind=engine)
