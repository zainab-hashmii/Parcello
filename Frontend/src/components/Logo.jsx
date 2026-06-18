import { Link } from 'react-router-dom'

// Parcello mark: a stylized parcel box with a route/path cut through it.
export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <svg width="32" height="32" fill="none" viewBox="0 0 256 256" overflow="visible">
        <path
          d="M128 16 L240 72 L240 184 L128 240 L16 184 L16 72 Z"
          fill="none"
          stroke="#192837"
          strokeWidth="16"
        />
        <path d="M16 72 L128 128 L240 72" fill="none" stroke="#192837" strokeWidth="16" strokeLinecap="round" />
        <path d="M128 128 L128 240" fill="none" stroke="#192837" strokeWidth="16" strokeLinecap="round" />
      </svg>
      <span className="text-lg font-bold" style={{ color: '#192837', fontFamily: 'var(--font-heading)' }}>
        Parcello
      </span>
    </Link>
  )
}
