import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'

const EMAIL_DISMISSED_KEY = 'complai_email_dismissed'

const FW_LABELS = {
  ISO_27001: 'ISO 27001', ISO_42001: 'ISO 42001', NDPR: 'NDPR',
  GDPR: 'GDPR', UK_GDPR: 'UK GDPR', POPIA: 'POPIA',
  LGPD: 'LGPD', CCPA: 'CCPA/CPRA', PDPA: 'PDPA',
}

const ALL_FRAMEWORKS = Object.keys(FW_LABELS)

const STARTER_QUESTIONS = [
  { text: 'What is ISO 27001 and do I need it?' },
  { text: 'What does GDPR actually require me to do?' },
  { text: 'How do I make my AI systems compliant?' },
  { text: 'What is a Data Protection Impact Assessment?' },
  { text: 'If we have a data breach, what do we do first?' },
  { text: 'What is a risk register and why do I need one?' },
  { text: 'What is access control and how do I implement it?' },
  { text: 'Does NDPR apply to my Nigerian business?' },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 150, 300].map(d => (
        <span key={d} className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
          style={{ animationDelay: `${d}ms`, animationDuration: '900ms' }} />
      ))}
    </div>
  )
}

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-xl bg-primary-600 text-white rounded-2xl rounded-br-sm px-4 py-3">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
      </div>
    )
  }

  if (msg.role === 'error') {
    return (
      <div className="flex justify-start">
        <div className="max-w-xl bg-red-500/10 border border-red-500/20 rounded-2xl rounded-bl-sm px-4 py-3">
          <p className="text-sm text-red-400">{msg.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex-shrink-0 flex items-center justify-center text-white text-xs font-black mt-0.5">
        C
      </div>
      <div className="flex-1 max-w-2xl">
        <div className="bg-[#111827] border border-white/[0.07] rounded-2xl rounded-bl-sm px-5 py-4">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                blockquote: ({ children }) => (
                  <div className="flex gap-2 mt-3 bg-primary-500/10 border-l-4 border-primary-500 rounded-r-lg px-3 py-2 not-prose">
                    <span className="text-sm text-slate-300">{children}</span>
                  </div>
                ),
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>

          {(msg.related_controls?.length > 0 || msg.references?.length > 0) && (
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-2">
              {msg.related_controls?.map((c, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 bg-primary-500/10 text-primary-300 border border-primary-500/20 text-xs font-mono rounded">
                  {c}
                </span>
              ))}
              {msg.references?.map((r, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 bg-white/[0.04] text-slate-400 text-xs rounded border border-white/[0.07]">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Chat() {
  const { orgProfile } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const [selectedFw, setSelectedFw] = useState(framework)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function send(question) {
    const q = (question || input).trim()
    if (!q) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const res = await complianceAPI.chat({ framework: selectedFw, question: q })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer,
        references: res.references,
        related_controls: res.related_controls,
      }])
    } catch (err) {
      if (err.isRateLimited) {
        setMessages(prev => [...prev, {
          role: 'error',
          content: `Too many requests. Please wait ${err.retryAfter || 60} seconds before trying again.`,
        }])
        return
      }
      setMessages(prev => [...prev, {
        role: 'error',
        content: 'Something went wrong. Please try again.',
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col bg-[#0A0F1E]" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#060B18] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-black">C</div>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-none">COMPLAI Advisor</p>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Compliance made simple</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Framework:</label>
          <select
            value={selectedFw}
            onChange={e => setSelectedFw(e.target.value)}
            className="text-xs border border-white/[0.10] rounded-lg px-2 py-1.5 bg-white/[0.05] text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
          >
            {ALL_FRAMEWORKS.map(f => (
              <option key={f} value={f} className="bg-[#111827] text-slate-200">{FW_LABELS[f]}</option>
            ))}
          </select>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])}
              className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Messages area ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">

          {isEmpty && (
            <div className="py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 mx-auto mb-5 flex items-center justify-center shadow-lg shadow-primary-900/40">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-100">Hi, I'm your COMPLAI Advisor</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                Ask me anything about data protection, information security, or AI governance — I'll explain it in plain English.
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto text-left">
                {STARTER_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => send(q.text)}
                    className="flex items-start gap-2.5 p-3.5 bg-[#111827] border border-white/[0.06] rounded-xl hover:border-primary-500/40 hover:bg-primary-500/[0.05] transition-all text-left cursor-pointer group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                    <span className="text-xs text-slate-400 group-hover:text-slate-200 leading-snug transition-colors">{q.text}</span>
                  </button>
                ))}
              </div>

              {!orgProfile && (
                <div className="mt-6 inline-flex items-center gap-2 bg-amber-500/[0.08] border border-amber-500/20 rounded-xl px-4 py-2.5 text-xs text-amber-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <span>Complete <Link to="/onboarding" className="font-semibold underline underline-offset-2">onboarding</Link> for personalised advice.</span>
                </div>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex-shrink-0 flex items-center justify-center text-white text-xs font-black">C</div>
              <div className="bg-[#111827] border border-white/[0.07] rounded-2xl rounded-bl-sm px-5 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input area ───────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] bg-[#060B18] px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={e => { e.preventDefault(); send() }} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                }}
                placeholder="Ask any compliance question…"
                disabled={loading}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                style={{
                  minHeight: '46px',
                  maxHeight: '120px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#F1F5F9',
                  caretColor: '#818CF8',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-11 h-11 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-slate-600 mt-2 text-center">
            Always verify critical decisions with a qualified legal professional.
          </p>
        </div>
      </div>
    </div>
  )
}
