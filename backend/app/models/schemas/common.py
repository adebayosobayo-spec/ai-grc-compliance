"""
Shared enums and utility models used across all schema modules.
"""
from datetime import datetime
from enum import Enum
from typing import Dict

from pydantic import BaseModel


class ComplianceFramework(str, Enum):
    """Supported compliance frameworks."""
    ISO_27001 = "ISO_27001"
    ISO_42001 = "ISO_42001"


class ComplianceLevel(str, Enum):
    """Compliance maturity level."""
    NON_COMPLIANT = "non_compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    LARGELY_COMPLIANT = "largely_compliant"
    FULLY_COMPLIANT = "fully_compliant"


class ControlStatus(str, Enum):
    """Status of a single control in gap analysis."""
    COMPLIANT = "compliant"
    PARTIAL = "partial"
    MISSING = "missing"


class AssessmentStatus(str, Enum):
    """Assessment workflow status."""
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REVIEWED = "reviewed"


class HealthCheck(BaseModel):
    """Health check response."""
    status: str
    version: str
    timestamp: datetime
    services: Dict[str, str]
