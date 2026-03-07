"""Pydantic schemas for the audit trail."""
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class AuditLogOut(BaseModel):
    id: str
    user_id: str
    session_id: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Dict[str, Any] = {}
    ip_address: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AuditLogPage(BaseModel):
    items: List[AuditLogOut]
    total: int
    page: int
    page_size: int
    has_more: bool
