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
    db_type = "sqlite" if "sqlite" in settings.database_url else "postgresql"
    return HealthCheck(
        status="healthy",
        version=settings.app_version,
        timestamp=datetime.now(),
        services={
            "api": "operational",
            "claude_ai": "operational" if settings.anthropic_api_key else "not_configured",
            "database": db_type,
            "database_url_obscured": settings.database_url.split("@")[-1] if "@" in settings.database_url else settings.database_url
        }
    )

# Include routers
app.include_router(compliance.router, prefix=settings.api_prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
