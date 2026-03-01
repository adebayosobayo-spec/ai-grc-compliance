import React, { useState, useRef, useEffect } from 'react'
import { complianceAPI } from '../services/api'
import ReactMarkdown from 'react-markdown'
import { useAppContext } from '../context/AppContext'

function Chat() {
  const { orgProfile } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await complianceAPI.chat({ framework, question: input })
      const assistantMessage = {
        role: 'assistant',
        content: response.answer,
        references: response.references,
        related_controls: response.related_controls,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat failed:', error)
      setMessages(prev => [...prev, { role: 'error', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const frameworkLabel = framework === 'ISO_27001' ? 'ISO 27001' : 'ISO 42001'

  const suggestedQuestions = framework === 'ISO_27001' ? [
    'What are the key requirements for ISO 27001 certification?',
    'How do I implement access control policies?',
    'What is required for incident response?',
    'How should I handle data classification?',
  ] : [
    'What are the key requirements for AI governance?',
    'How do I ensure AI fairness and prevent bias?',
    'What is required for AI model documentation?',
    'How should I monitor AI systems in production?',
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <p className="text-xs font-mono text-blue-600 tracking-widest mb-1 uppercase">Intelligence</p>
        <h2 className="text-3xl font-black text-slate-900">AI Compliance Chat</h2>
        <p className="mt-1 text-slate-600">Ask questions about {frameworkLabel} compliance</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col" style={{ height: '600px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center mt-12">
              <div className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center bg-gray-100 border border-gray-200">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-slate-900 font-medium">Start a conversation</p>
              <p className="mt-1 text-sm text-slate-500">Ask anything about {frameworkLabel} requirements or implementation</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white font-medium'
                  : message.role === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-600'
                  : 'bg-gray-50 border border-gray-200 text-slate-700'
              }`}>
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                ) : (
                  <div>
                    <div className="prose max-w-none text-sm">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>

                    {message.related_controls && message.related_controls.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-mono text-blue-600 uppercase tracking-wide mb-2">Related Controls</p>
                        <div className="flex flex-wrap gap-2">
                          {message.related_controls.map((control, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-gray-200 text-blue-600 text-xs rounded font-mono">
                              {control}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.references && message.references.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-wide mb-2">References</p>
                        <ul className="text-xs space-y-1 text-slate-500 font-mono">
                          {message.references.map((ref, i) => (
                            <li key={i}>→ {ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex space-x-1.5">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <div key={i} className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a compliance question..."
              className="flex-1 bg-white border border-gray-300 text-slate-900 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Send
            </button>
          </form>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-4">Suggested Questions</h3>
          <div className="grid grid-cols-2 gap-3">
            {suggestedQuestions.map((q, i) => (
              <button key={i} onClick={() => setInput(q)}
                className="text-left p-3 border border-gray-200 bg-gray-50 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-sm text-slate-600 hover:text-slate-900 transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
