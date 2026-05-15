import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* ── helpers ─────────────────────────────────────────────────────── */
function scoreStatus(score) {
  if (score < 25)  return { label: 'Not Ready',   desc: 'Urgent action needed',        stroke: '#ef4444', text: 'text-red-400',     badge: 'bg-red-500/10 border border-red-500/30 text-red-400'        }
  if (score < 50)  return { label: 'Developing',  desc: 'Multiple gaps to address',     stroke: '#f59e0b', text: 'text-amber-400',   badge: 'bg-amber-500/10 border border-amber-500/30 text-amber-400'   }
  if (score < 75)  return { label: 'Progressing', desc: 'Good foundation, refine gaps', stroke: '#3b82f6', text: 'text-blue-400',    badge: 'bg-blue-500/10 border border-blue-500/30 text-blue-400'    }
  return             { label: 'Ready',       desc: 'Investor-ready governance',   stroke: '#10b981', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' }
}

function barColor(score) {
  if (score < 25)  return { bg: 'bg-red-500',     text: 'text-red-400'     }
  if (score < 50)  return { bg: 'bg-amber-500',   text: 'text-amber-400'   }
  if (score < 75)  return { bg: 'bg-blue-400',    text: 'text-blue-400'    }
  return             { bg: 'bg-emerald-500', text: 'text-emerald-400' }
}

function impactCls(impact) {
  if (impact === 'CRITICAL') return 'bg-red-500/10 border border-red-500/30 text-red-400'
  if (impact === 'HIGH')     return 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
  return                            'bg-blue-500/10 border border-blue-500/30 text-blue-400'
}

/* ── Animated score number (count-up) ───────────────────────────── */
function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, duration])
  return display
}

/* ── SVG score ring (stroke animates in from 0 → score) ─────────── */
function ScoreRing({ score }) {
  const status = scoreStatus(score)
  const r      = 56
  const circ   = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const count  = useCountUp(score)

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg width="148" height="148" viewBox="0 0 148 148" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="74" cy="74" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11" />
        {/* Fill — animated via CSS using custom properties */}
        <circle
          cx="74" cy="74" r={r}
          fill="none"
          stroke={status.stroke}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circ}
          className="score-ring-fill"
          style={{
            '--circ': circ,
            '--offset': offset,
            filter: `drop-shadow(0 0 6px ${status.stroke}60)`,
          }}
        />
      </svg>
      <div className="absolute text-center select-none">
        <p className={`text-4xl font-black tabular-nums ${status.text}`}>{count}%</p>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">{status.label}</p>
      </div>
    </div>
  )
}

/* ── Animated bar (width grows in on mount) ──────────────────────── */
function ScoreBar({ score, delay = 0 }) {
  const col = barColor(score)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 120 + delay)
    return () => clearTimeout(t)
  }, [score, delay])
  return (
    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
      <div
        className={`h-full ${col.bg} rounded-full`}
        style={{ width: `${width}%`, transition: `width 700ms cubic-bezier(0.23,1,0.32,1) ${delay}ms` }}
      />
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function Results() {
  const navigate  = useNavigate()
  const [results, setResults] = useState(null)
  const [company, setCompany] = useState(null)

  useEffect(() => {
    const r = localStorage.getItem('complai_results')
    const c = localStorage.getItem('complai_company')
    if (!r) { navigate('/assessment'); return }
    setResults(JSON.parse(r))
    if (c) setCompany(JSON.parse(c))
  }, [navigate])

  if (!results) return null

  const { overallScore, sectionScores, topGaps } = results
  const status = scoreStatus(overallScore)

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 page-enter">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(37,99,235,0.30)' }}>
              <span className="text-white text-xs font-black">C</span>
            </div>
            <span className="text-sm font-black tracking-widest text-white">COMPLAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/assessment"
              className="text-xs text-slate-500 hover:text-slate-300 hidden sm:block cursor-pointer"
              style={{ transition: 'color 160ms var(--ease-out)' }}>
              Retake
            </Link>
            <Link to="/policies"
              className="btn-press px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl cursor-pointer"
              style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)', boxShadow: '0 4px 16px rgba(245,158,11,0.25)' }}>
              Generate Policies — $299
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* ── Score card ── */}
        <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <ScoreRing score={overallScore} />

            <div className="flex-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                {company?.companyName || 'Your Company'} · ISO 42001 Readiness
              </p>
              <h1 className="text-3xl font-black text-white mb-3">Your Readiness Score</h1>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${status.badge}`}>
                {status.label.toUpperCase()} — {status.desc}
              </span>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-md">
                {overallScore < 50
                  ? 'Significant gaps to close before your next investor meeting. The good news: all gaps are fixable with the right policies in place.'
                  : overallScore < 75
                  ? 'Solid foundation. A few targeted policies will get you to investor-ready governance quickly.'
                  : 'Strong governance posture. Download your policies to formalise and evidence your practices.'}
              </p>
            </div>

            <div className="hidden md:block flex-shrink-0">
              <Link to="/policies"
                className="btn-press block px-6 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl text-sm text-center cursor-pointer whitespace-nowrap"
                style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)', boxShadow: '0 6px 24px rgba(245,158,11,0.22)' }}>
                Generate Policies
                <span className="block text-xs font-semibold mt-0.5 opacity-75">$299 one-time</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Control breakdown ── */}
        <div>
          <h2 className="text-lg font-black text-white mb-4">Control-by-Control Breakdown</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {sectionScores.map((s, i) => {
              const col = barColor(s.score)
              return (
                <div key={s.id} className="bg-[#111827] border border-white/[0.07] rounded-2xl p-5 hover-lift"
                  style={{ transition: 'border-color 220ms var(--ease-out), transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out)' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-bold text-slate-600 mb-1">ISO {s.control}</p>
                      <p className="text-sm font-bold text-slate-100 leading-tight">{s.title}</p>
                    </div>
                    <span className={`text-xl font-black flex-shrink-0 tabular-nums ${col.text}`}>{s.score}%</span>
                  </div>
                  <ScoreBar score={s.score} delay={i * 80} />
                  <div className="mt-3">
                    {s.gaps.length === 0 ? (
                      <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        All controls addressed
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        <span className="text-slate-400 font-semibold">Gap: </span>{s.gaps[0]}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Top gaps ── */}
        {topGaps.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-white mb-4">
              Top {topGaps.length} Gaps — Prioritised by Impact
            </h2>
            <div className="space-y-3 stagger-children">
              {topGaps.map((gap, i) => (
                <div key={i}
                  className="bg-[#111827] border border-white/[0.07] rounded-2xl p-5 flex items-start gap-4 hover-lift"
                  style={{ transition: 'border-color 220ms var(--ease-out), transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out)' }}>
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xs font-black text-slate-400 font-mono">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${impactCls(gap.impact)}`}>
                        {gap.impact}
                      </span>
                      <span className="text-xs text-slate-600 font-medium">{gap.sectionTitle}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">{gap.question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="bg-gradient-to-br from-blue-600/15 to-blue-900/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">
            Fix these gaps with 7 customised ISO 42001 policies
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
            Ready-to-sign Word documents pre-filled with{' '}
            <strong className="text-white">{company?.companyName || 'your company'}</strong>'s details.
            Show investors your governance proof in one afternoon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/policies"
              className="btn-press w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl text-sm cursor-pointer"
              style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)', boxShadow: '0 6px 24px rgba(245,158,11,0.22)' }}>
              Generate My ISO 42001 Policies — $299
            </Link>
            <Link to="/assessment"
              className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer"
              style={{ transition: 'color 160ms var(--ease-out)' }}>
              Retake assessment
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-4">30-day money-back guarantee · One-time payment</p>
        </div>

        {/* ── Email capture ── */}
        <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-100 mb-1">Email me my assessment results</p>
            <p className="text-xs text-slate-500">Get a copy of this report in your inbox.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              defaultValue={company?.email || ''}
              placeholder="you@company.com"
              className="flex-1 sm:w-56 bg-white/[0.04] border border-white/[0.10] text-slate-100 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm input-glow"
            />
            <button
              className="btn-press px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl flex-shrink-0 cursor-pointer"
              style={{ transition: 'background 160ms var(--ease-out), transform 160ms var(--ease-out)' }}>
              Send
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-600 mt-8">
        © {new Date().getFullYear()} COMPLAI · Self-assessment, not a formal ISO 42001 audit.
      </footer>
    </div>
  )
}
