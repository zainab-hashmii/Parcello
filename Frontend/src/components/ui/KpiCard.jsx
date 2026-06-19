import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import GlassCard from './GlassCard'

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()
    const from = 0
    const to = typeof target === 'number' ? target : 0

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (to - from) * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

export default function KpiCard({ icon, label, value, prefix = '', suffix = '', decimals = 0, accent = false, delay = 0 }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0)
  const display = typeof value === 'number' ? animated.toFixed(decimals) : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <GlassCard className={`relative overflow-hidden p-5 ${accent ? 'ring-1 ring-brand/30' : ''}`}>
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl"
          style={{ background: 'linear-gradient(135deg, #ff8a00, #ffa733)' }}
        />
        <div className="flex items-center gap-2 text-ink/50">
          <span className="text-base">{icon}</span>
          <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
        </div>
        <p className="mt-2 text-2xl font-bold text-ink">
          {prefix}{display}{suffix}
        </p>
      </GlassCard>
    </motion.div>
  )
}
