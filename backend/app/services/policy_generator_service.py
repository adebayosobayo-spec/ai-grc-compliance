"""
Policy Generator Service: Claude-powered policy generation in Tanensity institutional format.

PRD-aligned rebuild:
  - Uses role-based Claude service (policy_writer role)
  - Deterministic Tanensity format validation
  - Rejects invalid output (HTTP 422) instead of degraded responses
  - Prompt hash + model version tracked
"""
import re
from datetime import datetime, timedelta
from typing import Any, Dict, List

from app.models.schemas import (
    ComplianceFramework, PolicyGeneratorRequest, PolicyGeneratorResponse,
    GeneratedPolicy,
)
from app.services.claude_service import claude_service


class PolicyGeneratorService:
    """
    Generates ISO 27001 / ISO 42001 compliant policy documents.

    Enforces the Tanensity institutional standard:
    - Tabular Terms & Definitions (Section 4)
    - Tabular Standards/Controls mapping (Section 5)
    - Plain-language explanations throughout
    """

    def _build_markdown_content(self, sections: List[Dict[str, Any]]) -> str:
        parts: List[str] = []
        for section in sections:
            num = section.get("section_number", "")
            title = section.get("section_title", "")
            content = section.get("content", "")
            heading = f"## {num}. {title}" if num else f"## {title}"
            parts.append(f"{heading}\n\n{content}")
        return "\n\n".join(parts)

    def _validate_tanensity_format(self, sections: List[Dict[str, Any]]) -> None:
        """
        Validate that the generated policy meets Tanensity format requirements.
        Raises ValueError if validation fails.
        """
        errors: List[str] = []

        # Find Section 4 (Terms and Definitions)
        section_4 = None
        section_5 = None
        for s in sections:
            num = str(s.get("section_number", ""))
            if num == "4":
                section_4 = s
            elif num == "5":
                section_5 = s

        # Validate Section 4 has the required table
        if section_4:
            content = section_4.get("content", "")
            if not re.search(r"\|\s*Term\s*\|", content, re.IGNORECASE):
                errors.append(
                    "Section 4 (Terms and Definitions) must contain a table with "
                    "| Term | Definition | Plain Language Explanation | columns."
                )
        else:
            errors.append("Section 4 (Terms and Definitions) is missing.")

        # Validate Section 5 has the required table
        if section_5:
            content = section_5.get("content", "")
            if not re.search(r"\|\s*Control\s*(ID)?\s*\|", content, re.IGNORECASE):
                errors.append(
                    "Section 5 (Standards and Controls Mapping) must contain a table with "
                    "| Control ID | Control Name | Policy Statement | Implementation Notes | columns."
                )
        else:
            errors.append("Section 5 (Standards and Controls Mapping) is missing.")

        if errors:
            raise ValueError(
                "Tanensity format validation failed:\n- " + "\n- ".join(errors)
            )

    def _resolve_review_date(self, effective_date_str: str, result: Dict) -> str:
        if result.get("review_date"):
            return result["review_date"]
        try:
            effective_dt = datetime.strptime(effective_date_str, "%Y-%m-%d")
            return (effective_dt + timedelta(days=365)).strftime("%Y-%m-%d")
        except ValueError:
            return (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d")

    async def generate_policy(self, request: PolicyGeneratorRequest) -> PolicyGeneratorResponse:
        result = claude_service.generate_policy(
            framework=request.framework.value,
            organization_name=request.organization_name,
            industry=request.industry,
            policy_type=request.policy_type,
            context=request.context or "",
        )

        ai_data = result["data"]

        sections: List[Dict[str, Any]] = ai_data.get("sections", [])
        if not isinstance(sections, list):
            raise ValueError("Claude returned invalid sections format")

        # Tanensity format validation — fails hard
        self._validate_tanensity_format(sections)

        full_content = self._build_markdown_content(sections)

        effective_date = ai_data.get(
            "effective_date", datetime.now().strftime("%Y-%m-%d")
        )
        review_date = self._resolve_review_date(effective_date, ai_data)

        # Coerce related_controls
        raw_controls = ai_data.get("related_controls", [])
        if isinstance(raw_controls, str):
            related_controls = [c.strip() for c in raw_controls.split(",") if c.strip()]
        elif isinstance(raw_controls, list):
            related_controls = []
            for item in raw_controls:
                if isinstance(item, str) and "," in item:
                    related_controls.extend([c.strip() for c in item.split(",") if c.strip()])
                elif isinstance(item, str) and item.strip():
                    related_controls.append(item.strip())
        else:
            related_controls = []

        policy = GeneratedPolicy(
            policy_type=request.policy_type,
            title=ai_data.get("title", f"{request.organization_name} – {request.policy_type}"),
            version=ai_data.get("version", "1.0"),
            effective_date=effective_date,
            review_date=review_date,
            content=full_content,
            sections=sections,
            related_controls=related_controls,
        )

        return PolicyGeneratorResponse(
            framework=request.framework,
            organization_name=request.organization_name,
            generation_date=datetime.now(),
            policy=policy,
        )


policy_generator_service = PolicyGeneratorService()
