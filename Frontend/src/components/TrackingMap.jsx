import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function toLatLng(loc) {
  if (!loc || loc.lat == null || loc.lng == null) return null
  return [loc.lat, loc.lng]
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

function FitToMarkers({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 12)
    } else {
      map.fitBounds(points, { padding: [40, 40] })
    }
  }, [JSON.stringify(points)])
  return null
}

export default function TrackingMap({ origin, destination, current }) {
  const originPos = toLatLng(origin)
  const destinationPos = toLatLng(destination)
  const currentPos = toLatLng(current) || originPos

  const fallbackCenter = [30.3753, 69.3451] // Pakistan center fallback
  const points = [originPos, destinationPos, currentPos].filter(Boolean)
  const center = points[0] || fallbackCenter

  return (
    <MapContainer center={center} zoom={points.length ? 6 : 5} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToMarkers points={points} />
      {originPos && (
        <Marker position={originPos} icon={pickupIcon}>
          <Popup>Pickup: {origin?.label || origin?.city}</Popup>
        </Marker>
      )}
      {destinationPos && (
        <Marker position={destinationPos} icon={dropIcon}>
          <Popup>Drop: {destination?.label || destination?.city}</Popup>
        </Marker>
      )}
      {currentPos && (
        <Marker position={currentPos} icon={currentIcon}>
          <Popup>Current location: {current?.label || current?.city || origin?.label || origin?.city}</Popup>
        </Marker>
      )}
      {originPos && destinationPos && (
        <Polyline positions={[originPos, destinationPos]} pathOptions={{ color: '#f5821f', weight: 3, dashArray: '6 8' }} />
      )}
    </MapContainer>
  )
}
