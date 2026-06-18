import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const LINKS = ['Ship', 'Track', 'Pricing', 'Couriers', 'Help']

export default function MobileMenuSheet({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(25,40,55,0.35)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 z-50 flex flex-col"
            style={{
              width: 'min(88vw, 360px)',
              height: '100dvh',
              background: '#CFC8C5',
              boxShadow: '-12px 0 48px rgba(25,40,55,0.18)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Logo />
              <button onClick={onClose} aria-label="Close menu">
                <X size={24} color="#192837" />
              </button>
            </div>
            <div className="h-px bg-[#192837]/10" />

            <nav className="flex flex-col gap-1 px-6 py-6">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  className="py-3 text-base font-medium text-[#192837]"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {link}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 px-6 py-8">
              <Link
                to="/signup"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white"
                style={{ background: '#f5821f' }}
              >
                Start For Free
              </Link>
              <Link
                to="/login"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-center text-sm font-semibold text-[#192837]"
                style={{ background: '#F2F2EE' }}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
