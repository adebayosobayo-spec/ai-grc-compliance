import React, { useState } from 'react'

// ─── Sub-page components (lazy inline) ───────────────────────────
import DPIA from './DPIA'
import RoPA from './RoPA'
import BreachResponse from './BreachResponse'
import ConsentDSR from './ConsentDSR'
import PrivacyPolicies from './PrivacyPolicies'
import Approvals from './Approvals'
import AuditLog from './AuditLog'
import HireDPO from './HireDPO'

const TABS = [
    { key: 'overview', label: 'Overview', icon: '🏠' },
    { key: 'dpia', label: 'DPIA', icon: '🛡️' },
    { key: 'ropa', label: 'RoPA', icon: '📋' },
    { key: 'breach', label: 'Breach Response', icon: '🚨' },
    { key: 'consent', label: 'Consent & DSR', icon: '👤' },
    { key: 'policies', label: 'Privacy Policies', icon: '📄' },
    { key: 'approvals', label: 'DPO Approvals', icon: '✅' },
    { key: 'audit', label: 'Audit Log', icon: '🔒' },
    { key: 'hire', label: 'Hire / Appoint DPO', icon: '💼' },
]

export default function DPOAssist({ defaultTab }) {
    const [activeTab, setActiveTab] = useState(defaultTab || 'overview')

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Header / Hero */}
            <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase mb-3">Governance Risk & Compliance</p>
                        <h1 className="text-4xl font-black text-white leading-tight">DPO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Assist</span></h1>
                        <p className="mt-4 text-slate-400 max-w-xl text-lg leading-relaxed">
                            Full-lifecycle data protection management. Generate DPIAs, manage RoPAs, and handle data subject requests with AI oversight.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[120px]">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">DPO Active</p>
                            <p className="text-emerald-400 text-xs font-black flex items-center justify-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                MONITORING
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Tab bar */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-1.5 rounded-2xl inline-flex flex-wrap gap-1 max-w-full overflow-x-auto custom-scrollbar">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === tab.key
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab content area */}
            <div className="animate-in fade-in duration-500">
                {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
                {activeTab === 'dpia' && <DPIA />}
                {activeTab === 'ropa' && <RoPA />}
                {activeTab === 'breach' && <BreachResponse />}
                {activeTab === 'consent' && <ConsentDSR />}
                {activeTab === 'policies' && <PrivacyPolicies />}
                {activeTab === 'approvals' && <Approvals />}
                {activeTab === 'audit' && <AuditLog />}
                {activeTab === 'hire' && <HireDPO />}
            </div>
        </div>
    )
}

// ─── Overview / Landing Tab ──────────────────────────────────────
function OverviewTab({ onNavigate }) {
    return (
        <div className="space-y-10">
            {/* Quick Stats Funnel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'DPIAs', value: '4', sub: '2 need review', color: 'text-blue-400' },
                    { label: 'Pending DSRs', value: '1', sub: 'Due in 14d', color: 'text-amber-400' },
                    { label: 'RoPA Activities', value: '12', sub: 'Updated 2d ago', color: 'text-emerald-400' },
                    { label: 'Breach Logs', value: '0', sub: 'Safe', color: 'text-slate-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Instruction */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Does your organisation need a DPO?</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Under regulations like <span className="font-bold text-blue-600">GDPR</span>, <span className="font-bold text-indigo-600">NDPR</span>, and <span className="font-bold text-emerald-600">POPIA</span>, you are legally required to appoint a DPO if you process sensitive data at scale or are a public body.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                'Public authority or body',
                                'Large-scale systematic monitoring',
                                'Processing special category data',
                                'Mandated by national laws (e.g. NDPR)'
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✓</div>
                                    <span className="text-sm font-medium text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                        <span className="text-2xl">⚖️</span>
                        <div>
                            <h4 className="text-sm font-bold text-amber-900">DPO Independence Guarantee</h4>
                            <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                                Article 38 requires DPOs to operate with <strong>full independence</strong>. They report directly to management and cannot be instructed on how to exercise their tasks. AI outputs are advisory; the DPO preserves final authority.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Function Directory */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">DPO Directory</h3>
                    <div className="space-y-2">
                        {TABS.filter(t => t.key !== 'overview').map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => onNavigate(tab.key)}
                                className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{tab.icon}</span>
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{tab.label}</span>
                                </div>
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getTabDescription(key) {
    const descs = {
        dpia: 'AI-generate Data Protection Impact Assessments',
        ropa: 'Manage Records of Processing Activities',
        breach: 'Log, track, and respond to data breaches',
        consent: 'Track Data Subject Requests and consent records',
        policies: 'Generate privacy policies and notices',
        approvals: 'DPO review and approve AI-generated outputs',
        audit: 'Immutable log of all compliance actions',
        hire: 'Find and hire a qualified DPO worldwide',
    }
    return descs[key] || ''
}
