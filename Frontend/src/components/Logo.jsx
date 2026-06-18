import { Link } from 'react-router-dom'

// Parcello mark: an open parcel box forming a forward-pointing arrow,
// signalling motion/delivery while still reading as a package.
export default function Logo({ light = false }) {
  const ink = light ? '#ffffff' : '#192837'

  return (
    <Link to="/" className="flex items-center gap-2">
      <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 4 L58 18 V46 L32 60 L6 46 V18 Z"
          fill={ink}
        />
        <path
          d="M32 4 L58 18 L32 32 L6 18 Z"
          fill="#f5821f"
        />
        <path
          d="M32 32 V60"
          stroke={light ? '#192837' : '#ffffff'}
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <path
          d="M22 32 L32 38 L42 32"
          fill="none"
          stroke={light ? '#192837' : '#ffffff'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-lg font-bold tracking-tight"
        style={{ color: ink, fontFamily: 'var(--font-heading)' }}
      >
        Parcello
      </span>
    </Link>
  )
}
