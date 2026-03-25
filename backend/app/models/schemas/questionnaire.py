"""
Vendor questionnaire answering schemas.
"""
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.schemas.common import ComplianceFramework


class QuestionnaireRequest(BaseModel):
    """Request to answer vendor/client security questionnaire questions."""
    framework: ComplianceFramework
    questions: List[str] = Field(
        ...,
        min_length=1,
        max_length=50,
        description="List of questionnaire questions to answer (max 50)",
    )


class QuestionnaireAnswer(BaseModel):
    """A single answered question."""
    question_number: int
    question: str
    answer: str
    confidence: str
    confidence_reason: str


class QuestionnaireSummary(BaseModel):
    """Summary statistics for the answered questionnaire."""
    total_questions: int
    high_confidence: int
    medium_confidence: int
    low_confidence: int
    recommendation: str


class QuestionnaireResponse(BaseModel):
    """Full questionnaire response."""
    answers: List[QuestionnaireAnswer]
    summary: QuestionnaireSummary
    organization_name: str
    framework: str
