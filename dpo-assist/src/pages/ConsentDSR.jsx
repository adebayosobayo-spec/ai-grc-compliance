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
                { requester: 'John Doe', email: 'john@example.com', type: 'Erasure (Right to be Forgotten)', date_received: '2025-02-15', deadline: '2025-03-15', status: 'In Progress', notes: 'Checking data dependencies' },
                { requester: 'Alice Wong', email: 'alice@example.com', type: 'Portability', date_received: '2025-03-01', deadline: '2025-04-01', status: 'Received', notes: '' },
                ])
            } else {
                setConsents(prev => [...prev,
                { purpose: 'Marketing emails', legal_basis: 'Consent', collection_method: 'Website signup form', opt_in_date: '2024-06-15', opt_out_date: '', status: 'Active' },
                { purpose: 'Analytics cookies', legal_basis: 'Consent', collection_method: 'Cookie banner', opt_in_date: '2024-07-01', opt_out_date: '', status: 'Active' },
                { purpose: 'Third-party data sharing', legal_basis: 'Consent', collection_method: 'In-app consent', opt_in_date: '2024-08-20', opt_out_date: '2025-01-15', status: 'Withdrawn' },
                ])
            }
            setGenerating(false)
        }, 1000)
    }

    const statusColors = { Received: 'bg-yellow-50 text-yellow-700', 'Identity Verified': 'bg-blue-50 text-blue-700', 'In Progress': 'bg-purple-50 text-purple-700', Completed: 'bg-green-50 text-green-700', Rejected: 'bg-red-50 text-red-700', Active: 'bg-green-50 text-green-700', Withdrawn: 'bg-red-50 text-red-700' }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Consent & Data Subject Requests</h1>
                    <p className="text-sm text-slate-500 mt-1">GDPR Articles 15–22 grant data subjects rights to access, rectify, erase, and port their data. Track all requests here.</p>
                </div>
                <button onClick={generateSamples} disabled={generating} className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg disabled:opacity-50">
                    {generating ? 'Generating…' : '✨ Generate Samples'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                {[{ key: 'dsr', label: 'Data Subject Requests' }, { key: 'consent', label: 'Consent Records' }].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800">⏰ Response Deadlines</h3>
                <p className="text-xs text-blue-700 mt-1">
                    {tab === 'dsr' ? 'You must respond to data subject requests within 1 month. Extensions of up to 2 additional months may be granted for complex requests, but the requester must be informed within the first month.' : 'Consent must be freely given, specific, informed, and unambiguous. You must be able to demonstrate consent was given and provide an easy way to withdraw it.'}
                </p>
            </div>

            <button onClick={() => { setForm(tab === 'dsr' ? { ...EMPTY_DSR } : { ...EMPTY_CONSENT }); setEditIdx(null); setShowForm(true) }}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
                + {tab === 'dsr' ? 'Log New DSR' : 'Add Consent Record'}
            </button>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{tab === 'dsr' ? 'Data Subject Request' : 'Consent Record'}</h2>
                        {tab === 'dsr' ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Requester *</label><input value={form.requester || ''} onChange={e => setForm(f => ({ ...f, requester: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Email</label><input value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                </div>
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Request Type</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">{DSR_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Date Received</label><input type="date" value={form.date_received} onChange={e => setForm(f => ({ ...f, date_received: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Status</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">{DSR_STATUS.map(s => <option key={s}>{s}</option>)}</select></div>
                                </div>
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Notes</label><textarea rows={2} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Purpose *</label><input value={form.purpose || ''} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Marketing emails" /></div>
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Collection Method</label><input value={form.collection_method || ''} onChange={e => setForm(f => ({ ...f, collection_method: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Website form" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Opt-in Date</label><input type="date" value={form.opt_in_date || ''} onChange={e => setForm(f => ({ ...f, opt_in_date: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Status</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"><option>Active</option><option>Withdrawn</option></select></div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg">Cancel</button>
                            <button onClick={tab === 'dsr' ? handleSaveDSR : handleSaveConsent} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            {tab === 'dsr' ? (
                dsrs.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
                        <table className="w-full text-sm"><thead className="bg-slate-50 border-b"><tr>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Requester</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                        </tr></thead><tbody className="divide-y divide-slate-100">
                                {dsrs.map((d, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800">{d.requester}</td>
                                        <td className="px-4 py-3 text-slate-600">{d.type}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{d.date_received}</td>
                                        <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[d.status] || ''}`}>{d.status}</span></td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => { setForm({ ...d }); setEditIdx(i); setShowForm(true) }} className="text-primary-600 text-xs font-medium mr-2">Edit</button>
                                            <button onClick={() => { if (confirm('Delete?')) setDsrs(prev => prev.filter((_, j) => j !== i)) }} className="text-red-500 text-xs font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody></table>
                    </div>
                ) : (<div className="bg-white border border-slate-200 rounded-lg p-12 text-center"><div className="text-4xl mb-3">👤</div><h3 className="text-lg font-semibold text-slate-800">No DSRs logged</h3><p className="text-sm text-slate-500 mt-1">Click "✨ Generate Samples" to see example requests.</p></div>)
            ) : (
                consents.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
                        <table className="w-full text-sm"><thead className="bg-slate-50 border-b"><tr>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Purpose</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Method</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Opt-in</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                        </tr></thead><tbody className="divide-y divide-slate-100">
                                {consents.map((c, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800">{c.purpose}</td>
                                        <td className="px-4 py-3 text-slate-600">{c.collection_method}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{c.opt_in_date}</td>
                                        <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[c.status] || ''}`}>{c.status}</span></td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => { setForm({ ...c }); setEditIdx(i); setShowForm(true) }} className="text-primary-600 text-xs font-medium mr-2">Edit</button>
                                            <button onClick={() => { if (confirm('Delete?')) setConsents(prev => prev.filter((_, j) => j !== i)) }} className="text-red-500 text-xs font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody></table>
                    </div>
                ) : (<div className="bg-white border border-slate-200 rounded-lg p-12 text-center"><div className="text-4xl mb-3">📝</div><h3 className="text-lg font-semibold text-slate-800">No consent records</h3><p className="text-sm text-slate-500 mt-1">Click "✨ Generate Samples" to see example consent records.</p></div>)
            )}
        </div>
    )
}
