import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import DPIA from './pages/DPIA'
import RoPA from './pages/RoPA'
import BreachResponse from './pages/BreachResponse'
import ConsentDSR from './pages/ConsentDSR'
import PrivacyPolicies from './pages/PrivacyPolicies'
import Approvals from './pages/Approvals'
import AuditLog from './pages/AuditLog'
import HireDPO from './pages/HireDPO'

const NAV_LINKS = [
    { to: '/', label: 'Dashboard', icon: HomeIcon, exact: true },
    { to: '/dpia', label: 'DPIA', icon: ShieldIcon },
    { to: '/ropa', label: 'RoPA', icon: TableIcon },
    { to: '/breaches', label: 'Breach Response', icon: AlertIcon },
    { to: '/consent', label: 'Consent & DSR', icon: UserIcon },
    { to: '/policies', label: 'Privacy Policies', icon: DocIcon },
    { to: '/approvals', label: 'DPO Approvals', icon: CheckIcon },
    { to: '/audit-log', label: 'Audit Log', icon: ClockIcon },
    { to: '/hire-dpo', label: 'Hire a DPO', icon: BriefcaseIcon },
]

function HomeIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>)
}
function ShieldIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>)
}
function TableIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v.375" />
    </svg>)
}
function AlertIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>)
}
function UserIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>)
}
function DocIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>)
}
function CheckIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>)
}
function ClockIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>)
}
function BriefcaseIcon({ className }) {
    return (<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>)
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
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900">
                <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black bg-primary-600">C</span>
                    <div>
                        <span className="text-base font-black tracking-widest text-white">COMPLAI</span>
                        <p className="text-[10px] text-slate-400 font-medium -mt-0.5">DPO ASSIST</p>
                    </div>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV_LINKS.map(link => <SidebarLink key={link.to} {...link} />)}
                </nav>
                {orgProfile && (
                    <div className="px-4 py-3 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-white font-medium truncate max-w-[160px]">{orgProfile.organization_name}</p>
                            <button onClick={clearProfile} className="text-slate-400 hover:text-red-400 text-xs px-1">Clear</button>
                        </div>
                    </div>
                )}
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 flex flex-col">
                        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
                            <div className="flex items-center gap-2">
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
                            {NAV_LINKS.map(link => (
                                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                                    className="sidebar-link text-slate-300 hover:bg-slate-800 hover:text-white">
                                    <link.icon className="w-5 h-5 flex-shrink-0" /><span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            <div className="flex-1 lg:pl-64">
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

                <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dpia" element={<DPIA />} />
                        <Route path="/ropa" element={<RoPA />} />
                        <Route path="/breaches" element={<BreachResponse />} />
                        <Route path="/consent" element={<ConsentDSR />} />
                        <Route path="/policies" element={<PrivacyPolicies />} />
                        <Route path="/approvals" element={<Approvals />} />
                        <Route path="/audit-log" element={<AuditLog />} />
                        <Route path="/hire-dpo" element={<HireDPO />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <AppProvider>
            <Router>
                <AppShell />
            </Router>
        </AppProvider>
    )
}
