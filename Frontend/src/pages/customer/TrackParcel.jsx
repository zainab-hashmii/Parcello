import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getParcelLog, getPaymentForParcel } from '../../api/endpoints'
import TrackingMap from '../../components/TrackingMap'
import { StaggerGroup, StaggerItem } from '../../components/StaggerList'

const STEPS = ['WAITING', 'PICKED_UP', 'IN_TRANSIT', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED']

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
  if (!log) return <p className="p-10 text-center text-ink/50">Loading tracking info...</p>

  const parcel = log.parcel || {}
  const currentStepIndex = STEPS.indexOf(log.status)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/customer" className="text-sm text-ink/50 hover:text-brand">← Back to shipments</Link>
      <h1 className="mt-2 text-2xl font-bold text-ink">Live Tracking</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-96 overflow-hidden rounded-2xl border border-orange-100 shadow-sm"
        >
          <TrackingMap
            origin={parcel.origin}
            destination={parcel.destination}
            current={log.location}
          />
        </motion.div>

        <StaggerGroup className="space-y-4">
          <StaggerItem className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs uppercase text-ink/40">Parcel</p>
            <p className="font-semibold text-ink">{parcel.type} · {parcel.weight}kg</p>
            <p className="mt-1 text-sm text-ink/60">
              {parcel.origin?.city} → {parcel.destination?.city}
            </p>
            {payment && (
              <p className="mt-3 text-sm font-medium text-ink">
                Payment: Rs {payment.amount}{' '}
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-brand">
                  {payment.paymentStatus}
                </span>
              </p>
            )}
          </StaggerItem>

          <StaggerItem className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs uppercase text-ink/40">Courier status</p>
            <ol className="mt-3 space-y-3">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3"
                >
                  <span className="relative flex h-3 w-3 items-center justify-center">
                    {i === currentStepIndex && (
                      <motion.span
                        className="absolute h-3 w-3 rounded-full bg-brand"
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <span
                      className={`h-3 w-3 rounded-full ${i <= currentStepIndex ? 'bg-brand' : 'bg-gray-200'}`}
                    />
                  </span>
                  <span
                    className={`text-sm ${
                      i === currentStepIndex ? 'font-semibold text-ink' : 'text-ink/50'
                    }`}
                  >
                    {step.replaceAll('_', ' ')}
                  </span>
                </motion.li>
              ))}
            </ol>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </div>
  )
}
