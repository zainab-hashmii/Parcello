import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, X } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

export default function ToastContainer() {
  const ctx = useNotifications()
  if (!ctx) return null
  const { toasts, dismissToast } = ctx

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-[0_14px_36px_-10px_rgba(255,138,0,0.35)] backdrop-blur-xl"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand to-brand-light-tone text-white">
              <Package size={16} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Shipment update</p>
              <Link
                to={`/customer/track/${t.parcelId}`}
                onClick={() => dismissToast(t.id)}
                className="mt-0.5 block text-xs text-ink/60 hover:text-brand"
              >
                {t.text}
              </Link>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-ink/30 transition hover:text-ink/60"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
