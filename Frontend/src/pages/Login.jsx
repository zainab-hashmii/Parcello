import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
      setError(err.response?.data?.message || err.response?.data || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-brand-light px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/60">Login to track and manage your parcels.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
          />

          {error && <p className="text-sm text-red-500">{String(error)}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-md hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
