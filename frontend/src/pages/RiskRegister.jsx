import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const LIKELIHOOD_LABELS = ['Very Low', 'Low', 'Medium', 'High', 'Very High']
const IMPACT_LABELS = ['Negligible', 'Minor', 'Moderate', 'Major', 'Severe']
const TREATMENTS = ['Mitigate', 'Accept', 'Transfer', 'Avoid']
const STATUS_OPTIONS = ['Open', 'In Treatment', 'Closed', 'Accepted']

const EMPTY_RISK = {
    description: '',
    category: 'Information Security',
    likelihood: 3,
    impact: 3,
    owner: '',
    treatment: 'Mitigate',
    treatment_plan: '',
    status: 'Open',
    due_date: '',
}

function riskScore(l, i) { return l * i }
function riskColor(score) {
    if (score >= 16) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Critical' }
    if (score >= 9) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'High' }
    if (score >= 4) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Medium' }
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Low' }
}

export default function RiskRegister() {
    const { orgProfile } = useAppContext()
    const [risks, setRisks] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editIdx, setEditIdx] = useState(null)
    const [form, setForm] = useState({ ...EMPTY_RISK })
    const [generating, setGenerating] = useState(false)

    const orgName = orgProfile?.organization_name || 'Your Organisation'
    const framework = orgProfile?.compliance_framework || 'ISO_27001'

    function handleSave() {
        if (!form.description.trim()) return
        if (editIdx !== null) {
            setRisks(prev => prev.map((r, i) => i === editIdx ? { ...form } : r))
        } else {
            setRisks(prev => [...prev, { ...form }])
        }
        setForm({ ...EMPTY_RISK })
        setShowForm(false)
        setEditIdx(null)
    }

    function handleEdit(idx) {
        setForm({ ...risks[idx] })
        setEditIdx(idx)
        setShowForm(true)
    }

    function handleDelete(idx) {
        if (confirm('Delete this risk?')) {
            setRisks(prev => prev.filter((_, i) => i !== idx))
        }
    }

    async function generateFromGaps() {
        if (!orgProfile) { alert('Please complete onboarding first.'); return }
        setGenerating(true)
        try {
            const gapRes = await fetch('/api/v1/compliance/gap-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    framework,
                    organization_name: orgName,
                    industry: orgProfile.industry || 'Technology',
                    current_practices: orgProfile.current_practices || 'Basic security practices in place.',
                }),
            })
            if (!gapRes.ok) throw new Error('Gap analysis failed')
            const gapData = await gapRes.json()

            const generated = (gapData.gaps || []).map((g, i) => ({
                description: `${g.control_id} — ${g.control_name}: ${g.gap_description}`,
                category: 'Information Security',
                likelihood: g.risk_level === 'critical' ? 5 : g.risk_level === 'high' ? 4 : g.risk_level === 'medium' ? 3 : 2,
                impact: g.risk_level === 'critical' ? 5 : g.risk_level === 'high' ? 4 : g.risk_level === 'medium' ? 3 : 2,
                owner: '',
                treatment: 'Mitigate',
                treatment_plan: (g.recommendations || []).join('; '),
                status: 'Open',
                due_date: '',
            }))
            setRisks(prev => [...prev, ...generated])
        } catch (err) {
            alert('Failed to generate risks: ' + err.message)
        } finally {
            setGenerating(false)
        }
    }

    function exportCSV() {
        const headers = ['Risk ID', 'Description', 'Category', 'Likelihood', 'Impact', 'Risk Score', 'Rating', 'Owner', 'Treatment', 'Treatment Plan', 'Status', 'Due Date']
        const rows = risks.map((r, i) => {
            const s = riskScore(r.likelihood, r.impact)
            return [`RSK-${String(i + 1).padStart(3, '0')}`, r.description, r.category, r.likelihood, r.impact, s, riskColor(s).label, r.owner, r.treatment, r.treatment_plan, r.status, r.due_date]
        })
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `RiskRegister_${orgName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
    }

    const totalRisks = risks.length
    const criticalCount = risks.filter(r => riskScore(r.likelihood, r.impact) >= 16).length
    const highCount = risks.filter(r => { const s = riskScore(r.likelihood, r.impact); return s >= 9 && s < 16 }).length
    const openCount = risks.filter(r => r.status === 'Open').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Risk Register</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        ISO {framework === 'ISO_42001' ? '42001' : '27001'} requires maintaining a risk register that documents identified risks,
                        their likelihood and impact, treatment decisions, and owners. This is the <strong>single most important document</strong> auditors review.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportCSV} disabled={risks.length === 0}
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">
                        Export CSV
                    </button>
                    <button onClick={generateFromGaps} disabled={generating}
                        className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                        {generating ? 'Generating…' : '✨ Generate from Gap Analysis'}
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    How to use your Risk Register
                </h3>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li><strong>Auto-generate</strong> — Click "Generate from Gap Analysis" to create risks from your compliance gaps</li>
                    <li><strong>Score risks</strong> — Likelihood × Impact = Risk Score. Scores ≥16 are critical, ≥9 high, ≥4 medium</li>
                    <li><strong>Assign owners</strong> — Every risk must have a named owner responsible for treatment</li>
                    <li><strong>Choose treatment</strong> — Mitigate (reduce), Accept (document acceptance), Transfer (insure), Avoid (eliminate)</li>
                    <li><strong>Review regularly</strong> — ISO requires periodic review. Update status and re-score as controls are implemented</li>
                </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Risks', value: totalRisks, color: 'text-slate-900' },
                    { label: 'Critical', value: criticalCount, color: 'text-red-600' },
                    { label: 'High', value: highCount, color: 'text-orange-600' },
                    { label: 'Open', value: openCount, color: 'text-yellow-600' },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 uppercase">{s.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Add Risk Button */}
            <button onClick={() => { setForm({ ...EMPTY_RISK }); setEditIdx(null); setShowForm(true) }}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
                + Add Risk Manually
            </button>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{editIdx !== null ? 'Edit Risk' : 'Add New Risk'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Risk Description *</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Describe the risk…" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Likelihood (1–5)</label>
                                    <select value={form.likelihood} onChange={e => setForm(f => ({ ...f, likelihood: +e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} — {LIKELIHOOD_LABELS[v - 1]}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Impact (1–5)</label>
                                    <select value={form.impact} onChange={e => setForm(f => ({ ...f, impact: +e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} — {IMPACT_LABELS[v - 1]}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Risk Owner</label>
                                    <input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. CISO, IT Manager" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Treatment</label>
                                    <select value={form.treatment} onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Treatment Plan</label>
                                <textarea rows={2} value={form.treatment_plan} onChange={e => setForm(f => ({ ...f, treatment_plan: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="How will this risk be treated?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                    <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
                                {editIdx !== null ? 'Update' : 'Add Risk'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Risk Table */}
            {risks.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">ID</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Description</th>
                                    <th className="text-center px-3 py-3 font-semibold text-slate-700">L</th>
                                    <th className="text-center px-3 py-3 font-semibold text-slate-700">I</th>
                                    <th className="text-center px-3 py-3 font-semibold text-slate-700">Score</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Owner</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Treatment</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {risks.map((r, i) => {
                                    const score = riskScore(r.likelihood, r.impact)
                                    const rc = riskColor(score)
                                    return (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono text-xs text-slate-500">RSK-{String(i + 1).padStart(3, '0')}</td>
                                            <td className="px-4 py-3 text-slate-800 max-w-xs truncate" title={r.description}>{r.description}</td>
                                            <td className="px-3 py-3 text-center">{r.likelihood}</td>
                                            <td className="px-3 py-3 text-center">{r.impact}</td>
                                            <td className="px-3 py-3 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${rc.bg} ${rc.text} ${rc.border} border`}>
                                                    {score} — {rc.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{r.owner || '—'}</td>
                                            <td className="px-4 py-3 text-slate-600">{r.treatment}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${r.status === 'Closed' ? 'bg-green-50 text-green-700' :
                                                        r.status === 'In Treatment' ? 'bg-blue-50 text-blue-700' :
                                                            r.status === 'Accepted' ? 'bg-slate-100 text-slate-600' :
                                                                'bg-yellow-50 text-yellow-700'
                                                    }`}>{r.status}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleEdit(i)} className="text-primary-600 hover:text-primary-800 text-xs font-medium mr-2">Edit</button>
                                                <button onClick={() => handleDelete(i)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="text-lg font-semibold text-slate-800">No risks documented yet</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                        Start by clicking <strong>"Generate from Gap Analysis"</strong> to auto-create risks from your compliance gaps,
                        or add risks manually.
                    </p>
                </div>
            )}
        </div>
    )
}
