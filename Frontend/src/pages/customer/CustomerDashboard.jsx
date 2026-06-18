import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getParcelsOfCustomer } from '../../api/endpoints'

const STATUS_COLORS = {
  WAITING: 'bg-gray-100 text-gray-600',
  PICKED_UP: 'bg-blue-100 text-blue-600',
  IN_TRANSIT: 'bg-orange-100 text-orange-600',
  AT_WAREHOUSE: 'bg-purple-100 text-purple-600',
  OUT_FOR_DELIVERY: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green-100 text-green-700',
  FAILED_DELIVERY: 'bg-red-100 text-red-600',
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const customerId = user._id || user.id
    getParcelsOfCustomer(customerId)
      .then((res) => setParcels(res.data))
      .catch(() => setParcels([]))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = parcels.filter((p) =>
    (p._id || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.type || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/60">Hello, {user.name?.split(' ')[0] || 'there'} 👋</p>
          <h1 className="text-2xl font-bold text-ink">Your shipments</h1>
        </div>
        <Link
          to="/customer/book"
          className="rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-md hover:bg-brand-dark"
        >
          + Book a parcel
        </Link>
      </div>

      <input
        placeholder="Search by tracking ID or type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm"
      />

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-ink/50">Loading shipments...</p>}
        {!loading && filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-ink/50">
            No shipments yet. Book your first parcel to see it here.
          </p>
        )}
        {filtered.map((p) => (
          <Link
            key={p._id}
            to={`/customer/track/${p._id}`}
            className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-4 shadow-sm hover:border-brand"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-ink">{p.type || 'Parcel'} · {p.weight}kg</p>
                <p className="text-xs text-ink/50">
                  {p.origin?.city} → {p.destination?.city}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-ink/70">
              Track →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
