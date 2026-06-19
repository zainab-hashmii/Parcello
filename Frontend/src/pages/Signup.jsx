import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowLeft, ArrowRight, Package, Bike } from 'lucide-react'
import { signUp, getUserByEmail } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import FloatingInput from '../components/ui/FloatingInput'
import SignupIllustration from '../components/SignupIllustration'

const STEPS = ['Personal', 'Address', 'Account type', 'Confirm']

export default function Signup() {
  const [searchParams] = useSearchParams()
  const initialType = searchParams.get('type') === 'Rider' ? 'Rider' : 'Customer'
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    accountType: initialType,
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

  function canAdvance() {
    if (step === 0) return form.name.trim() && form.email.trim() && !emailTaken && !checkingEmail && form.password.length >= 4
    if (step === 1) return form.phone.trim() && form.address.trim()
    return true
  }

  function next() {
    if (!canAdvance()) return
    setError('')
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  function back() {
    setError('')
    setStep((s) => Math.max(s - 1, 0))
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

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <SignupIllustration />

      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink/60">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>

          <div className="mt-5 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    i < step
                      ? 'bg-brand text-white'
                      : i === step
                      ? 'bg-linear-to-br from-brand to-brand-light-tone text-white shadow-[0_0_12px_rgba(255,138,0,0.5)]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded-full ${i < step ? 'bg-brand' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-7">
            <AnimatePresence mode="wait" custom={1}>
              {step === 0 && (
                <motion.div key="step0" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-4">
                  <FloatingInput label="Your name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
                  <div>
                    <FloatingInput
                      label="Your email"
                      type="email"
                      required
                      value={form.email}
                      error={emailTaken}
                      onChange={(e) => update('email', e.target.value)}
                    />
                    {checkingEmail && <p className="mt-1 text-xs text-ink/40">Checking email...</p>}
                    {!checkingEmail && emailTaken && (
                      <p className="mt-1 text-xs text-red-500">
                        This email is already registered. <Link to="/login" className="font-semibold underline">Log in</Link> instead.
                      </p>
                    )}
                  </div>
                  <FloatingInput label="Password" type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-4">
                  <FloatingInput label="Phone number" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                  <FloatingInput label="Address" required value={form.address} onChange={(e) => update('address', e.target.value)} />
                  <FloatingInput label="Referral code (optional)" value={form.referralCode} onChange={(e) => update('referralCode', e.target.value)} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'Customer', label: 'I want to ship', icon: Package },
                    { type: 'Rider', label: 'I want to deliver', icon: Bike },
                  ].map(({ type, label, icon: Icon }) => (
                    <motion.button
                      type="button"
                      key={type}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => update('accountType', type)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 text-sm font-medium transition ${
                        form.accountType === type
                          ? 'border-brand bg-brand-light text-brand shadow-[0_8px_20px_-8px_rgba(255,138,0,0.4)]'
                          : 'border-gray-200 text-ink/60'
                      }`}
                    >
                      <Icon size={22} />
                      {label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-3">
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm">
                    <Row label="Name" value={form.name} />
                    <Row label="Email" value={form.email} />
                    <Row label="Phone" value={form.phone} />
                    <Row label="Address" value={form.address} />
                    <Row label="Account type" value={form.accountType === 'Customer' ? 'Ship parcels' : 'Deliver parcels'} last />
                  </div>
                  <p className="text-xs text-ink/40">Review your details, then create your account.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm text-red-500">
                {String(error)}
              </motion.p>
            )}

            <div className="mt-7 flex gap-3">
              {step > 0 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={back}
                  className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-ink/70"
                >
                  <ArrowLeft size={15} /> Back
                </motion.button>
              )}
              {step < STEPS.length - 1 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={next}
                  disabled={!canAdvance()}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-linear-to-r from-brand to-brand-light-tone py-3 font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,138,0,0.55)] transition disabled:opacity-50"
                >
                  Continue <ArrowRight size={15} />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-linear-to-r from-brand to-brand-light-tone py-3 font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,138,0,0.55)] disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </motion.button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Row({ label, value, last = false }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${last ? '' : 'border-b border-orange-100/60'}`}>
      <span className="text-ink/50">{label}</span>
      <span className="font-medium text-ink">{value || '—'}</span>
    </div>
  )
}
