import { motion } from 'framer-motion'

// Animated road backdrop with delivery vehicles looping across the screen,
// standing in for the original spec's background video.
const VEHICLES = [
  { emoji: '🚚', lane: '18%', duration: 14, delay: 0, scale: 1.1 },
  { emoji: '🛵', lane: '38%', duration: 9, delay: 1.5, scale: 0.85 },
  { emoji: '🚐', lane: '58%', duration: 16, delay: 3, scale: 1 },
  { emoji: '🏍️', lane: '76%', duration: 8, delay: 0.8, scale: 0.8 },
  { emoji: '🚚', lane: '92%', duration: 18, delay: 5, scale: 1.2 },
]

export default function DeliveryRoadScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#fdebd3] via-[#fbe0bd] to-[#f3c98f]">
      {/* sky glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_55%)]" />

      {/* distant skyline */}
      <div className="absolute bottom-[38%] left-0 right-0 flex items-end justify-around opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-10 rounded-t-sm bg-[#192837]"
            style={{ height: `${40 + ((i * 37) % 90)}px` }}
          />
        ))}
      </div>

      {/* road */}
      <div className="absolute bottom-0 left-0 right-0 h-[34%] bg-[#2b2f36]">
        <div className="absolute left-0 right-0 top-6 h-1.5 bg-[#f5821f]/70" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-around">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="h-1.5 w-10 rounded-full bg-white/70" />
          ))}
        </div>
      </div>

      {/* vehicles driving across the road, looping continuously */}
      {VEHICLES.map((v, i) => (
        <motion.div
          key={i}
          className="absolute select-none"
          style={{ bottom: v.lane, fontSize: `${2.4 * v.scale}rem`, left: '-10%' }}
          initial={{ x: '-15vw' }}
          animate={{ x: '115vw' }}
          transition={{
            duration: v.duration,
            delay: v.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {v.emoji}
        </motion.div>
      ))}

      {/* soft overlay so foreground text stays readable */}
      <div className="absolute inset-0 bg-white/35" />
    </div>
  )
}
