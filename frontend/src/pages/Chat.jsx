import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'

const EMAIL_DISMISSED_KEY = 'complai_email_dismissed'

function EmailCapture({ framework, onDismiss }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error

  async function submit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      await complianceAPI.subscribe({ email: email.trim(), source: 'chat', framework })
      setStatus('done')
      trackEvent('email_subscribed', { source: 'chat', framework })
      setTimeout(onDismiss, 3000)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
        <span className="text-lg">🎉</span>
        <span><strong>You're on the list!</strong> We'll let you know when we ship new features and the Pro plan.</span>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-3.5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">Want early access to COMPLAI Pro?</p>
          <p className="text-xs text-slate-500 mt-0.5">Get notified when we launch — unlimited analyses, full policy library, and team features.</p>
        </div>
        <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {status === 'loading' ? '...' : 'Notify me'}
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-500 mt-1.5">Something went wrong — please try again.</p>}
    </div>
  )
}

const FW_LABELS = {
  ISO_27001: 'ISO 27001', ISO_42001: 'ISO 42001', NDPR: 'NDPR',
  GDPR: 'GDPR', UK_GDPR: 'UK GDPR', POPIA: 'POPIA',
  LGPD: 'LGPD', CCPA: 'CCPA/CPRA', PDPA: 'PDPA',
}

const ALL_FRAMEWORKS = Object.keys(FW_LABELS)

const STARTER_QUESTIONS = [
  { icon: '🔐', text: 'What is ISO 27001 and do I need it?' },
  { icon: '🇪🇺', text: 'What does GDPR actually require me to do?' },
  { icon: '🤖', text: 'How do I make my AI systems compliant?' },
  { icon: '📋', text: 'What is a Data Protection Impact Assessment (DPIA)?' },
  { icon: '🚨', text: 'If we have a data breach, what do we do first?' },
  { icon: '📁', text: 'What is a risk register and why do I need one?' },
  { icon: '🔑', text: 'What is access control and how do I implement it?' },
  { icon: '🌍', text: 'Does NDPR apply to my Nigerian business?' },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 150, 300].map(d => (
        <span key={d} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${d}ms`, animationDuration: '900ms' }} />
      ))}
    </div>
  )
}

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-xl bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
      </div>
    )
  }

  if (msg.role === 'error') {
    return (
      <div className="flex justify-start">
        <div className="max-w-xl bg-red-50 border border-red-200 rounded-2xl rounded-bl-sm px-4 py-3">
          <p className="text-sm text-red-600">{msg.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex-shrink-0 flex items-center justify-center text-white text-xs font-black mt-0.5">
        C
      </div>
      <div className="flex-1 max-w-2xl">
        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
          <div className="prose prose-sm prose-slate max-w-none">
            <ReactMarkdown
              components={{
                blockquote: ({ children }) => (
                  <div className="flex gap-2 mt-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg px-3 py-2 not-prose">
                    <span className="text-base">{children}</span>
                  </div>
                ),
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>

          {(msg.related_controls?.length > 0 || msg.references?.length > 0) && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              {msg.related_controls?.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono rounded">
                  {c}
                </span>
              ))}
              {msg.references?.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded border border-slate-200">
                  📎 {r}
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
  const [showEmailCapture, setShowEmailCapture] = useState(
    !localStorage.getItem(EMAIL_DISMISSED_KEY)
  )
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  function dismissEmail() {
    localStorage.setItem(EMAIL_DISMISSED_KEY, '1')
    setShowEmailCapture(false)
  }

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
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-black">C</div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">COMPLAI Advisor</p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">Compliance made simple</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Framework:</label>
          <select
            value={selectedFw}
            onChange={e => setSelectedFw(e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
          >
            {ALL_FRAMEWORKS.map(f => (
              <option key={f} value={f}>{FW_LABELS[f]}</option>
            ))}
          </select>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Messages area ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">

          {isEmpty && (
            <div className="py-8 text-center">
              {/* Hero greeting */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Hi, I'm your COMPLAI Advisor</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                Ask me anything about data protection, information security, or AI governance — I'll explain it in plain English.
              </p>

              {/* Starter questions */}
              <div className="mt-6 grid grid-cols-2 gap-2 max-w-xl mx-auto text-left">
                {STARTER_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => send(q.text)}
                    className="flex items-start gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all text-left group">
                    <span className="text-lg leading-none mt-0.5">{q.icon}</span>
                    <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-snug">{q.text}</span>
                  </button>
                ))}
              </div>

              {!orgProfile && (
                <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <span>Complete <Link to="/onboarding" className="font-semibold underline">onboarding</Link> to get personalised advice for your organisation.</span>
                </div>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <React.Fragment key={i}>
              <MessageBubble msg={msg} />
              {/* Show email capture after the first assistant reply */}
              {msg.role === 'assistant' && i === 1 && showEmailCapture && (
                <div className="max-w-2xl ml-11">
                  <EmailCapture framework={selectedFw} onDismiss={dismissEmail} />
                </div>
              )}
            </React.Fragment>
          ))}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex-shrink-0 flex items-center justify-center text-white text-xs font-black">C</div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input area ───────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 flex-shrink-0">
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
                placeholder="Ask any compliance question, e.g. 'Do I need to appoint a Data Protection Officer?'"
                disabled={loading}
                className="w-full resize-none border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-1.5 text-center">
            COMPLAI explains compliance in plain English. Always verify critical decisions with a qualified legal professional.
          </p>
        </div>
      </div>
    </div>
  )
}
