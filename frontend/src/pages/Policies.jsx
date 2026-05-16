import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const POLICIES = [
  { n:1, title:'AI Governance Policy',                     desc:'Governance framework, roles, board review, and approval processes.',                         pages:'3–4 pages' },
  { n:2, title:'Data Governance Policy for AI',            desc:'Data quality standards, bias mitigation, privacy controls, and training data documentation.', pages:'4–5 pages' },
  { n:3, title:'AI System Development & Testing Policy',   desc:'Bias, adversarial & fairness testing, version control, and deployment gates.',               pages:'4–5 pages' },
  { n:4, title:'AI System Deployment & Monitoring Policy', desc:'Deployment checklists, real-time monitoring, incident tiers, and audit logging.',             pages:'4–5 pages' },
  { n:5, title:'Third-Party AI Vendor Policy',             desc:'Vendor approval, DPA requirements, approved vendor register, and breach escalation.',         pages:'3–4 pages' },
  { n:6, title:'AI Ethics & Bias Mitigation Policy',       desc:'Ethics principles, bias testing standards, user transparency obligations.',                   pages:'4–5 pages' },
  { n:7, title:'Incident Response Policy for AI Systems',  desc:'Incident tiers (Critical/High/Medium), response procedures, post-incident review.',           pages:'3–4 pages' },
]

const PLANS = [
  {
    id:'one_time', name:'Policy Generator', price:'$299', period:'one-time',
    badge:null,
    features:['7 customised ISO 42001 policies','Pre-filled with your company details','Ready-to-sign Word documents (.docx)','Professional PDF readiness report','3 months ISO 42001 email updates','30-day money-back guarantee'],
    cta:'Pay $299 — Get All 7 Policies',
  },
  {
    id:'combo', name:'Policies + Updates', price:'$299 + $29/mo', period:'one-time + monthly',
    badge:'Best Value',
    features:['Everything in Policy Generator','Monthly policy updates as ISO 42001 evolves','ISO 42001 regulatory change alerts','Ongoing compliance guidance','Priority email support','Cancel anytime'],
    cta:'Pay $299 + Start Monthly Updates',
  },
  {
    id:'monthly', name:'Monthly Updates', price:'$29/mo', period:'per month',
    badge:null,
    features:['Monthly policy update notifications','ISO 42001 change alerts','Updated policy templates','Cancel anytime'],
    cta:'Subscribe for $29/mo',
  },
]

/* ── Icons ───────────────────────────────────────────────────── */
const Arr  = ({s=15}) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>)
const Chk  = ({s=13}) => (<svg width={s} height={s} viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>)
const Dl   = ({s=14}) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
const Lock = ({s=12}) => (<svg width={s} height={s} viewBox="0 0 12 12" fill="none"><rect x="1.5" y="5" width="9" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>)
const Doc  = ({s=16}) => (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V6L9 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M9 1v5h5M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>)

/* ── Plan card ───────────────────────────────────────────────── */
function PlanCard({ plan, selected, onSelect }) {
  const active = selected === plan.id
  return (
    <button onClick={() => onSelect(plan.id)} aria-pressed={active}
      style={{ width:'100%', textAlign:'left', background:'none', border:'none', padding:0, cursor:'pointer' }}>
      <div style={{
        borderRadius:18, padding:20,
        border:`${active ? 2 : 1}px solid ${active ? 'rgba(37,99,235,0.55)' : 'var(--b1)'}`,
        background: active ? 'rgba(37,99,235,0.07)' : 'rgba(255,255,255,0.02)',
        boxShadow: active ? '0 0 32px rgba(37,99,235,0.10)' : 'none',
        transition:'border-color 180ms var(--crisp), background 180ms var(--crisp), box-shadow 180ms var(--crisp)',
      }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:14, fontWeight:600,
                color:'var(--t1)' }}>{plan.name}</span>
              {plan.badge && (
                <span style={{ fontSize:9, fontWeight:700, color:'#0a0a0a', background:'var(--amber)',
                  padding:'2px 8px', borderRadius:999, letterSpacing:'0.07em',
                  fontFamily:'Space Grotesk, sans-serif' }}>
                  {plan.badge}
                </span>
              )}
            </div>
            <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:26, fontWeight:700,
              color:'var(--t1)', letterSpacing:'-0.03em', lineHeight:1, marginBottom:4 }}>{plan.price}</p>
            <p style={{ fontSize:11, color:'var(--t3)' }}>{plan.period}</p>
          </div>
          {/* radio dot */}
          <div style={{
            width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2,
            border:`2px solid ${active ? 'var(--blue)' : 'var(--b2)'}`,
            background: active ? 'var(--blue)' : 'transparent',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'border-color 180ms var(--crisp), background 180ms var(--crisp)',
          }}>
            {active && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}/>}
          </div>
        </div>
        <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:8 }}>
          {plan.features.map(f => (
            <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:12, color:'var(--t2)' }}>
              <span style={{ color:'var(--emerald)', flexShrink:0, marginTop:1 }}><Chk/></span>{f}
            </li>
          ))}
        </ul>
      </div>
    </button>
  )
}

/* ── Payment form ─────────────────────────────────────────────── */
function PaymentForm({ plan, company, onSuccess }) {
  const [form, setForm] = useState({ email:company?.email||'', card:'', expiry:'', cvc:'' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const fmtCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const fmtExpiry = v => v.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2')

  const pay = async e => {
    e.preventDefault(); setErr('')
    if (!form.email||!form.card||!form.expiry||!form.cvc) { setErr('Please fill in all payment fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    localStorage.setItem('complai_paid', JSON.stringify({ plan:plan?.id, date:new Date().toISOString() }))
    setLoading(false); onSuccess()
  }

  return (
    <form onSubmit={pay} style={{ display:'flex', flexDirection:'column', gap:15 }}>
      <div>
        <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--t3)', marginBottom:7 }}>Email</label>
        <input type="email" required placeholder="you@company.com" className="inp"
          value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}/>
      </div>
      <div>
        <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--t3)', marginBottom:7 }}>Card number</label>
        <input type="text" required placeholder="1234 5678 9012 3456" maxLength={19}
          className="inp mono" value={form.card}
          onChange={e => setForm(p=>({...p,card:fmtCard(e.target.value)}))}
          style={{ fontFamily:'JetBrains Mono, monospace' }}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--t3)', marginBottom:7 }}>Expiry</label>
          <input type="text" required placeholder="MM/YY" maxLength={5}
            className="inp" value={form.expiry}
            onChange={e => setForm(p=>({...p,expiry:fmtExpiry(e.target.value)}))}
            style={{ fontFamily:'JetBrains Mono, monospace' }}/>
        </div>
        <div>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--t3)', marginBottom:7 }}>CVC</label>
          <input type="text" required placeholder="123" maxLength={4}
            className="inp" value={form.cvc}
            onChange={e => setForm(p=>({...p,cvc:e.target.value.replace(/\D/g,'').slice(0,4)}))}
            style={{ fontFamily:'JetBrains Mono, monospace' }}/>
        </div>
      </div>
      {err && (
        <div style={{ padding:'10px 14px', borderRadius:12,
          background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.22)' }}>
          <p style={{ fontSize:12, color:'#fca5a5', margin:0 }}>{err}</p>
        </div>
      )}
      <button type="submit" disabled={loading} className="btn btn-amber"
        style={{ justifyContent:'center', fontSize:14, padding:'13px 13px 13px 22px',
          opacity:loading?0.7:1, cursor:loading?'not-allowed':'pointer' }}>
        {loading
          ? <><div style={{ width:15, height:15, border:'2px solid rgba(0,0,0,0.2)',
              borderTopColor:'#0a0a0a', borderRadius:'50%',
              animation:'spin 0.7s linear infinite' }}/> Processing…</>
          : <>{plan?.cta||'Complete Purchase'}<span className="btn-icon"><Arr/></span></>
        }
      </button>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        gap:6, fontSize:11, color:'var(--t3)' }}>
        <Lock/> Secured by Stripe · 30-day money-back guarantee
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  )
}

/* ── Post-payment download ────────────────────────────────────── */
function DownloadSection({ company }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }} className="page-in">
      <div style={{ padding:'16px 20px', borderRadius:16,
        background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.24)',
        display:'flex', alignItems:'flex-start', gap:14 }}>
        <svg width={22} height={22} viewBox="0 0 22 22" fill="none" style={{ flexShrink:0, marginTop:1 }}>
          <circle cx={11} cy={11} r={10} fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth="1.5"/>
          <path d="M6.5 11l3 3 6-6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:14, fontWeight:600,
            color:'#6ee7b7', marginBottom:3 }}>Payment successful — your policies are ready</p>
          <p style={{ fontSize:12, color:'rgba(110,231,183,0.70)', lineHeight:1.55 }}>
            Pre-filled with <strong>{company?.companyName||'your company'}</strong>'s details.
            Review, sign, and share with your CTO, CFO, and General Counsel.
          </p>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }} className="stagger">
        {POLICIES.map(p => (
          <div key={p.n} className="card card-hover">
            <div className="card-inner" style={{ padding:'13px 18px',
              display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
                background:'rgba(37,99,235,0.10)', border:'1px solid rgba(37,99,235,0.18)',
                display:'flex', alignItems:'center', justifyContent:'center', color:'#93b4fd' }}>
                <Doc/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:13, fontWeight:600,
                  color:'var(--t1)', marginBottom:2 }}>{p.title}</p>
                <p style={{ fontSize:11, color:'var(--t3)', fontFamily:'JetBrains Mono, monospace' }}>
                  {p.pages} · .docx · Ready to sign
                </p>
              </div>
              <button className="btn btn-ghost" style={{ flexShrink:0, gap:6, fontSize:12, padding:'8px 14px' }}>
                <Dl s={13}/> Download
              </button>
            </div>
          </div>
        ))}

        {/* PDF report */}
        <div className="card card-hover">
          <div className="card-inner" style={{ padding:'13px 18px',
            display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
              background:'rgba(245,158,11,0.10)', border:'1px solid rgba(245,158,11,0.18)',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24' }}>
              <Doc/>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:13, fontWeight:600,
                color:'var(--t1)', marginBottom:2 }}>ISO 42001 Readiness Report (PDF)</p>
              <p style={{ fontSize:11, color:'var(--t3)', fontFamily:'JetBrains Mono, monospace' }}>
                8–12 pages · Investor-ready · Includes roadmap
              </p>
            </div>
            <button className="btn btn-ghost" style={{ flexShrink:0, gap:6, fontSize:12, padding:'8px 14px' }}>
              <Dl s={13}/> Export PDF
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign:'center', marginTop:8 }}>
        <Link to="/results" style={{ fontSize:13, color:'var(--t3)', textDecoration:'none',
          transition:'color 150ms' }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--t1)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--t3)'}>
          Back to Gap Analysis
        </Link>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function Policies() {
  const [paid, setPaid]         = useState(false)
  const [selected, setSelected] = useState('one_time')
  const [company, setCompany]   = useState(null)

  useEffect(() => {
    const p = localStorage.getItem('complai_paid')
    const c = localStorage.getItem('complai_company')
    if (p) setPaid(true)
    if (c) setCompany(JSON.parse(c))
  }, [])

  const plan = PLANS.find(p => p.id === selected)

  return (
    <div style={{ background:'var(--bg)', minHeight:'100dvh' }} className="mesh page-in">

      {/* ── Floating nav ── */}
      <nav style={{
        position:'fixed', top:18, left:'50%', transform:'translateX(-50%)',
        zIndex:100, width:'min(660px, calc(100vw - 28px))',
        display:'flex', alignItems:'center', gap:12,
        padding:'7px 8px 7px 20px',
        background:'rgba(8,14,28,0.85)',
        backdropFilter:'blur(24px) saturate(1.8)',
        WebkitBackdropFilter:'blur(24px) saturate(1.8)',
        border:'1px solid var(--b2)', borderRadius:999,
        boxShadow:'inset 0 1px 0 var(--b3), 0 8px 40px rgba(0,0,0,0.45)',
      }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <div style={{ width:24, height:24, borderRadius:7, background:'var(--blue)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 10px var(--blue-glow)' }}>
            <span style={{ color:'#fff', fontSize:10, fontWeight:800, fontFamily:'Space Grotesk, sans-serif' }}>C</span>
          </div>
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:12,
            letterSpacing:'0.12em', color:'#fff' }}>COMPLAI</span>
        </Link>
        <div style={{ flex:1 }}/>
        {!paid && (
          <Link to="/results" style={{ fontSize:12, color:'var(--t3)', textDecoration:'none',
            padding:'6px 12px', borderRadius:999, transition:'color 150ms, background 150ms' }}
            onMouseEnter={e=>{ e.currentTarget.style.color='var(--t1)'; e.currentTarget.style.background='var(--b0)' }}
            onMouseLeave={e=>{ e.currentTarget.style.color='var(--t3)'; e.currentTarget.style.background='transparent' }}>
            Back to Results
          </Link>
        )}
      </nav>

      <main style={{ maxWidth:1100, margin:'0 auto', padding:'100px 24px 80px' }}>
        {paid ? (
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            <div style={{ marginBottom:32 }}>
              <h1 style={{ fontFamily:'Space Grotesk, sans-serif',
                fontSize:'clamp(24px,4vw,36px)', fontWeight:700,
                color:'var(--t1)', letterSpacing:'-0.025em', marginBottom:10 }}>
                Your 7 ISO 42001 Policies Are Ready
              </h1>
              <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.7 }}>
                Download, review, and sign. Share with your CTO, CFO, General Counsel, and board.
              </p>
            </div>
            <DownloadSection company={company}/>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:32, alignItems:'start' }}
            className="max-md:grid-cols-1">

            {/* Left: plan selection + policy list */}
            <div>
              <div style={{ marginBottom:32 }}>
                <div className="eyebrow" style={{ marginBottom:16 }}>Choose your plan</div>
                <h1 style={{ fontFamily:'Space Grotesk, sans-serif',
                  fontSize:'clamp(24px,4vw,38px)', fontWeight:700,
                  color:'var(--t1)', letterSpacing:'-0.025em', marginBottom:10 }}>
                  Get Your ISO 42001 Policies
                </h1>
                <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7, maxWidth:'46ch' }}>
                  7 customised, ready-to-sign policies pre-filled with your company's details.
                </p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:40 }} className="stagger">
                {PLANS.map(p => <PlanCard key={p.id} plan={p} selected={selected} onSelect={setSelected}/>)}
              </div>

              {/* Policy list */}
              <div>
                <p style={{ fontSize:11, fontWeight:600, color:'var(--t3)',
                  textTransform:'uppercase', letterSpacing:'0.10em', marginBottom:14 }}>
                  What you get — all 7 policies
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }} className="stagger">
                  {POLICIES.map(p => (
                    <div key={p.n} className="card">
                      <div className="card-inner" style={{ padding:'13px 18px',
                        display:'flex', alignItems:'flex-start', gap:14 }}>
                        <span style={{ width:28, height:28, borderRadius:8, flexShrink:0,
                          background:'rgba(37,99,235,0.10)', border:'1px solid rgba(37,99,235,0.18)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontFamily:'JetBrains Mono, monospace', fontSize:11, fontWeight:600, color:'#93b4fd' }}>
                          {p.n}
                        </span>
                        <div>
                          <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:13, fontWeight:600,
                            color:'var(--t1)', marginBottom:3 }}>{p.title}</p>
                          <p style={{ fontSize:12, color:'var(--t3)', lineHeight:1.5, marginBottom:4 }}>{p.desc}</p>
                          <p style={{ fontSize:10, color:'var(--t4)', fontFamily:'JetBrains Mono, monospace' }}>
                            {p.pages} · .docx · Ready to sign
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: sticky payment panel */}
            <div style={{ position:'sticky', top:90 }}>
              <div className="card"
                style={{ boxShadow:'inset 0 1px 0 var(--b3), 0 0 60px rgba(0,0,0,0.40), 0 24px 60px -15px rgba(0,0,0,0.55)' }}>
                <div className="card-inner" style={{ padding:28 }}>
                  <div style={{ marginBottom:22, paddingBottom:20, borderBottom:'1px solid var(--b1)' }}>
                    <p style={{ fontSize:11, color:'var(--t3)', fontWeight:600,
                      textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>
                      Order summary
                    </p>
                    <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:28, fontWeight:700,
                      color:'var(--t1)', letterSpacing:'-0.03em', marginBottom:2 }}>{plan?.price}</p>
                    <p style={{ fontSize:12, color:'var(--t3)' }}>{plan?.name} · {plan?.period}</p>
                  </div>
                  <PaymentForm plan={plan} company={company} onSuccess={() => setPaid(true)}/>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop:'1px solid var(--b1)', padding:'24px', textAlign:'center' }}>
        <p style={{ fontSize:12, color:'var(--t3)', margin:0 }}>
          © {new Date().getFullYear()} COMPLAI · 30-day money-back guarantee on all purchases
        </p>
      </footer>
    </div>
  )
}
