"""Supabase JWT authentication for FastAPI.

Two verification strategies:
1. Local HS256 verification (if SUPABASE_JWT_SECRET is set) — zero network calls.
2. Remote verification via Supabase /auth/v1/user endpoint — one network call,
   but works without the JWT secret.
"""

import logging
from dataclasses import dataclass
from typing import Optional

import jwt
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models.database_models import OrganizationProfile

logger = logging.getLogger(__name__)
_bearer = HTTPBearer(auto_error=False)


@dataclass
class CurrentUser:
    id: str
    email: str


def _verify_local(token: str) -> CurrentUser:
    """Verify JWT locally using the HS256 secret."""
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    email = payload.get("email", "")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )
    return CurrentUser(id=user_id, email=email)


def _verify_remote(token: str) -> CurrentUser:
    """Verify token by calling Supabase Auth /auth/v1/user."""
    url = settings.supabase_url_clean
    if not url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Auth not configured on server",
        )
    full_url = f"{url}/auth/v1/user"
    logger.info("Remote auth URL: %r (len=%d)", full_url, len(full_url))
    try:
        resp = httpx.get(
            full_url,
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": settings.supabase_anon_key_clean,
            },
            timeout=5,
        )
    except Exception as exc:
        logger.exception("Remote auth request failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Auth service error: {type(exc).__name__}: {exc}",
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    data = resp.json()
    user_id = data.get("id")
    email = data.get("email", "")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user",
        )
    return CurrentUser(id=user_id, email=email)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> CurrentUser:
    """Decode and validate a Supabase JWT. Returns the authenticated user.

    Uses local HS256 verification when JWT secret is available,
    falls back to Supabase remote verification otherwise.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    if settings.supabase_jwt_secret:
        return _verify_local(token)
    else:
        return _verify_remote(token)


# Optional dependency — returns None instead of 401 for public endpoints
# that can optionally benefit from knowing the user.
def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> Optional[CurrentUser]:
    if credentials is None:
        return None
    try:
        return get_current_user(credentials)
    except HTTPException:
        return None


def verify_session_ownership(
    session_id: str,
    user: CurrentUser,
    db: Session,
) -> OrganizationProfile:
    """Confirm that *session_id* belongs to *user*. Returns the DB profile.

    Migration grace: if the profile has no user_id yet, claim it for this user.
    """
    profile = (
        db.query(OrganizationProfile)
        .filter(OrganizationProfile.session_id == session_id)
        .first()
    )
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No profile found for session '{session_id}'",
        )

    # Migration: claim un-owned profiles
    if profile.user_id is None:
        profile.user_id = user.id
        db.commit()
        return profile

    if profile.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this session",
        )

    return profile
