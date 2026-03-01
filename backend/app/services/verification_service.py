"""
Verification Service: two-layer document verification.

PRD-aligned rebuild:
  - Layer 1 – Structural: Deterministic regex checks (no AI cost)
  - Layer 2 – Semantic: Claude with 'verifier' role
  - PRD output: { status: pass|fail, issues, missing_clauses }
  - Strict JSON — raises ValueError on semantic parse failure
"""
import re
from datetime import datetime
from typing import Any, Dict, List

from app.models.schemas import (
    VerificationCheck, VerificationRequest,
    VerificationSummary, VerificationResponse,
)
from app.services.claude_service import claude_service


# ── Tanensity structural rules (deterministic — no AI cost) ──────────────────

_STRUCTURAL_RULES: Dict[str, Dict[str, Any]] = {
    "has_version_info": {
        "name": "Version Information",
        "description": "Document includes a version number",
        "pattern": r"version\s*[:\|]?\s*\d",
    },
    "has_effective_date": {
        "name": "Effective Date",
        "description": "Document includes an effective date",
        "pattern": r"effective.{0,30}date|date.{0,30}effective|\b\d{4}-\d{2}-\d{2}\b",
    },
    "has_purpose_section": {
        "name": "Purpose Section",
        "description": "Document has a Purpose heading",
        "pattern": r"^#+\s+\d*\.?\s*purpose",
    },
    "has_scope_section": {
        "name": "Scope Section",
        "description": "Document has a Scope heading",
        "pattern": r"^#+\s+\d*\.?\s*scope",
    },
    "has_roles_section": {
        "name": "Roles & Responsibilities Section",
        "description": "Document has a Roles and Responsibilities section",
        "pattern": r"^#+\s+\d*\.?\s*roles?\s*(and|&)?\s*responsibilit",
    },
    "has_terms_table": {
        "name": "Terms & Definitions Table (Tanensity §4)",
        "description": "Section 4 contains a | Term | Definition | Plain Language | Markdown table",
        "pattern": r"\|\s*term\s*\|",
    },
    "has_controls_table": {
        "name": "Standards & Controls Table (Tanensity §5)",
        "description": "Section 5 contains a | Control ID | Control Name | Policy Statement | table",
        "pattern": r"\|\s*control\s*(id)?\s*\|",
    },
    "has_review_section": {
        "name": "Review & Update Section",
        "description": "Document has a Review section",
        "pattern": r"^#+\s+\d*\.?\s*review",
    },
    "has_compliance_section": {
        "name": "Compliance & Enforcement Section",
        "description": "Document has a Compliance or Enforcement section",
        "pattern": r"^#+\s+\d*\.?\s*(compliance|enforcement)",
    },
    "no_placeholders": {
        "name": "No Unfilled Placeholders",
        "description": "Document does not contain [PLACEHOLDER], TBD, or <INSERT> tokens",
        "pattern": None,
    },
}

_PLACEHOLDER_RE = re.compile(
    r"\[.{1,60}\]|<[A-Z_\s]{2,40}>|\bTBD\b|\bTBC\b|\bINSERT\b", re.IGNORECASE
)


class VerificationService:
    """Performs structural and semantic verification of compliance policy documents."""

    # ── Layer 1: Structural (deterministic) ──────────────────────────────

    def _structural_checks(self, content: str) -> List[VerificationCheck]:
        checks: List[VerificationCheck] = []

        for check_id, rule in _STRUCTURAL_RULES.items():
            if check_id == "no_placeholders":
                found = _PLACEHOLDER_RE.findall(content)
                passed = len(found) == 0
                details = (
                    "No unfilled placeholders detected."
                    if passed
                    else f"Unfilled placeholders found: {', '.join(found[:5])}"
                )
            else:
                passed = bool(
                    re.search(rule["pattern"], content, re.IGNORECASE | re.MULTILINE)
                )
                details = (
                    f"'{rule['name']}' is present in the document."
                    if passed
                    else f"'{rule['name']}' is missing — add the required section or table."
                )

            checks.append(VerificationCheck(
                check_id=check_id,
                check_name=rule["name"],
                description=rule["description"],
                type="structural",
                passed=passed,
                details=details,
            ))

        return checks

    # ── Layer 2: Semantic (Claude) ───────────────────────────────────────

    def _semantic_checks(
        self, framework: str, policy_type: str, content: str
    ) -> List[VerificationCheck]:
        result = claude_service.verify_policy(
            framework=framework,
            policy_type=policy_type,
            policy_content=content,
        )

        ai_checks = result["data"].get("checks", [])
        checks: List[VerificationCheck] = []
        for c in ai_checks:
            checks.append(VerificationCheck(
                check_id=c.get("check_id", "semantic_unknown"),
                check_name=c.get("check_name", "Semantic Check"),
                description=c.get("description", ""),
                type="semantic",
                passed=c.get("passed", False),
                details=c.get("details", ""),
            ))
        return checks

    # ── Main entry point ─────────────────────────────────────────────────

    async def verify_document(self, request: VerificationRequest) -> VerificationResponse:
        """
        Run both verification layers and return a consolidated result.
        PRD output: { status: pass|fail, issues, missing_clauses }.
        """
        structural = self._structural_checks(request.policy_content)
        semantic = self._semantic_checks(
            framework=request.framework.value,
            policy_type=request.policy_type,
            content=request.policy_content,
        )

        all_checks = structural + semantic
        passed_count = sum(1 for c in all_checks if c.passed)
        total = len(all_checks)
        score = round((passed_count / total) * 100, 1) if total else 0
        overall_passed = score >= 70

        # PRD-aligned: collect issues and missing clauses
        issues: List[str] = [c.details for c in all_checks if not c.passed]
        missing_clauses: List[str] = []
        for c in all_checks:
            if not c.passed and c.type == "semantic" and "control" in c.check_name.lower():
                missing_clauses.append(c.details)

        prd_summary = VerificationSummary(
            status="pass" if overall_passed else "fail",
            issues=issues,
            missing_clauses=missing_clauses,
        )

        summary_text = (
            f"Verification {'PASSED' if overall_passed else 'FAILED'} "
            f"— score {score}% ({passed_count}/{total} checks passing). "
            + (
                "Document meets Tanensity standards and ISO control requirements."
                if overall_passed
                else "Review the failed checks and update the document before submission."
            )
        )

        return VerificationResponse(
            organization_name=request.organization_name,
            framework=request.framework,
            policy_type=request.policy_type,
            verification_date=datetime.now(),
            overall_passed=overall_passed,
            score=score,
            total_checks=total,
            passed_checks=passed_count,
            failed_checks=total - passed_count,
            checks=all_checks,
            summary=summary_text,
            prd_summary=prd_summary,
        )


verification_service = VerificationService()
