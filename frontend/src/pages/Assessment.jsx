import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

/* ── 40 questions across 6 ISO 42001 control sections ────────── */
export const SECTIONS = [
  {
    id:'A', title:'AI Governance & Leadership', control:'A.2 / A.3',
    description:'Policies, designated owners, and leadership accountability for AI systems.',
    accent:'#2563EB', accentDim:'rgba(37,99,235,0.10)',
    questions:[
      { id:'A1', text:'Do you have a documented AI policy?' },
      { id:'A2', text:'Is there a designated AI governance owner?' },
      { id:'A3', text:'Does your board/leadership formally review AI governance?' },
      { id:'A4', text:'Have you documented your AI system inventory?' },
      { id:'A5', text:'Do you have incident response procedures for AI systems?' },
      { id:'A6', text:'Have you conducted an AI impact assessment?' },
    ],
  },
  {
    id:'B', title:'Data Governance for AI', control:'A.6',
    description:'Managing, quality-checking, and protecting your AI training data.',
    accent:'#F59E0B', accentDim:'rgba(245,158,11,0.10)',
    questions:[
      { id:'B1', text:'Do you track data lineage for AI training data?' },
      { id:'B2', text:'Do you have data quality standards?' },
      { id:'B3', text:'Are you using personal data in your AI systems?' },
      { id:'B4', text:'Do you have processes to remove biased training data?' },
      { id:'B5', text:'Do you document all data sources used?' },
      { id:'B6', text:'Is sensitive/regulated data properly governed?' },
      { id:'B7', text:'Do you have data retention policies?' },
      { id:'B8', text:'Can you explain where AI decisions come from (explainability)?' },
    ],
  },
  {
    id:'C', title:'AI System Development & Testing', control:'A.5',
    description:'Testing rigor, version control, and deployment gates before release.',
    accent:'#10B981', accentDim:'rgba(16,185,129,0.10)',
    questions:[
      { id:'C1', text:'Do you test for AI model bias?' },
      { id:'C2', text:'Do you perform adversarial testing?' },
      { id:'C3', text:'Do you monitor model performance post-deployment?' },
      { id:'C4', text:'Do you have version control for AI models?' },
      { id:'C5', text:'Do you document model limitations and failure modes?' },
      { id:'C6', text:'Is there human review before deployment?' },
      { id:'C7', text:'Do you have rollback procedures if an AI system fails?' },
      { id:'C8', text:'Do you test for fairness/accuracy across demographics?' },
    ],
  },
  {
    id:'D', title:'Deployment & Monitoring', control:'A.8',
    description:'Production monitoring, drift detection, and incident response.',
    accent:'#8B5CF6', accentDim:'rgba(139,92,246,0.10)',
    questions:[
      { id:'D1', text:'Do you monitor AI system performance in production?' },
      { id:'D2', text:'Can you detect AI drift (changing performance over time)?' },
      { id:'D3', text:'Do you have alerts for AI system failures?' },
      { id:'D4', text:'Do you log decisions made by AI systems?' },
      { id:'D5', text:'Can you quickly disable an AI system if needed?' },
      { id:'D6', text:'Do you have change management for AI updates?' },
      { id:'D7', text:'Do you document the reason for AI decisions?' },
      { id:'D8', text:'Do you have security controls around your AI models?' },
    ],
  },
  {
    id:'E', title:'Third-Party AI Systems', control:'A.9',
    description:'Vendor risk management, contracts, and data protection agreements.',
    accent:'#EC4899', accentDim:'rgba(236,72,153,0.10)',
    questions:[
      { id:'E1', text:'Do you use third-party AI (e.g., OpenAI, Claude API)?' },
      { id:'E2', text:'Do you have contracts with AI vendors?' },
      { id:'E3', text:'Do you understand how vendors use your data?' },
      { id:'E4', text:'Do you assess vendor security & compliance?' },
      { id:'E5', text:'Do you have data protection agreements (DPAs)?' },
      { id:'E6', text:"Do you know your AI vendors' data retention policies?" },
    ],
  },
  {
    id:'F', title:'Ethics, Transparency & Compliance', control:'A.7 / A.10',
    description:'Ethical AI framework, user disclosure, and regulatory compliance.',
    accent:'#14B8A6', accentDim:'rgba(20,184,166,0.10)',
    questions:[
      { id:'F1', text:'Do you have an AI ethics framework or policy?' },
      { id:'F2', text:'Do you disclose to users when AI is making decisions?' },
      { id:'F3', text:'Can users appeal AI decisions?' },
      { id:'F4', text:'Do you comply with GDPR/CCPA regarding AI?' },
    ],
  },
]

const SIZES     = ['1–10','11–50','51–200','200+']
const INDUSTRIES= ['AI/ML','SaaS','Fintech','Healthtech','Other']
const AI_SYS    = ['1','2–5','6–10','10+']

/* ── Scoring ─────────────────────────────────────────────────── */
export function computeResults(info, answers) {
  const TOTAL = 40
  let pts = 0
  Object.values(answers).forEach(v => {
    if (v === 'yes') pts += 1
    else if (v === 'in_progress') pts += 0.5
  })
  const overallScore = Math.round((pts / TOTAL) * 100)
  const PRI  = { B:1, D:2, A:3, C:4, E:5, F:6 }
  const IMP  = { B:'CRITICAL', D:'CRITICAL', A:'HIGH', C:'HIGH', E:'MEDIUM', F:'MEDIUM' }
  const sectionScores = SECTIONS.map(s => {
    let sp = 0; const gaps = []
    s.questions.forEach(q => {
      const v = answers[q.id]
      if (v === 'yes') sp += 1
      else if (v === 'in_progress') sp += 0.5
      else gaps.push(q.text)
    })
    return { ...s, score: Math.round((sp / s.questions.length) * 100), gaps }
  })
  const allGaps = []
  sectionScores.forEach(s => s.gaps.forEach(g =>
    allGaps.push({ section:s.id, sectionTitle:s.title, question:g, priority:PRI[s.id], impact:IMP[s.id] })
  ))
  allGaps.sort((a,b) => a.priority - b.priority)
  return { overallScore, sectionScores, topGaps: allGaps.slice(0,5) }
}

/* ── Icons ───────────────────────────────────────────────────── */
const Arr = ({s=15}) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const Back = ({s=15}) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── Progress pill nav ───────────────────────────────────────── */
function ProgressNav({ step, total, accent = '#2563EB' }) {
  const pct = Math.round(((step + 1) / total) * 100)
  return (
    <nav style={{
      position:'fixed', top:18, left:'50%', transform:'translateX(-50%)',
      zIndex:100, width:'min(620px, calc(100vw - 28px))',
      display:'flex', alignItems:'center', gap:16,
      padding:'7px 8px 7px 20px',
      background:'rgba(8,14,28,0.85)',
      backdropFilter:'blur(24px) saturate(1.8)',
      WebkitBackdropFilter:'blur(24px) saturate(1.8)',
      border:'1px solid var(--b2)',
      borderRadius:999,
      boxShadow:'inset 0 1px 0 var(--b3), 0 8px 40px rgba(0,0,0,0.45)',
    }}>
      <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <div style={{ width:24, height:24, borderRadius:7, background:'var(--blue)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 10px var(--blue-glow)' }}>
          <span style={{ color:'#fff', fontSize:10, fontWeight:800, fontFamily:'Space Grotesk, sans-serif' }}>C</span>
        </div>
      </Link>

      <div style={{ flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          <span style={{ fontSize:11, color:'var(--t3)', fontWeight:500 }}>
            {step === 0 ? 'Company info' : `Section ${step} of ${total - 1}`}
          </span>
          <span style={{ fontSize:11, color:'var(--t3)', fontFamily:'JetBrains Mono, monospace' }}>{pct}%</span>
        </div>
        <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
          <div className="prog-fill" style={{ width:`${pct}%`,
            background:`linear-gradient(90deg, ${accent}, ${accent}cc)`,
            boxShadow:`0 0 10px ${accent}60` }}/>
        </div>
      </div>

      <span style={{ fontSize:11, color:'var(--t3)', flexShrink:0 }}>Free</span>
    </nav>
  )
}

/* ── Field wrapper ───────────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <label style={{ fontSize:12, fontWeight:600, color:'var(--t3)', letterSpacing:'0.04em' }}>
        {label}{required && <span style={{ color:'#ef4444', marginLeft:3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

/* ── Company info step ───────────────────────────────────────── */
function CompanyStep({ info, onChange, onNext }) {
  const ok = info.email && info.companyName && info.companySize && info.industry && info.numAISystems
  const selWrap = (id, val, opts, label, mapFn = v => v) => (
    <Field label={label} required>
      <div style={{ position:'relative' }}>
        <select id={id} value={val} onChange={e => onChange(id, e.target.value)} className="sel">
          <option value="" disabled>Select…</option>
          {opts.map(o => <option key={o} value={o}>{mapFn(o)}</option>)}
        </select>
        <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
          pointerEvents:'none', color:'var(--t3)', display:'flex' }}>
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Field>
  )

  return (
    <div style={{ maxWidth:520, margin:'0 auto', padding:'120px 24px 60px' }} className="page-in">
      <div style={{ marginBottom:36 }}>
        <div className="eyebrow" style={{ marginBottom:18 }}>Step 1 of 7</div>
        <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'clamp(26px,4vw,38px)',
          fontWeight:700, color:'var(--t1)', letterSpacing:'-0.025em', marginBottom:12 }}>
          Tell us about your company
        </h1>
        <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.7 }}>
          We use this to personalise your results and pre-fill your policies.
        </p>
      </div>

      <div className="card">
        <div className="card-inner" style={{ padding:28, display:'flex', flexDirection:'column', gap:18 }}>
          <Field label="Work email" required>
            <input id="email" type="email" required placeholder="you@company.com"
              value={info.email} onChange={e => onChange('email', e.target.value)}
              className="inp"/>
          </Field>
          <Field label="Company name" required>
            <input id="companyName" type="text" required placeholder="Acme AI, Inc."
              value={info.companyName} onChange={e => onChange('companyName', e.target.value)}
              className="inp"/>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {selWrap('companySize', info.companySize, SIZES, 'Company size', v => `${v} employees`)}
            {selWrap('industry', info.industry, INDUSTRIES, 'Industry')}
          </div>
          {selWrap('numAISystems', info.numAISystems, AI_SYS, 'Number of AI systems', v => `${v} system${v!=='1'?'s':''}`)}
        </div>
      </div>

      <button onClick={onNext} disabled={!ok} className="btn btn-blue"
        style={{ marginTop:18, width:'100%', justifyContent:'center',
          opacity: ok ? 1 : 0.38, cursor: ok ? 'pointer' : 'not-allowed',
          fontSize:15, padding:'14px 14px 14px 26px' }}>
        Start Assessment
        <span className="btn-icon"><Arr s={15}/></span>
      </button>
    </div>
  )
}

/* ── Answer button ───────────────────────────────────────────── */
function AnswerBtn({ value, label, selected, onClick }) {
  const active = selected === value
  const styles = {
    yes:         { border:'rgba(16,185,129,0.6)',  bg:'rgba(16,185,129,0.09)', color:'#6ee7b7' },
    in_progress: { border:'rgba(245,158,11,0.6)',  bg:'rgba(245,158,11,0.09)', color:'#fcd34d' },
    no:          { border:'rgba(239,68,68,0.6)',   bg:'rgba(239,68,68,0.09)',  color:'#fca5a5' },
  }
  const s = active ? styles[value] : null
  return (
    <button onClick={() => onClick(value)} aria-pressed={active}
      style={{
        flex:1, padding:'10px 8px', borderRadius:12,
        border:`1px solid ${active ? s.border : 'var(--b1)'}`,
        background: active ? s.bg : 'rgba(255,255,255,0.02)',
        color: active ? s.color : 'var(--t3)',
        fontSize:12, fontWeight:600, fontFamily:'Space Grotesk, sans-serif',
        cursor:'pointer',
        transition:'border-color 140ms var(--crisp), background 140ms var(--crisp), color 140ms var(--crisp), transform 140ms var(--smooth)',
      }}
      onMouseDown={e => { e.currentTarget.style.transform='scale(0.96)' }}
      onMouseUp={e   => { e.currentTarget.style.transform='scale(1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='scale(1)' }}>
      {label}
    </button>
  )
}

/* ── Section step ────────────────────────────────────────────── */
function SectionStep({ section, idx, answers, onChange, onNext, onBack, isLast }) {
  const done = section.questions.every(q => answers[q.id])
  return (
    <div style={{ maxWidth:660, margin:'0 auto', padding:'120px 24px 60px' }} className="page-in">
      <div style={{ marginBottom:32 }}>
        <div className="eyebrow" style={{ marginBottom:16,
          borderColor:`${section.accent}30`, background:`${section.accent}10`,
          color: section.accent }}>
          ISO {section.control}
        </div>
        <h2 style={{ fontFamily:'Space Grotesk, sans-serif',
          fontSize:'clamp(22px,3.5vw,32px)', fontWeight:700,
          color:'var(--t1)', letterSpacing:'-0.02em', marginBottom:10 }}>
          Section {idx}: {section.title}
        </h2>
        <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.7 }}>{section.description}</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }} className="stagger">
        {section.questions.map(q => (
          <div key={q.id} className="card"
            style={{ borderColor: answers[q.id] ? 'var(--b2)' : 'var(--b1)',
              transition:'border-color 200ms var(--smooth)' }}>
            <div className="card-inner" style={{ padding:'18px 20px' }}>
              <p style={{ fontSize:14, color:'var(--t1)', lineHeight:1.65, marginBottom:14, fontWeight:450 }}>
                <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10,
                  color:'var(--t4)', marginRight:8 }}>{q.id}</span>
                {q.text}
              </p>
              <div style={{ display:'flex', gap:7 }}>
                {[['yes','Yes'],['in_progress','In Progress'],['no','No']].map(([v,l]) => (
                  <AnswerBtn key={v} value={v} label={l}
                    selected={answers[q.id]} onClick={val => onChange(q.id, val)}/>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, marginTop:24 }}>
        <button onClick={onBack} className="btn btn-ghost" style={{ gap:8 }}>
          <Back s={14}/> Back
        </button>
        <button onClick={onNext} disabled={!done} className="btn btn-blue"
          style={{ flex:1, justifyContent:'center',
            opacity: done ? 1 : 0.38, cursor: done ? 'pointer' : 'not-allowed',
            background: done ? section.accent : undefined,
            boxShadow: done ? `0 4px 24px ${section.accent}40` : 'none' }}>
          {isLast ? 'See My Results' : 'Next Section'}
          <span className="btn-icon"><Arr s={14}/></span>
        </button>
      </div>
      {!done && (
        <p style={{ textAlign:'center', fontSize:12, color:'var(--t3)', marginTop:12 }}>
          Answer all {section.questions.length} questions to continue
        </p>
      )}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState({ email:'', companyName:'', companySize:'', industry:'', numAISystems:'' })
  const [answers, setAnswers] = useState({})
  const total = 1 + SECTIONS.length
  const curSection = SECTIONS[step - 1]

  const finish = () => {
    const results = computeResults(info, answers)
    localStorage.setItem('complai_company', JSON.stringify(info))
    localStorage.setItem('complai_answers', JSON.stringify(answers))
    localStorage.setItem('complai_results', JSON.stringify(results))
    navigate('/results')
  }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100dvh' }} className="mesh">
      <ProgressNav step={step} total={total} accent={curSection?.accent} />
      {step === 0
        ? <CompanyStep info={info} onChange={(k,v) => setInfo(p=>({...p,[k]:v}))} onNext={() => setStep(1)}/>
        : <SectionStep
            key={step}
            section={curSection}
            idx={step}
            answers={answers}
            onChange={(k,v) => setAnswers(p=>({...p,[k]:v}))}
            onNext={step < total-1 ? () => setStep(s=>s+1) : finish}
            onBack={() => setStep(s=>s-1)}
            isLast={step === total-1}
          />
      }
    </div>
  )
}
