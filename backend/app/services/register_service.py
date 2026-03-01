"""
CRUD operations for all ISMS/AIMS living registers and evidence objects.

All data is persisted to the SQLite database via SQLAlchemy.
Each register entry belongs to a session_id (organisation profile).
"""
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.database_models import (
    RiskEntry, AssetEntry, SupplierEntry,
    DataProcessingEntry, AISystemEntry, ControlEntry, EvidenceEntry,
)
from app.models.schemas import (
    RiskEntryIn, AssetEntryIn, SupplierEntryIn,
    DataProcessingEntryIn, AISystemEntryIn, ControlEntryIn, EvidenceEntryIn,
    RegisterSummary,
)


def _next_id(prefix: str, existing_ids: List[str]) -> str:
    """Generate sequential IDs like R-001, A-002, etc."""
    nums = []
    for eid in existing_ids:
        parts = eid.split("-")
        if len(parts) == 2 and parts[0] == prefix:
            try:
                nums.append(int(parts[1]))
            except ValueError:
                pass
    n = max(nums, default=0) + 1
    return f"{prefix}-{n:03d}"


# ─────────────────────────────────────────────
# Risk Register
# ─────────────────────────────────────────────

def list_risks(db: Session, session_id: str) -> List[RiskEntry]:
    return db.query(RiskEntry).filter(RiskEntry.session_id == session_id).order_by(RiskEntry.risk_id).all()


def create_risk(db: Session, session_id: str, data: RiskEntryIn) -> RiskEntry:
    existing = [r.risk_id for r in list_risks(db, session_id)]
    entry = RiskEntry(
        id=uuid.uuid4(),
        session_id=session_id,
        risk_id=_next_id("R", existing),
        **data.model_dump(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_risk(db: Session, entry_id: str, data: RiskEntryIn) -> Optional[RiskEntry]:
    entry = db.query(RiskEntry).filter(RiskEntry.id == entry_id).first()
    if not entry:
        return None
    for k, v in data.model_dump().items():
        setattr(entry, k, v)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry


def delete_risk(db: Session, entry_id: str) -> bool:
    entry = db.query(RiskEntry).filter(RiskEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


# ─────────────────────────────────────────────
# Asset Register
# ─────────────────────────────────────────────

def list_assets(db: Session, session_id: str) -> List[AssetEntry]:
    return db.query(AssetEntry).filter(AssetEntry.session_id == session_id).order_by(AssetEntry.asset_id).all()


def create_asset(db: Session, session_id: str, data: AssetEntryIn) -> AssetEntry:
    existing = [r.asset_id for r in list_assets(db, session_id)]
    entry = AssetEntry(
        id=uuid.uuid4(),
        session_id=session_id,
        asset_id=_next_id("A", existing),
        **data.model_dump(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_asset(db: Session, entry_id: str, data: AssetEntryIn) -> Optional[AssetEntry]:
    entry = db.query(AssetEntry).filter(AssetEntry.id == entry_id).first()
    if not entry:
        return None
    for k, v in data.model_dump().items():
        setattr(entry, k, v)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry


def delete_asset(db: Session, entry_id: str) -> bool:
    entry = db.query(AssetEntry).filter(AssetEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


# ─────────────────────────────────────────────
# Supplier Register
# ─────────────────────────────────────────────

def list_suppliers(db: Session, session_id: str) -> List[SupplierEntry]:
    return db.query(SupplierEntry).filter(SupplierEntry.session_id == session_id).order_by(SupplierEntry.supplier_id).all()


def create_supplier(db: Session, session_id: str, data: SupplierEntryIn) -> SupplierEntry:
    existing = [r.supplier_id for r in list_suppliers(db, session_id)]
    entry = SupplierEntry(
        id=uuid.uuid4(),
        session_id=session_id,
        supplier_id=_next_id("S", existing),
        **data.model_dump(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_supplier(db: Session, entry_id: str, data: SupplierEntryIn) -> Optional[SupplierEntry]:
    entry = db.query(SupplierEntry).filter(SupplierEntry.id == entry_id).first()
    if not entry:
        return None
    for k, v in data.model_dump().items():
        setattr(entry, k, v)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry


def delete_supplier(db: Session, entry_id: str) -> bool:
    entry = db.query(SupplierEntry).filter(SupplierEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


# ─────────────────────────────────────────────
# Data Processing Register
# ─────────────────────────────────────────────

def list_data_processing(db: Session, session_id: str) -> List[DataProcessingEntry]:
    return db.query(DataProcessingEntry).filter(DataProcessingEntry.session_id == session_id).order_by(DataProcessingEntry.record_id).all()


def create_data_processing(db: Session, session_id: str, data: DataProcessingEntryIn) -> DataProcessingEntry:
    existing = [r.record_id for r in list_data_processing(db, session_id)]
    entry = DataProcessingEntry(
        id=uuid.uuid4(),
        session_id=session_id,
        record_id=_next_id("DP", existing),
        **data.model_dump(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_data_processing(db: Session, entry_id: str, data: DataProcessingEntryIn) -> Optional[DataProcessingEntry]:
    entry = db.query(DataProcessingEntry).filter(DataProcessingEntry.id == entry_id).first()
    if not entry:
        return None
    for k, v in data.model_dump().items():
        setattr(entry, k, v)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry


def delete_data_processing(db: Session, entry_id: str) -> bool:
    entry = db.query(DataProcessingEntry).filter(DataProcessingEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


# ─────────────────────────────────────────────
# AI System Register
# ─────────────────────────────────────────────

def list_ai_systems(db: Session, session_id: str) -> List[AISystemEntry]:
    return db.query(AISystemEntry).filter(AISystemEntry.session_id == session_id).order_by(AISystemEntry.system_id).all()


def create_ai_system(db: Session, session_id: str, data: AISystemEntryIn) -> AISystemEntry:
    existing = [r.system_id for r in list_ai_systems(db, session_id)]
    entry = AISystemEntry(
        id=uuid.uuid4(),
        session_id=session_id,
        system_id=_next_id("AI", existing),
        **data.model_dump(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_ai_system(db: Session, entry_id: str, data: AISystemEntryIn) -> Optional[AISystemEntry]:
    entry = db.query(AISystemEntry).filter(AISystemEntry.id == entry_id).first()
    if not entry:
        return None
    for k, v in data.model_dump().items():
        setattr(entry, k, v)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry


def delete_ai_system(db: Session, entry_id: str) -> bool:
    entry = db.query(AISystemEntry).filter(AISystemEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


# ─────────────────────────────────────────────
# Control Register (Statement of Applicability)
# ─────────────────────────────────────────────

def list_controls(db: Session, session_id: str, framework: Optional[str] = None) -> List[ControlEntry]:
    q = db.query(ControlEntry).filter(ControlEntry.session_id == session_id)
    if framework:
        q = q.filter(ControlEntry.framework == framework)
    return q.order_by(ControlEntry.control_id).all()


def upsert_control(db: Session, session_id: str, framework: str, data: ControlEntryIn) -> ControlEntry:
    existing = db.query(ControlEntry).filter(
        ControlEntry.session_id == session_id,
        ControlEntry.control_id == data.control_id,
    ).first()
    if existing:
        for k, v in data.model_dump().items():
            setattr(existing, k, v)
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    entry = ControlEntry(
        id=uuid.uuid4(),
        session_id=session_id,
        framework=framework,
        **data.model_dump(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def delete_control(db: Session, entry_id: str) -> bool:
    entry = db.query(ControlEntry).filter(ControlEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


# ─────────────────────────────────────────────
# Evidence
# ─────────────────────────────────────────────

def list_evidence(db: Session, session_id: str, control_id: Optional[str] = None) -> List[EvidenceEntry]:
    q = db.query(EvidenceEntry).filter(EvidenceEntry.session_id == session_id)
    if control_id:
        q = q.filter(EvidenceEntry.control_id == control_id)
    return q.order_by(EvidenceEntry.evidence_id).all()


def create_evidence(db: Session, session_id: str, data: EvidenceEntryIn) -> EvidenceEntry:
    existing = [r.evidence_id for r in list_evidence(db, session_id)]
    entry = EvidenceEntry(
        id=uuid.uuid4(),
        session_id=session_id,
        evidence_id=_next_id("EV", existing),
        **data.model_dump(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def update_evidence(db: Session, entry_id: str, data: EvidenceEntryIn) -> Optional[EvidenceEntry]:
    entry = db.query(EvidenceEntry).filter(EvidenceEntry.id == entry_id).first()
    if not entry:
        return None
    for k, v in data.model_dump().items():
        setattr(entry, k, v)
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry


def delete_evidence(db: Session, entry_id: str) -> bool:
    entry = db.query(EvidenceEntry).filter(EvidenceEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


# ─────────────────────────────────────────────
# Register summary (dashboard metrics)
# ─────────────────────────────────────────────

def get_register_summary(db: Session, session_id: str) -> RegisterSummary:
    controls = list_controls(db, session_id)
    evidence = list_evidence(db, session_id)
    return RegisterSummary(
        session_id=session_id,
        risk_count=db.query(RiskEntry).filter(RiskEntry.session_id == session_id).count(),
        asset_count=db.query(AssetEntry).filter(AssetEntry.session_id == session_id).count(),
        supplier_count=db.query(SupplierEntry).filter(SupplierEntry.session_id == session_id).count(),
        data_processing_count=db.query(DataProcessingEntry).filter(DataProcessingEntry.session_id == session_id).count(),
        ai_system_count=db.query(AISystemEntry).filter(AISystemEntry.session_id == session_id).count(),
        control_count=len(controls),
        controls_implemented=sum(1 for c in controls if c.implementation_status == "Implemented"),
        evidence_count=len(evidence),
        evidence_approved=sum(1 for e in evidence if e.status == "Approved"),
    )


# ─────────────────────────────────────────────
# Auto-generate initial registers from onboarding
# ─────────────────────────────────────────────

def auto_generate_from_onboarding(db: Session, session_id: str, profile) -> None:
    """
    Seed initial register entries based on onboarding answers.
    Called immediately after onboarding is saved.
    Only runs if no entries exist for this session_id yet.
    """
    # Skip if already seeded
    if db.query(AssetEntry).filter(AssetEntry.session_id == session_id).count() > 0:
        return

    is_ai = profile.compliance_framework == "ISO_42001"

    # ── Seed Asset Register ────────────────────────────────────
    if profile.infrastructure_type == "cloud":
        create_asset(db, session_id, AssetEntryIn(
            asset_name="Cloud Infrastructure",
            asset_type="Service",
            classification="Confidential",
            owner="IT Department",
            location="Cloud",
            value="High",
            notes="Auto-generated from onboarding. Update with specifics.",
        ))
    elif profile.infrastructure_type == "on_premise":
        create_asset(db, session_id, AssetEntryIn(
            asset_name="On-Premise Servers",
            asset_type="Hardware",
            classification="Confidential",
            owner="IT Department",
            location="Data Centre",
            value="High",
            notes="Auto-generated from onboarding. Update with specifics.",
        ))
    else:
        create_asset(db, session_id, AssetEntryIn(
            asset_name="Hybrid Infrastructure",
            asset_type="Service",
            classification="Confidential",
            owner="IT Department",
            location="Cloud + On-Premise",
            value="High",
            notes="Auto-generated from onboarding. Update with specifics.",
        ))

    # Data assets based on data types
    for dtype in (profile.data_types_handled or []):
        create_asset(db, session_id, AssetEntryIn(
            asset_name=f"{dtype} Data",
            asset_type="Data",
            classification="Confidential",
            owner="Data Owner",
            location=profile.infrastructure_type,
            value="High",
            notes="Auto-generated from onboarding.",
        ))

    # ── Seed Risk Register ─────────────────────────────────────
    top_risks = _default_risks(profile, is_ai)
    for r in top_risks:
        create_risk(db, session_id, RiskEntryIn(**r))

    # ── Seed Supplier Register ─────────────────────────────────
    if profile.infrastructure_type in ("cloud", "hybrid"):
        for cp in (profile.existing_certifications or [])[:0]:  # placeholder — cloud providers come from onboarding
            pass
        # Generic cloud provider entry
        create_supplier(db, session_id, SupplierEntryIn(
            supplier_name="Cloud Service Provider",
            service_provided="Infrastructure / Platform Services",
            data_access="Yes",
            risk_rating="Medium",
            contract_status="Active",
            notes="Auto-generated. Update with actual provider name.",
        ))

    # ── Seed Data Processing Register ─────────────────────────
    if "Personal Data" in (profile.data_types_handled or []) or "Customer Data" in (profile.data_types_handled or []):
        create_data_processing(db, session_id, DataProcessingEntryIn(
            processing_activity="Customer Data Processing",
            purpose="Service delivery and business operations",
            legal_basis="Contract",
            data_categories="Personal identifiers, contact information",
            data_subjects="Customers",
            retention_period="As per contractual requirements",
            security_measures="Encryption, access controls, audit logging",
            notes="Auto-generated from onboarding.",
        ))
    if "Employee Data" in (profile.data_types_handled or []):
        create_data_processing(db, session_id, DataProcessingEntryIn(
            processing_activity="Employee Data Processing",
            purpose="HR management and employment obligations",
            legal_basis="Legal Obligation",
            data_categories="Personal identifiers, employment records",
            data_subjects="Employees",
            retention_period="Duration of employment + 7 years",
            security_measures="Role-based access, HR system controls",
            notes="Auto-generated from onboarding.",
        ))

    # ── Seed AI System Register (ISO 42001 only) ───────────────
    if is_ai:
        create_ai_system(db, session_id, AISystemEntryIn(
            system_name="AI Compliance Assistant",
            purpose="Assist with ISO 42001 compliance activities",
            risk_classification="Low",
            ai_type="GenAI",
            output_type="Recommendation",
            human_oversight="Yes",
            vendor="Internal",
            status="Production",
            notes="Auto-generated. Update with your actual AI systems.",
        ))


def _default_risks(profile, is_ai: bool) -> list:
    """Return a minimal set of seed risks based on org profile."""
    risks = []
    if not is_ai:
        risks.append({
            "risk_description": "Unauthorised access to information systems",
            "asset": "IT Systems",
            "threat": "External attacker / insider threat",
            "vulnerability": "Weak access controls",
            "likelihood": "Medium",
            "impact": "High",
            "risk_level": "High",
            "treatment": "Mitigate",
            "control_refs": "A.5.15, A.5.16",
            "owner": "IT Security",
            "status": "Open",
            "notes": "Auto-generated from onboarding.",
        })
        risks.append({
            "risk_description": "Data breach of personal or confidential data",
            "asset": "Data Assets",
            "threat": "Data exfiltration",
            "vulnerability": "Insufficient data classification and DLP",
            "likelihood": "Medium",
            "impact": "High",
            "risk_level": "High",
            "treatment": "Mitigate",
            "control_refs": "A.5.12, A.8.11",
            "owner": "Data Protection Officer",
            "status": "Open",
            "notes": "Auto-generated from onboarding.",
        })
        if profile.has_incident_response == "no":
            risks.append({
                "risk_description": "Absence of incident response capability leading to prolonged breach impact",
                "asset": "Business Operations",
                "threat": "Security incidents",
                "vulnerability": "No formal incident response process",
                "likelihood": "High",
                "impact": "High",
                "risk_level": "Critical",
                "treatment": "Mitigate",
                "control_refs": "A.5.24, A.5.26",
                "owner": "CISO",
                "status": "Open",
                "notes": "Auto-generated — incident response gap flagged in onboarding.",
            })
    else:
        risks.append({
            "risk_description": "AI model producing biased or discriminatory outputs",
            "asset": "AI Systems",
            "threat": "Algorithmic bias",
            "vulnerability": "Insufficient bias testing and monitoring",
            "likelihood": "Medium",
            "impact": "High",
            "risk_level": "High",
            "treatment": "Mitigate",
            "control_refs": "AI.6.1, AI.6.2",
            "owner": "AI Governance Team",
            "status": "Open",
            "notes": "Auto-generated from onboarding.",
        })
        risks.append({
            "risk_description": "Lack of transparency in AI decision-making",
            "asset": "AI Systems",
            "threat": "Explainability failure",
            "vulnerability": "Black-box models without documentation",
            "likelihood": "High",
            "impact": "Medium",
            "risk_level": "High",
            "treatment": "Mitigate",
            "control_refs": "AI.5.1, AI.9.1",
            "owner": "AI Product Owner",
            "status": "Open",
            "notes": "Auto-generated from onboarding.",
        })
    return risks
