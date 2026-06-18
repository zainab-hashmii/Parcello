import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const { login } = useAuth()
  const navigate = useNavigate()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { name, email, phone, password, accountType, address } = form
      await signUp({ name, email, phone, password, accountType, address })
      const { data: createdUser } = await getUserByEmail(email)
      login(createdUser)
      navigate(accountType === 'Rider' ? '/rider' : '/customer')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-brand-light px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-ink">Create Your Account</h1>
        <p className="mt-1 text-sm text-ink/60">Enter details below to create new account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            type="email"
            required
            placeholder="Your email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            required
            placeholder="Your phone number"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            required
            placeholder="Your address"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            type="password"
            required
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            placeholder="Enter referral code (optional)"
            value={form.referralCode}
            onChange={(e) => update('referralCode', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand"
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
            disabled={loading}
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
      </div>
    </div>
  )
}
