import React, { useState } from 'react'

const TIERS = [
    {
        name: 'Startup',
        price: 'From $299/mo',
        description: 'AI-powered compliance tools only. Perfect for startups setting up their first privacy programme.',
        features: ['AI-generated DPIAs & policies', 'RoPA management', 'Breach response workflows', 'Consent & DSR tracking', 'Audit log', 'Email support'],
        highlight: false,
        cta: 'Get Started',
    },
    {
        name: 'SME',
        price: 'From $799/mo',
        description: 'Everything in Startup + access to a shared external DPO for guidance and sign-off.',
        features: ['Everything in Startup', 'Shared external DPO access', 'Monthly DPO review sessions', 'Regulatory filing support', 'Priority support', 'Quarterly compliance report'],
        highlight: true,
        cta: 'Most Popular',
    },
    {
        name: 'Enterprise',
        price: 'Custom pricing',
        description: 'Dedicated DPO assigned to your organisation with custom workflows and on-demand availability.',
        features: ['Everything in SME', 'Dedicated named DPO', 'Custom compliance workflows', 'On-demand DPO availability', 'Board-ready reporting', 'Regulatory liaison & representation', 'SLA-backed response times'],
        highlight: false,
        cta: 'Contact Sales',
    },
]

export default function HireDPO() {
    const [showForm, setShowForm] = useState(false)
    const [selectedTier, setSelectedTier] = useState('')
    const [form, setForm] = useState({ name: '', email: '', company: '', employees: '', industry: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        if (!form.name.trim() || !form.email.trim()) return
        setSubmitted(true)
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-3xl">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-4">Regulatory Liaison Service</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                    GDPR Article 37 mandates the appointment of a Data Protection Officer for specific processing categories.
                    COMPLAI provides <span className="text-blue-600 font-bold uppercase tracking-widest text-xs px-2 py-1 bg-blue-50 rounded-lg">Certified Protocol Officers</span> on demand.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] -mt-10 -mr-10 transition-all group-hover:bg-blue-500/20" />
                    <h3 className="relative z-10 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        Requirement Matrix
                    </h3>
                    <ul className="relative z-10 space-y-4">
                        {[
                            'Public authorities or bodies (except courts)',
                            'Systematic monitoring of individuals at scale',
                            'Processing special categories of sensitive data',
                            'Regional statutes (e.g. Germany 20+ rule)'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300 uppercase tracking-tight">
                                <span className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-[10px] text-blue-400 border border-white/10">{i + 1}</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-600 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <h3 className="relative z-10 text-[10px] font-black text-white/80 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        ⚖️ Independence Protocol
                    </h3>
                    <p className="relative z-10 text-amber-50 text-base font-black leading-tight uppercase tracking-tight">
                        Article 38 Guarantee: All officers operate with absolute immunity and reporting independence. No management instruction permitted.
                    </p>
                    <div className="mt-8 relative z-10 flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                        <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">External Integrity System Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                {TIERS.map(tier => (
                    <div key={tier.name} className={`relative bg-white rounded-[2.5rem] border-2 p-8 transition-all hover:scale-[1.02] flex flex-col ${tier.highlight ? 'border-slate-900 shadow-2xl' : 'border-slate-100 hover:border-slate-200'}`}>
                        {tier.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                                High Volume Selection
                            </div>
                        )}
                        <div className="mb-8">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{tier.name}</h3>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{tier.price}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-500 mb-8 leading-relaxed italic">"{tier.description}"</p>
                        <ul className="space-y-4 mb-10 flex-1">
                            {tier.features.map(f => (
                                <li key={f} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight leading-tight">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => { setSelectedTier(tier.name); setShowForm(true); setSubmitted(false) }}
                            className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-lg ${tier.highlight ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-slate-200/50'
                                }`}>
                            {tier.cta}
                        </button>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-xl p-10 animate-in zoom-in duration-300">
                        {submitted ? (
                            <div className="text-center py-10">
                                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl shadow-sm rotate-6">✨</div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Transmission Logged</h2>
                                <p className="text-slate-500 font-bold mb-10 text-sm">Regulatory match-making protocol initialized for the <span className="text-slate-900 font-black tracking-widest uppercase">{selectedTier}</span> stream. Standby for officer assignment.</p>
                                <button onClick={() => setShowForm(false)} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl shadow-slate-900/20">Finalize Terminal</button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10">
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Protocol Inquiry</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Tier Identification: {selectedTier}</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Human Name</label>
                                            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-slate-900 focus:bg-white rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all" placeholder="Enter name..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Digital Core (Email)</label>
                                            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-slate-900 focus:bg-white rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all" placeholder="Enter email..." />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Entity Name</label>
                                            <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-slate-900 focus:bg-white rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sector Identification</label>
                                            <input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-slate-900 focus:bg-white rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all" placeholder="Fintech, SaaS, etc." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Compliance Brief</label>
                                        <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-slate-900 focus:bg-white rounded-2xl px-5 py-4 text-xs font-bold outline-none transition-all resize-none" placeholder="Elaborate on compliance trajectory..." />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                                        <button type="submit" className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl shadow-slate-900/20">Authorize Transmission</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
