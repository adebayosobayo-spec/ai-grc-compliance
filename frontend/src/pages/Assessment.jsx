import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export const SECTIONS = [
  { id:'A', title:'AI_GOVERNANCE_&_LEADERSHIP', control:'A.2/A.3', color:'var(--green)',
    questions:[
      {id:'A1',text:'Do you have a documented AI policy?'},
      {id:'A2',text:'Is there a designated AI governance owner?'},
      {id:'A3',text:'Does your board/leadership formally review AI governance?'},
      {id:'A4',text:'Have you documented your AI system inventory?'},
      {id:'A5',text:'Do you have incident response procedures for AI systems?'},
      {id:'A6',text:'Have you conducted an AI impact assessment?'},
    ]},
  { id:'B', title:'DATA_GOVERNANCE_FOR_AI', control:'A.6', color:'var(--amber)',
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
  { id:'C', title:'DEVELOPMENT_&_TESTING', control:'A.5', color:'var(--blue)',
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
  { id:'D', title:'DEPLOYMENT_&_MONITORING', control:'A.8', color:'var(--red)',
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
  { id:'E', title:'THIRD_PARTY_AI_VENDORS', control:'A.9', color:'#a78bfa',
    questions:[
      {id:'E1',text:'Do you use third-party AI (e.g., OpenAI, Claude API)?'},
      {id:'E2',text:'Do you have contracts with AI vendors?'},
      {id:'E3',text:'Do you understand how vendors use your data?'},
      {id:'E4',text:'Do you assess vendor security & compliance?'},
      {id:'E5',text:'Do you have data protection agreements (DPAs)?'},
      {id:'E6',text:"Do you know your AI vendors' data retention policies?"},
    ]},
  { id:'F', title:'ETHICS_&_TRANSPARENCY', control:'A.7/A.10', color:'#2dd4bf',
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

/* ── Block progress bar ─────────────────────────────────────── */
function BlockBar({ pct, total = 10, color = 'var(--green)' }) {
  const f = Math.round((pct/100)*total)
  return (
    <span style={{ letterSpacing:0, fontSize:12, color:'var(--t3)' }}>
      {Array.from({length:total},(_,i) => (
        <span key={i} style={{color: i<f ? color : 'var(--grid2)'}}>█</span>
      ))}
    </span>
  )
}

/* ── Terminal progress header ────────────────────────────────── */
function ProgressHeader({ step, total, section }) {
  const pct = Math.round(((step+1)/total)*100)
  const filled = Math.round((pct/100)*40)
  return (
    <div style={{ position:'sticky', top:0, zIndex:100, background:'var(--bg)',
      borderBottom:'1px solid var(--grid)' }}>
      {/* Nav row */}
      <div className="term-nav">
        <Link to="/" className="term-nav-cell" style={{ color:'var(--green)', fontWeight:700, minWidth:120 }}>
          COMPLAI
        </Link>
        <div className="term-nav-cell" style={{ color:'var(--t3)', fontSize:10 }}>
          ISO_42001_ASSESSMENT
        </div>
        <div style={{ flex:1, borderRight:'1px solid var(--grid)' }}/>
        <div className="term-nav-cell" style={{ color:'var(--t3)', fontSize:10, fontFamily:'JetBrains Mono, monospace' }}>
          STEP {step+1}/{total} · {pct}%
        </div>
      </div>
      {/* Progress bar row */}
      <div style={{ borderBottom:'1px solid var(--grid)', height:28,
        display:'flex', alignItems:'center', padding:'0 20px', gap:12,
        background:'var(--bg1)', fontSize:10 }}>
        <span style={{ color:'var(--t3)' }}>PROGRESS:</span>
        <span style={{ letterSpacing:0, fontSize:11 }}>
          {Array.from({length:40},(_,i) => (
            <span key={i} style={{
              color: i < filled ? (section?.color || 'var(--green)') : 'var(--t4)'
            }}>█</span>
          ))}
        </span>
        <span style={{ color: section?.color || 'var(--green)', fontWeight:600 }}>{pct}%</span>
      </div>
    </div>
  )
}

/* ── Company info step ───────────────────────────────────────── */
function CompanyStep({ info, onChange, onNext }) {
  const ok = info.email && info.companyName && info.companySize && info.industry && info.numAISystems

  const field = (id, label, type='text', placeholder='') => (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr',
      borderBottom:'1px solid var(--grid)', alignItems:'stretch' }}>
      <label htmlFor={id} style={{ padding:'12px 16px', borderRight:'1px solid var(--grid)',
        fontSize:11, color:'var(--t3)', display:'flex', alignItems:'center',
        background:'var(--bg1)', fontWeight:600, letterSpacing:'0.04em' }}>
        {label}
        <span style={{ color:'var(--red)', marginLeft:4 }}>*</span>
      </label>
      <input id={id} type={type} required placeholder={placeholder}
        value={info[id]} onChange={e => onChange(id, e.target.value)}
        className="term-input" style={{ border:'none', borderRadius:0, padding:'12px 16px' }}/>
    </div>
  )

  const sel = (id, label, opts, mapFn = v => v) => (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr',
      borderBottom:'1px solid var(--grid)', alignItems:'stretch' }}>
      <label htmlFor={id} style={{ padding:'12px 16px', borderRight:'1px solid var(--grid)',
        fontSize:11, color:'var(--t3)', display:'flex', alignItems:'center',
        background:'var(--bg1)', fontWeight:600, letterSpacing:'0.04em' }}>
        {label}
        <span style={{ color:'var(--red)', marginLeft:4 }}>*</span>
      </label>
      <div style={{ position:'relative' }}>
        <select id={id} value={info[id]} onChange={e => onChange(id, e.target.value)}
          className="term-select" style={{ border:'none', borderRadius:0, padding:'12px 36px 12px 16px' }}>
          <option value="" disabled>SELECT...</option>
          {opts.map(o => <option key={o} value={o}>{mapFn(o)}</option>)}
        </select>
        <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
          pointerEvents:'none', color:'var(--t3)', fontSize:11 }}>▼</span>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'48px 32px' }} className="scan-in">
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:10, color:'var(--green)', fontWeight:700, letterSpacing:'0.1em', marginBottom:12 }}>
          ▸ STEP_01 — COMPANY_PROFILE
        </div>
        <h1 style={{ fontSize:'clamp(22px,3.5vw,32px)', fontWeight:700, color:'var(--t1)',
          letterSpacing:'-0.02em', marginBottom:8 }}>
          INIT_COMPANY_PROFILE()
        </h1>
        <p style={{ fontSize:12, color:'var(--t2)', lineHeight:1.7 }}>
          Used to personalise your assessment results and pre-fill your policies.
        </p>
      </div>

      <div className="tbox">
        <div className="tbox-header">
          <span style={{ color:'var(--green)' }}>●</span>
          COMPANY_DATA — ALL_FIELDS_REQUIRED
        </div>
        <div style={{ borderBottom:'1px solid var(--grid)' }}>
          {field('email', 'WORK_EMAIL', 'email', 'ceo@company.com')}
          {field('companyName', 'COMPANY_NAME', 'text', 'Acme AI, Inc.')}
          {sel('companySize', 'COMPANY_SIZE', SIZES, v => `${v} EMPLOYEES`)}
          {sel('industry', 'INDUSTRY', INDS)}
          {sel('numAISystems', 'AI_SYSTEMS', AISYS, v => `${v} SYSTEM${v!=='1'?'S':''}`)}
        </div>
        <div style={{ padding:16, background:'var(--bg2)' }}>
          <button onClick={onNext} disabled={!ok} className="tbtn tbtn-solid"
            style={{ opacity:ok?1:0.35, cursor:ok?'pointer':'not-allowed', fontSize:13 }}>
            ▶ BEGIN_ASSESSMENT()
          </button>
          {!ok && <span style={{ marginLeft:16, fontSize:11, color:'var(--t3)' }}>
            ALL_FIELDS_REQUIRED
          </span>}
        </div>
      </div>
    </div>
  )
}

/* ── Answer buttons — terminal style ─────────────────────────── */
function AnsBtn({ value, label, selected, onClick }) {
  const active = selected === value
  const cfg = {
    yes:         { border:'var(--green)', bg:'var(--green2)',             color:'var(--green)' },
    in_progress: { border:'var(--amber)', bg:'rgba(245,158,11,0.10)',    color:'var(--amber)' },
    no:          { border:'var(--red)',   bg:'rgba(239,68,68,0.10)',     color:'var(--red)'   },
  }
  const c = active ? cfg[value] : null
  return (
    <button onClick={() => onClick(value)} aria-pressed={active}
      style={{
        flex:1, padding:'9px 12px', cursor:'pointer', fontSize:12, fontWeight:700,
        fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.04em',
        border:`1px solid ${active ? c.border : 'var(--grid)'}`,
        background: active ? c.bg : 'var(--bg)',
        color: active ? c.color : 'var(--t3)',
        transition:'border-color 100ms, background 100ms, color 100ms',
      }}
      onMouseDown={e => e.currentTarget.style.opacity='0.7'}
      onMouseUp={e => e.currentTarget.style.opacity='1'}
      onMouseLeave={e => e.currentTarget.style.opacity='1'}>
      [{active ? '●' : ' '}] {label}
    </button>
  )
}

/* ── Section step ────────────────────────────────────────────── */
function SectionStep({ section, idx, answers, onChange, onNext, onBack, isLast }) {
  const done = section.questions.every(q => answers[q.id])
  const answered = section.questions.filter(q => answers[q.id]).length

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'40px 32px' }} className="scan-in">
      {/* Section header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
          <div className="tag" style={{ borderColor:section.color, color:section.color,
            background:`${section.color}10` }}>
            ISO {section.control}
          </div>
          <span style={{ fontSize:10, color:'var(--t3)' }}>
            {answered}/{section.questions.length} ANSWERED
          </span>
          <span style={{ fontSize:10, color:'var(--t3)' }}>
            SECTION {idx}/{6}
          </span>
        </div>
        <h2 style={{ fontSize:'clamp(18px,3vw,26px)', fontWeight:700, color:'var(--t1)',
          letterSpacing:'-0.02em', marginBottom:6 }}>
          {section.title}
        </h2>
        {/* mini progress for this section */}
        <BlockBar pct={Math.round((answered/section.questions.length)*100)}
          total={section.questions.length} color={section.color} />
      </div>

      {/* Questions as terminal table */}
      <div className="tbox scan-stagger">
        <div className="tbox-header">
          <span style={{ color:section.color }}>●</span>
          {section.title} — {section.questions.length}_QUESTIONS
        </div>
        {section.questions.map((q, qi) => (
          <div key={q.id} style={{
            borderBottom: qi < section.questions.length-1 ? '1px solid var(--grid)' : 'none',
            padding:'16px',
            background: answers[q.id] ? 'var(--bg)' : 'transparent',
            transition:'background 150ms',
          }}>
            {/* Q label + text */}
            <div style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
              <span style={{ fontWeight:700, fontSize:10, color:section.color,
                minWidth:28, marginTop:2 }}>{q.id}</span>
              <p style={{ fontSize:12, color:'var(--t1)', lineHeight:1.65, flex:1 }}>{q.text}</p>
              {answers[q.id] && (
                <span style={{ fontSize:10, fontWeight:700, flexShrink:0,
                  color: answers[q.id]==='yes' ? 'var(--green)'
                       : answers[q.id]==='no' ? 'var(--red)' : 'var(--amber)' }}>
                  {answers[q.id]==='yes' ? 'YES' : answers[q.id]==='no' ? 'NO' : 'IN_PROG'}
                </span>
              )}
            </div>
            {/* Answer buttons */}
            <div style={{ display:'flex', gap:0, marginLeft:40 }}>
              {[['yes','YES'],['in_progress','IN_PROGRESS'],['no','NO']].map(([v,l]) => (
                <AnsBtn key={v} value={v} label={l}
                  selected={answers[q.id]} onClick={val => onChange(q.id, val)}/>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <div style={{ display:'flex', gap:8, marginTop:20, alignItems:'center' }}>
        <button onClick={onBack} className="tbtn" style={{ fontSize:12 }}>
          ◀ BACK()
        </button>
        <button onClick={onNext} disabled={!done} className="tbtn"
          style={{ flex:1, justifyContent:'center', fontSize:12,
            opacity:done?1:0.35, cursor:done?'pointer':'not-allowed',
            ...(done ? {borderColor:section.color, color:section.color,
              background:`${section.color}10`} : {}) }}>
          {isLast ? '▶ COMPUTE_RESULTS()' : `▶ NEXT_SECTION(${idx+1})`}
        </button>
        {!done && (
          <span style={{ fontSize:10, color:'var(--t3)' }}>
            {section.questions.length - answered}_REMAINING
          </span>
        )}
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState({email:'',companyName:'',companySize:'',industry:'',numAISystems:''})
  const [answers, setAnswers] = useState({})
  const total = 1 + SECTIONS.length
  const curSec = SECTIONS[step-1]

  const finish = () => {
    const results = computeResults(info, answers)
    localStorage.setItem('complai_company', JSON.stringify(info))
    localStorage.setItem('complai_answers', JSON.stringify(answers))
    localStorage.setItem('complai_results', JSON.stringify(results))
    navigate('/results')
  }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100dvh' }}>
      <ProgressHeader step={step} total={total} section={curSec} />
      {step===0
        ? <CompanyStep info={info} onChange={(k,v)=>setInfo(p=>({...p,[k]:v}))} onNext={()=>setStep(1)}/>
        : <SectionStep key={step} section={curSec} idx={step} answers={answers}
            onChange={(k,v)=>setAnswers(p=>({...p,[k]:v}))}
            onNext={step<total-1 ? ()=>setStep(s=>s+1) : finish}
            onBack={()=>setStep(s=>s-1)}
            isLast={step===total-1}/>
      }
    </div>
  )
}
