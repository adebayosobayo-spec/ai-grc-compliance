import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const POLICIES = [
  {n:1,title:'AI_GOVERNANCE_POLICY',              desc:'Governance framework, roles, board review, approval processes.',              pages:'3–4p'},
  {n:2,title:'DATA_GOVERNANCE_POLICY',             desc:'Quality standards, bias mitigation, privacy controls, training data docs.',   pages:'4–5p'},
  {n:3,title:'DEVELOPMENT_&_TESTING_POLICY',       desc:'Bias, adversarial & fairness testing, version control, deployment gates.',   pages:'4–5p'},
  {n:4,title:'DEPLOYMENT_&_MONITORING_POLICY',     desc:'Checklists, real-time monitoring, incident tiers, audit logging.',           pages:'4–5p'},
  {n:5,title:'THIRD_PARTY_VENDOR_POLICY',          desc:'Vendor approval, DPA requirements, approved register, breach escalation.',   pages:'3–4p'},
  {n:6,title:'ETHICS_&_BIAS_MITIGATION_POLICY',    desc:'Ethics principles, bias testing standards, user transparency obligations.',  pages:'4–5p'},
  {n:7,title:'INCIDENT_RESPONSE_POLICY',           desc:'Incident tiers (CRITICAL/HIGH/MEDIUM), response, post-incident review.',    pages:'3–4p'},
]

const PLANS = [
  { id:'one_time', name:'POLICY_GENERATOR', price:'$299', period:'ONE_TIME',
    badge:null,
    features:['7 ISO 42001 policies (.docx)','Pre-filled with company details','All 7 core policy areas','PDF readiness report','3 months update emails','30-day refund guarantee'],
    cta:'PURCHASE_POLICY_GENERATOR()' },
  { id:'combo', name:'POLICIES_+_UPDATES', price:'$299+$29/mo', period:'ONE_TIME_+_MONTHLY',
    badge:'BEST_VALUE',
    features:['Everything in POLICY_GENERATOR','Monthly policy updates','ISO 42001 change alerts','Ongoing compliance guidance','Priority support','CANCEL_ANYTIME'],
    cta:'PURCHASE_COMBO()' },
  { id:'monthly', name:'MONTHLY_UPDATES', price:'$29/mo', period:'PER_MONTH',
    badge:null,
    features:['Monthly update notifications','ISO 42001 change alerts','Updated policy templates','CANCEL_ANYTIME'],
    cta:'SUBSCRIBE_UPDATES()' },
]

export default function Policies() {
  const [paid, setPaid]       = useState(false)
  const [selected, setSelected] = useState('one_time')
  const [company, setCompany] = useState(null)
  const [form, setForm]       = useState({email:'',card:'',expiry:'',cvc:''})
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState('')

  useEffect(()=>{
    const p=localStorage.getItem('complai_paid')
    const c=localStorage.getItem('complai_company')
    if(p) setPaid(true)
    if(c) setCompany(JSON.parse(c))
    else setForm(f=>({...f,email:''}))
  },[])

  useEffect(()=>{
    const c=localStorage.getItem('complai_company')
    if(c) { const parsed=JSON.parse(c); setForm(f=>({...f,email:parsed.email||''})) }
  },[])

  const fmtCard   = v=>v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const fmtExpiry = v=>v.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2')

  const plan = PLANS.find(p=>p.id===selected)

  const pay = async e => {
    e.preventDefault(); setErr('')
    if(!form.email||!form.card||!form.expiry||!form.cvc){setErr('ERR: ALL_FIELDS_REQUIRED');return}
    setLoading(true)
    await new Promise(r=>setTimeout(r,1800))
    localStorage.setItem('complai_paid',JSON.stringify({plan:plan?.id,date:new Date().toISOString()}))
    setLoading(false); setPaid(true)
  }

  if (paid) return (
    <div style={{background:'var(--bg)',minHeight:'100dvh'}} className="term-in">
      <nav className="term-nav">
        <Link to="/" className="term-nav-cell" style={{color:'var(--green)',fontWeight:700,minWidth:120}}>COMPLAI</Link>
        <div className="term-nav-cell" style={{color:'var(--green)',fontSize:10}}>
          PURCHASE_COMPLETE
        </div>
        <div style={{flex:1,borderRight:'1px solid var(--grid)'}}/>
        <Link to="/results" className="term-nav-cell" style={{color:'var(--t2)'}}>VIEW_RESULTS()</Link>
      </nav>

      <div className="status-bar">
        <div className="status-cell">
          <div className="status-dot dot-green"/>
          <span style={{color:'var(--green)'}}>PAYMENT_CONFIRMED</span>
        </div>
        <div className="status-cell">
          POLICIES: <span style={{color:'var(--green)',marginLeft:6,fontWeight:700}}>7/7 READY</span>
        </div>
        <div className="status-cell">
          COMPANY: <span style={{color:'var(--t1)',marginLeft:6}}>{company?.companyName||'—'}</span>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'40px 32px'}}>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:'var(--green)',fontWeight:700,letterSpacing:'0.1em',marginBottom:12}}>
            ▸ DOWNLOAD_CENTER — ALL_FILES_READY
          </div>
          <h1 style={{fontSize:'clamp(20px,3.5vw,30px)',fontWeight:700,color:'var(--t1)',
            letterSpacing:'-0.02em',marginBottom:8}}>
            POLICIES_GENERATED()
          </h1>
          <p style={{fontSize:12,color:'var(--t2)',lineHeight:1.7}}>
            Pre-filled with {company?.companyName||'your company'}'s details.
            Review → sign → file with your compliance team.
          </p>
        </div>

        <div className="tbox scan-stagger">
          <div className="tbox-header">
            <span style={{color:'var(--green)'}}>●</span>
            ISO_42001_POLICY_PACKAGE — 7_DOCUMENTS
          </div>
          {POLICIES.map((p,i)=>(
            <div key={p.n} style={{display:'grid',gridTemplateColumns:'36px 1fr 60px 120px',
              gap:16,padding:'12px 16px',alignItems:'center',
              borderBottom:i<POLICIES.length-1?'1px solid var(--grid)':'none',
              background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
              <span style={{fontSize:10,fontWeight:700,color:'var(--green)',fontVariantNumeric:'tabular-nums'}}>
                {String(p.n).padStart(2,'0')}
              </span>
              <div>
                <p style={{fontSize:11,fontWeight:600,color:'var(--t1)',marginBottom:2}}>{p.title}</p>
                <p style={{fontSize:10,color:'var(--t3)'}}>{p.desc}</p>
              </div>
              <span style={{fontSize:10,color:'var(--t3)'}}>{p.pages}</span>
              <button className="tbtn tbtn-green" style={{fontSize:11,justifyContent:'center'}}>
                ↓ DOWNLOAD()
              </button>
            </div>
          ))}
          <div style={{display:'grid',gridTemplateColumns:'36px 1fr 60px 120px',
            gap:16,padding:'12px 16px',alignItems:'center'}}>
            <span style={{fontSize:10,fontWeight:700,color:'var(--amber)'}}>PDF</span>
            <div>
              <p style={{fontSize:11,fontWeight:600,color:'var(--t1)',marginBottom:2}}>
                ISO_42001_READINESS_REPORT.pdf
              </p>
              <p style={{fontSize:10,color:'var(--t3)'}}>8–12 pages · Investor-ready · Includes implementation roadmap</p>
            </div>
            <span style={{fontSize:10,color:'var(--t3)'}}>8–12p</span>
            <button className="tbtn tbtn-amber" style={{fontSize:11,justifyContent:'center'}}>
              ↓ EXPORT_PDF()
            </button>
          </div>
        </div>

        <div style={{marginTop:16,textAlign:'center'}}>
          <Link to="/results" style={{fontSize:11,color:'var(--t3)',textDecoration:'none'}}>
            ← BACK_TO_RESULTS()
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{background:'var(--bg)',minHeight:'100dvh'}} className="term-in">
      <nav className="term-nav">
        <Link to="/" className="term-nav-cell" style={{color:'var(--green)',fontWeight:700,minWidth:120}}>COMPLAI</Link>
        <div className="term-nav-cell" style={{color:'var(--t3)',fontSize:10}}>POLICY_GENERATOR</div>
        <div style={{flex:1,borderRight:'1px solid var(--grid)'}}/>
        <Link to="/results" className="term-nav-cell" style={{color:'var(--t2)'}}>← RESULTS()</Link>
      </nav>

      <div className="status-bar">
        <div className="status-cell">
          <div className="status-dot dot-amber"/>
          <span>AWAITING_PAYMENT</span>
        </div>
        <div className="status-cell">
          SELECTED: <span style={{color:'var(--green)',marginLeft:6}}>{plan?.name}</span>
        </div>
        <div className="status-cell">
          AMOUNT: <span style={{color:'var(--amber)',marginLeft:6,fontWeight:700}}>{plan?.price}</span>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 380px',minHeight:'calc(100dvh - 72px)'}}
        className="max-md:grid-cols-1">

        {/* Left: plan selection + policy list */}
        <div style={{borderRight:'1px solid var(--grid)'}}>

          {/* Plan selector */}
          <div style={{borderBottom:'1px solid var(--grid)'}}>
            <div style={{padding:'8px 20px',borderBottom:'1px solid var(--grid)',
              background:'var(--bg1)',fontSize:10,color:'var(--t3)',
              display:'flex',gap:12,alignItems:'center'}}>
              <span style={{color:'var(--green)',fontWeight:700}}>SELECT_PLAN</span>
              <span>│</span>
              <span>3_TIERS_AVAILABLE</span>
            </div>
            {PLANS.map((p,i)=>{
              const active=selected===p.id
              return (
                <button key={p.id} onClick={()=>setSelected(p.id)}
                  style={{width:'100%',textAlign:'left',border:'none',cursor:'pointer',
                    padding:'16px 20px',borderBottom:i<2?'1px solid var(--grid)':'none',
                    background:active?'var(--green2)':'transparent',
                    borderLeft:active?`3px solid var(--green)`:'3px solid transparent',
                    transition:'background 120ms,border-color 120ms'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{fontSize:11,color:active?'var(--green)':'var(--t2)',fontWeight:700}}>
                        [{active?'●':' '}] {p.name}
                      </span>
                      {p.badge&&<div className="tag tag-amber" style={{fontSize:9}}>{p.badge}</div>}
                    </div>
                    <span style={{fontSize:15,fontWeight:700,color:active?'var(--green)':'var(--t1)',
                      fontVariantNumeric:'tabular-nums'}}>{p.price}</span>
                  </div>
                  {active&&(
                    <ul style={{marginTop:10,listStyle:'none',padding:'0 0 0 22px',
                      display:'flex',flexDirection:'column',gap:4}}>
                      {p.features.map(f=>(
                        <li key={f} style={{fontSize:10,color:'var(--t2)',display:'flex',gap:8}}>
                          <span style={{color:'var(--green)'}}>▸</span>{f}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              )
            })}
          </div>

          {/* Policy list */}
          <div>
            <div style={{padding:'8px 20px',borderBottom:'1px solid var(--grid)',
              background:'var(--bg1)',fontSize:10,color:'var(--t3)',
              display:'flex',gap:12,alignItems:'center'}}>
              <span style={{color:'var(--t2)',fontWeight:700}}>INCLUDED_DOCUMENTS</span>
              <span>│</span>
              <span>7 POLICY FILES (.DOCX)</span>
            </div>
            {POLICIES.map((p,i)=>(
              <div key={p.n} style={{display:'grid',gridTemplateColumns:'36px 1fr 60px',
                gap:12,padding:'10px 20px',alignItems:'center',
                borderBottom:i<POLICIES.length-1?'1px solid var(--grid)':'none',
                background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                <span style={{fontSize:10,fontWeight:700,color:'var(--t3)',fontVariantNumeric:'tabular-nums'}}>
                  {String(p.n).padStart(2,'0')}
                </span>
                <div>
                  <p style={{fontSize:11,fontWeight:600,color:'var(--t1)',marginBottom:1}}>{p.title}</p>
                  <p style={{fontSize:10,color:'var(--t3)',lineHeight:1.5}}>{p.desc}</p>
                </div>
                <span style={{fontSize:10,color:'var(--t4)',textAlign:'right'}}>{p.pages}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: payment terminal */}
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{padding:'8px 16px',borderBottom:'1px solid var(--grid)',
            background:'var(--bg1)',fontSize:10,color:'var(--t3)',
            display:'flex',gap:12,alignItems:'center'}}>
            <span style={{color:'var(--amber)',fontWeight:700}}>PAYMENT_TERMINAL</span>
          </div>

          <form onSubmit={pay} style={{flex:1,display:'flex',flexDirection:'column'}}>
            {/* Order summary */}
            <div style={{padding:'16px',borderBottom:'1px solid var(--grid)',background:'var(--bg2)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:11,color:'var(--t3)'}}>PRODUCT</span>
                <span style={{fontSize:11,color:'var(--t1)',fontWeight:600}}>{plan?.name}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:11,color:'var(--t3)'}}>BILLING</span>
                <span style={{fontSize:11,color:'var(--t1)'}}>{plan?.period}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',
                borderTop:'1px solid var(--grid)',paddingTop:8,marginTop:4}}>
                <span style={{fontSize:13,color:'var(--t2)',fontWeight:700}}>TOTAL</span>
                <span style={{fontSize:18,fontWeight:700,color:'var(--amber)',fontVariantNumeric:'tabular-nums'}}>
                  {plan?.price}
                </span>
              </div>
            </div>

            {/* Form fields */}
            <div style={{flex:1}}>
              {[
                {id:'email',label:'BILLING_EMAIL',type:'email',placeholder:'ceo@company.com',
                  val:form.email,onChange:v=>setForm(p=>({...p,email:v}))},
              ].map(f=>(
                <div key={f.id} style={{display:'grid',gridTemplateColumns:'130px 1fr',
                  borderBottom:'1px solid var(--grid)'}}>
                  <label style={{padding:'12px',fontSize:10,color:'var(--t3)',fontWeight:600,
                    letterSpacing:'0.04em',borderRight:'1px solid var(--grid)',
                    background:'var(--bg1)',display:'flex',alignItems:'center'}}>
                    {f.label}
                  </label>
                  <input type={f.type} required placeholder={f.placeholder}
                    value={f.val} onChange={e=>f.onChange(e.target.value)}
                    className="term-input" style={{border:'none',padding:'12px'}}/>
                </div>
              ))}

              <div style={{display:'grid',gridTemplateColumns:'130px 1fr',
                borderBottom:'1px solid var(--grid)'}}>
                <label style={{padding:'12px',fontSize:10,color:'var(--t3)',fontWeight:600,
                  letterSpacing:'0.04em',borderRight:'1px solid var(--grid)',
                  background:'var(--bg1)',display:'flex',alignItems:'center'}}>
                  CARD_NUMBER
                </label>
                <input type="text" required placeholder="1234 5678 9012 3456" maxLength={19}
                  value={form.card} onChange={e=>setForm(p=>({...p,card:fmtCard(e.target.value)}))}
                  className="term-input" style={{border:'none',padding:'12px',fontVariantNumeric:'tabular-nums'}}/>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderBottom:'1px solid var(--grid)'}}>
                <div style={{display:'grid',gridTemplateColumns:'100px 1fr',borderRight:'1px solid var(--grid)'}}>
                  <label style={{padding:'12px',fontSize:10,color:'var(--t3)',fontWeight:600,
                    letterSpacing:'0.04em',borderRight:'1px solid var(--grid)',
                    background:'var(--bg1)',display:'flex',alignItems:'center'}}>
                    EXPIRY
                  </label>
                  <input type="text" required placeholder="MM/YY" maxLength={5}
                    value={form.expiry} onChange={e=>setForm(p=>({...p,expiry:fmtExpiry(e.target.value)}))}
                    className="term-input" style={{border:'none',padding:'12px'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'60px 1fr'}}>
                  <label style={{padding:'12px',fontSize:10,color:'var(--t3)',fontWeight:600,
                    letterSpacing:'0.04em',borderRight:'1px solid var(--grid)',
                    background:'var(--bg1)',display:'flex',alignItems:'center'}}>
                    CVC
                  </label>
                  <input type="text" required placeholder="123" maxLength={4}
                    value={form.cvc} onChange={e=>setForm(p=>({...p,cvc:e.target.value.replace(/\D/g,'').slice(0,4)}))}
                    className="term-input" style={{border:'none',padding:'12px'}}/>
                </div>
              </div>
            </div>

            {err&&(
              <div style={{padding:'10px 16px',background:'rgba(239,68,68,0.08)',
                borderTop:'1px solid var(--red)',fontSize:11,color:'var(--red)'}}>
                {err}
              </div>
            )}

            <div style={{padding:'16px',borderTop:'1px solid var(--grid)'}}>
              <button type="submit" disabled={loading} className="tbtn tbtn-solid"
                style={{width:'100%',justifyContent:'center',fontSize:13,
                  opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer'}}>
                {loading
                  ? <><div style={{width:13,height:13,border:'2px solid rgba(0,0,0,0.2)',
                      borderTopColor:'var(--bg)',borderRadius:'50%',
                      animation:'spin 0.7s linear infinite'}}/> PROCESSING_PAYMENT…</>
                  : <>▶ {plan?.cta}</>
                }
              </button>
              <p style={{fontSize:10,color:'var(--t3)',textAlign:'center',marginTop:10}}>
                SECURED_BY_STRIPE · 30_DAY_REFUND_GUARANTEE
              </p>
            </div>
          </form>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </div>
  )
}
