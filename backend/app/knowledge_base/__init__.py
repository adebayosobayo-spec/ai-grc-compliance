"""Unified knowledge base interface for ISO frameworks."""

from typing import List, Optional, Dict, Any
from app.knowledge_base import iso27001, iso42001


def get_controls(framework: str) -> List[Dict[str, Any]]:
    """Get all controls for a framework."""
    if framework == "ISO_27001":
        return iso27001.get_all_controls()
    elif framework == "ISO_42001":
        return iso42001.get_all_controls()
    raise ValueError(f"Unsupported framework: {framework}")


def get_control_by_id(framework: str, control_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific control by framework and ID."""
    if framework == "ISO_27001":
        return iso27001.get_control_by_id(control_id)
    elif framework == "ISO_42001":
        return iso42001.get_control_by_id(control_id)
    return None


def get_framework_info(framework: str) -> Dict[str, str]:
    """Get framework metadata."""
    if framework == "ISO_27001":
        return iso27001.ISO_27001_INFO
    elif framework == "ISO_42001":
        return iso42001.ISO_42001_INFO
    raise ValueError(f"Unsupported framework: {framework}")
