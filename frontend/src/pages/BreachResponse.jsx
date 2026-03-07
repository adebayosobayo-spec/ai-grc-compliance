import React, { useState } from 'react'

const SEVERITY = ['Low', 'Medium', 'High', 'Critical']
const STATUS_OPTS = ['Detected', 'Investigating', 'Contained', 'Resolved', 'Reported to Authority']

const EMPTY_BREACH = {
    date: new Date().toISOString().slice(0, 10), description: '', severity: 'Medium',
    data_affected: '', individuals_affected: '', response_actions: '', status: 'Detected',
    reported_to_authority: false, notification_deadline: '', lessons_learned: '',
}

export default function BreachResponse() {
    const [breaches, setBreaches] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editIdx, setEditIdx] = useState(null)
    const [form, setForm] = useState({ ...EMPTY_BREACH })
    const [generating, setGenerating] = useState(false)

    function handleSave() {
        if (!form.description.trim()) return
        if (editIdx !== null) setBreaches(prev => prev.map((b, i) => i === editIdx ? { ...form } : b))
        else setBreaches(prev => [...prev, { ...form }])
        setForm({ ...EMPTY_BREACH }); setShowForm(false); setEditIdx(null)
    }

    function handleEdit(idx) { setForm({ ...breaches[idx] }); setEditIdx(idx); setShowForm(true) }
    function handleDelete(idx) { if (confirm('Delete?')) setBreaches(prev => prev.filter((_, i) => i !== idx)) }

    async function generateBreachTemplates() {
        setGenerating(true)
        setTimeout(() => {
            const templates = [
                { date: '2025-01-15', description: 'Unauthorized DB access via compromised credentials', severity: 'Critical', data_affected: 'Names, emails, hashes', individuals_affected: '~5,000', response_actions: 'Disabled account, reset passwords', status: 'Contained', reported_to_authority: true },
                { date: '2025-02-20', description: 'Stolen laptop with unencrypted client files', severity: 'High', data_affected: 'Contracts, contacts', individuals_affected: '~200', response_actions: 'Remote wipe init', status: 'Resolved', reported_to_authority: true },
            ]
            setBreaches(prev => [...prev, ...templates])
            setGenerating(false)
        }, 1200)
    }

    const sevColors = {
        Low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        Medium: 'text-amber-600 bg-amber-50 border-amber-200',
        High: 'text-orange-600 bg-orange-50 border-orange-200',
        Critical: 'text-red-600 bg-red-50 border-red-200 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Incident & Breach Response
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] uppercase font-black rounded-lg border border-red-200">72H DEADLINE</span>
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium italic">GDPR Articles 33-34 notification protocol.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={generateBreachTemplates} disabled={generating}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50">
                        {generating ? 'Simulating...' : '✨ Create Scenarios'}
                    </button>
                    <button onClick={() => { setForm({ ...EMPTY_BREACH }); setEditIdx(null); setShowForm(true) }}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-900/10 transition-all active:scale-95">
                        🚨 Log Incident
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] -mt-20 -mr-20" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            Emergency Protocol Active
                        </h3>
                        <p className="text-white text-lg font-bold leading-relaxed max-w-3xl">
                            Upon detection of a breach, the DPO must maintain a <span className="text-red-400 font-black">72-hour reporting window</span> to the ICO/Regulator. Silence is non-compliance.
                        </p>
                    </div>
                </div>
            </div>

            {breaches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {breaches.map((b, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${b.severity === 'Critical' ? 'bg-red-500' : 'bg-slate-200'}`} />
                            <div className="flex items-start justify-between mb-4">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${sevColors[b.severity]}`}>
                                    {b.severity}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(i)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(i)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-red-600 transition-colors">
                                {b.description}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs font-bold text-slate-700">{b.status}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Identity Impact</p>
                                    <p className="text-xs font-bold text-slate-700">{b.individuals_affected || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-slate-400">{b.date}</span>
                                {b.reported_to_authority && (
                                    <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-tighter bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        REPORTED TO ICO
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm rotate-3 animate-pulse">🚨</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Zero Incidents Tracked</h3>
                    <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                        No personal data breaches have been logged. Monitor your telemetry and report any unauthorized access immediately here.
                    </p>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b border-slate-800">
                            <div>
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-1">Incident Report</p>
                                <h2 className="text-xl font-black uppercase tracking-widest leading-none">FORENSIC CONTEXT</h2>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all">✕</button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Detection Date</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold focus:border-red-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Severity Index</label>
                                    <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-black focus:border-red-500 outline-none transition-all">
                                        {SEVERITY.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Brief Description *</label>
                                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold focus:border-red-500 outline-none transition-all" placeholder="Unauthorized access detected in..." />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Subject Impact count</label>
                                    <input value={form.individuals_affected} onChange={e => setForm(f => ({ ...f, individuals_affected: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold focus:border-red-500 outline-none transition-all" placeholder="e.g. ~500" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Workflow status</label>
                                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-black focus:border-red-500 outline-none transition-all">
                                        {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Containment Actions</label>
                                <textarea rows={2} value={form.response_actions} onChange={e => setForm(f => ({ ...f, response_actions: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-medium focus:border-red-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }}
                                className="px-8 py-4 border border-slate-300 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white transition-all">Cancel</button>
                            <button onClick={handleSave}
                                className="px-12 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-red-900/10 transition-all uppercase tracking-widest">Commit Log</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
