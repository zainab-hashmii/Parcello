import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function PageTransition({ children }) {
  return (
    <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
      {children}
    </motion.div>
  )
}
