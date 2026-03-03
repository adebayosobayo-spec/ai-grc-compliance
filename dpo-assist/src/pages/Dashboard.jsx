import React from 'react'

const STATS = [
    { label: 'Active DPIAs', value: '0', icon: '🛡️', color: 'text-blue-600' },
    { label: 'Processing Activities', value: '0', icon: '📋', color: 'text-emerald-600' },
    { label: 'Open Breaches', value: '0', icon: '🚨', color: 'text-red-600' },
    { label: 'Pending DSRs', value: '0', icon: '👤', color: 'text-amber-600' },
    { label: 'Awaiting Approval', value: '0', icon: '⏳', color: 'text-purple-600' },
    { label: 'Audit Events', value: '0', icon: '📝', color: 'text-slate-600' },
]

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    COMPLAI DPO Assist — AI-powered data protection compliance platform supporting your DPO.
                </p>
            </div>

            {/* Advisory banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <div>
                    <h3 className="text-sm font-semibold text-amber-800">AI Advisory Notice</h3>
                    <p className="text-xs text-amber-700 mt-1">
                        All outputs from this platform are <strong>AI-generated advisory recommendations</strong>.
                        Final decision-making authority rests with your appointed human Data Protection Officer.
                        AI outputs must be reviewed and approved before implementation.
                    </p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STATS.map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">{s.icon}</span>
                        </div>
                        <p className={`text-3xl font-bold mt-3 ${s.color}`}>{s.value}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { label: 'Generate DPIA', desc: 'AI-draft a Data Protection Impact Assessment', href: '/dpia', icon: '🛡️' },
                        { label: 'Generate RoPA', desc: 'Create Records of Processing Activities', href: '/ropa', icon: '📋' },
                        { label: 'Generate Privacy Policy', desc: 'AI-draft privacy policies and notices', href: '/policies', icon: '📄' },
                    ].map(a => (
                        <a key={a.label} href={a.href}
                            className="bg-white border border-slate-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all group">
                            <span className="text-2xl">{a.icon}</span>
                            <h3 className="text-sm font-semibold text-slate-800 mt-2 group-hover:text-primary-600">{a.label}</h3>
                            <p className="text-xs text-slate-500 mt-1">{a.desc}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent activity placeholder */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-slate-800">Get started with DPO Assist</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Use the sidebar to generate DPIAs, create processing records, manage breaches, and track consent.
                    All AI outputs require DPO approval before they become active.
                </p>
            </div>
        </div>
    )
}
