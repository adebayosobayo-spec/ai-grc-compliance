"""SQLAlchemy ORM models for PostgreSQL.

Tables:
  - organization_profiles   -- persisted onboarding data
  - gap_analysis_results    -- analysis history with traceability
  - risk_register           -- ISO risk items
  - asset_register          -- information asset inventory
  - supplier_register       -- third-party / supplier register
  - data_processing_register-- data processing activities
  - ai_system_register      -- ISO 42001 AI system inventory
  - control_register        -- Statement of Applicability
  - evidence                -- evidence artefacts linked to controls
"""
import uuid
from sqlalchemy import Column, String, Text, DateTime, Boolean, JSON, Float, Uuid
from sqlalchemy.sql import func

from app.database import Base


def _uuid():
    return uuid.uuid4()


# ─── Organization Profile ────────────────────────────────────
class OrganizationProfile(Base):
    __tablename__ = "organization_profiles"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), unique=True, nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    organization_name = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=False)
    employee_count = Column(String(50), nullable=False)
    compliance_framework = Column(String(20), nullable=False)
    infrastructure_type = Column(String(20), nullable=False)
    risk_appetite = Column(String(20), nullable=False)
    compliance_timeline = Column(String(50), nullable=False)
    onboarding_data = Column(JSON, nullable=False, default=dict)
    current_practices_summary = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── Gap Analysis Results (Traceability) ─────────────────────
class GapAnalysisResult(Base):
    __tablename__ = "gap_analysis_results"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    framework = Column(String(20), nullable=False)
    prompt_hash = Column(String(64), nullable=False)
    model_version = Column(String(100), nullable=False)
    result_data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ─── Risk Register ───────────────────────────────────────────
class RiskEntry(Base):
    __tablename__ = "risk_register"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    risk_id = Column(String(20), nullable=False)
    risk_description = Column(Text, nullable=False)
    asset = Column(String(255), default="")
    threat = Column(String(255), default="")
    vulnerability = Column(String(255), default="")
    likelihood = Column(String(20), default="Medium")
    impact = Column(String(20), default="Medium")
    risk_level = Column(String(20), default="Medium")
    treatment = Column(String(20), default="Mitigate")
    control_refs = Column(Text, default="")
    owner = Column(String(255), default="")
    status = Column(String(20), default="Open")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── Asset Register ──────────────────────────────────────────
class AssetEntry(Base):
    __tablename__ = "asset_register"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    asset_id = Column(String(20), nullable=False)
    asset_name = Column(String(255), nullable=False)
    asset_type = Column(String(50), default="")
    classification = Column(String(50), default="Internal")
    owner = Column(String(255), default="")
    location = Column(String(255), default="")
    value = Column(String(20), default="Medium")
    control_refs = Column(Text, default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── Supplier Register ───────────────────────────────────────
class SupplierEntry(Base):
    __tablename__ = "supplier_register"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    supplier_id = Column(String(20), nullable=False)
    supplier_name = Column(String(255), nullable=False)
    service_provided = Column(String(255), default="")
    data_access = Column(String(20), default="No")
    risk_rating = Column(String(20), default="Low")
    contract_status = Column(String(20), default="Active")
    review_date = Column(String(20), default="")
    contact = Column(String(255), default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── Data Processing Register ────────────────────────────────
class DataProcessingEntry(Base):
    __tablename__ = "data_processing_register"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    record_id = Column(String(20), nullable=False)
    processing_activity = Column(String(255), nullable=False)
    purpose = Column(Text, default="")
    legal_basis = Column(String(100), default="")
    data_categories = Column(Text, default="")
    data_subjects = Column(String(100), default="")
    retention_period = Column(String(50), default="")
    third_party_transfers = Column(String(20), default="No")
    security_measures = Column(Text, default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── AI System Register ──────────────────────────────────────
class AISystemEntry(Base):
    __tablename__ = "ai_system_register"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    system_id = Column(String(20), nullable=False)
    system_name = Column(String(255), nullable=False)
    purpose = Column(Text, default="")
    risk_classification = Column(String(20), default="Low")
    ai_type = Column(String(50), default="")
    training_data = Column(Text, default="")
    output_type = Column(String(50), default="")
    human_oversight = Column(String(20), default="Yes")
    vendor = Column(String(255), default="")
    status = Column(String(20), default="Production")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── Control Register (Statement of Applicability) ───────────
class ControlEntry(Base):
    __tablename__ = "control_register"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    framework = Column(String(20), nullable=False)
    control_id = Column(String(20), nullable=False)
    control_name = Column(String(255), nullable=False)
    applicable = Column(Boolean, default=True)
    justification = Column(Text, default="")
    implementation_status = Column(String(30), default="Not Started")
    evidence_summary = Column(Text, default="")
    owner = Column(String(255), default="")
    target_date = Column(String(20), default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── Evidence ────────────────────────────────────────────────
class EvidenceEntry(Base):
    __tablename__ = "evidence"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    session_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=True, index=True)
    evidence_id = Column(String(20), nullable=False)
    control_id = Column(String(20), nullable=False)
    evidence_type = Column(String(50), default="")
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    file_reference = Column(String(500), default="")
    status = Column(String(20), default="Draft")
    reviewer = Column(String(255), default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ─── Audit Log ────────────────────────────────────────────────
class AuditLogEntry(Base):
    __tablename__ = "audit_log"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    user_id = Column(String(36), nullable=False, index=True)
    session_id = Column(String(36), nullable=True)
    action = Column(String(50), nullable=False, index=True)          # create, update, delete, generate, export, query
    resource_type = Column(String(50), nullable=False)               # risk, asset, gap_analysis, policy, chat, etc.
    resource_id = Column(String(255), nullable=True)
    details = Column(JSON, nullable=False, default=dict)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


# ─── Email Subscribers (Waitlist / Early Access) ─────────────
class EmailSubscriber(Base):
    __tablename__ = "email_subscribers"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    source = Column(String(50), default="chat")   # chat | onboarding | landing
    framework = Column(String(20), default="")    # which framework they were using
    created_at = Column(DateTime(timezone=True), server_default=func.now())

