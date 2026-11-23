/** Kompass-Rose mit Pfeil in Richtung der Sonne (Grad ab Norden, im Uhrzeigersinn). */
export default function CompassArrow({ bearing, size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`Sonne bei ${Math.round(bearing)} Grad`}>
      <defs>
        <linearGradient id="arrowGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.5" stopColor="#ff4f8b" />
          <stop offset="1" stopColor="#ffc857" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="#1b142d" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
      {['N', 'O', 'S', 'W'].map((d, i) => {
        const a = (i * 90 * Math.PI) / 180
        return (
          <text
            key={d}
            x={32 + Math.sin(a) * 21}
            y={32 - Math.cos(a) * 21 + 3.5}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={d === 'N' ? '#ff8a3d' : 'rgba(255,255,255,.5)'}
          >
            {d}
          </text>
        )
      })}
      <g transform={`rotate(${bearing} 32 32)`}>
        <path d="M32 7 L38 33 L32 29 L26 33 Z" fill="url(#arrowGrad)" />
        <circle cx="32" cy="7" r="4" fill="#ffc857" />
      </g>
      <circle cx="32" cy="32" r="3" fill="#fff" />
    </svg>
  )
}
