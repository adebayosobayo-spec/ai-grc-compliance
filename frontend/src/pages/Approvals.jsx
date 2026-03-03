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

    const statusColors = { Pending: 'bg-yellow-50 text-yellow-700', Approved: 'bg-green-50 text-green-700', 'Approved with Conditions': 'bg-blue-50 text-blue-700', Rejected: 'bg-red-50 text-red-700', 'Override': 'bg-purple-50 text-purple-700' }
    const pending = items.filter(i => i.status === 'Pending').length

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">DPO Approval Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">All AI-generated outputs require human DPO approval. Review recommendations, approve, reject, or override with documented reasoning.</p>
                </div>
                <button onClick={generateSamples} disabled={generating} className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg disabled:opacity-50">
                    {generating ? 'Loading…' : '✨ Generate Samples'}
                </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800">⚖️ Human-in-the-Loop Requirement</h3>
                <p className="text-xs text-amber-700 mt-1">GDPR requires human oversight over automated decision-making. All AI recommendations are advisory only. The DPO has final authority and can override any AI recommendation with documented justification.</p>
            </div>

            {pending > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⏳</span>
                        <p className="text-sm font-semibold text-primary-800">{pending} item{pending > 1 ? 's' : ''} awaiting DPO review</p>
                    </div>
                </div>
            )}

            {items.length > 0 ? (
                <div className="space-y-3">
                    {items.map((item, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-slate-400">{item.id}</span>
                                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{item.type}</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[item.status] || ''}`}>{item.status}</span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">Submitted: {item.submitted}</p>
                                </div>
                            </div>

                            {/* AI Recommendation */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">⚠️ AI ADVISORY</span>
                                    <span className="text-xs font-semibold text-blue-800">AI Recommendation</span>
                                </div>
                                <p className="text-sm text-blue-700">{item.aiRecommendation}</p>
                            </div>

                            {/* Override history */}
                            {item.overrides?.length > 0 && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                                    <p className="text-xs font-semibold text-purple-800 mb-1">Override History</p>
                                    {item.overrides.map((o, j) => (
                                        <p key={j} className="text-xs text-purple-700">DPO overrode "{o.from}" → "{o.to}" on {o.date.slice(0, 10)}{o.reason ? ` — ${o.reason}` : ''}</p>
                                    ))}
                                </div>
                            )}

                            {/* Action buttons */}
                            {item.status === 'Pending' && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleDecision(i, 'Approved')} className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700">✓ Approve</button>
                                    <button onClick={() => handleDecision(i, 'Approved with Conditions', 'DPO conditions to be added')} className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">Approve with Conditions</button>
                                    <button onClick={() => handleDecision(i, 'Rejected', 'Insufficient risk mitigation')} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100">✗ Reject</button>
                                </div>
                            )}

                            {item.decisionDate && (
                                <p className="text-xs text-slate-500 mt-2">Decision made: {item.decisionDate} {item.decisionNotes ? `— ${item.decisionNotes}` : ''}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-lg font-semibold text-slate-800">No items requiring approval</h3>
                    <p className="text-sm text-slate-500 mt-1">AI-generated DPIAs, policies, and breach responses will appear here for DPO review.</p>
                </div>
            )}
        </div>
    )
}
