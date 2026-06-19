import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, Clock, MapPin, Truck, Ship, Plane, ArrowRight } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import { StaggerGroup, StaggerItem } from '../components/StaggerList'

const PERKS = [
  { icon: Wallet, title: 'Earn per delivery', desc: 'Get paid for every batch you carry, calculated from real distance and weight.' },
  { icon: Clock, title: 'Work on your schedule', desc: 'Pick up available batches near you whenever you want to drive.' },
  { icon: MapPin, title: 'Live route tracking', desc: 'Navigate hub-to-hub with built-in map tracking for every parcel.' },
]

const VEHICLES = [
  { icon: Truck, label: 'Truck', desc: 'City and intercity ground deliveries.' },
  { icon: Ship, label: 'Ship', desc: 'High-capacity cargo across coastal routes.' },
  { icon: Plane, label: 'Airplane', desc: 'Fast long-distance parcel transport.' },
]

export default function Couriers() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Deliver with Parcello</h1>
        <p className="mt-2 max-w-xl text-ink/60">
          Join our network of couriers and start earning by moving parcels between hubs — by truck, ship, or
          airplane.
        </p>
        <Link
          to="/signup?type=Rider"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-brand to-brand-light-tone px-6 py-3 font-semibold text-white shadow-[0_10px_28px_-8px_rgba(255,138,0,0.55)]"
        >
          Become a courier <ArrowRight size={16} />
        </Link>
      </motion.div>

      <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, desc }) => (
          <StaggerItem key={title}>
            <GlassCard className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-brand">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
              <p className="mt-1 text-xs text-ink/50">{desc}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <h2 className="mt-12 text-lg font-semibold text-ink">Register any vehicle type</h2>
      <StaggerGroup className="mt-4 grid gap-4 sm:grid-cols-3">
        {VEHICLES.map(({ icon: Icon, label, desc }) => (
          <StaggerItem key={label}>
            <GlassCard className="flex flex-col items-center p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand">
                <Icon size={22} />
              </span>
              <p className="mt-3 font-semibold text-ink">{label}</p>
              <p className="mt-1 text-xs text-ink/50">{desc}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="mt-12 text-center">
        <p className="text-sm text-ink/60">Already a courier?</p>
        <Link to="/login" className="font-semibold text-brand">
          Log in to your rider account
        </Link>
      </motion.div>
    </div>
  )
}
