import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, LogOut, LayoutDashboard, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { getParcelsOfCustomer } from '../api/endpoints'
import Logo from './Logo'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const notifCtx = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [shipmentCount, setShipmentCount] = useState(0)
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  const dashboardPath =
    user?.accountType === 'Admin' ? '/admin' : user?.accountType === 'Rider' ? '/rider' : '/customer'

  useEffect(() => {
    if (user?.accountType !== 'Customer') return
    const id = user._id || user.id
    getParcelsOfCustomer(id).then((res) => setShipmentCount(res.data.length)).catch(() => {})
  }, [user])

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const notifications = notifCtx?.notifications || []
  const unreadCount = notifCtx?.unreadCount || 0

  const initials = (user?.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const isActive = (path) => location.pathname === path

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-orange-100/70 bg-white/75 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardPath} className="relative px-1 py-2 text-sm font-medium text-ink transition hover:text-brand">
                Dashboard
                {isActive(dashboardPath) && (
                  <motion.span
                    layoutId="navbar-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand"
                  />
                )}
              </Link>

              {user.accountType === 'Customer' && shipmentCount > 0 && (
                <Link
                  to="/customer"
                  className="hidden items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-brand sm:flex"
                >
                  📦 {shipmentCount} active
                </Link>
              )}

              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => {
                    setNotifOpen((o) => !o)
                    if (!notifOpen) notifCtx?.markAllRead()
                  }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-orange-50 hover:text-brand"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-orange-100 bg-white/95 shadow-xl backdrop-blur-xl"
                    >
                      <div className="border-b border-orange-100 px-4 py-3">
                        <p className="text-sm font-semibold text-ink">Notifications</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                          <p className="px-4 py-8 text-center text-sm text-ink/40">
                            You'll see updates here when your shipments move.
                          </p>
                        )}
                        {notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={`/customer/track/${n.parcelId}`}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start gap-3 border-b border-orange-50 px-4 py-3 text-left transition hover:bg-orange-50/60"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand">
                              <Package size={14} />
                            </span>
                            <div>
                              <p className="text-sm text-ink">{n.text}</p>
                              <p className="mt-0.5 text-xs text-ink/40">{timeAgo(n.time)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 py-1 pl-1 pr-2 shadow-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-brand to-brand-light-tone text-xs font-bold text-white">
                    {initials}
                  </span>
                  <ChevronDown size={14} className="text-ink/50" />
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl backdrop-blur-xl"
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-ink">{user.name}</p>
                        <p className="truncate text-xs text-ink/50">{user.email}</p>
                      </div>
                      <div className="my-1 h-px bg-orange-100" />
                      <Link
                        to={dashboardPath}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-orange-50"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false)
                          logout()
                          navigate('/')
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut size={15} /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink transition hover:text-brand">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/signup"
                  className="rounded-full bg-linear-to-r from-brand to-brand-light-tone px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(255,138,0,0.6)] transition hover:shadow-[0_10px_26px_-6px_rgba(255,138,0,0.75)]"
                >
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
