import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPricingConfig, updatePricingConfig } from '../../api/endpoints'
import { StaggerGroup, StaggerItem } from '../../components/StaggerList'

const FIELDS = [
  { key: 'baseFare', label: 'Base fare (Rs)', step: '1' },
  { key: 'ratePerKgPerKm', label: 'Rate per kg per km (Rs)', step: '0.01' },
  { key: 'fuelPricePerLiter', label: 'Fuel price per liter (Rs)', step: '0.5' },
  { key: 'mileageKmPerLiter', label: 'Vehicle mileage (km per liter)', step: '0.1' },
]

export default function PricingSettings() {
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getPricingConfig().then((res) => setForm(res.data)).catch(() => {})
  }, [])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const payload = Object.fromEntries(FIELDS.map((f) => [f.key, Number(form[f.key])]))
      const { data } = await updatePricingConfig(payload)
      setForm(data)
      setMessage('Pricing updated.')
    } catch {
      setMessage('Could not update pricing.')
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <p className="p-10 text-center text-ink/50">Loading pricing config...</p>

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link to="/admin" className="text-sm text-ink/50 hover:text-brand">← Back to overview</Link>
      <h1 className="mt-2 text-2xl font-bold text-ink">Delivery pricing</h1>
      <p className="mt-1 text-sm text-ink/60">
        Final price = base fare + (weight × distance × rate) + (distance ÷ mileage × fuel price).
      </p>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
      >
        <StaggerGroup className="space-y-4">
          {FIELDS.map((f) => (
            <StaggerItem key={f.key}>
              <label className="text-xs font-semibold uppercase text-ink/50">{f.label}</label>
              <input
                type="number"
                step={f.step}
                min="0"
                required
                value={form[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm"
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {message && <p className="text-sm text-brand">{message}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save pricing'}
        </motion.button>
      </motion.form>
    </div>
  )
}
