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
      if (err.isRateLimited) {
        setError(`Too many requests. Please wait ${err.retryAfter || 60} seconds before trying again.`)
        return
      }
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase mb-2 font-mono">Mission Control / Remediation</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Remediation Roadmap</h2>
          <p className="text-sm text-slate-500 mt-1 font-mono uppercase tracking-tight">AI-generated action plan for {framework.replace('_', ' ')} gap closure.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 font-medium flex items-center gap-3 animate-in slide-in-from-top-2">
          <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">✕</span>
          {error}
        </div>
      )}

      {/* Configuration Console */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 font-mono">Plan Configuration</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Organisation</label>
              <input type="text" required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Timeline</label>
              <input type="text"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={formData.timeline}
                placeholder="e.g. 6 Months"
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identified Gaps</label>
            <div className="space-y-3">
              {formData.gaps.map((gap, index) => (
                <div key={index} className="group flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none pr-12"
                      value={gap}
                      placeholder="Enter gap description..."
                      onChange={(e) => updateGap(index, e.target.value)} />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 font-mono">GAP_{index + 1}</span>
                  </div>
                  {formData.gaps.length > 1 && (
                    <button type="button" onClick={() => removeGap(index)}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addGap}
              className="px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200/50">
              + Append New Gap
            </button>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Impact Priority</label>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                {['low', 'medium', 'high', 'critical'].map(p => (
                  <button key={p} type="button" onClick={() => setFormData({ ...formData, priority: p })}
                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.priority === p ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full sm:w-auto sm:min-w-[240px] px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 mt-6 sm:mt-auto">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Synthesizing Roadmap...
                </span>
              ) : '✨ Generate Roadmap'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Summary Grid */}
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 font-mono">Action Units</p>
              <p className="text-4xl font-black tracking-tight">{result.total_actions}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">Impact Layer</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${result.priority === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`} />
                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{result.priority}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:col-span-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">Estimated Velocity</p>
              <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{result.estimated_completion}</p>
            </div>
          </div>

          {/* Action Units */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Remediation Workstream</h3>
            <div className="space-y-4">
              {result.actions.map((action, idx) => {
                const priorityStyles = {
                  critical: 'border-red-500/20 bg-red-50/10 text-red-700',
                  high: 'border-orange-500/20 bg-orange-50/10 text-orange-700',
                  medium: 'border-blue-500/20 bg-blue-50/10 text-blue-700',
                  low: 'border-emerald-500/20 bg-emerald-50/10 text-emerald-700',
                }
                const ps = priorityStyles[action.priority] || priorityStyles.medium
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">
                            {action.action_id}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${ps}`}>
                            {action.priority}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-blue-600 transition-colors uppercase">
                          {action.title}
                        </h4>
                        <div className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-6">
                          <MarkdownContent content={action.description} />
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                          {[
                            { l: 'Ownership', v: action.responsible_party, i: '👤' },
                            { l: 'Timeline', v: action.timeline, i: '📅' },
                            { l: 'Effort', v: action.estimated_effort, i: '⚡' },
                            { l: 'Success Criteria', v: action.success_criteria, i: '🎯' },
                          ].map(item => (
                            <div key={item.l}>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono italic">{item.l}</p>
                              <p className="text-xs font-bold text-slate-800">{item.v}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:w-64 space-y-4">
                        {action.dependencies.length > 0 && (
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">Blocked By</p>
                            <div className="flex flex-wrap gap-2">
                              {action.dependencies.map(d => (
                                <span key={d} className="text-[9px] font-black text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg uppercase">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {action.resources_required.length > 0 && (
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">Resource Units</p>
                            <div className="space-y-1.5">
                              {action.resources_required.map(r => (
                                <div key={r} className="flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{r}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {result.milestones.length > 0 && (
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white border border-white/10">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-8 font-mono">Execution Milestones</h3>
              <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                {result.milestones.map((m, i) => (
                  <div key={i} className="relative pl-10 group">
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-lg bg-blue-600 border-4 border-slate-900 group-hover:scale-125 transition-transform" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 mb-2">
                      <h4 className="text-lg font-black uppercase tracking-tight text-white">{m.milestone}</h4>
                      <span className="text-[10px] font-black font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 self-start">
                        {m.target_date}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {m.deliverables.map((d, di) => (
                        <div key={di} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl">
                          <div className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-500/20 text-blue-400 text-xs font-bold">✓</div>
                          <span className="text-xs text-slate-300 font-medium">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.budget_estimate && (
            <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 font-mono">Budgetary Assessment</p>
              <div className="text-sm text-amber-900 leading-relaxed font-medium">
                <MarkdownContent content={result.budget_estimate} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionPlan
