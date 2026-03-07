import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const EMPTY_DPIA = {
    project_name: '', description: '', data_types: '', data_subjects: '',
    legal_basis: 'Consent', processing_purpose: '', recipients: '',
    retention_period: '', safeguards: '', status: 'Draft',
}

export default function DPIA() {
    const { orgProfile } = useAppContext()
    const [dpias, setDpias] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editIdx, setEditIdx] = useState(null)
    const [form, setForm] = useState({ ...EMPTY_DPIA })
    const [generating, setGenerating] = useState(false)
    const [generatedReport, setGeneratedReport] = useState(null)

    function handleSave() {
        if (!form.project_name.trim()) return
        if (editIdx !== null) {
            setDpias(prev => prev.map((d, i) => i === editIdx ? { ...form } : d))
        } else {
            setDpias(prev => [...prev, { ...form, created: new Date().toISOString().slice(0, 10) }])
        }
        setForm({ ...EMPTY_DPIA }); setShowForm(false); setEditIdx(null)
    }

    function handleEdit(idx) { setForm({ ...dpias[idx] }); setEditIdx(idx); setShowForm(true) }
    function handleDelete(idx) { if (confirm('Delete this DPIA?')) setDpias(prev => prev.filter((_, i) => i !== idx)) }

    async function generateDPIA() {
        if (!form.project_name.trim()) { alert('Enter a project name first'); return }
        setGenerating(true)
        setGeneratedReport(null)
        setTimeout(() => {
            const report = {
                title: `DPIA Report — ${form.project_name}`,
                sections: [
                    { heading: 'Processing Description', content: `Assessment for "${form.project_name}". ${form.description || 'General business processing active.'}` },
                    { heading: 'Necessity & Proportionality', content: `Basis: ${form.legal_basis}. Purpose: ${form.processing_purpose || 'Operational efficiency.'}` },
                    { heading: 'Data Types & Subjects', content: `Types: ${form.data_types || 'PII/Internal.'} Subjects: ${form.data_subjects || 'End users.'}` },
                    { heading: 'Mitigation Measures', content: `Safeguards: ${form.safeguards || 'AES-256, TLS 1.3, IAM, MFA.'}` },
                    { heading: 'DPO Advisory', content: '✨ Recommendation: High-risk processing identified. Ensure DPO sign-off in the Approvals tab.' },
                ]
            }
            setGeneratedReport(report)
            setGenerating(false)
        }, 1500)
    }

    const statusColors = { Draft: 'text-amber-600 bg-amber-50 border-amber-200', 'Under Review': 'text-blue-600 bg-blue-50 border-blue-200', Approved: 'text-emerald-600 bg-emerald-50 border-emerald-200', Rejected: 'text-red-600 bg-red-50 border-red-200' }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Data Protection Impact Assessment</h2>
                    <p className="text-sm text-slate-500 mt-1">GDPR Article 35 compliance for high-risk processing activities.</p>
                </div>
                <button onClick={() => { setForm({ ...EMPTY_DPIA }); setEditIdx(null); setShowForm(true); setGeneratedReport(null) }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95">
                    <span className="text-lg">+</span> Create New DPIA
                </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mt-10 -mr-10" />
                <h3 className="relative z-10 text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-4">When is a DPIA required?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {[
                        'Systematic and extensive profiling',
                        'Large-scale special category data',
                        'Public monitoring / facial recognition',
                        'New technologies / AI implementation'
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {dpias.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Project</th>
                                    <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Created</th>
                                    <th className="text-right px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dpias.map((d, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{d.project_name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{d.legal_basis}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${statusColors[d.status] || ''}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-slate-500 font-medium font-mono text-xs">{d.created}</td>
                                        <td className="px-6 py-5 text-right space-x-3">
                                            <button onClick={() => handleEdit(i)} className="text-blue-600 font-bold hover:text-blue-500 transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(i)} className="text-red-500 font-bold hover:text-red-400 transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">🛡️</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Build your first DPIA</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm">
                        Proactive risk assessment ensures compliance before you even ship. Use our AI tools to draft Article 35 reports in seconds.
                    </p>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b border-slate-800">
                            <h2 className="text-lg font-black uppercase tracking-widest">{editIdx !== null ? 'Edit DPIA Context' : 'New Security Assessment'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Project Identity *</label>
                                    <input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="e.g. LLM Training Data Pipeline" />
                                </div>
                                <div className="md:col-span-2 text-slate-900 hover:text-blue-600 transition-colors">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Processing Context</label>
                                    <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="Describe the data flow and system boundary…" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Data Categories</label>
                                    <input value={form.data_types} onChange={e => setForm(f => ({ ...f, data_types: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="Names, PII, Health logs…" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Legal Basis</label>
                                    <select value={form.legal_basis} onChange={e => setForm(f => ({ ...f, legal_basis: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all">
                                        {['Consent', 'Contract', 'Legal obligation', 'Legitimate interests'].map(b => <option key={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
                            <button onClick={generateDPIA} disabled={generating}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                {generating ? 'Processing Engine...' : '✨ Generate AI Report'}
                            </button>
                            <div className="flex gap-3">
                                <button onClick={() => { setShowForm(false); setEditIdx(null) }}
                                    className="flex-1 px-6 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all">Cancel</button>
                                <button onClick={handleSave}
                                    className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all">Save Draft</button>
                            </div>
                        </div>

                        {generatedReport && (
                            <div className="m-8 p-6 bg-blue-50 border border-blue-200 rounded-3xl space-y-4 animate-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-3 pb-4 border-b border-blue-100">
                                    <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm shadow-blue-900/20">AI Review Result</span>
                                    <h3 className="text-base font-black text-slate-900">{generatedReport.title}</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {generatedReport.sections.map((s, i) => (
                                        <div key={i} className={s.heading.includes('Advisory') ? 'sm:col-span-2 bg-white/50 p-4 rounded-2xl border border-blue-200' : ''}>
                                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">{s.heading}</h4>
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{s.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
