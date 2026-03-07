import React, { useState } from 'react'

const LEGAL_BASES = ['Consent', 'Contract', 'Legal obligation', 'Vital interests', 'Public task', 'Legitimate interests']
const EMPTY_ACTIVITY = {
    activity: '', purpose: '', data_categories: '', data_subjects: '',
    legal_basis: 'Consent', recipients: '', transfers: 'No', retention: '', safeguards: '',
}

export default function RoPA() {
    const [activities, setActivities] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editIdx, setEditIdx] = useState(null)
    const [form, setForm] = useState({ ...EMPTY_ACTIVITY })
    const [generating, setGenerating] = useState(false)

    function handleSave() {
        if (!form.activity.trim()) return
        if (editIdx !== null) { setActivities(prev => prev.map((a, i) => i === editIdx ? { ...form } : a)) }
        else { setActivities(prev => [...prev, { ...form }]) }
        setForm({ ...EMPTY_ACTIVITY }); setShowForm(false); setEditIdx(null)
    }

    function handleEdit(idx) { setForm({ ...activities[idx] }); setEditIdx(idx); setShowForm(true) }
    function handleDelete(idx) { if (confirm('Delete security activity?')) setActivities(prev => prev.filter((_, i) => i !== idx)) }

    async function generateRoPA() {
        setGenerating(true)
        setTimeout(() => {
            const sample = [
                { activity: 'Employee payroll processing', purpose: 'Legal compliance', data_categories: 'Bank details, Salary', data_subjects: 'Employees', legal_basis: 'Contract', recipients: 'Tax Dept', transfers: 'No', retention: '7y', safeguards: 'AES-256' },
                { activity: 'Customer CRM', purpose: 'Account management', data_categories: 'Contact info', data_subjects: 'Customers', legal_basis: 'Contract', recipients: 'Internal', transfers: 'No', retention: '3y', safeguards: 'MFA' },
            ]
            setActivities(prev => [...prev, ...sample])
            setGenerating(false)
        }, 1200)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Records of Processing Activities</h2>
                    <p className="text-sm text-slate-500 mt-1">GDPR Article 30 registry for all data controller operations.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={generateRoPA} disabled={generating}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50">
                        {generating ? 'Engine Active...' : '✨ Generate RoPA'}
                    </button>
                    <button onClick={() => { setForm({ ...EMPTY_ACTIVITY }); setEditIdx(null); setShowForm(true) }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95">
                        + Add Activity
                    </button>
                </div>
            </div>

            <div className="bg-blue-900/5 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">ℹ️</div>
                <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Article 30 Obligations</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        You must maintain a record of all processing activities including categories of data, data subjects, legal basis, and retention periods. COMPLAI automates the mapping of these fields.
                    </p>
                </div>
            </div>

            {activities.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Activity</th>
                                    <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Legal Basis</th>
                                    <th className="text-left px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Retention</th>
                                    <th className="text-right px-6 py-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {activities.map((a, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-xs">{a.activity}</p>
                                            <p className="text-[10px] text-slate-500 font-medium font-mono mt-0.5">{a.data_categories}</p>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-slate-600 text-xs">{a.legal_basis}</td>
                                        <td className="px-6 py-5 text-slate-500 font-bold font-mono text-[10px]">{a.retention}</td>
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
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">📋</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Initialize your RoPA</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm">
                        Map every data flow across your organization. Start with AI generation or add activities manually to build your Article 30 log.
                    </p>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b border-slate-800">
                            <h2 className="text-lg font-black uppercase tracking-widest">{editIdx !== null ? 'Modify Activity' : 'Internal processing log'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Processing Name *</label>
                                    <input value={form.activity} onChange={e => setForm(f => ({ ...f, activity: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold" placeholder="e.g. Employee Record Retention" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Data Categories</label>
                                    <input value={form.data_categories} onChange={e => setForm(f => ({ ...f, data_categories: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium" placeholder="Bank IDs, Emails, Home address..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Legal Basis</label>
                                    <select value={form.legal_basis} onChange={e => setForm(f => ({ ...f, legal_basis: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-bold">
                                        {['Consent', 'Contract', 'Legal obligation', 'Public task'].map(b => <option key={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Retention</label>
                                    <input value={form.retention} onChange={e => setForm(f => ({ ...f, retention: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-bold" placeholder="e.g. 7 years" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Shielding / Safeguards</label>
                                    <input value={form.safeguards} onChange={e => setForm(f => ({ ...f, safeguards: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium" placeholder="Encryption, IAM..." />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }}
                                className="px-8 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all">Cancel</button>
                            <button onClick={handleSave}
                                className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all">Update Log</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
