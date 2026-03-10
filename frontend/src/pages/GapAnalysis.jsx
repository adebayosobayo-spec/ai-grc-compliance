import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { generateGapPDF } from '../utils/generateGapPDF'

const inputCls = 'mt-1 block w-full bg-white border border-gray-300 text-slate-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400'

const LOADING_MESSAGES = [
  'Reviewing your current practices...',
  'Mapping controls against framework...',
  'Identifying compliance gaps...',
  'Calculating risk levels...',
  'Generating recommendations...',
]

const EXAMPLES = {
  cloud: `We are a cloud-native SaaS running on AWS. 
- Infrastructure: Primarily using managed services (Lambda, RDS, S3).
- Access Control: IAM for cloud resources, Google Workspace with 2FA for staff.
- Encryption: SSL/TLS for all traffic, AES-256 for data at rest.
- Development: GitHub for code, CI/CD with automated vulnerability scanning.
- Policies: Internal documentation on onboarding/offboarding.`,
  enterprise: `Traditional enterprise with hybrid cloud infrastructure.
- Infrastructure: VMware virtualization, Managed Windows Server.
- Access Control: Active Directory for identity, mandatory VPN for remote access.
- Encryption: Internal backups encrypted, full disk encryption (BitLocker) on all laptops.
- Policies: Formal information security policies covering HR and Physical security.`,
  fintech: `Regulated Fintech application.
- Data: PII and financial records in encrypted PostgreSQL.
- Access Control: RBAC across all systems, mandatory quarterly access reviews.
- Audit: Full logging of all admin actions (CloudTrail, application logs).
- Policies: Comprehensive library including Incident Response and Data Protection.`
}

function LoadingPanel({ elapsed }) {
  const msgIndex = Math.min(Math.floor(elapsed / 8), LOADING_MESSAGES.length - 1)
  const progress = Math.min((elapsed / 45) * 95, 95)

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-600 mb-3"
          style={{ animation: 'spin 1.4s linear infinite', borderTopColor: 'transparent' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <p className="text-slate-900 font-bold text-sm">Running Gap Analysis</p>
        <p className="text-slate-600 text-xs mt-1 font-mono">{LOADING_MESSAGES[msgIndex]}</p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
        <div className="h-1.5 rounded-full transition-all duration-1000 bg-blue-600"
          style={{ width: `${progress}%` }} />
      </div>
      <p className="text-slate-500 text-xs font-mono">
        {elapsed}s elapsed &mdash; typically completes in 20&ndash;45 seconds
      </p>
    </div>
  )
}

function GapAnalysis() {
  const { orgProfile, setLastGapResult } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const resultRef = useRef(null)
  const timerRef = useRef(null)
  const [formData, setFormData] = useState({
    organization_name: '',
    industry: '',
    current_practices: '',
  })

  useEffect(() => {
    if (orgProfile) {
      setFormData({
        organization_name: orgProfile.organization_name,
        industry: orgProfile.industry,
        current_practices: orgProfile.current_practices_summary,
      })
    }
  }, [orgProfile])

  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const FW_LABELS = { ISO_27001: 'ISO 27001', ISO_42001: 'ISO 42001', NDPR: 'NDPR', GDPR: 'GDPR', UK_GDPR: 'UK GDPR', POPIA: 'POPIA', LGPD: 'LGPD', CCPA: 'CCPA/CPRA', PDPA: 'PDPA' }
  const frameworkLabel = FW_LABELS[framework] || framework

  // Tick elapsed timer while loading
  useEffect(() => {
    if (loading) {
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await complianceAPI.performGapAnalysis({ framework, ...formData })
      setResult(response)
      setLastGapResult(response)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      if (err.isRateLimited) {
        setError(`Too many requests. Please wait ${err.retryAfter || 60} seconds before trying again.`)
        return
      }
      console.error('Gap analysis failed:', err)
      const detail = err?.response?.data?.detail
      if (typeof detail === 'string') {
        setError(`Gap analysis failed: ${detail}`)
      } else if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg || JSON.stringify(d)).join('; '))
      } else {
        setError('Gap analysis failed. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getRiskStyle = (level) => {
    const styles = {
      critical: 'bg-red-50 text-red-700 border border-red-200',
      high: 'bg-orange-50 text-orange-700 border border-orange-200',
      medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      low: 'bg-green-50 text-green-700 border border-green-200',
    }
    return styles[level] || 'bg-gray-100 text-slate-600 border border-gray-200'
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Analysis</p>
        <h2 className="text-3xl font-black text-slate-900">Gap Analysis</h2>
        <p className="mt-1 text-slate-600">Identify compliance gaps against {frameworkLabel}</p>
      </div>

      {!orgProfile && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <span className="text-yellow-600 text-lg flex-shrink-0">⚠</span>
          <p className="text-sm text-yellow-700">
            <Link to="/onboarding" className="underline font-medium text-blue-600">Complete onboarding</Link>{' '}
            to auto-populate this form, or fill in manually below.
          </p>
        </div>
      )}

      {orgProfile && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <span className="text-blue-600">✓</span>
          <p className="text-sm text-slate-600">
            Pre-filled from your onboarding profile for <strong className="text-slate-900">{orgProfile.organization_name}</strong>.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-500 flex-shrink-0">✕</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* ── Guidance Section ────────────────────────────────────────── */}
      <div className="mb-6 bg-white rounded-xl border border-blue-100 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to get the most accurate results?
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          The AI compares your current state against the <strong>{frameworkLabel}</strong> controls. The more detail you provide about your encryption, access controls, and policies, the more tailored your gap analysis will be.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { tag: 'Access', text: 'Who has access? 2FA? RBAC?' },
            { tag: 'Data', text: 'Is data encrypted at rest/transit?' },
            { tag: 'Cloud', text: 'AWS/Azure/GCP controls in use?' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex flex-col">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider mb-0.5">{item.tag}</span>
              <span className="text-[11px] text-slate-500">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Organisation Name <span className="text-red-500">*</span>
            </label>
            <input type="text" required className={inputCls} value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <input type="text" required className={inputCls} value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., Technology, Healthcare, Finance" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Security Practices <span className="text-red-500">*</span>
            </label>
            {orgProfile && (
              <p className="text-xs text-slate-500 mb-1">Auto-generated from onboarding. Edit to add more detail.</p>
            )}
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="text-[10px] items-center flex font-bold text-slate-400 uppercase tracking-tight">Quick Examples:</span>
              <button type="button" onClick={() => setFormData({ ...formData, current_practices: EXAMPLES.cloud })}
                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-md text-slate-600 font-bold transition-colors">
                Cloud-Native
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, current_practices: EXAMPLES.enterprise })}
                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-md text-slate-600 font-bold transition-colors">
                Enterprise
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, current_practices: EXAMPLES.fintech })}
                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-md text-slate-600 font-bold transition-colors">
                Fintech
              </button>
            </div>
            <textarea required rows={8} className={inputCls} value={formData.current_practices}
              onChange={(e) => setFormData({ ...formData, current_practices: e.target.value })}
              placeholder="E.g., We use AWS handles our hosting. Data is encrypted at rest using KMS. Multi-factor authentication is mandatory for all administrative access. We have a draft Information Security Policy..." />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-bold tracking-wide disabled:opacity-40 transition-all bg-blue-600 text-white hover:bg-blue-700">
            {loading ? 'Analysing...' : `Run ${frameworkLabel} Gap Analysis`}
          </button>
        </form>
      </div>

      {loading && <LoadingPanel elapsed={elapsed} />}

      {result && (
        <div ref={resultRef} className="mt-10 space-y-8">

          {/* ── Report Header ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs font-mono text-blue-600 tracking-widest uppercase mb-1">Compliance Report</p>
              <h3 className="text-xl font-bold text-slate-900">
                {frameworkLabel} Gap Analysis — {formData.organization_name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <button
              onClick={() => generateGapPDF(result, formData.organization_name, framework)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-mono">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>

          {/* ── Scorecard ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-2">Overall Status</p>
              <p className="text-xl font-black text-slate-900 capitalize leading-tight">
                {result.overall_compliance_level.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-2">Controls Met</p>
              <p className="text-3xl font-black text-blue-600 leading-tight">
                {result.compliant_controls}
                <span className="text-base font-normal text-slate-500"> / {result.total_controls}</span>
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-2">Gaps Found</p>
              <p className="text-3xl font-black text-red-500 leading-tight">{result.gaps.length}</p>
            </div>
          </div>

          {/* ── Executive Summary ──────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Executive Summary</h4>
            <p className="text-slate-600 leading-relaxed text-sm">{result.summary}</p>
          </div>

          {/* ── Identified Gaps ────────────────────────────────────────── */}
          {result.gaps.length > 0 ? (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4">
                Identified Compliance Gaps <span className="text-slate-500 font-normal">({result.gaps.length} found)</span>
              </h4>
              <div className="space-y-5">
                {result.gaps.map((gap, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Gap header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                          {gap.control_id}
                        </span>
                        <span className="font-semibold text-slate-900 text-sm">{gap.control_name}</span>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full font-mono uppercase ${getRiskStyle(gap.risk_level)}`}>
                        {gap.risk_level} risk
                      </span>
                    </div>

                    {/* Gap body — flowing narrative */}
                    <div className="px-5 py-4 space-y-3">
                      <p className="text-slate-600 text-sm leading-relaxed">{gap.gap_description}</p>

                      <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
                        <p className="text-slate-600 leading-relaxed">
                          <span className="text-slate-900 font-medium">Where you are now: </span>
                          {gap.current_state}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                          <span className="text-slate-900 font-medium">Where you need to be: </span>
                          {gap.required_state}
                        </p>
                      </div>

                      {gap.recommendations?.length > 0 && (
                        <div>
                          <p className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-2">Recommended Actions</p>
                          <ol className="space-y-1.5">
                            {gap.recommendations.map((rec, i) => (
                              <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-blue-600 text-xs font-bold font-mono mt-0.5">
                                  {i + 1}
                                </span>
                                {rec}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
              <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-700 mb-1">No Critical Gaps Identified</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Based on the information provided, no significant compliance gaps were detected for the controls evaluated.
                  Continue monitoring and schedule a periodic review to maintain this status.
                </p>
              </div>
            </div>
          )}

          {/* ── Next Steps ─────────────────────────────────────────────── */}
          {result.next_steps?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Recommended Next Steps</h4>
              <ol className="space-y-4">
                {result.next_steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-blue-200 text-blue-600 text-xs font-bold font-mono">
                      {index + 1}
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* ── Actions ────────────────────────────────────────────────── */}
          <div className="pt-2 pb-6 flex gap-3 flex-wrap border-t border-gray-200">
            <Link to="/policy-generator"
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Generate Policies →
            </Link>
            <Link to="/action-plan"
              className="px-5 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
              Create Action Plan →
            </Link>
            <button
              onClick={() => generateGapPDF(result, formData.organization_name, framework)}
              className="px-5 py-2.5 border border-gray-300 text-slate-600 rounded-lg text-sm font-bold hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF Report
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default GapAnalysis
