import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* ── helpers ─────────────────────────────────────────────────────── */
function scoreStatus(score) {
  if (score < 25) return { label: 'Not Ready',   desc: 'Urgent action needed',        stroke: '#ef4444', textColor: '#fca5a5', badgeBg: 'rgba(239,68,68,0.09)',  badgeBorder: 'rgba(239,68,68,0.30)'  }
  if (score < 50) return { label: 'Developing',  desc: 'Multiple gaps to address',     stroke: '#f59e0b', textColor: '#fcd34d', badgeBg: 'rgba(245,158,11,0.09)', badgeBorder: 'rgba(245,158,11,0.30)' }
  if (score < 75) return { label: 'Progressing', desc: 'Good foundation, refine gaps', stroke: '#3b82f6', textColor: '#93b4fd', badgeBg: 'rgba(59,130,246,0.09)',  badgeBorder: 'rgba(59,130,246,0.30)'  }
  return              { label: 'Ready',       desc: 'Investor-ready governance',   stroke: '#10b981', textColor: '#6ee7b7', badgeBg: 'rgba(16,185,129,0.09)',  badgeBorder: 'rgba(16,185,129,0.30)'  }
}

function barStroke(score) {
  if (score < 25) return '#ef4444'
  if (score < 50) return '#f59e0b'
  if (score < 75) return '#3b82f6'
  return '#10b981'
}

function impactStyle(impact) {
  if (impact === 'CRITICAL') return { bg: 'rgba(239,68,68,0.09)',  border: 'rgba(239,68,68,0.30)',  color: '#fca5a5' }
  if (impact === 'HIGH')     return { bg: 'rgba(245,158,11,0.09)', border: 'rgba(245,158,11,0.30)', color: '#fcd34d' }
  return                            { bg: 'rgba(59,130,246,0.09)',  border: 'rgba(59,130,246,0.30)', color: '#93b4fd' }
}

/* ── Count-up hook ───────────────────────────────────────────────── */
function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(step)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, duration])
  return val
}

/* ── Animated score bar ──────────────────────────────────────────── */
function ScoreBar({ score, delay = 0 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 150 + delay)
    return () => clearTimeout(t)
  }, [score, delay])
  return (
    <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${width}%`, borderRadius: 99,
        background: barStroke(score),
        boxShadow: `0 0 6px ${barStroke(score)}50`,
        transition: `width 800ms cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
      }} />
    </div>
  )
}

/* ── Score ring ──────────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const status = scoreStatus(score)
  const r = 60, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const display = useCountUp(score, 1100)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={156} height={156} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={78} cy={78} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
        <circle cx={78} cy={78} r={r} fill="none" stroke={status.stroke} strokeWidth={10}
          strokeLinecap="round" strokeDasharray={circ}
          className="score-ring"
          style={{ '--circ': circ, '--offset': offset, filter: `drop-shadow(0 0 8px ${status.stroke}55)` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center', userSelect: 'none' }}>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: status.textColor, margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{display}%</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0', fontWeight: 500 }}>{status.label}</p>
      </div>
    </div>
  )
}

/* ── Arrow icons ─────────────────────────────────────────────────── */
function ArrowRight({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
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
  const status = scoreStatus(overallScore)

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }} className="mesh-bg page-enter">

      {/* ── Floating pill nav ── */}
      <nav style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, width: 'min(720px, calc(100vw - 32px))',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 8px 8px 20px',
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
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: '#fff' }}>COMPLAI</span>
        </Link>
        <div style={{ flex: 1 }} />
        <Link to="/assessment" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 12px', borderRadius: 999, transition: 'color 160ms, background 160ms' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}>
          Retake
        </Link>
        <Link to="/policies" className="btn-cta" style={{ fontSize: 12, padding: '8px 10px 8px 16px' }}>
          Generate Policies — $299
          <span className="btn-icon" style={{ width: 26, height: 26 }}><ArrowRight size={13} /></span>
        </Link>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* ── Hero score card ── */}
        <div className="bezel reveal" style={{ marginBottom: 20 }}>
          <div className="bezel-inner" style={{ padding: 'clamp(28px,4vw,48px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 40, alignItems: 'center' }} className="max-md:grid-cols-1 max-md:gap-6">
              <ScoreRing score={overallScore} />
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                  {company?.companyName || 'Your Company'} · ISO 42001 Readiness
                </p>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
                  Your Readiness Score
                </h1>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, border: `1px solid ${status.badgeBorder}`, background: status.badgeBg, marginBottom: 14 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700, color: status.textColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {status.label} — {status.desc}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7, maxWidth: '52ch', margin: 0 }}>
                  {overallScore < 50
                    ? 'Significant gaps to close before your next investor meeting. Every gap is fixable — the right policies turn weaknesses into evidence of governance maturity.'
                    : overallScore < 75
                    ? 'Solid foundation. A few targeted policies will get you to investor-ready governance quickly.'
                    : 'Strong governance posture. Download your policies to formalise and evidence your practices for auditors and investors.'}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <Link to="/policies" className="btn-cta" style={{ whiteSpace: 'nowrap', justifyContent: 'center' }}>
                  Generate Policies
                  <span className="btn-icon"><ArrowRight /></span>
                </Link>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>$299 · one-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Control breakdown ── */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Control-by-Control Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="stagger max-md:grid-cols-1">
            {sectionScores.map((s, i) => (
              <div key={s.id} className="bezel hover-lift">
                <div className="bezel-inner" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', margin: '0 0 5px' }}>ISO {s.control}</p>
                      <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{s.title}</p>
                    </div>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: barStroke(s.score), flexShrink: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.score}%</span>
                  </div>
                  <ScoreBar score={s.score} delay={i * 80} />
                  <div style={{ marginTop: 12 }}>
                    {s.gaps.length === 0 ? (
                      <p style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, margin: 0 }}>
                        <svg width={13} height={13} viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        All controls addressed
                      </p>
                    ) : (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        <span style={{ color: 'var(--text-sub)', fontWeight: 600 }}>Top gap: </span>{s.gaps[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top gaps ── */}
        {topGaps.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              Top {topGaps.length} Gaps — Prioritised by Impact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
              {topGaps.map((gap, i) => {
                const s = impactStyle(gap.impact)
                return (
                  <div key={i} className="bezel hover-lift">
                    <div className="bezel-inner" style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                        {i + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 6, border: `1px solid ${s.border}`, background: s.bg, color: s.color }}>
                            {gap.impact}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{gap.sectionTitle}</span>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, lineHeight: 1.6, fontWeight: 450 }}>{gap.question}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="bezel reveal" style={{ border: '1px solid rgba(37,99,235,0.20)', boxShadow: '0 0 40px rgba(37,99,235,0.06)' }}>
          <div className="bezel-inner" style={{ padding: 'clamp(28px,4vw,44px)', textAlign: 'center', background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(37,99,235,0.07), transparent)' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(20px,3vw,30px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Fix these gaps with 7 customised ISO 42001 policies
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', maxWidth: '52ch', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Ready-to-sign Word documents pre-filled with <strong style={{ color: 'var(--text-primary)' }}>{company?.companyName || 'your company'}</strong>'s details. Show investors your governance proof in one afternoon.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/policies" className="btn-cta" style={{ fontSize: 15, padding: '13px 13px 13px 22px' }}>
                Generate My ISO 42001 Policies — $299
                <span className="btn-icon"><ArrowRight /></span>
              </Link>
              <Link to="/assessment" className="btn-ghost" style={{ fontSize: 14 }}>Retake assessment</Link>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>30-day money-back guarantee · One-time payment</p>
          </div>
        </div>

        {/* ── Email capture ── */}
        <div className="bezel reveal" style={{ marginTop: 16 }}>
          <div className="bezel-inner" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>Email me my assessment results</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Get a copy of this report in your inbox.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" defaultValue={company?.email || ''} placeholder="you@company.com" className="input-premium" style={{ width: 220 }} />
              <button className="btn-primary" style={{ flexShrink: 0, padding: '11px 18px', borderRadius: 12 }}>Send</button>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--line)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          © {new Date().getFullYear()} COMPLAI · Self-assessment, not a formal ISO 42001 audit.
        </p>
      </footer>
    </div>
  )
}
