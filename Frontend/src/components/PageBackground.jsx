import { motion } from 'framer-motion'

const FLOATERS = [
  { icon: '📦', top: '12%', left: '6%', delay: 0, duration: 7 },
  { icon: '🚚', top: '70%', left: '88%', delay: 1.2, duration: 9 },
  { icon: '📍', top: '40%', left: '92%', delay: 0.6, duration: 8 },
  { icon: '📦', top: '85%', left: '15%', delay: 2, duration: 8.5 },
]

// Same delivery video used on the Home hero, dimmed and blurred down so it
// reads as ambient texture behind content-dense pages instead of a hero.
export default function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-cream dark:bg-[#100f0e]">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-[0.10] blur-[1px] dark:opacity-[0.06]"
        src="/videos/delivery-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#fff3e6] via-[#fdfbf7] to-[#fdfbf7] dark:from-[#1a1816] dark:via-[#100f0e] dark:to-[#100f0e]" />

      <svg className="absolute inset-0 h-full w-full opacity-[0.18] dark:opacity-[0.12]" preserveAspectRatio="none">
        <path
          d="M -50 120 Q 300 40 650 160 T 1400 100"
          fill="none"
          stroke="#ff8a00"
          strokeWidth="2"
          strokeDasharray="6 10"
          style={{ animation: 'dash-flow 6s linear infinite' }}
        />
        <path
          d="M -50 420 Q 320 520 700 380 T 1500 460"
          fill="none"
          stroke="#ff8a00"
          strokeWidth="2"
          strokeDasharray="6 10"
          style={{ animation: 'dash-flow 8s linear infinite' }}
        />
      </svg>

      {FLOATERS.map((f, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl opacity-[0.14] dark:opacity-[0.10]"
          style={{ top: f.top, left: f.left }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {f.icon}
        </motion.span>
      ))}
    </div>
  )
}
