import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const dashboardPath =
    user?.accountType === 'Admin'
      ? '/admin'
      : user?.accountType === 'Rider'
      ? '/rider'
      : '/customer'

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to={dashboardPath} className="text-sm font-medium text-ink transition hover:text-brand">
                Dashboard
              </Link>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-brand hover:bg-orange-100"
              >
                Log out
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink transition hover:text-brand">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/signup"
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
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
