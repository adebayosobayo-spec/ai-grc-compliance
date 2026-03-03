import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { Turnstile } from '@marsidev/react-turnstile'

const STEPS = [
  { id: 1, label: 'Organisation' },
  { id: 2, label: 'Security' },
  { id: 3, label: 'Infrastructure' },
  { id: 4, label: 'Risk Profile' },
]

const INDUSTRIES = [
  'Technology / Software', 'Financial Services / Banking', 'Healthcare / Life Sciences',
  'Manufacturing', 'Retail / E-Commerce', 'Government / Public Sector', 'Education',
  'Professional Services', 'Energy / Utilities', 'Media / Telecommunications', 'Other',
]
const EMPLOYEE_COUNTS = ['1–50', '51–200', '201–500', '501–1,000', '1,001–5,000', '5,000+']
const CERTIFICATIONS = ['ISO 27001', 'ISO 9001', 'SOC 2 Type I', 'SOC 2 Type II', 'PCI DSS', 'HIPAA', 'None']
const CLOUD_PROVIDERS = ['AWS', 'Microsoft Azure', 'Google Cloud Platform', 'IBM Cloud', 'Oracle Cloud', 'Other']
const DATA_TYPES = [
  'Personally Identifiable Information (PII)', 'Financial / Payment Data', 'Health / Medical Data',
  'Intellectual Property / Trade Secrets', 'Employee Data', 'Public / Marketing Data',
]
const CONCERNS = [
  'Data breach / exfiltration', 'Ransomware / malware', 'Insider threats',
  'Third-party / supply chain risk', 'Regulatory fines & penalties',
  'Reputational damage', 'Cloud misconfigurations', 'AI system risks',
]
const TIMELINES = ['3 months', '6 months', '12 months', '18 months', '24+ months']

const initialForm = {
  organization_name: '', industry: '', employee_count: '', countries_of_operation: '',
  compliance_framework: 'ISO_27001', target_certification_date: '',
  has_security_policy: '', has_security_team: '', existing_certifications: [],
  performs_risk_assessments: '', has_incident_response: '', has_business_continuity: '',
  current_security_controls: '',
  infrastructure_type: '', cloud_providers: [], has_third_party_vendors: '',
  has_remote_workers: '', data_types_handled: [], has_asset_inventory: '',
  uses_identity_management: '',
  risk_appetite: '', biggest_concerns: [], compliance_timeline: '',
  budget_level: '', additional_context: '',
}

const inputCls = 'mt-1 block w-full bg-white border border-gray-300 text-slate-900 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-slate-400'

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${currentStep > step.id
              ? 'bg-blue-600 text-white'
              : currentStep === step.id
                ? 'border-2 border-blue-600 text-blue-600'
                : 'bg-gray-100 border border-gray-200 text-slate-400'
              }`}>
              {currentStep > step.id ? '✓' : step.id}
            </div>
            <span className={`mt-2 text-xs font-medium text-center w-20 ${currentStep === step.id ? 'text-slate-900' : 'text-slate-400'
              }`}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-5 transition-colors ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function RadioGroup({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt.value} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-all text-sm font-medium ${value === opt.value
            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
            : 'border-gray-200 bg-white hover:border-blue-300 text-slate-600'
            }`}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value}
              onChange={() => onChange(name, opt.value)} className="sr-only" />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  )
}

function CheckboxGroup({ label, name, values, onChange, options }) {
  const toggle = (val) => {
    const next = values.includes(val) ? values.filter((v) => v !== val) : [...values, val]
    onChange(name, next)
  }
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-all ${values.includes(opt)
            ? 'border-blue-600 bg-blue-50 text-blue-700'
            : 'border-gray-200 bg-white hover:border-blue-300 text-slate-600'
            }`}>
            <input type="checkbox" checked={values.includes(opt)} onChange={() => toggle(opt)} className="sr-only" />
            <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${values.includes(opt) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
              {values.includes(opt) && <span className="text-white text-xs font-bold">✓</span>}
            </span>
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      {children}
    </div>
  )
}

const yesNoPartial = [
  { value: 'yes', label: 'Yes' },
  { value: 'partial', label: 'Partial' },
  { value: 'no', label: 'No' },
]
const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export default function Onboarding() {
  const { setOrgProfile } = useAppContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const errorRef = useRef(null)

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))
  const handleInput = (e) => set(e.target.name, e.target.value)

  const showError = (msg) => {
    setError(msg)
    setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  const validateStep = () => {
    if (step === 1) {
      if (!form.organization_name.trim()) return 'Organisation name is required.'
      if (!form.industry) return 'Please select an industry.'
      if (!form.employee_count) return 'Please select employee count.'
      if (!form.compliance_framework) return 'Please select a compliance framework.'
    }
    if (step === 2) {
      if (!form.has_security_policy) return 'Please answer: Do you have a documented Information Security Policy?'
      if (!form.has_security_team) return 'Please answer: Do you have a dedicated security team?'
      if (!form.performs_risk_assessments) return 'Please answer: Do you perform regular risk assessments?'
      if (!form.has_incident_response) return 'Please answer: Do you have an Incident Response Plan?'
      if (!form.has_business_continuity) return 'Please answer: Do you have a Business Continuity Plan?'
    }
    if (step === 3) {
      if (!form.infrastructure_type) return 'Please select your primary infrastructure type.'
      if (!form.has_third_party_vendors) return 'Please answer: Do you use third-party vendors?'
      if (!form.has_remote_workers) return 'Please answer: Do you have remote workers?'
      if (!form.has_asset_inventory) return 'Please answer: Do you maintain a formal IT asset inventory?'
      if (!form.uses_identity_management) return 'Please answer: Do you use a centralised IAM system?'
    }
    if (step === 4) {
      if (!form.risk_appetite) return 'Please select your risk appetite.'
      if (!form.compliance_timeline) return 'Please select a compliance timeline.'
      if (!form.budget_level) return 'Please select a budget level.'
      if (!captchaToken) return 'Please complete the CAPTCHA verification to proceed.'
    }
    return ''
  }

  const next = () => {
    const err = validateStep()
    if (err) { showError(err); return }
    setError('')
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    setError('')
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async () => {
    const err = validateStep()
    if (err) { showError(err); return }
    setError('')
    setLoading(true)
    try {
      const profile = await complianceAPI.saveOnboarding({
        ...form,
        captcha_token: captchaToken
      })
      setOrgProfile(profile)
      navigate('/gap-analysis')
    } catch (e) {
      const msg = e?.response?.data?.detail
        ? `Error: ${e.response.data.detail}`
        : 'Failed to save profile. Please try again.'
      showError(msg)
      console.error('Onboarding error:', e?.response?.data || e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Setup</p>
        <h2 className="text-3xl font-extrabold text-slate-900">Organisational Onboarding</h2>
        <p className="mt-1 text-slate-500 text-sm">
          Complete this intake form to generate a tailored compliance assessment.
        </p>
      </div>

      <StepIndicator currentStep={step} />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {error && (
          <div ref={errorRef} className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">&#9888;</span>
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Organisation Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Organisation Details</h3>

            <FormField label="Organisation Name" required>
              <input name="organization_name" value={form.organization_name} onChange={handleInput}
                className={inputCls} placeholder="e.g. Acme Corp" />
            </FormField>

            <FormField label="Industry / Sector" required>
              <select name="industry" value={form.industry} onChange={handleInput} className={inputCls}>
                <option value="">Select industry...</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </FormField>

            <FormField label="Number of Employees" required>
              <select name="employee_count" value={form.employee_count} onChange={handleInput} className={inputCls}>
                <option value="">Select range...</option>
                {EMPLOYEE_COUNTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>

            <FormField label="Countries / Regions of Operation">
              <input name="countries_of_operation" value={form.countries_of_operation} onChange={handleInput}
                className={inputCls} placeholder="e.g. United Kingdom, United States, EU" />
            </FormField>

            <RadioGroup label="Target Compliance Framework" name="compliance_framework"
              value={form.compliance_framework} onChange={set} required
              options={[
                { value: 'ISO_27001', label: 'ISO 27001 — Information Security Management' },
                { value: 'ISO_42001', label: 'ISO 42001 — AI Governance' },
                { value: 'NDPR', label: 'NDPR — Nigeria Data Protection Regulation' },
                { value: 'GDPR', label: 'GDPR — EU General Data Protection Regulation' },
                { value: 'UK_GDPR', label: 'UK GDPR — UK Data Protection' },
                { value: 'POPIA', label: 'POPIA — South Africa Protection of Personal Information Act' },
                { value: 'LGPD', label: 'LGPD — Brazil Lei Geral de Proteção de Dados' },
                { value: 'CCPA', label: 'CCPA/CPRA — California Consumer Privacy Act' },
                { value: 'PDPA', label: 'PDPA — Singapore/Thailand Personal Data Protection Act' },
              ]} />

            <FormField label="Target Certification Date (optional)">
              <input type="date" name="target_certification_date"
                value={form.target_certification_date} onChange={handleInput} className={inputCls} />
            </FormField>
          </div>
        )}

        {/* Step 2: Current Security Posture */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Current Security Posture</h3>

            <RadioGroup label="Do you have a documented Information Security Policy?"
              name="has_security_policy" value={form.has_security_policy} onChange={set} required options={yesNoPartial} />

            <RadioGroup label="Do you have a dedicated information security team or role?"
              name="has_security_team" value={form.has_security_team} onChange={set} required options={yesNoPartial} />

            <RadioGroup label="Do you perform regular security risk assessments?"
              name="performs_risk_assessments" value={form.performs_risk_assessments} onChange={set} required options={yesNoPartial} />

            <RadioGroup label="Do you have a documented Incident Response Plan?"
              name="has_incident_response" value={form.has_incident_response} onChange={set} required options={yesNoPartial} />

            <RadioGroup label="Do you have a Business Continuity / Disaster Recovery Plan?"
              name="has_business_continuity" value={form.has_business_continuity} onChange={set} required options={yesNoPartial} />

            <CheckboxGroup label="Existing compliance certifications held"
              name="existing_certifications" values={form.existing_certifications} onChange={set} options={CERTIFICATIONS} />

            <FormField label="Describe any existing security controls or practices (optional)">
              <textarea name="current_security_controls" value={form.current_security_controls}
                onChange={handleInput} rows={4} className={inputCls}
                placeholder="e.g. We use MFA, have a firewall, run quarterly vulnerability scans..." />
            </FormField>
          </div>
        )}

        {/* Step 3: Infrastructure & Data */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Infrastructure & Data</h3>

            <RadioGroup label="Primary infrastructure type" name="infrastructure_type"
              value={form.infrastructure_type} onChange={set} required
              options={[
                { value: 'cloud', label: 'Cloud-only' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'on_premise', label: 'On-premise' },
              ]} />

            <CheckboxGroup label="Cloud providers in use (if applicable)"
              name="cloud_providers" values={form.cloud_providers} onChange={set} options={CLOUD_PROVIDERS} />

            <RadioGroup label="Do you use third-party vendors or suppliers that access your systems or data?"
              name="has_third_party_vendors" value={form.has_third_party_vendors} onChange={set} required options={yesNo} />

            <RadioGroup label="Do you have remote or hybrid workers?"
              name="has_remote_workers" value={form.has_remote_workers} onChange={set} required options={yesNo} />

            <CheckboxGroup label="Types of sensitive data handled"
              name="data_types_handled" values={form.data_types_handled} onChange={set} options={DATA_TYPES} />

            <RadioGroup label="Do you maintain a formal IT asset inventory?"
              name="has_asset_inventory" value={form.has_asset_inventory} onChange={set} required options={yesNoPartial} />

            <RadioGroup label="Do you use a centralised Identity & Access Management (IAM) system?"
              name="uses_identity_management" value={form.uses_identity_management} onChange={set} required options={yesNo} />
          </div>
        )}

        {/* Step 4: Risk Profile */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Risk Profile & Goals</h3>

            <RadioGroup label="How would you describe your organisation's risk appetite?"
              name="risk_appetite" value={form.risk_appetite} onChange={set} required
              options={[
                { value: 'low', label: 'Conservative (Low)' },
                { value: 'medium', label: 'Balanced (Medium)' },
                { value: 'high', label: 'Risk-tolerant (High)' },
              ]} />

            <CheckboxGroup label="Top security / compliance concerns (select all that apply)"
              name="biggest_concerns" values={form.biggest_concerns} onChange={set} options={CONCERNS} />

            <FormField label="Target timeline to achieve compliance" required>
              <select name="compliance_timeline" value={form.compliance_timeline}
                onChange={handleInput} className={inputCls}>
                <option value="">Select timeline...</option>
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>

            <RadioGroup label="Budget available for compliance activities"
              name="budget_level" value={form.budget_level} onChange={set} required
              options={[
                { value: 'limited', label: 'Limited' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'generous', label: 'Generous' },
                { value: 'undefined', label: 'Not yet defined' },
              ]} />

            <FormField label="Any additional context about your organisation or compliance needs">
              <textarea name="additional_context" value={form.additional_context}
                onChange={handleInput} rows={4} className={inputCls}
                placeholder="e.g. We are preparing for our first ISO audit in Q3..." />
            </FormField>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">Security Verification <span className="text-red-500">*</span></label>
              <Turnstile
                siteKey="1x00000000000000000000AA"
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => showError('CAPTCHA failed to load.')}
                onExpire={() => setCaptchaToken('')}
                options={{ theme: 'light' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button type="button" onClick={back} disabled={step === 1}
          className="px-6 py-2.5 border border-gray-300 text-slate-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium">
          &larr; Back
        </button>

        {step < 4 ? (
          <button type="button" onClick={next}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm tracking-wide hover:bg-blue-700 transition-colors shadow-sm">
            Continue &rarr;
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={loading}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm tracking-wide hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-sm">
            {loading ? 'Saving...' : 'Complete Onboarding \u2192'}
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400 font-mono">
        Step {step} of {STEPS.length} — Your information is used solely to generate tailored compliance outputs.
      </p>
    </div>
  )
}
