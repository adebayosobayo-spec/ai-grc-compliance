import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { complianceAPI } from '../services/api'
import { Zap, ShieldCheck, FileText, BarChart3, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

const ComplianceGlobe = lazy(() => import('../components/ComplianceGlobe'))

const FW_LABELS = { ISO_27001: 'ISO 27001', ISO_42001: 'ISO 42001', NDPR: 'NDPR', GDPR: 'GDPR', UK_GDPR: 'UK GDPR', POPIA: 'POPIA', LGPD: 'LGPD', CCPA: 'CCPA/CPRA', PDPA: 'PDPA' }

const quickActions = [
  {
    to: '/assessment',
    label: 'Assessment',
    desc: 'Audit your AI governance maturity',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    icon: <BarChart3 size={20} />,
  },
  {
    to: '/policy-generator',
    label: 'Policies',
    desc: 'Generate audit-ready policies',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    icon: <FileText size={20} />,
  },
  {
    to: '/risk-register',
    label: 'Risks',
    desc: 'Manage your AI risk register',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    icon: <ShieldCheck size={20} />,
  },
  {
    to: '/questionnaire',
    label: 'Questionnaire AI',
    desc: 'Answer DDQs with AI',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    icon: <Zap size={20} />,
  },
]

function AnimatedScore({ target }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = 0
    const step = Math.ceil(target / 40)
    const interval = setInterval(() => {
      start = Math.min(start + step, target)
      setDisplay(start)
      if (start >= target) clearInterval(interval)
    }, 25)
    return () => clearInterval(interval)
  }, [target])
  return <>{display}</>
}

export default function Dashboard() {
  const { orgProfile, sessionId, lastGapResult } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_42001'
  const frameworkLabel = FW_LABELS[framework] || framework
  const [registerSummary, setRegisterSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      complianceAPI.getRegisterSummary(sessionId)
        .then(setRegisterSummary)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const score = lastGapResult ? Math.round((lastGapResult.compliant_controls / lastGapResult.total_controls) * 100) : 0

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto space-y-10">
      
      {/* Premium Cockpit Hero */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0F1E] border border-white/5 shadow-2xl min-h-[360px] flex flex-col lg:flex-row items-stretch group">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 opacity-50" />
        
        <div className="relative flex-1 flex flex-col justify-center p-10 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap size={12} /> Compliance Dashboard
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight font-heading uppercase tracking-tight">
            Governance <br /> <span className="text-amber-500">Maturity.</span>
          </h1>

          <div className="flex flex-wrap items-center gap-8 mb-10">
            <div className="flex flex-col">
              <p className="text-6xl font-black text-white font-heading tabular-nums tracking-tighter">
                <AnimatedScore target={score || 42} />
                <span className="text-2xl font-bold text-amber-500 ml-1">%</span>
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Readiness Score</p>
            </div>
            <div className="h-12 w-px bg-white/5 hidden sm:block" />
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                12 / 40 Controls Verified
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                8 Critical Gaps Detected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/assessment" className="btn-primary px-8">
              Resume Audit <ArrowRight size={18} />
            </Link>
            <Link to="/gap-analysis" className="btn-secondary px-8">
              View Report
            </Link>
          </div>
        </div>

        {/* 3D Globe */}
        <div className="flex-shrink-0 w-full lg:w-[450px] h-80 lg:h-auto relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0A0F1E] to-transparent pointer-events-none z-10 hidden lg:block" />
          <div className="w-full h-full relative z-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <Suspense fallback={<div className="w-full h-full bg-slate-900/20 animate-pulse" />}>
              <ComplianceGlobe score={score || 42} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Risks', value: '14', color: 'text-red-500' },
          { label: 'Assets Tracked', value: '28', color: 'text-blue-500' },
          { label: 'Policy Status', value: 'Draft', color: 'text-amber-500' },
          { label: 'Audit Pack', value: '62%', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="card-dark p-6 group hover:border-white/10 transition-all">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-slate-400">{stat.label}</p>
            <p className={`text-3xl font-black font-heading ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mission Control</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.to} className="card-dark p-6 group hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${action.color}`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-heading">{action.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="p-1 bg-gradient-to-r from-amber-500 to-purple-600 rounded-3xl">
        <div className="bg-slate-950 rounded-[1.4rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-black text-white mb-3 font-heading uppercase">Unlock Policy Generator</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              You've identified 8 critical gaps. Don't waste weeks drafting documents. 
              Unlock the ISO 42001 Policy Generator and be audit-ready by tomorrow.
            </p>
          </div>
          <Link to="/checkout" className="btn-primary px-10 whitespace-nowrap">
            Upgrade Now $299 <ArrowRight size={18} />
          </Link>
        </div>
      </div>

    </div>
  )
}
