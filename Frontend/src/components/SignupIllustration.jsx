import { motion } from 'framer-motion'
import Logo from './Logo'

const PACKAGES = [
  { top: '18%', left: '20%', delay: 0, size: 'text-3xl' },
  { top: '62%', left: '12%', delay: 0.8, size: 'text-2xl' },
  { top: '30%', left: '78%', delay: 1.4, size: 'text-3xl' },
  { top: '74%', left: '70%', delay: 0.4, size: 'text-2xl' },
]

export default function SignupIllustration() {
  return (
    <div className="relative hidden h-full overflow-hidden bg-[#1a1816] lg:block">
      <div className="absolute inset-0 bg-linear-to-br from-[#221f1c] via-[#1a1816] to-[#100f0e]" />

      <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
        <path d="M -50 150 Q 200 80 420 200 T 900 140" fill="none" stroke="#ff8a00" strokeWidth="2" strokeDasharray="6 10" style={{ animation: 'dash-flow 6s linear infinite' }} />
        <path d="M -50 450 Q 250 380 480 480 T 900 420" fill="none" stroke="#ff8a00" strokeWidth="2" strokeDasharray="6 10" style={{ animation: 'dash-flow 7s linear infinite' }} />
        <path d="M -50 650 Q 220 600 460 680 T 900 620" fill="none" stroke="#ffa733" strokeWidth="1.5" strokeDasharray="4 8" style={{ animation: 'dash-flow 9s linear infinite' }} />
      </svg>

      {PACKAGES.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute opacity-70 ${p.size}`}
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 4 + i, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          📦
        </motion.span>
      ))}

      <motion.div
        className="absolute text-4xl"
        style={{ top: '40%' }}
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      >
        🚚
      </motion.div>
      <motion.div
        className="absolute text-3xl"
        style={{ top: '68%' }}
        animate={{ left: ['105%', '-5%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 1 }}
      >
        🚚
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-between p-12">
        <Logo light />
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-bold leading-tight text-white"
          >
            Deliver on time,<br />every time.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 max-w-sm text-sm text-white/50"
          >
            Join thousands of customers and couriers moving parcels across the country with real-time tracking.
          </motion.p>
        </div>
        <div />
      </div>
    </div>
  )
}
