import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { generatePolicyPDF } from '../utils/generatePolicyPDF'
import { MarkdownContent as SectionContent } from '../utils/MarkdownContent'
import { FileText, Download, Lock, Zap, ShieldCheck, ArrowRight } from 'lucide-react'

export default function PolicyGenerator() {
  const { orgProfile, user } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [result, setResult] = useState(null)
  const [genError, setGenError] = useState('')
  const resultRef = useRef(null)
  const timerRef = useRef(null)

  const [formData, setFormData] = useState({
    organization_name: '',
    industry: '',
    policy_type: '',
    context: '',
  })

  useEffect(() => {
    if (orgProfile) {
      setFormData((f) => ({
        ...f,
        organization_name: orgProfile.organization_name,
        industry: orgProfile.industry,
      }))
    }
  }, [orgProfile])

  useEffect(() => {
    if (loading) {
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [loading])

  const framework = orgProfile?.compliance_framework || 'ISO_42001'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    setGenError('')
    setLoading(true)
    try {
      const response = await complianceAPI.generatePolicy({ framework, ...formData })
      setResult(response)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (error) {
      setGenError('Policy generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isPremium = false // Simulated for MVP

  return (
    <div className="py-8 px-6 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">
          Generator
        </div>
        <h1 className="text-4xl font-black text-white font-heading uppercase tracking-tight">Policy Generator</h1>
        <p className="text-slate-400 mt-2">
          Create audit-ready policies for {framework.replace('_', ' ')} in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-dark p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Policy Type</label>
                <select required className="input-dark appearance-none" value={formData.policy_type}
                  onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}>
                  <option value="">Select a policy...</option>
                  <option value="AI Governance Policy">AI Governance Policy</option>
                  <option value="AI Ethics Policy">AI Ethics Policy</option>
                  <option value="AI Data Management Policy">AI Data Management Policy</option>
                  <option value="AI Model Development Policy">AI Model Development Policy</option>
                  <option value="AI Transparency Policy">AI Transparency Policy</option>
                  <option value="AI Risk Management Policy">AI Risk Management Policy</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Context / Specifics</label>
                <textarea rows={4} className="input-dark" value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="e.g. We use Azure OpenAI exclusively..." />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-30">
                {loading ? 'Drafting...' : 'Generate Policy'}
              </button>
            </form>
          </div>

          {!isPremium && (
            <div className="card-dark p-6 bg-amber-500 shadow-xl shadow-amber-500/20 border-none">
              <div className="flex items-center gap-2 text-slate-950 font-black text-[10px] uppercase tracking-widest mb-4">
                <Zap size={14} /> Premium Feature
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-4 font-heading">Unlock Unlimited Policies</h3>
              <p className="text-slate-900 text-sm font-medium mb-6 leading-relaxed">
                Free tier only allows viewing drafts. Upgrade for $299 to download audit-ready Word and PDF versions.
              </p>
              <Link to="/checkout" className="w-full py-3 bg-slate-950 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                Upgrade Now <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* Result Column */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="card-dark p-20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6" />
              <p className="text-white font-bold mb-2">AI is drafting your policy...</p>
              <p className="text-slate-500 text-xs font-mono">{elapsed}s elapsed</p>
            </div>
          ) : result ? (
            <div ref={resultRef} className="card-dark p-10 relative overflow-hidden">
              {!isPremium && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-10 text-center">
                  <Lock size={48} className="text-amber-500 mb-6" />
                  <h3 className="text-2xl font-black text-white mb-4 font-heading">Document Locked</h3>
                  <p className="text-slate-400 mb-8 max-w-sm">
                    Your custom policy is ready. Purchase the Policy Generator pack to unlock full access and downloads.
                  </p>
                  <Link to="/checkout" className="btn-primary">Unlock Now ($299)</Link>
                </div>
              )}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white font-heading uppercase">{result.policy.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">Version {result.policy.version} • {result.policy.effective_date}</p>
                </div>
                {isPremium && (
                  <button onClick={() => generatePolicyPDF(result, formData.organization_name, framework)} className="btn-secondary py-2 text-xs">
                    <Download size={14} /> Export PDF
                  </button>
                )}
              </div>
              <div className="space-y-10">
                {result.policy.sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest font-heading flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-[10px] text-amber-500">{section.section_number}</span>
                      {section.section_title}
                    </h4>
                    <div className="text-slate-400 text-sm leading-relaxed prose prose-invert max-w-none">
                      <SectionContent content={section.content} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card-dark p-20 flex flex-col items-center justify-center text-center border-dashed border-white/10">
              <FileText size={48} className="text-slate-700 mb-6" />
              <p className="text-slate-500 font-medium">Select a policy type and click generate to start.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

