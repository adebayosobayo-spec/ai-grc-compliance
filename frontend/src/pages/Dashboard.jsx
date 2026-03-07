import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { complianceAPI } from '../services/api'

const ComplianceGlobe = lazy(() => import('../components/ComplianceGlobe'))

const FW_LABELS = { ISO_27001: 'ISO 27001', ISO_42001: 'ISO 42001', NDPR: 'NDPR', GDPR: 'GDPR', UK_GDPR: 'UK GDPR', POPIA: 'POPIA', LGPD: 'LGPD', CCPA: 'CCPA/CPRA', PDPA: 'PDPA' }
const FW_FULL = { ISO_27001: 'ISO/IEC 27001:2022', ISO_42001: 'ISO/IEC 42001:2023', NDPR: 'Nigeria Data Protection Regulation 2019', GDPR: 'EU General Data Protection Regulation', UK_GDPR: 'UK General Data Protection Regulation', POPIA: 'Protection of Personal Information Act 2013', LGPD: 'Lei Geral de Proteção de Dados', CCPA: 'California Consumer Privacy Act / CPRA', PDPA: 'Personal Data Protection Act' }

const quickActions = [
  {
    to: '/gap-analysis',
    label: 'Gap Analysis',
    desc: 'Identify compliance gaps and prioritise remediation',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: '/policy-generator',
    label: 'Policies',
    desc: 'Generate audit-ready compliance policies',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/dpia',
    label: 'DPIA',
    desc: 'Draft a Data Protection Impact Assessment',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    to: '/hire-dpo',
    label: 'Hire a DPO',
    desc: 'Connect with qualified Data Protection Officers',
    color: 'text-violet-600 bg-violet-50 border-violet-200',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    to: '/aws-assessment',
    label: 'AWS Audit',
    desc: 'Audit cloud-native ISO 27001 controls',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
]

// ── Compliance score derived from last gap result ──────────────────
function useComplianceScore(lastGapResult) {
  if (!lastGapResult) return null
  const { compliant_controls, total_controls } = lastGapResult
  if (!total_controls) return null
  return Math.round((compliant_controls / total_controls) * 100)
}

// ── Animated score counter ─────────────────────────────────────────
function AnimatedScore({ target }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (target === null) return
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

function Dashboard() {
  const { orgProfile, sessionId, lastGapResult } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const frameworkLabel = FW_LABELS[framework] || framework
  const complianceScore = useComplianceScore(lastGapResult)

  const [registerSummary, setRegisterSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  useEffect(() => {
    if (orgProfile && sessionId) {
      setSummaryLoading(true)
      complianceAPI
        .getRegisterSummary(sessionId)
        .then((data) => setRegisterSummary(data))
        .catch(() => setRegisterSummary(null))
        .finally(() => setSummaryLoading(false))
    }
  }, [orgProfile, sessionId])

  // ── Checklist item component ─────────────────────────────────────────
  const ChecklistItem = ({ step, label, description, to, done, active }) => (
    <Link to={to} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${active ? 'border-blue-300 bg-blue-50 shadow-sm' : done ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${done ? 'bg-emerald-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        {done ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        ) : step}
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${active ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-700'}`}>{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      {active && <span className="ml-auto text-xs font-bold text-blue-600 uppercase tracking-wide self-center">Start</span>}
    </Link>
  )

  const FRAMEWORKS = [
    { id: 'ISO_27001', name: 'ISO 27001', full: 'Information Security', icon: '🔒' },
    { id: 'ISO_42001', name: 'ISO 42001', full: 'AI Management', icon: '🤖' },
    { id: 'GDPR', name: 'GDPR', full: 'EU Data Protection', icon: '🇪🇺' },
    { id: 'NDPR', name: 'NDPR', full: 'Nigeria Data Protection', icon: '🇳🇬' },
    { id: 'SOC2', name: 'SOC 2', full: 'Trust Services Criteria', icon: '🛡️' },
    { id: 'POPIA', name: 'POPIA', full: 'South Africa Privacy', icon: '🇿🇦' },
  ]

  // ── No org profile: Welcome + Checklist + Framework Cards ──────────
  if (!orgProfile) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        {/* Welcome hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-[100px] -mt-20 -mr-20" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-blue-400 tracking-[0.25em] uppercase mb-3">AI-Powered Compliance</p>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">Welcome to COMPLAI</h1>
            <p className="text-slate-300 max-w-lg text-sm leading-relaxed">
              From gap analysis to audit-ready policies — automate your compliance journey across ISO 27001, ISO 42001, GDPR, and more.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Link to="/onboarding" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-900/30 transition-all active:scale-95">
                Start Onboarding
              </Link>
              <Link to="/chat" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition-all">
                Ask COMPLIANA
              </Link>
            </div>
          </div>
        </div>

        {/* Getting Started Checklist */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-1">Getting Started</h2>
          <p className="text-xs text-slate-500 mb-4">Complete these steps to set up your compliance programme</p>
          <div className="space-y-2">
            <ChecklistItem step={1} label="Complete Onboarding" description="Tell us about your organisation, framework, and current security posture" to="/onboarding" active />
            <ChecklistItem step={2} label="Run Gap Analysis" description="AI identifies gaps between your current state and framework requirements" to="/gap-analysis" />
            <ChecklistItem step={3} label="Generate Policies" description="Create audit-ready policy documents tailored to your organisation" to="/policy-generator" />
            <ChecklistItem step={4} label="Upload Evidence" description="Attach evidence artefacts to controls for audit readiness" to="/evidence" />
          </div>
        </div>

        {/* Framework Overview Cards */}
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">Supported Frameworks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FRAMEWORKS.map(fw => (
              <div key={fw.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                <span className="text-2xl">{fw.icon}</span>
                <p className="text-sm font-bold text-slate-900 mt-2">{fw.name}</p>
                <p className="text-xs text-slate-500">{fw.full}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Authenticated dashboard ─────────────────────────────────────────
  const summaryCards = registerSummary
    ? [
      { label: 'Risks', value: registerSummary.risks ?? 0, color: 'text-red-600' },
      { label: 'Assets', value: registerSummary.assets ?? 0, color: 'text-blue-600' },
      { label: 'Controls', value: registerSummary.controls ?? 0, color: 'text-emerald-600' },
      { label: 'Evidence', value: registerSummary.evidence ?? 0, color: 'text-amber-600' },
    ]
    : null

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── 3D Hero Panel (Premium Cockpit) ─────────────────────────── */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-[#0b192c] border border-blue-900/40 shadow-2xl min-h-[320px] flex flex-col lg:flex-row items-stretch">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #1e293b, transparent 70%)' }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30"
          style={{ background: 'radial-gradient(circle at 70% 50%, #0ea5e9, transparent 80%)' }}
        />

        <div className="relative flex-1 flex flex-col justify-center p-8 sm:p-10 z-10">
          <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mb-3">Global Security Posture</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-[1.1] max-w-xl">
            Real-time compliance monitoring across your infrastructure.
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            {complianceScore !== null ? (
              <div className="flex items-center gap-5">
                <div className="flex flex-col">
                  <p className="text-5xl font-black text-white tabular-nums tracking-tighter">
                    <AnimatedScore target={complianceScore} />
                    <span className="text-xl font-bold text-blue-400 ml-1">%</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Aligned with {frameworkLabel}</p>
                </div>
                <div className="h-10 w-px bg-slate-800 hidden sm:block" />
                <div className="flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    {lastGapResult?.compliant_controls} / {lastGapResult?.total_controls} Controls Met
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    {lastGapResult?.gaps?.length ?? 0} Gaps Identified
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm max-w-sm">
                No analysis found for <strong>{orgProfile.organization_name}</strong> yet. Run your first check to see your score.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/gap-analysis"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              {complianceScore !== null ? 'View Gap Analysis' : 'Run Gap Analysis'}
            </Link>
            <Link
              to="/asset-register"
              className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-bold border border-slate-700 transition-all"
            >
              Update Assets
            </Link>
          </div>
        </div>

        {/* Right: 3D Globe with refined container */}
        <div className="flex-shrink-0 w-full lg:w-[400px] h-64 lg:h-auto relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0b192c] to-transparent pointer-events-none z-10" />
          <div className="w-full h-full relative z-0">
            <Suspense fallback={null}>
              <ComplianceGlobe score={complianceScore ?? 0} />
            </Suspense>
          </div>
          {/* Subtle ring overlays to match pencil design */}
          <div className="absolute w-72 h-72 border border-slate-800 rounded-full opacity-30 pointer-events-none" />
          <div className="absolute w-56 h-56 border border-slate-700/50 rounded-full opacity-20 pointer-events-none" />
        </div>
      </div>

      {/* ── Next Steps Checklist (no gap analysis yet) ─────────────── */}
      {!lastGapResult && orgProfile && (
        <div className="mb-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-1">Next Steps</h2>
          <p className="text-xs text-slate-500 mb-4">Continue setting up your compliance programme</p>
          <div className="space-y-2">
            <ChecklistItem step={1} label="Complete Onboarding" description="Organisation profile created" to="/onboarding" done />
            <ChecklistItem step={2} label="Run Gap Analysis" description="Identify compliance gaps against your framework" to="/gap-analysis" active />
            <ChecklistItem step={3} label="Generate Policies" description="Create audit-ready policy documents" to="/policy-generator" />
            <ChecklistItem step={4} label="Upload Evidence" description="Attach evidence to controls for audit readiness" to="/evidence" />
          </div>
        </div>
      )}

      {/* ── Register Summary Cards ───────────────────────────────── */}
      {summaryLoading && (
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 w-16 bg-gray-100 rounded mb-3" />
              <div className="h-8 w-12 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {summaryCards && !summaryLoading && (
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Last Gap Analysis ────────────────────────────────────── */}
      {lastGapResult && (
        <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Last Gap Analysis
            </h2>
            <Link
              to="/gap-analysis"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Run New Analysis &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                Compliance Level
              </p>
              <p className="text-base font-bold text-slate-900 capitalize">
                {lastGapResult.overall_compliance_level?.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                Compliant Controls
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {lastGapResult.compliant_controls}
                <span className="text-base font-normal text-slate-500">
                  {' '}/ {lastGapResult.total_controls}
                </span>
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                Gaps Identified
              </p>
              <p className="text-2xl font-bold text-red-600">
                {lastGapResult.gaps?.length ?? 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-3 ${action.color}`}>
                {action.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {action.label}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Framework Info ────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-1">
          Framework
        </h2>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {FW_FULL[framework] || framework}
        </h3>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {framework === 'ISO_27001' ? 'ISO/IEC 27001 is the international standard for information security management systems (ISMS). It provides a systematic approach to managing sensitive company information so that it remains secure.'
            : framework === 'ISO_42001' ? 'ISO/IEC 42001 is the first international standard for AI management systems. It helps organisations develop, provide, and use AI responsibly through a comprehensive management framework.'
              : framework === 'NDPR' ? 'The Nigeria Data Protection Regulation (NDPR) governs the collection, storage, and processing of personal data of Nigerian residents. It establishes rights of data subjects and obligations for data controllers.'
                : framework === 'GDPR' ? "The General Data Protection Regulation (GDPR) is the EU's comprehensive data protection law. It gives individuals control over their personal data and imposes strict obligations on organisations that process it."
                  : framework === 'UK_GDPR' ? "The UK GDPR is the UK's post-Brexit data protection framework, largely mirroring the EU GDPR. It works alongside the Data Protection Act 2018 to regulate personal data processing."
                    : framework === 'POPIA' ? "The Protection of Personal Information Act (POPIA) is South Africa's data protection law. It regulates how personal information is collected, stored, and shared, and establishes the Information Regulator as the supervisory authority."
                      : framework === 'LGPD' ? "The Lei Geral de Proteção de Dados (LGPD) is Brazil's data protection law, inspired by the GDPR. It governs the processing of personal data of individuals located in Brazil."
                        : framework === 'CCPA' ? 'The California Consumer Privacy Act (CCPA), as amended by the CPRA, grants California residents rights over their personal information and imposes obligations on businesses that collect, share, or sell personal data.'
                          : 'The Personal Data Protection Act (PDPA) governs the collection, use, and disclosure of personal data by organisations, balancing individual rights with organisational needs.'
          }
        </p>

        <ul className="space-y-1.5">
          {(framework === 'ISO_27001' ? ['Covers organisational, people, physical, and technological controls', 'Focus on confidentiality, integrity, and availability', 'Risk-based approach to information security']
            : framework === 'ISO_42001' ? ['Covers AI governance, data management, and system development', 'Addresses transparency, fairness, and accountability', 'Focus on responsible and ethical AI practices']
              : framework === 'NDPR' ? ['Requires consent for personal data processing', 'Mandates data protection impact assessments', 'Requires appointment of a Data Protection Officer']
                : framework === 'GDPR' ? ['Lawful basis required for all processing', 'Data subject rights (access, erasure, portability)', '72-hour breach notification requirement']
                  : framework === 'UK_GDPR' ? ['Aligns with EU GDPR post-Brexit', 'ICO as supervisory authority', 'Adequacy decisions for international transfers']
                    : framework === 'POPIA' ? ['8 conditions for lawful processing', 'Information Regulator oversight', 'Cross-border transfer restrictions']
                      : framework === 'LGPD' ? ['10 legal bases for processing', 'ANPD as supervisory authority', 'Data subject rights including portability and deletion']
                        : framework === 'CCPA' ? ['Right to know, delete, and opt-out', 'Do Not Sell/Share requirements', 'Privacy notices and consent mechanisms']
                          : ['Consent-based data processing', 'Data Protection Officer requirements', 'Cross-border transfer restrictions']
          ).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-blue-600 flex-shrink-0 mt-0.5">&rarr;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
