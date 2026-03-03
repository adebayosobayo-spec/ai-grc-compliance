import React, { useState } from 'react'

const TIERS = [
    {
        name: 'Startup',
        price: 'From $299/mo',
        description: 'AI-powered compliance tools only. Perfect for startups setting up their first privacy programme.',
        features: ['AI-generated DPIAs & policies', 'RoPA management', 'Breach response workflows', 'Consent & DSR tracking', 'Audit log', 'Email support'],
        highlight: false,
        cta: 'Get Started',
    },
    {
        name: 'SME',
        price: 'From $799/mo',
        description: 'Everything in Startup + access to a shared external DPO for guidance and sign-off.',
        features: ['Everything in Startup', 'Shared external DPO access', 'Monthly DPO review sessions', 'Regulatory filing support', 'Priority support', 'Quarterly compliance report'],
        highlight: true,
        cta: 'Most Popular',
    },
    {
        name: 'Enterprise',
        price: 'Custom pricing',
        description: 'Dedicated DPO assigned to your organisation with custom workflows and on-demand availability.',
        features: ['Everything in SME', 'Dedicated named DPO', 'Custom compliance workflows', 'On-demand DPO availability', 'Board-ready reporting', 'Regulatory liaison & representation', 'SLA-backed response times'],
        highlight: false,
        cta: 'Contact Sales',
    },
]

export default function HireDPO() {
    const [showForm, setShowForm] = useState(false)
    const [selectedTier, setSelectedTier] = useState('')
    const [form, setForm] = useState({ name: '', email: '', company: '', employees: '', industry: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        if (!form.name.trim() || !form.email.trim()) return
        setSubmitted(true)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Hire a DPO</h1>
                <p className="text-sm text-slate-500 mt-1">
                    GDPR Article 37 requires certain organisations to appoint a Data Protection Officer.
                    If you don't have an in-house DPO, COMPLAI can connect you with qualified, independent DPOs.
                </p>
            </div>

            {/* When is a DPO required? */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800">When is a DPO required?</h3>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Public authorities or bodies (except courts)</li>
                    <li>Core activities involve regular and systematic monitoring of individuals at large scale</li>
                    <li>Core activities involve processing special categories of data at large scale</li>
                    <li>Required by member state law (e.g. Germany requires DPOs for companies with 20+ employees processing personal data)</li>
                    <li>Even if not legally required, appointing a DPO is <strong>recommended as best practice</strong></li>
                </ul>
            </div>

            {/* DPO Independence notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-lg">⚖️</span>
                <div>
                    <h3 className="text-sm font-semibold text-amber-800">DPO Independence Guarantee</h3>
                    <p className="text-xs text-amber-700 mt-1">
                        All DPOs sourced through COMPLAI operate with <strong>full independence</strong> as required by GDPR Article 38.
                        They report directly to the highest management level and cannot be given instructions on how to exercise their tasks.
                        COMPLAI does not interfere with DPO decision-making.
                    </p>
                </div>
            </div>

            {/* Pricing tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIERS.map(tier => (
                    <div key={tier.name} className={`bg-white rounded-xl border-2 p-6 flex flex-col ${tier.highlight ? 'border-primary-500 shadow-lg ring-1 ring-primary-200' : 'border-slate-200'}`}>
                        {tier.highlight && <span className="text-xs font-bold text-primary-600 uppercase mb-2">★ Most Popular</span>}
                        <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                        <p className="text-2xl font-bold text-primary-600 mt-2">{tier.price}</p>
                        <p className="text-xs text-slate-500 mt-2">{tier.description}</p>
                        <ul className="mt-4 space-y-2 flex-1">
                            {tier.features.map(f => (
                                <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => { setSelectedTier(tier.name); setShowForm(true); setSubmitted(false) }}
                            className={`mt-4 w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${tier.highlight ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                }`}>
                            {tier.cta}
                        </button>
                    </div>
                ))}
            </div>

            {/* Inquiry form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="text-5xl mb-4">✅</div>
                                <h2 className="text-xl font-bold text-slate-900">Request Submitted!</h2>
                                <p className="text-sm text-slate-500 mt-2">We've received your inquiry for the <strong>{selectedTier}</strong> tier. A COMPLAI team member will contact you within 24 hours to discuss your DPO requirements.</p>
                                <button onClick={() => setShowForm(false)} className="mt-6 px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Close</button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-slate-900 mb-1">Request a DPO — {selectedTier} Tier</h2>
                                <p className="text-xs text-slate-500 mb-4">Fill in your details and we'll match you with a qualified DPO.</p>
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="block text-xs font-medium text-slate-700 mb-1">Your Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                        <div><label className="block text-xs font-medium text-slate-700 mb-1">Email *</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="block text-xs font-medium text-slate-700 mb-1">Company</label><input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" /></div>
                                        <div><label className="block text-xs font-medium text-slate-700 mb-1">Industry</label><input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Fintech" /></div>
                                    </div>
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Number of Employees</label><input value={form.employees} onChange={e => setForm(f => ({ ...f, employees: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 50" /></div>
                                    <div><label className="block text-xs font-medium text-slate-700 mb-1">Tell us about your needs</label><textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="What data protection challenges are you facing?" /></div>
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg">Cancel</button>
                                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Submit Request</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
