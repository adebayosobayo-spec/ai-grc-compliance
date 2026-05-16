import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function statusOf(s) {
  if (s < 25) return { label:'NOT_READY',   tag:'tag-red',   color:'var(--red)',   bar:'var(--red)'   }
  if (s < 50) return { label:'DEVELOPING',  tag:'tag-amber', color:'var(--amber)', bar:'var(--amber)' }
  if (s < 75) return { label:'PROGRESSING', tag:'tag-blue',  color:'var(--blue)',  bar:'var(--blue)'  }
  return              { label:'READY',       tag:'tag-green', color:'var(--green)', bar:'var(--green)' }
}

function impTag(impact) {
  if (impact==='CRITICAL') return 'tag-red'
  if (impact==='HIGH')     return 'tag-amber'
  return 'tag-blue'
}

function useCount(target, ms=1200) {
  const [v,setV] = useState(0)
  useEffect(()=>{
    let id, t0=null
    const go=ts=>{
      if(!t0) t0=ts
      const p=Math.min((ts-t0)/ms,1)
      setV(Math.round((1-Math.pow(1-p,3))*target))
      if(p<1) id=requestAnimationFrame(go)
    }
    id=requestAnimationFrame(go)
    return ()=>cancelAnimationFrame(id)
  },[target,ms])
  return v
}

function BlockBar({ pct, total=30, color='var(--green)' }) {
  const [w, setW] = useState(0)
  useEffect(()=>{ const t=setTimeout(()=>setW(pct),100); return ()=>clearTimeout(t) },[pct])
  const f = Math.round((w/100)*total)
  return (
    <span style={{letterSpacing:0,fontSize:11}}>
      {Array.from({length:total},(_,i)=>(
        <span key={i} style={{color:i<f?color:'var(--t4)',transition:`color ${300+i*15}ms`}}>█</span>
      ))}
    </span>
  )
}

function RingScore({ score }) {
  const r=70, circ=2*Math.PI*r, offset=circ-(score/100)*circ
  const st=statusOf(score), display=useCount(score,1300)
  return (
    <div style={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
      <svg width={160} height={160} style={{transform:'rotate(-90deg)'}}>
        <circle cx={80} cy={80} r={r} fill="none" stroke="var(--grid2)" strokeWidth={6}/>
        <circle cx={80} cy={80} r={r} fill="none" stroke={st.color} strokeWidth={6}
          strokeLinecap="square" strokeDasharray={circ}
          className="ring-anim" style={{'--full':circ,'--gap':offset}}/>
      </svg>
      <div style={{position:'absolute',textAlign:'center',userSelect:'none'}}>
        <span style={{fontSize:40,fontWeight:700,color:st.color,lineHeight:1,
          fontFamily:'JetBrains Mono, monospace',fontVariantNumeric:'tabular-nums'}}>
          {display}%
        </span>
        <div style={{fontSize:9,color:'var(--t3)',marginTop:4,letterSpacing:'0.08em'}}>
          {st.label}
        </div>
      </div>
    </div>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [company, setCompany] = useState(null)

  useEffect(()=>{
    const r=localStorage.getItem('complai_results')
    const c=localStorage.getItem('complai_company')
    if(!r){navigate('/assessment');return}
    setResults(JSON.parse(r))
    if(c) setCompany(JSON.parse(c))
  },[navigate])

  if(!results) return null
  const {overallScore, sectionScores, topGaps} = results
  const st = statusOf(overallScore)

  return (
    <div style={{background:'var(--bg)',minHeight:'100dvh'}} className="term-in">

      {/* ── Nav ── */}
      <nav className="term-nav">
        <Link to="/" className="term-nav-cell" style={{color:'var(--green)',fontWeight:700,minWidth:120}}>
          COMPLAI
        </Link>
        <div className="term-nav-cell" style={{color:'var(--t3)',fontSize:10}}>
          ASSESSMENT_RESULTS
        </div>
        <div style={{flex:1,borderRight:'1px solid var(--grid)'}}/>
        <Link to="/assessment" className="term-nav-cell" style={{color:'var(--t2)',fontSize:12}}>
          RETAKE()
        </Link>
        <Link to="/policies" className="term-nav-cell term-nav-cta">
          ▶ GENERATE_POLICIES — $299
        </Link>
      </nav>

      {/* ── Status bar ── */}
      <div className="status-bar">
        <div className="status-cell">
          <div className={`status-dot ${overallScore>=75?'dot-green':overallScore>=50?'dot-amber':'dot-red'}`}/>
          <span style={{color:st.color}}>STATUS: {st.label}</span>
        </div>
        <div className="status-cell">
          COMPANY: <span style={{color:'var(--t1)',marginLeft:6}}>{company?.companyName||'—'}</span>
        </div>
        <div className="status-cell">
          SCORE: <span style={{color:st.color,marginLeft:6,fontWeight:700}}>{overallScore}%</span>
        </div>
        <div className="status-cell">
          GAPS_FOUND: <span style={{color:'var(--red)',marginLeft:6}}>{topGaps.length}</span>
        </div>
        <div style={{flex:1}}/>
        <div className="status-cell" style={{borderLeft:'1px solid var(--grid)',borderRight:'none',fontSize:9}}>
          ISO_42001:2023 SELF-ASSESSMENT · NOT_A_FORMAL_AUDIT
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{display:'grid',gridTemplateColumns:'300px 1fr',
        minHeight:'calc(100dvh - 72px)'}}
        className="max-md:grid-cols-1">

        {/* Left column: score + quick stats */}
        <div style={{borderRight:'1px solid var(--grid)',display:'flex',flexDirection:'column'}}>

          {/* Score panel */}
          <div style={{padding:'32px 24px',borderBottom:'1px solid var(--grid)',
            display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
            <div style={{fontSize:10,color:'var(--t3)',letterSpacing:'0.08em',alignSelf:'flex-start'}}>
              OVERALL_READINESS_SCORE
            </div>
            <RingScore score={overallScore}/>
            <div className={`tag ${st.tag}`} style={{alignSelf:'stretch',textAlign:'center',padding:'8px'}}>
              {st.label}
            </div>
            <p style={{fontSize:11,color:'var(--t2)',lineHeight:1.7,textAlign:'center'}}>
              {overallScore<50
                ? 'Multiple critical gaps. Significant risk in investor due diligence.'
                : overallScore<75
                ? 'Good foundation. Address gaps before fundraising.'
                : 'Strong posture. Formalise with signed policies.'}
            </p>
          </div>

          {/* Section mini-scores */}
          <div style={{flex:1}}>
            {sectionScores.map((s,i)=>{
              const ss=statusOf(s.score)
              return (
                <div key={s.id} style={{
                  display:'grid',gridTemplateColumns:'40px 1fr 50px',
                  gap:0, padding:'10px 16px', alignItems:'center',
                  borderBottom:i<sectionScores.length-1?'1px solid var(--grid)':'none',
                }}>
                  <span style={{fontSize:10,color:'var(--t3)',fontWeight:600}}>{s.id}</span>
                  <div>
                    <div style={{fontSize:9,color:'var(--t3)',marginBottom:4,
                      letterSpacing:'0.04em',overflow:'hidden',whiteSpace:'nowrap',
                      textOverflow:'ellipsis'}}>{s.title}</div>
                    <BlockBar pct={s.score} total={16} color={ss.color}/>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:ss.color,
                    textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{s.score}%</span>
                </div>
              )
            })}
          </div>

          {/* Generate CTA */}
          <div style={{padding:16,borderTop:'1px solid var(--grid)'}}>
            <Link to="/policies" className="tbtn tbtn-solid"
              style={{width:'100%',justifyContent:'center',fontSize:12}}>
              ▶ GENERATE_POLICIES()
            </Link>
            <p style={{fontSize:10,color:'var(--t3)',textAlign:'center',marginTop:8}}>
              $299 · ONE_TIME · 30_DAY_GUARANTEE
            </p>
          </div>
        </div>

        {/* Right column: gap table + detail */}
        <div>

          {/* Control detail table */}
          <div style={{borderBottom:'1px solid var(--grid)'}}>
            <div style={{padding:'8px 20px',borderBottom:'1px solid var(--grid)',
              background:'var(--bg1)',fontSize:10,color:'var(--t3)',
              display:'flex',gap:16,alignItems:'center'}}>
              <span style={{color:'var(--green)',fontWeight:700}}>CONTROL_BREAKDOWN</span>
              <span>│</span>
              <span>6 ISO 42001 CONTROL AREAS</span>
            </div>

            {/* Table header */}
            <div style={{display:'grid',gridTemplateColumns:'60px 200px 1fr 60px 120px',
              gap:0,borderBottom:'1px solid var(--grid)',
              padding:'8px 20px',background:'var(--bg2)'}}>
              {['CTRL','AREA','COVERAGE','SCORE','STATUS'].map(h=>(
                <span key={h} style={{fontSize:9,color:'var(--t4)',fontWeight:700,letterSpacing:'0.08em'}}>{h}</span>
              ))}
            </div>

            {sectionScores.map((s,i)=>{
              const ss=statusOf(s.score)
              return (
                <div key={s.id} style={{display:'grid',
                  gridTemplateColumns:'60px 200px 1fr 60px 120px',
                  gap:0,padding:'12px 20px',alignItems:'center',
                  borderBottom:i<sectionScores.length-1?'1px solid var(--grid)':'none',
                  background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                  <span style={{fontSize:10,color:'var(--green)',fontWeight:700}}>{s.id}</span>
                  <span style={{fontSize:10,color:'var(--t2)',overflow:'hidden',
                    whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{s.title}</span>
                  <BlockBar pct={s.score} total={20} color={ss.color}/>
                  <span style={{fontSize:13,fontWeight:700,color:ss.color,
                    fontVariantNumeric:'tabular-nums'}}>{s.score}%</span>
                  <div className={`tag ${ss.tag}`} style={{fontSize:9}}>{ss.label}</div>
                </div>
              )
            })}
          </div>

          {/* Top gaps */}
          {topGaps.length>0 && (
            <div>
              <div style={{padding:'8px 20px',borderBottom:'1px solid var(--grid)',
                background:'var(--bg1)',fontSize:10,color:'var(--t3)',
                display:'flex',gap:16,alignItems:'center'}}>
                <span style={{color:'var(--red)',fontWeight:700}}>PRIORITY_GAPS</span>
                <span>│</span>
                <span>TOP {topGaps.length} GAPS BY INVESTOR IMPACT</span>
              </div>
              {topGaps.map((gap,i)=>(
                <div key={i} style={{display:'grid',
                  gridTemplateColumns:'36px 80px 120px 1fr',
                  gap:12,padding:'14px 20px',alignItems:'flex-start',
                  borderBottom:i<topGaps.length-1?'1px solid var(--grid)':'none'}}>
                  <span style={{fontSize:11,fontWeight:700,color:'var(--t3)',
                    fontFamily:'JetBrains Mono,monospace'}}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <div className={`tag ${impTag(gap.impact)}`} style={{fontSize:9,alignSelf:'flex-start'}}>
                    {gap.impact}
                  </div>
                  <span style={{fontSize:9,color:'var(--t3)',letterSpacing:'0.04em',paddingTop:2}}>
                    {gap.section}_{gap.sectionTitle.split('_')[0]}
                  </span>
                  <span style={{fontSize:12,color:'var(--t1)',lineHeight:1.6}}>{gap.question}</span>
                </div>
              ))}
            </div>
          )}

          {/* Email capture */}
          <div style={{padding:'20px',borderTop:'1px solid var(--grid)',
            display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',
            background:'var(--bg1)'}}>
            <span style={{fontSize:11,color:'var(--t2)',flex:1,minWidth:200}}>
              EMAIL_REPORT() → get a copy of this assessment in your inbox
            </span>
            <div style={{display:'flex',gap:0}}>
              <input type="email" defaultValue={company?.email||''}
                placeholder="ceo@company.com" className="term-input"
                style={{width:220,borderRight:'none'}}/>
              <button className="tbtn tbtn-green" style={{borderLeft:'none',fontSize:12}}>
                SEND()
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
