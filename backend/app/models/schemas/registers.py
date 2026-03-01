"""
Register schemas for all ISMS / AIMS living registers.

Each register has an *In* (create/update) schema and an *Out* (read) schema.
The *Out* schemas include persistence fields (id, session_id, specific
register ID, created_at, updated_at) and use `from_attributes = True`
so they can be constructed directly from SQLAlchemy ORM instances.
"""
from datetime import datetime

from pydantic import BaseModel

from app.models.schemas.common import ComplianceFramework


# ═══════════════════════════════════════════════════════════════════════════════
# Risk Register
# ═══════════════════════════════════════════════════════════════════════════════

class RiskEntryIn(BaseModel):
    risk_description: str
    asset: str = ""
    threat: str = ""
    vulnerability: str = ""
    likelihood: str = "Medium"
    impact: str = "Medium"
    risk_level: str = "Medium"
    treatment: str = "Mitigate"
    control_refs: str = ""
    owner: str = ""
    status: str = "Open"
    notes: str = ""


class RiskEntryOut(RiskEntryIn):
    id: str
    session_id: str
    risk_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════════════════════
# Asset Register
# ═══════════════════════════════════════════════════════════════════════════════

class AssetEntryIn(BaseModel):
    asset_name: str
    asset_type: str = ""
    classification: str = "Internal"
    owner: str = ""
    location: str = ""
    value: str = "Medium"
    control_refs: str = ""
    notes: str = ""


class AssetEntryOut(AssetEntryIn):
    id: str
    session_id: str
    asset_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════════════════════
# Supplier Register
# ═══════════════════════════════════════════════════════════════════════════════

class SupplierEntryIn(BaseModel):
    supplier_name: str
    service_provided: str = ""
    data_access: str = "No"
    risk_rating: str = "Low"
    contract_status: str = "Active"
    review_date: str = ""
    contact: str = ""
    notes: str = ""


class SupplierEntryOut(SupplierEntryIn):
    id: str
    session_id: str
    supplier_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════════════════════
# Data Processing Register
# ═══════════════════════════════════════════════════════════════════════════════

class DataProcessingEntryIn(BaseModel):
    processing_activity: str
    purpose: str = ""
    legal_basis: str = ""
    data_categories: str = ""
    data_subjects: str = ""
    retention_period: str = ""
    third_party_transfers: str = "No"
    security_measures: str = ""
    notes: str = ""


class DataProcessingEntryOut(DataProcessingEntryIn):
    id: str
    session_id: str
    record_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════════════════════
# AI System Register
# ═══════════════════════════════════════════════════════════════════════════════

class AISystemEntryIn(BaseModel):
    system_name: str
    purpose: str = ""
    risk_classification: str = "Low"
    ai_type: str = ""
    training_data: str = ""
    output_type: str = ""
    human_oversight: str = "Yes"
    vendor: str = ""
    status: str = "Production"
    notes: str = ""


class AISystemEntryOut(AISystemEntryIn):
    id: str
    session_id: str
    system_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════════════════════
# Control Register (Statement of Applicability)
# ═══════════════════════════════════════════════════════════════════════════════

class ControlEntryIn(BaseModel):
    control_id: str
    control_name: str
    applicable: bool = True
    justification: str = ""
    implementation_status: str = "Not Started"
    evidence_summary: str = ""
    owner: str = ""
    target_date: str = ""
    notes: str = ""


class ControlEntryOut(ControlEntryIn):
    id: str
    session_id: str
    framework: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════════════════════
# Evidence
# ═══════════════════════════════════════════════════════════════════════════════

class EvidenceEntryIn(BaseModel):
    control_id: str
    evidence_type: str = ""
    title: str
    description: str = ""
    file_reference: str = ""
    status: str = "Draft"
    reviewer: str = ""
    notes: str = ""


class EvidenceEntryOut(EvidenceEntryIn):
    id: str
    session_id: str
    evidence_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════════════════════════════
# Register Summary (Dashboard)
# ═══════════════════════════════════════════════════════════════════════════════

class RegisterSummary(BaseModel):
    """Counts for the dashboard register completeness widget."""
    session_id: str
    risk_count: int
    asset_count: int
    supplier_count: int
    data_processing_count: int
    ai_system_count: int
    control_count: int
    controls_implemented: int
    evidence_count: int
    evidence_approved: int


# ═══════════════════════════════════════════════════════════════════════════════
# Audit Pack Export
# ═══════════════════════════════════════════════════════════════════════════════

class AuditPackRequest(BaseModel):
    """Request to export a full audit pack ZIP."""
    session_id: str
    organization_name: str
    framework: ComplianceFramework
