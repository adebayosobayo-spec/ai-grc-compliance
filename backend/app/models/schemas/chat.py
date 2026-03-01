"""
Chat / Q&A schemas for interactive compliance guidance.
"""
from typing import Any, Dict, List, Optional

from pydantic import BaseModel

from app.models.schemas.common import ComplianceFramework


class ChatRequest(BaseModel):
    """General chat request for compliance questions."""
    framework: ComplianceFramework
    question: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Response for chat interactions."""
    framework: ComplianceFramework
    question: str
    answer: str
    references: List[str] = []
    related_controls: List[str] = []
