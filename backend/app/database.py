"""SQLAlchemy database engine and session configuration for Supabase PostgreSQL."""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import settings

db_url = settings.database_url.strip() if settings.database_url else ""
if db_url and db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

# Supabase PostgreSQL connection.
# - NullPool: required for serverless (Vercel) — no persistent idle connections.
# - prepare_threshold=0 via event listener: Supabase Supavisor pooler does NOT
#   support server-side prepared statements. We disable them on every new
#   connection via the SQLAlchemy "connect" engine event.
engine = create_engine(
    db_url,
    echo=settings.database_echo,
    poolclass=NullPool,
)


@event.listens_for(engine, "connect")
def _set_prepare_threshold(dbapi_connection, connection_record):
    """Disable psycopg3 server-side prepared statements for Supabase pooler."""
    dbapi_connection.prepare_threshold = 0


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

