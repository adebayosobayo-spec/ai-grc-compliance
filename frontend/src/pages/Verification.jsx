import React, { useState } from 'react'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'

const inputCls = 'mt-1 block w-full bg-white border border-gray-300 text-slate-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400'

function CheckRow({ check }) {
  const isStructural = check.type === 'structural'
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${
      check.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex-shrink-0 mt-0.5">
        {check.passed ? (
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className={`text-sm font-semibold ${check.passed ? 'text-green-700' : 'text-red-700'}`}>
            {check.check_name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
            isStructural ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
          }`}>
            {isStructural ? 'Structural' : 'Semantic'}
          </span>
        </div>
        <p className="text-xs text-slate-500">{check.details}</p>
      </div>
    </div>
  )
}

export default function Verification() {
  const { orgProfile } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    framework: orgProfile?.compliance_framework || 'ISO_27001',
    organization_name: orgProfile?.organization_name || '',
    policy_type: '',
    policy_content: '',
  })

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.policy_content.trim()) { setError('Please paste your policy content.'); return }
    setError(null)
    setLoading(true)
    try {
      const res = await complianceAPI.verifyDocument(formData)
      setResult(res)
    } catch (err) {
      setError('Verification failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const structuralChecks = result?.checks?.filter((c) => c.type === 'structural') || []
  const semanticChecks = result?.checks?.filter((c) => c.type === 'semantic') || []

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Quality Control</p>
        <h2 className="text-3xl font-black text-slate-900">Document Verification</h2>
        <p className="mt-1 text-slate-600">
          Two-layer verification: structural formatting checks + semantic ISO control coverage.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-500 flex-shrink-0">✕</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Framework <span className="text-red-500">*</span></label>
              <select name="framework" value={formData.framework} onChange={handleChange} className={inputCls}>
                <option value="ISO_27001">ISO 27001</option>
                <option value="ISO_42001">ISO 42001</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Name <span className="text-red-500">*</span></label>
              <input name="organization_name" value={formData.organization_name} onChange={handleChange}
                required className={inputCls} placeholder="Your organisation" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Policy Type <span className="text-red-500">*</span></label>
              <input name="policy_type" value={formData.policy_type} onChange={handleChange}
                required className={inputCls} placeholder="e.g. Information Security Policy" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Policy Content (Markdown) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 font-mono mb-2">Paste the full Markdown content of the generated policy document.</p>
            <textarea name="policy_content" value={formData.policy_content} onChange={handleChange}
              rows={14} required className={`${inputCls} font-mono`}
              placeholder={"## 1. Purpose\n\nThis policy establishes...\n\n## 2. Scope\n..."} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-bold tracking-wide disabled:opacity-40 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            {loading ? 'Verifying...' : 'Run Verification'}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 border-2 ${result.overall_passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className={`text-2xl font-black ${result.overall_passed ? 'text-green-700' : 'text-red-700'}`}>
                  {result.overall_passed ? '✓ VERIFICATION PASSED' : '✗ VERIFICATION FAILED'}
                </h3>
                <p className={`mt-1 text-sm ${result.overall_passed ? 'text-green-600' : 'text-red-600'}`}>{result.summary}</p>
              </div>
              <div className="text-center">
                <div className={`text-5xl font-black ${result.overall_passed ? 'text-green-700' : 'text-red-700'}`}>{result.score}%</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{result.passed_checks}/{result.total_checks} checks passed</div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded h-2">
              <div className={`h-2 rounded transition-all ${result.overall_passed ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${result.score}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[['Total Checks', result.total_checks, 'text-slate-900'], ['Passed', result.passed_checks, 'text-green-600'], ['Failed', result.failed_checks, 'text-red-600']].map(([label, value, color]) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
                <p className={`text-3xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wide mt-1">{label}</p>
              </div>
            ))}
          </div>

          {structuralChecks.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h4 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-1">Structural Checks</h4>
              <p className="text-xs text-slate-500 mb-4">{structuralChecks.filter((c) => c.passed).length}/{structuralChecks.length} passed — deterministic Tanensity formatting checks.</p>
              <div className="space-y-2">{structuralChecks.map((check) => <CheckRow key={check.check_id} check={check} />)}</div>
            </div>
          )}

          {semanticChecks.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h4 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-1">Semantic Checks</h4>
              <p className="text-xs text-slate-500 mb-4">{semanticChecks.filter((c) => c.passed).length}/{semanticChecks.length} passed — AI-powered ISO control objective coverage checks.</p>
              <div className="space-y-2">{semanticChecks.map((check) => <CheckRow key={check.check_id} check={check} />)}</div>
            </div>
          )}

          {result.failed_checks > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <h4 className="font-bold text-yellow-700 font-mono text-xs uppercase tracking-widest mb-3">Remediation Required</h4>
              <ul className="space-y-2">
                {result.checks.filter((c) => !c.passed).map((c) => (
                  <li key={c.check_id} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0 mt-0.5">→</span>
                    <span><strong className="text-slate-900">{c.check_name}:</strong> {c.details}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
