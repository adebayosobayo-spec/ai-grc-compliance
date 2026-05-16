import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const POLICIES = [
  { num: 1, title: 'AI Governance Policy',                     desc: 'Governance framework, roles, board review, and approval processes.',                          pages: '3–4 pages' },
  { num: 2, title: 'Data Governance Policy for AI',            desc: 'Data quality standards, bias mitigation, privacy controls, and training data documentation.',  pages: '4–5 pages' },
  { num: 3, title: 'AI System Development & Testing Policy',   desc: 'Testing (bias, adversarial, fairness), version control, and deployment gates.',               pages: '4–5 pages' },
  { num: 4, title: 'AI System Deployment & Monitoring Policy', desc: 'Deployment checklists, real-time monitoring, incident response tiers, and audit logging.',     pages: '4–5 pages' },
  { num: 5, title: 'Third-Party AI Vendor Policy',             desc: 'Vendor approval, DPA requirements, approved vendor register, and breach escalation.',          pages: '3–4 pages' },
  { num: 6, title: 'AI Ethics & Bias Mitigation Policy',       desc: 'Ethics principles, bias testing standards, user transparency obligations, and escalation.',    pages: '4–5 pages' },
  { num: 7, title: 'Incident Response Policy for AI Systems',  desc: 'Incident tiers (Critical/High/Medium), response procedures, post-incident review, templates.', pages: '3–4 pages' },
]

const PLANS = [
  {
    id: 'one_time', name: 'Policy Generator', priceLabel: '$299', period: 'one-time',
    badge: null,
    features: ['7 customised ISO 42001 policies', 'Pre-filled with your company details', 'Ready-to-sign Word documents (.docx)', 'Professional PDF readiness report', '3 months ISO 42001 email updates', '30-day money-back guarantee'],
    cta: 'Pay $299 — Get All 7 Policies',
  },
  {
    id: 'combo', name: 'Policies + Updates', priceLabel: '$299 + $29/mo', period: 'one-time + monthly',
    badge: 'Best Value',
    features: ['Everything in Policy Generator, plus:', 'Monthly policy updates as ISO 42001 evolves', 'ISO 42001 regulatory change alerts', 'Ongoing compliance monitoring guidance', 'Priority email support', 'Cancel anytime'],
    cta: 'Pay $299 + Start Monthly Updates',
  },
  {
    id: 'monthly', name: 'Monthly Updates Only', priceLabel: '$29/mo', period: 'per month',
    badge: null,
    features: ['Monthly policy update notifications', 'ISO 42001 change alerts', 'Updated policy templates', 'Cancel anytime'],
    cta: 'Subscribe for $29/mo',
  },
]

/* ── icons ─────────────────────────────────────────────────────── */
function ArrowRight({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CheckMark({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function DownloadIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function DocIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V6L9 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function LockIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <rect x="2" y="5.5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Plan selector card ──────────────────────────────────────────── */
function PlanCard({ plan, selected, onSelect }) {
  const active = selected === plan.id
  return (
    <button onClick={() => onSelect(plan.id)} aria-pressed={active}
      style={{
        width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
      }}>
      <div style={{
        borderRadius: 18,
        padding: 20,
        border: `${active ? 2 : 1}px solid ${active ? 'rgba(37,99,235,0.55)' : 'rgba(255,255,255,0.08)'}`,
        background: active ? 'rgba(37,99,235,0.07)' : 'rgba(255,255,255,0.02)',
        boxShadow: active ? '0 0 28px rgba(37,99,235,0.09)' : 'none',
        transition: 'border-color 180ms var(--crisp), background 180ms var(--crisp), box-shadow 180ms var(--crisp)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{plan.name}</span>
              {plan.badge && (
                <span style={{ fontSize: 9, fontWeight: 700, color: '#0d0d0d', background: '#f59e0b', padding: '2px 8px', borderRadius: 999, letterSpacing: '0.06em', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {plan.badge}
                </span>
              )}
            </div>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>{plan.priceLabel}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>{plan.period}</p>
          </div>
          {/* Radio indicator */}
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
            border: `2px solid ${active ? 'var(--blue)' : 'rgba(255,255,255,0.20)'}`,
            background: active ? 'var(--blue)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 180ms var(--crisp), background 180ms var(--crisp)',
          }}>
            {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {plan.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-sub)' }}>
              <span style={{ color: '#10b981', marginTop: 1, flexShrink: 0 }}><CheckMark /></span>{f}
            </li>
          ))}
        </ul>
      </div>
    </button>
  )
}

/* ── Payment form ─────────────────────────────────────────────────── */
function PaymentForm({ plan, company, onSuccess }) {
  const [form, setForm] = useState({ email: company?.email || '', card: '', expiry: '', cvc: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handlePay = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.card || !form.expiry || !form.cvc) { setError('Please fill in all payment details.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    localStorage.setItem('complai_paid', JSON.stringify({ plan: plan?.id, date: new Date().toISOString() }))
    setLoading(false)
    onSuccess()
  }

  const fmtCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const fmtExpiry = v => v.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2')

  return (
    <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label htmlFor="pay-email" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7 }}>Email</label>
        <input id="pay-email" type="email" required placeholder="you@company.com" className="input-premium"
          value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="pay-card" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7 }}>Card number</label>
        <input id="pay-card" type="text" required placeholder="1234 5678 9012 3456" className="input-premium"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
          value={form.card} maxLength={19}
          onChange={e => setForm(p => ({ ...p, card: fmtCard(e.target.value) }))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="pay-expiry" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7 }}>Expiry</label>
          <input id="pay-expiry" type="text" required placeholder="MM/YY" className="input-premium"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
            value={form.expiry} maxLength={5}
            onChange={e => setForm(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))} />
        </div>
        <div>
          <label htmlFor="pay-cvc" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7 }}>CVC</label>
          <input id="pay-cvc" type="text" required placeholder="123" className="input-premium"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
            value={form.cvc} maxLength={4}
            onChange={e => setForm(p => ({ ...p, cvc: e.target.value.replace(/\D/g,'').slice(0,4) }))} />
        </div>
      </div>

      {error && <p style={{ fontSize: 12, color: '#fca5a5', margin: 0, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.20)' }}>{error}</p>}

      <button type="submit" disabled={loading} className="btn-cta"
        style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, padding: '14px 14px 14px 22px' }}>
        {loading ? (
          <>
            <div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0d0d0d', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Processing…
          </>
        ) : (
          <>{plan?.cta || 'Complete Purchase'}<span className="btn-icon"><ArrowRight /></span></>
        )}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
        <LockIcon /> Secured by Stripe · 30-day money-back guarantee
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  )
}

/* ── Download section ─────────────────────────────────────────────── */
function DownloadSection({ company }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="page-enter">
      <div style={{ padding: '16px 20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.5-5l-2-2 1.5-1.5 .5.5 3.5-3.5 1.5 1.5-5 5z" fill="#10b981" />
        </svg>
        <div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: '#6ee7b7', margin: '0 0 3px' }}>Payment successful — your policies are ready</p>
          <p style={{ fontSize: 12, color: 'rgba(110,231,183,0.70)', margin: 0, lineHeight: 1.5 }}>
            Pre-filled with <strong>{company?.companyName || 'your company'}</strong>'s details. Review, sign, and share with your CTO, CFO, and General Counsel.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="stagger">
        {POLICIES.map(policy => (
          <div key={policy.num} className="bezel hover-lift">
            <div className="bezel-inner" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#93b4fd' }}>
                <DocIcon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{policy.title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{policy.pages} · Word (.docx) · Ready to sign</p>
              </div>
              <button className="btn-ghost" style={{ flexShrink: 0, gap: 6, padding: '8px 14px', fontSize: 12 }}>
                <DownloadIcon size={13} /> Download
              </button>
            </div>
          </div>
        ))}

        {/* PDF report */}
        <div className="bezel hover-lift">
          <div className="bezel-inner" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fbbf24' }}>
              <DocIcon />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>ISO 42001 Readiness Report (PDF)</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>8–12 pages · Investor-ready · Includes roadmap</p>
            </div>
            <button className="btn-ghost" style={{ flexShrink: 0, gap: 6, padding: '8px 14px', fontSize: 12 }}>
              <DownloadIcon size={13} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Link to="/results" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 160ms' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          Back to Gap Analysis
        </Link>
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
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

  const activePlan = PLANS.find(p => p.id === selected)

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }} className="mesh-bg page-enter">

      {/* ── Floating pill nav ── */}
      <nav style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, width: 'min(640px, calc(100vw - 32px))',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 12px 8px 20px',
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
        {!paid && (
          <Link to="/results" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 12px', borderRadius: 999, transition: 'color 160ms, background 160ms' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}>
            Back to Results
          </Link>
        )}
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px' }}>
        {paid ? (
          /* ── Post-payment ── */
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                Your 7 ISO 42001 Policies Are Ready
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-sub)', margin: 0, lineHeight: 1.65 }}>
                Download, review, and sign. Share with your CTO, CFO, General Counsel, and board.
              </p>
            </div>
            <DownloadSection company={company} />
          </div>
        ) : (
          /* ── Pre-payment ── */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32, alignItems: 'start' }} className="max-md:grid-cols-1">

            {/* Left: plan selection + policy list */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.08)', color: '#93b4fd', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>
                  Choose your plan
                </div>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                  Get Your ISO 42001 Policies
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-sub)', margin: 0, lineHeight: 1.65, maxWidth: '48ch' }}>
                  7 customised, ready-to-sign policies pre-filled with your company's details.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }} className="stagger">
                {PLANS.map(plan => <PlanCard key={plan.id} plan={plan} selected={selected} onSelect={setSelected} />)}
              </div>

              {/* Policy list */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.10em', margin: '0 0 16px' }}>
                  What you get — all 7 policies
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="stagger">
                  {POLICIES.map(policy => (
                    <div key={policy.num} className="bezel">
                      <div className="bezel-inner" style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color: '#93b4fd', flexShrink: 0 }}>
                          {policy.num}
                        </span>
                        <div>
                          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px' }}>{policy.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px', lineHeight: 1.5 }}>{policy.desc}</p>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>{policy.pages} · .docx · Ready to sign</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: sticky payment panel */}
            <div style={{ position: 'sticky', top: 90 }}>
              <div className="bezel" style={{ boxShadow: '0 0 60px rgba(0,0,0,0.40), 0 24px 48px -12px rgba(0,0,0,0.45)' }}>
                <div className="bezel-inner" style={{ padding: 28 }}>
                  <div style={{ marginBottom: 22, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Order summary</p>
                    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{activePlan?.priceLabel}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{activePlan?.name} · {activePlan?.period}</p>
                  </div>
                  <PaymentForm plan={activePlan} company={company} onSuccess={() => setPaid(true)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--line)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          © {new Date().getFullYear()} COMPLAI · 30-day money-back guarantee on all purchases
        </p>
      </footer>
    </div>
  )
}
