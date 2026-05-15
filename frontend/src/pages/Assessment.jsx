import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

/* ── 40 questions across 6 ISO 42001 control sections ───────────── */
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

/* answer options with selected state colors */
const ANSWER_OPTIONS = [
  { value: 'yes',         label: 'Yes',         selectedCls: 'border-emerald-500/70 bg-emerald-500/12 text-emerald-300' },
  { value: 'in_progress', label: 'In Progress',  selectedCls: 'border-amber-500/70 bg-amber-500/12 text-amber-300'   },
  { value: 'no',          label: 'No',           selectedCls: 'border-red-500/70 bg-red-500/12 text-red-300'          },
]

/* ── Scoring (exported for Results page) ─────────────────────────── */
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

/* ── Nav bar ─────────────────────────────────────────────────────── */
function AssessmentNav({ step, totalSteps }) {
  const pct = Math.round(((step + 1) / totalSteps) * 100)
  return (
    <nav className="sticky top-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 12px rgba(37,99,235,0.30)' }}>
            <span className="text-white text-xs font-black">C</span>
          </div>
          <span className="text-sm font-black tracking-widest text-white hidden sm:block">COMPLAI</span>
        </Link>

        <div className="flex-1 max-w-xs">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-medium">
            <span>{step === 0 ? 'Company Info' : `Section ${step} of ${totalSteps - 1}`}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${pct}%`,
                transition: 'width 500ms cubic-bezier(0.23,1,0.32,1)',
                boxShadow: '0 0 8px rgba(37,99,235,0.5)',
              }}
            />
          </div>
        </div>

        <span className="text-xs text-slate-600 flex-shrink-0 hidden sm:block">Free</span>
      </div>
    </nav>
  )
}

/* ── Shared field components ─────────────────────────────────────── */
const inputCls = 'w-full bg-white/[0.04] border border-white/[0.10] text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm input-glow'
const selectCls = 'w-full bg-[#0d1525] border border-white/[0.10] text-slate-100 rounded-xl px-4 py-3 text-sm cursor-pointer appearance-none input-glow'

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-400 mb-1.5">
      {children} <span className="text-red-400">*</span>
    </label>
  )
}

/* ── Step 0: company info ─────────────────────────────────────────── */
function CompanyInfoStep({ info, onChange, onNext }) {
  const valid = info.email && info.companyName && info.companySize && info.industry && info.numAISystems
  return (
    <div className="max-w-xl mx-auto px-6 py-12 page-enter">
      <div className="mb-8">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Step 1 of 7</p>
        <h1 className="text-3xl font-black text-white mb-2">Tell us about your company</h1>
        <p className="text-slate-400 text-sm leading-relaxed">We use this to customise your results and pre-fill your policies.</p>
      </div>

      <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-8 space-y-5">
        <div>
          <FieldLabel htmlFor="email">Work Email</FieldLabel>
          <input id="email" type="email" required placeholder="you@company.com"
            value={info.email} onChange={e => onChange('email', e.target.value)} className={inputCls} />
        </div>
        <div>
          <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
          <input id="companyName" type="text" required placeholder="Acme AI, Inc."
            value={info.companyName} onChange={e => onChange('companyName', e.target.value)} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="companySize">Company Size</FieldLabel>
            <select id="companySize" value={info.companySize} onChange={e => onChange('companySize', e.target.value)} className={selectCls}>
              <option value="" disabled>Select…</option>
              {COMPANY_SIZES.map(o => <option key={o} value={o}>{o} employees</option>)}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="industry">Industry</FieldLabel>
            <select id="industry" value={info.industry} onChange={e => onChange('industry', e.target.value)} className={selectCls}>
              <option value="" disabled>Select…</option>
              {INDUSTRIES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="numAISystems">Number of AI Systems</FieldLabel>
          <select id="numAISystems" value={info.numAISystems} onChange={e => onChange('numAISystems', e.target.value)} className={selectCls}>
            <option value="" disabled>Select…</option>
            {AI_SYSTEMS.map(o => <option key={o} value={o}>{o} system{o !== '1' ? 's' : ''}</option>)}
          </select>
        </div>
      </div>

      <button onClick={onNext} disabled={!valid}
        className="btn-press mt-6 w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-sm cursor-pointer flex items-center justify-center gap-2"
        style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)', boxShadow: valid ? '0 4px 20px rgba(37,99,235,0.25)' : 'none' }}>
        Start Assessment
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  )
}

/* ── Answer button (Emil: every pressable needs :active press feel) */
function AnswerBtn({ option, selected, onClick }) {
  const active = selected === option.value
  return (
    <button
      onClick={() => onClick(option.value)}
      aria-pressed={active}
      className="btn-press flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer text-center"
      style={{
        transition: 'background 140ms var(--ease-out), border-color 140ms var(--ease-out), color 140ms var(--ease-out), transform 160ms var(--ease-out)',
        ...(active
          ? option.value === 'yes'
            ? { borderColor: 'rgba(16,185,129,0.7)', background: 'rgba(16,185,129,0.10)', color: '#6ee7b7' }
            : option.value === 'in_progress'
            ? { borderColor: 'rgba(245,158,11,0.7)', background: 'rgba(245,158,11,0.10)', color: '#fcd34d' }
            : { borderColor: 'rgba(239,68,68,0.7)', background: 'rgba(239,68,68,0.10)', color: '#fca5a5' }
          : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: '#94a3b8' }),
      }}
    >
      {option.label}
    </button>
  )
}

/* ── Section question step ───────────────────────────────────────── */
function SectionStep({ section, sectionIndex, answers, onChange, onNext, onBack, isLast }) {
  const allAnswered = section.questions.every(q => answers[q.id])
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 page-enter">
      <div className="mb-8">
        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3">
          ISO {section.control}
        </span>
        <h2 className="text-2xl font-black text-white mb-2">
          Section {sectionIndex}: {section.title}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">{section.description}</p>
      </div>

      {/* Questions stagger in (Emil: items appearing together should cascade) */}
      <div className="space-y-4 stagger-children">
        {section.questions.map(q => (
          <div
            key={q.id}
            className="bg-[#111827] border rounded-2xl p-5"
            style={{
              borderColor: answers[q.id] ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
              transition: 'border-color 200ms var(--ease-out)',
            }}
          >
            <p className="text-sm font-medium text-slate-100 mb-4 leading-relaxed">
              <span className="text-slate-600 font-mono text-xs mr-2">{q.id}</span>
              {q.text}
            </p>
            <div className="flex gap-2">
              {ANSWER_OPTIONS.map(opt => (
                <AnswerBtn key={opt.value} option={opt} selected={answers[q.id]} onClick={v => onChange(q.id, v)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack}
          className="btn-press px-6 py-3.5 rounded-xl border border-white/[0.10] text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
          style={{ transition: 'background 160ms var(--ease-out), color 160ms var(--ease-out), transform 160ms var(--ease-out)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Back
        </button>
        <button onClick={onNext} disabled={!allAnswered}
          className="btn-press flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2"
          style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)', boxShadow: allAnswered ? '0 4px 20px rgba(37,99,235,0.22)' : 'none' }}>
          {isLast ? 'See My Results' : 'Next Section'}
          {!isLast && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          )}
        </button>
      </div>

      {!allAnswered && (
        <p className="text-center text-xs text-slate-600 mt-3">
          Answer all {section.questions.length} questions to continue
        </p>
      )}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
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
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100">
      <AssessmentNav step={step} totalSteps={totalSteps} />
      {step === 0 ? (
        <CompanyInfoStep
          info={companyInfo}
          onChange={(k, v) => setCompanyInfo(p => ({ ...p, [k]: v }))}
          onNext={() => setStep(1)}
        />
      ) : (
        <SectionStep
          key={step}  /* key forces remount → re-triggers stagger on section change */
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
