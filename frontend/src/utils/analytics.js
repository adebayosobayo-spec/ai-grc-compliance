/**
 * Google Analytics 4 helper for COMPLAI.
 *
 * Usage:
 *   import { pageView, trackEvent } from '../utils/analytics'
 *   pageView('/dashboard')
 *   trackEvent('chat_question', { framework: 'GDPR' })
 *
 * Setup:
 *   Set VITE_GA_MEASUREMENT_ID in Vercel → Project Settings → Environment Variables.
 *   The value should look like: G-XXXXXXXXXX
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

/** Load the gtag script once and initialise GA4. */
function loadGA() {
    if (!GA_ID || typeof window === 'undefined') return
    if (window.__ga_loaded__) return
    window.__ga_loaded__ = true

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { send_page_view: false })
}

/** Send a page_view hit — call this on every route change. */
export function pageView(path) {
    loadGA()
    if (!GA_ID || !window.gtag) return
    window.gtag('event', 'page_view', {
        page_path: path,
        page_title: document.title,
    })
}

/**
 * Send a custom event.
 * @param {string} eventName  e.g. 'chat_question', 'gap_analysis_run'
 * @param {object} params     any extra dimensions
 */
export function trackEvent(eventName, params = {}) {
    loadGA()
    if (!GA_ID || !window.gtag) return
    window.gtag('event', eventName, params)
}
