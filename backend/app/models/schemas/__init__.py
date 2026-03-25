"""
Pydantic schemas package.

Re-exports every public model and enum from the submodules so that
existing code using ``from app.models.schemas import ...`` continues
to work without changes.
"""

# ── common enums & utilities ──────────────────────────────────────────────────
from app.models.schemas.common import (
    ComplianceFramework,
    ComplianceLevel,
    ControlStatus,
    AssessmentStatus,
    HealthCheck,
)

# ── onboarding ────────────────────────────────────────────────────────────────
from app.models.schemas.onboarding import (
    OnboardingRequest,
    OrganizationProfile,
)

# ── gap analysis ──────────────────────────────────────────────────────────────
from app.models.schemas.gap_analysis import (
    GapControlResult,
    ControlGap,
    GapAnalysisRequest,
    GapAnalysisResponse,
)

# ── policy generation ─────────────────────────────────────────────────────────
from app.models.schemas.policy import (
    PolicySection,
    GeneratedPolicy,
    PolicyGeneratorRequest,
    PolicyGeneratorResponse,
)

# ── assessment ────────────────────────────────────────────────────────────────
from app.models.schemas.assessment import (
    AssessmentResult,
    AssessmentRequest,
    AssessmentResponse,
)

# ── action plan ───────────────────────────────────────────────────────────────
from app.models.schemas.action_plan import (
    ActionItem,
    ActionPlanRequest,
    ActionPlanResponse,
)

# ── verification ──────────────────────────────────────────────────────────────
from app.models.schemas.verification import (
    VerificationCheck,
    VerificationRequest,
    VerificationSummary,
    VerificationResponse,
)

# ── chat ──────────────────────────────────────────────────────────────────────
from app.models.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

# ── questionnaire ─────────────────────────────────────────────────────────────
from app.models.schemas.questionnaire import (
    QuestionnaireRequest,
    QuestionnaireAnswer,
    QuestionnaireSummary,
    QuestionnaireResponse,
)

# ── registers ─────────────────────────────────────────────────────────────────
from app.models.schemas.registers import (
    RiskEntryIn,
    RiskEntryOut,
    AssetEntryIn,
    AssetEntryOut,
    SupplierEntryIn,
    SupplierEntryOut,
    DataProcessingEntryIn,
    DataProcessingEntryOut,
    AISystemEntryIn,
    AISystemEntryOut,
    ControlEntryIn,
    ControlEntryOut,
    EvidenceEntryIn,
    EvidenceEntryOut,
    RegisterSummary,
    AuditPackRequest,
)

__all__ = [
    # common
    "ComplianceFramework",
    "ComplianceLevel",
    "ControlStatus",
    "AssessmentStatus",
    "HealthCheck",
    # onboarding
    "OnboardingRequest",
    "OrganizationProfile",
    # gap analysis
    "GapControlResult",
    "ControlGap",
    "GapAnalysisRequest",
    "GapAnalysisResponse",
    # policy
    "PolicySection",
    "GeneratedPolicy",
    "PolicyGeneratorRequest",
    "PolicyGeneratorResponse",
    # assessment
    "AssessmentResult",
    "AssessmentRequest",
    "AssessmentResponse",
    # action plan
    "ActionItem",
    "ActionPlanRequest",
    "ActionPlanResponse",
    # verification
    "VerificationCheck",
    "VerificationRequest",
    "VerificationSummary",
    "VerificationResponse",
    # chat
    "ChatRequest",
    "ChatResponse",
    # questionnaire
    "QuestionnaireRequest",
    "QuestionnaireAnswer",
    "QuestionnaireSummary",
    "QuestionnaireResponse",
    # registers
    "RiskEntryIn",
    "RiskEntryOut",
    "AssetEntryIn",
    "AssetEntryOut",
    "SupplierEntryIn",
    "SupplierEntryOut",
    "DataProcessingEntryIn",
    "DataProcessingEntryOut",
    "AISystemEntryIn",
    "AISystemEntryOut",
    "ControlEntryIn",
    "ControlEntryOut",
    "EvidenceEntryIn",
    "EvidenceEntryOut",
    "RegisterSummary",
    "AuditPackRequest",
]
