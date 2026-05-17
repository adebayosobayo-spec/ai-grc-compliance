import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

/* ── Data — DO NOT MODIFY ──────────────────────────────────────── */
export const SECTIONS = [
  { id:'A', title:'AI Governance & Leadership', control:'A.2/A.3',
    questions:[
      {id:'A1',text:'Do you have a documented AI policy?'},
      {id:'A2',text:'Is there a designated AI governance owner?'},
      {id:'A3',text:'Does your board/leadership formally review AI governance?'},
      {id:'A4',text:'Have you documented your AI system inventory?'},
      {id:'A5',text:'Do you have incident response procedures for AI systems?'},
      {id:'A6',text:'Have you conducted an AI impact assessment?'},
    ]},
  { id:'B', title:'Data Governance for AI', control:'A.6',
    questions:[
      {id:'B1',text:'Do you track data lineage for AI training data?'},
      {id:'B2',text:'Do you have data quality standards?'},
      {id:'B3',text:'Are you using personal data in your AI systems?'},
      {id:'B4',text:'Do you have processes to remove biased training data?'},
      {id:'B5',text:'Do you document all data sources used?'},
      {id:'B6',text:'Is sensitive/regulated data properly governed?'},
      {id:'B7',text:'Do you have data retention policies?'},
      {id:'B8',text:'Can you explain where AI decisions come from (explainability)?'},
    ]},
  { id:'C', title:'Development & Testing', control:'A.5',
    questions:[
      {id:'C1',text:'Do you test for AI model bias?'},
      {id:'C2',text:'Do you perform adversarial testing?'},
      {id:'C3',text:'Do you monitor model performance post-deployment?'},
      {id:'C4',text:'Do you have version control for AI models?'},
      {id:'C5',text:'Do you document model limitations and failure modes?'},
      {id:'C6',text:'Is there human review before deployment?'},
      {id:'C7',text:'Do you have rollback procedures if an AI system fails?'},
      {id:'C8',text:'Do you test for fairness/accuracy across demographics?'},
    ]},
  { id:'D', title:'Deployment & Monitoring', control:'A.8',
    questions:[
      {id:'D1',text:'Do you monitor AI system performance in production?'},
      {id:'D2',text:'Can you detect AI drift (changing performance over time)?'},
      {id:'D3',text:'Do you have alerts for AI system failures?'},
      {id:'D4',text:'Do you log decisions made by AI systems?'},
      {id:'D5',text:'Can you quickly disable an AI system if needed?'},
      {id:'D6',text:'Do you have change management for AI updates?'},
      {id:'D7',text:'Do you document the reason for AI decisions?'},
      {id:'D8',text:'Do you have security controls around your AI models?'},
    ]},
  { id:'E', title:'Third-Party AI Vendors', control:'A.9',
    questions:[
      {id:'E1',text:'Do you use third-party AI (e.g., OpenAI, Claude API)?'},
      {id:'E2',text:'Do you have contracts with AI vendors?'},
      {id:'E3',text:'Do you understand how vendors use your data?'},
      {id:'E4',text:'Do you assess vendor security & compliance?'},
      {id:'E5',text:'Do you have data protection agreements (DPAs)?'},
      {id:'E6',text:"Do you know your AI vendors' data retention policies?"},
    ]},
  { id:'F', title:'Ethics & Transparency', control:'A.7/A.10',
    questions:[
      {id:'F1',text:'Do you have an AI ethics framework or policy?'},
      {id:'F2',text:'Do you disclose to users when AI is making decisions?'},
      {id:'F3',text:'Can users appeal AI decisions?'},
      {id:'F4',text:'Do you comply with GDPR/CCPA regarding AI?'},
    ]},
]

const SIZES = ['1–10','11–50','51–200','200+']
const INDS  = ['AI/ML','SaaS','Fintech','Healthtech','Other']
const AISYS = ['1','2–5','6–10','10+']

export function computeResults(info, answers) {
  const T = 40; let pts = 0
  Object.values(answers).forEach(v => { if(v==='yes') pts+=1; else if(v==='in_progress') pts+=0.5 })
  const overallScore = Math.round((pts/T)*100)
  const PRI={B:1,D:2,A:3,C:4,E:5,F:6}
  const IMP={B:'CRITICAL',D:'CRITICAL',A:'HIGH',C:'HIGH',E:'MEDIUM',F:'MEDIUM'}
  const sectionScores = SECTIONS.map(s => {
    let sp=0; const gaps=[]
    s.questions.forEach(q => {
      const v=answers[q.id]
      if(v==='yes') sp+=1; else if(v==='in_progress') sp+=0.5; else gaps.push(q.text)
    })
    return {...s, score:Math.round((sp/s.questions.length)*100), gaps}
  })
  const allGaps=[]
  sectionScores.forEach(s => s.gaps.forEach(g =>
    allGaps.push({section:s.id,sectionTitle:s.title,question:g,priority:PRI[s.id],impact:IMP[s.id]})
  ))
  allGaps.sort((a,b)=>a.priority-b.priority)
  return {overallScore, sectionScores, topGaps:allGaps.slice(0,5)}
}

/* ── Visual components ─────────────────────────────────────────── */

function ProgressNav({ step, total }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 0 }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em', color: '#0F172A', textDecoration: 'none', marginRight: 'auto' }}>COMPLAI</Link>
        <span style={{ fontSize: 13, color: '#94A3B8', marginRight: 16 }}>
          Step {step} of {total}
        </span>
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: '#F1F5F9' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#059669', transition: 'width 400ms ease' }} />
      </div>
    </div>
  )
}

function FormField({ id, label, type = 'text', placeholder, value, onChange, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#DC2626', marginLeft: 3 }}>*</span>}
      </label>
      <input id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} required={required}
        className="inp" style={{ borderRadius: 8 }} />
    </div>
  )
}

function FormSelect({ id, label, options, value, onChange, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#DC2626', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <select id={id} value={value} onChange={e => onChange(e.target.value)} className="sel" required={required}>
          <option value="" disabled>Select…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8', fontSize: 11 }}>▼</span>
      </div>
    </div>
  )
}

function CompanyStep({ info, onChange, onNext }) {
  const ok = info.email && info.companyName && info.companySize && info.industry && info.numAISystems
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 32px' }}>
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Step 1 of 7</div>
        <h1 style={{ fontSize: 'clamp(24px,3.5vw,34px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', marginBottom: 10 }}>Tell us about your company</h1>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65 }}>We use this to personalise your results and pre-fill your policy documents.</p>
      </div>
      <div className="card" style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <FormField id="email" label="Work email" type="email" placeholder="ceo@company.com"
          value={info.email} onChange={v => onChange('email', v)} required />
        <FormField id="companyName" label="Company name" placeholder="Acme AI, Inc."
          value={info.companyName} onChange={v => onChange('companyName', v)} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormSelect id="companySize" label="Company size" options={SIZES}
            value={info.companySize} onChange={v => onChange('companySize', v)} required />
          <FormSelect id="industry" label="Industry" options={INDS}
            value={info.industry} onChange={v => onChange('industry', v)} required />
        </div>
        <FormSelect id="numAISystems" label="Number of AI systems" options={AISYS}
          value={info.numAISystems} onChange={v => onChange('numAISystems', v)} required />
        <button onClick={onNext} disabled={!ok} className="btn btn-primary btn-lg"
          style={{ opacity: ok ? 1 : 0.45, cursor: ok ? 'pointer' : 'not-allowed', justifyContent: 'center', marginTop: 4 }}>
          Start assessment →
        </button>
      </div>
    </div>
  )
}

function AnswerBtn({ value, label, selected, onClick }) {
  const active = selected === value
  const styles = {
    yes:         { activeBg: '#ECFDF5', activeBorder: '#059669', activeColor: '#047857' },
    in_progress: { activeBg: '#FFFBEB', activeBorder: '#D97706', activeColor: '#92400E' },
    no:          { activeBg: '#FEF2F2', activeBorder: '#DC2626', activeColor: '#991B1B' },
  }
  const s = styles[value]
  return (
    <button onClick={() => onClick(value)} aria-pressed={active}
      style={{
        flex: 1, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        borderRadius: 6, border: `1px solid ${active ? s.activeBorder : '#E2E8F0'}`,
        background: active ? s.activeBg : '#fff',
        color: active ? s.activeColor : '#94A3B8',
        transition: 'all 120ms',
        fontFamily: 'Inter, sans-serif',
      }}>
      {active && <span style={{ marginRight: 5 }}>✓</span>}{label}
    </button>
  )
}

function SectionStep({ section, idx, answers, onChange, onNext, onBack, isLast }) {
  const answered = section.questions.filter(q => answers[q.id]).length
  const done = answered === section.questions.length
  const pct = Math.round((answered / section.questions.length) * 100)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="badge badge-gray mono" style={{ fontSize: 11 }}>{section.control}</span>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>{answered} of {section.questions.length} answered</span>
        </div>
        <h2 style={{ fontSize: 'clamp(20px,2.8vw,28px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', marginBottom: 14 }}>{section.title}</h2>
        <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#059669', borderRadius: 3, transition: 'width 300ms ease' }} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        {section.questions.map((q, qi) => (
          <div key={q.id} style={{
            padding: '20px 24px',
            borderBottom: qi < section.questions.length - 1 ? '1px solid #F1F5F9' : 'none',
            background: answers[q.id] ? '#FAFCFF' : '#fff',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: '#059669', paddingTop: 2, flexShrink: 0 }}>{q.id}</span>
              <p style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.6, flex: 1 }}>{q.text}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginLeft: 28 }}>
              <AnswerBtn value="yes" label="Yes" selected={answers[q.id]} onClick={v => onChange(q.id, v)} />
              <AnswerBtn value="in_progress" label="In progress" selected={answers[q.id]} onClick={v => onChange(q.id, v)} />
              <AnswerBtn value="no" label="No" selected={answers[q.id]} onClick={v => onChange(q.id, v)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ minWidth: 96 }}>← Back</button>
        <button onClick={onNext} disabled={!done} className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center', opacity: done ? 1 : 0.4, cursor: done ? 'pointer' : 'not-allowed' }}>
          {isLast ? 'See my results →' : `Continue to ${SECTIONS[idx] ? SECTIONS[idx].title : 'next'} →`}
        </button>
        {!done && (
          <span style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
            {section.questions.length - answered} remaining
          </span>
        )}
      </div>
    </div>
  )
}

export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState({ email: '', companyName: '', companySize: '', industry: '', numAISystems: '' })
  const [answers, setAnswers] = useState({})
  const total = 1 + SECTIONS.length
  const curSec = SECTIONS[step - 1]

  const finish = () => {
    const results = computeResults(info, answers)
    try {
      localStorage.setItem('complai_company', JSON.stringify(info))
      localStorage.setItem('complai_answers', JSON.stringify(answers))
      localStorage.setItem('complai_results', JSON.stringify(results))
    } catch {
      // localStorage unavailable (private mode) — continue to results anyway
    }
    navigate('/results')
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh' }}>
      <ProgressNav step={step} total={total} />
      {step === 0
        ? <CompanyStep info={info} onChange={(k, v) => setInfo(p => ({ ...p, [k]: v }))} onNext={() => setStep(1)} />
        : <SectionStep key={step} section={curSec} idx={step} answers={answers}
            onChange={(k, v) => setAnswers(p => ({ ...p, [k]: v }))}
            onNext={step < total - 1 ? () => setStep(s => s + 1) : finish}
            onBack={() => setStep(s => s - 1)}
            isLast={step === total - 1} />
      }
    </div>
  )
}
