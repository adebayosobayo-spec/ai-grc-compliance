import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const PLANS = [
  { id:'basic',   label:'Policy Pack',    price:'$299', period:'one-time', desc:'7 customised policy documents in Word + PDF', popular:true },
  { id:'monthly', label:'Monthly Access', price:'$29',  period:'/ month',  desc:'Policy pack + ongoing updates + new templates' },
  { id:'annual',  label:'Annual',         price:'$199', period:'/ year',   desc:'Best value — all policies + priority support' },
]

const DOCS = [
  'AI Governance Policy',
  'Risk Assessment Framework',
  'Incident Response Plan',
  'Transparency & Explainability Policy',
  'Data Governance Policy',
  'Third-Party AI Vendor Policy',
  'ISO 42001 Readiness Report (PDF)',
]

export default function Policies() {
  const [selected, setSelected] = useState('basic')
  const [loading, setLoading]   = useState(false)
  const [paid, setPaid]         = useState(false)
  const [form, setForm]         = useState({ name:'', email:'', card:'', expiry:'', cvc:'' })
  const [error, setError]       = useState('')

  const company = (() => { try { return JSON.parse(localStorage.getItem('complai_company') || '{}') } catch { return {} } })()

  useEffect(() => {
    if (localStorage.getItem('complai_paid') === 'true') setPaid(true)
    if (company.email) setForm(f => ({ ...f, email: company.email }))
  }, [])

  const submit = async e => {
    e.preventDefault(); setError('')
    if (!form.name || !form.email || !form.card || !form.expiry || !form.cvc) {
      setError('Please fill in all payment details.'); return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    localStorage.setItem('complai_paid', 'true')
    setPaid(true); setLoading(false)
  }

  const plan = PLANS.find(p => p.id === selected)

  if (paid) return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh' }}>
      <nav className="nav">
        <Link to="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em', color: '#0F172A', textDecoration: 'none', marginRight: 'auto' }}>COMPLAI</Link>
        <Link to="/results" className="btn btn-secondary btn-sm">View results</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 52, height: 52, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22, color: '#059669', fontWeight: 700 }}>✓</div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Payment confirmed</div>
          <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', marginBottom: 12 }}>Your policies are ready</h1>
          <p style={{ fontSize: 15, color: '#475569' }}>7 customised documents, pre-filled with your company details.</p>
        </div>
        <div className="card">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Policy documents</span>
            <span className="badge badge-green">Ready to download</span>
          </div>
          {DOCS.map((doc, i) => (
            <div key={doc} style={{ padding: '14px 20px', borderBottom: i < DOCS.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#374151' }}>{doc}</span>
              <button className="btn btn-secondary btn-sm">Download ↓</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100dvh' }}>
      <nav className="nav">
        <Link to="/" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.04em', color: '#0F172A', textDecoration: 'none', marginRight: 'auto' }}>COMPLAI</Link>
        <Link to="/results" className="nav-link">View results</Link>
      </nav>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'flex-start' }}>

        <div>
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Policy Pack</div>
            <h1 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A', marginBottom: 10 }}>Get your investor-ready policies</h1>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.65 }}>7 policy documents customised to your company, pre-filled with your assessment data.</p>
          </div>

          {/* Plan selector */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Select a plan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLANS.map(p => (
                <button key={p.id} onClick={() => setSelected(p.id)}
                  style={{ background: selected === p.id ? '#ECFDF5' : '#fff', border: selected === p.id ? '2px solid #059669' : '1px solid #E2E8F0', borderRadius: 10, padding: '16px 20px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 150ms', fontFamily: 'Inter, sans-serif' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{p.label}</span>
                      {p.popular && <span className="badge badge-green" style={{ fontSize: 10 }}>Most popular</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>{p.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                    <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{p.price}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.period}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment form */}
          <form onSubmit={submit}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Payment details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Full name</label>
                    <input className="inp" type="text" placeholder="Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Email</label>
                    <input className="inp" type="email" placeholder="jane@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Card number</label>
                  <input className="inp mono" type="text" placeholder="4242 4242 4242 4242" value={form.card} onChange={e => setForm(f => ({ ...f, card: e.target.value }))} maxLength={19} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Expiry</label>
                    <input className="inp mono" type="text" placeholder="MM / YY" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} maxLength={7} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>CVC</label>
                    <input className="inp mono" type="text" placeholder="123" value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))} maxLength={4} />
                  </div>
                </div>
                {error && <div style={{ fontSize: 13, color: '#DC2626', padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FCA5A5' }}>{error}</div>}
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
                  style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading
                    ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Processing…</>
                    : `Pay ${plan?.price} — Get policies →`}
                </button>
                <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>30-day money-back guarantee · Secure payment</p>
              </div>
            </div>
          </form>
        </div>

        {/* Summary sidebar */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>What you'll receive</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {DOCS.map(d => (
                <li key={d} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#374151', alignItems: 'flex-start' }}>
                  <span style={{ color: '#059669', fontWeight: 700, flexShrink: 0 }}>✓</span>{d}
                </li>
              ))}
            </ul>
            <hr style={{ marginBottom: 20 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>{plan?.label}</span>
              <span className="mono" style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{plan?.price}</span>
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{plan?.period === 'one-time' ? 'One-time payment, no subscription' : `Billed ${plan?.period}`}</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
