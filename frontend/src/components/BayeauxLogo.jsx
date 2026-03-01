import React from 'react'

export function BayeauxMark({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagonal background */}
      <polygon
        points="100,4 190,52 190,148 100,196 10,148 10,52"
        fill="#1a73e8"
      />
      {/* Inner hex cutout */}
      <polygon
        points="100,18 178,62 178,138 100,182 22,138 22,62"
        fill="#0A0A0F"
      />
      {/* Bold B */}
      <text
        x="50"
        y="148"
        fontFamily="Inter, Arial Black, sans-serif"
        fontWeight="900"
        fontSize="128"
        fill="#1a73e8"
      >
        B
      </text>
      {/* AI pill badge */}
      <rect x="110" y="154" width="50" height="22" fill="#1a73e8" />
      <text
        x="135"
        y="170"
        fontFamily="Inter, monospace"
        fontWeight="700"
        fontSize="12"
        fill="#0A0A0F"
        textAnchor="middle"
      >
        AI
      </text>
    </svg>
  )
}

export function BayeauxWordmark({ className = '' }) {
  return (
    <svg
      width="180"
      height="40"
      viewBox="0 0 360 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="52"
        fontFamily="Inter, Arial Black, sans-serif"
        fontWeight="800"
        fontSize="54"
        fill="currentColor"
        letterSpacing="2"
      >
        BAYEAUX
      </text>
      <text
        x="286"
        y="52"
        fontFamily="Inter, Arial Black, sans-serif"
        fontWeight="800"
        fontSize="54"
        fill="#1a73e8"
      >
        {' '}AI
      </text>
    </svg>
  )
}

export function BayeauxHeroLogo({ className = '' }) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <BayeauxMark size={80} />
      <div>
        <div className="flex items-baseline gap-2">
          <span
            style={{
              fontFamily: 'Inter, Arial Black, sans-serif',
              fontWeight: 800,
              fontSize: '3rem',
              letterSpacing: '0.04em',
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            BAYEAUX
          </span>
          <span
            style={{
              fontFamily: 'Inter, Arial Black, sans-serif',
              fontWeight: 800,
              fontSize: '3rem',
              color: '#1a73e8',
              lineHeight: 1,
            }}
          >
            AI
          </span>
        </div>
        <p
          style={{
            fontFamily: 'Inter, monospace',
            fontSize: '0.85rem',
            color: '#6b7280',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '4px',
          }}
        >
          Compliance Intelligence Platform
        </p>
      </div>
    </div>
  )
}

export default BayeauxMark
