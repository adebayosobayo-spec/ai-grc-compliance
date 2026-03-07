import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useAppContext } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { pageView } from './utils/analytics'

// Eager-load public pages for instant first paint
import Chat from './pages/Chat'
import Login from './pages/Login'

// Lazy-load protected routes — smaller initial bundle (react-best-practices: bundle-dynamic-imports)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const GapAnalysis = lazy(() => import('./pages/GapAnalysis'))
const PolicyGenerator = lazy(() => import('./pages/PolicyGenerator'))
const ActionPlan = lazy(() => import('./pages/ActionPlan'))
const RiskRegister = lazy(() => import('./pages/RiskRegister'))
const AssetRegister = lazy(() => import('./pages/AssetRegister'))
const DocumentCentre = lazy(() => import('./pages/DocumentCentre'))
const Security = lazy(() => import('./pages/Security'))
const DPOAssist = lazy(() => import('./pages/DPOAssist'))
const Verification = lazy(() => import('./pages/Verification'))
const Assessment = lazy(() => import('./pages/Assessment'))
const AWSAssessment = lazy(() => import('./pages/AWSAssessment'))
const LogicComparison = lazy(() => import('./pages/LogicComparison'))

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]" role="status" aria-label="Loading page">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  )
}

// ── Nav structure: top-level items ──────────────────────────────
const NAV = [
  {
    type: 'link',
    to: '/',
    label: 'COMPLIANA',
    exact: true,
    icon: ChatBubbleIcon,
  },
  {
    type: 'link',
    to: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
  },
  {
    type: 'group',
    label: 'Compliance',
    icon: ChartIcon,
    children: [
      { to: '/gap-analysis', label: 'Gap Analysis', icon: ChartIcon },
      { to: '/assessment', label: 'Assessment', icon: CheckIcon },
      { to: '/aws-assessment', label: 'AWS Audit', icon: AWSIcon },
      { to: '/verification', label: 'Verification', icon: ShieldIcon },
      { to: '/action-plan', label: 'Action Plan', icon: ListIcon },
    ],
  },
  {
    type: 'group',
    label: 'Documents',
    icon: DocIcon,
    children: [
      { to: '/policy-generator', label: 'Policies', icon: DocIcon },
      { to: '/documents', label: 'Document Centre', icon: FolderIcon },
    ],
  },
  {
    type: 'group',
    label: 'Registers',
    icon: RiskIcon,
    children: [
      { to: '/risk-register', label: 'Risk Register', icon: RiskIcon },
      { to: '/asset-register', label: 'Asset Register', icon: AssetIcon },
    ],
  },
  {
    type: 'link',
    to: '/dpo-assist',
    label: 'DPO Assist',
    icon: DPIAIcon,
  },
  {
    type: 'group',
    label: 'Settings',
    icon: LockIcon,
    children: [
      { to: '/security', label: 'Security', icon: LockIcon },
      { to: '/onboarding', label: 'Onboarding', icon: ClipboardIcon },
    ],
  },
]

// ── Sidebar nav components ────────────────────────────────────────

// Single direct link
function NavItem({ to, label, icon: Icon, exact, onClick }) {
  const location = useLocation()
  const active = exact ? location.pathname === to : location.pathname === to
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
        ? 'bg-primary-600 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

// Collapsible group with auto-expand when a child is active
function NavGroup({ label, icon: GroupIcon, children, onChildClick }) {
  const location = useLocation()
  const isChildActive = children.some(c => location.pathname === c.to || location.pathname.startsWith(c.to + '/'))
  const [open, setOpen] = useState(isChildActive)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isChildActive
          ? 'text-white bg-slate-800'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
      >
        <GroupIcon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left">{label}</span>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
            }`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="mt-0.5 ml-3 pl-3 border-l border-slate-700 space-y-0.5">
          {children.map(child => {
            const active = location.pathname === child.to
            return (
              <Link
                key={child.to}
                to={child.to}
                onClick={onChildClick}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${active
                  ? 'text-white font-semibold bg-primary-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{child.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Renders the full nav from the NAV config
function SidebarNav({ onLinkClick }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV.map((item, idx) =>
        item.type === 'link' ? (
          <NavItem key={item.to} {...item} onClick={onLinkClick} />
        ) : (
          <NavGroup key={idx} {...item} onChildClick={onLinkClick} />
        )
      )}
    </nav>
  )
}

// Inline SVG icons to avoid heavy icon library imports
function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}
function ClipboardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  )
}
function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
function DocIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}
function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  )
}
function ListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )
}
function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}
function ChatBubbleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}
function RiskIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}
function AssetIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  )
}
function FolderIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  )
}
function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}
function DPIAIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>)
}
function RopaIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v.375" /></svg>)
}
function BreachIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>)
}
function ConsentIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>)
}
function PrivacyIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>)
}
function ApprovalIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>)
}
function AuditIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
}
function BriefcaseIcon({ className }) {
  return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>)
}
function AWSIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  )
}

function SidebarLink({ to, label, icon: Icon, exact }) {
  const location = useLocation()
  const active = exact ? location.pathname === to : location.pathname.startsWith(to)
  return (
    <Link to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

function AppShell() {
  const { orgProfile, clearProfile } = useAppContext()
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Fire a GA4 page_view on every route change
  useEffect(() => {
    pageView(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex">
      {/* Skip navigation — accessibility (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900" role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black bg-primary-600">C</span>
          <span className="text-base font-black tracking-widest text-white">COMPLAI</span>
        </div>

        {/* Framework badge */}
        {orgProfile && (
          <div className="px-4 pt-4 pb-2">
            <div className="bg-slate-800 rounded-lg px-3 py-2 text-xs">
              <p className="text-slate-400 font-medium">Framework</p>
              <p className="text-primary-400 font-bold font-mono mt-0.5">
                {{ ISO_27001: 'ISO 27001', ISO_42001: 'ISO 42001', NDPR: 'NDPR', GDPR: 'GDPR', UK_GDPR: 'UK GDPR', POPIA: 'POPIA', LGPD: 'LGPD', CCPA: 'CCPA/CPRA', PDPA: 'PDPA' }[orgProfile.compliance_framework] || orgProfile.compliance_framework}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarNav />

        {/* Profile footer */}
        <div className="px-4 py-3 border-t border-slate-800 space-y-2">
          {orgProfile && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-white font-medium truncate max-w-[160px]">
                {orgProfile.organization_name}
              </p>
              <button
                onClick={clearProfile}
                title="Clear profile"
                className="text-slate-400 hover:text-red-400 transition-colors text-xs px-1"
              >
                Clear
              </button>
            </div>
          )}
          {user ? (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 truncate max-w-[160px]">{user.email}</p>
              <button
                onClick={() => signOut()}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="block text-xs text-primary-400 hover:text-primary-300 font-medium">
              Sign in &rarr;
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black bg-primary-600">C</span>
                <span className="text-base font-black tracking-widest text-white">COMPLAI</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarNav onLinkClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar — mobile */}
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-md text-slate-600 hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-black bg-primary-600">C</span>
            <span className="text-sm font-black tracking-widest text-slate-900">COMPLAI</span>
          </div>
          <div className="w-8" />
        </header>

        {/* Onboarding banner */}
        {!orgProfile && (
          <div className="bg-primary-50 border-b border-primary-100 px-4 py-2.5">
            <div className="max-w-5xl mx-auto flex items-center justify-between text-sm">
              <p className="text-primary-800">
                Complete onboarding to generate personalised compliance assessments and policies.
              </p>
              <Link to="/onboarding" className="font-bold text-primary-600 hover:text-primary-700 whitespace-nowrap">
                Start Now &rarr;
              </Link>
            </div>
          </div>
        )}

        <main id="main-content" className="max-w-5xl mx-auto py-6 px-4 sm:px-6" role="main">
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public routes — no login required */}
                <Route path="/" element={<Chat />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes — require authentication */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/gap-analysis" element={<ProtectedRoute><GapAnalysis /></ProtectedRoute>} />
                <Route path="/policy-generator" element={<ProtectedRoute><PolicyGenerator /></ProtectedRoute>} />
                <Route path="/risk-register" element={<ProtectedRoute><RiskRegister /></ProtectedRoute>} />
                <Route path="/asset-register" element={<ProtectedRoute><AssetRegister /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><DocumentCentre /></ProtectedRoute>} />
                <Route path="/action-plan" element={<ProtectedRoute><ActionPlan /></ProtectedRoute>} />
                <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                <Route path="/aws-assessment" element={<ProtectedRoute><AWSAssessment /></ProtectedRoute>} />
                <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
                <Route path="/dpo-assist" element={<ProtectedRoute><DPOAssist /></ProtectedRoute>} />
                <Route path="/dpia" element={<ProtectedRoute><DPOAssist defaultTab="dpia" /></ProtectedRoute>} />
                <Route path="/hire-dpo" element={<ProtectedRoute><DPOAssist defaultTab="hire" /></ProtectedRoute>} />
                <Route path="/logic-comparison" element={<ProtectedRoute><LogicComparison /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppShell />
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
