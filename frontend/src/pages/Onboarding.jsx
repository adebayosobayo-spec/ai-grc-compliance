import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { Turnstile } from '@marsidev/react-turnstile'
import { Shield, Zap, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Profile' },
  { id: 2, label: 'Framework' },
  { id: 3, label: 'Verify' },
]

export default function Onboarding() {
  const { setOrgProfile } = useAppContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')

  const [form, setForm] = useState({
    organization_name: '',
    industry: 'Technology / Software',
    employee_count: '1–50',
    compliance_framework: 'ISO_42001',
  })

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const submit = async () => {
    if (!form.organization_name) { setError('Please enter your company name.'); return }
    if (!captchaToken) { setError('Please complete the verification.'); return }
    
    setLoading(true)
    setError('')
    try {
      const profile = await complianceAPI.saveOnboarding({
        ...form,
        captcha_token: captchaToken
      })
      setOrgProfile(profile)
      navigate('/assessment')
    } catch (e) {
      setError('Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-6">
      <div className="max-w-xl w-full space-y-10">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
            Onboarding
          </div>
          <h1 className="text-4xl font-black text-white font-heading uppercase tracking-tight">Configure Your Instance</h1>
          <p className="text-slate-400">Initialize your COMPLAI workspace for ISO 42001.</p>
        </div>

        <div className="card-dark p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Company Name</label>
                <input 
                  type="text" 
                  value={form.organization_name}
                  onChange={(e) => set('organization_name', e.target.value)}
                  placeholder="e.g. Cyberdyne Systems"
                  className="input-dark" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Industry</label>
                <select 
                  value={form.industry}
                  onChange={(e) => set('industry', e.target.value)}
                  className="input-dark appearance-none"
                >
                  <option>Technology / Software</option>
                  <option>Financial Services</option>
                  <option>Healthcare</option>
                  <option>Manufacturing</option>
                </select>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full py-4">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Primary Framework</label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'ISO_42001', label: 'ISO 42001:2023 (AI)', desc: 'AI Management Systems' },
                    { id: 'ISO_27001', label: 'ISO 27001:2022', desc: 'Information Security' },
                  ].map((fw) => (
                    <button 
                      key={fw.id}
                      onClick={() => set('compliance_framework', fw.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${form.compliance_framework === fw.id ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-white">{fw.label}</span>
                        {form.compliance_framework === fw.id && <CheckCircle2 size={16} className="text-amber-500" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{fw.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-[2] py-4">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-4 block text-center">Verify Identity</label>
                <div className="flex justify-center py-4 bg-white/5 rounded-3xl border border-white/5">
                  <Turnstile
                    siteKey="1x00000000000000000000AA"
                    onSuccess={(token) => setCaptchaToken(token)}
                    options={{ theme: 'dark' }}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button onClick={submit} disabled={loading} className="btn-primary flex-[2] py-4">
                  {loading ? 'Initializing...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-8 opacity-20 grayscale">
          <Shield size={24} className="text-white" />
          <Lock size={24} className="text-white" />
          <Zap size={24} className="text-white" />
        </div>
      </div>
    </div>
  )
}
