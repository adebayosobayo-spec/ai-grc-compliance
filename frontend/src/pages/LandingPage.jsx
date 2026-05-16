import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ── Animated counter ───────────────────────────────────────── */
function Counter({ to, duration = 1400, suffix = '' }) {
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
    let id, t0 = null
    const go = ts => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) id = requestAnimationFrame(go)
    }
    id = requestAnimationFrame(go)
    return () => cancelAnimationFrame(id)
  }, [started, to, duration])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

/* ── Block progress bar ─────────────────────────────────────── */
function BlockBar({ pct, total = 20, color = 'var(--green)' }) {
  const filled = Math.round((pct / 100) * total)
  return (
    <span style={{ letterSpacing: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{ color: i < filled ? color : 'var(--t4)' }}>█</span>
      ))}
    </span>
  )
}

/* ── Score ring ─────────────────────────────────────────────── */
function MiniRing({ pct, color = 'var(--green)', size = 80 }) {
  const r = size / 2 - 6
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--grid2)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="square" strokeDasharray={circ}
        className="ring-anim" style={{ '--full': circ, '--gap': offset }} />
    </svg>
  )
}

/* ── FAQ item ───────────────────────────────────────────────── */
function FaqRow({ q, a, idx }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--grid)' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16,
          padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 11, minWidth: 24, marginTop: 1 }}>
          {String(idx).padStart(2, '0')}
        </span>
        <span style={{ flex: 1, fontSize: 12, color: 'var(--t1)', fontWeight: 500 }}>{q}</span>
        <span style={{ color: 'var(--t3)', fontSize: 12, transition: 'transform 200ms',
          transform: open ? 'rotate(180deg)' : 'none', display: 'flex', flexShrink: 0 }}>▼</span>
      </button>
      <div className={`faq-grid ${open ? 'open' : ''}`}>
        <div>
          <p style={{ paddingLeft: 40, paddingBottom: 14, fontSize: 12, color: 'var(--t2)', lineHeight: 1.7 }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

/* ── data ───────────────────────────────────────────────────── */
const CONTROLS = [
  { id: 'A.2', label: 'AI_GOVERNANCE',  pct: 45, status: 'DEVELOPING' },
  { id: 'A.6', label: 'DATA_GOVERNANCE', pct: 22, status: 'CRITICAL'   },
  { id: 'A.5', label: 'DEVELOPMENT',    pct: 38, status: 'DEVELOPING' },
  { id: 'A.8', label: 'MONITORING',     pct: 18, status: 'CRITICAL'   },
  { id: 'A.9', label: 'VENDORS',        pct: 60, status: 'PROGRESSING'},
  { id: 'A.10',label: 'ETHICS',         pct: 55, status: 'PROGRESSING'},
]

const STEPS = [
  { cmd: 'ASSESS()', desc: 'Answer 40 questions across 6 ISO 42001 control areas. Maps your practices to A.2, A.5, A.6, A.7, A.8, A.9, A.10.' },
  { cmd: 'ANALYSE()', desc: 'Instant readiness score plus prioritised gaps ranked by investor impact. Control-level breakdown. Free.' },
  { cmd: 'GENERATE()', desc: '7 customised Word documents pre-filled with your company details. Ready to sign. $299 one-time.' },
  { cmd: 'EXPORT()', desc: '8-page PDF readiness report. Structured for investor data rooms and pre-audit disclosure folders.' },
]

const FAQS = [
  { q: 'What is ISO 42001?', a: 'ISO 42001 is the international standard for AI management systems. Investors and enterprise customers are starting to require it. Covers AI policy, risk management, data governance, monitoring, and ethics.' },
  { q: 'Who needs ISO 42001?', a: 'Any company building or deploying AI — especially startups raising Series A or selling to enterprise. Investors ask "are you ISO 42001 compliant?" during due diligence.' },
  { q: 'Is this a real assessment?', a: 'Yes. Every question maps to a specific ISO 42001 control area. This is a rigorous self-assessment — formal certification requires an external auditor.' },
  { q: 'What do I get for $299?', a: '7 Word documents (.docx), each 3–5 pages, pre-filled with your company name, industry, and AI system details. All 7 core ISO 42001 policy areas covered.' },
  { q: 'Is there a refund policy?', a: '30-day money-back guarantee. No questions asked.' },
]

export default function LandingPage() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = d => d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }} className="term-in">

      {/* ── Terminal nav bar ── */}
      <nav className="term-nav">
        <Link to="/" className="term-nav-cell" style={{ color: 'var(--green)', gap: 8, minWidth: 140 }}>
          <span style={{ fontWeight: 700 }}>COMPLAI</span>
          <span style={{ color: 'var(--t3)', fontSize: 10 }}>v1.0</span>
        </Link>
        <div className="term-nav-cell" style={{ color: 'var(--t3)', fontSize: 10 }}>
          {fmt(time)}
        </div>
        <div style={{ flex: 1, borderRight: '1px solid var(--grid)' }} />
        <a href="#how" className="term-nav-cell" style={{ color: 'var(--t2)' }}>HOW_IT_WORKS</a>
        <a href="#pricing" className="term-nav-cell" style={{ color: 'var(--t2)' }}>PRICING</a>
        <Link to="/auth" className="term-nav-cell" style={{ color: 'var(--t2)' }}>SIGN_IN</Link>
        <Link to="/assessment" className="term-nav-cell term-nav-cta">
          ▶ START_FREE
        </Link>
      </nav>

      {/* ── Status bar ── */}
      <div className="status-bar">
        <div className="status-cell">
          <div className="status-dot dot-green" />
          <span style={{ color: 'var(--green)' }}>SYSTEM_ONLINE</span>
        </div>
        <div className="status-cell">
          ASSESSMENTS_RUN: <span style={{ color: 'var(--t1)', marginLeft: 6 }}>1,247</span>
        </div>
        <div className="status-cell">
          CONTROLS_TRACKED: <span style={{ color: 'var(--t1)', marginLeft: 6 }}>6</span>
        </div>
        <div className="status-cell">
          UPTIME: <span style={{ color: 'var(--t1)', marginLeft: 6 }}>99.9%</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="status-cell" style={{ borderLeft: '1px solid var(--grid)', borderRight: 'none' }}>
          <div className="status-dot dot-amber" />
          <span>ISO_42001:2023 ACTIVE</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--grid)' }}
        className="max-md:grid-cols-1">

        {/* Left: headline */}
        <div style={{ padding: '64px 40px 64px', borderRight: '1px solid var(--grid)' }}>
          <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.12em',
            marginBottom: 32 }} className="scan-in d1">
            ▸ ISO_42001_READINESS_PLATFORM
          </div>

          <h1 className="scan-in d2" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700,
            color: 'var(--t1)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24 }}>
            ARE YOU ISO<br />
            <span style={{ color: 'var(--green)' }}>42001</span><br />
            READY?
          </h1>

          <p className="scan-in d3" style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.75,
            maxWidth: '44ch', marginBottom: 40 }}>
            Investors ask this question at Series A. Most AI startups say "Uh..."
            COMPLAI runs a 40-question assessment, outputs a readiness score,
            and generates 7 customised ISO 42001 policies for $299.
          </p>

          <div className="scan-in d4" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/assessment" className="tbtn tbtn-solid" style={{ fontSize: 13 }}>
              ▶ RUN_ASSESSMENT()
            </Link>
            <a href="#pricing" className="tbtn" style={{ fontSize: 13 }}>
              VIEW_PRICING()
            </a>
          </div>

          {/* Inline stats */}
          <div className="scan-in d5" style={{ marginTop: 48, display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
            borderTop: '1px solid var(--grid)' }}>
            {[
              { label: 'STARTUPS', val: 1247, suffix: '+' },
              { label: 'CONTROLS', val: 6, suffix: '' },
              { label: 'SAVED_VS_CONSULTING', val: 50, suffix: 'K' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '18px 16px',
                borderRight: i < 2 ? '1px solid var(--grid)' : 'none' }}>
                <p style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700,
                  color: 'var(--green)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {i === 2 ? '$' : ''}<Counter to={s.val} suffix={s.suffix} duration={1200} />
                </p>
                <p style={{ fontSize: 10, color: 'var(--t3)', marginTop: 5, letterSpacing: '0.06em' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: live sample report terminal */}
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="tbox" style={{ flex: 1 }}>
            <div className="tbox-header">
              <span style={{ color: 'var(--green)' }}>●</span>
              SAMPLE_REPORT — ACME_AI_CORP — ISO_42001
              <span style={{ marginLeft: 'auto', color: 'var(--t3)' }}>SCORE: 47%</span>
            </div>

            {/* Score display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20,
              padding: '20px 16px', borderBottom: '1px solid var(--grid)' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <MiniRing pct={47} color="var(--amber)" size={90} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>47%</span>
                </div>
              </div>
              <div>
                <div className="tag tag-amber" style={{ marginBottom: 8 }}>DEVELOPING</div>
                <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.6 }}>
                  Multiple critical gaps identified.<br />
                  Investor-readiness: LOW
                </p>
              </div>
            </div>

            {/* Control table */}
            <div style={{ borderBottom: '1px solid var(--grid)',
              padding: '8px 0' }}>
              {CONTROLS.map(c => {
                const col = c.status === 'CRITICAL' ? 'var(--red)'
                  : c.status === 'PROGRESSING' ? 'var(--green)' : 'var(--amber)'
                return (
                  <div key={c.id} style={{ display: 'grid',
                    gridTemplateColumns: '40px 140px 1fr 80px',
                    gap: 8, padding: '6px 16px', alignItems: 'center',
                    borderBottom: '1px solid var(--grid)',
                  }}>
                    <span style={{ fontSize: 10, color: 'var(--t3)' }}>{c.id}</span>
                    <span style={{ fontSize: 10, color: 'var(--t2)' }}>{c.label}</span>
                    <BlockBar pct={c.pct} total={16} color={col} />
                    <span style={{ fontSize: 10, color: col, textAlign: 'right', fontWeight: 600 }}>
                      {c.pct}%
                    </span>
                  </div>
                )
              })}
            </div>

            {/* CTA strip */}
            <div style={{ padding: '12px 16px', background: 'var(--green2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--green)' }}>
                ▸ 5 critical gaps · 7 policies available
              </span>
              <Link to="/assessment" style={{ fontSize: 11, color: 'var(--green)',
                textDecoration: 'none', fontWeight: 700 }}>
                RUN_YOUR_ASSESSMENT →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ borderBottom: '1px solid var(--grid)' }}>
        <div style={{ borderBottom: '1px solid var(--grid)', padding: '10px 40px',
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'var(--bg1)' }}>
          <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>PROCESS</span>
          <span style={{ color: 'var(--grid2)', fontSize: 10 }}>│</span>
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>HOW_IT_WORKS — 4 STEPS — AVG TIME: 15 MIN</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}
          className="max-md:grid-cols-1 scan-stagger">
          {STEPS.map((s, i) => (
            <div key={s.cmd} style={{
              padding: '28px 24px',
              borderRight: i < 3 ? '1px solid var(--grid)' : 'none',
            }}>
              <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700,
                marginBottom: 12 }}>
                {String(i + 1).padStart(2, '0')} ─────
              </div>
              <p style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 600,
                marginBottom: 10 }}>{s.cmd}</p>
              <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Control map ── */}
      <section style={{ borderBottom: '1px solid var(--grid)' }}>
        <div style={{ borderBottom: '1px solid var(--grid)', padding: '10px 40px',
          display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg1)' }}>
          <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>COVERAGE</span>
          <span style={{ color: 'var(--grid2)', fontSize: 10 }}>│</span>
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>ISO_42001 CONTROL MAP — 6 AREAS — 40 QUESTIONS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}
          className="max-md:grid-cols-1 scan-stagger">
          {[
            { id: 'A.2/A.3', label: 'AI_GOVERNANCE_&_LEADERSHIP',     q: 6, cover: 'Policy, roles, board review, incident response' },
            { id: 'A.6',     label: 'DATA_GOVERNANCE',                 q: 8, cover: 'Lineage, quality, bias, privacy, retention'    },
            { id: 'A.5',     label: 'DEVELOPMENT_&_TESTING',           q: 8, cover: 'Bias testing, adversarial, version control'    },
            { id: 'A.8',     label: 'DEPLOYMENT_&_MONITORING',         q: 8, cover: 'Production monitoring, drift, change mgmt'     },
            { id: 'A.9',     label: 'THIRD_PARTY_AI_VENDORS',          q: 6, cover: 'Contracts, DPAs, vendor risk, data protection' },
            { id: 'A.7/A.10',label: 'ETHICS_&_TRANSPARENCY',           q: 4, cover: 'Framework, user disclosure, GDPR/CCPA'         },
          ].map((c, i) => (
            <div key={c.id} style={{
              padding: '20px 24px',
              borderRight: i % 3 < 2 ? '1px solid var(--grid)' : 'none',
              borderBottom: i < 3 ? '1px solid var(--grid)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 10 }}>
                <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>{c.id}</span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{c.q}Q</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--t1)', fontWeight: 600, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 10, color: 'var(--t3)', lineHeight: 1.6 }}>{c.cover}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ borderBottom: '1px solid var(--grid)' }}>
        <div style={{ borderBottom: '1px solid var(--grid)', padding: '10px 40px',
          display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg1)' }}>
          <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>PRICING</span>
          <span style={{ color: 'var(--grid2)', fontSize: 10 }}>│</span>
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>TIERED_PRICING — START FREE — PAY_WHEN_READY</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}
          className="max-md:grid-cols-1 scan-stagger">

          {/* Free */}
          <div style={{ padding: '32px 28px', borderRight: '1px solid var(--grid)' }}>
            <div className="tag" style={{ marginBottom: 16 }}>ASSESSMENT</div>
            <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.02em',
              marginBottom: 4 }}>FREE</p>
            <p style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 24 }}>ALWAYS_FREE</p>
            <div style={{ marginBottom: 24 }}>
              {['40Q ISO 42001 assessment','Readiness score 0–100%',
                'Gap analysis — 6 controls','Top 5 prioritised gaps','PDF readiness report'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, padding: '6px 0',
                  borderBottom: '1px solid var(--grid)', fontSize: 11, color: 'var(--t2)',
                  alignItems: 'center' }}>
                  <span style={{ color: 'var(--green)' }}>▸</span>{f}
                </div>
              ))}
            </div>
            <Link to="/assessment" className="tbtn" style={{ width: '100%', justifyContent: 'center' }}>
              RUN_ASSESSMENT()
            </Link>
          </div>

          {/* Paid — highlighted */}
          <div style={{ padding: '32px 28px', borderRight: '1px solid var(--grid)',
            background: 'var(--green2)', borderLeft: '2px solid var(--green)',
            position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
              height: 2, background: 'var(--green)' }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
              <div className="tag tag-green">POLICY_GENERATOR</div>
              <div className="tag tag-green" style={{ fontSize: 9 }}>RECOMMENDED</div>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--green)',
              letterSpacing: '-0.02em', marginBottom: 4 }}>$299</p>
            <p style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 24 }}>ONE_TIME_PAYMENT</p>
            <div style={{ marginBottom: 24 }}>
              {['Everything in ASSESSMENT','7 customised ISO 42001 policies',
                'Pre-filled with your details','Ready-to-sign .docx files',
                '30-day money-back guarantee','3 months update emails'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, padding: '6px 0',
                  borderBottom: '1px solid var(--grid2)', fontSize: 11, color: 'var(--t1)',
                  alignItems: 'center' }}>
                  <span style={{ color: 'var(--green)' }}>▸</span>{f}
                </div>
              ))}
            </div>
            <Link to="/policies" className="tbtn tbtn-solid" style={{ width: '100%', justifyContent: 'center' }}>
              GET_ALL_7_POLICIES()
            </Link>
          </div>

          {/* Monthly */}
          <div style={{ padding: '32px 28px' }}>
            <div className="tag" style={{ marginBottom: 16 }}>POLICY_UPDATES</div>
            <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.02em',
              marginBottom: 4 }}>$29</p>
            <p style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 24 }}>PER_MONTH · CANCEL_ANYTIME</p>
            <div style={{ marginBottom: 24 }}>
              {['Everything in POLICY_GENERATOR','Monthly policy updates',
                'ISO 42001 change alerts','Ongoing compliance guidance',
                'Priority support'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, padding: '6px 0',
                  borderBottom: '1px solid var(--grid)', fontSize: 11, color: 'var(--t2)',
                  alignItems: 'center' }}>
                  <span style={{ color: 'var(--green)' }}>▸</span>{f}
                </div>
              ))}
            </div>
            <Link to="/policies" className="tbtn" style={{ width: '100%', justifyContent: 'center' }}>
              SUBSCRIBE()
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ borderBottom: '1px solid var(--grid)' }}>
        <div style={{ borderBottom: '1px solid var(--grid)', padding: '10px 40px',
          display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg1)' }}>
          <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>FAQ</span>
          <span style={{ color: 'var(--grid2)', fontSize: 10 }}>│</span>
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>FREQUENTLY_ASKED_QUESTIONS — {FAQS.length} ENTRIES</span>
        </div>
        <div style={{ maxWidth: 800, padding: '0 40px' }}>
          {FAQS.map((f, i) => <FaqRow key={f.q} q={f.q} a={f.a} idx={i + 1} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderBottom: '1px solid var(--grid)', padding: '60px 40px',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}
        className="max-md:grid-cols-1">
        <div>
          <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700,
            letterSpacing: '0.1em', marginBottom: 16 }}>
            ▸ READY_TO_EXECUTE
          </div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,40px)', fontWeight: 700,
            color: 'var(--t1)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 14 }}>
            GET ISO 42001-READY<br />
            INSTEAD OF PAYING $50K
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.7, maxWidth: '52ch' }}>
            Free assessment → instant gap analysis → 7 customised policies.
            All before your next investor call.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <Link to="/assessment" className="tbtn tbtn-solid" style={{ fontSize: 13, padding: '14px 28px' }}>
            ▶ START_FREE_ASSESSMENT()
          </Link>
          <p style={{ fontSize: 10, color: 'var(--t3)', textAlign: 'center' }}>
            NO_ACCOUNT_REQUIRED · 10–15_MIN · FREE
          </p>
        </div>
      </section>

      {/* ── Footer terminal ── */}
      <footer style={{ padding: '0', borderBottom: '1px solid var(--grid)' }}>
        <div className="status-bar" style={{ borderBottom: 'none', borderTop: '1px solid var(--grid)' }}>
          <div className="status-cell">
            <span>COMPLAI v1.0</span>
          </div>
          <div className="status-cell">
            <span>ISO_42001:2023</span>
          </div>
          <div style={{ flex: 1 }} />
          <div className="status-cell" style={{ borderLeft: '1px solid var(--grid)', borderRight: 'none' }}>
            © {new Date().getFullYear()} COMPLAI · SELF_ASSESSMENT_NOT_FORMAL_AUDIT
          </div>
        </div>
      </footer>
    </div>
  )
}
