import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const EMPTY_DPIA = {
    project_name: '', description: '', data_types: '', data_subjects: '',
    legal_basis: 'Consent', processing_purpose: '', recipients: '',
    retention_period: '', safeguards: '', status: 'Draft',
}

export default function DPIA() {
    const { orgProfile } = useAppContext()
    const [dpias, setDpias] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editIdx, setEditIdx] = useState(null)
    const [form, setForm] = useState({ ...EMPTY_DPIA })
    const [generating, setGenerating] = useState(false)
    const [selectedDpia, setSelectedDpia] = useState(null)
    const [generatedReport, setGeneratedReport] = useState(null)

    function handleSave() {
        if (!form.project_name.trim()) return
        if (editIdx !== null) {
            setDpias(prev => prev.map((d, i) => i === editIdx ? { ...form } : d))
        } else {
            setDpias(prev => [...prev, { ...form, created: new Date().toISOString().slice(0, 10) }])
        }
        setForm({ ...EMPTY_DPIA }); setShowForm(false); setEditIdx(null)
    }

    function handleEdit(idx) { setForm({ ...dpias[idx] }); setEditIdx(idx); setShowForm(true) }
    function handleDelete(idx) { if (confirm('Delete this DPIA?')) setDpias(prev => prev.filter((_, i) => i !== idx)) }

    async function generateDPIA() {
        if (!form.project_name.trim()) { alert('Enter a project name first'); return }
        setGenerating(true)
        setGeneratedReport(null)
        // Simulate AI generation — in production this calls the backend
        setTimeout(() => {
            const report = {
                title: `DPIA — ${form.project_name}`,
                sections: [
                    { heading: 'Processing Description', content: `This assessment covers the processing of personal data as part of "${form.project_name}". ${form.description || 'The project involves processing personal data for business operations.'}` },
                    { heading: 'Necessity & Proportionality', content: `Legal basis: ${form.legal_basis}. Purpose: ${form.processing_purpose || 'Business operations and service delivery.'}` },
                    { heading: 'Data Types & Subjects', content: `Data types: ${form.data_types || 'Names, emails, usage data.'}  Data subjects: ${form.data_subjects || 'Customers, employees.'}` },
                    { heading: 'Risk Assessment', content: 'Risks have been identified relating to data access, storage security, and third-party sharing. Each risk requires mitigation measures and DPO sign-off.' },
                    { heading: 'Mitigation Measures', content: `Safeguards: ${form.safeguards || 'Encryption at rest and in transit, access controls, staff training, regular audits.'}` },
                    { heading: 'DPO Recommendation', content: '⚠️ AI ADVISORY — This DPIA must be reviewed and approved by your Data Protection Officer before the processing begins.' },
                ]
            }
            setGeneratedReport(report)
            setGenerating(false)
        }, 1500)
    }

    const statusColors = { Draft: 'bg-yellow-50 text-yellow-700', 'Under Review': 'bg-blue-50 text-blue-700', Approved: 'bg-green-50 text-green-700', Rejected: 'bg-red-50 text-red-700' }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">DPIA — Data Protection Impact Assessment</h1>
                    <p className="text-sm text-slate-500 mt-1">GDPR Article 35 requires a DPIA before processing that is likely to result in high risk to individuals.</p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800">When is a DPIA required?</h3>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Systematic and extensive profiling with significant effects</li>
                    <li>Large-scale processing of special categories of data</li>
                    <li>Systematic monitoring of publicly accessible areas</li>
                    <li>New technologies or novel processing methods</li>
                    <li>Processing that could deny individuals a service or benefit</li>
                </ul>
            </div>

            <button onClick={() => { setForm({ ...EMPTY_DPIA }); setEditIdx(null); setShowForm(true); setGeneratedReport(null) }}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
                + Create New DPIA
            </button>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{editIdx !== null ? 'Edit DPIA' : 'New DPIA'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Project / Processing Name *</label>
                                <input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Customer Analytics Platform" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Describe the processing activity…" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Data Types</label>
                                    <input value={form.data_types} onChange={e => setForm(f => ({ ...f, data_types: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Names, emails, financial data" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Data Subjects</label>
                                    <input value={form.data_subjects} onChange={e => setForm(f => ({ ...f, data_subjects: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Customers, employees" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Legal Basis</label>
                                    <select value={form.legal_basis} onChange={e => setForm(f => ({ ...f, legal_basis: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {['Consent', 'Contract', 'Legal obligation', 'Vital interests', 'Public task', 'Legitimate interests'].map(b => <option key={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Retention Period</label>
                                    <input value={form.retention_period} onChange={e => setForm(f => ({ ...f, retention_period: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 3 years post-contract" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Processing Purpose</label>
                                <textarea rows={2} value={form.processing_purpose} onChange={e => setForm(f => ({ ...f, processing_purpose: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Why is this data processed?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Safeguards</label>
                                <textarea rows={2} value={form.safeguards} onChange={e => setForm(f => ({ ...f, safeguards: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Security measures in place…" />
                            </div>
                        </div>
                        <div className="flex justify-between gap-3 mt-6">
                            <button onClick={generateDPIA} disabled={generating}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                                {generating ? 'Generating…' : '✨ Generate DPIA Report'}
                            </button>
                            <div className="flex gap-3">
                                <button onClick={() => { setShowForm(false); setEditIdx(null) }}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                                <button onClick={handleSave}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Save DPIA</button>
                            </div>
                        </div>

                        {generatedReport && (
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">⚠️ AI ADVISORY</span>
                                    <h3 className="text-base font-bold text-slate-900">{generatedReport.title}</h3>
                                </div>
                                <div className="space-y-4">
                                    {generatedReport.sections.map((s, i) => (
                                        <div key={i}>
                                            <h4 className="text-sm font-semibold text-slate-800">{s.heading}</h4>
                                            <p className="text-sm text-slate-600 mt-1">{s.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {dpias.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Project</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Legal Basis</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-slate-700">Created</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dpias.map((d, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">{d.project_name}</td>
                                    <td className="px-4 py-3 text-slate-600">{d.legal_basis}</td>
                                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[d.status] || ''}`}>{d.status}</span></td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{d.created}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => handleEdit(i)} className="text-primary-600 text-xs font-medium mr-2">Edit</button>
                                        <button onClick={() => handleDelete(i)} className="text-red-500 text-xs font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h3 className="text-lg font-semibold text-slate-800">No DPIAs yet</h3>
                    <p className="text-sm text-slate-500 mt-1">Create a DPIA to assess the data protection risks of a new project or processing activity.</p>
                </div>
            )}
        </div>
    )
}
