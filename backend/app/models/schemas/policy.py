"""
Policy generation schemas.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.models.schemas.common import ComplianceFramework


class PolicySection(BaseModel):
    """A single section within a generated policy document."""
    section_number: Optional[str] = None
    section_title: str
    content: str


class GeneratedPolicy(BaseModel):
    """Generated policy document."""
    policy_type: str
    title: str
    version: str
    effective_date: str
    review_date: str
    content: str = Field(
        description="Full rendered Markdown content of the policy"
    )
    sections: List[Dict[str, Any]] = Field(
        description="Ordered list of section objects returned by the AI model"
    )
    related_controls: List[str] = Field(
        description="ISO control IDs addressed by this policy"
    )


class PolicyGeneratorRequest(BaseModel):
    """Request for policy generation."""
    framework: ComplianceFramework
    organization_name: str
    industry: str
    policy_type: str = Field(
        ...,
        description=(
            "Type of policy (e.g., 'Information Security Policy', "
            "'AI Governance Policy')"
        ),
    )
    context: Optional[str] = Field(
        default=None,
        description="Additional context about the organisation",
    )


class PolicyGeneratorResponse(BaseModel):
    """Response for policy generation."""
    framework: ComplianceFramework
    organization_name: str
    generation_date: datetime
    policy: GeneratedPolicy
