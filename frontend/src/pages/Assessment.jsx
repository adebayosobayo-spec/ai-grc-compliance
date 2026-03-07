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
      if (err.isRateLimited) {
        setError(`Too many requests. Please wait ${err.retryAfter || 60} seconds before trying again.`)
        return
      }
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase mb-2 font-mono">Mission Control / Audit</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Control Assessment</h2>
          <p className="text-sm text-slate-500 mt-1 font-mono uppercase tracking-tight">AI-assisted implementation audit for {framework.replace('_', ' ')} controls.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 font-medium flex items-center gap-3 animate-in slide-in-from-top-2">
          <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">✕</span>
          {error}
        </div>
      )}

      {/* Assessment Console */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 font-mono">Assessment Parameters</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Organisation</label>
              <input type="text" required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-mono"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Control ID</label>
              <div className="relative">
                <input type="text" required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-mono tracking-tight"
                  value={formData.control_id}
                  placeholder={framework === 'ISO_27001' ? 'e.g. A.5.1' : 'e.g. AI.1.1'}
                  onChange={(e) => setFormData({ ...formData, control_id: e.target.value })} />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 font-mono">REF_ID</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Implementation Evidence / Notes</label>
            <textarea rows={6}
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none leading-relaxed"
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              placeholder="Provide evidence of your current implementation, existing policies, or procedural notes..." />
            <p className="text-[10px] text-slate-400 font-medium px-2">Detailed evidence results in higher precision AI assessments.</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading}
              className="w-full sm:w-auto sm:min-w-[240px] px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Auditing Implementation...
                </span>
              ) : '🔍 Run AI Assessment'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Assessment Heading Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm group">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 font-mono tracking-widest">
                    {result.result.control_id}
                  </span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${getComplianceStyle(result.result.compliance_level)}`}>
                    {result.result.compliance_level.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase group-hover:text-blue-600 transition-colors">
                  {result.result.control_name}
                </h3>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-4xl">
                  {result.result.control_description}
                </p>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-6 text-white border border-white/10 min-w-[200px] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 font-mono">Assessed Score</p>
                <p className="text-5xl font-black tracking-tighter">{result.result.score}%</p>
                <div className="w-full bg-white/10 rounded-full h-1 mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${result.result.score}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 font-mono">Critical Findings</h4>
            <div className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 border border-slate-100 p-6 rounded-3xl italic">
              <MarkdownContent content={result.result.findings} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6 font-mono">Implementation Strengths</h4>
              <div className="space-y-3">
                {result.result.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl transition-all hover:bg-emerald-50">
                    <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-[10px] font-bold">✓</div>
                    <span className="text-xs font-bold text-emerald-900/80">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 font-mono">Gaps & Weaknesses</h4>
              <div className="space-y-3">
                {result.result.weaknesses.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-red-50/50 border border-red-100/50 rounded-2xl transition-all hover:bg-red-50">
                    <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-red-500 text-white text-xs">!</div>
                    <span className="text-xs font-bold text-red-900/80">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 text-white border border-white/10">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-8 font-mono tracking-widest">Remediation Recommendations</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {result.result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/5 p-5 rounded-3xl hover:bg-white/10 transition-all border border-white/10">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 text-xs font-black font-mono">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-slate-300 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Assessment
