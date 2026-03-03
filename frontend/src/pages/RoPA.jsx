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
    function handleDelete(idx) { if (confirm('Delete?')) setActivities(prev => prev.filter((_, i) => i !== idx)) }

    async function generateRoPA() {
        setGenerating(true)
        setTimeout(() => {
            const sample = [
                { activity: 'Employee payroll processing', purpose: 'Salary payment and tax compliance', data_categories: 'Names, bank details, tax IDs, salary', data_subjects: 'Employees', legal_basis: 'Contract', recipients: 'Payroll provider, tax authority', transfers: 'No', retention: '7 years', safeguards: 'Encryption, access controls' },
                { activity: 'Customer account management', purpose: 'Service delivery and support', data_categories: 'Names, emails, phone numbers, usage data', data_subjects: 'Customers', legal_basis: 'Contract', recipients: 'CRM provider, support team', transfers: 'No', retention: '3 years post-contract', safeguards: 'TLS, role-based access' },
                { activity: 'Marketing email campaigns', purpose: 'Direct marketing and engagement', data_categories: 'Names, emails, preferences', data_subjects: 'Subscribers', legal_basis: 'Consent', recipients: 'Email service provider', transfers: 'No', retention: 'Until consent withdrawn', safeguards: 'Opt-out mechanism, encryption' },
                { activity: 'Website analytics', purpose: 'Usage analysis and improvement', data_categories: 'IP addresses, browser data, page views', data_subjects: 'Website visitors', legal_basis: 'Legitimate interests', recipients: 'Analytics provider', transfers: 'Yes (US — SCCs)', retention: '26 months', safeguards: 'Anonymisation, SCCs' },
                { activity: 'Recruitment', purpose: 'Candidate assessment and hiring', data_categories: 'CVs, contact details, interview notes', data_subjects: 'Job applicants', legal_basis: 'Legitimate interests', recipients: 'HR team, hiring managers', transfers: 'No', retention: '6 months post-decision', safeguards: 'Secure storage, limited access' },
            ]
            setActivities(prev => [...prev, ...sample])
            setGenerating(false)
        }, 1200)
    }

    function exportCSV() {
        const cols = ['Activity', 'Purpose', 'Data Categories', 'Data Subjects', 'Legal Basis', 'Recipients', 'International Transfers', 'Retention', 'Safeguards']
        const rows = activities.map(a => [a.activity, a.purpose, a.data_categories, a.data_subjects, a.legal_basis, a.recipients, a.transfers, a.retention, a.safeguards])
        const csv = [cols, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `RoPA_${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">RoPA — Records of Processing Activities</h1>
                    <p className="text-sm text-slate-500 mt-1">GDPR Article 30 requires controllers to maintain records of all processing activities.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportCSV} disabled={!activities.length} className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">Export CSV</button>
                    <button onClick={generateRoPA} disabled={generating} className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                        {generating ? 'Generating…' : '✨ Generate RoPA'}
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800">What goes in a RoPA?</h3>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Every processing activity (e.g. payroll, marketing, analytics)</li>
                    <li>Categories of personal data and data subjects</li>
                    <li>Legal basis for each processing activity</li>
                    <li>Recipients and international transfers</li>
                    <li>Retention periods and security safeguards</li>
                </ul>
            </div>

            <button onClick={() => { setForm({ ...EMPTY_ACTIVITY }); setEditIdx(null); setShowForm(true) }}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
                + Add Processing Activity
            </button>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{editIdx !== null ? 'Edit' : 'Add'} Processing Activity</h2>
                        <div className="space-y-3">
                            {[
                                { key: 'activity', label: 'Activity Name *', ph: 'e.g. Employee payroll' },
                                { key: 'purpose', label: 'Purpose', ph: 'Why is this data processed?' },
                                { key: 'data_categories', label: 'Data Categories', ph: 'e.g. Names, emails, bank details' },
                                { key: 'data_subjects', label: 'Data Subjects', ph: 'e.g. Employees, customers' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                                    <input value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder={f.ph} />
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Legal Basis</label>
                                    <select value={form.legal_basis} onChange={e => setForm(f => ({ ...f, legal_basis: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {LEGAL_BASES.map(b => <option key={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Retention Period</label>
                                    <input value={form.retention} onChange={e => setForm(f => ({ ...f, retention: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 3 years" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
                                <input value={form.recipients} onChange={e => setForm(f => ({ ...f, recipients: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Who receives this data?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Safeguards</label>
                                <input value={form.safeguards} onChange={e => setForm(f => ({ ...f, safeguards: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Security measures" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {activities.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Activity</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Legal Basis</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Data Subjects</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Retention</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {activities.map((a, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800">{a.activity}</td>
                                        <td className="px-4 py-3 text-slate-600">{a.legal_basis}</td>
                                        <td className="px-4 py-3 text-slate-600">{a.data_subjects}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{a.retention}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleEdit(i)} className="text-primary-600 text-xs font-medium mr-2">Edit</button>
                                            <button onClick={() => handleDelete(i)} className="text-red-500 text-xs font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="text-lg font-semibold text-slate-800">No processing activities recorded</h3>
                    <p className="text-sm text-slate-500 mt-1">Click "✨ Generate RoPA" to auto-create sample activities, then customise them.</p>
                </div>
            )}
        </div>
    )
}
