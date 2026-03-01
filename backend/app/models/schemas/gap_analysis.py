"""
Gap analysis schemas with PRD-exact GapControlResult structure.

Each gap control result carries traceability metadata (prompt_hash,
model_version) so that every AI-generated finding can be audited.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.schemas.common import (
    ComplianceFramework,
    ComplianceLevel,
    ControlStatus,
)


class GapControlResult(BaseModel):
    """
    PRD-exact gap control result.

    Represents a single control's compliance status as returned by the
    gap analysis engine.
    """
    control_id: str
    description: str
    status: ControlStatus = Field(
        description="compliant | partial | missing"
    )
    risk_level: str = Field(
        description="Risk level: low, medium, high, critical"
    )
    remediation: str = Field(
        description="Recommended remediation action"
    )
    traceability: str = Field(
        default="",
        description="ISO clause or annex reference for audit trail"
    )


# Keep the legacy ControlGap model for backward compatibility with
# existing service code that constructs this shape.
class ControlGap(BaseModel):
    """Individual control gap (legacy shape used by gap_analysis_service)."""
    control_id: str
    control_name: str
    current_state: str
    required_state: str
    gap_description: str
    risk_level: str
    recommendations: List[str]


class GapAnalysisRequest(BaseModel):
    """Request for gap analysis."""
    framework: ComplianceFramework
    organization_name: str
    industry: str
    current_practices: str = Field(
        ...,
        description="Description of current security/AI governance practices",
    )
    specific_controls: Optional[List[str]] = Field(
        default=None,
        description="Specific control areas to focus on",
    )


class GapAnalysisResponse(BaseModel):
    """Response for gap analysis."""
    model_config = {"protected_namespaces": ()}

    framework: ComplianceFramework
    organization_name: str
    analysis_date: datetime
    overall_compliance_level: ComplianceLevel
    total_controls: int
    compliant_controls: int
    gaps: List[ControlGap]
    gap_controls: List[GapControlResult] = Field(
        default_factory=list,
        description="PRD-format per-control results with traceability",
    )
    summary: str
    next_steps: List[str]
    prompt_hash: str = Field(
        default="",
        description="SHA-256 hash of the prompt sent to the AI model",
    )
    model_version: str = Field(
        default="",
        description="Identifier of the AI model version used",
    )
