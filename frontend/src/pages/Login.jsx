import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode]     = useState('signin')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [done, setDone]     = useState(false)
  const isSignUp = mode === 'signup'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) { await signUp(email, pass); setDone(true) }
      else { await signIn(email, pass); navigate('/results') }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  if (done) return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} className="mesh-bg">
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }} className="page-enter">
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width={28} height={28} viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6 12-12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Check your email</h2>
        <p style={{ fontSize: 15, color: 'var(--text-sub)', lineHeight: 1.7, margin: '0 0 28px' }}>
          We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Click the link to activate your account.
        </p>
        <Link to="/" className="btn-ghost" style={{ justifyContent: 'center', width: '100%' }}>Back to home</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }} className="mesh-bg">
      {/* Nav */}
      <nav style={{ padding: '20px 32px', borderBottom: '1px solid var(--line)' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(37,99,235,0.30)' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>C</span>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', color: '#fff' }}>COMPLAI</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 400, width: '100%' }} className="page-enter">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', margin: 0 }}>
              {isSignUp ? 'Save your assessment and access policies anytime.' : 'Sign in to access your assessment and policies.'}
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
            {['signin', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                style={{
                  flex: 1, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
                  background: mode === m ? 'var(--blue)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-muted)',
                  transition: 'background 180ms var(--crisp), color 180ms var(--crisp)',
                  boxShadow: mode === m ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="auth-email" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7 }}>Email</label>
              <input id="auth-email" type="email" required placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="input-premium" autoComplete="email" />
            </div>
            <div>
              <label htmlFor="auth-pass" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7 }}>Password</label>
              <input id="auth-pass" type="password" required placeholder="••••••••"
                value={pass} onChange={e => setPass(e.target.value)}
                className="input-premium" autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={8} />
              {isSignUp && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Minimum 8 characters</p>}
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: '#fca5a5', margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, padding: '13px 14px 13px 22px', marginTop: 4 }}>
              {loading ? (
                <>
                  <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  {isSignUp ? 'Creating account…' : 'Signing in…'}
                </>
              ) : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setError('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93b4fd', fontWeight: 600, fontSize: 13, padding: 0, transition: 'color 160ms' }}
              onMouseEnter={e => e.currentTarget.style.color = '#bfdbfe'}
              onMouseLeave={e => e.currentTarget.style.color = '#93b4fd'}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Just want to take the assessment?</p>
            <Link to="/assessment" className="btn-ghost" style={{ justifyContent: 'center', width: '100%', fontSize: 13 }}>
              Start free assessment — no account needed
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
