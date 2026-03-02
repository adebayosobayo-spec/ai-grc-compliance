"""SQLAlchemy database engine and session configuration for Supabase PostgreSQL."""

import psycopg
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import settings

_raw_url = settings.database_url.strip() if settings.database_url else ""

# For SQLAlchemy dialect prefix (used only in create_engine URL)
_sa_url = _raw_url
if _sa_url and _sa_url.startswith("postgresql://"):
    _sa_url = _sa_url.replace("postgresql://", "postgresql+psycopg://", 1)


def _psycopg_creator():
    """
    Create a raw psycopg3 connection with prepare_threshold=0.
    Supabase Supavisor does NOT support server-side prepared statements,
    so we must disable them on every connection.
    """
    return psycopg.connect(_raw_url, prepare_threshold=0)


# Supabase PostgreSQL connection.
# - NullPool: required for serverless (Vercel) — no persistent idle connections.
# - creator: bypasses SQLAlchemy's connection parameter forwarding to guarantee
#   prepare_threshold=0 is set on every psycopg3 connection.
engine = create_engine(
    _sa_url,
    echo=settings.database_echo,
    poolclass=NullPool,
    creator=_psycopg_creator,
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
    """Create all tables (dev convenience — production uses Alembic)."""
    from app.models import database_models  # noqa: F401
    Base.metadata.create_all(bind=engine)
