"""SQLAlchemy database engine and session configuration for Supabase PostgreSQL."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import settings

db_url = settings.database_url.strip() if settings.database_url else ""
if db_url and db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

# Supabase PostgreSQL connection.
# - NullPool: required for serverless (Vercel) — no persistent idle connections.
# - prepare_threshold=0: Supabase Supavisor pooler does not support server-side
#   prepared statements. Disabling them prevents psycopg3 from hanging.
engine = create_engine(
    db_url,
    echo=settings.database_echo,
    poolclass=NullPool,
    connect_args={"prepare_threshold": 0},
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
