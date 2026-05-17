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

  const submit = async e => {
    e.preventDefault(); setError('')
    setLoading(true)
    try {
      if (isSignUp) { await signUp(email, pass); setDone(true) }
      else { await signIn(email, pass); navigate('/results') }
    } catch (err) { setError(err.message || 'Authentication failed. Please try again.') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <nav className="nav">
        <Link to="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em', color: '#0F172A', textDecoration: 'none' }}>COMPLAI</Link>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 22, color: '#059669', fontWeight: 700 }}>✓</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 10 }}>Check your inbox</h1>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.65, marginBottom: 8 }}>We sent a confirmation link to</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 28 }}>{email}</p>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 28 }}>Click the link in the email to activate your account.</p>
          <Link to="/" className="btn btn-secondary" style={{ justifyContent: 'center', display: 'inline-flex' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <nav className="nav">
        <Link to="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em', color: '#0F172A', textDecoration: 'none', marginRight: 'auto' }}>COMPLAI</Link>
        <Link to="/assessment" className="nav-link">Skip → free assessment</Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <div style={{ marginBottom: 28 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{isSignUp ? 'Create account' : 'Sign in'}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', marginBottom: 8 }}>
              {isSignUp ? 'Get started' : 'Welcome back'}
            </h1>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
              {isSignUp ? 'Save your results and access your policies anytime.' : 'Access your assessment results and policy documents.'}
            </p>
          </div>

          <div style={{ display: 'flex', marginBottom: 24, background: '#F1F5F9', borderRadius: 10, padding: 4 }}>
            {[['signin','Sign in'],['signup','Create account']].map(([m, l]) => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                style={{ flex: 1, padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'all 150ms', background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#0F172A' : '#64748B', boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                {l}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="auth-email" style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Email address</label>
                <input id="auth-email" type="email" required placeholder="ceo@company.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="inp" autoComplete="email" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="auth-pass" style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Password</label>
                <input id="auth-pass" type="password" required placeholder="••••••••"
                  value={pass} onChange={e => setPass(e.target.value)}
                  className="inp" autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={8} />
                {isSignUp && <p style={{ fontSize: 12, color: '#94A3B8' }}>Minimum 8 characters</p>}
              </div>
              {error && (
                <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, fontSize: 13, color: '#DC2626' }}>{error}</div>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
                style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {loading
                  ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> {isSignUp ? 'Creating account…' : 'Signing in…'}</>
                  : isSignUp ? 'Create account →' : 'Sign in →'}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setError('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', padding: 0 }}>
              {isSignUp ? 'Sign in' : 'Create account'}
            </button>
          </div>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 14 }}>No account needed for the free assessment</p>
            <Link to="/assessment" className="btn btn-secondary" style={{ justifyContent: 'center', display: 'flex' }}>
              Run free assessment →
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
