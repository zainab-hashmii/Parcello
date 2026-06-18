import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { addParcel, getPriceQuoteByCoords } from '../../api/endpoints'
import LocationPicker from '../../components/LocationPicker'

export default function BookParcel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [sendAddressNote, setSendAddressNote] = useState('')
  const [addressNote, setAddressNote] = useState('')
  const [weight, setWeight] = useState('')
  const [parcelType, setParcelType] = useState('PACKAGE')
  const [quote, setQuote] = useState(null)
  const [quoteError, setQuoteError] = useState('')
  const [quoting, setQuoting] = useState(false)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const quoteTimer = useRef(null)

  useEffect(() => {
    setQuote(null)
    setQuoteError('')
    clearTimeout(quoteTimer.current)

    const w = Number(weight)
    if (origin?.lat == null || destination?.lat == null || !w || w <= 0) return

    quoteTimer.current = setTimeout(async () => {
      setQuoting(true)
      try {
        const { data } = await getPriceQuoteByCoords(origin, destination, w)
        setQuote(data)
      } catch (err) {
        setQuoteError(err.response?.data?.error || 'Could not calculate a price for this route.')
      } finally {
        setQuoting(false)
      }
    }, 450)

    return () => clearTimeout(quoteTimer.current)
  }, [origin, destination, weight])

  async function handleConfirm() {
    if (origin?.lat == null || destination?.lat == null) {
      setStatus('Please pick both pickup and drop locations on the map.')
      return
    }
    const w = Number(weight)
    if (!w || w <= 0) {
      setStatus('Please enter the parcel weight.')
      return
    }
    if (!quote) {
      setStatus('Waiting for a price quote — make sure pickup, drop and weight are all set.')
      return
    }

    setLoading(true)
    setStatus('')
    try {
      await addParcel({
        customerId: user._id || user.id,
        originLat: origin.lat,
        originLng: origin.lng,
        originLabel: origin.label,
        originCity: origin.city,
        originCountry: origin.country,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        destinationLabel: destination.label,
        destinationCity: destination.city,
        destinationCountry: destination.country,
        placementDate: new Date().toISOString(),
        type: parcelType,
        weight: w,
        address: addressNote || destination.label,
        sendAddress: sendAddressNote || origin.label,
      })
      setStatus('success')
      setTimeout(() => navigate('/customer'), 1200)
    } catch (err) {
      setStatus(err.response?.data?.error || 'Could not create parcel.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Book a parcel</h1>
      <p className="mt-1 text-sm text-ink/60">
        Search or pin the pickup &amp; drop locations on the map, then enter the weight — price is calculated from real distance, weight and fuel cost.
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-ink/50">Pickup location</label>
          <div className="mt-1">
            <LocationPicker kind="pickup" value={origin} onChange={setOrigin} />
          </div>
          <input
            placeholder="Pickup note (e.g. house no, floor)"
            value={sendAddressNote}
            onChange={(e) => setSendAddressNote(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-ink/50">Drop location</label>
          <div className="mt-1">
            <LocationPicker kind="drop" value={destination} onChange={setDestination} />
          </div>
          <input
            placeholder="Delivery note (e.g. house no, floor)"
            value={addressNote}
            onChange={(e) => setAddressNote(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-ink/50">Parcel weight (kg)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            placeholder="e.g. 4.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-ink/50">Parcel type</label>
          <select
            value={parcelType}
            onChange={(e) => setParcelType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          >
            <option value="PACKAGE">Package</option>
            <option value="DOCUMENT">Document</option>
            <option value="FRAGILE">Fragile</option>
            <option value="ELECTRONICS">Electronics</option>
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-ink/70">Price estimate</p>

        {quoting && <p className="mt-2 text-sm text-ink/50">Calculating price...</p>}
        {!quoting && quoteError && <p className="mt-2 text-sm text-red-500">{quoteError}</p>}
        {!quoting && !quoteError && !quote && (
          <p className="mt-2 text-sm text-ink/40">Pick pickup, drop and weight to see a price.</p>
        )}

        {quote && (
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink/60">Distance</span>
              <span className="font-medium text-ink">{quote.distanceKm} km</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm text-ink/60">Base fare</span>
              <span className="font-medium text-ink">Rs {quote.baseFare}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm text-ink/60">Distance &amp; weight cost</span>
              <span className="font-medium text-ink">Rs {quote.distanceCost}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm text-ink/60">Fuel surcharge</span>
              <span className="font-medium text-ink">Rs {quote.fuelCost}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
              <span className="font-semibold text-ink">Total</span>
              <span className="text-xl font-bold text-brand">Rs {quote.amount}</span>
            </div>
          </div>
        )}
      </div>

      {status && status !== 'success' && <p className="mt-4 text-sm text-red-500">{status}</p>}
      {status === 'success' && <p className="mt-4 text-sm text-green-600">Parcel booked! Redirecting...</p>}

      <button
        onClick={handleConfirm}
        disabled={loading || quoting || !quote}
        className="mt-6 w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-md hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? 'Booking...' : quote ? `Confirm Booking · Rs ${quote.amount}` : 'Confirm Booking'}
      </button>
    </div>
  )
}
