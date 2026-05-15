/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // COMPLAI brand palette
        brand: {
          blue:   '#2563EB',  // primary CTA / links
          green:  '#10B981',  // success / ready
          amber:  '#F59E0B',  // conversion CTA
          red:    '#EF4444',  // critical gaps
        },
        navy: {
          950: '#060B18',
          900: '#0A0F1E',
          800: '#0D1426',
          700: '#111C35',
          600: '#1A2540',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glass':      '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'glass-lg':   '0 8px 32px rgba(0,0,0,0.09), 0 2px 4px rgba(0,0,0,0.05)',
        'glow-blue':  '0 0 20px rgba(37,99,235,0.28)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.28)',
      },
      animation: {
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-up':     'slideUp 0.25s ease-out',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.65' },
        },
      },
    },
  },
  plugins: [],
}
