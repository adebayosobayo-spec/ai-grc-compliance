import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]   = useState('signin')  // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  const isSignUp = mode === 'signup'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, pass)
        setDone(true)
      } else {
        await signIn(email, pass)
        navigate('/results')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full bg-white/[0.04] border border-white/[0.10] text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'

  if (done) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Check your email</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            We sent a confirmation link to <strong className="text-slate-200">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link to="/" className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-150 cursor-pointer">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col">

      {/* Nav */}
      <nav className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">C</span>
            </div>
            <span className="text-sm font-black tracking-widest text-white">COMPLAI</span>
          </Link>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isSignUp
                ? 'Save your assessment results and access your policies anytime.'
                : 'Sign in to access your assessment and policies.'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-8">
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer ${
                  mode === m
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Email
              </label>
              <input
                id="auth-email" type="email" required placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className={inputCls}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="auth-pass" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Password
              </label>
              <input
                id="auth-pass" type="password" required placeholder="••••••••"
                value={pass} onChange={e => setPass(e.target.value)}
                className={inputCls}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={8}
              />
              {isSignUp && (
                <p className="text-xs text-slate-600 mt-1.5">Minimum 8 characters</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {isSignUp ? 'Creating account…' : 'Signing in…'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setError('') }}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-150 cursor-pointer"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-600 mb-3">Just want to take the assessment?</p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-150 cursor-pointer"
            >
              Start free assessment — no account needed
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
