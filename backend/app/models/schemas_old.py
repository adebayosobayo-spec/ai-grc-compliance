"""
Pydantic models/schemas for API requests and responses.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class ComplianceFramework(str, Enum):
    """Supported compliance frameworks."""
    ISO_27001 = "ISO_27001"
    ISO_42001 = "ISO_42001"


class AssessmentStatus(str, Enum):
    """Assessment status."""
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REVIEWED = "reviewed"


class ComplianceLevel(str, Enum):
    """Compliance maturity level."""
    NON_COMPLIANT = "non_compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    LARGELY_COMPLIANT = "largely_compliant"
    FULLY_COMPLIANT = "fully_compliant"


# Request Models
class GapAnalysisRequest(BaseModel):
    """Request for gap analysis."""
    framework: ComplianceFramework
    organization_name: str
    industry: str
    current_practices: str = Field(
        ...,
        description="Description of current security/AI governance practices"
    )
    specific_controls: Optional[List[str]] = Field(
        default=None,
        description="Specific control areas to focus on"
    )


class PolicyGeneratorRequest(BaseModel):
    """Request for policy generation."""
    framework: ComplianceFramework
    organization_name: str
    industry: str
    policy_type: str = Field(
        ...,
        description="Type of policy (e.g., 'Information Security Policy', 'AI Governance Policy')"
    )
    context: Optional[str] = Field(
        default=None,
        description="Additional context about the organization"
    )


class AssessmentRequest(BaseModel):
    """Request for compliance assessment."""
    framework: ComplianceFramework
    organization_name: str
    control_id: str = Field(
        ...,
        description="Specific control ID to assess (e.g., 'A.5.1', 'AI.3.2')"
    )
    evidence: Optional[str] = Field(
        default=None,
        description="Evidence or documentation of existing controls"
    )


class ActionPlanRequest(BaseModel):
    """Request for remediation action plan."""
    framework: ComplianceFramework
    organization_name: str
    gaps: List[str] = Field(
        ...,
        description="List of identified compliance gaps"
    )
    priority: str = Field(
        default="high",
        description="Priority level: low, medium, high, critical"
    )
    timeline: Optional[str] = Field(
        default=None,
        description="Desired timeline for remediation"
    )


# Response Models
class ControlGap(BaseModel):
    """Individual control gap."""
    control_id: str
    control_name: str
    current_state: str
    required_state: str
    gap_description: str
    risk_level: str
    recommendations: List[str]


class GapAnalysisResponse(BaseModel):
    """Response for gap analysis."""
    framework: ComplianceFramework
    organization_name: str
    analysis_date: datetime
    overall_compliance_level: ComplianceLevel
    total_controls: int
    compliant_controls: int
    gaps: List[ControlGap]
    summary: str
    next_steps: List[str]


class GeneratedPolicy(BaseModel):
    """Generated policy document."""
    policy_type: str
    title: str
    version: str
    effective_date: str
    review_date: str
    content: str
    sections: List[Dict[str, Any]]
    related_controls: List[str]


class PolicyGeneratorResponse(BaseModel):
    """Response for policy generation."""
    framework: ComplianceFramework
    organization_name: str
    generation_date: datetime
    policy: GeneratedPolicy


class AssessmentResult(BaseModel):
    """Assessment result for a control."""
    control_id: str
    control_name: str
    control_description: str
    assessment_status: AssessmentStatus
    compliance_level: ComplianceLevel
    findings: str
    evidence_reviewed: List[str]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    score: float = Field(..., ge=0, le=100)


class AssessmentResponse(BaseModel):
    """Response for compliance assessment."""
    framework: ComplianceFramework
    organization_name: str
    assessment_date: datetime
    result: AssessmentResult


class ActionItem(BaseModel):
    """Individual action item."""
    action_id: str
    title: str
    description: str
    responsible_party: str
    priority: str
    estimated_effort: str
    timeline: str
    dependencies: List[str]
    success_criteria: str
    resources_required: List[str]


class ActionPlanResponse(BaseModel):
    """Response for action plan generation."""
    framework: ComplianceFramework
    organization_name: str
    plan_date: datetime
    priority: str
    total_actions: int
    estimated_completion: str
    actions: List[ActionItem]
    milestones: List[Dict[str, Any]]
    budget_estimate: Optional[str] = None


class ChatRequest(BaseModel):
    """General chat request for compliance questions."""
    framework: ComplianceFramework
    question: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Response for chat interactions."""
    framework: ComplianceFramework
    question: str
    answer: str
    references: List[str]
    related_controls: List[str]


class HealthCheck(BaseModel):
    """Health check response."""
    status: str
    version: str
    timestamp: datetime
    services: Dict[str, str]


# ─────────────────────────────────────────────
# Onboarding schemas
# ─────────────────────────────────────────────

class OnboardingRequest(BaseModel):
    """Comprehensive organizational onboarding intake."""
    # Step 1 – Organisation Details
    organization_name: str
    industry: str
    employee_count: str
    countries_of_operation: Optional[str] = None
    compliance_framework: ComplianceFramework
    target_certification_date: Optional[str] = None

    # Step 2 – Current Security Posture
    has_security_policy: str = Field(description="yes | no | partial")
    has_security_team: str = Field(description="yes | no | partial")
    existing_certifications: List[str] = []
    performs_risk_assessments: str = Field(description="yes | no | partial")
    has_incident_response: str = Field(description="yes | no | partial")
    has_business_continuity: str = Field(description="yes | no | partial")
    current_security_controls: Optional[str] = None

    # Step 3 – Infrastructure & Technology
    infrastructure_type: str = Field(description="cloud | hybrid | on_premise")
    cloud_providers: List[str] = []
    has_third_party_vendors: str = Field(description="yes | no")
    has_remote_workers: str = Field(description="yes | no")
    data_types_handled: List[str] = []
    has_asset_inventory: str = Field(description="yes | no | partial")
    uses_identity_management: str = Field(description="yes | no")

    # Step 4 – Risk Profile
    risk_appetite: str = Field(description="low | medium | high")
    biggest_concerns: List[str] = []
    compliance_timeline: str
    budget_level: str = Field(description="limited | moderate | generous | undefined")
    additional_context: Optional[str] = None


class OrganizationProfile(BaseModel):
    """Persisted organizational profile returned after onboarding."""
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


# ─────────────────────────────────────────────
# Verification schemas
# ─────────────────────────────────────────────

class VerificationRequest(BaseModel):
    """Request to verify a generated policy document."""
    framework: ComplianceFramework
    organization_name: str
    policy_type: str
    policy_content: str = Field(..., description="Full Markdown content of the policy")


class VerificationCheck(BaseModel):
    """Result of a single verification check."""
    check_id: str
    check_name: str
    description: str
    type: str = Field(description="structural | semantic")
    passed: bool
    details: str


class VerificationResponse(BaseModel):
    """Full document verification result."""
    organization_name: str
    framework: ComplianceFramework
    policy_type: str
    verification_date: datetime
    overall_passed: bool
    score: float
    total_checks: int
    passed_checks: int
    failed_checks: int
    checks: List[VerificationCheck]
    summary: str


# ─────────────────────────────────────────────
# Register schemas
# ─────────────────────────────────────────────

class RiskEntryIn(BaseModel):
    risk_description: str
    asset: str = ""
    threat: str = ""
    vulnerability: str = ""
    likelihood: str = "Medium"
    impact: str = "Medium"
    risk_level: str = "Medium"
    treatment: str = "Mitigate"
    control_refs: str = ""
    owner: str = ""
    status: str = "Open"
    notes: str = ""


class RiskEntryOut(RiskEntryIn):
    id: str
    session_id: str
    risk_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class AssetEntryIn(BaseModel):
    asset_name: str
    asset_type: str = ""
    classification: str = "Internal"
    owner: str = ""
    location: str = ""
    value: str = "Medium"
    control_refs: str = ""
    notes: str = ""


class AssetEntryOut(AssetEntryIn):
    id: str
    session_id: str
    asset_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class SupplierEntryIn(BaseModel):
    supplier_name: str
    service_provided: str = ""
    data_access: str = "No"
    risk_rating: str = "Low"
    contract_status: str = "Active"
    review_date: str = ""
    contact: str = ""
    notes: str = ""


class SupplierEntryOut(SupplierEntryIn):
    id: str
    session_id: str
    supplier_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class DataProcessingEntryIn(BaseModel):
    processing_activity: str
    purpose: str = ""
    legal_basis: str = ""
    data_categories: str = ""
    data_subjects: str = ""
    retention_period: str = ""
    third_party_transfers: str = "No"
    security_measures: str = ""
    notes: str = ""


class DataProcessingEntryOut(DataProcessingEntryIn):
    id: str
    session_id: str
    record_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class AISystemEntryIn(BaseModel):
    system_name: str
    purpose: str = ""
    risk_classification: str = "Low"
    ai_type: str = ""
    training_data: str = ""
    output_type: str = ""
    human_oversight: str = "Yes"
    vendor: str = ""
    status: str = "Production"
    notes: str = ""


class AISystemEntryOut(AISystemEntryIn):
    id: str
    session_id: str
    system_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class ControlEntryIn(BaseModel):
    control_id: str
    control_name: str
    applicable: bool = True
    justification: str = ""
    implementation_status: str = "Not Started"
    evidence_summary: str = ""
    owner: str = ""
    target_date: str = ""
    notes: str = ""


class ControlEntryOut(ControlEntryIn):
    id: str
    session_id: str
    framework: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class EvidenceEntryIn(BaseModel):
    control_id: str
    evidence_type: str = ""
    title: str
    description: str = ""
    file_reference: str = ""
    status: str = "Draft"
    reviewer: str = ""
    notes: str = ""


class EvidenceEntryOut(EvidenceEntryIn):
    id: str
    session_id: str
    evidence_id: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class RegisterSummary(BaseModel):
    """Counts for the dashboard register completeness widget."""
    session_id: str
    risk_count: int
    asset_count: int
    supplier_count: int
    data_processing_count: int
    ai_system_count: int
    control_count: int
    controls_implemented: int
    evidence_count: int
    evidence_approved: int


class AuditPackRequest(BaseModel):
    """Request to export a full audit pack ZIP."""
    session_id: str
    organization_name: str
    framework: ComplianceFramework
