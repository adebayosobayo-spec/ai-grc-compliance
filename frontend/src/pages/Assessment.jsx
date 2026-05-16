import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export const SECTIONS = [
  {
    id: 'A', title: 'AI Governance & Leadership', control: 'A.2 / A.3',
    description: 'Policies, designated owners, and leadership accountability for AI systems.',
    questions: [
      { id: 'A1', text: 'Do you have a documented AI policy?' },
      { id: 'A2', text: 'Is there a designated AI governance owner?' },
      { id: 'A3', text: 'Does your board/leadership formally review AI governance?' },
      { id: 'A4', text: 'Have you documented your AI system inventory?' },
      { id: 'A5', text: 'Do you have incident response procedures for AI systems?' },
      { id: 'A6', text: 'Have you conducted an AI impact assessment?' },
    ],
  },
  {
    id: 'B', title: 'Data Governance for AI', control: 'A.6',
    description: 'Managing, quality-checking, and protecting your AI training data.',
    questions: [
      { id: 'B1', text: 'Do you track data lineage for AI training data?' },
      { id: 'B2', text: 'Do you have data quality standards?' },
      { id: 'B3', text: 'Are you using personal data in your AI systems?' },
      { id: 'B4', text: 'Do you have processes to remove biased training data?' },
      { id: 'B5', text: 'Do you document all data sources used?' },
      { id: 'B6', text: 'Is sensitive/regulated data properly governed?' },
      { id: 'B7', text: 'Do you have data retention policies?' },
      { id: 'B8', text: 'Can you explain where AI decisions come from (explainability)?' },
    ],
  },
  {
    id: 'C', title: 'AI System Development & Testing', control: 'A.5',
    description: 'Testing rigor, version control, and deployment gates before release.',
    questions: [
      { id: 'C1', text: 'Do you test for AI model bias?' },
      { id: 'C2', text: 'Do you perform adversarial testing?' },
      { id: 'C3', text: 'Do you monitor model performance post-deployment?' },
      { id: 'C4', text: 'Do you have version control for AI models?' },
      { id: 'C5', text: 'Do you document model limitations and failure modes?' },
      { id: 'C6', text: 'Is there human review before deployment?' },
      { id: 'C7', text: 'Do you have rollback procedures if an AI system fails?' },
      { id: 'C8', text: 'Do you test for fairness/accuracy across demographics?' },
    ],
  },
  {
    id: 'D', title: 'Deployment & Monitoring', control: 'A.8',
    description: 'Production monitoring, drift detection, and incident response.',
    questions: [
      { id: 'D1', text: 'Do you monitor AI system performance in production?' },
      { id: 'D2', text: 'Can you detect AI drift (changing performance over time)?' },
      { id: 'D3', text: 'Do you have alerts for AI system failures?' },
      { id: 'D4', text: 'Do you log decisions made by AI systems?' },
      { id: 'D5', text: 'Can you quickly disable an AI system if needed?' },
      { id: 'D6', text: 'Do you have change management for AI updates?' },
      { id: 'D7', text: 'Do you document the reason for AI decisions?' },
      { id: 'D8', text: 'Do you have security controls around your AI models?' },
    ],
  },
  {
    id: 'E', title: 'Third-Party AI Systems', control: 'A.9',
    description: 'Vendor risk management, contracts, and data protection agreements.',
    questions: [
      { id: 'E1', text: 'Do you use third-party AI (e.g., OpenAI, Claude API)?' },
      { id: 'E2', text: 'Do you have contracts with AI vendors?' },
      { id: 'E3', text: 'Do you understand how vendors use your data?' },
      { id: 'E4', text: 'Do you assess vendor security & compliance?' },
      { id: 'E5', text: 'Do you have data protection agreements (DPAs)?' },
      { id: 'E6', text: "Do you know your AI vendors' data retention policies?" },
    ],
  },
  {
    id: 'F', title: 'Ethics, Transparency & Compliance', control: 'A.7 / A.10',
    description: 'Ethical AI framework, user disclosure, and regulatory compliance.',
    questions: [
      { id: 'F1', text: 'Do you have an AI ethics framework or policy?' },
      { id: 'F2', text: 'Do you disclose to users when AI is making decisions?' },
      { id: 'F3', text: 'Can users appeal AI decisions?' },
      { id: 'F4', text: 'Do you comply with GDPR/CCPA regarding AI?' },
    ],
  },
]

const COMPANY_SIZES = ['1–10', '11–50', '51–200', '200+']
const INDUSTRIES    = ['AI/ML', 'SaaS', 'Fintech', 'Healthtech', 'Other']
const AI_SYSTEMS    = ['1', '2–5', '6–10', '10+']

export function computeResults(companyInfo, answers) {
  const TOTAL_Q = 40
  let totalPoints = 0
  Object.values(answers).forEach(v => {
    if (v === 'yes') totalPoints += 1
    else if (v === 'in_progress') totalPoints += 0.5
  })
  const overallScore = Math.round((totalPoints / TOTAL_Q) * 100)
  const GAP_PRIORITY = { B: 1, D: 2, A: 3, C: 4, E: 5, F: 6 }
  const IMPACT_LABEL  = { B: 'CRITICAL', D: 'CRITICAL', A: 'HIGH', C: 'HIGH', E: 'MEDIUM', F: 'MEDIUM' }
  const sectionScores = SECTIONS.map(section => {
    let points = 0; const gaps = []
    section.questions.forEach(q => {
      const v = answers[q.id]
      if (v === 'yes') points += 1
      else if (v === 'in_progress') points += 0.5
      else gaps.push(q.text)
    })
    return { ...section, score: Math.round((points / section.questions.length) * 100), gaps }
  })
  const allGaps = []
  sectionScores.forEach(s => s.gaps.forEach(g => allGaps.push({
    section: s.id, sectionTitle: s.title, question: g,
    priority: GAP_PRIORITY[s.id], impact: IMPACT_LABEL[s.id],
  })))
  allGaps.sort((a, b) => a.priority - b.priority)
  return { overallScore, sectionScores, topGaps: allGaps.slice(0, 5) }
}

/* ── icons ─────────────────────────────────────────────────────── */
function ArrowRight({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ArrowLeft({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Floating progress pill ─────────────────────────────────────── */
function ProgressNav({ step, totalSteps }) {
  const pct = Math.round(((step + 1) / totalSteps) * 100)
  return (
    <nav style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 50, width: 'min(600px, calc(100vw - 32px))',
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '8px 12px 8px 20px',
      background: 'rgba(9,15,28,0.80)',
      backdropFilter: 'blur(20px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 999,
      boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.35)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>C</span>
        </div>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: '#fff', display: 'none' }} className="sm:inline">COMPLAI</span>
      </Link>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
            {step === 0 ? 'Company info' : `Section ${step} of ${totalSteps - 1}`}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>Free</span>
    </nav>
  )
}

/* ── Field label ────────────────────────────────────────────────── */
function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7, letterSpacing: '0.04em' }}>
      {children} <span style={{ color: '#ef4444' }}>*</span>
    </label>
  )
}

/* ── Step 0 — company info ──────────────────────────────────────── */
function CompanyInfoStep({ info, onChange, onNext }) {
  const valid = info.email && info.companyName && info.companySize && info.industry && info.numAISystems
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '120px 24px 60px' }} className="page-enter">
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.08)', color: '#93b4fd', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 18 }}>
          Step 1 of 7
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Tell us about your company
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-sub)', margin: 0, lineHeight: 1.65 }}>
          We use this to personalise your results and pre-fill your policies.
        </p>
      </div>

      <div className="bezel">
        <div className="bezel-inner" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <FieldLabel htmlFor="email">Work email</FieldLabel>
            <input id="email" type="email" required placeholder="you@company.com"
              value={info.email} onChange={e => onChange('email', e.target.value)}
              className="input-premium" />
          </div>
          <div>
            <FieldLabel htmlFor="companyName">Company name</FieldLabel>
            <input id="companyName" type="text" required placeholder="Acme AI, Inc."
              value={info.companyName} onChange={e => onChange('companyName', e.target.value)}
              className="input-premium" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <FieldLabel htmlFor="companySize">Company size</FieldLabel>
              <div style={{ position: 'relative' }}>
                <select id="companySize" value={info.companySize} onChange={e => onChange('companySize', e.target.value)} className="select-premium">
                  <option value="" disabled>Select…</option>
                  {COMPANY_SIZES.map(o => <option key={o} value={o}>{o} employees</option>)}
                </select>
                <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="industry">Industry</FieldLabel>
              <div style={{ position: 'relative' }}>
                <select id="industry" value={info.industry} onChange={e => onChange('industry', e.target.value)} className="select-premium">
                  <option value="" disabled>Select…</option>
                  {INDUSTRIES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="numAISystems">Number of AI systems</FieldLabel>
            <div style={{ position: 'relative' }}>
              <select id="numAISystems" value={info.numAISystems} onChange={e => onChange('numAISystems', e.target.value)} className="select-premium">
                <option value="" disabled>Select…</option>
                {AI_SYSTEMS.map(o => <option key={o} value={o}>{o} system{o !== '1' ? 's' : ''}</option>)}
              </select>
              <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} width={12} height={12} viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onNext} disabled={!valid} className="btn-primary"
        style={{ marginTop: 20, width: '100%', justifyContent: 'center', opacity: valid ? 1 : 0.4, cursor: valid ? 'pointer' : 'not-allowed', fontSize: 15, padding: '14px 14px 14px 24px' }}>
        Start Assessment
        <span className="btn-icon"><ArrowRight /></span>
      </button>
    </div>
  )
}

/* ── Answer button ─────────────────────────────────────────────── */
function AnswerBtn({ option, selected, onClick }) {
  const active = selected === option.value
  const colors = {
    yes:         { border: 'rgba(16,185,129,0.55)', bg: 'rgba(16,185,129,0.09)', text: '#6ee7b7' },
    in_progress: { border: 'rgba(245,158,11,0.55)', bg: 'rgba(245,158,11,0.09)', text: '#fcd34d' },
    no:          { border: 'rgba(239,68,68,0.55)',  bg: 'rgba(239,68,68,0.09)',  text: '#fca5a5' },
  }
  const c = active ? colors[option.value] : null
  return (
    <button onClick={() => onClick(option.value)} aria-pressed={active}
      style={{
        flex: 1, padding: '10px 8px', borderRadius: 12, cursor: 'pointer',
        border: `1px solid ${active ? c.border : 'rgba(255,255,255,0.08)'}`,
        background: active ? c.bg : 'rgba(255,255,255,0.02)',
        color: active ? c.text : 'var(--text-muted)',
        fontSize: 12, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
        transition: 'border-color 150ms var(--crisp), background 150ms var(--crisp), color 150ms var(--crisp), transform 150ms var(--smooth)',
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {option.label}
    </button>
  )
}

const ANSWER_OPTIONS = [
  { value: 'yes',         label: 'Yes'         },
  { value: 'in_progress', label: 'In Progress'  },
  { value: 'no',          label: 'No'           },
]

/* ── Section step ──────────────────────────────────────────────── */
function SectionStep({ section, sectionIndex, answers, onChange, onNext, onBack, isLast }) {
  const allAnswered = section.questions.every(q => answers[q.id])
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '120px 24px 60px' }} className="page-enter">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.08)', color: '#93b4fd', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>
          ISO {section.control}
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Section {sectionIndex}: {section.title}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-sub)', margin: 0, lineHeight: 1.65 }}>{section.description}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="stagger">
        {section.questions.map(q => (
          <div key={q.id} className="bezel">
            <div className="bezel-inner" style={{
              padding: '18px 20px',
              borderColor: answers[q.id] ? 'rgba(255,255,255,0.12)' : undefined,
              transition: 'border-color 200ms var(--crisp)',
            }}>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: '0 0 14px', lineHeight: 1.6, fontWeight: 450 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', marginRight: 8 }}>{q.id}</span>
                {q.text}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {ANSWER_OPTIONS.map(opt => (
                  <AnswerBtn key={opt.value} option={opt} selected={answers[q.id]} onClick={v => onChange(q.id, v)} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
        <button onClick={onBack} className="btn-ghost" style={{ gap: 8 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={onNext} disabled={!allAnswered} className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? 'pointer' : 'not-allowed' }}>
          {isLast ? 'See My Results' : 'Next Section'}
          <span className="btn-icon"><ArrowRight /></span>
        </button>
      </div>
      {!allAnswered && (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          Answer all {section.questions.length} questions to continue
        </p>
      )}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [companyInfo, setCompanyInfo] = useState({ email: '', companyName: '', companySize: '', industry: '', numAISystems: '' })
  const [answers, setAnswers] = useState({})
  const totalSteps = 1 + SECTIONS.length

  const handleFinish = () => {
    const results = computeResults(companyInfo, answers)
    localStorage.setItem('complai_company', JSON.stringify(companyInfo))
    localStorage.setItem('complai_answers', JSON.stringify(answers))
    localStorage.setItem('complai_results', JSON.stringify(results))
    navigate('/results')
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', position: 'relative' }} className="mesh-bg">
      <ProgressNav step={step} totalSteps={totalSteps} />
      {step === 0 ? (
        <CompanyInfoStep
          info={companyInfo}
          onChange={(k, v) => setCompanyInfo(p => ({ ...p, [k]: v }))}
          onNext={() => setStep(1)}
        />
      ) : (
        <SectionStep
          key={step}
          section={SECTIONS[step - 1]}
          sectionIndex={step}
          answers={answers}
          onChange={(k, v) => setAnswers(p => ({ ...p, [k]: v }))}
          onNext={step < totalSteps - 1 ? () => setStep(s => s + 1) : handleFinish}
          onBack={() => setStep(s => s - 1)}
          isLast={step === totalSteps - 1}
        />
      )}
    </div>
  )
}
