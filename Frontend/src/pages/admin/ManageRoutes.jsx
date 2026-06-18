import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRoutes, createRoute, getLocations } from '../../api/endpoints'

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([])
  const [locations, setLocations] = useState([])
  const [originId, setOriginId] = useState('')
  const [destinationId, setDestinationId] = useState('')
  const [basePayment, setBasePayment] = useState('')
  const [message, setMessage] = useState('')

  function load() {
    getRoutes().then((res) => setRoutes(res.data)).catch(() => {})
    getLocations().then((res) => setLocations(res.data)).catch(() => {})
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      await createRoute({ origin: originId, destination: destinationId, basePayment: Number(basePayment) })
      setBasePayment('')
      setMessage('Route added.')
      load()
    } catch {
      setMessage('Could not add route.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/admin" className="text-sm text-ink/50 hover:text-brand">← Back to overview</Link>
      <h1 className="mt-2 text-2xl font-bold text-ink">Manage routes &amp; pricing</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <select
            required
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          >
            <option value="">Origin</option>
            {locations.map((l) => <option key={l._id} value={l._id}>{l.city}, {l.country}</option>)}
          </select>
          <select
            required
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          >
            <option value="">Destination</option>
            {locations.map((l) => <option key={l._id} value={l._id}>{l.city}, {l.country}</option>)}
          </select>
        </div>
        <input
          required
          type="number"
          placeholder="Base payment per kg"
          value={basePayment}
          onChange={(e) => setBasePayment(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
        />
        <button className="w-full rounded-xl bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Add route
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-brand">{message}</p>}

      <div className="mt-6 space-y-2">
        {routes.map((r) => (
          <div key={r._id} className="flex items-center justify-between rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm shadow-sm">
            <span>{r.origin?.city} → {r.destination?.city}</span>
            <span className="font-semibold text-brand">Rs {r.basePayment}/kg</span>
          </div>
        ))}
      </div>
    </div>
  )
}
