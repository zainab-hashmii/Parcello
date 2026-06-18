import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { addParcel, getLocations } from '../../api/endpoints'

const BOX_SIZES = [
  { label: 'Small Box', type: 'SMALL', weight: 2, price: 'Rs 350' },
  { label: 'Medium Box', type: 'MEDIUM', weight: 6, price: 'Rs 650' },
  { label: 'Large Box', type: 'LARGE', weight: 12, price: 'Rs 950' },
]

export default function BookParcel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [originId, setOriginId] = useState('')
  const [destinationId, setDestinationId] = useState('')
  const [sendAddress, setSendAddress] = useState('')
  const [address, setAddress] = useState('')
  const [selectedBox, setSelectedBox] = useState(BOX_SIZES[0])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getLocations().then((res) => setLocations(res.data)).catch(() => setLocations([]))
  }, [])

  const origin = useMemo(() => locations.find((l) => l._id === originId), [locations, originId])
  const destination = useMemo(() => locations.find((l) => l._id === destinationId), [locations, destinationId])

  async function handleConfirm() {
    if (!origin || !destination) {
      setStatus('Please choose both pickup and drop locations.')
      return
    }
    setLoading(true)
    setStatus('')
    try {
      await addParcel({
        customerId: user._id || user.id,
        originCity: origin.city,
        originCountry: origin.country,
        destinationCity: destination.city,
        destinationCountry: destination.country,
        placementDate: new Date().toISOString(),
        type: selectedBox.type,
        weight: selectedBox.weight,
        address,
        sendAddress,
      })
      setStatus('success')
      setTimeout(() => navigate('/customer'), 1200)
    } catch (err) {
      setStatus(err.response?.data?.error || 'Could not create parcel. Make sure a route exists between these locations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Book a parcel</h1>
      <p className="mt-1 text-sm text-ink/60">Choose pickup &amp; drop locations, then pick a box size.</p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-ink/50">Pickup location</label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          >
            <option value="">Select city</option>
            {locations.map((l) => (
              <option key={l._id} value={l._id}>
                {l.city}, {l.country}
              </option>
            ))}
          </select>
          <input
            placeholder="Pickup address"
            value={sendAddress}
            onChange={(e) => setSendAddress(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-ink/50">Drop location</label>
          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          >
            <option value="">Select city</option>
            {locations.map((l) => (
              <option key={l._id} value={l._id}>
                {l.city}, {l.country}
              </option>
            ))}
          </select>
          <input
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-2 shadow-sm">
        <p className="px-4 pt-3 text-sm font-medium text-ink/70">Choose a box size</p>
        {BOX_SIZES.map((box) => (
          <button
            key={box.type}
            onClick={() => setSelectedBox(box)}
            className={`flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left last:border-none ${
              selectedBox.type === box.type ? 'bg-brand-light' : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span className="font-medium text-ink">{box.label}</span>
            </span>
            <span className="font-semibold text-ink">{box.price}</span>
          </button>
        ))}
      </div>

      {status && status !== 'success' && <p className="mt-4 text-sm text-red-500">{status}</p>}
      {status === 'success' && <p className="mt-4 text-sm text-green-600">Parcel booked! Redirecting...</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-md hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? 'Booking...' : `Confirm ${selectedBox.label}`}
      </button>
    </div>
  )
}
