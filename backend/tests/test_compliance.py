"""
Tests for the GRC Compliance API endpoints.

Uses FastAPI TestClient with mocked claude_service so no real Anthropic
API calls are made during testing.
"""
import sys
import os
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

# Make sure the backend/app package is importable when running from backend/tests/
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app  # noqa: E402

client = TestClient(app)

# ---------------------------------------------------------------------------
# Shared mock payloads
# ---------------------------------------------------------------------------

MOCK_GAP_RESULT = {
    "data": {
        "overall_compliance_level": "partially_compliant",
        "compliance_percentage": 45,
        "summary": "The organisation has basic controls but significant gaps remain.",
        "gaps": [
            {
                "control_id": "A.5.1",
                "control_name": "Policies for information security",
                "current_state": "No formal policy exists",
                "required_state": "Documented and management-approved policy",
                "gap_description": "Missing formal information security policy",
                "risk_level": "high",
                "recommendations": [
                    "Develop an information security policy",
                    "Obtain management approval and communicate broadly",
                ],
            }
        ],
        "next_steps": ["Develop information security policies", "Assign security roles"],
    },
    "prompt_hash": "mockhash",
    "model_version": "mockmodel",
}

MOCK_POLICY_RESULT = {
    "data": {
        "title": "Acme Corp – Information Security Policy",
        "version": "1.0",
        "effective_date": "2026-02-26",
        "review_date": "2027-02-26",
        "sections": [
            {
                "section_number": "1",
                "section_title": "Purpose",
                "content": "This policy establishes the information security requirements for Acme Corp.",
            },
            {
                "section_number": "2",
                "section_title": "Scope",
                "content": "This policy applies to all employees, contractors, and third-party partners.",
            },
            {
                "section_number": "4",
                "section_title": "Terms and Definitions",
                "content": (
                    "The following terms are used throughout this document.\n\n"
                    "| Term | Definition | Plain Language Explanation |\n"
                    "|------|-----------|---------------------------|\n"
                    "| ISMS | Information Security Management System | "
                    "A structured framework for protecting company data |\n"
                    "| Asset | Any item of value to the organisation | "
                    "Anything the company owns or uses that is important |"
                ),
            },
            {
                "section_number": "5",
                "section_title": "Standards and Controls",
                "content": (
                    "Controls are mapped to ISO 27001:2022 Annex A.\n\n"
                    "| Control ID | Control Name | Policy Statement | Implementation Notes |\n"
                    "|-----------|-------------|-----------------|---------------------|\n"
                    "| A.5.1 | Information Security Policies | "
                    "Policies must be formally documented and approved | Annual review required |"
                ),
            },
        ],
        "related_controls": ["A.5.1", "A.5.2"],
    },
    "prompt_hash": "mockhash",
    "model_version": "mockmodel",
}

MOCK_ASSESSMENT_RESULT = {
    "data": {
        "control_id": "A.5.1",
        "control_name": "Policies for information security",
        "control_description": "Information security policy should be defined, approved, and communicated.",
        "compliance_level": "partially_compliant",
        "score": 45.0,
        "findings": "A draft policy exists but has not been formally approved or distributed.",
        "evidence_reviewed": ["Draft policy document", "Internal email communications"],
        "strengths": ["Draft policy exists and covers key areas"],
        "weaknesses": ["Not formally approved by management", "Not communicated to all staff"],
        "recommendations": [
            "Formalise and obtain management sign-off on the policy",
            "Distribute the policy to all relevant personnel",
        ],
    },
    "prompt_hash": "mockhash",
    "model_version": "mockmodel",
}


# ===========================================================================
# Health & Infrastructure
# ===========================================================================

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "timestamp" in data
    assert "services" in data


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data


# ===========================================================================
# Frameworks
# ===========================================================================

def test_list_frameworks():
    response = client.get("/api/v1/compliance/frameworks")
    assert response.status_code == 200
    data = response.json()
    assert "frameworks" in data
    ids = [f["id"] for f in data["frameworks"]]
    assert "ISO_27001" in ids
    assert "ISO_42001" in ids


def test_get_iso27001_controls():
    response = client.get("/api/v1/compliance/frameworks/ISO_27001/controls")
    assert response.status_code == 200
    data = response.json()
    assert data["total_controls"] > 0
    assert len(data["controls"]) == data["total_controls"]
    # Spot-check a known control
    control_ids = [c["id"] for c in data["controls"]]
    assert "A.5.1" in control_ids


def test_get_iso42001_controls():
    response = client.get("/api/v1/compliance/frameworks/ISO_42001/controls")
    assert response.status_code == 200
    data = response.json()
    assert data["total_controls"] > 0
    control_ids = [c["id"] for c in data["controls"]]
    assert any(cid.startswith("AI.") for cid in control_ids)


def test_get_unknown_framework_returns_404():
    response = client.get("/api/v1/compliance/frameworks/ISO_99999/controls")
    assert response.status_code == 404


# ===========================================================================
# Gap Analysis
# ===========================================================================

@patch(
    "app.services.claude_service.ClaudeService.perform_gap_analysis",
)
def test_gap_analysis_iso27001(mock_claude):
    mock_claude.return_value = MOCK_GAP_RESULT

    payload = {
        "framework": "ISO_27001",
        "organization_name": "Acme Corp",
        "industry": "Technology",
        "current_practices": "We have basic IT security measures and a draft policy.",
    }
    response = client.post("/api/v1/compliance/gap-analysis", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["framework"] == "ISO_27001"
    assert data["organization_name"] == "Acme Corp"
    assert "overall_compliance_level" in data
    assert "total_controls" in data
    assert data["total_controls"] > 0          # real count from knowledge base
    assert "compliant_controls" in data
    assert isinstance(data["gaps"], list)
    assert len(data["gaps"]) == 1
    assert data["gaps"][0]["control_id"] == "A.5.1"
    assert isinstance(data["next_steps"], list)


@patch(
    "app.services.claude_service.ClaudeService.perform_gap_analysis",
)
def test_gap_analysis_iso42001(mock_claude):
    mock_claude.return_value = MOCK_GAP_RESULT

    payload = {
        "framework": "ISO_42001",
        "organization_name": "AI Startup",
        "industry": "Artificial Intelligence",
        "current_practices": "We deploy machine learning models in production.",
    }
    response = client.post("/api/v1/compliance/gap-analysis", json=payload)
    assert response.status_code == 200
    assert response.json()["framework"] == "ISO_42001"


@patch(
    "app.services.claude_service.ClaudeService.perform_gap_analysis",
)
def test_gap_analysis_with_specific_controls(mock_claude):
    mock_claude.return_value = MOCK_GAP_RESULT

    payload = {
        "framework": "ISO_27001",
        "organization_name": "Acme Corp",
        "industry": "Finance",
        "current_practices": "Basic security controls are in place.",
        "specific_controls": ["A.5.1", "A.5.2"],
    }
    response = client.post("/api/v1/compliance/gap-analysis", json=payload)
    assert response.status_code == 200


def test_gap_analysis_missing_required_fields():
    # organisation_name, industry, and current_practices are required
    payload = {"framework": "ISO_27001"}
    response = client.post("/api/v1/compliance/gap-analysis", json=payload)
    assert response.status_code == 422


def test_gap_analysis_invalid_framework():
    payload = {
        "framework": "ISO_99999",
        "organization_name": "Acme Corp",
        "industry": "Tech",
        "current_practices": "Some practices.",
    }
    response = client.post("/api/v1/compliance/gap-analysis", json=payload)
    assert response.status_code == 422


# ===========================================================================
# Policy Generation
# ===========================================================================

@patch(
    "app.services.claude_service.ClaudeService.generate_policy",
)
def test_generate_policy_iso42001(mock_claude):
    mock_claude.return_value = MOCK_POLICY_RESULT

    payload = {
        "framework": "ISO_42001",
        "organization_name": "Acme Corp",
        "industry": "Technology",
        "policy_type": "AI Governance Policy",
    }
    response = client.post("/api/v1/compliance/generate-policy", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["framework"] == "ISO_42001"
    assert data["organization_name"] == "Acme Corp"
    policy = data["policy"]
    assert policy["policy_type"] == "AI Governance Policy"
    assert policy["version"] == "1.0"
    assert policy["effective_date"] != ""
    assert policy["review_date"] != ""
    assert isinstance(policy["sections"], list)
    assert len(policy["sections"]) > 0
    assert "content" in policy


@patch(
    "app.services.claude_service.ClaudeService.generate_policy",
)
def test_policy_contains_tanensity_tables(mock_claude):
    """
    Tanensity audit: the generated policy must contain Markdown tables in
    the Terms & Definitions section and the Standards/Controls section.
    """
    mock_claude.return_value = MOCK_POLICY_RESULT

    payload = {
        "framework": "ISO_27001",
        "organization_name": "Acme Corp",
        "industry": "Technology",
        "policy_type": "Information Security Policy",
    }
    response = client.post("/api/v1/compliance/generate-policy", json=payload)
    assert response.status_code == 200

    content = response.json()["policy"]["content"]
    sections = response.json()["policy"]["sections"]

    # Both table-format sections must be present
    section_titles = [s["section_title"] for s in sections]
    assert any("Terms" in t or "Definition" in t for t in section_titles), (
        "Section 4 (Terms & Definitions) is missing"
    )
    assert any("Standards" in t or "Controls" in t for t in section_titles), (
        "Section 5 (Standards and Controls) is missing"
    )

    # Full Markdown content should contain pipe-delimited tables
    assert "|" in content, "Policy content must include Markdown tables (Tanensity format)"


@patch(
    "app.services.claude_service.ClaudeService.generate_policy",
)
def test_policy_review_date_auto_computed(mock_claude):
    """If Claude omits review_date, the service should compute it as +1 year."""
    result_without_review = dict(MOCK_POLICY_RESULT)
    result_without_review["review_date"] = ""
    mock_claude.return_value = result_without_review

    payload = {
        "framework": "ISO_27001",
        "organization_name": "Acme Corp",
        "industry": "Technology",
        "policy_type": "Information Security Policy",
    }
    response = client.post("/api/v1/compliance/generate-policy", json=payload)
    assert response.status_code == 200
    assert response.json()["policy"]["review_date"] != ""


def test_generate_policy_missing_fields():
    payload = {"framework": "ISO_27001"}
    response = client.post("/api/v1/compliance/generate-policy", json=payload)
    assert response.status_code == 422


# ===========================================================================
# Assessment
# ===========================================================================

@patch(
    "app.services.claude_service.ClaudeService.perform_assessment",
)
def test_assess_valid_control(mock_claude):
    mock_claude.return_value = MOCK_ASSESSMENT_RESULT

    payload = {
        "framework": "ISO_27001",
        "organization_name": "Acme Corp",
        "control_id": "A.5.1",
        "evidence": "We have a draft information security policy document.",
    }
    response = client.post("/api/v1/compliance/assessment", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["framework"] == "ISO_27001"
    result = data["result"]
    assert result["control_id"] == "A.5.1"
    assert result["assessment_status"] == "completed"
    assert "compliance_level" in result
    assert 0 <= result["score"] <= 100
    assert result["findings"] != ""
    assert isinstance(result["strengths"], list)
    assert isinstance(result["weaknesses"], list)
    assert isinstance(result["recommendations"], list)


@patch(
    "app.services.claude_service.ClaudeService.perform_assessment",
)
def test_assess_iso42001_control(mock_claude):
    ai_result = dict(MOCK_ASSESSMENT_RESULT)
    ai_result["control_id"] = "AI.1.1"
    ai_result["control_name"] = "AI Policy"
    mock_claude.return_value = ai_result

    payload = {
        "framework": "ISO_42001",
        "organization_name": "AI Startup",
        "control_id": "AI.1.1",
        "evidence": "We have an AI usage policy approved by the board.",
    }
    response = client.post("/api/v1/compliance/assessment", json=payload)
    assert response.status_code == 200
    assert response.json()["framework"] == "ISO_42001"


def test_assess_invalid_control_returns_404():
    """A control ID that doesn't exist in the knowledge base must return 404."""
    payload = {
        "framework": "ISO_27001",
        "organization_name": "Acme Corp",
        "control_id": "X.99.99",
    }
    response = client.post("/api/v1/compliance/assessment", json=payload)
    assert response.status_code == 404


def test_assess_missing_fields():
    payload = {"framework": "ISO_27001", "organization_name": "Acme Corp"}
    response = client.post("/api/v1/compliance/assessment", json=payload)
    assert response.status_code == 422
