import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/* ── data ─────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'What is ISO 42001?', a: 'ISO 42001 is the international standard for AI management systems — the governance framework investors and enterprise customers are starting to require. It covers AI policy, risk management, data governance, monitoring, and ethics. Think SOC 2 for AI.' },
  { q: 'Who needs ISO 42001?', a: 'Any company building or deploying AI — especially startups approaching Series A or selling into enterprise. Investors ask "are you ISO 42001 compliant?" during due diligence. Getting ahead of this question is a competitive advantage.' },
  { q: 'Is this a real assessment?', a: 'Yes. The 40 questions map directly to ISO 42001 control areas (A.2, A.5, A.6, A.7, A.8, A.9, A.10). Your score reflects real gaps. This is a rigorous self-assessment — for formal certification you need an external auditor.' },
  { q: 'What happens after I pay $299?', a: 'You immediately get 7 Word documents pre-filled with your company details, ready to review and sign. Plus a professional PDF readiness report for investors and 3 months of ISO 42001 update emails.' },
  { q: 'Do you offer a refund?', a: '30-day money-back guarantee, no questions asked. Email us within 30 days of purchase and we will refund you in full.' },
]

const CONTROLS = [
  { id: 'A.2', label: 'AI Governance', pct: 45, color: '#f59e0b' },
  { id: 'A.6', label: 'Data Governance', pct: 22, color: '#ef4444' },
  { id: 'A.5', label: 'Development', pct: 38, color: '#f59e0b' },
  { id: 'A.8', label: 'Monitoring', pct: 18, color: '#ef4444' },
  { id: 'A.9', label: 'Vendors', pct: 60, color: '#3b82f6' },
  { id: 'A.10', label: 'Ethics', pct: 55, color: '#3b82f6' },
]

/* ── icons (SVG only — no emoji, no icon libraries assumed) ──── */
function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CheckMark({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronDown({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function Shield({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l5.5 2v4.5c0 3-2.5 5.5-5.5 6.5C2.5 13.5 0 11 0 8V3.5L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

/* ── FAQ item ─────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b"
      style={{ borderColor: 'var(--line)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-6 cursor-pointer"
        style={{ background: 'none', border: 'none' }}
        aria-expanded={open}
      >
        <span style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, fontFamily: 'Space Grotesk, sans-serif' }}>{q}</span>
        <span style={{
          color: 'var(--text-muted)',
          transition: 'transform 280ms var(--smooth)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0,
          display: 'flex',
        }}>
          <ChevronDown size={15} />
        </span>
      </button>
      <div className={`faq-grid ${open ? 'open' : ''}`}>
        <div>
          <p style={{ color: 'var(--text-sub)', fontSize: 14, lineHeight: 1.75, paddingBottom: 20 }}>
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Score preview card (hero visual) ──────────────────────────── */
function ScorePreview() {
  const r = 42, circ = 2 * Math.PI * r
  const pct = 47
  const offset = circ - (pct / 100) * circ
  return (
    <div className="bezel reveal reveal-3" style={{ maxWidth: 340, width: '100%' }}>
      <div className="bezel-inner p-6">
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
          Sample ISO 42001 Report
        </div>

        {/* Score ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
              <circle cx={50} cy={50} r={r} fill="none" stroke="#f59e0b" strokeWidth={8}
                strokeLinecap="round" strokeDasharray={circ}
                className="score-ring"
                style={{ '--circ': circ, '--offset': offset, filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.4))' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>47%</span>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>Developing</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>Acme AI Corp.</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>Multiple gaps identified across data governance and monitoring controls.</div>
          </div>
        </div>

        {/* Control bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTROLS.map(c => (
            <div key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.label}</span>
                <span style={{ fontSize: 11, color: c.color, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{c.pct}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: 99, boxShadow: `0 0 6px ${c.color}60` }} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(37,99,235,0.08)', borderRadius: 12, border: '1px solid rgba(37,99,235,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#93b4fd', fontWeight: 600 }}>Generate 7 policies to fix these gaps</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="mesh-bg" style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>

      {/* ── Floating pill nav ── */}
      <nav className="nav-pill" style={{ width: 'min(680px, calc(100vw - 32px))' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(37,99,235,0.35)',
          }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>C</span>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', color: '#fff' }}>COMPLAI</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <a href="#pricing" style={{ padding: '7px 14px', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, textDecoration: 'none', borderRadius: 999, transition: 'color 160ms, background 160ms' }}
            onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.background = 'transparent' }}>
            Pricing
          </a>
          <Link to="/auth" style={{ padding: '7px 14px', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, textDecoration: 'none', borderRadius: 999, transition: 'color 160ms, background 160ms' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}>
            Sign In
          </Link>
        </div>

        {/* CTA pill-in-pill */}
        <Link to="/assessment" className="btn-primary" style={{ marginLeft: 8, fontSize: 13, padding: '8px 10px 8px 16px' }}>
          Take Assessment
          <span className="btn-icon" style={{ width: 26, height: 26 }}>
            <ArrowRight size={13} />
          </span>
        </Link>
      </nav>

      {/* ── Hero — split layout (left text / right visual) ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '140px 32px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
        className="max-md:grid-cols-1 max-md:pt-28 max-md:pb-12">

        {/* Left */}
        <div>
          <div className="eyebrow reveal reveal-1" style={{ marginBottom: 24 }}>
            <Shield size={12} />
            ISO 42001 Readiness Platform
          </div>

          <h1 className="reveal reveal-2" style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(42px, 5vw, 68px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            margin: '0 0 24px',
          }}>
            Investors ask:<br />
            <span style={{ color: 'var(--text-muted)' }}>are you ISO<br />42001 ready?</span>
          </h1>

          <p className="reveal reveal-3" style={{
            fontSize: 17,
            color: 'var(--text-sub)',
            lineHeight: 1.7,
            maxWidth: '46ch',
            marginBottom: 36,
          }}>
            Most AI startups say "Uh..." COMPLAI gives you a readiness score,
            gap analysis, and 7 customised policies for <strong style={{ color: 'var(--text-primary)' }}>$299</strong> instead
            of $50K in consulting fees.
          </p>

          <div className="reveal reveal-4" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/assessment" className="btn-primary">
              Take Free Assessment
              <span className="btn-icon"><ArrowRight /></span>
            </Link>
            <Link to="#pricing" className="btn-ghost">See pricing</Link>
          </div>

          {/* Trust bar */}
          <div className="reveal reveal-5" style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['Free to start', '10–15 minutes', '30-day guarantee'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--emerald)' }}><CheckMark /></span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — score preview card */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="max-md:justify-center">
          <ScorePreview />
        </div>
      </section>

      {/* ── Bento features ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px' }}>
        <div style={{ marginBottom: 56, maxWidth: 480 }}>
          <div className="eyebrow reveal" style={{ marginBottom: 16 }}>How it works</div>
          <h2 className="reveal" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            From zero to investor-ready in one afternoon
          </h2>
        </div>

        {/* Asymmetric bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gridTemplateRows: 'auto auto', gap: 16 }} className="stagger max-md:grid-cols-1">

          {/* Card 1 — wide */}
          <div className="bezel hover-lift">
            <div className="bezel-inner" style={{ padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 600, color: '#93b4fd' }}>01</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                Answer 40 targeted questions
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7, margin: 0, maxWidth: '42ch' }}>
                Walk through 6 sections covering governance, data quality, development, production monitoring, vendors, and ethics. Each question maps to a specific ISO 42001 control.
              </p>
            </div>
          </div>

          {/* Card 2 — narrow */}
          <div className="bezel hover-lift">
            <div className="bezel-inner" style={{ padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 600, color: '#fbbf24' }}>02</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                Get your readiness score
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7, margin: 0 }}>
                Instant percentage score and gap breakdown across all 6 control areas. Free.
              </p>
            </div>
          </div>

          {/* Card 3 — narrow */}
          <div className="bezel hover-lift">
            <div className="bezel-inner" style={{ padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 600, color: '#34d399' }}>03</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                Download 7 policies
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7, margin: 0 }}>
                Pay $299 once. Get 7 customised, ready-to-sign Word documents.
              </p>
            </div>
          </div>

          {/* Card 4 — wide */}
          <div className="bezel hover-lift">
            <div className="bezel-inner" style={{ padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 600, color: '#a78bfa' }}>04</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                Show investors your governance
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.7, margin: 0, maxWidth: '42ch' }}>
                Export a professional 8-page PDF readiness report — designed to drop into investor data rooms, board packs, and pre-audit disclosure folders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px' }}>
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div className="eyebrow reveal" style={{ marginBottom: 16, display: 'inline-flex' }}>Pricing</div>
          <h2 className="reveal" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
            Start free. Pay when you need policies.
          </h2>
          <p className="reveal" style={{ fontSize: 15, color: 'var(--text-sub)', margin: 0 }}>No subscription required to take the assessment.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 16, alignItems: 'start' }} className="stagger max-md:grid-cols-1">
          {/* Free */}
          <div className="bezel">
            <div className="bezel-inner" style={{ padding: 28 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 8px' }}>Assessment</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Free</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 24px' }}>Always free</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['40-question ISO 42001 assessment', 'Readiness score 0–100%', 'Gap analysis across 6 controls', 'Top 5 prioritised gaps', 'PDF readiness report'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-sub)' }}>
                    <span style={{ color: 'var(--emerald)', marginTop: 1, flexShrink: 0 }}><CheckMark /></span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/assessment" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                Take Assessment
              </Link>
            </div>
          </div>

          {/* Paid — highlighted */}
          <div className="bezel" style={{ border: '1px solid rgba(37,99,235,0.40)', boxShadow: '0 0 40px rgba(37,99,235,0.10), 0 24px 48px -12px rgba(0,0,0,0.45)' }}>
            <div className="bezel-inner" style={{ padding: 28, background: 'rgba(37,99,235,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 13, color: '#93b4fd', fontWeight: 600, margin: 0 }}>Policy Generator</p>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'var(--blue)', padding: '3px 9px', borderRadius: 999, letterSpacing: '0.06em' }}>MOST POPULAR</span>
              </div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.03em' }}>$299</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 24px' }}>One-time payment</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Everything in Free, plus:', '7 customised ISO 42001 policies', 'Pre-filled with your company details', 'Ready-to-sign Word documents', '30-day money-back guarantee', '3 months of ISO 42001 updates'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-sub)' }}>
                    <span style={{ color: 'var(--emerald)', marginTop: 1, flexShrink: 0 }}><CheckMark /></span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/policies" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Get All 7 Policies
                <span className="btn-icon"><ArrowRight /></span>
              </Link>
            </div>
          </div>

          {/* Monthly */}
          <div className="bezel">
            <div className="bezel-inner" style={{ padding: 28 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 8px' }}>Policy Updates</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.03em' }}>$29<span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span></p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 24px' }}>Cancel anytime</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Everything in Policy Generator, plus:', 'Monthly policy updates', 'ISO 42001 change alerts', 'Ongoing compliance guidance', 'Priority email support'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-sub)' }}>
                    <span style={{ color: 'var(--emerald)', marginTop: 1, flexShrink: 0 }}><CheckMark /></span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/policies" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px 96px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow reveal" style={{ marginBottom: 16, display: 'inline-flex' }}>FAQ</div>
          <h2 className="reveal" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Common questions
          </h2>
        </div>
        <div style={{ borderTop: '1px solid var(--line)' }} className="reveal">
          {FAQS.map(item => <FaqItem key={item.q} {...item} />)}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 100px' }}>
        <div className="bezel reveal" style={{ border: '1px solid rgba(37,99,235,0.20)', boxShadow: '0 0 60px rgba(37,99,235,0.07)' }}>
          <div className="bezel-inner" style={{ padding: 'clamp(40px, 5vw, 72px)', textAlign: 'center', background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,99,235,0.08), transparent)' }}>
            <div className="eyebrow" style={{ display: 'inline-flex', marginBottom: 20 }}>Get started today</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', letterSpacing: '-0.03em' }}>
              Get ISO 42001-ready instead<br />of spending $50K on consulting
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-sub)', maxWidth: '48ch', margin: '0 auto 36px', lineHeight: 1.7 }}>
              Take the free assessment, see your exact gaps, and download customised policies — all before your next investor call.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/assessment" className="btn-primary" style={{ fontSize: 15, padding: '14px 14px 14px 24px' }}>
                Start Free Assessment
                <span className="btn-icon"><ArrowRight /></span>
              </Link>
              <Link to="#pricing" className="btn-ghost" style={{ fontSize: 15 }}>View pricing</Link>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>No account required · Takes 10–15 minutes</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>C</span>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color: 'var(--text-sub)' }}>COMPLAI</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          © {new Date().getFullYear()} COMPLAI · ISO 42001 Readiness for AI Startups
        </p>
      </footer>
    </div>
  )
}
