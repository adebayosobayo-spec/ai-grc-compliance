"""
Remediation action plan schemas.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.models.schemas.common import ComplianceFramework


class ActionItem(BaseModel):
    """Individual remediation action item."""
    action_id: str
    title: str
    description: str
    responsible_party: str
    priority: str = Field(description="low | medium | high | critical")
    estimated_effort: str
    timeline: str
    dependencies: List[str] = []
    success_criteria: str
    resources_required: List[str] = []


class ActionPlanRequest(BaseModel):
    """Request for remediation action plan."""
    framework: ComplianceFramework
    organization_name: str
    gaps: List[str] = Field(
        ...,
        description="List of identified compliance gaps",
    )
    priority: str = Field(
        default="high",
        description="Priority level: low, medium, high, critical",
    )
    timeline: Optional[str] = Field(
        default=None,
        description="Desired timeline for remediation",
    )


class ActionPlanResponse(BaseModel):
    """Response for action plan generation."""
    framework: ComplianceFramework
    organization_name: str
    plan_date: datetime
    priority: str
    total_actions: int
    estimated_completion: str
    actions: List[ActionItem]
    milestones: List[Dict[str, Any]] = []
    budget_estimate: Optional[str] = None
