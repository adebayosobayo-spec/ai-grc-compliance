"""SQLAlchemy database engine and session configuration for Supabase PostgreSQL."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import settings

# Get and clean the DATABASE_URL (strip trailing whitespace/newlines from env vars)
_db_url = settings.database_url.strip() if settings.database_url else ""

# psycopg2 uses the default "postgresql://" scheme — no dialect prefix needed.
# psycopg2 does NOT use server-side prepared statements, so it works perfectly
# with Supabase's Supavisor connection pooler (no DuplicatePreparedStatement).
engine = create_engine(
    _db_url,
    echo=settings.database_echo,
    poolclass=NullPool,  # Required for serverless (Vercel) — no idle connections
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
