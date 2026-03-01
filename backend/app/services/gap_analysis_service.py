"""
Gap Analysis Service: programmatic control coverage screening + Claude-powered analysis.

PRD-aligned rebuild:
  - Uses role-based Claude service (architect role)
  - Produces both legacy ControlGap and PRD GapControlResult shapes
  - Persists prompt_hash + model_version for traceability
  - Strict JSON — raises ValueError on parse failure
"""
from typing import Dict, List, Set
from datetime import datetime

from app.models.schemas import (
    ComplianceFramework, ComplianceLevel, ControlStatus,
    GapAnalysisRequest, GapAnalysisResponse,
    ControlGap, GapControlResult,
)
from app.knowledge_base.iso27001 import get_all_controls as get_iso27001_controls
from app.knowledge_base.iso42001 import get_all_controls as get_iso42001_controls
from app.services.claude_service import claude_service

# Stop words to exclude from keyword matching
_STOP_WORDS: Set[str] = {
    "and", "or", "the", "a", "an", "of", "to", "in", "for", "is", "are",
    "be", "with", "by", "that", "this", "should", "must", "on", "at", "as",
    "it", "its", "from", "not", "have", "has", "been", "all", "if", "any",
    "their", "they", "which", "when", "where", "how", "who", "what", "will",
}

_COMPLIANCE_LEVEL_MAP = {
    "non_compliant": ComplianceLevel.NON_COMPLIANT,
    "partially_compliant": ComplianceLevel.PARTIALLY_COMPLIANT,
    "largely_compliant": ComplianceLevel.LARGELY_COMPLIANT,
    "fully_compliant": ComplianceLevel.FULLY_COMPLIANT,
}

_STATUS_MAP = {
    "compliant": ControlStatus.COMPLIANT,
    "partial": ControlStatus.PARTIAL,
    "missing": ControlStatus.MISSING,
}


class GapAnalysisService:
    """
    Performs gap analysis against ISO 27001 / ISO 42001 frameworks.

    Flow:
      1. Load all controls for the requested framework.
      2. Run a heuristic keyword scan against `current_practices` to estimate
         preliminary coverage (no API cost).
      3. Delegate to ClaudeService for intelligent, narrative analysis.
      4. Map the AI response to strongly-typed response schemas.
    """

    def _get_controls(self, framework: ComplianceFramework) -> List[Dict]:
        if framework == ComplianceFramework.ISO_27001:
            return get_iso27001_controls()
        if framework == ComplianceFramework.ISO_42001:
            return get_iso42001_controls()
        raise ValueError(f"Unsupported framework: {framework}")

    def _extract_keywords(self, control: Dict) -> Set[str]:
        text = f"{control.get('name', '')} {control.get('description', '')}"
        return {
            w for w in text.lower().split()
            if len(w) > 4 and w not in _STOP_WORDS
        }

    def _control_appears_covered(self, control: Dict, practices_lower: str) -> bool:
        keywords = self._extract_keywords(control)
        if not keywords:
            return False
        matched = sum(1 for kw in keywords if kw in practices_lower)
        threshold = max(2, len(keywords) // 4)
        return matched >= threshold

    def _score_to_level(self, percentage: float) -> ComplianceLevel:
        if percentage >= 85:
            return ComplianceLevel.FULLY_COMPLIANT
        if percentage >= 65:
            return ComplianceLevel.LARGELY_COMPLIANT
        if percentage >= 35:
            return ComplianceLevel.PARTIALLY_COMPLIANT
        return ComplianceLevel.NON_COMPLIANT

    async def perform_gap_analysis(self, request: GapAnalysisRequest) -> GapAnalysisResponse:
        controls = self._get_controls(request.framework)
        total_controls = len(controls)

        # Programmatic pre-screen
        practices_lower = request.current_practices.lower()
        covered_count = sum(
            1 for c in controls if self._control_appears_covered(c, practices_lower)
        )
        preliminary_pct = round((covered_count / total_controls) * 100, 1) if total_controls else 0

        # Claude-powered analysis (strict JSON)
        result = claude_service.perform_gap_analysis(
            framework=request.framework.value,
            organization_name=request.organization_name,
            industry=request.industry,
            current_practices=request.current_practices,
            specific_controls=request.specific_controls,
        )

        ai_data = result["data"]
        prompt_hash = result["prompt_hash"]
        model_version = result["model_version"]

        # Map legacy gaps
        gaps: List[ControlGap] = []
        for gap_data in ai_data.get("gaps", []):
            try:
                if isinstance(gap_data.get("recommendations"), str):
                    gap_data["recommendations"] = [gap_data["recommendations"]]
                elif not isinstance(gap_data.get("recommendations"), list):
                    gap_data["recommendations"] = []
                gap_data.setdefault("control_id", "N/A")
                gap_data.setdefault("control_name", "Unspecified Control")
                gap_data.setdefault("current_state", "Not assessed")
                gap_data.setdefault("required_state", "See framework requirements")
                gap_data.setdefault("gap_description", "Gap identified")
                gap_data.setdefault("risk_level", "medium")
                gaps.append(ControlGap(**gap_data))
            except Exception as e:
                print(f"[GapAnalysis] Skipped gap entry: {e}")
                continue

        # Map PRD gap_controls
        gap_controls: List[GapControlResult] = []
        for gc_data in ai_data.get("gap_controls", []):
            try:
                status_str = gc_data.get("status", "missing").lower()
                gc_data["status"] = _STATUS_MAP.get(status_str, ControlStatus.MISSING)
                gc_data.setdefault("control_id", "N/A")
                gc_data.setdefault("description", "")
                gc_data.setdefault("risk_level", "medium")
                gc_data.setdefault("remediation", "")
                gc_data.setdefault("traceability", "")
                gap_controls.append(GapControlResult(**gc_data))
            except Exception as e:
                print(f"[GapAnalysis] Skipped gap_control entry: {e}")
                continue

        # Compliance level
        ai_level_str = ai_data.get("overall_compliance_level", "").lower()
        compliance_level = _COMPLIANCE_LEVEL_MAP.get(
            ai_level_str, self._score_to_level(preliminary_pct)
        )

        ai_pct = ai_data.get("compliance_percentage", preliminary_pct)
        compliant_controls = round((ai_pct / 100) * total_controls)

        return GapAnalysisResponse(
            framework=request.framework,
            organization_name=request.organization_name,
            analysis_date=datetime.now(),
            overall_compliance_level=compliance_level,
            total_controls=total_controls,
            compliant_controls=compliant_controls,
            gaps=gaps,
            gap_controls=gap_controls,
            summary=ai_data.get("summary", ""),
            next_steps=ai_data.get("next_steps", []),
            prompt_hash=prompt_hash,
            model_version=model_version,
        )


gap_analysis_service = GapAnalysisService()
