"""
API endpoints for GRC compliance operations.
"""
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io

from app.database import get_db
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
from app.services.claude_service import claude_service
from app.services.gap_analysis_service import gap_analysis_service
from app.services.policy_generator_service import policy_generator_service
from app.services.assessment_service import assessment_service
from app.services.verification_service import verification_service
from app.services import register_service
from app.services.audit_pack_service import build_audit_pack

router = APIRouter(prefix="/compliance", tags=["compliance"])

# ── Organization Profile Endpoints ──────────────────────────


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
async def save_onboarding(request: OnboardingRequest, db: Session = Depends(get_db)):
    """
    Save organisational onboarding profile and auto-generate initial registers.

    Converts the intake form into a persistent profile, generates a
    plain-language `current_practices_summary` for gap analysis, and seeds
    the ISMS/AIMS registers (Risk, Asset, Supplier, Data Processing, SoA).
    """
    session_id = str(uuid.uuid4())
    summary = _build_practices_summary(request)

    db_profile = DBOrganizationProfile(
        session_id=session_id,
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

    # Return as schema
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

    # Auto-generate initial register entries from onboarding answers
    register_service.auto_generate_from_onboarding(db, session_id, profile)

    return profile


@router.get("/onboarding/{session_id}", response_model=OrganizationProfile)
async def get_onboarding(session_id: str, db: Session = Depends(get_db)):
    """Retrieve a previously saved organisational profile by session ID."""
    db_profile = db.query(DBOrganizationProfile).filter(DBOrganizationProfile.session_id == session_id).first()
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No profile found for session '{session_id}'",
        )
    
    # Reconstruct schema from database JSON
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
async def verify_document(request: VerificationRequest):
    """
    Two-layer document verification.

    Layer 1 – Structural: deterministic Tanensity formatting checks.
    Layer 2 – Semantic:   Claude-powered ISO control objective coverage checks.
    """
    try:
        return await verification_service.verify_document(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification failed: {str(e)}",
        )


@router.post("/gap-analysis", response_model=GapAnalysisResponse)
async def perform_gap_analysis(request: GapAnalysisRequest):
    """
    Perform comprehensive gap analysis for ISO 27001 or ISO 42001.

    Combines programmatic control coverage screening with Claude-powered
    analysis to identify gaps and calculate an overall compliance score.
    """
    try:
        return await gap_analysis_service.perform_gap_analysis(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gap analysis failed: {str(e)}"
        )


@router.post("/generate-policy", response_model=PolicyGeneratorResponse)
async def generate_policy(request: PolicyGeneratorRequest):
    """
    Generate compliance policy documents for ISO 27001 or ISO 42001.

    Produces Tanensity-formatted Markdown policies with tabular Terms &
    Definitions (Section 4) and Standards/Controls mapping (Section 5).
    If Tanensity validation fails, returns HTTP 422 (not degraded output).
    """
    try:
        return await policy_generator_service.generate_policy(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Policy generation failed validation: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Policy generation failed: {str(e)}"
        )


@router.post("/assessment", response_model=AssessmentResponse)
async def perform_assessment(request: AssessmentRequest):
    """
    Perform compliance assessment for a specific control.

    Evaluates provided evidence against the target control using Claude
    and returns findings, strengths, weaknesses, and a compliance score.
    """
    try:
        return await assessment_service.assess_control(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assessment failed: {str(e)}"
        )


@router.post("/action-plan", response_model=ActionPlanResponse)
async def generate_action_plan(request: ActionPlanRequest):
    """
    Generate remediation action plan for identified gaps.

    This endpoint creates a detailed, prioritized action plan
    to address compliance gaps and achieve compliance.
    """
    try:
        result = claude_service.generate_action_plan(
            framework=request.framework.value,
            organization_name=request.organization_name,
            gaps=request.gaps,
            priority=request.priority,
            timeline=request.timeline,
        )

        ai_data = result["data"]
        actions = [
            ActionItem(**action) for action in ai_data.get("actions", [])
        ]

        return ActionPlanResponse(
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

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Action plan generation failed: {str(e)}"
        )


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Ask general compliance questions and get expert answers.

    This endpoint provides an interactive chat interface for
    compliance questions and guidance.
    """
    try:
        result = claude_service.chat(
            framework=request.framework.value,
            question=request.question,
            context=request.context,
        )

        ai_data = result["data"]
        return ChatResponse(
            framework=request.framework,
            question=request.question,
            answer=ai_data.get("answer", ""),
            references=ai_data.get("references", []),
            related_controls=ai_data.get("related_controls", []),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )


@router.get("/frameworks")
async def list_frameworks():
    """List all supported compliance frameworks."""
    return {
        "frameworks": [
            {
                "id": "ISO_27001",
                "name": "ISO/IEC 27001:2022",
                "description": "Information Security Management Systems",
                "type": "Information Security"
            },
            {
                "id": "ISO_42001",
                "name": "ISO/IEC 42001:2023",
                "description": "AI Management Systems",
                "type": "AI Governance"
            }
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Framework not found"
        )

    return {
        "framework": info,
        "total_controls": len(controls),
        "controls": controls
    }


# ═══════════════════════════════════════════════════════════════════════════════
# REGISTER CRUD ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

# ── Risk Register ─────────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/risks", response_model=List[RiskEntryOut])
async def list_risks(session_id: str, db: Session = Depends(get_db)):
    return register_service.list_risks(db, session_id)


@router.post("/registers/{session_id}/risks", response_model=RiskEntryOut, status_code=201)
async def create_risk(session_id: str, data: RiskEntryIn, db: Session = Depends(get_db)):
    return register_service.create_risk(db, session_id, data)


@router.put("/registers/risks/{entry_id}", response_model=RiskEntryOut)
async def update_risk(entry_id: str, data: RiskEntryIn, db: Session = Depends(get_db)):
    result = register_service.update_risk(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Risk entry not found")
    return result


@router.delete("/registers/risks/{entry_id}", status_code=204)
async def delete_risk(entry_id: str, db: Session = Depends(get_db)):
    if not register_service.delete_risk(db, entry_id):
        raise HTTPException(status_code=404, detail="Risk entry not found")


# ── Asset Register ────────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/assets", response_model=List[AssetEntryOut])
async def list_assets(session_id: str, db: Session = Depends(get_db)):
    return register_service.list_assets(db, session_id)


@router.post("/registers/{session_id}/assets", response_model=AssetEntryOut, status_code=201)
async def create_asset(session_id: str, data: AssetEntryIn, db: Session = Depends(get_db)):
    return register_service.create_asset(db, session_id, data)


@router.put("/registers/assets/{entry_id}", response_model=AssetEntryOut)
async def update_asset(entry_id: str, data: AssetEntryIn, db: Session = Depends(get_db)):
    result = register_service.update_asset(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Asset entry not found")
    return result


@router.delete("/registers/assets/{entry_id}", status_code=204)
async def delete_asset(entry_id: str, db: Session = Depends(get_db)):
    if not register_service.delete_asset(db, entry_id):
        raise HTTPException(status_code=404, detail="Asset entry not found")


# ── Supplier Register ─────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/suppliers", response_model=List[SupplierEntryOut])
async def list_suppliers(session_id: str, db: Session = Depends(get_db)):
    return register_service.list_suppliers(db, session_id)


@router.post("/registers/{session_id}/suppliers", response_model=SupplierEntryOut, status_code=201)
async def create_supplier(session_id: str, data: SupplierEntryIn, db: Session = Depends(get_db)):
    return register_service.create_supplier(db, session_id, data)


@router.put("/registers/suppliers/{entry_id}", response_model=SupplierEntryOut)
async def update_supplier(entry_id: str, data: SupplierEntryIn, db: Session = Depends(get_db)):
    result = register_service.update_supplier(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Supplier entry not found")
    return result


@router.delete("/registers/suppliers/{entry_id}", status_code=204)
async def delete_supplier(entry_id: str, db: Session = Depends(get_db)):
    if not register_service.delete_supplier(db, entry_id):
        raise HTTPException(status_code=404, detail="Supplier entry not found")


# ── Data Processing Register ──────────────────────────────────────────────────

@router.get("/registers/{session_id}/data-processing", response_model=List[DataProcessingEntryOut])
async def list_data_processing(session_id: str, db: Session = Depends(get_db)):
    return register_service.list_data_processing(db, session_id)


@router.post("/registers/{session_id}/data-processing", response_model=DataProcessingEntryOut, status_code=201)
async def create_data_processing(session_id: str, data: DataProcessingEntryIn, db: Session = Depends(get_db)):
    return register_service.create_data_processing(db, session_id, data)


@router.put("/registers/data-processing/{entry_id}", response_model=DataProcessingEntryOut)
async def update_data_processing(entry_id: str, data: DataProcessingEntryIn, db: Session = Depends(get_db)):
    result = register_service.update_data_processing(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Data processing entry not found")
    return result


@router.delete("/registers/data-processing/{entry_id}", status_code=204)
async def delete_data_processing(entry_id: str, db: Session = Depends(get_db)):
    if not register_service.delete_data_processing(db, entry_id):
        raise HTTPException(status_code=404, detail="Data processing entry not found")


# ── AI System Register ────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/ai-systems", response_model=List[AISystemEntryOut])
async def list_ai_systems(session_id: str, db: Session = Depends(get_db)):
    return register_service.list_ai_systems(db, session_id)


@router.post("/registers/{session_id}/ai-systems", response_model=AISystemEntryOut, status_code=201)
async def create_ai_system(session_id: str, data: AISystemEntryIn, db: Session = Depends(get_db)):
    return register_service.create_ai_system(db, session_id, data)


@router.put("/registers/ai-systems/{entry_id}", response_model=AISystemEntryOut)
async def update_ai_system(entry_id: str, data: AISystemEntryIn, db: Session = Depends(get_db)):
    result = register_service.update_ai_system(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="AI system entry not found")
    return result


@router.delete("/registers/ai-systems/{entry_id}", status_code=204)
async def delete_ai_system(entry_id: str, db: Session = Depends(get_db)):
    if not register_service.delete_ai_system(db, entry_id):
        raise HTTPException(status_code=404, detail="AI system entry not found")


# ── Control Register (Statement of Applicability) ─────────────────────────────

@router.get("/registers/{session_id}/controls", response_model=List[ControlEntryOut])
async def list_controls(session_id: str, framework: Optional[str] = None, db: Session = Depends(get_db)):
    return register_service.list_controls(db, session_id, framework)


@router.post("/registers/{session_id}/controls/{framework}", response_model=ControlEntryOut, status_code=201)
async def upsert_control(session_id: str, framework: str, data: ControlEntryIn, db: Session = Depends(get_db)):
    return register_service.upsert_control(db, session_id, framework, data)


@router.delete("/registers/controls/{entry_id}", status_code=204)
async def delete_control(entry_id: str, db: Session = Depends(get_db)):
    if not register_service.delete_control(db, entry_id):
        raise HTTPException(status_code=404, detail="Control entry not found")


# ── Evidence ──────────────────────────────────────────────────────────────────

@router.get("/registers/{session_id}/evidence", response_model=List[EvidenceEntryOut])
async def list_evidence(session_id: str, control_id: Optional[str] = None, db: Session = Depends(get_db)):
    return register_service.list_evidence(db, session_id, control_id)


@router.post("/registers/{session_id}/evidence", response_model=EvidenceEntryOut, status_code=201)
async def create_evidence(session_id: str, data: EvidenceEntryIn, db: Session = Depends(get_db)):
    return register_service.create_evidence(db, session_id, data)


@router.put("/registers/evidence/{entry_id}", response_model=EvidenceEntryOut)
async def update_evidence(entry_id: str, data: EvidenceEntryIn, db: Session = Depends(get_db)):
    result = register_service.update_evidence(db, entry_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Evidence entry not found")
    return result


@router.delete("/registers/evidence/{entry_id}", status_code=204)
async def delete_evidence(entry_id: str, db: Session = Depends(get_db)):
    if not register_service.delete_evidence(db, entry_id):
        raise HTTPException(status_code=404, detail="Evidence entry not found")


# ── Register Summary (Dashboard) ─────────────────────────────────────────────

@router.get("/registers/{session_id}/summary", response_model=RegisterSummary)
async def get_register_summary(session_id: str, db: Session = Depends(get_db)):
    return register_service.get_register_summary(db, session_id)


# ═══════════════════════════════════════════════════════════════════════════════
# AUDIT PACK EXPORT
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/export-audit-pack")
async def export_audit_pack(request: AuditPackRequest, db: Session = Depends(get_db)):
    """
    Export a complete audit pack as a ZIP archive containing all registers
    as professionally formatted Excel workbooks.
    """
    try:
        zip_bytes = build_audit_pack(
            db,
            session_id=request.session_id,
            org_name=request.organization_name,
            framework=request.framework.value,
        )
        safe_name = request.organization_name.replace(" ", "_")[:30]
        filename = f"COMPLAI_Audit_Pack_{safe_name}.zip"

        return StreamingResponse(
            io.BytesIO(zip_bytes),
            media_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Audit pack export failed: {str(e)}",
        )
