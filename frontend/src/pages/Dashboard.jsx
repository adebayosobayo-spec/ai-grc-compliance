import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { complianceAPI } from '../services/api'

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
    to: '/assessment',
    label: 'Assessment',
    desc: 'Assess controls and prepare for audits',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: '/verification',
    label: 'Verification',
    desc: 'Verify policy formatting and control coverage',
    color: 'text-violet-600 bg-violet-50 border-violet-200',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

function Dashboard() {
  const { orgProfile, sessionId, lastGapResult } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const frameworkLabel = framework === 'ISO_27001' ? 'ISO 27001' : 'ISO 42001'

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

  // ── No org profile: onboarding CTA ─────────────────────────
  if (!orgProfile) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6">
            <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to ComplAI
          </h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Automate ISO 27001 &amp; ISO 42001 compliance — from gap analysis to audit-ready
            policies — powered by AI.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            Complete Onboarding
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  // ── Authenticated dashboard ─────────────────────────────────
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
      {/* ── Welcome Header ───────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {orgProfile.organization_name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Continuing your {frameworkLabel} compliance journey
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold tracking-wide self-start">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {framework === 'ISO_27001' ? 'ISO/IEC 27001:2022' : 'ISO/IEC 42001:2023'}
          </span>
        </div>
      </div>

      {/* ── Register Summary Cards ───────────────────────────── */}
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

      {/* ── Last Gap Analysis ────────────────────────────────── */}
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

      {/* ── Quick Actions ────────────────────────────────────── */}
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

      {/* ── Framework Info ────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-1">
          Framework
        </h2>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {framework === 'ISO_27001' ? 'ISO/IEC 27001:2022' : 'ISO/IEC 42001:2023'}
        </h3>

        {framework === 'ISO_27001' ? (
          <>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              ISO/IEC 27001 is the international standard for information security management systems (ISMS).
              It provides a systematic approach to managing sensitive company information so that it remains secure.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { value: '93', label: 'Controls' },
                { value: '4', label: 'Themes' },
                { value: 'CIA', label: 'Triad Focus' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-blue-600">{value}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-1.5">
              {[
                'Covers organisational, people, physical, and technological controls',
                'Focus on confidentiality, integrity, and availability',
                'Risk-based approach to information security',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-blue-600 flex-shrink-0 mt-0.5">&rarr;</span>
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              ISO/IEC 42001 is the first international standard for AI management systems. It helps organisations
              develop, provide, and use AI responsibly through a comprehensive management framework.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { value: 'AIMS', label: 'Standard Type' },
                { value: '2023', label: 'Published' },
                { value: 'AI', label: 'Governance' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-blue-600">{value}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-1.5">
              {[
                'Covers AI governance, data management, and system development',
                'Addresses transparency, fairness, and accountability',
                'Focus on responsible and ethical AI practices',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-blue-600 flex-shrink-0 mt-0.5">&rarr;</span>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
