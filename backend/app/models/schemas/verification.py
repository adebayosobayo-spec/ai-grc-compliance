"""
Policy document verification schemas.

Provides both the PRD-level summary output (status pass|fail, issues list,
missing_clauses list) and the detailed per-check results for UI display.
"""
from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

from app.models.schemas.common import ComplianceFramework


class VerificationCheck(BaseModel):
    """
    Result of a single verification check (structural or semantic).

    Used by the UI to render a detailed checklist of pass/fail items.
    """
    check_id: str
    check_name: str
    description: str
    type: str = Field(description="structural | semantic")
    passed: bool
    details: str


class VerificationRequest(BaseModel):
    """Request to verify a generated policy document."""
    framework: ComplianceFramework
    organization_name: str
    policy_type: str
    policy_content: str = Field(
        ...,
        description="Full Markdown content of the policy",
    )


class VerificationSummary(BaseModel):
    """
    PRD-level verification output.

    Maps to the PRD specification:
      - status: pass | fail
      - issues: list of issue descriptions
      - missing_clauses: list of missing ISO clause references
    """
    status: str = Field(description="pass | fail")
    issues: List[str] = []
    missing_clauses: List[str] = []


class VerificationResponse(BaseModel):
    """Full document verification result."""
    organization_name: str
    framework: ComplianceFramework
    policy_type: str
    verification_date: datetime
    overall_passed: bool
    score: float = Field(ge=0, le=100)
    total_checks: int
    passed_checks: int
    failed_checks: int
    checks: List[VerificationCheck]
    summary: str
    prd_summary: VerificationSummary = Field(
        default_factory=lambda: VerificationSummary(status="fail"),
        description="PRD-format status/issues/missing_clauses output",
    )
