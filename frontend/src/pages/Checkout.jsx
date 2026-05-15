import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, CreditCard, ArrowRight, CheckCircle2, Zap } from 'lucide-react'

export default function Checkout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePay = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      // In a real app, we'd update the user's subscription state in Supabase here
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full card-dark p-12 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 font-heading uppercase">Payment Successful</h1>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Your ISO 42001 Policy Generator is now unlocked. You can now generate and download all 7 audit-ready policies.
          </p>
          <button 
            onClick={() => navigate('/policy-generator')}
            className="btn-primary w-full py-4"
          >
            Go to Generator <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Summary */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-white font-heading uppercase tracking-tight mb-4">Complete Your Order</h1>
            <p className="text-slate-400">Unlock the full COMPLAI ISO 42001 Policy Suite.</p>
          </div>

          <div className="card-dark p-8 space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
              <div>
                <h3 className="text-white font-bold">Policy Generator Pack</h3>
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">ISO 42001 Startup Edition</p>
              </div>
              <span className="text-xl font-black text-white font-mono">$299</span>
            </div>
            
            <ul className="space-y-4">
              {[
                '7 Audit-Ready ISO 42001 Policies',
                'Customized for your AI Startup',
                'Download as Word & PDF',
                'Lifetime Updates',
                'Audit-Support Guarantee'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <ShieldCheck size={16} className="text-amber-500" /> {item}
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
              <span className="text-slate-400 font-bold">Total Due</span>
              <span className="text-3xl font-black text-amber-500 font-mono">$299</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Lock size={12} /> SSL SECURE</span>
            <span className="flex items-center gap-1"><CreditCard size={12} /> PCI COMPLIANT</span>
            <span className="flex items-center gap-1"><Zap size={12} /> INSTANT ACCESS</span>
          </div>
        </div>

        {/* Right: Payment Form */}
        <div className="card-dark p-8">
          <form onSubmit={handlePay} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Cardholder Name</label>
              <input type="text" required placeholder="John Doe" className="input-dark" />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input type="text" required placeholder="0000 0000 0000 0000" className="input-dark pl-12" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Expiry Date</label>
                <input type="text" required placeholder="MM/YY" className="input-dark" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">CVC</label>
                <input type="text" required placeholder="123" className="input-dark" />
              </div>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                By clicking "Pay Securely", you agree to COMPLAI's Terms of Service and acknowledge that digital downloads are non-refundable once generated.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg disabled:opacity-30"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Pay Securely $299'
              )}
            </button>

            <div className="flex justify-center gap-6 opacity-30 grayscale contrast-200 mt-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
