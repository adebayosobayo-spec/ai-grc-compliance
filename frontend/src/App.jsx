import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Assessment  = lazy(() => import('./pages/Assessment'))
const Results     = lazy(() => import('./pages/Results'))
const Policies    = lazy(() => import('./pages/Policies'))
const Auth        = lazy(() => import('./pages/Login'))

function Spinner() {
  return (
    <div style={{ minHeight: '100dvh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #E2E8F0', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <ErrorBoundary>
              <Routes>
                <Route path="/"           element={<LandingPage />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/results"    element={<Results />} />
                <Route path="/policies"   element={<Policies />} />
                <Route path="/auth"       element={<Auth />} />
                <Route path="*"           element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
