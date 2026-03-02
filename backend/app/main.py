"""
Main FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.core.config import settings
from app.api import compliance
from app.models.schemas import HealthCheck
from app.database import init_db

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Initialize database on startup (legacy event handler for Vercel compatibility)."""
    try:
        init_db()
    except Exception as e:
        print(f"Database initialization failed: {e}")

# Routes
@app.get("/")
async def root():
    return {
        "message": "Welcome to COMPLAI API",
        "docs": f"{settings.api_prefix}/docs"
    }

@app.get(f"{settings.api_prefix}/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint."""
    import os
    db_url = settings.database_url
    env_db_url = os.environ.get("DATABASE_URL", "not_set")

    return HealthCheck(
        status="healthy",
        version=settings.app_version,
        timestamp=datetime.now(),
        services={
            "api": "operational",
            "claude_ai": "operational" if settings.anthropic_api_key else "not_configured",
            "database": "postgresql",
            "env_db_url_status": "present" if env_db_url != "not_set" else "missing",
            "database_host": db_url.split("@")[-1].split("/")[0] if "@" in db_url else "local",
        }
    )

@app.get(f"{settings.api_prefix}/debug")
async def debug_db():
    """Debug endpoint to test DB connection and check prepare_threshold."""
    import os
    from app.database import engine, _raw_url
    try:
        with engine.connect() as conn:
            raw_conn = conn.connection.dbapi_connection
            pt = getattr(raw_conn, 'prepare_threshold', 'N/A')
            result = conn.execute(__import__('sqlalchemy').text('SELECT 1')).fetchone()
            return {
                "db_ok": True,
                "prepare_threshold": pt,
                "query_result": str(result),
                "raw_url_repr": repr(_raw_url[:30]) + "...",
                "env_url_repr": repr(os.environ.get("DATABASE_URL", "")[:30]) + "...",
            }
    except Exception as e:
        return {"db_ok": False, "error": str(e)}

# Include routers
app.include_router(compliance.router, prefix=settings.api_prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
