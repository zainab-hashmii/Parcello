import { motion } from 'framer-motion'

export default function GlassCard({ as: Component = motion.div, className = '', children, ...props }) {
  return (
    <Component
      className={`rounded-[1.5rem] border border-orange-100/70 bg-white/80 shadow-[0_8px_30px_-8px_rgba(31,36,48,0.10)] backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
