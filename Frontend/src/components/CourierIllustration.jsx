// Stylized courier-with-boxes illustration in the brand's orange/cream palette.
export default function CourierIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 360 480"
      className={className}
      role="img"
      aria-label="Delivery courier carrying boxes"
    >
      <ellipse cx="180" cy="455" rx="120" ry="18" fill="#f5821f" opacity="0.08" />

      {/* hand-truck behind */}
      <g opacity="0.95">
        <rect x="248" y="330" width="70" height="70" rx="6" fill="#e8b878" />
        <rect x="248" y="330" width="70" height="70" rx="6" fill="none" stroke="#caa066" strokeWidth="2" />
        <path d="M260 290 L270 290 L270 330" stroke="#b5651d" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M260 290 Q255 280 245 282" stroke="#b5651d" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="263" cy="412" r="16" fill="#2b2b2b" />
        <circle cx="263" cy="412" r="6" fill="#f5821f" />
      </g>

      {/* legs */}
      <rect x="148" y="330" width="28" height="100" rx="10" fill="#cdb38b" />
      <rect x="186" y="330" width="28" height="100" rx="10" fill="#cdb38b" />
      <rect x="142" y="420" width="40" height="16" rx="8" fill="#e3691a" />
      <rect x="180" y="420" width="40" height="16" rx="8" fill="#e3691a" />

      {/* torso (polo shirt) */}
      <path
        d="M130 240 Q180 215 230 240 L238 330 Q180 350 122 330 Z"
        fill="#f5821f"
      />
      <path d="M130 240 Q180 215 230 240 L226 260 Q180 240 134 260 Z" fill="#d9690a" />

      {/* arms holding boxes */}
      <rect x="108" y="255" width="26" height="80" rx="13" fill="#f5821f" transform="rotate(8 108 255)" />
      <rect x="226" y="255" width="26" height="80" rx="13" fill="#f5821f" transform="rotate(-8 226 255)" />
      <circle cx="118" cy="330" r="12" fill="#e8b878" />
      <circle cx="246" cy="330" r="12" fill="#e8b878" />

      {/* boxes carried */}
      <rect x="150" y="295" width="60" height="55" rx="4" fill="#e0a85f" stroke="#b5752c" strokeWidth="2" />
      <rect x="160" y="248" width="46" height="46" rx="4" fill="#eec08a" stroke="#b5752c" strokeWidth="2" />
      <path d="M160 271 H206 M183 248 V294" stroke="#b5752c" strokeWidth="2" />
      <rect x="180" y="318" width="10" height="10" fill="#b5752c" opacity="0.5" />

      {/* head */}
      <circle cx="180" cy="195" r="38" fill="#f3c08a" />
      <path
        d="M142 195 Q142 150 180 150 Q218 150 218 195 Q218 175 200 172 Q190 185 180 172 Q170 185 160 172 Q142 175 142 195 Z"
        fill="#3a2a1a"
      />
      <path d="M138 188 Q180 168 222 188 Q222 160 180 156 Q138 160 138 188 Z" fill="#f5821f" />
      <path d="M138 188 Q180 200 222 188" stroke="#d9690a" strokeWidth="4" fill="none" />

      {/* face details */}
      <circle cx="166" cy="198" r="3" fill="#2b2b2b" />
      <circle cx="196" cy="198" r="3" fill="#2b2b2b" />
      <path d="M168 212 Q180 220 192 212" stroke="#2b2b2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="208" r="6" fill="#f3a06a" opacity="0.5" />
      <circle cx="210" cy="208" r="6" fill="#f3a06a" opacity="0.5" />

      {/* shoes */}
      <rect x="138" y="432" width="48" height="18" rx="9" fill="#e3691a" />
      <rect x="176" y="432" width="48" height="18" rx="9" fill="#e3691a" />
    </svg>
  )
}
