import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const POLICIES = [
  { num: 1, title: 'AI Governance Policy',                   desc: 'Governance framework, roles, board review, and approval processes.',                             pages: '3–4 pages' },
  { num: 2, title: 'Data Governance Policy for AI',          desc: 'Data quality standards, bias mitigation, privacy controls, and training data documentation.',     pages: '4–5 pages' },
  { num: 3, title: 'AI System Development & Testing Policy', desc: 'Testing requirements (bias, adversarial, fairness), version control, and deployment gates.',      pages: '4–5 pages' },
  { num: 4, title: 'AI System Deployment & Monitoring Policy', desc: 'Deployment checklists, real-time monitoring, incident response tiers, and audit logging.',      pages: '4–5 pages' },
  { num: 5, title: 'Third-Party AI Vendor Policy',           desc: 'Vendor approval process, DPA requirements, approved vendor register, and breach escalation.',     pages: '3–4 pages' },
  { num: 6, title: 'AI Ethics & Bias Mitigation Policy',     desc: 'Ethics principles, bias testing standards, user transparency obligations, and escalation.',       pages: '4–5 pages' },
  { num: 7, title: 'Incident Response Policy for AI Systems', desc: 'Incident tiers (Critical/High/Medium), response procedures, post-incident review, and templates.', pages: '3–4 pages' },
]

const PLANS = [
  {
    id: 'one_time', name: 'Policy Generator', priceLabel: '$299', period: 'one-time',
    features: ['7 customised ISO 42001 policies', 'Pre-filled with your company details', 'Ready-to-sign Word documents (.docx)', 'PDF readiness report', '3 months ISO 42001 email updates', '30-day money-back guarantee'],
    cta: 'Pay $299 — Get All 7 Policies',
  },
  {
    id: 'combo', name: 'Policies + Monthly Updates', priceLabel: '$299 + $29/mo', period: 'one-time + monthly',
    badge: 'Best Value',
    features: ['Everything in Policy Generator, plus:', 'Monthly policy updates as ISO 42001 evolves', 'ISO 42001 regulatory change alerts', 'Ongoing compliance monitoring guidance', 'Priority email support', 'Cancel anytime'],
    cta: 'Pay $299 + Start Monthly Updates',
  },
  {
    id: 'monthly', name: 'Monthly Updates Only', priceLabel: '$29/mo', period: 'per month',
    features: ['Monthly policy update notifications', 'ISO 42001 change alerts', 'Access to updated policy templates', 'Cancel anytime'],
    cta: 'Subscribe for $29/mo',
  },
]

function IconCheck() {
  return (
    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
function IconDownload() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )
}
function IconDoc() {
  return (
    <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

/* ── Plan selector card ──────────────────────────────────────────── */
function PlanCard({ plan, selected, onSelect }) {
  const active = selected === plan.id
  return (
    <button
      onClick={() => onSelect(plan.id)}
      aria-pressed={active}
      className="w-full text-left rounded-2xl p-5 cursor-pointer"
      style={{
        transition: 'border-color 180ms var(--ease-out), background 180ms var(--ease-out), box-shadow 180ms var(--ease-out)',
        borderWidth: active ? 2 : 1,
        borderStyle: 'solid',
        borderColor: active ? 'rgba(37,99,235,0.6)' : 'rgba(255,255,255,0.07)',
        background: active ? 'rgba(37,99,235,0.07)' : '#111827',
        boxShadow: active ? '0 0 24px rgba(37,99,235,0.10)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-slate-100">{plan.name}</span>
            {plan.badge && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">{plan.badge}</span>
            )}
          </div>
          <p className="text-xl font-black text-white">{plan.priceLabel}</p>
          <p className="text-xs text-slate-500">{plan.period}</p>
        </div>
        {/* Radio indicator (Emil: visual feedback on selection) */}
        <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            border: `2px solid ${active ? '#2563EB' : 'rgba(255,255,255,0.20)'}`,
            background: active ? '#2563EB' : 'transparent',
            transition: 'border-color 180ms var(--ease-out), background 180ms var(--ease-out)',
          }}>
          {active && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-xs text-slate-400"><IconCheck />{f}</li>
        ))}
      </ul>
    </button>
  )
}

/* ── Payment form ────────────────────────────────────────────────── */
function PaymentForm({ plan, company, onSuccess }) {
  const [form, setForm]     = useState({ email: company?.email || '', card: '', expiry: '', cvc: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handlePay = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.card || !form.expiry || !form.cvc) { setError('Please fill in all payment details.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    localStorage.setItem('complai_paid', JSON.stringify({ plan: plan.id, date: new Date().toISOString() }))
    setLoading(false)
    onSuccess()
  }

  const fmtCard   = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const fmtExpiry = v => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')

  const inputCls = 'w-full bg-white/[0.04] border border-white/[0.10] text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm input-glow'

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div>
        <label htmlFor="pay-email" className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
        <input id="pay-email" type="email" required placeholder="you@company.com"
          value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} />
      </div>
      <div>
        <label htmlFor="pay-card" className="block text-xs font-semibold text-slate-400 mb-1.5">Card Number</label>
        <input id="pay-card" type="text" required placeholder="1234 5678 9012 3456"
          value={form.card} onChange={e => setForm(p => ({ ...p, card: fmtCard(e.target.value) }))}
          maxLength={19} className={`${inputCls} font-mono`} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pay-expiry" className="block text-xs font-semibold text-slate-400 mb-1.5">Expiry</label>
          <input id="pay-expiry" type="text" required placeholder="MM/YY"
            value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))}
            maxLength={5} className={`${inputCls} font-mono`} />
        </div>
        <div>
          <label htmlFor="pay-cvc" className="block text-xs font-semibold text-slate-400 mb-1.5">CVC</label>
          <input id="pay-cvc" type="text" required placeholder="123"
            value={form.cvc} onChange={e => setForm(p => ({ ...p, cvc: e.target.value.replace(/\D/g,'').slice(0,4) }))}
            maxLength={4} className={`${inputCls} font-mono`} />
        </div>
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

      <button type="submit" disabled={loading}
        className="btn-press w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black rounded-2xl text-sm cursor-pointer flex items-center justify-center gap-2"
        style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)', boxShadow: '0 6px 20px rgba(245,158,11,0.25)' }}>
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Processing…
          </>
        ) : plan.cta}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Secured by Stripe · 30-day money-back guarantee
      </div>
    </form>
  )
}

/* ── Post-payment download ────────────────────────────────────────── */
function DownloadSection({ company }) {
  return (
    <div className="space-y-5 page-enter">
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4">
        <svg className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-bold text-emerald-300 mb-1">Payment successful — your policies are ready</p>
          <p className="text-xs text-emerald-400/70">
            Pre-filled with <strong>{company?.companyName || 'your company'}</strong>'s details. Review, sign, and file with your compliance team.
          </p>
        </div>
      </div>

      <div className="space-y-2 stagger-children">
        {POLICIES.map(policy => (
          <div key={policy.num}
            className="bg-[#111827] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4 hover-lift"
            style={{ transition: 'border-color 200ms var(--ease-out), transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out)' }}>
            <IconDoc />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-100">{policy.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{policy.pages} · Word (.docx)</p>
            </div>
            <button
              className="btn-press flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex-shrink-0 cursor-pointer"
              style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)' }}>
              <IconDownload />Download
            </button>
          </div>
        ))}

        {/* PDF report */}
        <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4 hover-lift"
          style={{ transition: 'border-color 200ms var(--ease-out), transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out)' }}>
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-100">ISO 42001 Readiness Report (PDF)</p>
            <p className="text-xs text-slate-500 mt-0.5">8–12 pages · Investor-ready · Includes roadmap</p>
          </div>
          <button
            className="btn-press flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.10] text-slate-200 text-xs font-bold rounded-xl border border-white/[0.08] flex-shrink-0 cursor-pointer"
            style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)' }}>
            <IconDownload />Export PDF
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link to="/results" className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer"
          style={{ transition: 'color 160ms var(--ease-out)' }}>
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
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 page-enter">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(37,99,235,0.30)' }}>
              <span className="text-white text-xs font-black">C</span>
            </div>
            <span className="text-sm font-black tracking-widest text-white">COMPLAI</span>
          </Link>
          {!paid && (
            <Link to="/results" className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
              style={{ transition: 'color 160ms var(--ease-out)' }}>
              Back to Results
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {paid ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white mb-2">Your 7 ISO 42001 Policies Are Ready</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Download, review, and sign each policy. Share with your CTO, CFO, General Counsel, and board.
              </p>
            </div>
            <DownloadSection company={company} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">

            {/* Left: plan selection + policy list */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Choose Your Plan</p>
                <h1 className="text-3xl font-black text-white mb-2">Get Your ISO 42001 Policies</h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                  7 customised, ready-to-sign policies pre-filled with your company's details.
                </p>
              </div>

              <div className="space-y-3 stagger-children">
                {PLANS.map(plan => (
                  <PlanCard key={plan.id} plan={plan} selected={selected} onSelect={setSelected} />
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What You Get — All 7 Policies</p>
                <div className="space-y-2.5 stagger-children">
                  {POLICIES.map(policy => (
                    <div key={policy.num} className="flex items-start gap-4 p-4 bg-[#111827] border border-white/[0.06] rounded-xl">
                      <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400 font-mono flex-shrink-0">
                        {policy.num}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{policy.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{policy.desc}</p>
                        <p className="text-[10px] text-slate-600 mt-1">{policy.pages} · Word (.docx) · Ready to sign</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: sticky payment panel */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-7"
                style={{ boxShadow: '0 0 40px rgba(0,0,0,0.3)' }}>
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Order Summary</p>
                  <p className="text-2xl font-black text-white">{activePlan?.priceLabel}</p>
                  <p className="text-xs text-slate-500">{activePlan?.name} · {activePlan?.period}</p>
                </div>
                <PaymentForm plan={activePlan} company={company} onSuccess={() => setPaid(true)} />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-600 mt-16">
        © {new Date().getFullYear()} COMPLAI · 30-day money-back guarantee on all purchases
      </footer>
    </div>
  )
}
