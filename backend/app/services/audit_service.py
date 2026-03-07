"""Audit trail service — logs every significant user action."""
from typing import Any, Dict, Optional
from fastapi import Request
from sqlalchemy.orm import Session

from app.models.database_models import AuditLogEntry


def log_action(
    db: Session,
    *,
    user_id: str,
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    session_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    request: Optional[Request] = None,
) -> None:
    """Insert a single immutable audit-log row."""
    ip = None
    ua = None
    if request is not None:
        ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or request.client.host if request.client else None
        ua = (request.headers.get("user-agent") or "")[:500]

    entry = AuditLogEntry(
        user_id=user_id,
        session_id=session_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details or {},
        ip_address=ip,
        user_agent=ua,
    )
    db.add(entry)
    db.commit()
