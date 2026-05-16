import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode]   = useState('signin')
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
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
    } catch (err) { setError(err.message || 'AUTH_ERROR: UNEXPECTED_FAILURE') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div style={{ background:'var(--bg)', minHeight:'100dvh', display:'flex', flexDirection:'column' }}
      className="term-in">
      <nav className="term-nav">
        <Link to="/" className="term-nav-cell" style={{ color:'var(--green)', fontWeight:700, minWidth:120 }}>COMPLAI</Link>
        <div className="term-nav-cell" style={{ color:'var(--green)', fontSize:10 }}>EMAIL_SENT</div>
      </nav>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div className="tbox" style={{ maxWidth:480, width:'100%' }}>
          <div className="tbox-header">
            <span style={{ color:'var(--green)' }}>●</span>
            CONFIRM_EMAIL — ACTION_REQUIRED
          </div>
          <div className="tbox-body">
            <p style={{ fontSize:13, color:'var(--t1)', marginBottom:12, fontWeight:600 }}>
              VERIFICATION_EMAIL_SENT()
            </p>
            <p style={{ fontSize:12, color:'var(--t2)', lineHeight:1.7, marginBottom:20 }}>
              Sent to: <span style={{ color:'var(--green)' }}>{email}</span><br/>
              Click the link in the email to activate your account.
            </p>
            <Link to="/" className="tbtn" style={{ fontSize:12 }}>← BACK_TO_HOME()</Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--bg)', minHeight:'100dvh', display:'flex', flexDirection:'column' }}
      className="term-in">
      <nav className="term-nav">
        <Link to="/" className="term-nav-cell" style={{ color:'var(--green)', fontWeight:700, minWidth:120 }}>COMPLAI</Link>
        <div className="term-nav-cell" style={{ color:'var(--t3)', fontSize:10 }}>
          {isSignUp ? 'CREATE_ACCOUNT' : 'AUTHENTICATE'}
        </div>
        <div style={{ flex:1, borderRight:'1px solid var(--grid)' }}/>
        <Link to="/assessment" className="term-nav-cell" style={{ color:'var(--t2)', fontSize:12 }}>
          SKIP → FREE_ASSESSMENT()
        </Link>
      </nav>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div style={{ maxWidth:500, width:'100%' }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:10, color:'var(--green)', fontWeight:700,
              letterSpacing:'0.1em', marginBottom:10 }}>
              ▸ {isSignUp ? 'REGISTER_NEW_ACCOUNT()' : 'AUTHENTICATE_USER()'}
            </div>
            <h1 style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:700, color:'var(--t1)',
              letterSpacing:'-0.02em', marginBottom:6 }}>
              {isSignUp ? 'CREATE_ACCOUNT()' : 'SIGN_IN()'}
            </h1>
            <p style={{ fontSize:12, color:'var(--t2)', lineHeight:1.7 }}>
              {isSignUp
                ? 'Save your assessment results and access policies anytime.'
                : 'Access your assessment results and policy downloads.'}
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{ display:'flex', marginBottom:20, borderBottom:'1px solid var(--grid)' }}>
            {['signin','signup'].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError('')}}
                style={{ flex:1, padding:'10px 16px', background:mode===m?'var(--green2)':'transparent',
                  border:'none', borderRight:m==='signin'?'1px solid var(--grid)':'none',
                  borderBottom:mode===m?`2px solid var(--green)`:'2px solid transparent',
                  cursor:'pointer', fontSize:12, fontWeight:700,
                  color:mode===m?'var(--green)':'var(--t3)',
                  fontFamily:'JetBrains Mono, monospace',
                  letterSpacing:'0.04em', transition:'all 120ms' }}>
                {m==='signin'?'SIGN_IN()':'REGISTER()'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div className="tbox">
              <div style={{ display:'grid', gridTemplateColumns:'140px 1fr',
                borderBottom:'1px solid var(--grid)' }}>
                <label htmlFor="auth-email"
                  style={{ padding:'12px', fontSize:10, color:'var(--t3)', fontWeight:600,
                    letterSpacing:'0.04em', borderRight:'1px solid var(--grid)',
                    background:'var(--bg1)', display:'flex', alignItems:'center' }}>
                  EMAIL_ADDRESS
                </label>
                <input id="auth-email" type="email" required placeholder="ceo@company.com"
                  value={email} onChange={e=>setEmail(e.target.value)}
                  className="term-input" style={{ border:'none', padding:'12px' }}
                  autoComplete="email"/>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'140px 1fr' }}>
                <label htmlFor="auth-pass"
                  style={{ padding:'12px', fontSize:10, color:'var(--t3)', fontWeight:600,
                    letterSpacing:'0.04em', borderRight:'1px solid var(--grid)',
                    background:'var(--bg1)', display:'flex', alignItems:'center' }}>
                  PASSWORD
                </label>
                <input id="auth-pass" type="password" required placeholder="••••••••"
                  value={pass} onChange={e=>setPass(e.target.value)}
                  className="term-input" style={{ border:'none', padding:'12px' }}
                  autoComplete={isSignUp?'new-password':'current-password'} minLength={8}/>
              </div>

              {error && (
                <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.08)',
                  borderTop:'1px solid var(--red)', fontSize:11, color:'var(--red)' }}>
                  {error}
                </div>
              )}

              <div style={{ padding:14, borderTop:'1px solid var(--grid)', background:'var(--bg2)' }}>
                <button type="submit" disabled={loading} className="tbtn tbtn-solid"
                  style={{ width:'100%', justifyContent:'center', fontSize:13,
                    opacity:loading?0.7:1, cursor:loading?'not-allowed':'pointer' }}>
                  {loading
                    ? <><div style={{ width:13, height:13, border:'2px solid rgba(0,0,0,0.2)',
                        borderTopColor:'var(--bg)', borderRadius:'50%',
                        animation:'spin 0.7s linear infinite' }}/> AUTHENTICATING…</>
                    : `▶ ${isSignUp ? 'CREATE_ACCOUNT()' : 'SIGN_IN()'}`
                  }
                </button>
                {isSignUp && <p style={{ fontSize:10, color:'var(--t3)', textAlign:'center', marginTop:8 }}>
                  MIN_PASSWORD_LENGTH: 8_CHARS
                </p>}
              </div>
            </div>
          </form>

          <div style={{ marginTop:16, textAlign:'center' }}>
            <span style={{ fontSize:11, color:'var(--t3)' }}>
              {isSignUp ? 'ALREADY_REGISTERED? ' : 'NO_ACCOUNT? '}
            </span>
            <button onClick={()=>{setMode(isSignUp?'signin':'signup');setError('')}}
              style={{ background:'none', border:'none', cursor:'pointer',
                color:'var(--green)', fontSize:11, fontWeight:700,
                fontFamily:'JetBrains Mono, monospace', padding:0 }}>
              {isSignUp ? 'SIGN_IN()' : 'REGISTER()'}
            </button>
          </div>

          <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid var(--grid)',
            textAlign:'center' }}>
            <p style={{ fontSize:10, color:'var(--t3)', marginBottom:10 }}>
              NO_ACCOUNT_REQUIRED_FOR_FREE_ASSESSMENT
            </p>
            <Link to="/assessment" className="tbtn tbtn-green"
              style={{ fontSize:12, width:'100%', justifyContent:'center', display:'flex' }}>
              ▶ RUN_FREE_ASSESSMENT()
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
