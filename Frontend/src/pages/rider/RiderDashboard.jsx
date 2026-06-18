import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  getRiderBatches,
  getBatchesByLocation,
  assignRider,
  changeBatchLocation,
  dropBatch,
  getLocations,
} from '../../api/endpoints'
import { StaggerGroup, StaggerItem } from '../../components/StaggerList'

export default function RiderDashboard() {
  const { user } = useAuth()
  const riderId = user._id || user.id

  const [myBatches, setMyBatches] = useState([])
  const [availableBatches, setAvailableBatches] = useState([])
  const [locations, setLocations] = useState([])
  const [searchCity, setSearchCity] = useState('')
  const [searchCountry, setSearchCountry] = useState('')
  const [moveLocationCity, setMoveLocationCity] = useState('')
  const [activeBatchId, setActiveBatchId] = useState(null)
  const [message, setMessage] = useState('')

  function loadMyBatches() {
    getRiderBatches(riderId).then((res) => setMyBatches(res.data)).catch(() => setMyBatches([]))
  }

  useEffect(() => {
    loadMyBatches()
    getLocations().then((res) => setLocations(res.data)).catch(() => setLocations([]))
  }, [riderId])

  async function searchAvailable() {
    if (!searchCity || !searchCountry) return
    const res = await getBatchesByLocation(searchCity, searchCountry)
    setAvailableBatches(res.data)
  }

  async function handleAssign(batchId) {
    setMessage('')
    try {
      await assignRider(batchId, riderId)
      setMessage('Batch assigned to you.')
      loadMyBatches()
      setAvailableBatches((prev) => prev.filter((b) => b._id !== batchId))
    } catch {
      setMessage('Could not assign batch.')
    }
  }

  async function handleMoveLocation(batchId) {
    if (!moveLocationCity) return
    setMessage('')
    try {
      await changeBatchLocation(batchId, riderId, moveLocationCity)
      setMessage('Batch location updated.')
      setActiveBatchId(null)
      setMoveLocationCity('')
      loadMyBatches()
    } catch {
      setMessage('Could not update location — check a route exists between hubs.')
    }
  }

  async function handleDrop(batchId) {
    await dropBatch(batchId)
    loadMyBatches()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-ink/60">Hello, {user.name?.split(' ')[0] || 'rider'} 👋</p>
      <h1 className="text-2xl font-bold text-ink">Rider dashboard</h1>
      <p className="mt-1 text-sm text-brand">Due amount: Rs {user.dueAmount ?? 0}</p>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 text-sm text-brand"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ink">My active batches</h2>
        <StaggerGroup className="mt-3 space-y-3">
          {myBatches.length === 0 && (
            <p className="rounded-xl border border-dashed border-gray-200 bg-white/60 p-6 text-center text-sm text-ink/50">
              You have no active batches. Find one below.
            </p>
          )}
          {myBatches.map((b) => (
            <StaggerItem
              key={b._id}
              className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {b.currentLocation?.city} → {b.destination?.city}
                  </p>
                  <p className="text-xs text-ink/50">Weight: {b.weight}kg · Status: {b.status}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveBatchId(activeBatchId === b._id ? null : b._id)}
                    className="rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold text-brand hover:bg-orange-100"
                  >
                    Update location
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleDrop(b._id)}
                    className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-ink/60 hover:bg-gray-200"
                  >
                    Drop
                  </motion.button>
                </div>
              </div>
              <AnimatePresence>
                {activeBatchId === b._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-3 flex gap-2 overflow-hidden"
                  >
                    <select
                      value={moveLocationCity}
                      onChange={(e) => setMoveLocationCity(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm"
                    >
                      <option value="">Select new hub city</option>
                      {locations.map((l) => (
                        <option key={l._id} value={l.city}>{l.city}, {l.country}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleMoveLocation(b._id)}
                      className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                    >
                      Confirm
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Find batches ready for pickup</h2>
        <div className="mt-3 flex gap-2">
          <input
            placeholder="City"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur-sm"
          />
          <input
            placeholder="Country"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur-sm"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={searchAvailable}
            className="rounded-xl bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-ink/80"
          >
            Search
          </motion.button>
        </div>

        <StaggerGroup className="mt-4 space-y-3">
          {availableBatches.map((b) => (
            <StaggerItem
              key={b._id}
              className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
            >
              <div>
                <p className="font-semibold text-ink">
                  {b.currentLocation?.city} → {b.destination?.city}
                </p>
                <p className="text-xs text-ink/50">Weight: {b.weight}kg</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAssign(b._id)}
                className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
              >
                Pick up
              </motion.button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </div>
  )
}
