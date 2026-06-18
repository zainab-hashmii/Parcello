import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export function StaggerGroup({ className, children }) {
  return (
    <motion.div className={className} initial="hidden" animate="visible" variants={container}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ className, children, ...props }) {
  return (
    <motion.div className={className} variants={item} {...props}>
      {children}
    </motion.div>
  )
}
