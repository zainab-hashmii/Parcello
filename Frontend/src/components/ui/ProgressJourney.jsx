import { motion } from 'framer-motion'

const JOURNEY = [
  { key: 'WAITING', icon: '📦', label: 'Booked' },
  { key: 'PICKED_UP', icon: '🚚', label: 'Picked up' },
  { key: 'AT_WAREHOUSE', icon: '🏢', label: 'Warehouse' },
  { key: 'OUT_FOR_DELIVERY', icon: '🚚', label: 'On the way' },
  { key: 'DELIVERED', icon: '🏠', label: 'Delivered' },
]

const STATUS_TO_STEP = {
  WAITING: 0,
  PICKED_UP: 1,
  IN_TRANSIT: 1,
  AT_WAREHOUSE: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
  FAILED_DELIVERY: 3,
}

export default function ProgressJourney({ status, compact = false }) {
  const activeIndex = STATUS_TO_STEP[status] ?? 0

  return (
    <div className="flex items-center">
      {JOURNEY.map((step, i) => {
        const done = i < activeIndex
        const active = i === activeIndex
        return (
          <div key={step.key} className="flex items-center">
            <div className="relative flex flex-col items-center">
              {active && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-brand/40"
                  animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <span
                className={`relative flex items-center justify-center rounded-full transition-all ${
                  compact ? 'h-7 w-7 text-sm' : 'h-10 w-10 text-lg'
                } ${
                  active
                    ? 'bg-linear-to-br from-brand to-brand-light-tone text-white shadow-[0_0_18px_rgba(255,138,0,0.55)]'
                    : done
                    ? 'bg-brand/15 text-brand'
                    : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-white/30'
                }`}
              >
                {step.icon}
              </span>
              {!compact && (
                <span className={`mt-1 text-[10px] font-medium ${active ? 'text-brand' : 'text-ink/40 dark:text-white/40'}`}>
                  {step.label}
                </span>
              )}
            </div>
            {i < JOURNEY.length - 1 && (
              <div className={`mx-1 h-0.5 ${compact ? 'w-4' : 'w-8'} rounded-full ${i < activeIndex ? 'bg-brand' : 'bg-gray-200 dark:bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
