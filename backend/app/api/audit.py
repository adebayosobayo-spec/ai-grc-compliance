"""Audit log API — read-only, paginated, filterable."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.core.auth import CurrentUser, get_current_user
from app.models.database_models import AuditLogEntry
from app.models.schemas.audit import AuditLogOut, AuditLogPage

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/logs", response_model=AuditLogPage)
async def list_audit_logs(
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Return paginated audit logs for the authenticated user."""
    q = db.query(AuditLogEntry).filter(AuditLogEntry.user_id == user.id)

    if action:
        q = q.filter(AuditLogEntry.action == action)
    if resource_type:
        q = q.filter(AuditLogEntry.resource_type == resource_type)

    total = q.count()
    items = (
        q.order_by(desc(AuditLogEntry.created_at))
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return AuditLogPage(
        items=[AuditLogOut(id=str(i.id), **{
            k: getattr(i, k) for k in ("user_id", "session_id", "action", "resource_type", "resource_id", "details", "ip_address", "created_at")
        }) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        has_more=(page * page_size) < total,
    )
