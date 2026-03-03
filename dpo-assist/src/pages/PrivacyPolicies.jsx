import React, { useState } from 'react'

const POLICY_TYPES = ['Privacy Policy', 'Cookie Policy', 'Data Retention Policy', 'Employee Privacy Notice', 'Breach Notification Policy', 'Data Processing Agreement (DPA)']

export default function PrivacyPolicies() {
    const [policies, setPolicies] = useState([])
    const [selectedType, setSelectedType] = useState('Privacy Policy')
    const [generating, setGenerating] = useState(false)
    const [previewIdx, setPreviewIdx] = useState(null)

    async function generatePolicy() {
        setGenerating(true)
        setTimeout(() => {
            const now = new Date().toISOString().slice(0, 10)
            const templates = {
                'Privacy Policy': `# Privacy Policy\n\nLast updated: ${now}\n\n## 1. Who We Are\nWe are [Organisation Name], registered at [address]. For privacy inquiries, contact our DPO at [dpo@example.com].\n\n## 2. What Data We Collect\n- Identity data (name, email, phone)\n- Technical data (IP address, browser type)\n- Usage data (how you interact with our services)\n- Financial data (payment details for transactions)\n\n## 3. How We Use Your Data\nWe process your personal data for:\n- Service delivery (contractual necessity)\n- Legal compliance (legal obligation)\n- Marketing (with your consent)\n- Business analytics (legitimate interest)\n\n## 4. Legal Basis\nUnder GDPR, we rely on: consent, contractual necessity, legal obligation, and legitimate interests.\n\n## 5. Data Sharing\nWe share data with: payment processors, cloud hosting providers, and analytics services. All processors are bound by Data Processing Agreements.\n\n## 6. International Transfers\nData may be transferred outside the EEA using Standard Contractual Clauses (SCCs).\n\n## 7. Data Retention\nWe retain data only as long as necessary for the purposes described above.\n\n## 8. Your Rights\nYou have the right to: access, rectification, erasure, restriction, portability, and objection.\n\n## 9. Contact\nDPO: [dpo@example.com]\nSupervisory Authority: [Local DPA]`,
                'Cookie Policy': `# Cookie Policy\n\nLast updated: ${now}\n\n## What Are Cookies?\nCookies are small text files stored on your device when you visit our website.\n\n## Types of Cookies We Use\n1. **Essential** — Required for basic functionality\n2. **Analytics** — Help us understand usage patterns\n3. **Marketing** — Used for targeted advertising\n\n## Managing Cookies\nYou can control cookies through your browser settings or our cookie consent banner.\n\n## Contact\nFor questions about our cookie practices, contact [dpo@example.com].`,
            }
            const content = templates[selectedType] || `# ${selectedType}\n\nLast updated: ${now}\n\n⚠️ AI ADVISORY — This is an AI-generated draft. It must be reviewed by your DPO and legal counsel before publication.\n\n[Policy content to be customised for your organisation.]`
            setPolicies(prev => [...prev, { type: selectedType, content, date: now, status: 'Draft' }])
            setGenerating(false)
        }, 1500)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Privacy Policies & Notices</h1>
                <p className="text-sm text-slate-500 mt-1">GDPR Articles 13-14 require transparent privacy notices. Generate AI-assisted drafts and have your DPO review before publication.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <div>
                    <h3 className="text-sm font-semibold text-amber-800">AI Advisory</h3>
                    <p className="text-xs text-amber-700 mt-1">All generated policies are <strong>drafts</strong>. They must be reviewed by your Data Protection Officer and, where necessary, legal counsel before being published or implemented.</p>
                </div>
            </div>

            {/* Generator */}
            <div className="bg-white border border-slate-200 rounded-lg p-5">
                <h2 className="text-base font-semibold text-slate-900 mb-3">Generate a New Policy</h2>
                <div className="flex gap-3">
                    <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm">
                        {POLICY_TYPES.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <button onClick={generatePolicy} disabled={generating}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                        {generating ? 'Generating…' : '✨ Generate'}
                    </button>
                </div>
            </div>

            {/* Policy list */}
            {policies.length > 0 ? (
                <div className="space-y-3">
                    {policies.map((p, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => setPreviewIdx(previewIdx === i ? null : i)}>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">📄</span>
                                    <div>
                                        <h3 className="font-medium text-slate-800">{p.type}</h3>
                                        <p className="text-xs text-slate-500">Generated {p.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">⚠️ AI DRAFT</span>
                                    <span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">{p.status}</span>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${previewIdx === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                </div>
                            </div>
                            {previewIdx === i && (
                                <div className="border-t border-slate-100 p-5">
                                    <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">{p.content}</pre>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => { navigator.clipboard.writeText(p.content); alert('Copied!') }}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">Copy to Clipboard</button>
                                        <button onClick={() => { setPolicies(prev => prev.filter((_, j) => j !== i)); setPreviewIdx(null) }}
                                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">📄</div>
                    <h3 className="text-lg font-semibold text-slate-800">No policies generated yet</h3>
                    <p className="text-sm text-slate-500 mt-1">Select a policy type above and click "✨ Generate" to create an AI-assisted draft.</p>
                </div>
            )}
        </div>
    )
}
