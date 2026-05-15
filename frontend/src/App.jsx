import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Assessment  = lazy(() => import('./pages/Assessment'))
const Results     = lazy(() => import('./pages/Results'))
const Policies    = lazy(() => import('./pages/Policies'))
const Auth        = lazy(() => import('./pages/Login'))

function Spinner() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results"    element={<Results />} />
            <Route path="/policies"   element={<Policies />} />
            <Route path="/auth"       element={<Auth />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
