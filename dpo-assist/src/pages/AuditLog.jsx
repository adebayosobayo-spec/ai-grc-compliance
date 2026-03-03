import React, { useState } from 'react'

const SAMPLE_EVENTS = [
    { timestamp: '2025-01-15 09:30:00', actor: 'System (AI)', action: 'Generated DPIA draft', target: 'Customer Analytics Platform', details: 'AI generated 6-section DPIA report', type: 'ai_generation' },
    { timestamp: '2025-01-15 14:15:00', actor: 'Jane DPO', action: 'Approved DPIA', target: 'Customer Analytics Platform', details: 'Approved with condition: add encryption requirements', type: 'human_decision' },
    { timestamp: '2025-01-18 10:00:00', actor: 'System (AI)', action: 'Generated Privacy Policy', target: 'Privacy Policy v2', details: 'AI generated policy covering Articles 13-14', type: 'ai_generation' },
    { timestamp: '2025-01-18 16:45:00', actor: 'Jane DPO', action: 'Overrode AI recommendation', target: 'Privacy Policy v2', details: 'Override reason: AI missed cookie consent section; DPO added manually', type: 'override' },
    { timestamp: '2025-01-20 08:00:00', actor: 'System', action: 'Breach detected', target: 'Credential compromise', details: 'Automated alerting triggered — unauthorized login from unusual IP', type: 'system' },
    { timestamp: '2025-01-20 08:30:00', actor: 'System (AI)', action: 'Generated breach classification', target: 'Credential compromise', details: 'AI classified as CRITICAL — recommended 72-hour notification', type: 'ai_generation' },
    { timestamp: '2025-01-20 09:00:00', actor: 'John DPO', action: 'Approved breach report', target: 'Credential compromise', details: 'Approved notification to ICO within 72 hours', type: 'human_decision' },
]

export default function AuditLog() {
    const [events, setEvents] = useState([])
    const [generating, setGenerating] = useState(false)
    const [filter, setFilter] = useState('all')

    function generateSamples() {
        setGenerating(true)
        setTimeout(() => { setEvents(prev => [...prev, ...SAMPLE_EVENTS]); setGenerating(false) }, 800)
    }

    const typeColors = {
        ai_generation: { bg: 'bg-blue-50', text: 'text-blue-700', label: '🤖 AI Generation' },
        human_decision: { bg: 'bg-green-50', text: 'text-green-700', label: '👤 Human Decision' },
        override: { bg: 'bg-purple-50', text: 'text-purple-700', label: '⚡ Override' },
        system: { bg: 'bg-slate-100', text: 'text-slate-700', label: '⚙️ System' },
    }

    const filtered = filter === 'all' ? events : events.filter(e => e.type === filter)

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
                    <p className="text-sm text-slate-500 mt-1">Immutable record of all AI recommendations, human decisions, and overrides. Required for regulatory audits and investigations.</p>
                </div>
                <button onClick={generateSamples} disabled={generating} className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg disabled:opacity-50">
                    {generating ? 'Loading…' : '✨ Generate Sample Log'}
                </button>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-800">🔒 Immutability</h3>
                <p className="text-xs text-slate-600 mt-1">Audit log entries are immutable and cannot be edited or deleted. This ensures a complete and tamper-proof record of all compliance activities for regulatory audits.</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit flex-wrap">
                {[{ key: 'all', label: 'All Events' }, { key: 'ai_generation', label: '🤖 AI' }, { key: 'human_decision', label: '👤 Human' }, { key: 'override', label: '⚡ Override' }].map(t => (
                    <button key={t.key} onClick={() => setFilter(t.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: events.length },
                    { label: 'AI Generations', value: events.filter(e => e.type === 'ai_generation').length },
                    { label: 'Human Decisions', value: events.filter(e => e.type === 'human_decision').length },
                    { label: 'Overrides', value: events.filter(e => e.type === 'override').length },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 uppercase">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Event timeline */}
            {filtered.length > 0 ? (
                <div className="space-y-2">
                    {filtered.map((e, i) => {
                        const tc = typeColors[e.type] || typeColors.system
                        return (
                            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-4">
                                <div className="flex-shrink-0 mt-0.5">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${tc.bg} ${tc.text}`}>{tc.label}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-800 text-sm">{e.action}</span>
                                        <span className="text-xs text-slate-400">→</span>
                                        <span className="text-sm text-slate-600">{e.target}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{e.details}</p>
                                    <div className="flex gap-4 mt-1.5 text-xs text-slate-400">
                                        <span>🕐 {e.timestamp}</span>
                                        <span>👤 {e.actor}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">📝</div>
                    <h3 className="text-lg font-semibold text-slate-800">No audit events yet</h3>
                    <p className="text-sm text-slate-500 mt-1">Actions across the platform will be logged here automatically.</p>
                </div>
            )}
        </div>
    )
}
