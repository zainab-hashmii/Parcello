import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Truck, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getParcelsOfCustomer, getParcelLog, getPaymentForParcel } from '../../api/endpoints'
import { StaggerGroup, StaggerItem } from '../../components/StaggerList'
import GlassCard from '../../components/ui/GlassCard'
import KpiCard from '../../components/ui/KpiCard'
import ProgressJourney from '../../components/ui/ProgressJourney'
import { ShipmentCardSkeleton, KpiCardSkeleton } from '../../components/ui/Skeleton'

const STATUS_LABEL = {
  WAITING: 'Booked',
  PICKED_UP: 'Picked up',
  IN_TRANSIT: 'In transit',
  AT_WAREHOUSE: 'At warehouse',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  FAILED_DELIVERY: 'Delivery failed',
}

const STATUS_BADGE = {
  WAITING: 'bg-gray-100 text-gray-600',
  PICKED_UP: 'bg-blue-100 text-blue-600',
  IN_TRANSIT: 'bg-orange-100 text-orange-600',
  AT_WAREHOUSE: 'bg-purple-100 text-purple-600',
  OUT_FOR_DELIVERY: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green-100 text-green-700',
  FAILED_DELIVERY: 'bg-red-100 text-red-600',
}

const STATUS_PROGRESS = {
  WAITING: 8,
  PICKED_UP: 28,
  IN_TRANSIT: 50,
  AT_WAREHOUSE: 65,
  OUT_FOR_DELIVERY: 85,
  DELIVERED: 100,
  FAILED_DELIVERY: 70,
}

const ACTIVITY_FOR_STATUS = {
  WAITING: 'Parcel booked',
  PICKED_UP: 'Courier assigned & picked up',
  IN_TRANSIT: 'In transit to destination',
  AT_WAREHOUSE: 'Arrived at warehouse',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered successfully',
  FAILED_DELIVERY: 'Delivery attempt failed',
}

function estimateEta(status) {
  const daysLeft = { WAITING: 3, PICKED_UP: 2, IN_TRANSIT: 2, AT_WAREHOUSE: 1, OUT_FOR_DELIVERY: 0, DELIVERED: 0, FAILED_DELIVERY: 1 }
  const d = daysLeft[status] ?? 2
  if (d === 0) return 'Today'
  const date = new Date()
  date.setDate(date.getDate() + d)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const customerId = user._id || user.id
    let cancelled = false

    getParcelsOfCustomer(customerId)
      .then(async (res) => {
        const base = res.data
        const enriched = await Promise.all(
          base.map(async (p) => {
            const [logRes, paymentRes] = await Promise.allSettled([
              getParcelLog(p._id),
              getPaymentForParcel(p._id),
            ])
            return {
              ...p,
              status: logRes.status === 'fulfilled' ? logRes.value.data.status : 'WAITING',
              payment: paymentRes.status === 'fulfilled' ? paymentRes.value.data : null,
            }
          })
        )
        if (!cancelled) setParcels(enriched)
      })
      .catch(() => !cancelled && setParcels([]))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [user])

  const filtered = parcels.filter(
    (p) =>
      (p._id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.type || '').toLowerCase().includes(search.toLowerCase())
  )

  const kpis = useMemo(() => {
    const today = new Date().toDateString()
    const active = parcels.filter((p) => p.status !== 'DELIVERED' && p.status !== 'FAILED_DELIVERY').length
    const deliveredToday = parcels.filter(
      (p) => p.status === 'DELIVERED' && new Date(p.updatedAt || p.createdAt).toDateString() === today
    ).length
    const totalDeliveries = parcels.filter((p) => p.status === 'DELIVERED').length
    const amountSpent = parcels.reduce((sum, p) => sum + (p.payment?.amount || 0), 0)
    return { active, deliveredToday, totalDeliveries, amountSpent }
  }, [parcels])

  const activity = useMemo(() => {
    return [...parcels]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 6)
      .map((p) => ({
        id: p._id,
        text: `${ACTIVITY_FOR_STATUS[p.status] || 'Status updated'} — ${p.type || 'Parcel'} to ${p.destination?.city || 'destination'}`,
        time: new Date(p.updatedAt || p.createdAt),
      }))
  }, [parcels])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm text-ink/60">Hello, {user.name?.split(' ')[0] || 'there'} 👋</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Welcome back.</h1>
        </div>
        <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/customer/book"
            className="flex items-center gap-2 rounded-full bg-linear-to-r from-brand to-brand-light-tone px-6 py-3 font-semibold text-white shadow-[0_10px_28px_-8px_rgba(255,138,0,0.55)] transition hover:shadow-[0_14px_32px_-8px_rgba(255,138,0,0.7)]"
          >
            + Book a parcel
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard icon="🚚" label="Active shipments" value={kpis.active} delay={0} accent />
            <KpiCard icon="✅" label="Delivered today" value={kpis.deliveredToday} delay={0.05} />
            <KpiCard icon="📦" label="Total deliveries" value={kpis.totalDeliveries} delay={0.1} />
            <KpiCard icon="💰" label="Amount spent" value={kpis.amountSpent} prefix="Rs " delay={0.15} />
          </>
        )}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Your shipments</h2>
          </div>

          <div className="relative mt-3">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              placeholder="Search by tracking ID or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 pl-11 text-sm shadow-sm backdrop-blur-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <StaggerGroup className="mt-4 space-y-3">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => <ShipmentCardSkeleton key={i} />)}

            {!loading && filtered.length === 0 && (
              <GlassCard className="p-10 text-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="mx-auto text-5xl"
                >
                  🚚📦
                </motion.div>
                <p className="mt-4 font-semibold text-ink">No shipments yet</p>
                <p className="mt-1 text-sm text-ink/50">
                  Create your first parcel delivery to see it tracked here.
                </p>
                <Link
                  to="/customer/book"
                  className="mt-5 inline-flex items-center gap-1 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Book a parcel <ArrowRight size={14} />
                </Link>
              </GlassCard>
            )}

            {filtered.map((p) => (
              <StaggerItem key={p._id} whileHover={{ y: -3 }}>
                <Link to={`/customer/track/${p._id}`} className="block">
                  <GlassCard className="p-5 transition hover:border-brand/40 hover:shadow-[0_14px_36px_-10px_rgba(255,138,0,0.25)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                          📦
                        </span>
                        <div>
                          <p className="font-semibold text-ink">
                            {p.type || 'Parcel'} · {p.weight}kg
                          </p>
                          <p className="flex items-center gap-1 text-xs text-ink/50">
                            <MapPin size={11} /> {p.origin?.city || '—'} → {p.destination?.city || '—'}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/30">
                            #{(p._id || '').slice(-8)}
                          </p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[p.status] || STATUS_BADGE.WAITING}`}>
                        {STATUS_LABEL[p.status] || 'Booked'}
                      </span>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <ProgressJourney status={p.status} compact />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-ink/50">
                      <div className="flex items-center gap-1">
                        <Truck size={12} /> ETA {estimateEta(p.status)}
                      </div>
                      <span>{STATUS_PROGRESS[p.status] ?? 0}% complete</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-orange-50">
                      <motion.div
                        className="h-full rounded-full bg-linear-to-r from-brand to-brand-light-tone"
                        initial={{ width: 0 }}
                        animate={{ width: `${STATUS_PROGRESS[p.status] ?? 0}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink">Activity feed</h2>
          <GlassCard className="mt-3 p-5">
            {loading && <p className="text-sm text-ink/40">Loading activity...</p>}
            {!loading && activity.length === 0 && (
              <p className="text-sm text-ink/40">No recent activity yet.</p>
            )}
            <ol className="space-y-4">
              {activity.map((a, i) => (
                <motion.li
                  key={a.id + i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-3"
                >
                  <span className="relative mt-1 flex h-2 w-2 shrink-0 rounded-full bg-brand">
                    {i === 0 && (
                      <motion.span
                        className="absolute h-2 w-2 rounded-full bg-brand"
                        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </span>
                  <div>
                    <p className="text-sm text-ink">{a.text}</p>
                    <p className="text-xs text-ink/40">
                      {a.time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ·{' '}
                      {a.time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
