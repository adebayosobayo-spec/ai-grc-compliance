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

# ── Email Subscriber ─────────────────────────────────────────

class SubscribeRequest(_BaseModel):
    email: str
    source: str = "chat"
    framework: str = ""


@router.post("/subscribe")
async def subscribe(request: SubscribeRequest, db: Session = Depends(get_db)):
    """Save an email address for the early-access waitlist."""
    email = request.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=422, detail="Invalid email address")
    try:
        existing = db.query(EmailSubscriber).filter(EmailSubscriber.email == email).first()
        if existing:
            return {"status": "already_subscribed", "message": "You're already on the list!"}
        subscriber = EmailSubscriber(
            email=email,
            source=request.source,
            framework=request.framework,
        )
        db.add(subscriber)
        db.commit()
        return {"status": "subscribed", "message": "You're on the list!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Subscription failed: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(req: Request, request: ChatRequest):
    """
    COMPLIANA — public AI compliance advisor.

    Ask any compliance question and get a plain-English answer.
    No authentication required.
    """
    try:
        result = claude_service.chat(
            framework=request.framework.value,
            question=request.question,
            context=request.context,
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
            framework=request.framework,
            question=request.question,
            answer=answer_md,
            references=ai_data.get("references", []),
            related_controls=ai_data.get("related_controls", []),
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        import traceback
        logging.getLogger(__name__).error("Chat failed: %s\n%s", e, traceback.format_exc())
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
    request: OnboardingRequest,
    req: Request,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Save organisational onboarding profile and auto-generate initial registers."""
    try:
        session_id = str(uuid.uuid4())
        summary = _build_practices_summary(request)

        db_profile = DBOrganizationProfile(
            session_id=session_id,
            user_id=user.id,
            organization_name=request.organization_name,
            industry=request.industry,
            employee_count=request.employee_count,
            compliance_framework=request.compliance_framework.value,
            infrastructure_type=request.infrastructure_type,
            risk_appetite=request.risk_appetite,
            compliance_timeline=request.compliance_timeline,
            onboarding_data=request.model_dump(mode='json'),
            current_practices_summary=summary,
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)

        profile = OrganizationProfile(
            session_id=session_id,
            organization_name=request.organization_name,
            industry=request.industry,
            employee_count=request.employee_count,
            compliance_framework=request.compliance_framework,
            infrastructure_type=request.infrastructure_type,
            risk_appetite=request.risk_appetite,
            compliance_timeline=request.compliance_timeline,
            has_security_policy=request.has_security_policy,
            has_security_team=request.has_security_team,
            has_incident_response=request.has_incident_response,
            existing_certifications=request.existing_certifications,
            data_types_handled=request.data_types_handled,
            biggest_concerns=request.biggest_concerns,
            current_practices_summary=summary,
            additional_context=request.additional_context,
            created_at=db_profile.created_at,
        )

        register_service.auto_generate_from_onboarding(db, session_id, profile)
        audit_service.log_action(db, user_id=user.id, action="create", resource_type="onboarding", resource_id=session_id, session_id=session_id, details={"organization": request.organization_name, "framework": request.compliance_framework.value}, request=req)
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
async def verify_document(req: Request, request: VerificationRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Two-layer document verification (structural + semantic)."""
    try:
        result = await verification_service.verify_document(request)
        audit_service.log_action(db, user_id=user.id, action="verify", resource_type="document", details={"framework": request.framework.value if hasattr(request, 'framework') else ""}, request=req)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Verification failed: {str(e)}")


@router.post("/gap-analysis", response_model=GapAnalysisResponse)
@limiter.limit("5/minute")
async def perform_gap_analysis(req: Request, request: GapAnalysisRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Perform comprehensive gap analysis for ISO 27001 or ISO 42001."""
    try:
        result = await gap_analysis_service.perform_gap_analysis(request)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="gap_analysis", details={"framework": request.framework.value, "organization": request.organization_name}, request=req)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Gap analysis failed: [{type(e).__name__}] {str(e)}")


@router.post("/generate-policy", response_model=PolicyGeneratorResponse)
@limiter.limit("5/minute")
async def generate_policy(req: Request, request: PolicyGeneratorRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Generate compliance policy documents."""
    try:
        result = await policy_generator_service.generate_policy(request)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="policy", details={"framework": request.framework.value, "policy_type": request.policy_type}, request=req)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Policy generation failed validation: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Policy generation failed: {str(e)}")


@router.post("/assessment", response_model=AssessmentResponse)
@limiter.limit("5/minute")
async def perform_assessment(req: Request, request: AssessmentRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Perform compliance assessment for a specific control."""
    try:
        result = await assessment_service.assess_control(request)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="assessment", details={"framework": request.framework.value, "control_id": request.control_id}, request=req)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Assessment failed: {str(e)}")


@router.post("/action-plan", response_model=ActionPlanResponse)
@limiter.limit("5/minute")
async def generate_action_plan(req: Request, request: ActionPlanRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Generate remediation action plan for identified gaps."""
    try:
        result = claude_service.generate_action_plan(
            framework=request.framework.value,
            organization_name=request.organization_name,
            gaps=request.gaps,
            priority=request.priority,
            timeline=request.timeline,
        )

        ai_data = result["data"]
        actions = [ActionItem(**action) for action in ai_data.get("actions", [])]

        response = ActionPlanResponse(
            framework=request.framework,
            organization_name=request.organization_name,
            plan_date=datetime.now(),
            priority=request.priority,
            total_actions=ai_data.get("total_actions", len(actions)),
            estimated_completion=ai_data.get("estimated_completion", ""),
            actions=actions,
            milestones=ai_data.get("milestones", []),
            budget_estimate=ai_data.get("budget_estimate"),
        )
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="action_plan", details={"framework": request.framework.value, "organization": request.organization_name, "total_actions": len(actions)}, request=req)
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
async def export_audit_pack(request: AuditPackRequest, req: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Export a complete audit pack as a ZIP archive."""
    try:
        verify_session_ownership(request.session_id, user, db)
        zip_bytes = build_audit_pack(
            db,
            session_id=request.session_id,
            org_name=request.organization_name,
            framework=request.framework.value,
        )
        safe_name = request.organization_name.replace(" ", "_")[:30]
        filename = f"COMPLAI_Audit_Pack_{safe_name}.zip"

        audit_service.log_action(db, user_id=user.id, action="export", resource_type="audit_pack", session_id=request.session_id, details={"framework": request.framework.value, "organization": request.organization_name}, request=req)
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
async def generate_register(req: Request, request: GenerateRegisterRequest, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    """Use Claude to generate structured register entries for any register type."""
    reg = REGISTER_PROMPTS.get(request.register_type)
    if not reg:
        raise HTTPException(status_code=400, detail=f"Unknown register type: {request.register_type}")

    fw_label = "ISO/IEC 42001:2023 (AI Management)" if "42001" in request.framework else "ISO/IEC 27001:2022 (Information Security)"
    columns = reg["columns"]
    example = reg.get("example", "")

    prompt = f"""You are a compliance consultant. {reg['instruction']} for {request.organization_name} in the {request.industry} industry, aligned with {fw_label}.

Organisation context:
{request.current_practices or 'General organisation with standard IT infrastructure.'}

Generate 8-12 realistic entries. Return ONLY a valid JSON array of objects with these keys: {columns}

{f'Example entry: {example}' if example else ''}

Rules:
- Be specific and realistic for {request.organization_name} and the {request.industry} industry
- Use real-world examples (e.g. actual software names, realistic department names)
- Entries must be relevant to {fw_label}
- Return ONLY the JSON array, no markdown, no explanation"""

    try:
        result = claude_service._call_claude("architect", prompt, max_tokens=3000)
        audit_service.log_action(db, user_id=user.id, action="generate", resource_type="register", details={"register_type": request.register_type, "framework": request.framework}, request=req)
        return {"entries": result["data"], "register_type": request.register_type}
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
