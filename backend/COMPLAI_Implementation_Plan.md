# Implementation Plan: COMPLAI ISO 27001 & 42001 Audit Readiness Platform

## Goal Description
Pivot the current Bayeaux MVP into **COMPLAI**, a true enterprise-grade audit preparation and compliance management platform. The core non-negotiable principle is that **ISO compliance is NOT achieved through policies alone.** The system will be overhauled to make Registers, Records, and Traceability first-class artifacts, ensuring outputs reflect real-world certification audits. The implementation will use the current React UI structure but heavily expand its functionality.

## User Review Required
> [!IMPORTANT]
> This plan proposes significant architectural additions to both the backend (new database models for Registers and Evidence linking) and the frontend (new dynamic UI views for Registers). Please review the proposed `Registers` implementation below. Are we using an actual persistent database (like Postgres) for this phase, or continuing with in-memory stores for the MVP extension?

## Proposed Changes

### 1. Database & Backend Architecture (FastAPI)
- **New Data Models:** Implement models for Registers (Risk, Asset, Third-Party, etc.), Evidence links, and Traceability maps mapping Control IDs to both Policies and Register entries.
- **Enhanced Onboarding Endpoint:** Update `/compliance/onboarding` to not only create an organization profile but to auto-generate the *initial drafts* of mandatory registers based on the provided context (e.g., auto-populating initial AWS assets if AWS is selected as a cloud provider).
- **Export Bundle Endpoint:** Create a new `/compliance/export-audit-pack` endpoint that bundles the SoA, Policies (PDF/DOCX), and Registers (Excel) into a single downloadable `.zip` file.

### 2. Frontend UI Overhaul (React)

#### [MODIFY] `src/App.jsx`
- Replace `Policy Generator` navigation link with a broader `Compliance Artifacts` or split into `Policies` and `Registers`.
- Add a new `Export Audit Pack` section or floating action button.
- Ensure the COMPLAI branding (Navy/Teal) is applied exclusively to the app shell/dashboard UI.

#### [MODIFY] `src/pages/Onboarding.jsx`
- Expand the intake form to collect concrete asset and third-party data required to pre-populate the initial Asset Register and Third-Party Register.
- Clearly indicate to the user that completion generates their foundational ISMS/AIMS registers.

#### [NEW] `src/pages/Registers.jsx`
- Create a dynamic, multi-tab interface for managing:
  - Risk Register
  - Asset Register (Information & Systems)
  - Data Processing Register
  - Statement of Applicability (SoA)
- Build an editable grid/table UI (similar to Excel) for viewing and modifying these living documents.
- Allow downloading of these tables in high-def Excel formats.

#### [MODIFY] `src/pages/PolicyGenerator.jsx`
- **Strict Neutral Output Enforcement:** Ensure the UI generator output strips all COMPLAI SaaS branding. The generated documents must look like standard corporate documents with only a discrete watermark at the bottom.
- **Traceability View:** For every policy generated, display a "Traceability Matrix" section next to it, linking the policy to its relevant ISO Control ID and the newly created Register entries.

### 3. Traceability & Evidence Engine
- **Evidence Linking UI:** Modify the `Assessment` page to allow users to link specific Evidence documents (or text) to specific Controls, mapping them directly to the SoA.
- **Control Implementation Status:** Update the `Dashboard.jsx` to show a holistic view of the ISMS, not just policy generation status, but Register completeness and Evidence collection status.

## Verification Plan

### Automated Tests
- Run Python unit tests against the backend `gap_analysis_service` and new `register_service` to ensure onboarding context correctly maps to default Register entries.
- Verify the `/compliance/export-audit-pack` generates a valid ZIP containing unbranded PDFs and Excel files.

### Manual Verification
- **Auditor Simulation Test:** Walk through the app as an ISO auditor.
  1. Complete onboarding.
  2. Verify that the Dashboard instantly surfaces Risk and Asset registers.
  3. Verify that the generated Policies are explicitly neutral and map clearly back to ISO controls.
  4. Download the full Audit Pack and verify the SoA matches the generated registers.
