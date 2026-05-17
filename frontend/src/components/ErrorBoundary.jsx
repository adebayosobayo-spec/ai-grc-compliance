import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#F8FAFC' }}>
          <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22 }}>!</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>Something went wrong</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, marginBottom: 24, fontFamily: 'Inter, sans-serif' }}>
              An unexpected error occurred. Your assessment progress is saved — refreshing the page should fix this.
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
