# COMPLAI v1.0 - Build Prompt for Lovable
## Complete Product Specification

**Target**: Production-ready MVP  
**Platform**: Deploy on Vercel + Supabase  
**Audience**: AI startup CEOs (technical founders, 25-40, raising Series A)

---

## EXECUTIVE SUMMARY

Build **COMPLAI**: A self-assessment → gap analysis → policy generator platform that helps AI startup CEOs prove ISO 42001 readiness.

**Business Model**: Free assessment + gap report → $299 policy generator (conversion moment)

**Core Promise**: "Get your company ISO 42001-ready instead of spending months and $50K on consulting."

---

## PRODUCT VISION & USER JOURNEY

### The User Story
```
As: CEO of a 10-person AI startup
I want: To understand if my company is ISO 42001 compliant
So that: I can (a) pass investor due diligence, (b) not be blindsided in audits, (c) look governance-mature

Current pain: ISO 42001 feels abstract. I don't know what policies I need. Hiring a consultant costs $50K.

Solution: Take an assessment, see my gaps, download customized policies, export a professional report for investors.
```

### The Conversion Funnel
```
Landing Page
    ↓
Free Assessment
    ↓ (Get readiness score + gap report, still free)
    ↓
"Generate Your ISO 42001 Policies" Button (PAID)
    ↓
Stripe Payment ($299 one-time)
    ↓
Download Customized Policies (7 Word docs)
    ↓
Export PDF Report (for investors)
    ↓
[Optional] Subscribe to $29/mo policy updates
```

---

## FEATURE BREAKDOWN

### FEATURE 1: Landing Page (Free)
**Purpose**: CEO lands here, quickly understands value, clicks "Start Assessment"

**Elements**:
```
Header:
├─ COMPLAI logo
├─ Tagline: "ISO 42001 Readiness Assessment"
├─ CTA button: "Take Free Assessment"
└─ Social proof: "1,000+ AI startups have assessed their ISO 42001 readiness"

Hero Section:
├─ Problem: "Investors ask: Are you ISO 42001 compliant? Most AI startups say 'Uh...'"
├─ Solution: "COMPLAI gives you clarity and confidence"
└─ Visual: Screenshot of assessment results

How It Works:
├─ Step 1: Answer 40 questions
├─ Step 2: Get your readiness score & gaps
├─ Step 3: Download ISO 42001 policies ($299, one-time)
└─ Step 4: Show investors your governance proof (PDF)

Pricing Section:
├─ Assessment: Free
├─ Policy Generator: $299 one-time
├─ Policy Updates: $29/mo (optional)

FAQ:
├─ "What is ISO 42001?" (explain in CEO language)
├─ "Who needs ISO 42001?" (AI startups, especially pre-Series A)
├─ "Is this a real assessment?" (Yes, based on ISO 42001 controls)
├─ "Can I get a refund?" (30-day guarantee on policy generator)

Design:
├─ Color scheme: Professional (dark blue, clean white, accent color)
├─ Mobile-first responsive
├─ Dark mode support
└─ Tailwind CSS styling
```

---

### FEATURE 2: Assessment Questionnaire (Free)
**Purpose**: CEO takes 40 questions, answers map to ISO 42001 control readiness

**Flow**:
```
1. Sign Up / Log In
   ├─ Email: (required)
   ├─ Company Name: (required)
   ├─ Company Size: (1-10, 11-50, 51-200, 200+)
   ├─ Industry: (AI/ML, SaaS, Fintech, Healthtech, Other)
   ├─ Number of AI Systems: (1, 2-5, 6-10, 10+)
   └─ [Create Account / Sign In]

2. Multi-Step Assessment (6 sections, ~40 questions total)
   
   SECTION A: AI Governance & Leadership (6 questions)
   ├─ Q1: Do you have a documented AI policy? (Yes/No)
   ├─ Q2: Is there a designated AI governance owner? (Yes/No)
   ├─ Q3: Does your board/leadership formally review AI governance? (Yes/No/In Progress)
   ├─ Q4: Have you documented your AI system inventory? (Yes/No)
   ├─ Q5: Do you have incident response procedures for AI systems? (Yes/No)
   └─ Q6: Have you conducted an AI impact assessment? (Yes/No)
   
   SECTION B: Data Governance for AI (8 questions)
   ├─ Q1: Do you track data lineage for AI training data? (Yes/No)
   ├─ Q2: Do you have data quality standards? (Yes/No)
   ├─ Q3: Are you using personal data in your AI systems? (Yes/No)
   ├─ Q4: Do you have processes to remove biased training data? (Yes/No)
   ├─ Q5: Do you document all data sources used? (Yes/No)
   ├─ Q6: Is sensitive/regulated data properly governed? (Yes/No)
   ├─ Q7: Do you have data retention policies? (Yes/No)
   └─ Q8: Can you explain where AI decisions come from (explainability)? (Yes/No)
   
   SECTION C: AI System Development & Testing (8 questions)
   ├─ Q1: Do you test for AI model bias? (Yes/No)
   ├─ Q2: Do you perform adversarial testing? (Yes/No)
   ├─ Q3: Do you monitor model performance post-deployment? (Yes/No)
   ├─ Q4: Do you have version control for AI models? (Yes/No)
   ├─ Q5: Do you document model limitations and failure modes? (Yes/No)
   ├─ Q6: Is there human review before deployment? (Yes/No)
   ├─ Q7: Do you have rollback procedures if an AI system fails? (Yes/No)
   └─ Q8: Do you test for fairness/accuracy across demographics? (Yes/No)
   
   SECTION D: Deployment & Monitoring (8 questions)
   ├─ Q1: Do you monitor AI system performance in production? (Yes/No)
   ├─ Q2: Can you detect AI drift (changing performance over time)? (Yes/No)
   ├─ Q3: Do you have alerts for AI system failures? (Yes/No)
   ├─ Q4: Do you log decisions made by AI systems? (Yes/No)
   ├─ Q5: Can you quickly disable an AI system if needed? (Yes/No)
   ├─ Q6: Do you have change management for AI updates? (Yes/No)
   ├─ Q7: Do you document the reason for AI decisions? (Yes/No)
   └─ Q8: Do you have security controls around your AI models? (Yes/No)
   
   SECTION E: Third-Party AI Systems (6 questions)
   ├─ Q1: Do you use third-party AI (e.g., OpenAI, Claude API)? (Yes/No)
   ├─ Q2: Do you have contracts with AI vendors? (Yes/No)
   ├─ Q3: Do you understand how vendors use your data? (Yes/No)
   ├─ Q4: Do you assess vendor security & compliance? (Yes/No)
   ├─ Q5: Do you have data protection agreements (DPAs)? (Yes/No)
   └─ Q6: Do you know your AI vendors' data retention policies? (Yes/No)
   
   SECTION F: Ethics, Transparency & Compliance (4 questions)
   ├─ Q1: Do you have an AI ethics framework or policy? (Yes/No)
   ├─ Q2: Do you disclose to users when AI is making decisions? (Yes/No)
   ├─ Q3: Can users appeal AI decisions? (Yes/No)
   └─ Q4: Do you comply with GDPR/CCPA regarding AI? (Yes/No)

3. Progress Indicator
   ├─ Show: "Section 3 of 6" at top
   ├─ Visual: Progress bar (33%)
   └─ Estimate: "You're making great progress"
```

**Scoring Logic**:
```
For each question:
├─ "Yes" = 100% on that control
├─ "No" = 0% on that control
└─ "In Progress" = 50% on that control

Map answers to ISO 42001 Control Areas:
├─ Q answers in Section A → A.2 (AI Policy) + A.3 (Organization)
├─ Q answers in Section B → A.6 (Data Governance)
├─ Q answers in Section C → A.5 (AI System Lifecycle)
├─ Q answers in Section D → A.8 (Use of AI Systems)
├─ Q answers in Section E → A.9 (Third-Party AI)
└─ Q answers in Section F → A.7 (Transparency) + A.10 (Ethics)

Overall Score = (Total "Yes" answers / 40) × 100
Example: 18/40 "Yes" = 45% readiness

Per-Control Score = (Yes answers in that section / questions in section) × 100
Example: Section A has 6 questions, 4 "Yes" = 67% on A.2/A.3
```

---

### FEATURE 3: Results Dashboard - Gap Analysis (Free)
**Purpose**: CEO sees their readiness score and specific gaps

**Display** (after assessment completes):
```
Header:
├─ "Your ISO 42001 Readiness Score"
├─ Large number: 45% (overall score)
├─ Subtitle: "You're in the bottom 20% of AI startups. Let's fix that."
└─ Color coding: Red (<50%), Yellow (50-75%), Green (>75%)

Overall Score Breakdown (Visual):
├─ Donut chart or progress bar showing 45/100
├─ Interpretation: 
│  ├─ "Not Ready (0-25%): Urgent action needed"
│  ├─ "Developing (25-50%): Multiple gaps to address"
│  ├─ "Progressing (50-75%): Good foundation, refine"
│  └─ "Ready (75-100%): Investor-ready governance"
└─ Your Status: "DEVELOPING - Multiple gaps to address"

Control-by-Control Breakdown (Table/Cards):
├─ For each of 6 control areas, show:
│  ├─ Control name (e.g., "A.2: AI Governance & Leadership")
│  ├─ Readiness score (e.g., 50%)
│  ├─ Visual bar (green/yellow/red)
│  └─ Top gap in this area
│
├─ Control A.2 (AI Governance): 50%
│  └─ Missing: Documented AI policy
│
├─ Control A.6 (Data Governance): 25%
│  └─ Missing: Data quality standards, bias testing
│
├─ Control A.5 (AI Development): 40%
│  └─ Missing: Adversarial testing, model monitoring
│
├─ Control A.8 (Deployment & Monitoring): 30%
│  └─ Missing: Performance monitoring, drift detection
│
├─ Control A.9 (Third-Party AI): 60%
│  └─ Missing: Vendor contracts, DPAs
│
└─ Control A.7/A.10 (Ethics & Transparency): 55%
   └─ Missing: Ethics framework, user disclosure

Top 5 Gaps (Prioritized by Impact):
├─ 1. [CRITICAL] Data Governance Strategy
│     Impact: High (affects fairness, compliance)
│     Effort: Medium
│     Next step: Create data governance policy
│
├─ 2. [HIGH] AI Monitoring & Drift Detection
│     Impact: High (detect problems in production)
│     Effort: High
│     Next step: Implement model monitoring
│
├─ 3. [HIGH] Incident Response Procedures
│     Impact: High (required for ISO 42001)
│     Effort: Low
│     Next step: Write incident response playbook
│
├─ 4. [MEDIUM] Third-Party Vendor Agreements
│     Impact: Medium (compliance, data protection)
│     Effort: Low
│     Next step: Ensure all vendors have DPAs
│
└─ 5. [MEDIUM] AI Ethics & Bias Testing
      Impact: Medium (governance, user trust)
      Effort: Medium
      Next step: Define bias testing standards

Call-to-Action:
├─ Primary: "Generate Your ISO 42001 Policies ($299)"
│  └─ Subtitle: "Get 7 customized policies to address these gaps"
├─ Secondary: "Email me my assessment results"
│  └─ (Collect email for remarketing)
└─ Tertiary: "Share with my team" (link to PDF export)

Design Notes:
├─ Color code gaps: Red (critical), Orange (high), Yellow (medium)
├─ Use icons (checkmark, warning, clock) for quick scanning
├─ Mobile-responsive: Stack control cards vertically
└─ Print-friendly: PDF export should look professional
```

---

### FEATURE 4: Policy Generator (PAID - $299)
**Purpose**: CEO pays $299, downloads 7 customized ISO 42001 policies

**Trigger**:
```
User clicks "Generate Your ISO 42001 Policies" button
  ↓
Modal/Page appears: "Choose Your Plan"
  ├─ Option A: One-time policy generation ($299)
  │  └─ "Get all 7 policies + PDF report + email updates for 3 months"
  ├─ Option B: Monthly policy updates ($29/mo)
  │  └─ "Monthly policy updates as ISO 42001 evolves"
  └─ Option C: Combo ($299 + $29/mo)
     └─ "Best value: policies + monthly updates"

Selected: One-time ($299)
  ↓
Stripe Payment Form
  ├─ Email (pre-filled)
  ├─ Card number
  ├─ Expiry / CVC
  └─ Billing address (optional)
  ↓
Payment processed
  ↓
Success Page: "Generating your policies..."
  ↓
Download Page: 7 policy documents ready to download
```

**Policy Generator Logic**:
```
Input (from assessment):
├─ Company name: {{company_name}}
├─ Industry: {{industry}}
├─ Company size: {{company_size}}
├─ Number of AI systems: {{num_ai_systems}}
├─ Assessment answers: {{answers}}
└─ Specific gaps: {{top_gaps}}

Generate & Customize (7 policies):

1. AI GOVERNANCE POLICY
   Template sections:
   ├─ Purpose: "{{company_name}} commits to responsible AI development and deployment"
   ├─ Scope: "Applies to all AI systems used by {{company_name}}, including {{num_ai_systems}} internal systems and 3rd-party AI services"
   ├─ Roles & Responsibilities:
   │  ├─ AI Governance Owner (CFO, CTO, or dedicated person)
   │  ├─ AI Development Team (engineers)
   │  ├─ Data Team (data quality, bias testing)
   │  └─ Leadership/Board Review (formal review)
   ├─ AI System Approval Process: (2-step review before deployment)
   ├─ Incident Response: (procedures if AI system fails)
   ├─ Training & Awareness: (all employees know this policy)
   ├─ Policy Review: (regular review, or if ISO 42001 changes)
   └─ Approval: (signed by CEO & CFO)
   
   Status: Customized to {{company_name}}, {{industry}}
   Output: Word doc, 3-4 pages, ready to sign

2. DATA GOVERNANCE POLICY FOR AI
   Template sections:
   ├─ Purpose: "Define how {{company_name}} governs data for AI systems"
   ├─ Data Inventory: List of all data sources used in AI
   ├─ Data Quality Standards:
   │  ├─ Completeness: >95% of required fields populated
   │  ├─ Accuracy: Validated against source systems
   │  ├─ Timeliness: Updated regularly and consistently
   │  └─ Consistency: No conflicting values
   ├─ Bias Mitigation:
   │  ├─ Test for demographic bias (across race, gender, age groups)
   │  ├─ Monitor fairness metrics in production
   │  └─ Escalate to leadership if fairness drops >5%
   ├─ Data Privacy:
   │  ├─ Personal data must be encrypted at rest
   │  ├─ Data retention: Implement defined retention policy (unless legal hold)
   │  └─ GDPR/CCPA compliance for regulated data
   ├─ Data Access Controls: Only authorized employees can access training data
   └─ Training Data Documentation: Log source, quality, bias testing results
   
   Status: Customized to {{company_name}}'s data practices
   Output: Word doc, 4-5 pages

3. AI SYSTEM DEVELOPMENT & TESTING POLICY
   Template sections:
   ├─ Purpose: "Ensure all AI systems are tested before deployment"
   ├─ Testing Requirements:
   │  ├─ Functional Testing: Does the model make accurate predictions?
   │  ├─ Bias Testing: Are results fair across demographics?
   │  ├─ Adversarial Testing: Can the model be fooled?
   │  ├─ Explainability Testing: Can we explain model decisions?
   │  └─ Security Testing: Can the model be hacked?
   ├─ Model Documentation:
   │  ├─ Model version, training date, performance metrics
   │  ├─ Known limitations and failure modes
   │  ├─ Decision thresholds and confidence scores
   │  └─ Data lineage and training data description
   ├─ Version Control: All models stored with version history
   ├─ Approval Gate: Leadership sign-off required before deployment
   └─ Review Frequency: Regular model performance review
   
   Status: Customized to {{company_name}}'s AI systems
   Output: Word doc, 4-5 pages

4. AI SYSTEM DEPLOYMENT & MONITORING POLICY
   Template sections:
   ├─ Purpose: "Monitor AI systems in production and respond to failures"
   ├─ Deployment Checklist:
   │  ├─ All testing complete? Yes/No
   │  ├─ Documentation complete? Yes/No
   │  ├─ Incident response plan in place? Yes/No
   │  ├─ Monitoring configured? Yes/No
   │  └─ Leadership approval obtained? Yes/No
   ├─ Monitoring Requirements:
   │  ├─ Real-time dashboards tracking:
   │  │  ├─ Prediction accuracy (baseline vs. current)
   │  │  ├─ Fairness metrics (bias by demographic)
   │  │  ├─ Data drift (input distribution changes)
   │  │  └─ Model drift (output distribution changes)
   │  ├─ Automated checks for anomalies
   │  └─ Regular manual review of metrics
   ├─ Incident Response:
   │  ├─ If accuracy drops >10%, pause the model
   │  ├─ Investigate root cause
   │  ├─ Communicate impact to stakeholders
   │  └─ Deploy fix and resume
   ├─ Change Management: Any model update requires testing + approval
   └─ Logging: All AI decisions logged for audit trail
   
   Status: Customized to {{company_name}}'s deployment infrastructure
   Output: Word doc, 4-5 pages

5. THIRD-PARTY AI VENDOR POLICY
   Template sections:
   ├─ Purpose: "Govern use of third-party AI systems (OpenAI, Claude, etc.)"
   ├─ Vendor Approval Process:
   │  ├─ Before using vendor's AI, evaluate:
   │  ├─ Security: How is our data protected?
   │  ├─ Privacy: Does vendor use our data for training?
   │  ├─ Compliance: Does vendor meet legal requirements?
   │  └─ Contract: Do we have a Data Processing Agreement?
   ├─ Approved Vendors (fill in as you evaluate):
   │  ├─ OpenAI (ChatGPT) - approved for internal use only
   │  ├─ Anthropic (Claude) - approved for customer-facing features
   │  └─ [Add your vendors]
   ├─ Data Protection:
   │  ├─ No personal data to be sent to vendors without DPA
   │  ├─ Confidential data must be encrypted before sending
   │  └─ Vendor must encrypt data at rest & in transit
   ├─ Monitoring:
   │  ├─ Regular review of vendor security & compliance
   │  ├─ Check for data breaches or security incidents
   │  └─ Review of vendor's AI model updates/changes
   └─ Escalation: Vendor breach → immediate executive notification
   
   Status: Customized with {{company_name}}'s actual AI vendors
   Output: Word doc, 3-4 pages

6. AI ETHICS & BIAS MITIGATION POLICY
   Template sections:
   ├─ Purpose: "Ensure {{company_name}}'s AI systems are ethical and fair"
   ├─ Ethics Principles:
   │  ├─ Fairness: AI decisions should not discriminate
   │  ├─ Transparency: Users should know when AI is deciding
   │  ├─ Accountability: We can explain and defend AI decisions
   │  └─ Privacy: Personal data used responsibly
   ├─ Bias Testing & Monitoring:
   │  ├─ Test model for bias across protected characteristics (race, gender, age, etc.)
   │  ├─ Measure fairness metrics (equal opportunity, demographic parity)
   │  ├─ Monitor fairness in production
   │  └─ Alert if fairness drops below threshold
   ├─ User Transparency:
   │  ├─ Disclose: "This decision was made by AI" if yes
   │  ├─ Explain: Why was this decision made?
   │  ├─ Recourse: How can users appeal AI decisions?
   │  └─ Example: "We use an AI model to assess creditworthiness. It considers your income, credit history, and employment. You can appeal any decision by contacting [email]."
   ├─ Escalation:
   │  ├─ Suspected bias found → report to AI Governance Owner
   │  ├─ Systemic bias found → pause the model, investigate
   │  └─ Bias incident → disclose to affected users if required
   └─ Training: All employees trained on AI ethics
   
   Status: Customized to {{company_name}}'s AI products
   Output: Word doc, 4-5 pages

7. INCIDENT RESPONSE POLICY FOR AI SYSTEMS
   Template sections:
   ├─ Purpose: "Respond quickly to AI system failures or incidents"
   ├─ Types of Incidents:
   │  ├─ Performance failure (accuracy drops suddenly)
   │  ├─ Security incident (model or data compromised)
   │  ├─ Bias incident (unfair decision detected)
   │  ├─ Data breach (personal data exposed)
   │  └─ Compliance incident (violates regulation)
   ├─ Response Procedures:
   │  ├─ Tier 1 (Critical): Accuracy drops >20%
   │  │  ├─ Action: Immediately pause the model
   │  │  ├─ Notify: CEO, CTO, General Counsel urgently
   │  │  ├─ Investigate: Root cause analysis
   │  │  └─ Communicate: Update to all stakeholders
   │  │
   │  ├─ Tier 2 (High): Accuracy drops 10-20%
   │  │  ├─ Action: Reduce traffic to model by 50%
   │  │  ├─ Notify: AI Governance Owner promptly
   │  │  ├─ Investigate: Root cause analysis
   │  │  └─ Fix: Deploy fix, retest, resume
   │  │
   │  └─ Tier 3 (Medium): Accuracy drops 5-10%
   │     ├─ Action: Monitor closely
   │     ├─ Notify: AI team lead
   │     ├─ Investigate: Root cause analysis
   │     └─ Plan: Fix and schedule deployment
   │
   ├─ Post-Incident:
   │  ├─ Root cause analysis: What went wrong?
   │  ├─ Impact assessment: How many users affected?
   │  ├─ Remediation: Fix deployed, verified
   │  ├─ Notification: External communication if needed
   │  ├─ Documentation: Incident report filed
   │  └─ Prevention: Update processes to prevent recurrence
   │
   └─ Contacts:
      ├─ AI Governance Owner: [Name, email, phone]
      ├─ Security Lead: [Name, email, phone]
      ├─ Legal: [Name, email, phone]
      └─ External notification (if required): [Email template]
   
   Status: Customized with {{company_name}}'s contact info
   Output: Word doc, 3-4 pages

Output Format:
├─ Each policy: 3-5 page Word document (.docx)
├─ Pre-filled with company name, industry, AI systems
├─ Sections marked [FILL IN]: CEO/CTO to customize with actual practices
├─ Ready to sign and file
└─ All 7 policies zipped for download
```

---

### FEATURE 5: PDF Export (Free)
**Purpose**: CEO exports professional "ISO 42001 Readiness Report" to share with investors

**Trigger**: "Export & Share" button on results dashboard

**Content** (single PDF, 8-12 pages):
```
Page 1: Cover Page
├─ {{company_name}}
├─ ISO 42001 Readiness Assessment Report
├─ Assessment Date: [date]
├─ Generated by: COMPLAI
└─ CONFIDENTIAL

Page 2: Executive Summary
├─ Overall Readiness Score: 45%
├─ Status: Developing (multiple gaps to address)
├─ Key strengths: (auto-generated from assessment)
│  ├─ "Strong third-party vendor management (60% ready)"
│  └─ "Good awareness of need for AI governance"
├─ Key gaps: (auto-generated from assessment)
│  ├─ "Minimal monitoring in production"
│  ├─ "No formal data governance process"
│  └─ "Limited bias testing"
└─ Recommended next steps: (top 3 from gap analysis)

Page 3-4: Control-by-Control Assessment
├─ Table showing all 6 control areas:
│  ├─ Control | Readiness | Status | Key Gap
│  ├─ A.2: AI Governance & Leadership | 50% | Developing | Needs documented AI policy
│  ├─ A.6: Data Governance | 25% | Critical | No data quality standards
│  ├─ A.5: AI Development & Testing | 40% | Developing | Limited bias testing
│  ├─ A.8: Deployment & Monitoring | 30% | Critical | No monitoring in production
│  ├─ A.9: Third-Party AI | 60% | Progressing | Missing DPA with 1 vendor
│  └─ A.7/A.10: Ethics & Transparency | 55% | Developing | Need ethics framework

Page 5: Detailed Gap Analysis
├─ Top 5 Gaps (detailed version of results dashboard)
└─ For each gap: Impact, Effort, Recommended remediation

Page 6: Implementation Roadmap (auto-generated)
├─ Phase 1: Quick wins
│  ├─ [ ] Write AI Governance Policy (effort: low)
│  ├─ [ ] Create Data Governance Policy (effort: low)
│  └─ [ ] Set up incident response procedures (effort: low)
│  Effort: Low | Owner: {{cto_name}}
│
├─ Phase 2: Data & Testing
│  ├─ [ ] Implement bias testing for AI models (effort: high)
│  ├─ [ ] Create data quality standards (effort: medium)
│  └─ [ ] Set up model monitoring dashboard (effort: high)
│  Effort: High | Owner: {{data_team}}
│
└─ Phase 3: Monitoring & Compliance
   ├─ [ ] Deploy production monitoring (effort: high)
   ├─ [ ] Finalize vendor agreements & DPAs (effort: medium)
   ├─ [ ] Create ethics framework & user transparency (effort: low)
   └─ [ ] Full readiness assessment (effort: low)
   Effort: Medium | Owner: {{governance_owner}}

Page 7: Methodology
├─ Assessment scope: 40 questions across 6 ISO 42001 control areas
├─ Scoring: Yes = 100%, No = 0%, In Progress = 50%
├─ Control mapping: [how questions map to ISO 42001 controls]
├─ Limitations: This is a self-assessment, not an audit
└─ Note: For formal ISO 42001 certification, hire an external auditor

Page 8: About COMPLAI
├─ What is COMPLAI? (2 paragraphs)
├─ How to use this report:
│  ├─ Internal: Share with leadership, AI team, board
│  ├─ External: Show to investors (demonstrates governance maturity)
│  └─ Auditors: Provide as baseline for ISO 42001 audit
├─ Next steps: Generate policies ($299) to address gaps
└─ Support: Email us if you have questions

Design:
├─ Professional formatting (header/footer, page numbers)
├─ Company branding (logo if available)
├─ Charts & visuals (readiness bars, roadmap timeline)
├─ Color-coded sections (red/yellow/green for status)
└─ Print-friendly (works on standard printer)
```

---

### FEATURE 6: Email Automation
**Purpose**: Capture email, nurture, convert to paid

**Flows**:

```
Flow 1: Assessment Complete
├─ Trigger: User finishes assessment
├─ Email subject: "Your ISO 42001 Readiness Score: 45%"
├─ Email body:
│  ├─ Hi {{first_name}},
│  ├─ You just completed the ISO 42001 readiness assessment.
│  ├─ Your score: 45% (Developing)
│  ├─ Your biggest gap: Data governance strategy
│  ├─ [View your full results](#)
│  ├─ Next step: Generate your customized ISO 42001 policies ($299)
│  ├─ [Generate Policies](#)
│  └─ Questions? Reply to this email.
├─ Send: Upon assessment completion
└─ Segment: All assessment takers

Flow 2: Abandoned Assessment (No Email Captured)
├─ Trigger: User starts assessment but doesn't complete
├─ Email subject: "You're 25% done with your ISO 42001 assessment—finish to get your score"
├─ Email body:
│  ├─ We noticed you started the assessment but didn't finish.
│  ├─ Complete it to get your readiness score and gap analysis.
│  ├─ [Resume Assessment](#)
│  └─ Your progress is saved—pick up where you left off.
└─ Segment: Users who don't complete assessment

Flow 3: Assessment Completed, Not Yet Purchased
├─ Trigger: User completed assessment, has not purchased policies
├─ Email 1 (Initial Follow-up):
│  ├─ Subject: "{{company_name}}'s biggest ISO 42001 gap (and how to fix it)"
│  ├─ Body: Highlight top 1 gap with remediation hint
│  └─ CTA: [Generate Policies ($299)](#)
│
├─ Email 2 (Follow-up):
│  ├─ Subject: "Investors are asking about AI governance—here's your answer"
│  ├─ Body: Position policies as investor-ready proof
│  └─ CTA: [Download Policies ($299)](#)
│
└─ Email 3 (Final Offer):
   ├─ Subject: "ISO 42001 policies at a special offer"
   ├─ Body: "Get your policies now with a special discount"
   └─ CTA: [Claim Offer](#)
└─ Segment: Assessment takers, non-buyers

Flow 4: After Purchase
├─ Trigger: User completes payment
├─ Email subject: "Your 7 ISO 42001 Policies Are Ready—Download Now"
├─ Email body:
│  ├─ Hi {{first_name}},
│  ├─ Thank you for purchasing COMPLAI ISO 42001 Policies!
│  ├─ [Download All 7 Policies](#)
│  ├─ Next: Customize the policies to match your company practices
│  ├─ Share with: CEO, CFO, CTO, General Counsel
│  ├─ Questions about the policies?
│  └─ Reply to this email for support.
├─ Send: Upon payment completion
└─ Segment: All purchasers

Flow 5: Policy Update (Optional Paid Subscribers)
├─ Trigger: User subscribed to $29/mo policy updates
├─ Frequency: Regular updates as standards evolve
├─ Email subject: "Your ISO 42001 Policy Update"
├─ Email body:
│  ├─ Hi {{first_name}},
│  ├─ ISO 42001 continues to evolve. Here's what's new:
│  ├─ New control interpretation: [control & update]
│  ├─ Policy change recommended: [which policy & why]
│  ├─ [Review Updated Policy](#)
│  └─ Questions? Reply to this email.
├─ Send: When updates are available
└─ Segment: Paid subscribers only
```

---

## TECHNICAL SPECIFICATIONS

### Frontend Stack
```
Framework: React 18 (existing)
Styling: Tailwind CSS (existing)
Routing: React Router v6 (existing)
Forms: React Hook Form + Zod validation
State: Context API or Zustand
HTTP: Axios (existing)
PDF Generation: jsPDF + html2pdf
UI Components: shadcn/ui or custom Tailwind

Key Pages:
├─ / (Landing)
├─ /assessment (Assessment flow)
├─ /results (Gap analysis & policy purchase)
├─ /policies (Policy download page)
├─ /dashboard (User dashboard - optional Phase 2)
└─ /auth (Sign up / Log in)
```

### Backend Stack
```
Framework: FastAPI (existing)
Database: Supabase PostgreSQL
File Storage: S3 (for policy files, optional)
Payments: Stripe
Email: SendGrid or Resend
Authentication: Supabase Auth (existing)

Key Endpoints:
├─ POST /auth/signup
├─ POST /auth/login
├─ POST /assessment/start
├─ POST /assessment/submit
├─ GET /assessment/:id/results
├─ POST /policies/generate
├─ POST /checkout/create-session (Stripe)
├─ POST /checkout/webhook (Stripe payment webhook)
└─ POST /email/send
```

### Database Schema
```
Tables:
├─ users
│  ├─ id (UUID)
│  ├─ email (unique)
│  ├─ company_name
│  ├─ company_size
│  ├─ industry
│  ├─ created_at
│  └─ stripe_customer_id
│
├─ assessments
│  ├─ id (UUID)
│  ├─ user_id (FK)
│  ├─ assessment_data (JSON: {q1: 'yes', q2: 'no', ...})
│  ├─ readiness_score (0-100)
│  ├─ control_scores (JSON: {A.2: 50, A.6: 25, ...})
│  ├─ created_at
│  └─ updated_at
│
├─ purchases
│  ├─ id (UUID)
│  ├─ user_id (FK)
│  ├─ stripe_payment_intent_id
│  ├─ amount (USD cents)
│  ├─ product_type ('policies' or 'monthly_subscription')
│  ├─ status ('completed', 'failed')
│  ├─ created_at
│  └─ metadata (JSON)
│
└─ email_logs
   ├─ id (UUID)
   ├─ user_id (FK)
   ├─ email_type ('assessment_complete', 'purchase_reminder', etc.)
   ├─ sent_at
   └─ status ('sent', 'bounced', 'complained')
```

---

## DESIGN SPECIFICATIONS

### Color Scheme
```
Primary: #1e40af (Professional dark blue)
Secondary: #10b981 (Trust green)
Accent: #f59e0b (Action orange)
Danger: #ef4444 (Red for critical gaps)
Neutral: #f3f4f6 (Light gray), #1f2937 (Dark gray)

Text:
├─ Primary text: #1f2937
├─ Secondary text: #6b7280
└─ On dark bg: #f9fafb

Readiness Levels:
├─ <25% (Critical): #ef4444 (red)
├─ 25-50% (Developing): #f59e0b (orange)
├─ 50-75% (Progressing): #3b82f6 (blue)
└─ 75-100% (Ready): #10b981 (green)
```

### Typography
```
Font family: Inter, system-ui
Scale:
├─ H1: 32px, weight 700 (landing title)
├─ H2: 24px, weight 600 (section titles)
├─ H3: 18px, weight 600 (subsection)
├─ Body: 16px, weight 400 (default)
└─ Small: 12px, weight 400 (helper text)
```

### Layout
```
Mobile: 320px
Tablet: 768px
Desktop: 1024px+

Spacing: 4px grid (4, 8, 12, 16, 24, 32, 48, 64)
Border radius: 8px (input), 12px (cards)
Shadows: Subtle (box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1))
```

### Accessibility
```
WCAG 2.1 AA:
├─ Color contrast: >4.5:1 for text
├─ Interactive elements: min 44x44px touch target
├─ Keyboard navigation: Tab through all controls
├─ Focus indicators: Visible outline on focus
├─ Alt text: All images have alt text
└─ Forms: Labels associated with inputs
```

---

## MONETIZATION & STRIPE INTEGRATION

### Pricing
```
Assessment: Free
Policy Generator (one-time): $299
Policy Updates (monthly): $29/mo
```

### Stripe Setup
```
Products:
├─ "ISO 42001 Policies (One-Time)" = $299
│  └─ Description: "7 customized ISO 42001 policies for your company"
│
└─ "ISO 42001 Policy Updates (Monthly)" = $29/mo
   └─ Description: "Monthly policy updates as the standard evolves"

Webhook Events:
├─ charge.succeeded → Send policy download email + create purchase record
├─ charge.failed → Send payment failed email
└─ customer.subscription.deleted → Cancel monthly updates

Email on purchase success:
├─ Subject: "Your 7 ISO 42001 Policies Are Ready—Download Now"
├─ Body: Policy download link + next steps
└─ Attachment: None (link provides persistent access, user downloads anytime)
```

---

## SUCCESS METRICS & ANALYTICS

### Tracking (via Supabase + manual email log)
```
Acquisition:
├─ Landing page visitors (not tracked yet; assume organic)
├─ Assessment starts (Supabase query)
├─ Assessment completions (Supabase query)
├─ Unique emails (email table)
└─ Paid customers (purchases table)

Conversion:
├─ Assessment completion rate = completions / starts
├─ Purchase rate = purchases / completed assessments
├─ CAC = $0 (no paid acquisition yet)
└─ Example: 100 starts → 70 completions → 10 purchases = 14% conversion

Retention (Phase 2):
├─ Monthly subscription signups (future)
├─ Monthly churn rate (future)
└─ NPS (future)
```

### Target Metrics (Initial Launch Phase)
```
ACQUISITION:
├─ Free assessments completed: 500+
├─ Paid customers: 50+ (10% conversion)
└─ Revenue: $14,950+ (50 × $299)

QUALITY:
├─ Assessment completion rate: >70%
├─ Customer satisfaction: NPS >40
└─ Support tickets: <5

PRODUCT:
├─ Uptime: 99.9%
├─ Page load time: <2 seconds
└─ Zero critical bugs
```

---

## HANDOFF TO ENGINEERING

**Build this as:**
1. **Scope**: Assessment + Gap Analysis + Policy Generator + PDF Export + Stripe integration (MVP)
2. **Stack**: React frontend + FastAPI backend + Supabase + Stripe
3. **Quality**: Polished, bug-free, investor-ready
4. **Success Metrics**: 100+ free assessments, 10+ paid customers in first period

**Key success factors:**
- Keep scope tight (7 policies, 15 controls, not all 38)
- Pre-write all content (policy templates, questions, gaps) before eng starts building
- Test payment flow thoroughly (Stripe webhook, email confirmation)
- Mobile-first design (CEOs on iPhone)
- Professional polish (this is investor-facing)

---

## APPENDIX: ISO 42001 - 15 CORE CONTROLS FOR MVP

**Control A.2: AI Policy**
├─ What: Documented policy on responsible AI development & use
├─ Why: Investors expect written governance
└─ Evidence: Policy document, board approval

**Control A.3: Organization & Roles**
├─ What: Designated AI governance owner, clear roles
├─ Why: No accountability without ownership
└─ Evidence: Org chart, role descriptions, decision logs

**Control A.4: Resources**
├─ What: Budget, tools, training for AI governance
├─ Why: Governance requires investment
└─ Evidence: Budget allocation, tool licenses, training records

**Control A.5: AI System Lifecycle**
├─ What: Processes for AI development, testing, deployment, monitoring
├─ Why: Quality requires process
└─ Evidence: Development procedures, test results, deployment logs

**Control A.6: Data Governance**
├─ What: Data quality standards, bias testing, data privacy
├─ Why: Bad data = bad AI
└─ Evidence: Data quality metrics, bias test results, retention policies

**Control A.7: System Transparency**
├─ What: Explainability of AI decisions, documentation
├─ Why: Users have right to know "why"
└─ Evidence: Model cards, decision explanations, user-facing transparency

**Control A.8: Use of AI Systems**
├─ What: Monitoring, incident response, human oversight
├─ Why: Things break; need fast response
└─ Evidence: Monitoring dashboards, incident logs, escalation procedures

**Control A.9: Third-Party AI**
├─ What: Vendor risk management, contracts, data protection
├─ Why: Third-party breaches are your liability
└─ Evidence: Vendor contracts, DPAs, security assessments

**Control A.10: Ethics & Bias**
├─ What: Bias mitigation, fairness testing, ethics framework
├─ Why: Unfair AI kills company & user trust
└─ Evidence: Bias test results, fairness metrics, ethics approvals

**[6 more controls for full 15 - similar format]**

---

**END OF PROMPT**

---

## HOW LOVABLE SHOULD USE THIS PROMPT

1. **Read sections 1-3 first** (Vision, Journey, Features) to understand the product
2. **Build in order of features** (Landing → Assessment → Results → Policy Generator → PDF → Stripe)
3. **Use the DB schema** (section Technical) for Supabase setup
4. **Copy design specs** (section Design) into Figma or Tailwind config
5. **Reference the ISO 42001 content** (section Appendix) for policy templates & questions
6. **Test the full flow** (section Checklist) before launch

**Questions for Lovable?** All answers are in this prompt. If missing, ask the CEO.

**Ready to build?** You have everything you need. Go fast. Execute with precision.

---

**Document Version**: 1.0  
**Status**: Ready for Engineering
