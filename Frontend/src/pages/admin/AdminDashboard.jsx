import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllUsers, getBatches, getPayments, getLocations } from '../../api/endpoints'
import { StaggerGroup, StaggerItem } from '../../components/StaggerList'

const tableRowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [batches, setBatches] = useState([])
  const [payments, setPayments] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data)).catch(() => {})
    getBatches().then((res) => setBatches(res.data)).catch(() => {})
    getPayments().then((res) => setPayments(res.data)).catch(() => {})
    getLocations().then((res) => setLocations(res.data)).catch(() => {})
  }, [])

  const riders = users.filter((u) => u.accountType === 'Rider')
  const customers = users.filter((u) => u.accountType === 'Customer')
  const revenue = payments.filter((p) => p.paymentStatus === 'Paid').reduce((sum, p) => sum + p.amount, 0)

  const stats = [
    { label: 'Customers', value: customers.length },
    { label: 'Riders', value: riders.length },
    { label: 'Active batches', value: batches.length },
    { label: 'Locations', value: locations.length },
    { label: 'Revenue collected', value: `Rs ${revenue}` },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Admin overview</h1>
        <div className="flex gap-3">
          <Link to="/admin/locations" className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-orange-100">
            Manage locations
          </Link>
          <Link to="/admin/routes" className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-orange-100">
            Manage routes
          </Link>
          <Link to="/admin/pricing" className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-orange-100">
            Pricing settings
          </Link>
        </div>
      </div>

      <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <StaggerItem
            key={s.label}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
          >
            <p className="text-xs uppercase text-ink/40">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{s.value}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Batches</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-orange-100 bg-white/80 shadow-sm backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 text-left text-xs uppercase text-ink/40">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Rider</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="visible" transition={{ staggerChildren: 0.05 }}>
              {batches.map((b) => (
                <motion.tr key={b._id} variants={tableRowVariants} className="border-t border-gray-100">
                  <td className="px-4 py-3">{b.currentLocation?.city} → {b.destination?.city}</td>
                  <td className="px-4 py-3">{b.weight}kg</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-brand">{b.status}</span>
                  </td>
                  <td className="px-4 py-3">{b.rider?.name || '—'}</td>
                </motion.tr>
              ))}
              {batches.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-ink/40" colSpan={4}>No batches yet.</td></tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Users</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-orange-100 bg-white/80 shadow-sm backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 text-left text-xs uppercase text-ink/40">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="visible" transition={{ staggerChildren: 0.04 }}>
              {users.map((u) => (
                <motion.tr key={u._id} variants={tableRowVariants} className="border-t border-gray-100">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.accountType}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
