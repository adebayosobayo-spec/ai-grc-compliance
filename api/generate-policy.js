import Anthropic from '@anthropic-ai/sdk'
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  Header, Footer, PageNumber, BorderStyle, ShadingType,
} from 'docx'

export const config = { maxDuration: 120 }

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Policy catalogue ────────────────────────────────────────────
const POLICIES = {
  'ai-governance': {
    name: 'AI Governance Policy',
    filename: 'AI_Governance_Policy',
    clause: 'ISO 42001:2023 §4, §5, §6',
    brief: `Top-level AI management system governance policy. Must cover:
- Organisational context and stakeholder requirements (§4)
- Leadership commitment, AI policy statement, roles and responsibilities (§5)
- Planning: objectives, risk/opportunity identification, change management (§6)
- AI principles: fairness, transparency, accountability, human oversight, privacy
- Governance committee structure and escalation paths
- Policy compliance obligations and consequences
- Interface with corporate governance, ethics board, and legal`,
  },
  'risk-framework': {
    name: 'AI Risk Assessment Framework',
    filename: 'AI_Risk_Assessment_Framework',
    clause: 'ISO 42001:2023 §6.1, §8.4',
    brief: `Comprehensive AI risk methodology document. Must cover:
- Risk identification methodology specific to AI systems (bias, opacity, drift, misuse)
- Risk scoring matrix with likelihood × impact ratings (quantitative where possible)
- AI-specific risk taxonomy: technical, ethical, regulatory, reputational, operational
- Risk appetite statement and tolerance thresholds
- Risk treatment options: mitigate, accept, transfer, avoid
- Residual risk acceptance process and authority levels
- Continuous monitoring and risk register maintenance
- EU AI Act risk tier classification methodology
- Worked example risk assessment for one illustrative AI system`,
  },
  'incident-response': {
    name: 'AI Incident Response Plan',
    filename: 'AI_Incident_Response_Plan',
    clause: 'ISO 42001:2023 §8.3, §10.1',
    brief: `End-to-end AI incident management procedures. Must cover:
- Incident taxonomy: AI system failure, bias event, data poisoning, model theft, regulatory trigger
- Severity classification matrix (P0–P3) with response SLAs
- Detection and triage procedures
- Incident response team (IRT) roles and contact escalation tree
- Containment, eradication, and recovery playbooks per incident type
- Regulatory notification obligations (72h GDPR, AI Act Article 73 timelines)
- Evidence preservation and forensic requirements
- Post-incident review process and lessons learned
- Communication templates (internal, customer, regulator, media)
- Practice drill schedule`,
  },
  'transparency': {
    name: 'AI Transparency & Explainability Policy',
    filename: 'AI_Transparency_Explainability_Policy',
    clause: 'ISO 42001:2023 §8.5, §9.1; EU AI Act Art. 13, 14',
    brief: `Policy governing AI decision disclosure and explainability. Must cover:
- Disclosure obligations by AI risk tier (EU AI Act alignment)
- Explainability standards: what must be explainable and to whom
- Technical explainability methods approved for use (SHAP, LIME, attention, etc.)
- User rights: right to explanation, right to human review, right to contest
- Prohibited uses of AI without mandatory disclosure
- Documentation requirements for AI-assisted decisions
- Model cards and system cards requirements
- Auditability and logging obligations
- Third-party explainability audits`,
  },
  'data-governance': {
    name: 'AI Data Governance Policy',
    filename: 'AI_Data_Governance_Policy',
    clause: 'ISO 42001:2023 §8.2, §8.6; GDPR Art. 5, 22, 35',
    brief: `Training data and AI data lifecycle governance. Must cover:
- Data quality standards and acceptance criteria for AI training
- Bias identification and mitigation requirements
- Personal data use in AI: lawful basis, data minimisation, purpose limitation
- DPIA requirements for high-risk AI processing (GDPR Art. 35)
- Data provenance and lineage documentation
- Synthetic data and data augmentation controls
- Cross-border data transfer controls for AI training data
- Data retention, deletion, and right-to-erasure in AI contexts
- Data poisoning detection and prevention
- Vendor data processing terms for AI suppliers`,
  },
  'vendor-policy': {
    name: 'Third-Party AI Vendor Policy',
    filename: 'Third_Party_AI_Vendor_Policy',
    clause: 'ISO 42001:2023 §8.7; GDPR Art. 28',
    brief: `AI vendor risk management and procurement. Must cover:
- Vendor risk classification (critical, significant, standard)
- Pre-procurement due diligence checklist
- Mandatory contractual clauses for AI vendors
- Data processing agreement (DPA) requirements
- Security and penetration testing requirements
- AI model transparency and audit rights
- Sub-processor notification and approval process
- Ongoing vendor monitoring programme
- Performance SLAs and breach remedies
- Vendor exit plan and data return/deletion requirements
- Prohibited vendors and jurisdictions list`,
  },
  'readiness-report': {
    name: 'ISO 42001 Readiness Assessment Report',
    filename: 'ISO_42001_Readiness_Report',
    clause: 'ISO 42001:2023 — Full Standard',
    brief: `Executive readiness report for investors and auditors. Must cover:
- Executive summary with overall readiness score and rating
- Assessment methodology and scope
- Detailed clause-by-clause gap analysis (all major ISO 42001 clauses)
- Conformity table: each clause marked Conforming / Partially Conforming / Non-Conforming
- Risk heat map of identified gaps
- Prioritised remediation roadmap (90-day, 6-month, 12-month milestones)
- Resource and investment estimates per workstream
- Comparison against industry peers (anonymised benchmarks)
- Path to certification readiness
- Board-level attestation section`,
  },
}

// ── System prompt — the AI governance counsel persona ───────────
const SYSTEM_PROMPT = `You are a Principal AI Governance Counsel with 18 years of experience at a Tier 1 global law firm. You have personally drafted AI governance frameworks for over 200 companies across financial services, healthcare, SaaS, and enterprise AI sectors.

Your credentials:
- Contributing author to ISO/IEC JTC 1/SC 42 working group (ISO 42001)
- Former legal advisor to the UK AI Safety Institute
- Certified Information Privacy Professional (CIPP/E, CIPP/US)
- Co-author of the OECD Model AI Governance Framework guidance notes
- Advisor on EU AI Act implementation to three EU member states
- Expert witness in AI liability litigation at the UK High Court

Your policy documents are used as precedents in enterprise due diligence, regulatory investigations, and ISO certification audits. They have never been successfully challenged on quality, completeness, or legal accuracy.

WRITING STANDARDS YOU ALWAYS APPLY:
1. RFC 2119 modal verbs: SHALL (mandatory), SHALL NOT (prohibited), SHOULD (recommended), MAY (permitted) — used consistently and correctly throughout
2. Every obligation identifies: the responsible role, the action, the timeframe, and the consequence of non-compliance
3. Every section references the specific ISO 42001:2023 clause it satisfies in brackets, e.g., [ISO 42001 §6.1.2]
4. Where GDPR, EU AI Act, NIST AI RMF, or other regulations apply, include specific article/section references
5. No vague language: replace "appropriate", "reasonable efforts", "where possible" with specific thresholds, timeframes, or criteria
6. Tables for: RACI matrices, risk classifications, compliance mappings — do not describe these in prose when a table communicates better
7. Definitions section uses precise legal definitions, not plain-English descriptions
8. All policies are proportionate to company size and maturity — a 20-person startup does not need Fortune 500 bureaucracy, but must still meet the standard

OUTPUT FORMAT:
- Return the complete policy document in clean markdown
- Use # for document title, ## for major sections, ### for subsections, #### for sub-subsections
- Use **bold** for defined terms on first use in the definitions section
- Use tables with | syntax for RACI matrices and compliance mapping tables
- Use numbered lists for sequential procedures, bullet lists for non-sequential items
- Start directly with the document — no preamble, no explanation, no "here is the policy"`

// ── Build the per-policy user prompt ───────────────────────────
function buildPrompt(policyId, company, results, context) {
  const cfg = POLICIES[policyId]
  const gapLines = results.topGaps
    .map((g, i) => `  ${i + 1}. [${g.impact}] ${g.section} — ${g.question}`)
    .join('\n')
  const sectionLines = results.sectionScores
    .map(s => `  ${s.id} ${s.title}: ${s.score}%`)
    .join('\n')

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Build the enriched context block from intake wizard answers
  const ctxLines = []
  if (context) {
    if (context.aiDescription)
      ctxLines.push(`  What the AI does:       ${context.aiDescription}`)
    if (context.aiModels)
      ctxLines.push(`  AI models/services:     ${context.aiModels}`)
    if (context.jurisdictions?.length)
      ctxLines.push(`  Operating jurisdictions: ${context.jurisdictions.join(', ')}`)
    if (context.personalData)
      ctxLines.push(`  Personal data in AI:    ${context.personalData}`)
    if (context.reviewers?.length)
      ctxLines.push(`  Policy reviewers:       ${context.reviewers.join(', ')}`)
    if (context.timeline)
      ctxLines.push(`  Timeline / urgency:     ${context.timeline}`)
    if (context.existingDocs)
      ctxLines.push(`  Existing governance docs: ${context.existingDocs}${context.existingDocsDesc ? ' — ' + context.existingDocsDesc : ''}`)
    if (context.specificRequirements)
      ctxLines.push(`  Specific requirements:  ${context.specificRequirements}`)
  }

  return `Generate a complete, production-ready ${cfg.name} for the company below.

COMPANY PROFILE
  Name:            ${company.companyName}
  Industry:        ${company.industry}
  Size:            ${company.companySize} employees
  AI Systems:      ${company.numAISystems} deployed AI system(s)
  Contact:         ${company.email}

ENRICHED CONTEXT (from intake questionnaire — use this to make every section specific, not generic)
${ctxLines.length ? ctxLines.join('\n') : '  No additional context provided'}

ISO 42001 ASSESSMENT RESULTS
  Overall Score:   ${results.overallScore}%

  Section Scores:
${sectionLines}

  Priority Gaps (every gap MUST be addressed by a specific control in this policy):
${gapLines || '  None identified in this section'}

DOCUMENT MANDATE
  Applicable clause: ${cfg.clause}

  This document must cover:
${cfg.brief}

CRITICAL REQUIREMENTS
1. Document header SHALL include: Policy Name · Version 1.0 · Effective Date ${today} · Document Owner: AI Governance Lead · Classification: CONFIDENTIAL — INTERNAL · Next Review: ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
2. Every obligation uses RFC 2119 modal verbs (SHALL / SHALL NOT / SHOULD / MAY) correctly
3. Every major section cites the specific ISO 42001:2023 clause it satisfies, e.g. [ISO 42001 §6.1.2]
4. Where EU AI Act / GDPR / NIST apply (based on the jurisdictions above), cite specific articles
5. The Roles & Responsibilities section MUST be a RACI table — not prose
6. Each priority gap from the assessment MUST have a named control that closes it
7. Tailor all examples, thresholds, and roles to the ${company.industry} sector and the AI systems described
8. If the reviewer list includes investors or enterprise customers, ensure the tone and depth satisfy due diligence standards
9. If the reviewer list includes an ISO 42001 auditor, ensure complete clause coverage with no gaps
10. At least one measurable KPI per major section

This document will be used in live due diligence. Generate the complete, unabridged policy now.`
}

// ── Markdown → docx parser ──────────────────────────────────────
function parseInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)
  return parts
    .filter(p => p)
    .map(part => {
      if (part.startsWith('**') && part.endsWith('**'))
        return new TextRun({ text: part.slice(2, -2), bold: true, font: 'Calibri', size: 22 })
      if (part.startsWith('*') && part.endsWith('*'))
        return new TextRun({ text: part.slice(1, -1), italics: true, font: 'Calibri', size: 22 })
      if (part.startsWith('`') && part.endsWith('`'))
        return new TextRun({ text: part.slice(1, -1), font: 'Courier New', size: 20 })
      return new TextRun({ text: part, font: 'Calibri', size: 22 })
    })
}

function buildTableFromLines(lines) {
  const dataRows = lines.filter(l => !l.match(/^\s*\|[\s\-:|\s]+\|\s*$/))
  const rows = dataRows.map((line, ri) => {
    const cells = line.split('|').slice(1, -1).map(c => c.trim())
    return new TableRow({
      tableHeader: ri === 0,
      children: cells.map(cell => new TableCell({
        shading: ri === 0 ? { type: ShadingType.SOLID, color: '1e3a5f', fill: '1e3a5f' } : undefined,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({
            text: cell,
            bold: ri === 0,
            color: ri === 0 ? 'FFFFFF' : '1a1a2e',
            font: 'Calibri',
            size: ri === 0 ? 20 : 20,
          })],
        })],
      })),
    })
  })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top:           { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      bottom:        { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      left:          { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      right:         { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      insideH:       { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      insideV:       { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    },
    rows,
  })
}

function markdownToDocx(markdown) {
  const lines = markdown.split('\n')
  const elements = []
  let tableBuffer = []

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      elements.push(buildTableFromLines(tableBuffer))
      elements.push(new Paragraph({ text: '', spacing: { after: 120 } }))
      tableBuffer = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()

    // Table row
    if (line.startsWith('|')) {
      tableBuffer.push(line)
      continue
    }
    flushTable()

    if (!line) {
      elements.push(new Paragraph({ text: '', spacing: { after: 60 } }))
      continue
    }

    // Headings
    if (line.startsWith('#### ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_4,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: line.slice(5), bold: true, color: '374151', font: 'Calibri Light', size: 22 })],
      }))
    } else if (line.startsWith('### ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 100 },
        children: [new TextRun({ text: line.slice(4), bold: true, color: '1e3a5f', font: 'Calibri Light', size: 24 })],
      }))
    } else if (line.startsWith('## ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 120 },
        children: [new TextRun({ text: line.slice(3), bold: true, color: '0f2240', font: 'Calibri Light', size: 28 })],
      }))
    } else if (line.startsWith('# ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 480, after: 160 },
        children: [new TextRun({ text: line.slice(2), bold: true, color: '059669', font: 'Calibri Light', size: 36 })],
      }))
    }

    // Horizontal rule
    else if (line === '---' || line === '***' || line === '___') {
      elements.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
        spacing: { before: 160, after: 160 },
        text: '',
      }))
    }

    // Bullet list (- or *)
    else if (line.match(/^[-*]\s/)) {
      elements.push(new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 40, after: 40 },
        children: parseInline(line.slice(2)),
      }))
    }

    // Numbered list
    else if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, '')
      elements.push(new Paragraph({
        numbering: { reference: 'default-numbering', level: 0 },
        spacing: { before: 40, after: 40 },
        children: parseInline(text),
      }))
    }

    // Normal paragraph
    else {
      elements.push(new Paragraph({
        spacing: { before: 80, after: 80 },
        children: parseInline(line),
      }))
    }
  }

  flushTable()
  return elements
}

// ── Build the Word document ─────────────────────────────────────
function buildDocument(policyId, markdown, company) {
  const cfg = POLICIES[policyId]
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const titlePage = [
    new Paragraph({ text: '', spacing: { after: 1200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: company.companyName.toUpperCase(), bold: true, color: '059669', font: 'Calibri Light', size: 28, allCaps: true, characterSpacing: 80 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: cfg.name, bold: true, color: '0f2240', font: 'Calibri Light', size: 52 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: `Version 1.0  ·  ${today}`, color: '64748B', font: 'Calibri', size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: `CONFIDENTIAL — INTERNAL USE ONLY`, color: 'DC2626', font: 'Calibri', size: 20, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: `Applicable standard: ${cfg.clause}`, color: '94A3B8', font: 'Calibri', size: 18, italics: true })],
    }),
    new Paragraph({ text: '', pageBreakBefore: true }),
  ]

  const body = markdownToDocx(markdown)

  return new Document({
    numbering: {
      config: [{
        reference: 'default-numbering',
        levels: [{
          level: 0,
          format: 'decimal',
          text: '%1.',
          alignment: AlignmentType.START,
          style: { paragraph: { indent: { left: 360, hanging: 360 } } },
        }],
      }],
    },
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: '1a1a2e' },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
            children: [
              new TextRun({ text: `${company.companyName}  ·  ${cfg.name}`, font: 'Calibri', size: 18, color: '94A3B8' }),
              new TextRun({ text: `  |  CONFIDENTIAL`, font: 'Calibri', size: 18, color: 'DC2626', bold: true }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Page ', font: 'Calibri', size: 18, color: '94A3B8' }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 18, color: '94A3B8' }),
              new TextRun({ text: ' of ', font: 'Calibri', size: 18, color: '94A3B8' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Calibri', size: 18, color: '94A3B8' }),
              new TextRun({ text: `  ·  v1.0  ·  ${today}`, font: 'Calibri', size: 18, color: '94A3B8' }),
            ],
          })],
        }),
      },
      children: [...titlePage, ...body],
    }],
  })
}

// ── Main handler ────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { policyId, company, results, context } = req.body || {}

  if (!policyId || !POLICIES[policyId]) {
    return res.status(400).json({ error: `Unknown policy: ${policyId}` })
  }
  if (!company?.companyName || results?.overallScore === undefined) {
    return res.status(400).json({ error: 'Missing company or results data' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on the server. Add it to Vercel environment variables.' })
  }

  try {
    // Generate policy content with Claude — using enriched context from intake
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(policyId, company, results, context) }],
    })

    const markdown = message.content[0]?.text
    if (!markdown) throw new Error('Empty response from Claude')

    // Build Word document
    const doc = buildDocument(policyId, markdown, company)
    const buffer = await Packer.toBuffer(doc)

    const cfg = POLICIES[policyId]
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', `attachment; filename="${cfg.filename}_v1.0.docx"`)
    res.setHeader('Content-Length', buffer.length)
    res.status(200).send(buffer)

  } catch (err) {
    console.error('generate-policy error:', err)
    res.status(500).json({ error: err.message || 'Generation failed' })
  }
}
