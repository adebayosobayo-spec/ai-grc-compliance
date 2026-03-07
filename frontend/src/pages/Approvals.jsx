import React, { useState } from 'react'

const SAMPLE_ITEMS = [
    { id: 'APR-001', type: 'DPIA', title: 'Customer Analytics Platform DPIA', submitted: '2025-01-15', status: 'Pending', aiRecommendation: 'Approve with conditions — recommend additional encryption for analytics data exports.', overrides: [] },
    { id: 'APR-002', type: 'Policy', title: 'Employee Privacy Notice v2', submitted: '2025-01-18', status: 'Pending', aiRecommendation: 'Approve — policy covers all GDPR Article 13 requirements.', overrides: [] },
    { id: 'APR-003', type: 'Breach', title: 'Credential compromise incident response', submitted: '2025-01-20', status: 'Pending', aiRecommendation: 'Report to supervisory authority — incident affects >500 individuals.', overrides: [] },
]

export default function Approvals() {
    const [items, setItems] = useState([])
    const [generating, setGenerating] = useState(false)

    function generateSamples() {
        setGenerating(true)
        setTimeout(() => { setItems(prev => [...prev, ...SAMPLE_ITEMS]); setGenerating(false) }, 800)
    }

    function handleDecision(idx, decision, notes = '') {
        setItems(prev => prev.map((item, i) => {
            if (i !== idx) return item
            const updated = { ...item, status: decision, decisionDate: new Date().toISOString().slice(0, 10), decisionNotes: notes }
            if (decision !== item.aiRecommendation?.split(' — ')[0]) {
                updated.overrides = [...(item.overrides || []), { from: 'AI recommendation', to: decision, date: new Date().toISOString(), reason: notes }]
            }
            return updated
        }))
    }

    const statusColors = {
        Pending: 'text-amber-600 bg-amber-50 border-amber-200',
        Approved: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        'Approved with Conditions': 'text-blue-600 bg-blue-50 border-blue-200',
        Rejected: 'text-red-600 bg-red-50 border-red-200',
        Override: 'text-purple-600 bg-purple-50 border-purple-200'
    }
    const pending = items.filter(i => i.status === 'Pending').length

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">DPO Approval Console</h2>
                    <p className="text-sm text-slate-500 mt-1">Human-in-the-loop verification for AI-generated compliance artifacts.</p>
                </div>
                <button onClick={generateSamples} disabled={generating}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50">
                    {generating ? 'Retrieving Stream...' : '✨ Load Pending Queue'}
                </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mt-10 -mr-10" />
                <h3 className="relative z-10 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Protocol Oversight
                </h3>
                <p className="relative z-10 text-slate-400 text-xs font-medium leading-relaxed max-w-2xl font-mono uppercase tracking-tight">
                    GDPR Article 22 human review mandate is active. AI recommendations are advisory indices. Human DPO verification is the final gate for all external reporting.
                </p>
            </div>

            {pending > 0 && (
                <div className="bg-blue-600 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-blue-600/20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">⏳</div>
                        <div>
                            <p className="text-white font-black text-sm uppercase tracking-widest">{pending} ARTIFACTS QUEUED</p>
                            <p className="text-blue-100 text-[10px] font-bold">Awaiting DPO forensic review and digital signature</p>
                        </div>
                    </div>
                </div>
            )}

            {items.length > 0 ? (
                <div className="space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors" />

                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase">{item.id}</span>
                                    <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 uppercase tracking-widest">{item.type}</span>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${statusColors[item.status] || ''}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors tracking-tight">{item.title}</h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-inner">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI ADVISORY REPORT</span>
                                        </div>
                                        <p className="text-slate-300 text-xs font-bold leading-relaxed">{item.aiRecommendation}</p>
                                    </div>

                                    {item.status === 'Pending' ? (
                                        <div className="flex flex-col justify-center gap-3">
                                            <div className="grid grid-cols-3 gap-2">
                                                <button onClick={() => handleDecision(i, 'Approved')}
                                                    className="px-4 py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                                    Approve
                                                </button>
                                                <button onClick={() => handleDecision(i, 'Approved with Conditions', 'Forensic review complete')}
                                                    className="px-4 py-3 bg-white border-2 border-slate-900 hover:border-blue-600 hover:text-blue-600 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                                                    Conditional
                                                </button>
                                                <button onClick={() => handleDecision(i, 'Rejected', 'Insufficient data')}
                                                    className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-100 active:scale-95">
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">👤</div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">DPO DECISION LOGGED</p>
                                                <p className="text-xs font-bold text-slate-700">{item.decisionDate} — {item.decisionNotes || 'Human Verified'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {item.overrides?.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Override History</span>
                                        </div>
                                        <div className="space-y-2">
                                            {item.overrides.map((o, j) => (
                                                <div key={j} className="flex items-center gap-2 text-[10px] font-bold text-purple-500 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                                                    <span>⚡</span>
                                                    <span>Human Override: "{o.from}" ➔ "{o.to}" on {o.date.slice(0, 10)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center">
                    <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-10 text-5xl shadow-sm rotate-6">🛡️</div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Queue Clean: Security Matrix Secure</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-base font-medium">
                        All AI recommendations have been audited and signed by the DPO. No compliance artifacts are currently awaiting manual verification.
                    </p>
                </div>
            )}
        </div>
    )
}
