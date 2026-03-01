import React, { useState, useEffect } from 'react'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { MarkdownContent } from '../utils/MarkdownContent'

const inputCls = 'mt-1 block w-full bg-white border border-gray-300 text-slate-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400'

function ActionPlan() {
  const { orgProfile } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    organization_name: '',
    gaps: [''],
    priority: 'high',
    timeline: '',
  })

  useEffect(() => {
    if (orgProfile) {
      setFormData((f) => ({
        ...f,
        organization_name: orgProfile.organization_name,
        timeline: orgProfile.compliance_timeline || '',
      }))
    }
  }, [orgProfile])

  const addGap = () => setFormData({ ...formData, gaps: [...formData.gaps, ''] })
  const removeGap = (index) => setFormData({ ...formData, gaps: formData.gaps.filter((_, i) => i !== index) })
  const updateGap = (index, value) => {
    const newGaps = [...formData.gaps]
    newGaps[index] = value
    setFormData({ ...formData, gaps: newGaps })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const filteredGaps = formData.gaps.filter(gap => gap.trim() !== '')
    if (filteredGaps.length === 0) { setError('Please add at least one gap.'); return }
    setError(null)
    setLoading(true)
    try {
      const response = await complianceAPI.generateActionPlan({ framework, ...formData, gaps: filteredGaps })
      setResult(response)
    } catch (err) {
      console.error('Action plan generation failed:', err)
      setError('Failed to generate action plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityCardStyle = (priority) => {
    const s = {
      critical: 'border border-red-200 bg-red-50',
      high: 'border border-orange-200 bg-orange-50',
      medium: 'border border-yellow-200 bg-yellow-50',
      low: 'border border-green-200 bg-green-50',
    }
    return s[priority] || 'border border-gray-200 bg-gray-50'
  }

  const getPriorityBadge = (priority) => {
    const s = {
      critical: 'bg-red-50 text-red-700 border border-red-200',
      high: 'bg-orange-50 text-orange-700 border border-orange-200',
      medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      low: 'bg-green-50 text-green-700 border border-green-200',
    }
    return s[priority] || 'bg-gray-100 text-slate-600 border border-gray-200'
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Remediation</p>
        <h2 className="text-3xl font-black text-slate-900">Action Plan Generator</h2>
        <p className="mt-1 text-slate-600">
          Generate remediation plans for {framework === 'ISO_27001' ? 'ISO 27001' : 'ISO 42001'}
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Identified Gaps</label>
            {formData.gaps.map((gap, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input type="text" className={`${inputCls} !mt-0`} value={gap}
                  onChange={(e) => updateGap(index, e.target.value)}
                  placeholder="Describe the compliance gap..." />
                {formData.gaps.length > 1 && (
                  <button type="button" onClick={() => removeGap(index)}
                    className="px-3 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 text-sm transition-colors">
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addGap}
              className="mt-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              + Add Gap
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority Level</label>
            <select className={inputCls} value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Desired Timeline (Optional)</label>
            <input type="text" className={inputCls} value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              placeholder="e.g., 3 months, 6 months, 1 year" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-bold tracking-wide disabled:opacity-40 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            {loading ? 'Generating Plan...' : 'Generate Action Plan'}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-4">Plan Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wide">Total Actions</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{result.total_actions}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wide">Priority</p>
                <p className="text-xl font-black capitalize mt-1 text-blue-600">{result.priority}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wide">Est. Completion</p>
                <p className="text-base font-bold text-slate-900 mt-1">{result.estimated_completion}</p>
              </div>
            </div>
            {result.budget_estimate && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wide mb-1">Budget Estimate</p>
                <MarkdownContent content={result.budget_estimate} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-4">Action Items</h3>
            <div className="space-y-4">
              {result.actions.map((action, index) => (
                <div key={index} className={`rounded-lg p-5 ${getPriorityCardStyle(action.priority)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs text-slate-500">{action.action_id}</span>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded font-mono ${getPriorityBadge(action.priority)}`}>
                          {action.priority.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{action.title}</h4>
                    </div>
                  </div>
                  <div className="mb-4"><MarkdownContent content={action.description} /></div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    {[
                      ['Responsible Party', action.responsible_party],
                      ['Timeline', action.timeline],
                      ['Estimated Effort', action.estimated_effort],
                      ['Success Criteria', action.success_criteria],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="font-mono text-xs text-slate-500 uppercase tracking-wide">{label}</p>
                        <p className="text-slate-600 text-sm mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  {action.dependencies.length > 0 && (
                    <div className="mb-3">
                      <p className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Dependencies</p>
                      <div className="flex flex-wrap gap-2">
                        {action.dependencies.map((dep, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-slate-600">{dep}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {action.resources_required.length > 0 && (
                    <div>
                      <p className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Resources Required</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 space-y-0.5">
                        {action.resources_required.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {result.milestones.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-4">Milestones</h3>
              <div className="space-y-4">
                {result.milestones.map((milestone, index) => (
                  <div key={index} className="border-l-2 border-blue-600 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{milestone.milestone}</h4>
                      <span className="text-xs text-slate-500 font-mono">{milestone.target_date}</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-600">
                      {milestone.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionPlan
