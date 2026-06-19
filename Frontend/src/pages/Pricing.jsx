import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Fuel, Weight, Route, Wallet, ArrowRight } from 'lucide-react'
import { getPricingConfig } from '../api/endpoints'
import GlassCard from '../components/ui/GlassCard'
import { StaggerGroup, StaggerItem } from '../components/StaggerList'

const FACTORS = [
  { icon: Wallet, label: 'Base fare', key: 'baseFare', prefix: 'Rs ', desc: 'Flat fee included with every booking.' },
  { icon: Weight, label: 'Rate per kg per km', key: 'ratePerKgPerKm', prefix: 'Rs ', desc: 'Scales with parcel weight and distance.' },
  { icon: Fuel, label: 'Fuel price per liter', key: 'fuelPricePerLiter', prefix: 'Rs ', desc: 'Live fuel cost factored into your share of the trip.' },
  { icon: Route, label: 'Vehicle mileage', key: 'mileageKmPerLiter', suffix: ' km/l', desc: 'Used to estimate fuel consumed for your delivery.' },
]

export default function Pricing() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    getPricingConfig().then((res) => setConfig(res.data)).catch(() => {})
  }, [])

  const exampleWeight = 5
  const exampleDistance = 1200
  const example =
    config &&
    config.baseFare +
      exampleWeight * exampleDistance * config.ratePerKgPerKm +
      (exampleDistance / config.mileageKmPerLiter) * config.fuelPricePerLiter * (exampleWeight / 80)

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Simple, transparent pricing</h1>
        <p className="mt-2 max-w-xl text-ink/60">
          We don't charge by box size. Your price is calculated from your parcel's real weight, the distance it
          travels, and current fuel costs — so you only pay for what you actually ship.
        </p>
      </motion.div>

      <StaggerGroup className="mt-8 grid gap-4 sm:grid-cols-2">
        {FACTORS.map(({ icon: Icon, label, key, prefix = '', suffix = '', desc }) => (
          <StaggerItem key={key}>
            <GlassCard className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-brand">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {config ? `${prefix}${config[key]}${suffix}` : '...'}
              </p>
              <p className="mt-1 text-xs text-ink/50">{desc}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <GlassCard className="mt-8 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Example estimate</p>
        <p className="mt-2 text-sm text-ink/60">
          A {exampleWeight}kg parcel travelling {exampleDistance}km would cost approximately
        </p>
        <p className="mt-1 text-3xl font-bold text-brand">{example ? `Rs ${Math.round(example)}` : '...'}</p>
        <p className="mt-2 text-xs text-ink/40">
          Final price = base fare + (weight × distance × rate) + (your share of fuel cost for the trip).
        </p>
      </GlassCard>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="mt-10 text-center">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-brand to-brand-light-tone px-6 py-3 font-semibold text-white shadow-[0_10px_28px_-8px_rgba(255,138,0,0.55)]"
        >
          Get an exact quote <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  )
}
