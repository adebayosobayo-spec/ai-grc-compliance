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

export default function DPOAssist() {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-6">
                <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Data Protection</p>
                <h1 className="text-3xl font-black text-slate-900">DPO Assist</h1>
                <p className="mt-1 text-slate-600">AI-powered tools to support your Data Protection Officer obligations</p>
            </div>

            {/* Tab bar — scrollable on mobile */}
            <div className="mb-6 -mx-4 sm:mx-0">
                <div className="flex gap-1 overflow-x-auto px-4 sm:px-0 pb-2 sm:pb-0 sm:flex-wrap">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
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
    )
}

// ─── Overview / Landing Tab ──────────────────────────────────────
function OverviewTab({ onNavigate }) {
    return (
        <div className="space-y-6">
            {/* Hero explanation */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">Does your organisation need a DPO?</h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                    Under GDPR (Article 37), NDPR, POPIA, and other data protection regulations, you <strong className="text-white">must</strong> appoint
                    a Data Protection Officer (DPO) if your organisation:
                </p>
                <ul className="space-y-2 text-sm text-blue-100 mb-6">
                    <li className="flex items-start gap-2">
                        <span className="text-white font-bold mt-0.5">→</span>
                        <span>Is a <strong className="text-white">public authority or body</strong> (except courts acting in a judicial capacity)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-white font-bold mt-0.5">→</span>
                        <span>Carries out <strong className="text-white">large-scale systematic monitoring</strong> of individuals (e.g. tracking, profiling, behavioural advertising)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-white font-bold mt-0.5">→</span>
                        <span>Processes <strong className="text-white">special category data</strong> at large scale (health, biometric, criminal, religious data)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-white font-bold mt-0.5">→</span>
                        <span>Is required by <strong className="text-white">national law</strong> (e.g. Germany requires DPOs for companies with 20+ employees processing personal data; Nigeria's NDPR requires all data controllers to have a DPO)</span>
                    </li>
                </ul>
                <p className="text-blue-200 text-xs">
                    Even if not legally required, appointing a DPO is <strong className="text-blue-100">recommended as best practice</strong> for any organisation processing personal data.
                </p>
            </div>

            {/* How COMPLAI helps */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">How COMPLAI DPO Assist helps</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                        <div className="text-3xl mb-2">🤖</div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">AI-Powered Tools</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Generate DPIAs, privacy policies, RoPAs, breach templates, and more — all reviewed and approved by your DPO before use.
                        </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                        <div className="text-3xl mb-2">💼</div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Hire a DPO</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Can't find a DPO? COMPLAI connects you with qualified, independent Data Protection Officers <strong>anywhere in the world</strong>.
                        </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                        <div className="text-3xl mb-2">👥</div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Appoint from Your Team</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Already have someone in mind? Appoint a team member as your DPO and give them access to the full DPO Assist platform to manage compliance.
                        </p>
                    </div>
                </div>
            </div>

            {/* DPO Independence guarantee */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-lg">⚖️</span>
                <div>
                    <h4 className="text-sm font-bold text-amber-800">DPO Independence Guarantee</h4>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        GDPR Article 38 requires DPOs to operate with <strong>full independence</strong>. They report directly to the highest level
                        of management and cannot be instructed on how to exercise their tasks. All AI outputs from COMPLAI are <strong>advisory only</strong> —
                        the DPO has final authority over all decisions.
                    </p>
                </div>
            </div>

            {/* Quick access cards */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">DPO Functions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {TABS.filter(t => t.key !== 'overview').map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => onNavigate(tab.key)}
                            className="group bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-md transition-all"
                        >
                            <div className="text-2xl mb-2">{tab.icon}</div>
                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tab.label}</h4>
                            <p className="text-xs text-slate-500 mt-1">{getTabDescription(tab.key)}</p>
                        </button>
                    ))}
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
