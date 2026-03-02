"""
Claude AI service for GRC compliance — PRD-aligned rebuild.

Key differences from v1:
  - Role-based system prompts (architect, policy_writer, verifier, assessor)
  - Central ``_call_claude()`` with SHA-256 prompt hashing for traceability
  - Strict JSON parsing — raises ValueError on failure (no silent fallbacks)
  - All controls passed in context (not just first 10)
  - Model version tracking on every call
"""
import hashlib
import json
from typing import Any, Dict, List, Optional

from anthropic import Anthropic

from app.core.config import settings
from app.knowledge_base import iso27001, iso42001


# ── Role-based system prompts ────────────────────────────────────────────────

ROLE_PROMPTS: Dict[str, str] = {
    "architect": (
        "You are a senior GRC architect specialising in ISO 27001 and ISO 42001 "
        "compliance frameworks. You perform gap analyses, design remediation "
        "action plans, and advise on control implementation. "
        "Always return structured JSON. Never include markdown fences or "
        "commentary outside the JSON object."
    ),
    "policy_writer": (
        "You are an expert policy writer for information security and AI governance. "
        "You generate policy documents in strict institutional format. "
        "Output ONLY the policy content as structured JSON — no formatting "
        "preambles, no markdown fences."
    ),
    "verifier": (
        "You are a senior ISO compliance auditor. You review generated policy "
        "documents and assess whether they genuinely address the required "
        "control objectives. Be critical and specific in your findings. "
        "Return structured JSON only."
    ),
    "assessor": (
        "You are an expert ISO auditor performing control-level compliance "
        "assessments. You evaluate evidence against control requirements "
        "objectively. Return structured JSON only."
    ),
}


class ClaudeService:
    """Service for interacting with Claude AI with role-based prompting."""

    def __init__(self):
        api_key = (settings.anthropic_api_key or "").strip()
        self.client = Anthropic(
            api_key=api_key,
            timeout=55.0,  # Just under Vercel's 60s maxDuration
        )
        self.model = settings.claude_model
        self.max_tokens = settings.claude_max_tokens

    # ── Core call method ─────────────────────────────────────────────────

    def _call_claude(
        self,
        role: str,
        user_prompt: str,
        max_tokens: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Central method for all Claude interactions.

        Args:
            role: One of 'architect', 'policy_writer', 'verifier', 'assessor'.
            user_prompt: The full user-facing prompt.
            max_tokens: Override default max_tokens if needed.

        Returns:
            Dict with keys: 'data' (parsed JSON), 'prompt_hash', 'model_version'.

        Raises:
            ValueError: If Claude's response cannot be parsed as valid JSON.
        """
        system_prompt = ROLE_PROMPTS.get(role, ROLE_PROMPTS["architect"])

        # Compute prompt hash for traceability
        prompt_hash = hashlib.sha256(user_prompt.encode("utf-8")).hexdigest()

        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens or self.max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        content = response.content[0].text
        model_version = response.model

        # Strict JSON parsing — no silent fallbacks
        try:
            # Strip markdown fences if present
            cleaned = content.strip()
            if cleaned.startswith("```"):
                first_newline = cleaned.index("\n")
                last_fence = cleaned.rfind("```")
                if last_fence > first_newline:
                    cleaned = cleaned[first_newline + 1:last_fence].strip()

            start_idx = cleaned.find("{")
            end_idx = cleaned.rfind("}") + 1
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No JSON object found in response")
            json_str = cleaned[start_idx:end_idx]
            data = json.loads(json_str)
        except (json.JSONDecodeError, ValueError) as exc:
            raise ValueError(
                f"Claude returned non-JSON response for role '{role}': {exc}. "
                f"Raw response (first 500 chars): {content[:500]}"
            ) from exc

        return {
            "data": data,
            "prompt_hash": prompt_hash,
            "model_version": model_version,
        }

    # ── Framework context builder ────────────────────────────────────────

    def _get_framework_context(self, framework: str) -> str:
        """Build full control list context for the specified framework."""
        if framework == "ISO_27001":
            controls = iso27001.get_all_controls()
            info = iso27001.ISO_27001_INFO
        elif framework == "ISO_42001":
            controls = iso42001.get_all_controls()
            info = iso42001.ISO_42001_INFO
        else:
            return ""

        context = (
            f"Framework: {info['name']} - {info['full_title']}\n"
            f"Version: {info['version']}\n"
            f"Description: {info['description']}\n"
            f"Purpose: {info['purpose']}\n\n"
            f"Total Controls: {len(controls)}\n\n"
            f"Complete Control List:\n"
        )
        for c in controls:
            clause = c.get("clause_reference", "")
            context += f"- {c['id']}: {c['name']} — {c['description']}"
            if clause:
                context += f" [Clause {clause}]"
            context += "\n"

        return context

    # ── Gap Analysis ─────────────────────────────────────────────────────

    def perform_gap_analysis(
        self,
        framework: str,
        organization_name: str,
        industry: str,
        current_practices: str,
        specific_controls: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Perform gap analysis using the 'architect' role."""
        framework_context = self._get_framework_context(framework)

        controls_focus = ""
        if specific_controls:
            controls_focus = f"\nFocus specifically on these controls: {', '.join(specific_controls)}"

        prompt = f"""{framework_context}

Task: Perform a comprehensive gap analysis for {organization_name} in the {industry} industry.

Current State:
{current_practices}
{controls_focus}

Identify the TOP 8 most critical compliance gaps. Return ONLY valid JSON:
{{
    "overall_compliance_level": "non_compliant|partially_compliant|largely_compliant|fully_compliant",
    "compliance_percentage": <number 0-100>,
    "summary": "2-3 sentence overall assessment",
    "gaps": [
        {{
            "control_id": "e.g. A.5.1",
            "control_name": "Control name",
            "current_state": "Brief current state",
            "required_state": "Brief required state",
            "gap_description": "One sentence gap description",
            "risk_level": "critical|high|medium|low",
            "recommendations": ["Action 1", "Action 2"]
        }}
    ],
    "gap_controls": [
        {{
            "control_id": "e.g. A.5.1",
            "description": "What this control requires",
            "status": "compliant|partial|missing",
            "risk_level": "low|medium|high|critical",
            "remediation": "Specific remediation action",
            "traceability": "ISO clause reference e.g. Annex A 5.1"
        }}
    ],
    "next_steps": ["Priority 1", "Priority 2", "Priority 3"]
}}

Rules:
- gap_controls must mirror the gaps list but in PRD format with status and traceability.
- Every gap_control must have a traceability reference to the ISO clause or annex.
- Be specific to {organization_name}'s stated practices."""

        result = self._call_claude("architect", prompt, max_tokens=4096)
        return result

    # ── Policy Generation ────────────────────────────────────────────────

    def generate_policy(
        self,
        framework: str,
        organization_name: str,
        industry: str,
        policy_type: str,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a compliance policy using the 'policy_writer' role."""
        if framework == "ISO_27001":
            fw_label = "ISO/IEC 27001:2022 (Information Security Management)"
        elif framework == "ISO_42001":
            fw_label = "ISO/IEC 42001:2023 (AI Management Systems)"
        else:
            fw_label = framework

        additional_context = f"\n\nAdditional context: {context}" if context else ""

        prompt = f"""Generate a complete {policy_type} for {organization_name} ({industry} industry) that complies with {fw_label}.{additional_context}

Output ONLY a single valid JSON object:
{{
    "title": "Full policy title",
    "version": "1.0",
    "effective_date": "YYYY-MM-DD",
    "review_date": "YYYY-MM-DD",
    "sections": [
        {{
            "section_number": "1",
            "section_title": "Purpose and Scope",
            "content": "2-3 paragraphs: why this policy exists, what it covers, who it applies to."
        }},
        {{
            "section_number": "2",
            "section_title": "Roles and Responsibilities",
            "content": "Bullet list using '- Role: responsibility' format for 4-6 key roles."
        }},
        {{
            "section_number": "3",
            "section_title": "Policy Statements and Procedures",
            "content": "Numbered list of 6-8 specific, actionable policy requirements."
        }},
        {{
            "section_number": "4",
            "section_title": "Terms and Definitions",
            "content": "| Term | Definition | Plain Language Explanation |\\n|------|-----------|--------------------------|\\n5 rows of relevant terms"
        }},
        {{
            "section_number": "5",
            "section_title": "Standards and Controls Mapping",
            "content": "| Control ID | Control Name | Policy Statement | Implementation Notes |\\n|-----------|-------------|-----------------|---------------------|\\n5 rows mapping framework controls"
        }}
    ],
    "related_controls": ["A.5.1", "A.6.1", "A.8.1"]
}}

Rules:
- Section 4 content must be a markdown pipe table with exactly the columns shown.
- Section 5 content must be a markdown pipe table with exactly the columns shown.
- related_controls must be a JSON array of individual string IDs.
- Dates use YYYY-MM-DD format.
- Be specific to {organization_name}. Do not use placeholder text."""

        result = self._call_claude("policy_writer", prompt, max_tokens=8000)
        return result

    # ── Assessment ───────────────────────────────────────────────────────

    def perform_assessment(
        self,
        framework: str,
        organization_name: str,
        control_id: str,
        evidence: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Assess a specific control using the 'assessor' role."""
        if framework == "ISO_27001":
            control_info = iso27001.get_control_by_id(control_id)
        else:
            control_info = iso42001.get_control_by_id(control_id)

        if not control_info:
            raise ValueError(f"Control {control_id} not found in {framework}")

        evidence_section = f"\n\nEvidence Provided:\n{evidence}" if evidence else ""

        prompt = f"""Control Information:
- ID: {control_id}
- Name: {control_info['name']}
- Description: {control_info['description']}
- Type: {control_info['control_type']}
- Clause Reference: {control_info.get('clause_reference', 'N/A')}
{evidence_section}

Task: Assess {organization_name}'s implementation of this control.

Return ONLY valid JSON:
{{
    "control_id": "{control_id}",
    "control_name": "{control_info['name']}",
    "control_description": "{control_info['description']}",
    "compliance_level": "non_compliant|partially_compliant|largely_compliant|fully_compliant",
    "score": <number between 0-100>,
    "findings": "Detailed assessment findings",
    "evidence_reviewed": ["Item 1", "Item 2"],
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
}}

Be thorough, objective, and provide specific, actionable recommendations."""

        result = self._call_claude("assessor", prompt)
        return result

    # ── Action Plan ──────────────────────────────────────────────────────

    def generate_action_plan(
        self,
        framework: str,
        organization_name: str,
        gaps: List[str],
        priority: str = "high",
        timeline: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate remediation action plan using the 'architect' role."""
        framework_context = self._get_framework_context(framework)
        gaps_text = "\n".join([f"- {gap}" for gap in gaps])
        timeline_text = f"\nDesired Timeline: {timeline}" if timeline else ""

        prompt = f"""{framework_context}

Organization: {organization_name}
Priority Level: {priority}
{timeline_text}

Identified Gaps:
{gaps_text}

Task: Create a comprehensive remediation action plan.

Return ONLY valid JSON:
{{
    "estimated_completion": "timeframe estimate",
    "total_actions": <number>,
    "actions": [
        {{
            "action_id": "ACT-001",
            "title": "Action title",
            "description": "Detailed description",
            "responsible_party": "Role/team responsible",
            "priority": "critical|high|medium|low",
            "estimated_effort": "time estimate",
            "timeline": "specific timeframe",
            "dependencies": ["Other action IDs or prerequisites"],
            "success_criteria": "How to measure completion",
            "resources_required": ["Resource 1", "Resource 2"]
        }}
    ],
    "milestones": [
        {{
            "milestone": "Milestone name",
            "target_date": "timeframe",
            "deliverables": ["Deliverable 1", "Deliverable 2"]
        }}
    ],
    "budget_estimate": "Rough budget estimate if applicable"
}}

Create a practical, prioritized plan with clear ownership and measurable outcomes."""

        result = self._call_claude("architect", prompt)
        return result

    # ── Chat ─────────────────────────────────────────────────────────────

    def chat(
        self,
        framework: str,
        question: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Handle general compliance questions using the 'architect' role."""
        framework_context = self._get_framework_context(framework)
        context_text = ""
        if context:
            context_text = f"\n\nAdditional Context:\n{json.dumps(context, indent=2)}"

        prompt = f"""{framework_context}
{context_text}

Question: {question}

Provide a comprehensive answer. Return ONLY valid JSON:
{{
    "answer": "Your detailed answer with practical guidance",
    "references": ["Reference 1", "Reference 2"],
    "related_controls": ["Control IDs"]
}}"""

        result = self._call_claude("architect", prompt)
        return result

    # ── Semantic Policy Verification ─────────────────────────────────────

    def verify_policy(
        self,
        framework: str,
        policy_type: str,
        policy_content: str,
    ) -> Dict[str, Any]:
        """Semantic verification using the 'verifier' role."""
        framework_context = self._get_framework_context(framework)

        prompt = f"""{framework_context}

Policy Type: {policy_type}

Policy Content (first 3000 characters):
---
{policy_content[:3000]}
---

Perform a semantic compliance review. Evaluate whether this policy:
1. Explicitly addresses the relevant {framework} control objectives
2. Contains specific, actionable policy statements (not vague platitudes)
3. Defines clear roles and ownership for each requirement
4. Includes implementation guidance or procedures
5. Addresses monitoring, measurement, and review requirements

Return exactly 5 semantic checks in JSON:
{{
    "checks": [
        {{
            "check_id": "semantic_control_coverage",
            "check_name": "ISO Control Coverage",
            "description": "Policy explicitly maps to relevant {framework} control objectives",
            "type": "semantic",
            "passed": true|false,
            "details": "Specific finding explaining pass or fail"
        }},
        {{
            "check_id": "semantic_policy_statements",
            "check_name": "Actionable Policy Statements",
            "description": "Policy contains specific, actionable requirements",
            "type": "semantic",
            "passed": true|false,
            "details": "Specific finding"
        }},
        {{
            "check_id": "semantic_roles_ownership",
            "check_name": "Roles and Ownership",
            "description": "Clear roles and responsibilities are defined",
            "type": "semantic",
            "passed": true|false,
            "details": "Specific finding"
        }},
        {{
            "check_id": "semantic_implementation_guidance",
            "check_name": "Implementation Guidance",
            "description": "Policy provides practical implementation procedures",
            "type": "semantic",
            "passed": true|false,
            "details": "Specific finding"
        }},
        {{
            "check_id": "semantic_monitoring_review",
            "check_name": "Monitoring and Review",
            "description": "Policy addresses monitoring and periodic review",
            "type": "semantic",
            "passed": true|false,
            "details": "Specific finding"
        }}
    ]
}}"""

        result = self._call_claude("verifier", prompt, max_tokens=2000)
        return result


# Global service instance
claude_service = ClaudeService()
