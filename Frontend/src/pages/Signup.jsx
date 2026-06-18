import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signUp, getUserByEmail } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    accountType: 'Customer',
    address: '',
    referralCode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailTaken, setEmailTaken] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const emailCheckTimer = useRef(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (field === 'email') {
      setEmailTaken(false)
      clearTimeout(emailCheckTimer.current)
      const value_ = value.trim()
      if (!value_ || !value_.includes('@')) return
      emailCheckTimer.current = setTimeout(async () => {
        setCheckingEmail(true)
        try {
          await getUserByEmail(value_)
          setEmailTaken(true)
        } catch {
          setEmailTaken(false)
        } finally {
          setCheckingEmail(false)
        }
      }, 500)
    }
  }

  function extractErrorMessage(err) {
    const data = err.response?.data
    if (typeof data === 'string') return data
    return data?.error || data?.message || 'Sign up failed.'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (emailTaken) {
      setError('That email is already registered. Try logging in instead.')
      return
    }

    setLoading(true)
    try {
      const { name, email, phone, password, accountType, address } = form
      await signUp({ name, email, phone, password, accountType, address })
      const { data: createdUser } = await getUserByEmail(email)
      login(createdUser)
      navigate(accountType === 'Rider' ? '/rider' : '/customer')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => () => clearTimeout(emailCheckTimer.current), [])

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md"
      >
        <h1 className="text-2xl font-bold text-ink">Create Your Account</h1>
        <p className="mt-1 text-sm text-ink/60">Enter details below to create new account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <div>
            <input
              type="email"
              required
              placeholder="Your email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand ${
                emailTaken ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {checkingEmail && <p className="mt-1 text-xs text-ink/40">Checking email...</p>}
            {!checkingEmail && emailTaken && (
              <p className="mt-1 text-xs text-red-500">
                This email is already registered. <Link to="/login" className="font-semibold underline">Log in</Link> instead.
              </p>
            )}
          </div>
          <input
            required
            placeholder="Your phone number"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            required
            placeholder="Your address"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            type="password"
            required
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            placeholder="Enter referral code (optional)"
            value={form.referralCode}
            onChange={(e) => update('referralCode', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand"
          />

          <div className="flex gap-2 text-sm">
            {['Customer', 'Rider'].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => update('accountType', type)}
                className={`flex-1 rounded-xl border py-2 font-medium ${
                  form.accountType === type
                    ? 'border-brand bg-brand-light text-brand'
                    : 'border-gray-200 text-ink/60'
                }`}
              >
                {type === 'Customer' ? 'I want to ship' : 'I want to deliver'}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{String(error)}</p>}

          <button
            type="submit"
            disabled={loading || checkingEmail || emailTaken}
            className="w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-md hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'CREATE AN ACCOUNT'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
