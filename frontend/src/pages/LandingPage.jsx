import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ── SVG icons (no emoji, no icon lib assumed) ─────────────── */
const Ico = {
  arrow: (s=16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (s=13) => (
    <svg width={s} height={s} viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  x: (s=13) => (
    <svg width={s} height={s} viewBox="0 0 13 13" fill="none">
      <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  chevron: (s=14) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shield: (s=12) => (
    <svg width={s} height={s} viewBox="0 0 12 12" fill="none">
      <path d="M6 1l4 1.5v3.5C10 9 8 11 6 11.5 4 11 2 9 2 6V2.5L6 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ── Spotlight card (mouse-tracking border glow) ────────────── */
function SpotlightCard({ children, style, className = '' }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1)
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1)
    ref.current.style.setProperty('--mx', `${x}%`)
    ref.current.style.setProperty('--my', `${y}%`)
  }
  return (
    <div ref={ref} onMouseMove={onMove}
      className={`card card-hover card-spotlight ${className}`}
      style={style}>
      {children}
    </div>
  )
}

/* ── Animated metric number ─────────────────────────────────── */
function MetricNum({ target, suffix = '', duration = 1600, delay = 0 }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    let id, start = null
    const step = (ts) => {
      if (!start) start = ts + delay
      if (ts < start) { id = requestAnimationFrame(step); return }
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) id = requestAnimationFrame(step)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [started, target, duration, delay])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

/* ── FAQ accordion item ─────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--b1)' }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 0', gap:24, background:'none', border:'none', cursor:'pointer',
          textAlign:'left' }}>
        <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:15, fontWeight:500, color:'var(--t1)' }}>{q}</span>
        <span style={{ color:'var(--t3)', flexShrink:0,
          transition:'transform 280ms var(--smooth)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          display:'flex' }}>
          {Ico.chevron(15)}
        </span>
      </button>
      <div className={`faq-body ${open ? 'open' : ''}`}>
        <div>
          <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.75, paddingBottom:20 }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Score preview (hero visual artifact) ───────────────────── */
function ScoreArtifact() {
  const r = 44, circ = 2 * Math.PI * r
  const pct = 47, offset = circ - (pct / 100) * circ
  const bars = [
    { label:'Governance', v:45, c:'#f59e0b' },
    { label:'Data',       v:22, c:'#ef4444' },
    { label:'Monitoring', v:18, c:'#ef4444' },
    { label:'Vendors',    v:60, c:'#3b82f6' },
    { label:'Ethics',     v:55, c:'#3b82f6' },
  ]
  return (
    <div className="card reveal d3" style={{ width:'100%', maxWidth:320 }}>
      <div className="card-inner" style={{ padding:24 }}>
        <div style={{ fontSize:10, color:'var(--t3)', fontFamily:'JetBrains Mono, monospace',
          letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:20 }}>
          ISO 42001 · Sample Report
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <svg width={104} height={104} style={{ transform:'rotate(-90deg)' }}>
              <circle cx={52} cy={52} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={9}/>
              <circle cx={52} cy={52} r={r} fill="none" stroke="#f59e0b" strokeWidth={9}
                strokeLinecap="round" strokeDasharray={circ}
                className="ring-anim"
                style={{ '--full':circ, '--gap':offset,
                  filter:'drop-shadow(0 0 5px rgba(245,158,11,0.45))' }}/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:24, fontWeight:700,
                color:'#fcd34d', lineHeight:1 }}>47%</span>
              <span style={{ fontSize:9, color:'var(--t3)', marginTop:3 }}>Developing</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:13, fontWeight:600,
              color:'var(--t1)', marginBottom:5 }}>Acme AI Corp.</p>
            <p style={{ fontSize:11, color:'var(--t2)', lineHeight:1.6 }}>
              5 critical gaps identified across data and monitoring controls.
            </p>
          </div>
        </div>
        {bars.map(b => (
          <div key={b.label} style={{ marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:10, color:'var(--t3)' }}>{b.label}</span>
              <span style={{ fontSize:10, color:b.c, fontFamily:'JetBrains Mono, monospace', fontWeight:600 }}>{b.v}%</span>
            </div>
            <div style={{ height:3, background:'rgba(255,255,255,0.05)', borderRadius:99 }}>
              <div style={{ width:`${b.v}%`, height:'100%', background:b.c, borderRadius:99,
                boxShadow:`0 0 5px ${b.c}60` }}/>
            </div>
          </div>
        ))}
        <div style={{ marginTop:18, padding:'11px 14px', borderRadius:12,
          background:'rgba(37,99,235,0.08)', border:'1px solid rgba(37,99,235,0.18)',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:11, color:'#93b4fd', fontWeight:600 }}>
            Fix gaps with 7 customised policies
          </span>
          {Ico.arrow(13)}
        </div>
      </div>
    </div>
  )
}

/* ─── Data ──────────────────────────────────────────────────── */
const METRICS = [
  { num: 1000, suffix:'+', label:'AI startups assessed',       delay:0   },
  { num: 6,    suffix:'',  label:'ISO 42001 controls covered', delay:150 },
  { num: 50,   suffix:'K', label:'saved vs consultants',       delay:300, prefix:'$' },
]

const FEATURES = [
  { n:'01', title:'40-question assessment', desc:'Six sections map your practices directly to ISO 42001 controls A.2 through A.10. Takes 10–15 minutes.', accent:'#2563EB' },
  { n:'02', title:'Instant gap analysis',   desc:'Readiness score plus prioritised gaps ranked by investor impact. Free, no card required.',               accent:'#F59E0B' },
  { n:'03', title:'7 customised policies',  desc:'Pre-filled Word documents ready to review, sign, and file — not blank templates.', accent:'#10B981' },
  { n:'04', title:'Investor-ready PDF',     desc:'8-page readiness report designed for data rooms, board packs, and pre-audit disclosure.', accent:'#8B5CF6' },
]

const PRICING = [
  {
    name:'Assessment', price:'Free', period:'Always free',
    features:['40Q ISO 42001 assessment','Readiness score 0–100%','Gap analysis — 6 controls','Top 5 prioritised gaps','PDF readiness report'],
    cta:'Take Assessment', to:'/assessment', hi:false,
  },
  {
    name:'Policy Generator', price:'$299', period:'One-time',
    badge:'Most Popular',
    features:['Everything in Free','7 customised ISO 42001 policies','Pre-filled with your details','Ready-to-sign .docx files','30-day money-back guarantee','3 months update emails'],
    cta:'Get All 7 Policies', to:'/policies', hi:true,
  },
  {
    name:'Policy Updates', price:'$29', period:'per month',
    features:['Everything in Generator','Monthly policy updates','ISO 42001 change alerts','Ongoing guidance','Priority support','Cancel anytime'],
    cta:'Subscribe', to:'/policies', hi:false,
  },
]

const FAQS = [
  { q:'What is ISO 42001?',
    a:'ISO 42001 is the international standard for AI management systems — the governance framework investors and enterprise customers increasingly require before signing. It covers AI policy, risk management, data governance, monitoring, and ethics. Think SOC 2, but for AI.' },
  { q:'Who needs ISO 42001?',
    a:'Any company building or deploying AI — especially startups raising Series A or selling to enterprise. Investors ask "are you ISO 42001 compliant?" during due diligence. Getting ahead of this question is a competitive advantage, not a compliance chore.' },
  { q:'Is this a real ISO 42001 assessment?',
    a:'Yes. Every question maps directly to a specific ISO 42001 control area (A.2, A.5, A.6, A.7, A.8, A.9, A.10). Your score reflects genuine gaps. This is a rigorous self-assessment — formal certification requires an external auditor.' },
  { q:'What do I get for $299?',
    a:'Seven Word documents (.docx), each 3–5 pages, pre-filled with your company name, industry, and AI system details. They cover AI Governance, Data Governance, Development & Testing, Deployment & Monitoring, Third-Party Vendors, Ethics & Bias, and Incident Response.' },
  { q:'Is there a refund policy?',
    a:'30-day money-back guarantee, no questions asked. Email us within 30 days of purchase and we will refund you in full.' },
]

/* ─── Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="mesh" style={{ background:'var(--bg)', minHeight:'100dvh' }}>

      {/* ── Floating pill nav ── */}
      <nav className="nav-pill" style={{ width:'min(700px, calc(100vw - 32px))' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', marginRight:'auto' }}>
          <div style={{ width:26, height:26, borderRadius:8, background:'var(--blue)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 14px var(--blue-glow)' }}>
            <span style={{ color:'#fff', fontSize:11, fontWeight:800, fontFamily:'Space Grotesk, sans-serif' }}>C</span>
          </div>
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:13,
            letterSpacing:'0.13em', color:'#fff' }}>COMPLAI</span>
        </Link>

        {[{ label:'Pricing', href:'#pricing' }].map(l => (
          <a key={l.label} href={l.href}
            style={{ padding:'7px 14px', color:'var(--t2)', fontSize:13, fontWeight:500,
              textDecoration:'none', borderRadius:999,
              transition:'color 150ms var(--crisp), background 150ms var(--crisp)' }}
            onMouseEnter={e => { e.currentTarget.style.color='var(--t1)'; e.currentTarget.style.background='var(--b0)' }}
            onMouseLeave={e => { e.currentTarget.style.color='var(--t2)'; e.currentTarget.style.background='transparent' }}>
            {l.label}
          </a>
        ))}

        <Link to="/auth"
          style={{ padding:'7px 14px', color:'var(--t2)', fontSize:13, fontWeight:500,
            textDecoration:'none', borderRadius:999,
            transition:'color 150ms var(--crisp), background 150ms var(--crisp)' }}
          onMouseEnter={e => { e.currentTarget.style.color='var(--t1)'; e.currentTarget.style.background='var(--b0)' }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--t2)'; e.currentTarget.style.background='transparent' }}>
          Sign In
        </Link>

        <Link to="/assessment" className="btn btn-blue" style={{ marginLeft:6, fontSize:13, padding:'8px 9px 8px 18px' }}>
          Start Free
          <span className="btn-icon" style={{ width:26, height:26 }}>{Ico.arrow(13)}</span>
        </Link>
      </nav>

      {/* ── HERO — editorial offset, not default split ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'130px 32px 80px',
        display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'flex-end' }}
        className="max-md:grid-cols-1 max-md:pt-28">

        {/* Left: oversized headline anchored to bottom-left */}
        <div>
          <div className="eyebrow reveal d1" style={{ marginBottom:22 }}>
            {Ico.shield(11)} &nbsp;ISO 42001 Readiness Platform
          </div>

          <h1 className="reveal d2" style={{
            fontFamily:'Space Grotesk, sans-serif',
            fontSize:'clamp(44px, 6vw, 80px)',
            fontWeight:700, color:'var(--t1)',
            letterSpacing:'-0.035em', lineHeight:1.0,
            margin:'0 0 28px',
          }}>
            Investors ask:<br/>
            <em style={{ color:'var(--t3)', fontStyle:'normal' }}>
              "Are you ISO<br/>42001 ready?"
            </em>
          </h1>

          <p className="reveal d3" style={{
            fontSize:17, color:'var(--t2)', lineHeight:1.72,
            maxWidth:'44ch', marginBottom:36,
          }}>
            Most AI startups say <strong style={{ color:'var(--t1)', fontWeight:500 }}>"Uh..."</strong> — COMPLAI
            gives you a readiness score, gap analysis, and 7 customised
            policies for <strong style={{ color:'var(--t1)' }}>$299</strong> instead of $50K in consulting fees.
          </p>

          <div className="reveal d4" style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:36 }}>
            <Link to="/assessment" className="btn btn-blue" style={{ fontSize:15, padding:'13px 13px 13px 24px' }}>
              Take Free Assessment
              <span className="btn-icon">{Ico.arrow()}</span>
            </Link>
            <a href="#pricing" className="btn btn-ghost" style={{ fontSize:14 }}>View pricing</a>
          </div>

          {/* Trust trio */}
          <div className="reveal d5" style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {['Free to start','No account needed','30-day guarantee'].map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'var(--emerald)' }}>{Ico.check()}</span>
                <span style={{ fontSize:12, color:'var(--t3)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: dossier artifact */}
        <div className="max-md:hidden" style={{ flexShrink:0 }}>
          <ScoreArtifact />
        </div>
      </section>

      {/* ── METRICS STRIP — oversized numbers ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px 96px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}
          className="stagger max-md:grid-cols-1">
          {METRICS.map((m, i) => (
            <div key={i} className="card card-hover">
              <div className="card-inner" style={{ padding:'32px 28px' }}>
                <p style={{ fontFamily:'Space Grotesk, sans-serif',
                  fontSize:'clamp(40px, 5vw, 60px)', fontWeight:700,
                  color:'var(--t1)', letterSpacing:'-0.04em', lineHeight:1,
                  marginBottom:10 }}>
                  {m.prefix}{<MetricNum target={m.num} suffix={m.suffix} delay={m.delay * 1.5} />}
                </p>
                <p style={{ fontSize:13, color:'var(--t3)', fontWeight:500 }}>{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px 96px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}
          className="max-md:grid-cols-1 stagger">

          {/* Problem */}
          <SpotlightCard style={{ borderColor:'rgba(239,68,68,0.18)' }}>
            <div className="card-inner" style={{ padding:36,
              background:'linear-gradient(135deg, rgba(239,68,68,0.04) 0%, var(--bg-inner) 60%)' }}>
              <div style={{ width:42, height:42, borderRadius:13,
                background:'rgba(239,68,68,0.09)', border:'1px solid rgba(239,68,68,0.18)',
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22 }}>
                <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                  <path d="M9 6v4M9 12.5v.5M2 16h14L9 2 2 16z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:20, fontWeight:700,
                color:'var(--t1)', marginBottom:18 }}>The problem</h3>
              <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:12 }}>
                {['ISO 42001 feels abstract and overwhelming',
                  "You don't know which policies your company needs",
                  'Investors ask about AI governance at Series A',
                  'Consultants charge $50K and take 3–6 months'].map(t => (
                  <li key={t} style={{ display:'flex', alignItems:'flex-start', gap:8,
                    fontSize:13, color:'var(--t2)' }}>
                    <span style={{ color:'#ef4444', flexShrink:0, marginTop:1 }}>{Ico.x()}</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </SpotlightCard>

          {/* Solution */}
          <SpotlightCard style={{ borderColor:'rgba(16,185,129,0.18)' }}>
            <div className="card-inner" style={{ padding:36,
              background:'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, var(--bg-inner) 60%)' }}>
              <div style={{ width:42, height:42, borderRadius:13,
                background:'rgba(16,185,129,0.09)', border:'1px solid rgba(16,185,129,0.18)',
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22 }}>
                <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4.5 4.5 8-8" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:20, fontWeight:700,
                color:'var(--t1)', marginBottom:18 }}>The COMPLAI fix</h3>
              <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:12 }}>
                {['Free 10-minute assessment maps your exact gaps',
                  'Instant readiness score across 6 ISO 42001 controls',
                  'Customised policies ready for investor due diligence',
                  'Professional PDF report for board and auditors'].map(t => (
                  <li key={t} style={{ display:'flex', alignItems:'flex-start', gap:8,
                    fontSize:13, color:'var(--t2)' }}>
                    <span style={{ color:'var(--emerald)', flexShrink:0, marginTop:1 }}>{Ico.check()}</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* ── HOW IT WORKS — asymmetric bento ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px 96px' }}>
        <div style={{ marginBottom:52 }}>
          <div className="eyebrow reveal" style={{ marginBottom:16 }}>How it works</div>
          <h2 className="reveal" style={{ fontFamily:'Space Grotesk, sans-serif',
            fontSize:'clamp(28px, 4vw, 48px)', fontWeight:700,
            color:'var(--t1)', maxWidth:'14ch' }}>
            From zero to investor-ready in one afternoon
          </h2>
        </div>

        {/* Bento: 5fr/3fr then 3fr/5fr — alternating */}
        <div style={{ display:'grid', gridTemplateColumns:'5fr 3fr', gap:16, marginBottom:16 }}
          className="stagger max-md:grid-cols-1">
          {FEATURES.slice(0,2).map((f) => (
            <SpotlightCard key={f.n}>
              <div className="card-inner" style={{ padding:32 }}>
                <div style={{ width:38, height:38, borderRadius:11,
                  background: f.n==='01' ? 'rgba(37,99,235,0.10)' : 'rgba(245,158,11,0.10)',
                  border:`1px solid ${f.n==='01' ? 'rgba(37,99,235,0.20)' : 'rgba(245,158,11,0.20)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:13, fontWeight:600,
                    color: f.n==='01' ? '#93b4fd' : '#fbbf24' }}>{f.n}</span>
                </div>
                <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:18, fontWeight:700,
                  color:'var(--t1)', marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.7, maxWidth:'38ch' }}>{f.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'3fr 5fr', gap:16 }}
          className="stagger max-md:grid-cols-1">
          {FEATURES.slice(2,4).map((f) => (
            <SpotlightCard key={f.n}>
              <div className="card-inner" style={{ padding:32 }}>
                <div style={{ width:38, height:38, borderRadius:11,
                  background: f.n==='03' ? 'rgba(16,185,129,0.10)' : 'rgba(139,92,246,0.10)',
                  border:`1px solid ${f.n==='03' ? 'rgba(16,185,129,0.20)' : 'rgba(139,92,246,0.20)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:13, fontWeight:600,
                    color: f.n==='03' ? '#34d399' : '#a78bfa' }}>{f.n}</span>
                </div>
                <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:18, fontWeight:700,
                  color:'var(--t1)', marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.7, maxWidth:'42ch' }}>{f.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px 96px' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div className="eyebrow reveal" style={{ display:'inline-flex', marginBottom:16 }}>Pricing</div>
          <h2 className="reveal" style={{ fontFamily:'Space Grotesk, sans-serif',
            fontSize:'clamp(28px, 4vw, 48px)', fontWeight:700, color:'var(--t1)', marginBottom:12 }}>
            Start free. Pay when you need policies.
          </h2>
          <p className="reveal" style={{ fontSize:15, color:'var(--t3)' }}>
            No subscription required to run the assessment.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.12fr 1fr', gap:16, alignItems:'start' }}
          className="stagger max-md:grid-cols-1">
          {PRICING.map(p => (
            <div key={p.name}
              className={p.hi ? 'card' : 'card card-hover'}
              style={p.hi ? {
                borderColor:'rgba(37,99,235,0.45)',
                boxShadow:'inset 0 1px 0 var(--b3), 0 0 50px rgba(37,99,235,0.12), 0 24px 60px -15px rgba(0,0,0,0.55)',
              } : {}}>
              <div className="card-inner" style={{
                padding:28,
                background: p.hi ? 'linear-gradient(160deg, rgba(37,99,235,0.07) 0%, var(--bg-inner) 60%)' : undefined,
              }}>
                {p.badge && (
                  <span style={{ display:'inline-block', fontSize:9, fontWeight:700,
                    color:'#fff', background:'var(--blue)', padding:'3px 10px',
                    borderRadius:999, letterSpacing:'0.07em', marginBottom:12,
                    fontFamily:'Space Grotesk, sans-serif' }}>
                    {p.badge}
                  </span>
                )}
                <p style={{ fontSize:13, color: p.hi ? '#93b4fd' : 'var(--t3)', fontWeight:600, marginBottom:8 }}>{p.name}</p>
                <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:38, fontWeight:700,
                  color:'var(--t1)', letterSpacing:'-0.04em', lineHeight:1, marginBottom:4 }}>{p.price}</p>
                <p style={{ fontSize:12, color:'var(--t3)', marginBottom:24 }}>{p.period}</p>
                <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:9, marginBottom:24 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:8,
                      fontSize:13, color:'var(--t2)' }}>
                      <span style={{ color:'var(--emerald)', flexShrink:0, marginTop:1 }}>{Ico.check()}</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to={p.to}
                  className={p.hi ? 'btn btn-blue' : 'btn btn-ghost'}
                  style={{ width:'100%', justifyContent:'center', fontSize:13 }}>
                  {p.cta}
                  {p.hi && <span className="btn-icon" style={{ width:26, height:26 }}>{Ico.arrow(13)}</span>}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth:720, margin:'0 auto', padding:'0 32px 96px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div className="eyebrow reveal" style={{ display:'inline-flex', marginBottom:16 }}>FAQ</div>
          <h2 className="reveal" style={{ fontFamily:'Space Grotesk, sans-serif',
            fontSize:'clamp(24px, 3.5vw, 38px)', fontWeight:700, color:'var(--t1)' }}>
            Common questions
          </h2>
        </div>
        <div className="reveal" style={{ borderTop:'1px solid var(--b1)' }}>
          {FAQS.map(item => <FaqItem key={item.q} {...item} />)}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px 100px' }}>
        <div className="card reveal"
          style={{ borderColor:'rgba(37,99,235,0.22)',
            boxShadow:'inset 0 1px 0 var(--b3), 0 0 80px rgba(37,99,235,0.07)' }}>
          <div className="card-inner" style={{
            padding:'clamp(48px, 6vw, 80px)',
            textAlign:'center',
            background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.09), transparent)',
          }}>
            <div className="eyebrow" style={{ display:'inline-flex', marginBottom:20 }}>
              Get started today
            </div>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif',
              fontSize:'clamp(28px, 4.5vw, 56px)', fontWeight:700,
              color:'var(--t1)', letterSpacing:'-0.03em', marginBottom:16, maxWidth:'18ch', margin:'0 auto 16px' }}>
              Get ISO 42001-ready instead of spending $50K
            </h2>
            <p style={{ fontSize:16, color:'var(--t2)', maxWidth:'48ch', margin:'0 auto 36px', lineHeight:1.7 }}>
              Free assessment, instant gap analysis, and 7 customised policies —
              all before your next investor call.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
              <Link to="/assessment" className="btn btn-blue"
                style={{ fontSize:15, padding:'14px 14px 14px 26px' }}>
                Start Free Assessment
                <span className="btn-icon">{Ico.arrow()}</span>
              </Link>
              <a href="#pricing" className="btn btn-ghost" style={{ fontSize:14 }}>View pricing</a>
            </div>
            <p style={{ fontSize:12, color:'var(--t3)', marginTop:20 }}>
              No account required · 10–15 minutes · Free
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop:'1px solid var(--b1)', padding:'28px 32px', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:20, height:20, borderRadius:6, background:'var(--blue)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#fff', fontSize:9, fontWeight:800, fontFamily:'Space Grotesk, sans-serif' }}>C</span>
          </div>
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:12,
            letterSpacing:'0.12em', color:'var(--t3)' }}>COMPLAI</span>
        </div>
        <p style={{ fontSize:12, color:'var(--t3)', margin:0 }}>
          © {new Date().getFullYear()} COMPLAI · ISO 42001 Readiness for AI Startups
        </p>
      </footer>
    </div>
  )
}
