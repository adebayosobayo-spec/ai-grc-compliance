import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* ── helpers ──────────────────────────────────────────────────── */
function status(score) {
  if (score < 25) return { label:'Not Ready',   desc:'Urgent action needed',        stroke:'#EF4444', text:'#fca5a5', bg:'rgba(239,68,68,0.08)',  border:'rgba(239,68,68,0.25)'  }
  if (score < 50) return { label:'Developing',  desc:'Multiple gaps to address',     stroke:'#F59E0B', text:'#fcd34d', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' }
  if (score < 75) return { label:'Progressing', desc:'Good foundation, refine gaps', stroke:'#3B82F6', text:'#93b4fd', bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.25)'  }
  return              { label:'Ready',       desc:'Investor-ready governance',   stroke:'#10B981', text:'#6ee7b7', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.25)'  }
}
function barColor(s) {
  if (s < 25) return '#EF4444'
  if (s < 50) return '#F59E0B'
  if (s < 75) return '#3B82F6'
  return '#10B981'
}
function impStyle(impact) {
  if (impact==='CRITICAL') return { bg:'rgba(239,68,68,0.09)',  border:'rgba(239,68,68,0.28)',  color:'#fca5a5' }
  if (impact==='HIGH')     return { bg:'rgba(245,158,11,0.09)', border:'rgba(245,158,11,0.28)', color:'#fcd34d' }
  return                          { bg:'rgba(59,130,246,0.09)',  border:'rgba(59,130,246,0.28)', color:'#93b4fd' }
}

/* ── Count-up hook ────────────────────────────────────────────── */
function useCountUp(target, ms = 1200) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let id, t0 = null
    const go = ts => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / ms, 1)
      setV(Math.round((1 - Math.pow(1-p, 3)) * target))
      if (p < 1) id = requestAnimationFrame(go)
    }
    id = requestAnimationFrame(go)
    return () => cancelAnimationFrame(id)
  }, [target, ms])
  return v
}

/* ── Animated bar ─────────────────────────────────────────────── */
function Bar({ score, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(score), 120 + delay)
    return () => clearTimeout(t)
  }, [score, delay])
  const c = barColor(score)
  return (
    <div style={{ height:5, background:'rgba(255,255,255,0.05)', borderRadius:99, overflow:'hidden' }}>
      <div style={{ width:`${w}%`, height:'100%', borderRadius:99, background:c,
        boxShadow:`0 0 6px ${c}55`,
        transition:`width 900ms cubic-bezier(0.32,0.72,0,1) ${delay}ms` }}/>
    </div>
  )
}

/* ── Score ring ───────────────────────────────────────────────── */
function Ring({ score }) {
  const st = status(score)
  const r = 64, circ = 2*Math.PI*r, offset = circ - (score/100)*circ
  const display = useCountUp(score, 1300)
  return (
    <div style={{ position:'relative', display:'inline-flex', flexShrink:0 }}>
      <svg width={160} height={160} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={80} cy={80} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={11}/>
        <circle cx={80} cy={80} r={r} fill="none" stroke={st.stroke} strokeWidth={11}
          strokeLinecap="round" strokeDasharray={circ}
          className="ring-anim"
          style={{ '--full':circ, '--gap':offset,
            filter:`drop-shadow(0 0 9px ${st.stroke}55)` }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', userSelect:'none' }}>
        <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:38, fontWeight:700,
          color:st.text, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{display}%</span>
        <span style={{ fontSize:11, color:'var(--t3)', marginTop:4, fontWeight:500 }}>{st.label}</span>
      </div>
    </div>
  )
}

/* ── Arrow icon ───────────────────────────────────────────────── */
const Arr = ({s=15}) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── Page ─────────────────────────────────────────────────────── */
export default function Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [company, setCompany] = useState(null)

  useEffect(() => {
    const r = localStorage.getItem('complai_results')
    const c = localStorage.getItem('complai_company')
    if (!r) { navigate('/assessment'); return }
    setResults(JSON.parse(r))
    if (c) setCompany(JSON.parse(c))
  }, [navigate])

  if (!results) return null
  const { overallScore, sectionScores, topGaps } = results
  const st = status(overallScore)

  return (
    <div style={{ background:'var(--bg)', minHeight:'100dvh' }} className="mesh page-in">

      {/* ── Floating nav ── */}
      <nav style={{
        position:'fixed', top:18, left:'50%', transform:'translateX(-50%)',
        zIndex:100, width:'min(760px, calc(100vw - 28px))',
        display:'flex', alignItems:'center', gap:12,
        padding:'7px 7px 7px 20px',
        background:'rgba(8,14,28,0.85)',
        backdropFilter:'blur(24px) saturate(1.8)',
        WebkitBackdropFilter:'blur(24px) saturate(1.8)',
        border:'1px solid var(--b2)', borderRadius:999,
        boxShadow:'inset 0 1px 0 var(--b3), 0 8px 40px rgba(0,0,0,0.45)',
      }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
          <div style={{ width:24, height:24, borderRadius:7, background:'var(--blue)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 10px var(--blue-glow)' }}>
            <span style={{ color:'#fff', fontSize:10, fontWeight:800, fontFamily:'Space Grotesk, sans-serif' }}>C</span>
          </div>
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:12,
            letterSpacing:'0.12em', color:'#fff' }}>COMPLAI</span>
        </Link>
        <div style={{ flex:1 }}/>
        <Link to="/assessment" style={{ fontSize:12, color:'var(--t3)', textDecoration:'none',
          padding:'6px 12px', borderRadius:999,
          transition:'color 150ms, background 150ms' }}
          onMouseEnter={e=>{ e.currentTarget.style.color='var(--t1)'; e.currentTarget.style.background='var(--b0)' }}
          onMouseLeave={e=>{ e.currentTarget.style.color='var(--t3)'; e.currentTarget.style.background='transparent' }}>
          Retake
        </Link>
        <Link to="/policies" className="btn btn-amber"
          style={{ fontSize:12, padding:'8px 9px 8px 18px' }}>
          Generate Policies — $299
          <span className="btn-icon" style={{ width:26, height:26 }}><Arr s={13}/></span>
        </Link>
      </nav>

      <main style={{ maxWidth:1100, margin:'0 auto', padding:'100px 24px 80px',
        display:'flex', flexDirection:'column', gap:16 }}>

        {/* ── Hero score card ── */}
        <div className="card reveal">
          <div className="card-inner" style={{ padding:'clamp(28px,4vw,52px)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto',
              gap:40, alignItems:'center' }}
              className="max-md:grid-cols-1 max-md:gap-6">
              <Ring score={overallScore}/>
              <div>
                <p style={{ fontSize:11, color:'var(--t3)', fontWeight:600,
                  letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>
                  {company?.companyName || 'Your Company'} · ISO 42001 Readiness
                </p>
                <h1 style={{ fontFamily:'Space Grotesk, sans-serif',
                  fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700,
                  color:'var(--t1)', letterSpacing:'-0.025em', marginBottom:14 }}>
                  Your Readiness Score
                </h1>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8,
                  padding:'5px 14px', borderRadius:999,
                  border:`1px solid ${st.border}`, background:st.bg, marginBottom:14 }}>
                  <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:11,
                    fontWeight:700, color:st.text, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    {st.label} — {st.desc}
                  </span>
                </div>
                <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.72, maxWidth:'52ch' }}>
                  {overallScore < 50
                    ? 'Significant gaps to close before your next investor meeting. Every gap is fixable — the right policies turn weaknesses into governance proof.'
                    : overallScore < 75
                    ? 'Solid foundation. Targeted policies will get you to investor-ready governance quickly.'
                    : 'Strong posture. Download your policies to formalise and evidence your practices for auditors.'}
                </p>
              </div>
              <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <Link to="/policies" className="btn btn-amber"
                  style={{ whiteSpace:'nowrap', justifyContent:'center', padding:'13px 13px 13px 22px', fontSize:14 }}>
                  Generate Policies
                  <span className="btn-icon"><Arr/></span>
                </Link>
                <span style={{ fontSize:11, color:'var(--t3)' }}>$299 · one-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Control breakdown bento ── */}
        <div>
          <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:18, fontWeight:700,
            color:'var(--t1)', marginBottom:14, letterSpacing:'-0.015em' }}>
            Control-by-Control Breakdown
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}
            className="stagger max-md:grid-cols-1">
            {sectionScores.map((s, i) => (
              <div key={s.id} className="card card-hover">
                <div className="card-inner" style={{ padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                    <div>
                      <p style={{ fontSize:10, color:'var(--t3)', fontFamily:'JetBrains Mono, monospace',
                        marginBottom:5 }}>ISO {s.control}</p>
                      <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:13, fontWeight:600,
                        color:'var(--t1)', lineHeight:1.3 }}>{s.title}</p>
                    </div>
                    <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:24, fontWeight:700,
                      color:barColor(s.score), flexShrink:0, lineHeight:1,
                      fontVariantNumeric:'tabular-nums' }}>{s.score}%</span>
                  </div>
                  <Bar score={s.score} delay={i * 80}/>
                  <div style={{ marginTop:12 }}>
                    {s.gaps.length === 0
                      ? <p style={{ fontSize:12, color:'var(--emerald)', display:'flex', gap:5,
                          alignItems:'center', fontWeight:600 }}>
                          <svg width={13} height={13} viewBox="0 0 13 13" fill="none">
                            <path d="M2 6.5l3 3 6-6" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          All controls addressed
                        </p>
                      : <p style={{ fontSize:12, color:'var(--t3)', lineHeight:1.5,
                          overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                          <span style={{ color:'var(--t2)', fontWeight:600 }}>Gap: </span>{s.gaps[0]}
                        </p>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top gaps ── */}
        {topGaps.length > 0 && (
          <div>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:18, fontWeight:700,
              color:'var(--t1)', marginBottom:14, letterSpacing:'-0.015em' }}>
              Top {topGaps.length} Gaps — Prioritised by Impact
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }} className="stagger">
              {topGaps.map((gap, i) => {
                const is = impStyle(gap.impact)
                return (
                  <div key={i} className="card card-hover">
                    <div className="card-inner" style={{ padding:'16px 20px',
                      display:'flex', alignItems:'flex-start', gap:16 }}>
                      <span style={{ flexShrink:0, width:30, height:30, borderRadius:9,
                        background:'var(--b0)', border:'1px solid var(--b1)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'JetBrains Mono, monospace', fontSize:11, fontWeight:600, color:'var(--t3)' }}>
                        {i+1}
                      </span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                          <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.09em',
                            fontFamily:'Space Grotesk, sans-serif',
                            padding:'2px 8px', borderRadius:6,
                            border:`1px solid ${is.border}`, background:is.bg, color:is.color }}>
                            {gap.impact}
                          </span>
                          <span style={{ fontSize:11, color:'var(--t3)', fontWeight:500 }}>{gap.sectionTitle}</span>
                        </div>
                        <p style={{ fontSize:14, color:'var(--t1)', lineHeight:1.65, fontWeight:450 }}>{gap.question}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="card reveal"
          style={{ borderColor:'rgba(37,99,235,0.22)',
            boxShadow:'inset 0 1px 0 var(--b3), 0 0 60px rgba(37,99,235,0.06)' }}>
          <div className="card-inner" style={{
            padding:'clamp(28px,4vw,48px)', textAlign:'center',
            background:'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(37,99,235,0.07), transparent)',
          }}>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif',
              fontSize:'clamp(20px,3vw,30px)', fontWeight:700,
              color:'var(--t1)', letterSpacing:'-0.025em', marginBottom:10 }}>
              Fix these gaps with 7 customised ISO 42001 policies
            </h2>
            <p style={{ fontSize:14, color:'var(--t2)', maxWidth:'52ch',
              margin:'0 auto 28px', lineHeight:1.72 }}>
              Ready-to-sign Word documents pre-filled with{' '}
              <strong style={{ color:'var(--t1)' }}>{company?.companyName || 'your company'}</strong>'s details.
              Show investors your governance proof in one afternoon.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
              <Link to="/policies" className="btn btn-amber"
                style={{ fontSize:15, padding:'13px 13px 13px 24px' }}>
                Generate My ISO 42001 Policies — $299
                <span className="btn-icon"><Arr/></span>
              </Link>
              <Link to="/assessment" className="btn btn-ghost" style={{ fontSize:14 }}>Retake assessment</Link>
            </div>
            <p style={{ fontSize:12, color:'var(--t3)', marginTop:16 }}>
              30-day money-back guarantee · One-time payment
            </p>
          </div>
        </div>

        {/* ── Email capture ── */}
        <div className="card reveal">
          <div className="card-inner" style={{ padding:'20px 24px',
            display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:180 }}>
              <p style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:14, fontWeight:600,
                color:'var(--t1)', marginBottom:3 }}>Email me my assessment results</p>
              <p style={{ fontSize:12, color:'var(--t3)' }}>Get a copy of this report in your inbox.</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <input type="email" defaultValue={company?.email || ''} placeholder="you@company.com"
                className="inp" style={{ width:210 }}/>
              <button className="btn btn-blue"
                style={{ padding:'11px 18px', borderRadius:12, fontSize:13, gap:0 }}>
                Send
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop:'1px solid var(--b1)', padding:'24px', textAlign:'center' }}>
        <p style={{ fontSize:12, color:'var(--t3)', margin:0 }}>
          © {new Date().getFullYear()} COMPLAI · Self-assessment, not a formal ISO 42001 audit.
        </p>
      </footer>
    </div>
  )
}
