"""
API endpoints for GRC compliance operations.

Public endpoints (no auth): subscribe, chat, frameworks, framework controls
Protected endpoints (require auth): everything else
"""
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io

from app.database import get_db
from app.core.auth import CurrentUser, get_current_user, get_optional_user, verify_session_ownership
from app.models.schemas import (
    GapAnalysisRequest,
    GapAnalysisResponse,
    PolicyGeneratorRequest,
    PolicyGeneratorResponse,
    AssessmentRequest,
    AssessmentResponse,
    ActionPlanRequest,
    ActionPlanResponse,
    ChatRequest,
    ChatResponse,
    ActionItem,
    OnboardingRequest,
    OrganizationProfile,
    VerificationRequest,
    VerificationResponse,
    VerificationCheck,
    # Questionnaire schemas
    QuestionnaireRequest, QuestionnaireResponse,
    # Register schemas
    RiskEntryIn, RiskEntryOut,
    AssetEntryIn, AssetEntryOut,
    SupplierEntryIn, SupplierEntryOut,
    DataProcessingEntryIn, DataProcessingEntryOut,
    AISystemEntryIn, AISystemEntryOut,
    ControlEntryIn, ControlEntryOut,
    EvidenceEntryIn, EvidenceEntryOut,
    RegisterSummary,
    AuditPackRequest,
)
from app.models.database_models import OrganizationProfile as DBOrganizationProfile
from app.models.database_models import EmailSubscriber
from app.services.claude_service import claude_service
from app.services.gap_analysis_service import gap_analysis_service
from app.services.policy_generator_service import policy_generator_service
from app.services.assessment_service import assessment_service
from app.services.verification_service import verification_service
from app.services import register_service
from app.services.audit_pack_service import build_audit_pack
from app.services import audit_service
from app.core.rate_limit import limiter
from pydantic import BaseModel as _BaseModel

router = APIRouter(prefix="/compliance", tags=["compliance"])


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC ENDPOINTS (no authentication required)
# ══════════════════════════════════════════════════════════════════════════════

# ── Quick Score Analysis (public, AI-enhanced) ────────────────

class QuickScoreRequest(_BaseModel):
    framework: str
    answers: Dict[str, str]  # e.g. {"policy": "yes", "risk": "partial", ...}


# Map of question IDs to their text, per framework (mirrors frontend)
_SCORE_QUESTIONS: Dict[str, Dict[str, str]] = {
    "ISO_27001": {
        "policy": "Documented Information Security Policy",
        "risk": "Regular risk assessments",
        "access": "Access control procedures (role-based access, MFA)",
        "incident": "Incident response plan",
        "awareness": "Security awareness training for staff",
        "asset": "Asset inventory (hardware, software, data)",
        "vendor": "Third-party/vendor security risk assessments",
        "bcp": "Business continuity / disaster recovery plan",
    },
    "ISO_42001": {
        "ai_policy": "Documented AI governance policy",
        "ai_risk": "Risk assessments on AI systems",
        "ai_inventory": "Inventory of all AI systems in use",
        "ai_bias": "Testing AI outputs for bias and fairness",
        "ai_transparency": "Explainability of AI decision-making",
        "ai_data": "Controls over data used to train/operate AI",
        "ai_human": "Human oversight for high-risk AI decisions",
        "ai_monitor": "Monitoring AI systems for performance drift or errors",
    },
    "NDPR": {
        "dpo": "Appointed a Data Protection Officer",
        "notice": "Privacy notice displayed before collecting data",
        "consent": "Explicit consent before processing personal data",
        "rights": "Data subjects can request access/correction/deletion",
        "audit": "Annual Data Protection Audit filed with NITDA",
        "transfer": "Safeguards for cross-border data transfers",
        "breach": "Data breach notification procedure",
        "thirdparty": "Third-party data protection agreements",
    },
    "GDPR": {
        "lawful": "Documented lawful basis for each processing activity",
        "privacy": "Clear, accessible privacy notice",
        "dpo": "Appointed a Data Protection Officer (if required)",
        "dpia": "Data Protection Impact Assessments for high-risk processing",
        "rights": "Fulfil data subject rights requests within 30 days",
        "breach": "Notify supervisory authority of a breach within 72 hours",
        "ropa": "Records of Processing Activities (RoPA)",
        "transfer": "Adequate safeguards for international data transfers",
    },
    "UK_GDPR": {
        "lawful": "Documented lawful basis for each processing activity",
        "privacy": "Clear, accessible privacy notice",
        "dpo": "Appointed a Data Protection Officer (if required)",
        "dpia": "Data Protection Impact Assessments for high-risk processing",
        "rights": "Fulfil data subject rights requests within 30 days",
        "breach": "Notify the ICO of a breach within 72 hours",
        "ropa": "Records of Processing Activities (RoPA)",
        "ico": "Registered with the ICO",
    },
    "POPIA": {
        "officer": "Appointed Information Officer and registered with Regulator",
        "consent": "Consent or lawful ground for processing",
        "notice": "Notify data subjects about how their data is processed",
        "rights": "Data subjects can access/correct/delete personal information",
        "security": "Appropriate security safeguards to protect personal information",
        "breach": "Process to notify Regulator and data subjects of breaches",
        "thirdparty": "Written agreements with operators (processors)",
        "transfer": "Safeguards for cross-border data transfers",
    },
    "LGPD": {
        "basis": "Documented legal basis for each data processing activity",
        "dpo": "Appointed a Data Protection Officer (Encarregado)",
        "consent": "Specific, informed consent where required",
        "rights": "Data subjects can exercise rights (access, deletion, portability)",
        "notice": "Clear information about data processing to data subjects",
        "security": "Technical and administrative security measures",
        "report": "Incident response plan for reporting breaches to ANPD",
        "transfer": "Safeguards for international data transfers",
    },
    "CCPA": {
        "notice": "Notice at Collection disclosing data practices",
        "optout": "Do Not Sell or Share My Personal Information option",
        "rights": "Consumers can request access/deletion/correction of data",
        "nondiscrimination": "Consumers not discriminated against for exercising rights",
        "privacy_policy": "Privacy policy updated annually with CCPA disclosures",
        "vendor": "Contracts with service providers limiting data use",
        "sensitive": "Opt-in consent before processing sensitive personal information",
        "training": "Staff trained on handling consumer privacy requests",
    },
    "PDPA": {
        "consent": "Consent before collecting/using/disclosing personal data",
        "purpose": "Data collection limited to what is necessary",
        "notice": "Notify individuals of purposes for data collection",
        "access": "Individuals can request access/correction of personal data",
        "security": "Reasonable security arrangements to protect personal data",
        "retention": "Data retention policy; data deleted when no longer needed",
        "transfer": "Adequate protection for overseas data transfers",
        "dpo": "Appointed a Data Protection Officer",
    },
}


@router.post("/score-analysis")
@limiter.limit("5/minute")
async def quick_score_analysis(request: Request, body: QuickScoreRequest):
    """
    AI-enhanced compliance score analysis — public, no auth required.

    Takes the user's self-assessment answers and returns AI-interpreted
    insights with actual control/article mappings and recommendations.
    """
    questions = _SCORE_QUESTIONS.get(body.framework)
    if not questions:
        raise HTTPException(status_code=400, detail=f"Unsupported framework: {body.framework}")

    # Build a summary of answers for Claude
    lines = []
    for q_id, q_text in questions.items():
        answer = body.answers.get(q_id, "not answered")
        lines.append(f"- {q_text}: {answer}")
    answers_summary = "\n".join(lines)

    _FW_LABELS = {
        "ISO_27001": "ISO/IEC 27001:2022",
        "ISO_42001": "ISO/IEC 42001:2023",
        "NDPR": "Nigeria Data Protection Regulation (NDPR)",
        "GDPR": "EU General Data Protection Regulation (GDPR)",
        "UK_GDPR": "UK General Data Protection Regulation (UK GDPR)",
        "POPIA": "South Africa Protection of Personal Information Act (POPIA)",
        "LGPD": "Brazil Lei Geral de Proteção de Dados (LGPD)",
        "CCPA": "California Consumer Privacy Act / CPRA (CCPA)",
        "PDPA": "Personal Data Protection Act (PDPA)",
    }
    fw_label = _FW_LABELS.get(body.framework, body.framework)

    prompt = f"""An organisation just completed a quick {fw_label} self-assessment. Here are their answers:

{answers_summary}

Based on these answers, provide an AI-interpreted compliance analysis. Be accurate — only flag genuine gaps based on the answers given.

Return ONLY valid JSON:
{{
    "ai_score": <number 0-100, your honest assessment of their compliance level>,
    "summary": "2-3 sentence plain-English assessment written for a non-technical executive. Be encouraging but honest.",
    "control_gaps": [
        {{
            "area": "Short area name e.g. 'Incident Response'",
            "control_ref": "The specific {fw_label} control, article, or section reference (e.g. 'Annex A 5.24' for ISO 27001, 'Article 33' for GDPR, 'Section 2.3' for NDPR)",
            "status": "missing|partial",
            "plain_english": "One sentence explaining why this matters, written for a non-technical reader"
        }}
    ],
    "top_recommendations": [
        {{
            "priority": 1,
            "action": "Specific, concrete action they should take first",
            "effort": "Low|Medium|High",
            "impact": "What risk this addresses in plain English"
        }},
        {{
            "priority": 2,
            "action": "Second priority action",
            "effort": "Low|Medium|High",
            "impact": "What risk this addresses"
        }},
        {{
            "priority": 3,
            "action": "Third priority action",
            "effort": "Low|Medium|High",
            "impact": "What risk this addresses"
        }}
    ],
    "strengths": ["Area where they are doing well based on 'yes' answers"],
    "risk_level": "low|medium|high|critical"
}}

Rules:
- ai_score must reflect the ACTUAL answers, not a guess. If most answers are 'yes', the score should be high.
- control_gaps should ONLY include areas where the answer was 'no' or 'partial'.
- control_ref must be a real, accurate reference from {fw_label}.
- Write everything in plain English a small business owner can understand.
- strengths should acknowledge what they're already doing right.
- Be encouraging and practical, not scary or overly technical."""

    try:
        result = claude_service._call_claude("advisor", prompt, max_tokens=1500)
        return {"analysis": result["data"], "framework": body.framework}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Score analysis failed: {type(e).__name__}: {str(e)}")


# ── Email Subscriber ─────────────────────────────────────────

class SubscribeRequest(_BaseModel):
    email: str
    source: str = "chat"
    framework: str = ""


@router.post("/subscribe")
async def subscribe(body: SubscribeRequest, db: Session = Depends(get_db)):
    """Save an email address for the early-access waitlist."""
    email = body.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=422, detail="Invalid email address")
    try:
        existing = db.query(EmailSubscriber).filter(EmailSubscriber.email == email).first()
        if existing:
            return {"status": "already_subscribed", "message": "You're already on the list!"}
        subscriber = EmailSubscriber(
            email=email,
            source=body.source,
            framework=body.framework,
        )
        db.add(subscriber)
        db.commit()
        return {"status": "subscribed", "message": "You're on the list!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Subscription failed: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(request: Request, body: ChatRequest):
    """
    COMPLIANA — public AI compliance advisor.

    Ask any compliance question and get a plain-English answer.
    No authentication required.
    """
    try:
        result = claude_service.chat(
            framework=body.framework.value,
            question=body.question,
            context=body.context,
        )

        ai_data = result["data"]
        summary = ai_data.get("summary", "")
        explanation = ai_data.get("explanation", "")
        practical_steps = ai_data.get("practical_steps", [])
        key_point = ai_data.get("key_point", "")
        steps_md = "\n".join(f"{i+1}. {s}" for i, s in enumerate(practical_steps))
        answer_md = f"{summary}\n\n{explanation}"
        if steps_md:
            answer_md += f"\n\n**Practical steps:**\n{steps_md}"
        if key_point:
            answer_md += f"\n\n> **Key point:** {key_point}"

        return ChatResponse(
            framework=body.framework,
            question=body.question,
            answer=answer_md,
            references=ai_data.get("references", []),
            related_controls=ai_data.get("related_controls", []),
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Chat failed: {type(e).__name__}: {str(e)}")


@router.get("/frameworks")
async def list_frameworks():
    """List all supported compliance frameworks."""
    return {
        "frameworks": [
            {"id": "ISO_27001", "name": "ISO/IEC 27001:2022", "description": "Information Security Management Systems", "type": "Information Security"},
            {"id": "ISO_42001", "name": "ISO/IEC 42001:2023", "description": "AI Management Systems", "type": "AI Governance"},
        ]
    }


@router.get("/frameworks/{framework_id}/controls")
async def get_framework_controls(framework_id: str):
    """Get all controls for a specific framework."""
    from app.knowledge_base import iso27001, iso42001

    if framework_id == "ISO_27001":
        controls = iso27001.get_all_controls()
        info = iso27001.ISO_27001_INFO
    elif framework_id == "ISO_42001":
        controls = iso42001.get_all_controls()
        info = iso42001.ISO_42001_INFO
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Framework not found")

    return {"framework": info, "total_controls": len(controls), "controls": controls}


# ══════════════════════════════════════════════════════════════════════════════
# PROTECTED ENDPOINTS (require authentication)
# ══════════════════════════════════════════════════════════════════════════════


def _build_practices_summary(req: OnboardingRequest) -> str:
    """Convert onboarding answers into a narrative description for gap analysis."""
    is_ai = req.compliance_framework.value == "ISO_42001"

    lines = [
        f"{req.organization_name} is a {req.employee_count}-employee organisation",
        f"operating in the {req.industry} industry across {req.countries_of_operation or 'one or more countries'}.",
        f"Infrastructure: {req.infrastructure_type}.",
    ]

    if req.cloud_providers:
        label = "AI platforms and tools in use" if is_ai else "Cloud providers in use"
        lines.append(f"{label}: {', '.join(req.cloud_providers)}.")

    if is_ai:
        lines.append(
            f"AI Policy documented: {req.has_security_policy}. "
            f"AI governance role or function: {req.has_security_team}. "
            f"AI incident reporting procedure: {req.has_incident_response}. "
            f"AI bias and fairness assessments: {req.has_business_continuity}. "
            f"AI-specific risk assessments: {req.performs_risk_assessments}. "
            f"AI systems inventory maintained: {req.has_asset_inventory}. "
            f"AI model monitoring for drift: {req.uses_identity_management}."
        )
        lines.append(
            f"Third-party AI vendors or pre-trained models used: {req.has_third_party_vendors}. "
            f"Human oversight of AI decisions: {req.has_remote_workers}."
        )
    else:
        lines.append(
            f"Security policy: {req.has_security_policy}. "
            f"Dedicated security team: {req.has_security_team}. "
            f"Incident response plan: {req.has_incident_response}. "
            f"Business continuity plan: {req.has_business_continuity}. "
            f"Risk assessments: {req.performs_risk_assessments}. "
            f"Asset inventory: {req.has_asset_inventory}. "
            f"Identity management system: {req.uses_identity_management}."
        )
        lines.append(
            f"Third-party vendors with data access: {req.has_third_party_vendors}. "
            f"Remote workers: {req.has_remote_workers}."
        )

    if req.existing_certifications:
        lines.append(f"Existing certifications: {', '.join(req.existing_certifications)}.")

    if req.data_types_handled:
        label = "Data types used in AI systems" if is_ai else "Data types processed"
        lines.append(f"{label}: {', '.join(req.data_types_handled)}.")

    lines.append(
        f"Risk appetite: {req.risk_appetite}. "
        f"Top concerns: {', '.join(req.biggest_concerns) if req.biggest_concerns else 'not specified'}. "
        f"Compliance timeline: {req.compliance_timeline}. "
        f"Budget: {req.budget_level}."
    )

    if req.current_security_controls:
        label = "Current AI governance controls" if is_ai else "Current controls"
        lines.append(f"{label}: {req.current_security_controls}")

    if req.additional_context:
        lines.append(f"Additional context: {req.additional_context}")

    return " ".join(lines)


@router.post("/onboarding", response_model=OrganizationProfile)
async def save_onboarding(
    body: OnboardingRequest,
    request: Request,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Save organisational onboarding profile and auto-generate initial registers."""
    try:
        session_id = str(uuid.uuid4())
        summary = _build_practices_summary(body)

        db_profile = DBOrganizationProfile(
            session_id=session_id,
            user_id=user.id,
            organization_name=body.organization_name,
            industry=body.industry,
            employee_count=body.employee_count,
            compliance_framework=body.compliance_framework.value,
            infrastructure_type=body.infrastructure_type,
            risk_appetite=body.risk_appetite,
            compliance_timeline=body.compliance_timeline,
            onboarding_data=body.model_dump(mode='json'),
            current_practices_summary=summary,
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)

        profile = OrganizationProfile(
            session_id=session_id,
            organization_name=body.organization_name,
            industry=body.industry,
            employee_count=body.employee_count,
            compliance_framework=body.compliance_framework,
            infrastructure_type=body.infrastructure_type,
            risk_appetite=body.risk_appetite,
            compliance_timeline=body.compliance_timeline,
            has_security_policy=body.has_security_policy,
            has_security_team=body.has_security_team,
            has_incident_response=body.has_incident_response,
            existing_certifications=body.existing_certifications,
            data_types_handled=body.data_types_handled,
            biggest_concerns=body.biggest_concerns,
            current_practices_summary=summary,
            additional_context=body.additional_context,
            created_at=db_profile.created_at,
        )

        register_service.auto_generate_from_onboarding(db, session_id, profile)
        audit_service.log_action(db, user_id=user.id, action="create", resource_type="onboarding", resource_id=session_id, session_id=session_id, details={"organization": body.organization_name, "framework": body.compliance_framework.value}, request=request)
        return profile
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Onboarding failed: {str(e)}")


@router.get("/onboarding/{session_id}", response_model=OrganizationProfile)
async def get_onboarding(
    session_id: str,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Retrieve a previously saved organisational profile by session ID."""
    db_profile = verify_session_ownership(session_id, user, db)

    data = db_profile.onboarding_data
    return OrganizationProfile(
        session_id=db_profile.session_id,
        organization_name=db_profile.organization_name,
        industry=db_profile.industry,
        employee_count=db_profile.employee_count,
        compliance_framework=db_profile.compliance_framework,
        infrastructure_type=db_profile.infrastructure_type,
        risk_appetite=db_profile.risk_appetite,
        compliance_timeline=db_profile.compliance_timeline,
        has_security_policy=data.get('has_security_policy', 'no'),
        has_security_team=data.get('has_security_team', 'no'),
        has_incident_response=data.get('has_incident_response', 'no'),
        existing_certifications=data.get('existing_certifications', []),
        data_types_handled=data.get('data_types_handled', []),
        biggest_concerns=data.get('biggest_concerns', []),
        current_practices_summary=db_profile.current_practices_summary,
        additional_context=data.get('additional_context'),
        created_at=db_profile.created_at,
    )


@router.post("/verify", response_model=VerificationResponse)
@limiter.limit("10/minute")
async def verify_document(request: Request, body: VerificationRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Two-layer document verification (structural + semantic)."""
    try:
        result = await verification_service.verify_document(body)
        audit_service.log_action(db, user_id=user.id, action="verify", resource_type="document", details={"framework": body.framework.value if hasattr(body, 'framework') else ""}, request=request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Verification failed: {str(e)}")


@router.post("/gap-analysis", response_model=GapAnalysisResponse)
@limiter.limit("5/minute")
async def perform_gap_analysis(request: Request, body: GapAnalysisRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Perform comprehensive gap analysis for ISO 27001 or ISO 42001."""
    try:
        result = await gap_analysis_service.perform_gap_analysis(body)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="gap_analysis", details={"framework": body.framework.value, "organization": body.organization_name}, request=request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Gap analysis failed: [{type(e).__name__}] {str(e)}")


@router.post("/generate-policy", response_model=PolicyGeneratorResponse)
@limiter.limit("5/minute")
async def generate_policy(request: Request, body: PolicyGeneratorRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Generate compliance policy documents."""
    try:
        result = await policy_generator_service.generate_policy(body)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="policy", details={"framework": body.framework.value, "policy_type": body.policy_type}, request=request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Policy generation failed validation: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Policy generation failed: {str(e)}")


@router.post("/assessment", response_model=AssessmentResponse)
@limiter.limit("5/minute")
async def perform_assessment(request: Request, body: AssessmentRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Perform compliance assessment for a specific control."""
    try:
        result = await assessment_service.assess_control(body)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="assessment", details={"framework": body.framework.value, "control_id": body.control_id}, request=request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Assessment failed: {str(e)}")


@router.post("/answer-questionnaire", response_model=QuestionnaireResponse)
@limiter.limit("5/minute")
async def answer_questionnaire(
    request: Request,
    body: QuestionnaireRequest,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Answer vendor/client security questionnaire questions using the org's onboarded context."""
    # Fetch the user's organization profile
    db_profile = (
        db.query(DBOrganizationProfile)
        .filter(DBOrganizationProfile.user_id == user.id)
        .order_by(DBOrganizationProfile.created_at.desc())
        .first()
    )
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete onboarding first — we need your company profile to answer questionnaires accurately.",
        )

    # Build rich org context from the profile + onboarding data
    data = db_profile.onboarding_data or {}
    org_context = (
        f"Organisation: {db_profile.organization_name}\n"
        f"Industry: {db_profile.industry}\n"
        f"Employee count: {db_profile.employee_count}\n"
        f"Compliance framework: {db_profile.compliance_framework}\n"
        f"Infrastructure: {db_profile.infrastructure_type}\n"
        f"Risk appetite: {db_profile.risk_appetite}\n"
        f"Compliance timeline: {db_profile.compliance_timeline}\n"
        f"Security policy in place: {data.get('has_security_policy', 'unknown')}\n"
        f"Dedicated security team: {data.get('has_security_team', 'unknown')}\n"
        f"Incident response plan: {data.get('has_incident_response', 'unknown')}\n"
        f"Business continuity plan: {data.get('has_business_continuity', 'unknown')}\n"
        f"Risk assessments performed: {data.get('performs_risk_assessments', 'unknown')}\n"
        f"Asset inventory: {data.get('has_asset_inventory', 'unknown')}\n"
        f"Identity management: {data.get('uses_identity_management', 'unknown')}\n"
        f"Third-party vendors: {data.get('has_third_party_vendors', 'unknown')}\n"
        f"Remote workers: {data.get('has_remote_workers', 'unknown')}\n"
        f"Cloud providers: {', '.join(data.get('cloud_providers', [])) or 'not specified'}\n"
        f"Data types handled: {', '.join(data.get('data_types_handled', [])) or 'not specified'}\n"
        f"Existing certifications: {', '.join(data.get('existing_certifications', [])) or 'none'}\n"
        f"Biggest concerns: {', '.join(data.get('biggest_concerns', [])) or 'not specified'}\n"
        f"Current practices: {db_profile.current_practices_summary}\n"
        f"Additional context: {data.get('additional_context', 'none')}"
    )

    try:
        result = claude_service.answer_questionnaire(
            framework=body.framework.value,
            organization_context=org_context,
            questions=body.questions,
        )
        audit_service.log_action(
            db,
            user_id=user.id,
            action="generate",
            resource_type="questionnaire_answers",
            details={"framework": body.framework.value, "question_count": len(body.questions)},
            request=request,
        )
        response_data = result["data"]
        return QuestionnaireResponse(
            answers=response_data.get("answers", []),
            summary=response_data.get("summary", {}),
            organization_name=db_profile.organization_name,
            framework=body.framework.value,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Questionnaire answering failed: {str(e)}")


@router.post("/action-plan", response_model=ActionPlanResponse)
@limiter.limit("5/minute")
async def generate_action_plan(request: Request, body: ActionPlanRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Generate remediation action plan for identified gaps."""
    try:
        result = claude_service.generate_action_plan(
            framework=body.framework.value,
            organization_name=body.organization_name,
            gaps=body.gaps,
            priority=body.priority,
            timeline=body.timeline,
        )

        ai_data = result["data"]
        actions = [ActionItem(**action) for action in ai_data.get("actions", [])]

        response = ActionPlanResponse(
            framework=body.framework,
            organization_name=body.organization_name,
            plan_date=datetime.now(),
            priority=body.priority,
            total_actions=ai_data.get("total_actions", len(actions)),
            estimated_completion=ai_data.get("estimated_completion", ""),
            actions=actions,
            milestones=ai_data.get("milestones", []),
            budget_estimate=ai_data.get("budget_estimate"),
        )
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="action_plan", details={"framework": body.framework.value, "organization": body.organization_name, "total_actions": len(actions)}, request=request)
        return response
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Action plan generation failed: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════════
# REGISTER CRUD ENDPOINTS (all require auth + session ownership)
# ══════════════════════════════════════════════════════════════════════════════

# ── Risk Register ─────────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/risks", response_model=List[RiskEntryOut])
async def list_risks(session_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.list_risks(db, session_id)


@router.post("/registers/{session_id}/risks", response_model=RiskEntryOut, status_code=201)
async def create_risk(session_id: str, data: RiskEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    result = register_service.create_risk(db, session_id, data)
    audit_service.log_action(db, user_id=user.id, action="create", resource_type="risk", resource_id=str(result.id), session_id=session_id, request=req)
    return result


@router.put("/registers/risks/{entry_id}", response_model=RiskEntryOut)
async def update_risk(entry_id: str, data: RiskEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    result = register_service.update_risk(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Risk entry not found")
    audit_service.log_action(db, user_id=user.id, action="update", resource_type="risk", resource_id=entry_id, request=req)
    return result


@router.delete("/registers/risks/{entry_id}", status_code=204)
async def delete_risk(entry_id: str, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if not register_service.delete_risk(db, entry_id):
        raise HTTPException(status_code=404, detail="Risk entry not found")
    audit_service.log_action(db, user_id=user.id, action="delete", resource_type="risk", resource_id=entry_id, request=req)


# ── Asset Register ────────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/assets", response_model=List[AssetEntryOut])
async def list_assets(session_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.list_assets(db, session_id)


@router.post("/registers/{session_id}/assets", response_model=AssetEntryOut, status_code=201)
async def create_asset(session_id: str, data: AssetEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    result = register_service.create_asset(db, session_id, data)
    audit_service.log_action(db, user_id=user.id, action="create", resource_type="asset", resource_id=str(result.id), session_id=session_id, request=req)
    return result


@router.put("/registers/assets/{entry_id}", response_model=AssetEntryOut)
async def update_asset(entry_id: str, data: AssetEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    result = register_service.update_asset(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Asset entry not found")
    audit_service.log_action(db, user_id=user.id, action="update", resource_type="asset", resource_id=entry_id, request=req)
    return result


@router.delete("/registers/assets/{entry_id}", status_code=204)
async def delete_asset(entry_id: str, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if not register_service.delete_asset(db, entry_id):
        raise HTTPException(status_code=404, detail="Asset entry not found")
    audit_service.log_action(db, user_id=user.id, action="delete", resource_type="asset", resource_id=entry_id, request=req)


# ── Supplier Register ─────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/suppliers", response_model=List[SupplierEntryOut])
async def list_suppliers(session_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.list_suppliers(db, session_id)


@router.post("/registers/{session_id}/suppliers", response_model=SupplierEntryOut, status_code=201)
async def create_supplier(session_id: str, data: SupplierEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    result = register_service.create_supplier(db, session_id, data)
    audit_service.log_action(db, user_id=user.id, action="create", resource_type="supplier", resource_id=str(result.id), session_id=session_id, request=req)
    return result


@router.put("/registers/suppliers/{entry_id}", response_model=SupplierEntryOut)
async def update_supplier(entry_id: str, data: SupplierEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    result = register_service.update_supplier(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Supplier entry not found")
    audit_service.log_action(db, user_id=user.id, action="update", resource_type="supplier", resource_id=entry_id, request=req)
    return result


@router.delete("/registers/suppliers/{entry_id}", status_code=204)
async def delete_supplier(entry_id: str, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if not register_service.delete_supplier(db, entry_id):
        raise HTTPException(status_code=404, detail="Supplier entry not found")
    audit_service.log_action(db, user_id=user.id, action="delete", resource_type="supplier", resource_id=entry_id, request=req)


# ── Data Processing Register ──────────────────────────────────────────────────

@router.get("/registers/{session_id}/data-processing", response_model=List[DataProcessingEntryOut])
async def list_data_processing(session_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.list_data_processing(db, session_id)


@router.post("/registers/{session_id}/data-processing", response_model=DataProcessingEntryOut, status_code=201)
async def create_data_processing(session_id: str, data: DataProcessingEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    result = register_service.create_data_processing(db, session_id, data)
    audit_service.log_action(db, user_id=user.id, action="create", resource_type="data_processing", resource_id=str(result.id), session_id=session_id, request=req)
    return result


@router.put("/registers/data-processing/{entry_id}", response_model=DataProcessingEntryOut)
async def update_data_processing(entry_id: str, data: DataProcessingEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    result = register_service.update_data_processing(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Data processing entry not found")
    audit_service.log_action(db, user_id=user.id, action="update", resource_type="data_processing", resource_id=entry_id, request=req)
    return result


@router.delete("/registers/data-processing/{entry_id}", status_code=204)
async def delete_data_processing(entry_id: str, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if not register_service.delete_data_processing(db, entry_id):
        raise HTTPException(status_code=404, detail="Data processing entry not found")
    audit_service.log_action(db, user_id=user.id, action="delete", resource_type="data_processing", resource_id=entry_id, request=req)


# ── AI System Register ────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/ai-systems", response_model=List[AISystemEntryOut])
async def list_ai_systems(session_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.list_ai_systems(db, session_id)


@router.post("/registers/{session_id}/ai-systems", response_model=AISystemEntryOut, status_code=201)
async def create_ai_system(session_id: str, data: AISystemEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    result = register_service.create_ai_system(db, session_id, data)
    audit_service.log_action(db, user_id=user.id, action="create", resource_type="ai_system", resource_id=str(result.id), session_id=session_id, request=req)
    return result


@router.put("/registers/ai-systems/{entry_id}", response_model=AISystemEntryOut)
async def update_ai_system(entry_id: str, data: AISystemEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    result = register_service.update_ai_system(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="AI system entry not found")
    audit_service.log_action(db, user_id=user.id, action="update", resource_type="ai_system", resource_id=entry_id, request=req)
    return result


@router.delete("/registers/ai-systems/{entry_id}", status_code=204)
async def delete_ai_system(entry_id: str, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if not register_service.delete_ai_system(db, entry_id):
        raise HTTPException(status_code=404, detail="AI system entry not found")
    audit_service.log_action(db, user_id=user.id, action="delete", resource_type="ai_system", resource_id=entry_id, request=req)


# ── Control Register (Statement of Applicability) ─────────────────────────────

@router.get("/registers/{session_id}/controls", response_model=List[ControlEntryOut])
async def list_controls(session_id: str, framework: Optional[str] = None, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.list_controls(db, session_id, framework)


@router.post("/registers/{session_id}/controls/{framework}", response_model=ControlEntryOut, status_code=201)
async def upsert_control(session_id: str, framework: str, data: ControlEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    result = register_service.upsert_control(db, session_id, framework, data)
    audit_service.log_action(db, user_id=user.id, action="upsert", resource_type="control", resource_id=data.control_id, session_id=session_id, details={"framework": framework}, request=req)
    return result


@router.delete("/registers/controls/{entry_id}", status_code=204)
async def delete_control(entry_id: str, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if not register_service.delete_control(db, entry_id):
        raise HTTPException(status_code=404, detail="Control entry not found")
    audit_service.log_action(db, user_id=user.id, action="delete", resource_type="control", resource_id=entry_id, request=req)


# ── Evidence ──────────────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/evidence", response_model=List[EvidenceEntryOut])
async def list_evidence(session_id: str, control_id: Optional[str] = None, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.list_evidence(db, session_id, control_id)


@router.post("/registers/{session_id}/evidence", response_model=EvidenceEntryOut, status_code=201)
async def create_evidence(session_id: str, data: EvidenceEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    result = register_service.create_evidence(db, session_id, data)
    audit_service.log_action(db, user_id=user.id, action="create", resource_type="evidence", resource_id=str(result.id), session_id=session_id, request=req)
    return result


@router.put("/registers/evidence/{entry_id}", response_model=EvidenceEntryOut)
async def update_evidence(entry_id: str, data: EvidenceEntryIn, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    result = register_service.update_evidence(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Evidence entry not found")
    audit_service.log_action(db, user_id=user.id, action="update", resource_type="evidence", resource_id=entry_id, request=req)
    return result


@router.delete("/registers/evidence/{entry_id}", status_code=204)
async def delete_evidence(entry_id: str, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    if not register_service.delete_evidence(db, entry_id):
        raise HTTPException(status_code=404, detail="Evidence entry not found")
    audit_service.log_action(db, user_id=user.id, action="delete", resource_type="evidence", resource_id=entry_id, request=req)


# ── Register Summary (Dashboard) ─────────────────────────────────────────────

@router.get("/registers/{session_id}/summary", response_model=RegisterSummary)
async def get_register_summary(session_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    verify_session_ownership(session_id, user, db)
    return register_service.get_register_summary(db, session_id)


# ══════════════════════════════════════════════════════════════════════════════
# AUDIT PACK EXPORT
# ══════════════════════════════════════════════════════════════════════════════

@router.post("/export-audit-pack")
async def export_audit_pack(body: AuditPackRequest, request: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Export a complete audit pack as a ZIP archive."""
    try:
        verify_session_ownership(body.session_id, user, db)
        zip_bytes = build_audit_pack(
            db,
            session_id=body.session_id,
            org_name=body.organization_name,
            framework=body.framework.value,
        )
        safe_name = body.organization_name.replace(" ", "_")[:30]
        filename = f"COMPLAI_Audit_Pack_{safe_name}.zip"

        audit_service.log_action(db, user_id=user.id, action="export", resource_type="audit_pack", session_id=body.session_id, details={"framework": body.framework.value, "organization": body.organization_name}, request=request)
        return StreamingResponse(
            io.BytesIO(zip_bytes),
            media_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Audit pack export failed: {str(e)}")


# ── AI Register Generation ───────────────────────────────────────────────────

from pydantic import BaseModel as PydanticBaseModel

class GenerateRegisterRequest(PydanticBaseModel):
    register_type: str
    framework: str
    organization_name: str
    industry: str
    current_practices: str = ""

REGISTER_PROMPTS = {
    "asset_register": {
        "instruction": "Generate a realistic information asset register",
        "columns": ["name", "type", "owner", "department", "classification", "location", "criticality", "description"],
        "example": '{"name":"Production Database","type":"Software","owner":"CTO","department":"Engineering","classification":"Confidential","location":"AWS eu-west-1","criticality":"Critical","description":"PostgreSQL database storing all customer data"}',
    },
    "incident_register": {
        "instruction": "Generate realistic example security incident register entries that this type of organisation should prepare for",
        "columns": ["Incident ID", "Date", "Description", "Severity", "Response Actions", "Status", "Lessons Learned"],
    },
    "supplier_register": {
        "instruction": "Generate a realistic supplier/vendor register for this organisation",
        "columns": ["Supplier", "Service", "Data Access", "Risk Level", "Contract Expiry", "Last Review", "Status"],
    },
    "training_register": {
        "instruction": "Generate a realistic staff training register for security awareness",
        "columns": ["Employee", "Department", "Training Course", "Date Completed", "Next Due", "Certificate"],
    },
    "change_log": {
        "instruction": "Generate realistic change management log entries",
        "columns": ["Change ID", "Date", "Description", "Requester", "Approver", "Risk Assessment", "Status"],
    },
    "audit_log": {
        "instruction": "Generate realistic internal audit log entries",
        "columns": ["Audit ID", "Date", "Scope", "Auditor", "Findings", "Corrective Actions", "Follow-Up Date"],
    },
}

@router.post("/generate-register")
@limiter.limit("5/minute")
async def generate_register(request: Request, body: GenerateRegisterRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Use Claude to generate structured register entries for any register type."""
    reg = REGISTER_PROMPTS.get(body.register_type)
    if not reg:
        raise HTTPException(status_code=400, detail=f"Unknown register type: {body.register_type}")

    _FW_LABELS = {
        "ISO_27001": "ISO/IEC 27001:2022 (Information Security)",
        "ISO_42001": "ISO/IEC 42001:2023 (AI Management)",
        "NDPR": "Nigeria Data Protection Regulation (NDPR)",
        "GDPR": "EU General Data Protection Regulation (GDPR)",
        "UK_GDPR": "UK General Data Protection Regulation (UK GDPR)",
        "POPIA": "South Africa Protection of Personal Information Act (POPIA)",
        "LGPD": "Brazil Lei Geral de Proteção de Dados (LGPD)",
        "CCPA": "California Consumer Privacy Act / CPRA (CCPA)",
        "PDPA": "Personal Data Protection Act (PDPA)",
    }
    fw_label = _FW_LABELS.get(body.framework, body.framework)
    columns = reg["columns"]
    example = reg.get("example", "")

    prompt = f"""You are a compliance consultant. {reg['instruction']} for {body.organization_name} in the {body.industry} industry, aligned with {fw_label}.

Organisation context:
{body.current_practices or 'General organisation with standard IT infrastructure.'}

Generate 8-12 realistic entries. Return ONLY a valid JSON array of objects with these keys: {columns}

{f'Example entry: {example}' if example else ''}

Rules:
- Be specific and realistic for {body.organization_name} and the {body.industry} industry
- Use real-world examples (e.g. actual software names, realistic department names)
- Entries must be relevant to {fw_label}
- Return ONLY the JSON array, no markdown, no explanation"""

    try:
        result = claude_service._call_claude("architect", prompt, max_tokens=3000)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="register", details={"register_type": body.register_type, "framework": body.framework}, request=request)
        return {"entries": result["data"], "register_type": body.register_type}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Register generation failed: {str(e)}")


# ── GDPR Data Export / Portability (Art. 20) ──────────────────────
@router.get("/data-export")
async def export_user_data(
    req: Request,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Export all user data as JSON (GDPR Art. 20 data portability).

    Returns every record associated with the authenticated user across
    all tables — organization profiles, registers, gap analyses, audit
    logs — in a single machine-readable JSON download.
    """
    import json as _json
    from app.models.database_models import (
        OrganizationProfile as DBOrg,
        GapAnalysisResult, RiskEntry, AssetEntry,
        SupplierEntry, DataProcessingEntry, AISystemEntry,
        ControlEntry, EvidenceEntry, AuditLogEntry,
    )

    def _rows(model):
        rows = db.query(model).filter(model.user_id == user.id).all()
        out = []
        for r in rows:
            d = {c.name: getattr(r, c.name) for c in r.__table__.columns}
            # Serialize datetimes
            for k, v in d.items():
                if isinstance(v, datetime):
                    d[k] = v.isoformat()
            out.append(d)
        return out

    export = {
        "export_date": datetime.utcnow().isoformat(),
        "user_id": user.id,
        "user_email": user.email,
        "organization_profiles": _rows(DBOrg),
        "gap_analyses": _rows(GapAnalysisResult),
        "risk_register": _rows(RiskEntry),
        "asset_register": _rows(AssetEntry),
        "supplier_register": _rows(SupplierEntry),
        "data_processing_register": _rows(DataProcessingEntry),
        "ai_system_register": _rows(AISystemEntry),
        "control_register": _rows(ControlEntry),
        "evidence": _rows(EvidenceEntry),
        "audit_log": _rows(AuditLogEntry),
    }

    audit_service.log_action(
        db, user_id=user.id, action="export",
        resource_type="user_data", details={"type": "gdpr_portability"},
        request=req,
    )

    content = _json.dumps(export, indent=2, default=str)
    return StreamingResponse(
        io.BytesIO(content.encode()),
        media_type="application/json",
        headers={
            "Content-Disposition": f'attachment; filename="complai-data-export-{user.id[:8]}.json"',
        },
    )
