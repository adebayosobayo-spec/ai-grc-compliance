import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import GapAnalysis from './pages/GapAnalysis'
import PolicyGenerator from './pages/PolicyGenerator'
import Assessment from './pages/Assessment'
import ActionPlan from './pages/ActionPlan'
import Verification from './pages/Verification'
import Chat from './pages/Chat'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: HomeIcon, exact: true },
  { to: '/onboarding', label: 'Onboarding', icon: ClipboardIcon },
  { to: '/gap-analysis', label: 'Gap Analysis', icon: ChartIcon },
  { to: '/policy-generator', label: 'Policies', icon: DocIcon },
  { to: '/assessment', label: 'Assessment', icon: CheckIcon },
  { to: '/action-plan', label: 'Action Plan', icon: ListIcon },
  { to: '/verification', label: 'Verification', icon: ShieldIcon },
  { to: '/chat', label: 'Chat', icon: ChatBubbleIcon },
]

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
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900">
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
                {orgProfile.compliance_framework === 'ISO_27001' ? 'ISO 27001' : 'ISO 42001'}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>

        {/* Profile footer */}
        {orgProfile && (
          <div className="px-4 py-3 border-t border-slate-800">
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
          </div>
        )}
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
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="sidebar-link text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
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

        <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/gap-analysis" element={<GapAnalysis />} />
            <Route path="/policy-generator" element={<PolicyGenerator />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/action-plan" element={<ActionPlan />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppShell />
      </Router>
    </AppProvider>
  )
}

export default App
