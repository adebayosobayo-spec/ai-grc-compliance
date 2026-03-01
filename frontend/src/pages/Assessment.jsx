import React, { useState, useEffect } from 'react'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { MarkdownContent } from '../utils/MarkdownContent'

const inputCls = 'mt-1 block w-full bg-white border border-gray-300 text-slate-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400'

function Assessment() {
  const { orgProfile } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    organization_name: '',
    control_id: '',
    evidence: '',
  })

  useEffect(() => {
    if (orgProfile) {
      setFormData((f) => ({ ...f, organization_name: orgProfile.organization_name }))
    }
  }, [orgProfile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await complianceAPI.performAssessment({ framework, ...formData })
      setResult(response)
    } catch (err) {
      console.error('Assessment failed:', err)
      setError('Assessment failed. Please check the control ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  const getComplianceStyle = (level) => {
    const styles = {
      fully_compliant: 'bg-green-50 text-green-700 border border-green-200',
      largely_compliant: 'bg-blue-50 text-blue-700 border border-blue-200',
      partially_compliant: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      non_compliant: 'bg-red-50 text-red-700 border border-red-200',
    }
    return styles[level] || 'bg-gray-100 text-slate-600 border border-gray-200'
  }

  const getBarColor = (level) => {
    const colors = {
      fully_compliant: '#22c55e',
      largely_compliant: '#3b82f6',
      partially_compliant: '#eab308',
      non_compliant: '#ef4444',
    }
    return colors[level] || '#2563eb'
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Audit</p>
        <h2 className="text-3xl font-black text-slate-900">Compliance Assessment</h2>
        <p className="mt-1 text-slate-600">
          Assess control implementation for {framework === 'ISO_27001' ? 'ISO 27001' : 'ISO 42001'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-500 flex-shrink-0">✕</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
            <input type="text" required className={inputCls} value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Control ID</label>
            <input type="text" required className={inputCls} value={formData.control_id}
              onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
              placeholder={framework === 'ISO_27001' ? 'e.g., A.5.1, A.8.1' : 'e.g., AI.1.1, AI.3.2'} />
            <p className="mt-1 text-xs text-slate-500 font-mono">
              {framework === 'ISO_27001'
                ? 'ISO 27001 control ID — e.g., A.5.1 for "Policies for information security"'
                : 'ISO 42001 control ID — e.g., AI.1.1 for "AI Policy"'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Evidence / Documentation (Optional)</label>
            <textarea rows={6} className={inputCls} value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              placeholder="Provide evidence of your current implementation, existing policies, procedures, or controls..." />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-bold tracking-wide disabled:opacity-40 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            {loading ? 'Assessing...' : 'Perform Assessment'}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  <span className="font-mono text-blue-600 mr-2">{result.result.control_id}</span>
                  {result.result.control_name}
                </h3>
                <p className="mt-2 text-slate-600 text-sm">{result.result.control_description}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded font-mono ${getComplianceStyle(result.result.compliance_level)}`}>
                {result.result.compliance_level.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wide">Compliance Score</span>
                <span className="text-2xl font-black text-blue-600">{result.result.score}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2">
                <div className="h-2 rounded transition-all"
                  style={{ width: `${result.result.score}%`, background: getBarColor(result.result.compliance_level) }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h4 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-3">Findings</h4>
            <MarkdownContent content={result.result.findings} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h4 className="text-xs font-mono text-green-600 uppercase tracking-widest mb-4">Strengths</h4>
              <ul className="space-y-2">
                {result.result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-600 text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h4 className="text-xs font-mono text-red-500 uppercase tracking-widest mb-4">Weaknesses</h4>
              <ul className="space-y-2">
                {result.result.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-600 text-sm">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h4 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-4">Recommendations</h4>
            <ul className="space-y-3">
              {result.result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded bg-gray-100 border border-blue-200 text-blue-600 text-xs font-bold font-mono mr-3">
                    {index + 1}
                  </span>
                  <span className="text-slate-600 text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Assessment
