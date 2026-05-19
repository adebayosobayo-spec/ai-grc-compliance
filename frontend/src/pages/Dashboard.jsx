import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listAssessments, hasPaid } from '../lib/db'

function statusOf(s) {
  if (s < 25) return { label: 'Not ready',   badge: 'badge-red',   color: '#DC2626' }
  if (s < 50) return { label: 'Developing',  badge: 'badge-amber', color: '#D97706' }
  if (s < 75) return { label: 'Progressing', badge: 'badge-blue',  color: '#2563EB' }
  return              { label: 'Ready',       badge: 'badge-green', color: '#059669' }
}

function ScoreDial({ score, size = 72 }) {
  const r = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const st = statusOf(score)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={st.color} strokeWidth={5}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms ease' }} />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: st.color, lineHeight: 1 }}>{score}%</div>
      </div>
    </div>
  )
}

function AnimatedBar({ score, color }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(score), 150)
    return () => clearTimeout(t)
  }, [score])
  return (
    <div className="bar-track" style={{ flex: 1 }}>
      <div className="bar-fill" style={{ width: `${w}%`, background: color }} />
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 32px' }}>
      <div style={{ width: 60, height: 60, background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}>📋</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 10, letterSpacing: '-0.02em' }}>No assessments yet</h2>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28, maxWidth: 340, margin: '0 auto 28px', lineHeight: 1.65 }}>
        Run your free ISO 42001 assessment to get your readiness score and a prioritised gap analysis.
      </p>
      <Link to="/assessment" className="btn btn-primary btn-lg">Start free assessment →</Link>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState([])
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const [localResult, setLocalResult] = useState(null)
  const [localCompany, setLocalCompany] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [rows, paidStatus] = await Promise.all([
          listAssessments(user.id),
          hasPaid(user.id),
        ])
        setAssessments(rows || [])
        setPaid(paidStatus)
      } catch (err) {
        console.warn('Supabase load error:', err.message)
      }
      try {
        const r = localStorage.getItem('complai_results')
        const c = localStorage.getItem('complai_company')
        const lp = localStorage.getItem('complai_paid')
        if (r) setLocalResult(JSON.parse(r))
        if (c) setLocalCompany(JSON.parse(c))
        if (lp) setPaid(true)
      } catch {}
      setLoading(false)
    }
    load()
  }, [user.id])

  const handleSignOut = async () => {
    setSigningOut(true)
    try { await signOut() } catch {}
    navigate('/')
  }

  const latest = assessments[0]
  const hasData = assessments.length > 0 || !!localResult

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #E2E8F0', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh' }}>

      {/* Nav */}
      <nav className="nav">
        <Link to="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em', color: '#0F172A', textDecoration: 'none', marginRight: 40 }}>COMPLAI</Link>
        <Link to="/dashboard" className="nav-link" style={{ color: '#059669', fontWeight: 600 }}>Dashboard</Link>
        <Link to="/assessment" className="nav-link">New assessment</Link>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#94A3B8', marginRight: 16 }}>{user.email}</span>
        <button onClick={handleSignOut} disabled={signingOut} className="btn btn-secondary btn-sm">
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Your workspace</div>
          <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A' }}>Dashboard</h1>
        </div>

        {!hasData && <div className="card"><EmptyState /></div>}

        {hasData && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'flex-start' }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Latest assessment card */}
              {(() => {
                const score    = latest?.overall_score   ?? localResult?.overallScore ?? 0
                const name     = latest?.company_name    ?? localCompany?.companyName  ?? 'Your company'
                const sections = latest?.section_scores  ?? localResult?.sectionScores ?? []
                const dateStr  = latest?.created_at
                  ? new Date(latest.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                  : 'Recent'
                const st = statusOf(score)
                return (
                  <div className="card">
                    {/* Card header */}
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Latest assessment</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 2 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>{dateStr}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <ScoreDial score={score} />
                        <div>
                          <span className={`badge ${st.badge}`} style={{ display: 'block', marginBottom: 10 }}>{st.label}</span>
                          <Link to="/results" className="btn btn-secondary btn-sm" style={{ display: 'block', textAlign: 'center', marginBottom: 6 }}>View report</Link>
                          <Link to="/assessment" className="btn btn-ghost btn-sm" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>Retake ↺</Link>
                        </div>
                      </div>
                    </div>

                    {/* Section bars */}
                    {sections.length > 0 && (
                      <div style={{ padding: '6px 0' }}>
                        {sections.map((s, i) => {
                          const ss = statusOf(s.score)
                          return (
                            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 46px', alignItems: 'center', padding: '9px 24px', borderBottom: i < sections.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                              <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>{s.id}</span>
                              <div style={{ padding: '0 12px 0 0' }}>
                                <div style={{ fontSize: 11, color: '#475569', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                                <AnimatedBar score={s.score} color={ss.color} />
                              </div>
                              <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: ss.color, textAlign: 'right' }}>{s.score}%</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Card footer CTA */}
                    <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0', background: '#FAFAFA', display: 'flex', gap: 10 }}>
                      <Link to="/policies" className="btn btn-primary btn-sm">
                        {paid ? 'Generate policies →' : 'Get policy pack — $299 →'}
                      </Link>
                      <Link to="/results" className="btn btn-secondary btn-sm">Full report</Link>
                    </div>
                  </div>
                )
              })()}

              {/* History — only if multiple saved assessments */}
              {assessments.length > 1 && (
                <div className="card">
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Assessment history</span>
                  </div>
                  {assessments.map((a, i) => {
                    const st = statusOf(a.overall_score)
                    return (
                      <div key={a.id} style={{ padding: '14px 20px', borderBottom: i < assessments.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{a.company_name || '—'}</div>
                          <div style={{ fontSize: 12, color: '#94A3B8' }}>
                            {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span className={`badge ${st.badge}`} style={{ fontSize: 10 }}>{st.label}</span>
                          <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: st.color }}>{a.overall_score}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Policy pack status */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Policy pack</div>
                {paid ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 36, height: 36, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#059669', flexShrink: 0 }}>✓</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Unlocked</div>
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>7 documents available</div>
                      </div>
                    </div>
                    <Link to="/policies" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Open generator →</Link>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 14 }}>7 AI governance documents generated by Claude, customised to your gaps.</p>
                    <div className="mono" style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>$299 <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>one-time</span></div>
                    <Link to="/policies" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Get policy pack →</Link>
                  </>
                )}
              </div>

              {/* Quick actions */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Quick actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to="/assessment" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>+ New assessment</Link>
                  <Link to="/results" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>View latest report</Link>
                  {paid && <Link to="/policies" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>Generate policies</Link>}
                </div>
              </div>

              {/* Account */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Account</div>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 14, wordBreak: 'break-all' }}>{user.email}</div>
                <button onClick={handleSignOut} disabled={signingOut}
                  style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, color: '#64748B', cursor: signingOut ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 150ms' }}
                  onMouseEnter={e => { e.target.style.borderColor='#FCA5A5'; e.target.style.color='#DC2626' }}
                  onMouseLeave={e => { e.target.style.borderColor='#E2E8F0'; e.target.style.color='#64748B' }}>
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
