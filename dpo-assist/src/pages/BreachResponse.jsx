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
                { date: '2025-01-15', description: 'Unauthorized access to customer database via compromised admin credentials', severity: 'Critical', data_affected: 'Customer names, emails, hashed passwords', individuals_affected: '~5,000', response_actions: 'Disabled compromised account, forced password reset, engaged forensic team', status: 'Contained', reported_to_authority: true, notification_deadline: '2025-01-17', lessons_learned: 'Implement MFA for all admin accounts' },
                { date: '2025-02-20', description: 'Employee laptop stolen containing unencrypted client files', severity: 'High', data_affected: 'Client contracts, contact details', individuals_affected: '~200', response_actions: 'Remote wiped laptop, notified affected clients, reported to ICO', status: 'Resolved', reported_to_authority: true, notification_deadline: '2025-02-22', lessons_learned: 'Enforce full disk encryption policy' },
                { date: '2025-03-10', description: 'Phishing email led to temporary email account compromise', severity: 'Medium', data_affected: 'Email correspondence', individuals_affected: '~50', response_actions: 'Reset credentials, deployed additional phishing training', status: 'Resolved', reported_to_authority: false, notification_deadline: '', lessons_learned: 'Quarterly phishing simulations, enhanced email filtering' },
            ]
            setBreaches(prev => [...prev, ...templates])
            setGenerating(false)
        }, 1200)
    }

    const sevColors = { Low: 'bg-green-50 text-green-700', Medium: 'bg-yellow-50 text-yellow-700', High: 'bg-orange-50 text-orange-700', Critical: 'bg-red-50 text-red-700' }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Breach Response</h1>
                    <p className="text-sm text-slate-500 mt-1">GDPR Articles 33-34 require breach notification to the supervisory authority within 72 hours and to affected individuals without undue delay.</p>
                </div>
                <button onClick={generateBreachTemplates} disabled={generating} className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                    {generating ? 'Generating…' : '✨ Generate Templates'}
                </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-800">⏰ 72-Hour Rule</h3>
                <p className="text-xs text-red-700 mt-1">Under GDPR, personal data breaches must be reported to your supervisory authority <strong>within 72 hours</strong> of becoming aware. If notification to individuals is required, it must be made <strong>without undue delay</strong>. Document everything here for your DPO to review.</p>
            </div>

            <button onClick={() => { setForm({ ...EMPTY_BREACH }); setEditIdx(null); setShowForm(true) }}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600 transition-colors">
                🚨 Report New Breach
            </button>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{editIdx !== null ? 'Edit' : 'Report'} Breach</h2>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Severity</label>
                                    <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {SEVERITY.map(s => <option key={s}>{s}</option>)}</select></div>
                            </div>
                            <div><label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="What happened?" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Data Affected</label>
                                    <input value={form.data_affected} onChange={e => setForm(f => ({ ...f, data_affected: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                <div><label className="block text-xs font-medium text-slate-700 mb-1">Individuals Affected</label>
                                    <input value={form.individuals_affected} onChange={e => setForm(f => ({ ...f, individuals_affected: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                            </div>
                            <div><label className="block text-xs font-medium text-slate-700 mb-1">Response Actions</label>
                                <textarea rows={2} value={form.response_actions} onChange={e => setForm(f => ({ ...f, response_actions: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                            <div><label className="block text-xs font-medium text-slate-700 mb-1">Lessons Learned</label>
                                <textarea rows={2} value={form.lessons_learned} onChange={e => setForm(f => ({ ...f, lessons_learned: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                            <div><label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                    {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}</select></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {breaches.length > 0 ? (
                <div className="space-y-3">
                    {breaches.map((b, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${sevColors[b.severity]}`}>{b.severity}</span>
                                    <h3 className="font-medium text-slate-800">{b.description}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(i)} className="text-primary-600 text-xs font-medium">Edit</button>
                                    <button onClick={() => handleDelete(i)} className="text-red-500 text-xs font-medium">Delete</button>
                                </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                                <span>📅 {b.date}</span>
                                <span>📊 {b.individuals_affected || '—'} individuals</span>
                                <span>📌 {b.status}</span>
                                {b.reported_to_authority && <span className="text-green-600 font-medium">✓ Reported to Authority</span>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h3 className="text-lg font-semibold text-slate-800">No breaches recorded</h3>
                    <p className="text-sm text-slate-500 mt-1">Use "✨ Generate Templates" to create example breach response workflows, or report a new breach.</p>
                </div>
            )}
        </div>
    )
}
