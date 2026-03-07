"""
Main FastAPI application entry point.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from datetime import datetime
from app.core.config import settings
from app.core.rate_limit import limiter
from app.core.security_headers import SecurityHeadersMiddleware
from app.api import compliance, audit, storage
from app.models.schemas import HealthCheck
from app.database import init_db

logger = logging.getLogger(__name__)


# ── Lifespan (replaces deprecated @app.on_event) ────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    try:
        init_db()
        logger.info("Database initialised")
    except Exception as e:
        logger.error("Database initialization failed: %s", e)
    yield


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ── Global exception handler — sanitise error responses ──────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions and return a safe message."""
    request_id = getattr(request.state, "request_id", "unknown")
    logger.exception("Unhandled error [request_id=%s]", request_id)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal error occurred. Please try again later.",
            "request_id": request_id,
        },
    )


# ── Middleware (order matters: last added = first executed) ──────
# Security headers (runs first — sets X-Request-ID, HSTS, etc.)
app.add_middleware(SecurityHeadersMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


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
    return HealthCheck(
        status="healthy",
        version=settings.app_version,
        timestamp=datetime.now(),
        services={
            "api": "operational",
            "claude_ai": "operational" if settings.anthropic_api_key else "not_configured",
            "database": "postgresql",
        }
    )


# Include routers
app.include_router(compliance.router, prefix=settings.api_prefix)
app.include_router(audit.router, prefix=settings.api_prefix)
app.include_router(storage.router, prefix=settings.api_prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
