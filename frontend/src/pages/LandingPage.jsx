import React from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { title: 'Gap Analysis', desc: 'AI maps your posture against any framework in seconds.', icon: '▲' },
  { title: 'Policy Generator', desc: 'Audit-ready policies tailored to your organisation.', icon: '◆' },
  { title: 'Risk Register', desc: 'Track, score, and remediate risks in one place.', icon: '●' },
  { title: 'DPO Assist', desc: 'AI-powered Data Protection Officer support.', icon: '■' },
]

const FRAMEWORKS = ['ISO 27001', 'ISO 42001', 'GDPR', 'NDPR', 'UK GDPR', 'POPIA', 'LGPD', 'CCPA', 'PDPA']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100">
      {/* Nav */}
      <nav className="border-b border-white/[0.05] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black bg-gradient-to-br from-primary-500 to-primary-700">C</span>
          <span className="text-lg font-black tracking-widest text-white">COMPLAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/chat" className="text-sm text-slate-400 hover:text-white transition-colors">AI Advisor</Link>
          <Link to="/login" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
          AI-Powered GRC Platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.08] mb-6 tracking-tight">
          Compliance at the<br />speed of AI.
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          From gap analysis to audit-ready policies — automate your compliance programme across ISO 27001, GDPR, NDPR, and 6 more frameworks.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/login" className="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors cursor-pointer">
            Get Started Free
          </Link>
          <Link to="/chat" className="px-8 py-3.5 bg-white/[0.06] hover:bg-white/[0.10] text-slate-200 font-bold rounded-xl border border-white/[0.08] transition-colors cursor-pointer">
            Ask AI Advisor
          </Link>
        </div>
      </section>

      {/* Frameworks */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-center text-xs font-bold text-slate-600 uppercase tracking-widest mb-6">Supported Frameworks</p>
        <div className="flex flex-wrap justify-center gap-2">
          {FRAMEWORKS.map(fw => (
            <span key={fw} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-sm text-slate-400 font-medium">
              {fw}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 hover:border-primary-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-black text-lg mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-[#111827] border border-white/[0.07] rounded-3xl p-12">
          <h2 className="text-3xl font-black text-white mb-4">Ready to automate compliance?</h2>
          <p className="text-slate-400 mb-8">Join teams using Complai to stay ahead of audits.</p>
          <Link to="/login" className="inline-flex px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors cursor-pointer">
            Start for Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Complai · AI-powered GRC platform
      </footer>
    </div>
  )
}
