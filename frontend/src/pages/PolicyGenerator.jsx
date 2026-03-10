import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { generatePolicyPDF } from '../utils/generatePolicyPDF'
import { MarkdownContent as SectionContent } from '../utils/MarkdownContent'

const inputCls = 'mt-1 block w-full bg-white border border-gray-300 text-slate-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400'

const MOCK_POLICY = {
  policy: {
    title: 'Information Security Policy',
    version: '1.0',
    effective_date: '2026-02-27',
    review_date: '2027-02-27',
    related_controls: ['A.5.1', 'A.5.2', 'A.6.1', 'A.8.1', 'A.8.2'],
    sections: [
      {
        section_number: '1',
        section_title: 'Purpose and Scope',
        content: `This Information Security Policy establishes the framework for protecting COMPLAI's information assets, systems, and data against unauthorised access, disclosure, alteration, or destruction.\n\nThis policy applies to all employees, contractors, consultants, and third parties who access COMPLAI systems or handle company information, regardless of location or device used.`,
      },
      {
        section_number: '2',
        section_title: 'Roles and Responsibilities',
        content: `- **Chief Information Security Officer (CISO):** Owns this policy, conducts annual reviews, and oversees implementation.\n- **IT Security Team:** Implements technical controls, monitors threats, and responds to incidents.\n- **Department Managers:** Ensure team members complete security training and comply with this policy.\n- **All Employees:** Protect information assets, report incidents, and complete mandatory annual security awareness training.\n- **Third-Party Vendors:** Comply with COMPLAI's security requirements as defined in vendor agreements.`,
      },
      {
        section_number: '3',
        section_title: 'Policy Statements and Procedures',
        content: `**Access Control**\nAll system access must be granted on the principle of least privilege. Multi-factor authentication (MFA) is mandatory for all remote access and privileged accounts.\n\n**Data Classification**\nInformation must be classified as Public, Internal, Confidential, or Restricted. Handling procedures must match the classification level.\n\n**Incident Response**\nSecurity incidents must be reported to security@complai.com within 1 hour of discovery. A formal incident response process must be followed in accordance with the Incident Response Plan.\n\n**Risk Assessments**\nFormal risk assessments must be conducted annually and whenever significant changes to systems or processes occur.`,
      },
      {
        section_number: '4',
        section_title: 'Terms and Definitions',
        content: `| Term | Definition | Plain Language Explanation |\n|------|-----------|---------------------------|\n| ISMS | Information Security Management System — a set of policies and procedures for systematically managing an organisation's sensitive data | The overall system we use to keep our information safe |\n| MFA | Multi-Factor Authentication — requiring two or more verification factors to access a resource | Using both a password and a phone code to log in |\n| Least Privilege | Granting users only the minimum access rights needed to perform their job | Only giving people access to what they actually need |\n| Incident | Any event that compromises or threatens the confidentiality, integrity, or availability of information | Any security breach or suspected breach that needs reporting |\n| Risk Assessment | A systematic process of identifying and evaluating potential security threats | Checking what could go wrong and how serious it would be |`,
      },
      {
        section_number: '5',
        section_title: 'Standards and Controls Mapping',
        content: `| Control ID | Control Name | Policy Statement | Implementation Notes |\n|-----------|-------------|-----------------|---------------------|\n| A.5.1 | Policies for information security | This policy is formally approved by leadership and reviewed annually | Store in company intranet; distribute to all staff |\n| A.5.2 | Information security roles and responsibilities | Roles are defined in Section 2 of this policy | Include in job descriptions and onboarding |\n| A.6.1 | Screening | All employees and contractors undergo background checks before access is granted | HR to confirm checks before IT provisions access |\n| A.8.1 | User endpoint devices | All endpoints must have approved antivirus, encryption, and MDM enrolment | IT to enforce via device management platform |\n| A.8.2 | Privileged access rights | Privileged accounts require quarterly access reviews and MFA at all times | Use PAM tool; log all privileged sessions |`,
      },
    ],
  },
}

const LOADING_MESSAGES = [
  'Analysing framework requirements...',
  'Drafting policy statements...',
  'Building Terms & Definitions table...',
  'Mapping controls to policy sections...',
  'Finalising compliance language...',
]

function LoadingPanel({ elapsed }) {
  const msgIndex = Math.min(Math.floor(elapsed / 7), LOADING_MESSAGES.length - 1)
  // Progress bar fills over ~35 seconds, caps at 95% until done
  const progress = Math.min((elapsed / 35) * 95, 95)

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-600 mb-3"
          style={{ animation: 'spin 1.4s linear infinite', borderTopColor: 'transparent' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <p className="text-slate-900 font-bold text-sm">Generating Policy Document</p>
        <p className="text-slate-600 text-xs mt-1 font-mono">
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
        <div
          className="h-1.5 rounded-full transition-all duration-1000 bg-blue-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-slate-500 text-xs font-mono">
        {elapsed}s elapsed &mdash; typically completes in 20&ndash;40 seconds
      </p>
    </div>
  )
}

function PolicyGenerator() {
  const { orgProfile } = useAppContext()
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

  const framework = orgProfile?.compliance_framework || 'ISO_27001'

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
      if (error.isRateLimited) {
        setGenError(`Too many requests. Please wait ${error.retryAfter || 60} seconds before trying again.`)
        return
      }
      console.error('Policy generation failed:', error)
      const detail = error?.response?.data?.detail
      const isTimeout = error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')
      if (isTimeout) {
        setGenError('Request timed out after 2 minutes. The backend may be overloaded — please restart it and try again.')
      } else if (detail) {
        const msg = typeof detail === 'string' ? detail : Array.isArray(detail) ? detail.map(d => d.msg || JSON.stringify(d)).join('; ') : JSON.stringify(detail)
        setGenError(`Backend error: ${msg}`)
      } else {
        setGenError(`Failed to generate policy: ${error?.message || 'Unknown error'}. Check the backend terminal for details.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadPolicy = () => {
    generatePolicyPDF(result, formData.organization_name, framework)
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Generator</p>
        <h2 className="text-3xl font-black text-slate-900">Policy Generator</h2>
        <p className="mt-1 text-slate-600">
          Generate compliance policies for {{ ISO_27001: 'ISO 27001', ISO_42001: 'ISO 42001', NDPR: 'NDPR', GDPR: 'GDPR', UK_GDPR: 'UK GDPR', POPIA: 'POPIA', LGPD: 'LGPD', CCPA: 'CCPA/CPRA', PDPA: 'PDPA' }[framework] || framework}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
            <input type="text" required className={inputCls} value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
            <input type="text" required className={inputCls} value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., Technology, Healthcare, Finance" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Policy Type</label>
            <select required className={inputCls} value={formData.policy_type}
              onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}>
              <option value="">Select a policy type...</option>
              {framework === 'ISO_27001' ? (
                <>
                  <option value="Information Security Policy">Information Security Policy</option>
                  <option value="Access Control Policy">Access Control Policy</option>
                  <option value="Incident Response Policy">Incident Response Policy</option>
                  <option value="Data Classification Policy">Data Classification Policy</option>
                  <option value="Acceptable Use Policy">Acceptable Use Policy</option>
                  <option value="Remote Working Policy">Remote Working Policy</option>
                  <option value="Change Management Policy">Change Management Policy</option>
                </>
              ) : framework === 'ISO_42001' ? (
                <>
                  <option value="AI Governance Policy">AI Governance Policy</option>
                  <option value="AI Ethics Policy">AI Ethics Policy</option>
                  <option value="AI Data Management Policy">AI Data Management Policy</option>
                  <option value="AI Model Development Policy">AI Model Development Policy</option>
                  <option value="AI Transparency Policy">AI Transparency Policy</option>
                  <option value="AI Risk Management Policy">AI Risk Management Policy</option>
                </>
              ) : (
                <>
                  <option value="Data Protection Policy">Data Protection Policy</option>
                  <option value="Privacy Notice">Privacy Notice</option>
                  <option value="Data Breach Response Policy">Data Breach Response Policy</option>
                  <option value="Data Subject Rights Policy">Data Subject Rights Policy</option>
                  <option value="Data Retention Policy">Data Retention Policy</option>
                  <option value="Cookie Policy">Cookie Policy</option>
                  <option value="Consent Management Policy">Consent Management Policy</option>
                  <option value="International Data Transfer Policy">International Data Transfer Policy</option>
                  <option value="Third Party/Vendor Policy">Third Party/Vendor Policy</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Context (Optional)</label>
            <textarea rows={3} className={inputCls} value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              placeholder="Any specific requirements or context for this policy..." />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 flex justify-center py-3 px-4 rounded-lg text-sm font-bold tracking-wide disabled:opacity-40 transition-all bg-blue-600 text-white hover:bg-blue-700">
              {loading ? 'Generating...' : 'Generate Policy'}
            </button>
            <button
              type="button"
              onClick={() => generatePolicyPDF(MOCK_POLICY, formData.organization_name || 'Sample Organisation', framework)}
              className="px-4 py-3 border border-gray-300 text-slate-600 rounded-lg text-sm font-medium hover:border-blue-600 hover:text-blue-600 transition-colors whitespace-nowrap"
              title="Download a sample PDF to test formatting">
              Sample PDF
            </button>
          </div>
        </form>
      </div>

      {/* Error banner */}
      {genError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
          <span className="flex-shrink-0 mt-0.5">⚠</span>
          <span>{genError}</span>
        </div>
      )}

      {/* Loading panel with progress bar and elapsed timer */}
      {loading && <LoadingPanel elapsed={elapsed} />}

      {/* Result */}
      {result && (
        <div ref={resultRef} className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{result.policy.title}</h3>
              <div className="mt-2 flex gap-4 text-xs text-slate-500 font-mono">
                <span>Version: {result.policy.version}</span>
                <span>Effective: {result.policy.effective_date}</span>
                <span>Review: {result.policy.review_date}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/verification"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                Verify →
              </Link>
              <button onClick={downloadPolicy}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Download PDF
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {result.policy.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded text-xs font-bold text-white flex-shrink-0 bg-blue-600">
                    {section.section_number}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{section.section_title}</h4>
                </div>
                <SectionContent content={section.content} />
              </div>
            ))}
          </div>

          {result.policy.related_controls?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-3">Related Controls</h4>
              <div className="flex flex-wrap gap-2">
                {result.policy.related_controls.map((control, index) => (
                  <span key={index}
                    className="px-3 py-1 bg-gray-100 border border-gray-200 text-blue-600 text-xs rounded font-mono">
                    {control}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PolicyGenerator
