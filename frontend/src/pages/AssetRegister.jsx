import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const ASSET_TYPES = ['Hardware', 'Software', 'Data', 'People', 'Service', 'Facility', 'Network']
const CLASSIFICATIONS = ['Public', 'Internal', 'Confidential', 'Restricted']
const CRITICALITY = ['Low', 'Medium', 'High', 'Critical']

const EMPTY_ASSET = {
    name: '',
    type: 'Software',
    owner: '',
    department: '',
    classification: 'Internal',
    location: '',
    criticality: 'Medium',
    description: '',
}

export default function AssetRegister() {
    const { orgProfile } = useAppContext()
    const [assets, setAssets] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editIdx, setEditIdx] = useState(null)
    const [form, setForm] = useState({ ...EMPTY_ASSET })

    const orgName = orgProfile?.organization_name || 'Your Organisation'

    function handleSave() {
        if (!form.name.trim()) return
        if (editIdx !== null) {
            setAssets(prev => prev.map((a, i) => i === editIdx ? { ...form } : a))
        } else {
            setAssets(prev => [...prev, { ...form }])
        }
        setForm({ ...EMPTY_ASSET })
        setShowForm(false)
        setEditIdx(null)
    }

    function handleEdit(idx) {
        setForm({ ...assets[idx] })
        setEditIdx(idx)
        setShowForm(true)
    }

    function handleDelete(idx) {
        if (confirm('Delete this asset?')) {
            setAssets(prev => prev.filter((_, i) => i !== idx))
        }
    }

    function exportCSV() {
        const headers = ['Asset ID', 'Name', 'Type', 'Owner', 'Department', 'Classification', 'Location', 'Criticality', 'Description']
        const rows = assets.map((a, i) => [
            `AST-${String(i + 1).padStart(3, '0')}`, a.name, a.type, a.owner, a.department, a.classification, a.location, a.criticality, a.description
        ])
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `AssetRegister_${orgName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
    }

    const classColors = {
        Public: 'bg-green-50 text-green-700',
        Internal: 'bg-blue-50 text-blue-700',
        Confidential: 'bg-orange-50 text-orange-700',
        Restricted: 'bg-red-50 text-red-700',
    }
    const critColors = {
        Low: 'bg-green-50 text-green-700',
        Medium: 'bg-yellow-50 text-yellow-700',
        High: 'bg-orange-50 text-orange-700',
        Critical: 'bg-red-50 text-red-700',
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Asset Register</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        ISO 27001 Annex A.5.9 requires an <strong>inventory of information and associated assets</strong> with designated owners.
                        Document every asset that stores, processes, or transmits information.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportCSV} disabled={assets.length === 0}
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    What goes in an Asset Register?
                </h3>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li><strong>Hardware</strong> — Servers, laptops, mobile devices, network equipment</li>
                    <li><strong>Software</strong> — Applications, databases, operating systems, SaaS platforms</li>
                    <li><strong>Data</strong> — Customer data, financial records, intellectual property, HR records</li>
                    <li><strong>People</strong> — Key personnel with access to sensitive systems</li>
                    <li><strong>Services</strong> — Cloud services (AWS, Azure), third-party APIs, managed services</li>
                    <li><strong>Classify each asset</strong> — Public, Internal, Confidential, or Restricted</li>
                    <li><strong>Assign owners</strong> — Every asset must have a named individual responsible for it</li>
                </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Assets', value: assets.length },
                    { label: 'Confidential+', value: assets.filter(a => a.classification === 'Confidential' || a.classification === 'Restricted').length },
                    { label: 'Critical', value: assets.filter(a => a.criticality === 'Critical').length },
                    { label: 'No Owner', value: assets.filter(a => !a.owner.trim()).length },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 uppercase">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Add Asset Button */}
            <button onClick={() => { setForm({ ...EMPTY_ASSET }); setEditIdx(null); setShowForm(true) }}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
                + Add Asset
            </button>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{editIdx !== null ? 'Edit Asset' : 'Add New Asset'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name *</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Production Database, AWS S3 Bucket" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Classification</label>
                                    <select value={form.classification} onChange={e => setForm(f => ({ ...f, classification: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                                    <input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. CTO, IT Manager" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Engineering, Finance" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. AWS eu-west-1, HQ Office" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Criticality</label>
                                    <select value={form.criticality} onChange={e => setForm(f => ({ ...f, criticality: e.target.value }))}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                        {CRITICALITY.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="What does this asset contain or do?" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowForm(false); setEditIdx(null) }}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
                                {editIdx !== null ? 'Update' : 'Add Asset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Asset Table */}
            {assets.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">ID</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Classification</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Criticality</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Owner</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Location</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {assets.map((a, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">AST-{String(i + 1).padStart(3, '0')}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{a.type}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${classColors[a.classification] || ''}`}>{a.classification}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${critColors[a.criticality] || ''}`}>{a.criticality}</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{a.owner || '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{a.location || '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleEdit(i)} className="text-primary-600 hover:text-primary-800 text-xs font-medium mr-2">Edit</button>
                                            <button onClick={() => handleDelete(i)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <div className="text-4xl mb-3">🏢</div>
                    <h3 className="text-lg font-semibold text-slate-800">No assets documented yet</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                        Add your organisation's information assets — servers, databases, cloud services, data stores, and key personnel.
                        Every asset must have an owner and a classification.
                    </p>
                </div>
            )}
        </div>
    )
}
