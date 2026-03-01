"""
Assessment Service: evaluates evidence against a specific ISO control using Claude.

PRD-aligned rebuild:
  - Uses role-based Claude service (assessor role)
  - Strict JSON parsing
  - Prompt hash + model version tracked
"""
from datetime import datetime

from app.models.schemas import (
    ComplianceFramework, ComplianceLevel,
    AssessmentRequest, AssessmentResponse,
    AssessmentResult, AssessmentStatus,
)
from app.knowledge_base.iso27001 import get_control_by_id as get_iso27001_control
from app.knowledge_base.iso42001 import get_control_by_id as get_iso42001_control
from app.services.claude_service import claude_service

_COMPLIANCE_LEVEL_MAP = {
    "non_compliant": ComplianceLevel.NON_COMPLIANT,
    "partially_compliant": ComplianceLevel.PARTIALLY_COMPLIANT,
    "largely_compliant": ComplianceLevel.LARGELY_COMPLIANT,
    "fully_compliant": ComplianceLevel.FULLY_COMPLIANT,
}


class AssessmentService:
    """Assesses a specific ISO control against provided evidence."""

    def _get_control(self, framework: ComplianceFramework, control_id: str):
        if framework == ComplianceFramework.ISO_27001:
            return get_iso27001_control(control_id)
        if framework == ComplianceFramework.ISO_42001:
            return get_iso42001_control(control_id)
        raise ValueError(f"Unsupported framework: {framework.value}")

    async def assess_control(self, request: AssessmentRequest) -> AssessmentResponse:
        control_def = self._get_control(request.framework, request.control_id)

        if not control_def:
            raise ValueError(
                f"Control '{request.control_id}' not found in {request.framework.value}. "
                "Check the control ID and try again."
            )

        result = claude_service.perform_assessment(
            framework=request.framework.value,
            organization_name=request.organization_name,
            control_id=request.control_id,
            evidence=request.evidence,
        )

        ai_data = result["data"]

        compliance_level_str = ai_data.get("compliance_level", "non_compliant").lower()
        compliance_level = _COMPLIANCE_LEVEL_MAP.get(
            compliance_level_str, ComplianceLevel.NON_COMPLIANT
        )

        assessment_result = AssessmentResult(
            control_id=ai_data.get("control_id", request.control_id),
            control_name=ai_data.get("control_name", control_def.get("name", "")),
            control_description=ai_data.get(
                "control_description", control_def.get("description", "")
            ),
            assessment_status=AssessmentStatus.COMPLETED,
            compliance_level=compliance_level,
            findings=ai_data.get("findings", ""),
            evidence_reviewed=ai_data.get("evidence_reviewed", []),
            strengths=ai_data.get("strengths", []),
            weaknesses=ai_data.get("weaknesses", []),
            recommendations=ai_data.get("recommendations", []),
            score=float(ai_data.get("score", 0)),
        )

        return AssessmentResponse(
            framework=request.framework,
            organization_name=request.organization_name,
            assessment_date=datetime.now(),
            result=assessment_result,
        )


assessment_service = AssessmentService()
