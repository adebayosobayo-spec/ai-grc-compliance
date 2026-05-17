import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const SAMPLE_SECTIONS = [
  { id:'A.2', title:'Context & Scope',   score:92, color:'#059669' },
  { id:'A.6', title:'Risk Management',   score:41, color:'#DC2626' },
  { id:'A.5', title:'AI Policy',         score:67, color:'#D97706' },
  { id:'A.8', title:'Operations',        score:58, color:'#D97706' },
  { id:'A.9', title:'Monitoring',        score:75, color:'#059669' },
  { id:'A.7', title:'Documentation',     score:33, color:'#DC2626' },
]

const FAQS = [
  { q:'What is ISO 42001?', a:'ISO 42001 is the international standard for AI management systems. It provides a framework for organisations to govern AI responsibly — covering risk, policy, operations, and accountability. Investors and enterprise customers increasingly require it.' },
  { q:'Is this a formal audit?', a:'No. This is a self-assessment tool that maps your current practices against the ISO 42001 control framework. It gives you an accurate readiness score and identifies specific gaps, but a formal certification requires an accredited third-party auditor.' },
  { q:'What does the $299 policy pack include?', a:'Seven customised Word documents: AI Governance Policy, Risk Assessment Framework, Incident Response Plan, Transparency & Explainability Policy, Data Governance Policy, Third-Party AI Vendor Policy, and an ISO 42001 Readiness Report. Ready to present to investors or submit to auditors.' },
  { q:'How long does the assessment take?', a:'Most users finish in 8–12 minutes. There are 40 questions across 6 control areas. You can save and return at any time — your progress is stored in your browser.' },
  { q:'Do I need an account?', a:'No. Run the full assessment and see results without signing up. An account lets you save results across devices and access your downloaded policies.' },
]

const STEPS = [
  { n:'01', title:'Take the free assessment', body:'40 questions across 6 ISO 42001 control areas. Honest answers take about 8 minutes.' },
  { n:'02', title:'Get your readiness score',  body:'Instant scoring with a breakdown by control area and a prioritised list of gaps by investor impact.' },
  { n:'03', title:'Generate investor-ready policies', body:'One-click generation of 7 customised policy documents in Word format. $299 one-time.' },
]

const CONTROLS = [
  { id:'A.2', label:'Context & Scope',          desc:'Organisation context, interested parties, AI system scope and boundaries.' },
  { id:'A.6', label:'Risk Management',           desc:'AI-specific risk identification, assessment, treatment, and monitoring.' },
  { id:'A.5', label:'Policy & Leadership',       desc:'AI governance policy, roles, responsibilities, and top management commitment.' },
  { id:'A.8', label:'Operations',               desc:'Operational planning, AI system design, development, and deployment controls.' },
  { id:'A.9', label:'Performance & Monitoring', desc:'Monitoring, measurement, analysis, and evaluation of AI system performance.' },
  { id:'A.7', label:'Documentation',            desc:'Information requirements, documentation control, and record management.' },
]

function AnimatedBar({ score, color, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setWidth(score), delay); obs.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [score, delay])
  return (
    <div ref={ref} style={{ height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: 3, transition: 'width 700ms cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  )
}

function SampleReport() {
  return (
    <div className="card" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)', maxWidth: 420, width: '100%' }}>
      <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>Sample Report</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Acme AI, Inc.</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Assessed May 2025</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: '#D97706', lineHeight: 1 }}>61%</div>
          <div className="badge badge-amber" style={{ marginTop: 6, display: 'inline-flex' }}>Progressing</div>
        </div>
      </div>
      <div style={{ padding: '8px 0' }}>
        {SAMPLE_SECTIONS.map((s, i) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 46px', alignItems: 'center', padding: '7px 20px' }}>
            <span className="mono" style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8' }}>{s.id}</span>
            <div style={{ padding: '0 12px 0 4px' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 5 }}>{s.title}</div>
              <AnimatedBar score={s.score} color={s.color} delay={i * 80} />
            </div>
            <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: s.color, textAlign: 'right' }}>{s.score}%</span>
          </div>
        ))}
      </div>
      <div style={{ margin: '0 16px 16px', padding: '11px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>5 critical gaps found</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#DC2626' }}>View full report →</span>
      </div>
    </div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #E2E8F0' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{q}</span>
        <span style={{ fontSize: 18, color: '#94A3B8', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}>+</span>
      </button>
      <div className={`faq-grid${open ? ' open' : ''}`}>
        <div><p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, paddingBottom: 18 }}>{a}</p></div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100dvh' }}>

      {/* ── Nav ── */}
      <nav className="nav">
        <Link to="/" className="nav-logo">COMPLAI</Link>
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          <Link to="/assessment" className="nav-link">Assessment</Link>
          <a href="#pricing" className="nav-link" style={{ textDecoration: 'none' }}>Pricing</a>
          <a href="#faq" className="nav-link" style={{ textDecoration: 'none' }}>FAQ</a>
        </div>
        <Link to="/auth" className="nav-link" style={{ marginRight: 8 }}>Sign in</Link>
        <Link to="/assessment" className="btn btn-primary btn-sm">Start free →</Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 40px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="eyebrow fade-up" style={{ marginBottom: 16 }}>ISO 42001 Readiness Platform</div>
            <h1 className="fade-up d1" style={{ fontSize: 'clamp(34px,4.5vw,56px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: 22 }}>
              Know your AI governance score before investors ask.
            </h1>
            <p className="fade-up d2" style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
              Free 40-question assessment across all 6 ISO 42001 control areas. Instant gap analysis ranked by investor impact. Policies in Word format for $299.
            </p>
            <div className="fade-up d3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
              <Link to="/assessment" className="btn btn-primary btn-lg">Start free assessment →</Link>
              <Link to="/results" className="btn btn-secondary btn-lg">See sample report</Link>
            </div>
            <div className="fade-up d4" style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
              {[['400+', 'startups assessed'], ['8 min', 'average time'], ['$0', 'to get your score']].map(([n, l]) => (
                <div key={l}>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{n}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-up d2"><SampleReport /></div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '72px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.03em', textAlign: 'center', color: '#0F172A', marginBottom: 56 }}>From zero to investor-ready in three steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
            {STEPS.map((s, i) => (
              <div key={s.n}>
                <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#059669', marginBottom: 14, letterSpacing: '0.04em' }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Control coverage ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '88px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 64, alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Full ISO 42001 coverage</div>
            <h2 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', marginBottom: 16, lineHeight: 1.2 }}>6 control areas. 40 questions. One clear score.</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 28 }}>Every question maps directly to an ISO 42001 clause. Your score reflects true readiness, not a checkbox exercise.</p>
            <Link to="/assessment" className="btn btn-primary">Start assessment →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {CONTROLS.map(c => (
              <div key={c.id} className="card card-hover" style={{ padding: '18px 20px' }}>
                <div className="mono" style={{ fontSize: 11, fontWeight: 700, color: '#059669', marginBottom: 8 }}>{c.id}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.55 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark stats bar ── */}
      <section style={{ background: '#0F172A', padding: '64px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, textAlign: 'center' }}>
          {[['400+','startups have used COMPLAI to score their AI governance before fundraising.'],['8 min','average time to complete the full 40-question ISO 42001 assessment.'],['7','customised policy documents generated instantly after a single payment.']].map(([n, d]) => (
            <div key={n}>
              <div className="mono" style={{ fontSize: 52, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 14 }}>{n}</div>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ maxWidth: 1160, margin: '0 auto', padding: '88px 40px' }}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>Pricing</div>
        <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.03em', textAlign: 'center', color: '#0F172A', marginBottom: 14 }}>Start free. Pay only when you're ready.</h2>
        <p style={{ fontSize: 15, color: '#475569', textAlign: 'center', marginBottom: 52, maxWidth: 440, margin: '0 auto 52px' }}>The assessment and your results are always free. Pay once to unlock the full policy pack.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 720, margin: '0 auto' }}>
          <div className="card" style={{ padding: '32px 28px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>Free</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>$0</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, marginBottom: 24 }}>forever</div>
            <hr style={{ marginBottom: 24 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
              {['Full 40-question assessment','Overall readiness score','Section breakdown by control area','Top 5 gaps identified','Email report delivery'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#475569' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link to="/assessment" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Start assessment</Link>
          </div>
          <div className="card" style={{ padding: '32px 28px', border: '2px solid #059669', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -13, left: 20 }}>
              <span className="badge badge-green">Most popular</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>Policy Pack</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>$299</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, marginBottom: 24 }}>one-time · 30-day guarantee</div>
            <hr style={{ marginBottom: 24 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
              {['Everything in Free','7 customised Word documents','AI Governance Policy','Risk Assessment Framework','Incident Response Plan','Investor-ready PDF report'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#475569' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link to="/policies" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Get policy pack →</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '80px 40px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 800, letterSpacing: '-0.03em', textAlign: 'center', color: '#0F172A', marginBottom: 48 }}>Common questions</h2>
          {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '96px 40px', textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Get started today</div>
        <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: 20, lineHeight: 1.1 }}>
          Your investors will ask.<br />
          <span style={{ color: '#059669' }}>Know your answer.</span>
        </h2>
        <p style={{ fontSize: 15, color: '#475569', marginBottom: 36 }}>Free assessment. No account required. Results in 8 minutes.</p>
        <Link to="/assessment" className="btn btn-primary btn-lg">Run free assessment →</Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>COMPLAI</span>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>ISO 42001 self-assessment · Not a formal audit · © 2025</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Assessment','/assessment'],['Policies','/policies'],['Sign in','/auth']].map(([l,h]) => (
            <Link key={l} to={h} style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
