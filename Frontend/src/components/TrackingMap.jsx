import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// City coordinate lookup for demo purposes since the backend only stores city/country, not lat/lng.
const CITY_COORDS = {
  karachi: [24.8607, 67.0011],
  lahore: [31.5497, 74.3436],
  islamabad: [33.6844, 73.0479],
  rawalpindi: [33.5651, 73.0169],
  faisalabad: [31.4504, 73.135],
  multan: [30.1575, 71.5249],
  peshawar: [34.0151, 71.5249],
  quetta: [30.1798, 66.975],
}

function coordsFor(city) {
  if (!city) return null
  const key = city.trim().toLowerCase()
  return CITY_COORDS[key] || null
}

const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="10" fill="#22c55e" stroke="white" stroke-width="3"/></svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const dropIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="10" fill="#ef4444" stroke="white" stroke-width="3"/></svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const currentIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><circle cx="18" cy="18" r="12" fill="#f5821f" stroke="white" stroke-width="3"/></svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

export default function TrackingMap({ originCity, destinationCity, currentCity }) {
  const origin = coordsFor(originCity)
  const destination = coordsFor(destinationCity)
  const current = coordsFor(currentCity) || origin

  const fallbackCenter = [30.3753, 69.3451] // Pakistan center fallback
  const center = current || origin || destination || fallbackCenter

  return (
    <MapContainer center={center} zoom={origin && destination ? 6 : 5} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {origin && (
        <Marker position={origin} icon={pickupIcon}>
          <Popup>Pickup: {originCity}</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination} icon={dropIcon}>
          <Popup>Drop: {destinationCity}</Popup>
        </Marker>
      )}
      {current && (
        <Marker position={current} icon={currentIcon}>
          <Popup>Current location: {currentCity || originCity}</Popup>
        </Marker>
      )}
      {origin && destination && (
        <Polyline positions={[origin, destination]} pathOptions={{ color: '#f5821f', weight: 3, dashArray: '6 8' }} />
      )}
    </MapContainer>
  )
}
