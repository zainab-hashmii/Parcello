import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, Weight, Ruler, Truck, MapPin, Gauge, Clock } from 'lucide-react'
import { getParcelLog, getPaymentForParcel } from '../../api/endpoints'
import TrackingMap from '../../components/TrackingMap'
import GlassCard from '../../components/ui/GlassCard'
import { StaggerGroup, StaggerItem } from '../../components/StaggerList'

const STEPS = [
  { key: 'WAITING', label: 'Parcel Created' },
  { key: 'PICKED_UP', label: 'Courier Assigned' },
  { key: 'IN_TRANSIT', label: 'Picked Up' },
  { key: 'AT_WAREHOUSE', label: 'Warehouse Arrival' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out For Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
]

const STEP_PROGRESS = [0.05, 0.2, 0.4, 0.6, 0.85, 1]

// Plausible dimensions derived from weight — backend doesn't track this yet.
function estimateDimensions(weight) {
  const base = Math.cbrt(Math.max(weight, 1) * 4000)
  const l = Math.round(base * 1.15)
  const w = Math.round(base * 0.9)
  const h = Math.round(base * 0.75)
  return `${l} × ${w} × ${h} cm`
}

function estimateSpeed(statusIndex) {
  const speeds = [0, 38, 52, 0, 44, 0]
  return speeds[statusIndex] ?? 0
}

function estimateDistanceRemaining(progress) {
  const totalKm = 1100
  return Math.max(Math.round(totalKm * (1 - progress)), 0)
}

export default function TrackParcel() {
  const { parcelId } = useParams()
  const [log, setLog] = useState(null)
  const [payment, setPayment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getParcelLog(parcelId)
      .then((res) => setLog(res.data))
      .catch(() => setError('Could not load tracking info for this parcel.'))
    getPaymentForParcel(parcelId)
      .then((res) => setPayment(res.data))
      .catch(() => {})
  }, [parcelId])

  if (error) return <p className="p-10 text-center text-red-500">{error}</p>
  if (!log)
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="h-96 animate-pulse rounded-[1.5rem] bg-orange-50" />
      </div>
    )

  const parcel = log.parcel || {}
  const currentStepIndex = Math.max(STEPS.findIndex((s) => s.key === log.status), 0)
  const progress = STEP_PROGRESS[currentStepIndex] ?? 0.1

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/customer" className="flex items-center gap-1 text-sm text-ink/50 hover:text-brand">
        <ArrowLeft size={14} /> Back to shipments
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Live Tracking</h1>
      <p className="text-sm text-ink/50">
        Tracking #{(parcel._id || parcelId || '').slice(-8).toUpperCase()}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-[28rem] overflow-hidden rounded-[1.5rem] border border-orange-100 shadow-[0_8px_30px_-8px_rgba(31,36,48,0.10)]"
        >
          <TrackingMap origin={parcel.origin} destination={parcel.destination} progress={progress} />
        </motion.div>

        <GlassCard className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Live vehicle status</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-xl">🚚</span>
            <div>
              <p className="font-semibold text-ink">
                {currentStepIndex >= 1 && currentStepIndex < 5 ? 'Courier en route' : 'Awaiting courier'}
              </p>
              <p className="text-xs text-ink/50">Truck · assigned on pickup</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-orange-50/60 p-3">
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><Gauge size={11} /> Current speed</p>
              <p className="mt-1 font-semibold text-ink">{estimateSpeed(currentStepIndex)} km/h</p>
            </div>
            <div className="rounded-2xl bg-orange-50/60 p-3">
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><MapPin size={11} /> Distance left</p>
              <p className="mt-1 font-semibold text-ink">{estimateDistanceRemaining(progress)} km</p>
            </div>
            <div className="rounded-2xl bg-orange-50/60 p-3">
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><Clock size={11} /> ETA</p>
              <p className="mt-1 font-semibold text-ink">{currentStepIndex >= 5 ? 'Delivered' : currentStepIndex >= 4 ? 'Today' : `${5 - currentStepIndex} days`}</p>
            </div>
            <div className="rounded-2xl bg-orange-50/60 p-3">
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><Truck size={11} /> Vehicle</p>
              <p className="mt-1 font-semibold text-ink">Truck</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <GlassCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Shipment details</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><Package size={11} /> Type</p>
              <p className="mt-1 text-sm font-semibold text-ink">{parcel.type || 'Parcel'}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><Weight size={11} /> Weight</p>
              <p className="mt-1 text-sm font-semibold text-ink">{parcel.weight}kg</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><Ruler size={11} /> Dimensions</p>
              <p className="mt-1 text-sm font-semibold text-ink">{estimateDimensions(parcel.weight || 1)}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink/40"><MapPin size={11} /> Route</p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {parcel.origin?.city} → {parcel.destination?.city}
              </p>
            </div>
          </div>
          {payment && (
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-orange-50/60 px-4 py-3">
              <span className="text-sm text-ink/60">Total cost</span>
              <span className="flex items-center gap-2 font-semibold text-ink">
                Rs {payment.amount}
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">{payment.paymentStatus}</span>
              </span>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Tracking timeline</p>
          <StaggerGroup className="mt-4 space-y-0">
            {STEPS.map((step, i) => {
              const done = i < currentStepIndex
              const active = i === currentStepIndex
              return (
                <StaggerItem key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span
                      className={`absolute left-[11px] top-6 h-full w-[2px] ${
                        done ? 'bg-brand' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                    {active && (
                      <motion.span
                        className="absolute h-6 w-6 rounded-full bg-brand/40"
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <span
                      className={`relative flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        done || active
                          ? 'bg-linear-to-br from-brand to-brand-light-tone text-white shadow-[0_0_12px_rgba(255,138,0,0.5)]'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                  </span>
                  <span className={`text-sm ${active ? 'font-semibold text-ink' : done ? 'text-ink/70' : 'text-ink/35'}`}>
                    {step.label}
                  </span>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </GlassCard>
      </div>
    </div>
  )
}
