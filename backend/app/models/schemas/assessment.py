"""
Compliance assessment schemas.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.schemas.common import (
    AssessmentStatus,
    ComplianceFramework,
    ComplianceLevel,
)


class AssessmentResult(BaseModel):
    """Assessment result for a single control."""
    control_id: str
    control_name: str
    control_description: str
    assessment_status: AssessmentStatus = AssessmentStatus.COMPLETED
    compliance_level: ComplianceLevel
    findings: str
    evidence_reviewed: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    recommendations: List[str] = []
    score: float = Field(..., ge=0, le=100, description="Compliance score 0-100")


class AssessmentRequest(BaseModel):
    """Request for compliance assessment."""
    framework: ComplianceFramework
    organization_name: str
    control_id: str = Field(
        ...,
        description="Specific control ID to assess (e.g., 'A.5.1', 'AI.3.2')",
    )
    evidence: Optional[str] = Field(
        default=None,
        description="Evidence or documentation of existing controls",
    )


class AssessmentResponse(BaseModel):
    """Response for compliance assessment."""
    framework: ComplianceFramework
    organization_name: str
    assessment_date: datetime
    result: AssessmentResult
