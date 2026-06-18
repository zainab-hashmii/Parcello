import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { registerVehicle } from '../../api/endpoints'

export default function RegisterVehicle() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vehicleType, setVehicleType] = useState('TRUCK')
  const [model, setModel] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [capacity, setCapacity] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      const payload = {
        riderId: user._id || user.id,
        vehicleType,
        model,
        licenseNumber,
        status: 'AVAILABLE',
      }
      if (vehicleType === 'TRUCK') payload.truckCapacity = Number(capacity)
      if (vehicleType === 'SHIP') payload.cargoCapacity = Number(capacity)
      if (vehicleType === 'AIRPLANE') payload.maxAltitude = Number(capacity)

      await registerVehicle(payload)
      setMessage('Vehicle registered successfully.')
      setTimeout(() => navigate('/rider'), 1000)
    } catch {
      setMessage('Could not register vehicle.')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Register your vehicle</h1>
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
      >
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm"
        >
          <option value="TRUCK">Truck</option>
          <option value="SHIP">Ship</option>
          <option value="AIRPLANE">Airplane</option>
        </select>
        <input
          required
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm"
        />
        <input
          required
          placeholder="License number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm"
        />
        <input
          required
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm"
        />
        {message && <p className="text-sm text-brand">{message}</p>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full rounded-xl bg-brand py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Register vehicle
        </motion.button>
      </motion.form>
    </div>
  )
}
