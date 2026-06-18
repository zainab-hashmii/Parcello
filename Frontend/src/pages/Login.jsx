import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login as loginApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginApi(email, password)
      const userData = data.user || data
      login(userData)
      const dest =
        userData.accountType === 'Admin'
          ? '/admin'
          : userData.accountType === 'Rider'
          ? '/rider'
          : '/customer'
      navigate(dest)
    } catch (err) {
      const data = err.response?.data
      const message = typeof data === 'string' ? data : data?.error || data?.message
      setError(message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md"
      >
        <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/60">Login to track and manage your parcels.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-md hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
