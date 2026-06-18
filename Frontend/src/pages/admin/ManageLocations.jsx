import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLocations, createLocation } from '../../api/endpoints'

export default function ManageLocations() {
  const [locations, setLocations] = useState([])
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [message, setMessage] = useState('')

  function load() {
    getLocations().then((res) => setLocations(res.data)).catch(() => {})
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      await createLocation({
        city,
        country,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
      })
      setCity('')
      setCountry('')
      setLat('')
      setLng('')
      setMessage('Location added.')
      load()
    } catch {
      setMessage('Could not add location.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/admin" className="text-sm text-ink/50 hover:text-brand">← Back to overview</Link>
      <h1 className="mt-2 text-2xl font-bold text-ink">Manage hub locations</h1>
      <p className="mt-1 text-sm text-ink/60">
        Latitude/longitude are used to calculate distance-based pricing — leave blank only if you'll set up manual routes instead.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-2 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:grid-cols-2">
        <input
          required
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Latitude (optional)"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Longitude (optional)"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
        />
        <button className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark sm:col-span-2">
          Add
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-brand">{message}</p>}

      <div className="mt-6 space-y-2">
        {locations.map((l) => (
          <div key={l._id} className="flex items-center justify-between rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm shadow-sm">
            <span>{l.city}, {l.country}</span>
            <span className="text-xs text-ink/40">
              {l.lat != null ? `${l.lat}, ${l.lng}` : 'no coordinates'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
