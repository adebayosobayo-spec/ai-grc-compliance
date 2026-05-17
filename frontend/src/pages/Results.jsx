import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function statusOf(s) {
  if (s < 25) return { label: 'Not ready',   badge: 'badge-red',   color: '#DC2626' }
  if (s < 50) return { label: 'Developing',  badge: 'badge-amber', color: '#D97706' }
  if (s < 75) return { label: 'Progressing', badge: 'badge-blue',  color: '#2563EB' }
  return              { label: 'Ready',       badge: 'badge-green', color: '#059669' }
}

function impactBadge(impact) {
  if (impact === 'CRITICAL') return 'badge-red'
  if (impact === 'HIGH')     return 'badge-amber'
  return 'badge-blue'
}

function useCount(target, ms = 1200) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let id, t0 = null
    const go = ts => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / ms, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) id = requestAnimationFrame(go)
    }
    id = requestAnimationFrame(go)
    return () => cancelAnimationFrame(id)
  }, [target, ms])
  return v
}

function AnimatedBar({ score, color }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setWidth(score), 100); obs.disconnect() }
    }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [score])
  return (
    <div ref={ref} className="bar-track" style={{ flex: 1 }}>
      <div className="bar-fill" style={{ width: `${width}%`, background: color }} />
    </div>
  )
}

function ScoreRing({ score }) {
  const r = 64, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const st = statusOf(score)
  const display = useCount(score, 1300)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={148} height={148} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={74} cy={74} r={r} fill="none" stroke="#F1F5F9" strokeWidth={8} />
        <circle cx={74} cy={74} r={r} fill="none" stroke={st.color} strokeWidth={8}
          strokeLinecap="round" strokeDasharray={circ}
          className="ring-anim" style={{ '--full': circ, '--gap': offset }} />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 36, fontWeight: 800, color: st.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{display}%</div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 600 }}>{st.label}</div>
      </div>
    </div>
  )
}

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
  const st = statusOf(overallScore)

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh' }}>

      {/* Nav */}
      <nav className="nav">
        <Link to="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em', color: '#0F172A', textDecoration: 'none', marginRight: 'auto' }}>COMPLAI</Link>
        <Link to="/assessment" className="btn btn-secondary btn-sm" style={{ marginRight: 8 }}>Retake</Link>
        <Link to="/policies" className="btn btn-primary btn-sm">Get policies →</Link>
      </nav>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '28px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>ISO 42001 Assessment Results</div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
              {company?.companyName || 'Your company'} · Readiness Report
            </h1>
            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>Self-assessment only · Not a formal audit</p>
          </div>
          <Link to="/policies" className="btn btn-primary">Generate policies — $299 →</Link>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px', display: 'grid', gridTemplateColumns: '272px 1fr', gap: 24, alignItems: 'flex-start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>Overall score</div>
            <ScoreRing score={overallScore} />
            <span className={`badge ${st.badge}`} style={{ marginTop: 16, fontSize: 12, padding: '5px 14px', display: 'inline-flex' }}>{st.label}</span>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 14, lineHeight: 1.6 }}>
              {overallScore < 50 ? 'Multiple critical gaps. Significant risk in investor due diligence.' : overallScore < 75 ? 'Good foundation. Address gaps before fundraising.' : 'Strong posture. Formalise with signed policies.'}
            </p>
          </div>
          <div className="card">
            {sectionScores.map((s, i) => {
              const ss = statusOf(s.score)
              return (
                <div key={s.id} style={{ padding: '12px 16px', borderBottom: i < sectionScores.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', width: 28, flexShrink: 0 }}>{s.id}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                    <AnimatedBar score={s.score} color={ss.color} />
                  </div>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: ss.color, flexShrink: 0 }}>{s.score}%</span>
                </div>
              )
            })}
          </div>
          <Link to="/policies" className="btn btn-primary" style={{ justifyContent: 'center', display: 'flex' }}>Generate policy pack →</Link>
          <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>$299 · one-time · 30-day guarantee</p>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Control table */}
          <div className="card">
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Control breakdown</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>6 ISO 42001 areas</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 120px 56px 100px' }}>
              {['ID','Control area','Coverage','Score','Status'].map(h => (
                <div key={h} style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA', fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.04em' }}>{h}</div>
              ))}
              {sectionScores.map((s, i) => {
                const ss = statusOf(s.score)
                const bg = i % 2 === 0 ? '#fff' : '#FAFAFA'
                const bb = i < sectionScores.length - 1 ? '1px solid #F8FAFC' : 'none'
                return [
                  <div key={`${s.id}-id`} style={{ padding: '14px 16px', background: bg, borderBottom: bb }}>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>{s.id}</span>
                  </div>,
                  <div key={`${s.id}-title`} style={{ padding: '14px 16px', background: bg, borderBottom: bb, fontSize: 13, color: '#374151' }}>{s.title}</div>,
                  <div key={`${s.id}-bar`} style={{ padding: '14px 16px', background: bg, borderBottom: bb, display: 'flex', alignItems: 'center' }}>
                    <AnimatedBar score={s.score} color={ss.color} />
                  </div>,
                  <div key={`${s.id}-score`} style={{ padding: '14px 16px', background: bg, borderBottom: bb }}>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: ss.color }}>{s.score}%</span>
                  </div>,
                  <div key={`${s.id}-badge`} style={{ padding: '12px 16px', background: bg, borderBottom: bb }}>
                    <span className={`badge ${ss.badge}`} style={{ fontSize: 10 }}>{ss.label}</span>
                  </div>,
                ]
              })}
            </div>
          </div>

          {/* Priority gaps */}
          {topGaps.length > 0 && (
            <div className="card">
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#FFF8F8', display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Priority gaps</span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>Top {topGaps.length} ranked by investor impact</span>
              </div>
              {topGaps.map((gap, i) => (
                <div key={i} style={{ padding: '16px 20px', borderBottom: i < topGaps.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'grid', gridTemplateColumns: '28px 88px 1fr', gap: 14, alignItems: 'flex-start' }}>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#CBD5E1', paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`badge ${impactBadge(gap.impact)}`} style={{ fontSize: 10, alignSelf: 'flex-start' }}>{gap.impact}</span>
                  <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{gap.question}</span>
                </div>
              ))}
            </div>
          )}

          {/* Email capture */}
          <div className="card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Get this report in your inbox</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>We'll email a PDF copy of your results.</div>
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              <input type="email" defaultValue={company?.email || ''} placeholder="ceo@company.com" className="inp"
                style={{ width: 210, borderRadius: '8px 0 0 8px', borderRight: 'none' }} />
              <button className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0' }}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
