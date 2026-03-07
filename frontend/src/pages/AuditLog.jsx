import React, { useState, useEffect, useCallback } from 'react'
import { complianceAPI } from '../services/api'

const ACTION_LABELS = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
    generate: 'Generated',
    export: 'Exported',
    verify: 'Verified',
    upsert: 'Saved',
}

const RESOURCE_LABELS = {
    onboarding: 'Organisation Profile',
    gap_analysis: 'Gap Analysis',
    policy: 'Policy Document',
    assessment: 'Control Assessment',
    action_plan: 'Action Plan',
    risk: 'Risk Entry',
    asset: 'Asset Entry',
    supplier: 'Supplier Entry',
    data_processing: 'Data Processing Entry',
    ai_system: 'AI System Entry',
    control: 'Control Entry',
    evidence: 'Evidence',
    audit_pack: 'Audit Pack',
    register: 'Register',
    document: 'Document',
}

function actionType(action) {
    if (action === 'generate' || action === 'export') return 'ai_generation'
    if (action === 'delete') return 'override'
    if (action === 'create' || action === 'update' || action === 'upsert') return 'human_decision'
    return 'system'
}

export default function AuditLog() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [error, setError] = useState(null)

    const fetchLogs = useCallback(async (p = 1) => {
        setLoading(true)
        setError(null)
        try {
            const params = { page: p, page_size: 50 }
            if (filter !== 'all') {
                const actionMap = {
                    ai_generation: undefined,
                    human_decision: undefined,
                    override: undefined,
                }
                // filter by action type on the backend
                if (filter === 'ai_generation') params.action = 'generate'
                else if (filter === 'override') params.action = 'delete'
                else if (filter === 'human_decision') params.action = 'create'
            }
            const data = await complianceAPI.listAuditLogs(params)
            setEvents(data.items || [])
            setTotal(data.total || 0)
            setHasMore(data.has_more || false)
            setPage(data.page || 1)
        } catch (err) {
            setError('Failed to load audit logs')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [filter])

    useEffect(() => { fetchLogs(1) }, [fetchLogs])

    const typeColors = {
        ai_generation: {
            bg: 'bg-indigo-50 border-indigo-200',
            text: 'text-indigo-600',
            label: 'AI ACTION',
            icon: '🤖'
        },
        human_decision: {
            bg: 'bg-emerald-50 border-emerald-200',
            text: 'text-emerald-600',
            label: 'USER ACTION',
            icon: '✒️'
        },
        override: {
            bg: 'bg-amber-50 border-amber-200',
            text: 'text-amber-600',
            label: 'DELETION',
            icon: '⚡'
        },
        system: {
            bg: 'bg-slate-50 border-slate-200',
            text: 'text-slate-600',
            label: 'SYSTEM',
            icon: '⚙️'
        },
    }

    const filtered = filter === 'all' ? events : events.filter(e => actionType(e.action) === filter)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Immutable Audit Trail</h2>
                    <p className="text-sm text-slate-500 mt-1 font-mono uppercase tracking-tight">Verifiable event log for regulatory provenance.</p>
                </div>
                <button onClick={() => fetchLogs(1)} disabled={loading}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50">
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mt-20 -mr-20" />
                <div className="relative z-10">
                    <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        Provenance Guard Active
                    </h3>
                    <p className="text-white text-lg font-bold leading-relaxed max-w-3xl">
                        This ledger provides <span className="text-emerald-400 font-black">absolute traceability</span> for all platform actions. Required under GDPR Article 5(2) accountability principle.
                    </p>
                    <p className="text-slate-400 text-sm mt-2 font-mono">{total} total events recorded</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Stats & Filters */}
                <div className="lg:w-80 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono">Filter by Type</p>
                            <div className="flex flex-col gap-2">
                                {[
                                    { key: 'all', label: 'All Events', icon: '🌐' },
                                    { key: 'human_decision', label: 'User Actions', icon: '✒️' },
                                    { key: 'ai_generation', label: 'AI Actions', icon: '🤖' },
                                    { key: 'override', label: 'Deletions', icon: '⚡' }
                                ].map(t => (
                                    <button key={t.key} onClick={() => setFilter(t.key)}
                                        className={`flex items-center gap-3 px-4 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest border ${filter === t.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                                        <span>{t.icon}</span>
                                        <span>{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono">Stream Stats</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Total', value: total },
                                    { label: 'AI', value: events.filter(e => actionType(e.action) === 'ai_generation').length },
                                    { label: 'User', value: events.filter(e => actionType(e.action) === 'human_decision').length },
                                    { label: 'Delete', value: events.filter(e => actionType(e.action) === 'override').length },
                                ].map(s => (
                                    <div key={s.label} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{s.label}</p>
                                        <p className="text-lg font-black text-slate-900 leading-none mt-1">{s.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Timeline */}
                <div className="flex-1 space-y-3">
                    {loading ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                            <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-sm text-slate-500 font-medium">Loading audit events...</p>
                        </div>
                    ) : filtered.length > 0 ? (
                        <>
                            {filtered.map((e, i) => {
                                const type = actionType(e.action)
                                const tc = typeColors[type] || typeColors.system
                                const actionLabel = ACTION_LABELS[e.action] || e.action
                                const resourceLabel = RESOURCE_LABELS[e.resource_type] || e.resource_type
                                const ts = new Date(e.created_at).toLocaleString()
                                const detailStr = e.details && Object.keys(e.details).length > 0
                                    ? Object.entries(e.details).map(([k, v]) => `${k}: ${v}`).join(' | ')
                                    : ''
                                return (
                                    <div key={e.id || i} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition-all group overflow-hidden relative">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-xl shadow-sm border ${tc.bg} ${tc.text}`}>
                                                    {tc.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${tc.bg} ${tc.text}`}>
                                                            {tc.label}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{ts}</span>
                                                    </div>
                                                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                        {actionLabel} <span className="text-slate-400 lowercase font-medium mx-1">on</span> {resourceLabel}
                                                    </h4>
                                                    {detailStr && (
                                                        <p className="text-[11px] text-slate-500 font-medium mt-1 italic">"{detailStr}"</p>
                                                    )}
                                                    {e.resource_id && (
                                                        <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {e.resource_id}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {e.ip_address && (
                                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 self-start md:self-center">
                                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{e.ip_address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                            {hasMore && (
                                <div className="text-center pt-4">
                                    <button onClick={() => fetchLogs(page + 1)}
                                        className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 transition-all">
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center">
                            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-10 text-5xl">📜</div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-none uppercase">Ledger Cold</h3>
                            <p className="text-slate-500 max-w-sm mx-auto text-base font-medium">
                                No events recorded yet. Actions across the platform will be logged here automatically.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
