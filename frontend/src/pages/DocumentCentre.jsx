import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { complianceAPI } from '../services/api'

const DOCUMENT_TYPES = [
    {
        id: 'incident',
        apiKey: 'incident_register',
        name: 'Incident Register',
        icon: '🚨',
        description: 'Records all security incidents including detection, response, resolution, and lessons learned. ISO 27001 A.5.24–A.5.28.',
        columns: ['Incident ID', 'Date', 'Description', 'Severity', 'Response Actions', 'Status', 'Lessons Learned'],
        required: true,
    },
    {
        id: 'supplier',
        apiKey: 'supplier_register',
        name: 'Supplier Register',
        icon: '🤝',
        description: 'Tracks third-party vendors who access your data or systems, their risk level, and contract details. ISO 27001 A.5.19–A.5.23.',
        columns: ['Supplier', 'Service', 'Data Access', 'Risk Level', 'Contract Expiry', 'Last Review', 'Status'],
        required: true,
    },
    {
        id: 'training',
        apiKey: 'training_register',
        name: 'Training Register',
        icon: '🎓',
        description: 'Records security awareness training for all staff. ISO 27001 A.6.3 requires evidence of competence and awareness programmes.',
        columns: ['Employee', 'Department', 'Training Course', 'Date Completed', 'Next Due', 'Certificate'],
        required: true,
    },
    {
        id: 'change',
        apiKey: 'change_log',
        name: 'Change Management Log',
        icon: '🔄',
        description: 'Documents all changes to systems, processes, and infrastructure with approval records. ISO 27001 A.8.32.',
        columns: ['Change ID', 'Date', 'Description', 'Requester', 'Approver', 'Risk Assessment', 'Status'],
        required: false,
    },
    {
        id: 'audit',
        apiKey: 'audit_log',
        name: 'Internal Audit Log',
        icon: '🔍',
        description: 'Records internal audit activities, findings, corrective actions, and follow-ups. ISO 27001 Clause 9.2.',
        columns: ['Audit ID', 'Date', 'Scope', 'Auditor', 'Findings', 'Corrective Actions', 'Follow-Up Date'],
        required: true,
    },
]

function DocumentCard({ doc, entries, onAddEntry, onExport, onGenerate, generating }) {
    const [expanded, setExpanded] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editIdx, setEditIdx] = useState(null)
    const [formRow, setFormRow] = useState({})

    function handleAdd() {
        if (Object.values(formRow).some(v => v && v.trim())) {
            onAddEntry(doc.id, formRow)
            setFormRow({})
            setShowForm(false)
        }
    }

    function handleEdit(idx) {
        setFormRow({ ...entries[idx] })
        setEditIdx(idx)
        setShowForm(true)
    }

    function handleSaveEdit() {
        if (editIdx !== null) {
            onAddEntry(doc.id, formRow, editIdx)
            setFormRow({})
            setEditIdx(null)
            setShowForm(false)
        }
    }

    const count = entries.length

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">{doc.icon}</span>
                        <div>
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                {doc.name}
                                {doc.required && <span className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">REQUIRED</span>}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-xl">{doc.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500">{count} {count === 1 ? 'entry' : 'entries'}</span>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="border-t border-slate-100 p-4">
                    {count > 0 && (
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {doc.columns.map(col => (
                                            <th key={col} className="text-left px-3 py-2 text-xs font-semibold text-slate-600">{col}</th>
                                        ))}
                                        <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {entries.map((entry, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            {doc.columns.map(col => (
                                                <td key={col} className="px-3 py-2 text-xs text-slate-700 max-w-[200px] truncate" title={entry[col] || ''}>{entry[col] || '—'}</td>
                                            ))}
                                            <td className="px-3 py-2 text-right">
                                                <button onClick={(e) => { e.stopPropagation(); handleEdit(i) }} className="text-primary-600 hover:text-primary-800 text-xs font-medium">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {showForm ? (
                        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                            <p className="text-xs font-semibold text-slate-700">{editIdx !== null ? 'Edit Entry' : 'Add New Entry'}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {doc.columns.map(col => (
                                    <div key={col}>
                                        <label className="block text-xs text-slate-600 mb-1">{col}</label>
                                        <input value={formRow[col] || ''} onChange={e => setFormRow(f => ({ ...f, [col]: e.target.value }))}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs" placeholder={col} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={editIdx !== null ? handleSaveEdit : handleAdd}
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700">
                                    {editIdx !== null ? 'Save' : 'Add'}
                                </button>
                                <button onClick={() => { setShowForm(false); setEditIdx(null); setFormRow({}) }}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); onGenerate(doc) }} disabled={generating}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700 disabled:opacity-50">
                                {generating ? 'Generating…' : '✨ Generate'}
                            </button>
                            <button onClick={() => { setFormRow({}); setEditIdx(null); setShowForm(true) }}
                                className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded hover:bg-primary-100">
                                + Add Manually
                            </button>
                            {count > 0 && (
                                <button onClick={() => onExport(doc)}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">
                                    Export CSV
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function DocumentCentre() {
    const { orgProfile } = useAppContext()
    const [allEntries, setAllEntries] = useState({})
    const [generatingDoc, setGeneratingDoc] = useState(null)

    const framework = orgProfile?.compliance_framework || 'ISO_27001'
    const fwLabel = framework === 'ISO_42001' ? 'ISO 42001' : 'ISO 27001'
    const orgName = orgProfile?.organization_name || 'Your Organisation'

    function addEntry(docId, row, editIdx) {
        setAllEntries(prev => {
            const existing = [...(prev[docId] || [])]
            if (editIdx !== null && editIdx !== undefined) {
                existing[editIdx] = row
            } else {
                existing.push(row)
            }
            return { ...prev, [docId]: existing }
        })
    }

    async function generateDoc(doc) {
        if (!orgProfile) { alert('Please complete onboarding first.'); return }
        setGeneratingDoc(doc.id)
        try {
            const data = await complianceAPI.generateRegister({
                register_type: doc.apiKey,
                framework,
                organization_name: orgName,
                industry: orgProfile.industry || 'Technology',
                current_practices: orgProfile.current_practices_summary || orgProfile.current_practices || '',
            })
            const entries = Array.isArray(data.entries) ? data.entries : []
            setAllEntries(prev => ({
                ...prev,
                [doc.id]: [...(prev[doc.id] || []), ...entries],
            }))
        } catch (err) {
            alert('Failed to generate: ' + err.message)
        } finally {
            setGeneratingDoc(null)
        }
    }

    function exportDoc(doc) {
        const entries = allEntries[doc.id] || []
        const csv = [doc.columns, ...entries.map(e => doc.columns.map(c => e[c] || ''))]
            .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${doc.id}_${orgName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
    }

    const totalDocs = DOCUMENT_TYPES.length
    const docsWithEntries = Object.keys(allEntries).filter(k => allEntries[k]?.length > 0).length
    const requiredDocs = DOCUMENT_TYPES.filter(d => d.required).length
    const requiredCompleted = DOCUMENT_TYPES.filter(d => d.required && (allEntries[d.id]?.length || 0) > 0).length

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Document Centre</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {fwLabel} compliance requires maintaining operational registers and records beyond policies.
                    Click <strong>✨ Generate</strong> on each document to auto-populate, then edit as needed.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    Why you need these documents
                </h3>
                <p className="text-xs text-blue-700 mt-2">
                    Auditors will ask for evidence of <strong>operational processes</strong>, not just policies.
                    These registers prove your organisation is actively managing incidents, suppliers, training, and internal audits.
                    Documents marked <span className="bg-red-50 text-red-600 px-1 rounded text-[10px] font-bold">REQUIRED</span> are
                    mandatory for certification. Use <strong>✨ Generate</strong> to create realistic starting entries, then customise them.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Documents', value: `${docsWithEntries} / ${totalDocs}` },
                    { label: 'Required Done', value: `${requiredCompleted} / ${requiredDocs}` },
                    { label: 'Total Entries', value: Object.values(allEntries).flat().length },
                    { label: 'Completion', value: `${totalDocs > 0 ? Math.round((docsWithEntries / totalDocs) * 100) : 0}%` },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 uppercase">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {DOCUMENT_TYPES.map(doc => (
                    <DocumentCard
                        key={doc.id}
                        doc={doc}
                        entries={allEntries[doc.id] || []}
                        onAddEntry={addEntry}
                        onExport={exportDoc}
                        onGenerate={generateDoc}
                        generating={generatingDoc === doc.id}
                    />
                ))}
            </div>
        </div>
    )
}
