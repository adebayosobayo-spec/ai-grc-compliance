import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

/* ─── data ────────────────────────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Answer 40 Questions', desc: 'Walk through 6 sections covering governance, data, development, monitoring, vendors, and ethics. Takes 10–15 minutes.' },
  { num: '02', title: 'Get Your Readiness Score', desc: 'Instantly see your ISO 42001 readiness percentage and a full gap analysis across all control areas.' },
  { num: '03', title: 'Download 7 Policies', desc: 'Pay $299 once and download 7 customised, ready-to-sign Word documents tailored to your company.' },
  { num: '04', title: 'Show Investors', desc: 'Export a professional PDF report that proves governance maturity to Series A investors and auditors.' },
]

const FAQS = [
  { q: 'What is ISO 42001?', a: 'ISO 42001 is the international standard for AI management systems — the governance framework investors and enterprise customers increasingly require. It covers AI policy, risk management, data governance, monitoring, and ethics.' },
  { q: 'Who needs ISO 42001?', a: 'Any company building or deploying AI — especially startups raising Series A or selling to enterprise. Investors ask "are you ISO 42001 compliant?" during due diligence. Getting ahead of this is the smart move.' },
  { q: 'Is this a real assessment?', a: "Yes. The 40 questions map directly to ISO 42001 control areas (A.2, A.5, A.6, A.7, A.8, A.9, A.10). This is a self-assessment — for formal certification you'll need an external auditor." },
  { q: 'Can I get a refund on the policy generator?', a: "Yes. 30-day money-back guarantee on the $299 policy generator. If the policies don't meet your needs, email us for a full refund — no questions asked." },
]

const PRICING = [
  {
    name: 'Assessment',
    price: 'Free',
    sub: 'Always free',
    features: ['40-question ISO 42001 assessment', 'Readiness score (0–100%)', 'Gap analysis across 6 controls', 'Top 5 gaps prioritised by impact', 'PDF readiness report'],
    cta: 'Take Free Assessment', to: '/assessment', highlight: false,
  },
  {
    name: 'Policy Generator', price: '$299', sub: 'One-time payment',
    badge: 'Most Popular',
    features: ['Everything in Free, plus:', '7 customised ISO 42001 policies', 'Pre-filled with your company details', 'Ready-to-sign Word documents (.docx)', '30-day money-back guarantee', '3 months of email updates'],
    cta: 'Get All 7 Policies', to: '/policies', highlight: true,
  },
  {
    name: 'Policy Updates', price: '$29', sub: 'per month',
    features: ['Everything in Policy Generator, plus:', 'Monthly policy updates', 'ISO 42001 change alerts', 'Ongoing compliance monitoring', 'Priority email support'],
    cta: 'Subscribe', to: '/policies', highlight: false,
  },
]

/* ─── icons ──────────────────────────────────────────────────────── */
function IconCheck({ className = 'w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
function IconX({ className = 'w-4 h-4 text-red-400 flex-shrink-0 mt-0.5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
function IconChevron({ open }) {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 text-slate-400"
      style={{ transition: 'transform 280ms cubic-bezier(0.23,1,0.32,1)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

/* ─── FAQ item with grid accordion (Emil: no JS height measurement) */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/[0.08] rounded-2xl overflow-hidden hover-lift-sm" style={{ transition: 'border-color 200ms var(--ease-out)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer hover:bg-white/[0.025]"
        style={{ transition: 'background 180ms var(--ease-out)' }}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-100">{q}</span>
        <IconChevron open={open} />
      </button>
      {/* grid-template-rows trick — smooth without JS height calc */}
      <div className={`faq-body ${open ? 'open' : ''}`}>
        <div>
          <p className="px-6 pb-5 pt-1 text-sm text-slate-400 leading-relaxed border-t border-white/[0.06]">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── logo ───────────────────────────────────────────────────────── */
function Logo({ size = 7 }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-${size} h-${size} rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0`}
        style={{ boxShadow: '0 0 16px rgba(37,99,235,0.35)' }}>
        <span className="text-white font-black" style={{ fontSize: size === 7 ? 14 : 12 }}>C</span>
      </div>
      <span className="font-black tracking-widest text-white" style={{ fontSize: size === 7 ? 15 : 13 }}>COMPLAI</span>
    </div>
  )
}

/* ─── page ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 page-enter">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0A0F1E]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={7} />
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-slate-400 hover:text-white hidden sm:block"
              style={{ transition: 'color 160ms var(--ease-out)' }}>
              Sign In
            </Link>
            <Link to="/assessment"
              className="btn-press px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl cursor-pointer"
              style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)' }}>
              Take Free Assessment
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="stagger-children inline-flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            ISO 42001 Readiness Platform for AI Startups
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-4xl">
            Investors ask:<br />
            <span className="text-slate-500">"Are you ISO 42001<br />compliant?"</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-xl leading-relaxed">
            Most AI startups say <em className="text-slate-300 not-italic font-semibold">"Uh…"</em> — COMPLAI gives
            you clarity, a readiness score, and customised policies for{' '}
            <strong className="text-white">$299</strong> instead of $50K in consulting.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/assessment"
              className="btn-press w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-base cursor-pointer"
              style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out), box-shadow 160ms var(--ease-out)', boxShadow: '0 8px 24px rgba(37,99,235,0.28)' }}>
              Take Free Assessment
            </Link>
            <p className="text-slate-500 text-sm">No credit card · 10–15 minutes</p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-sm text-slate-400">
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span><strong className="text-slate-200">1,000+ AI startups</strong> have assessed their ISO 42001 readiness</span>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-5 stagger-children">
          <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-8 hover-lift"
            style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">The Problem</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {['ISO 42001 feels abstract and overwhelming', "You don't know which policies your company needs", 'Investors ask about AI governance at Series A', 'Consultants charge $50K and take 3–6 months'].map(t => (
                <li key={t} className="flex items-start gap-2.5"><IconX />{t}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-8 hover-lift">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">The COMPLAI Solution</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {['Free 10-minute assessment maps your exact gaps', 'Instant readiness score across 6 ISO 42001 controls', 'Customised policies ready for investor due diligence', 'Professional PDF report for board and auditors'].map(t => (
                <li key={t} className="flex items-start gap-2.5"><IconCheck />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">From zero to investor-ready in 4 steps</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {STEPS.map(step => (
            <div key={step.num} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 hover-lift"
              style={{ transition: 'border-color 220ms var(--ease-out), transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(37,99,235,0.30)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <span className="text-3xl font-black text-blue-500/25 font-mono tabular-nums">{step.num}</span>
              <h3 className="text-base font-bold text-white mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16" id="pricing">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Simple, transparent pricing</h2>
          <p className="text-slate-400 mt-3">Start free. Pay only when you need policies.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 items-start stagger-children">
          {PRICING.map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col gap-6 hover-lift ${
                plan.highlight
                  ? 'bg-blue-600/10 border-2 border-blue-500/50'
                  : 'bg-[#111827] border border-white/[0.07]'
              }`}
              style={plan.highlight ? { boxShadow: '0 0 32px rgba(37,99,235,0.12)' } : {}}
            >
              <div>
                {plan.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold mb-3">
                    {plan.badge}
                  </span>
                )}
                <p className="text-sm font-semibold text-slate-300">{plan.name}</p>
                <p className="text-4xl font-black text-white mt-1">{plan.price}</p>
                <p className="text-xs text-slate-500 mt-1">{plan.sub}</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <IconCheck />{f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.to}
                className={`btn-press w-full py-3 rounded-xl text-sm font-bold text-center cursor-pointer ${
                  plan.highlight
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-white/[0.06] hover:bg-white/[0.10] text-slate-200 border border-white/[0.08]'
                }`}
                style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl font-black text-white">Common questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(item => <FAQItem key={item.q} {...item} />)}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-600/15 to-blue-900/10 border border-blue-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Get ISO 42001-ready instead of spending $50K on consulting
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Take the free assessment, see your exact gaps, and download customised policies — all in one afternoon.
          </p>
          <Link to="/assessment"
            className="btn-press inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-base cursor-pointer"
            style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)', boxShadow: '0 8px 24px rgba(37,99,235,0.28)' }}>
            Start Free Assessment
          </Link>
          <p className="text-slate-600 text-sm mt-4">Free · No account required to start</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-slate-600">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">C</span>
          </div>
          <span className="text-slate-500 font-bold tracking-widest text-sm">COMPLAI</span>
        </div>
        <p>© {new Date().getFullYear()} COMPLAI · ISO 42001 Readiness for AI Startups</p>
      </footer>
    </div>
  )
}
