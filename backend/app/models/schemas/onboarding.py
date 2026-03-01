"""
Onboarding schemas: 4-step organisational intake form and persisted profile.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.schemas.common import ComplianceFramework


class OnboardingRequest(BaseModel):
    """
    Comprehensive organisational onboarding intake.

    The form is presented in four steps:
      1. Organisation Details
      2. Current Security Posture
      3. Infrastructure & Technology
      4. Risk Profile
    """

    # ── Step 1: Organisation Details ─────────────────────────────
    organization_name: str
    industry: str
    employee_count: str
    countries_of_operation: Optional[str] = None
    compliance_framework: ComplianceFramework
    target_certification_date: Optional[str] = None

    # ── Step 2: Current Security Posture ─────────────────────────
    has_security_policy: str = Field(description="yes | no | partial")
    has_security_team: str = Field(description="yes | no | partial")
    existing_certifications: List[str] = []
    performs_risk_assessments: str = Field(description="yes | no | partial")
    has_incident_response: str = Field(description="yes | no | partial")
    has_business_continuity: str = Field(description="yes | no | partial")
    current_security_controls: Optional[str] = None

    # ── Step 3: Infrastructure & Technology ──────────────────────
    infrastructure_type: str = Field(description="cloud | hybrid | on_premise")
    cloud_providers: List[str] = []
    has_third_party_vendors: str = Field(description="yes | no")
    has_remote_workers: str = Field(description="yes | no")
    data_types_handled: List[str] = []
    has_asset_inventory: str = Field(description="yes | no | partial")
    uses_identity_management: str = Field(description="yes | no")

    # ── Step 4: Risk Profile ─────────────────────────────────────
    risk_appetite: str = Field(description="low | medium | high")
    biggest_concerns: List[str] = []
    compliance_timeline: str
    budget_level: str = Field(description="limited | moderate | generous | undefined")
    additional_context: Optional[str] = None
    captcha_token: Optional[str] = None


class OrganizationProfile(BaseModel):
    """Persisted organisational profile returned after onboarding."""
    session_id: str
    organization_name: str
    industry: str
    employee_count: str
    compliance_framework: ComplianceFramework
    infrastructure_type: str
    risk_appetite: str
    compliance_timeline: str
    has_security_policy: str
    has_security_team: str
    has_incident_response: str
    existing_certifications: List[str]
    data_types_handled: List[str]
    biggest_concerns: List[str]
    current_practices_summary: str
    additional_context: Optional[str] = None
    created_at: datetime
