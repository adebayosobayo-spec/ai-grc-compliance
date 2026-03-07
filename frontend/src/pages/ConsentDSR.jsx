import React, { useState } from 'react'

const DSR_TYPES = ['Access (SAR)', 'Rectification', 'Erasure (Right to be Forgotten)', 'Restriction', 'Portability', 'Objection', 'Withdraw Consent']
const DSR_STATUS = ['Received', 'Identity Verified', 'In Progress', 'Completed', 'Rejected']

const EMPTY_DSR = { requester: '', email: '', type: 'Access (SAR)', date_received: new Date().toISOString().slice(0, 10), deadline: '', status: 'Received', notes: '' }
const EMPTY_CONSENT = { purpose: '', legal_basis: 'Consent', collection_method: '', opt_in_date: '', opt_out_date: '', status: 'Active' }

export default function ConsentDSR() {
    const [tab, setTab] = useState('dsr')
    const [dsrs, setDsrs] = useState([])
    const [consents, setConsents] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({})
    const [editIdx, setEditIdx] = useState(null)
    const [generating, setGenerating] = useState(false)

    function handleSaveDSR() {
        if (!form.requester?.trim()) return
        if (editIdx !== null) setDsrs(prev => prev.map((d, i) => i === editIdx ? { ...form } : d))
        else setDsrs(prev => [...prev, { ...form }])
        setForm({}); setShowForm(false); setEditIdx(null)
    }

    function handleSaveConsent() {
        if (!form.purpose?.trim()) return
        if (editIdx !== null) setConsents(prev => prev.map((c, i) => i === editIdx ? { ...form } : c))
        else setConsents(prev => [...prev, { ...form }])
        setForm({}); setShowForm(false); setEditIdx(null)
    }

    function generateSamples() {
        setGenerating(true)
        setTimeout(() => {
            if (tab === 'dsr') {
                setDsrs(prev => [...prev,
                { requester: 'Jane Smith', email: 'jane@example.com', type: 'Access (SAR)', date_received: '2025-01-10', deadline: '2025-02-10', status: 'Completed', notes: 'Full data export provided' },
                { requester: 'John Doe', email: 'john@example.com', type: 'Erasure', date_received: '2025-02-15', deadline: '2025-03-15', status: 'In Progress', notes: 'Checking dependencies' },
                ])
            } else {
                setConsents(prev => [...prev,
                { purpose: 'Marketing emails', legal_basis: 'Consent', collection_method: 'Signup form', opt_in_date: '2024-06-15', opt_out_date: '', status: 'Active' },
                { purpose: 'Analytics cookies', legal_basis: 'Consent', collection_method: 'Cookie banner', opt_in_date: '2024-07-01', opt_out_date: '', status: 'Active' },
                ])
            }
            setGenerating(false)
        }, 1000)
    }

    const statusColors = { Received: 'text-amber-600 bg-amber-50 border-amber-200', 'Identity Verified': 'text-blue-600 bg-blue-50 border-blue-200', 'In Progress': 'text-purple-600 bg-purple-50 border-purple-200', Completed: 'text-emerald-600 bg-emerald-50 border-emerald-200', Rejected: 'text-red-600 bg-red-50 border-red-200', Active: 'text-emerald-600 bg-emerald-50 border-emerald-200', Withdrawn: 'text-red-600 bg-red-50 border-red-200' }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Consent & Data Subject Requests</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage GDPR Article 15–22 rights and user consent lifecycle.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={generateSamples} disabled={generating}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50">
                        {generating ? 'Processing Engine...' : '✨ Generate Samples'}
                    </button>
                    <button onClick={() => { setForm(tab === 'dsr' ? { ...EMPTY_DSR } : { ...EMPTY_CONSENT }); setEditIdx(null); setShowForm(true) }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95">
                        + {tab === 'dsr' ? 'Log New DSR' : 'Add Consent'}
                    </button>
                </div>
            </div>

            <div className="flex gap-1 bg-slate-900/5 p-1 rounded-2xl w-fit border border-slate-200/50">
                {[
                    { key: 'dsr', label: 'DSR Requests', icon: '👤' },
                    { key: 'consent', label: 'Consent Registry', icon: '📝' }
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-6 py-2.5 text-xs font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${tab === t.key ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mt-10 -mr-10" />
                <h3 className="relative z-10 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    Regulatory Intelligence
                </h3>
                <p className="relative z-10 text-slate-400 text-xs font-medium leading-relaxed max-w-2xl">
                    {tab === 'dsr'
                        ? 'Standard response window is 30 days. For complex requests, a 60-day extension is permitted under GDPR if invoked within the initial period.'
                        : 'Consent must be granular, informed, and as easy to withdraw as it was to grant. Automated auditing of signup funnels is active.'}
                </p>
            </div>

            {tab === 'dsr' ? (
                dsrs.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Requester</th>
                                        <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Type</th>
                                        <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Status</th>
                                        <th className="text-right px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dsrs.map((d, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-xs">{d.requester}</p>
                                                <p className="text-[10px] text-slate-500 font-medium font-mono mt-0.5">{d.email}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-600 text-xs">{d.type}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-tighter">Received: {d.date_received}</p>
                                            </td>
                                            <td className="px-6 py-5 text-slate-500">
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${statusColors[d.status] || ''}`}>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-3">
                                                <button onClick={() => { setForm({ ...d }); setEditIdx(i); setShowForm(true) }} className="text-blue-600 font-bold hover:text-blue-500 transition-colors">Edit</button>
                                                <button onClick={() => { if (confirm('Delete?')) setDsrs(prev => prev.filter((_, j) => j !== i)) }} className="text-red-500 font-bold hover:text-red-400 transition-colors">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">👤</div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No active DSRs</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm">
                            Any subject access, erasure, or rectification requests will appear here for management and deadline tracking.
                        </p>
                    </div>
                )
            ) : (
                consents.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Purpose</th>
                                        <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Collection</th>
                                        <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Status</th>
                                        <th className="text-right px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {consents.map((c, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-xs">{c.purpose}</p>
                                                <p className="text-[10px] text-slate-500 font-medium font-mono mt-0.5">{c.legal_basis}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-600 text-xs">{c.collection_method}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-tighter">Opt-in: {c.opt_in_date}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${statusColors[c.status] || ''}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-3">
                                                <button onClick={() => { setForm({ ...c }); setEditIdx(i); setShowForm(true) }} className="text-blue-600 font-bold hover:text-blue-500 transition-colors">Edit</button>
                                                <button onClick={() => { if (confirm('Delete?')) setConsents(prev => prev.filter((_, j) => j !== i)) }} className="text-red-500 font-bold hover:text-red-400 transition-colors">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">📝</div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Initialize Consent Records</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm">
                            Capture and demonstrate granular consent for all processing activities to satisfy Article 7 obligations.
                        </p>
                    </div>
                )
            )}

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b border-slate-800">
                            <h2 className="text-lg font-black uppercase tracking-widest">{tab === 'dsr' ? 'Subject Request Context' : 'Consent Evidence'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
                            {tab === 'dsr' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Requester *</label>
                                        <input value={form.requester || ''} onChange={e => setForm(f => ({ ...f, requester: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email Contact</label>
                                        <input value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Request Category</label>
                                        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-bold">
                                            {DSR_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Status Track</label>
                                        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-bold">
                                            {DSR_STATUS.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Processing Purpose *</label>
                                        <input value={form.purpose || ''} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Collection Interface</label>
                                        <input value={form.collection_method || ''} onChange={e => setForm(f => ({ ...f, collection_method: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Evidence Date</label>
                                        <input type="date" value={form.opt_in_date || ''} onChange={e => setForm(f => ({ ...f, opt_in_date: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-bold" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }}
                                className="px-8 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all">Cancel</button>
                            <button onClick={tab === 'dsr' ? handleSaveDSR : handleSaveConsent}
                                className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all">Submit Evidence</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
