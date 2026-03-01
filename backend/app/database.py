"""SQLAlchemy database engine and session configuration for PostgreSQL."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

if settings.database_url.startswith("sqlite"):
    # SQLite does not support pool_size/max_overflow in simple use
    engine = create_engine(
        settings.database_url,
        echo=settings.database_echo,
        connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
    )
else:
    engine = create_engine(
        settings.database_url,
        echo=settings.database_echo,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
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
