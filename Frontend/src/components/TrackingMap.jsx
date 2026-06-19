import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../context/ThemeContext'

function toLatLng(loc) {
  if (!loc || loc.lat == null || loc.lng == null) return null
  return [loc.lat, loc.lng]
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="10" fill="#22c55e" stroke="white" stroke-width="3"/></svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const dropIcon = new L.DivIcon({
  html: `
    <div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;width:34px;height:34px;border-radius:50%;background:#ef4444;opacity:0.45;animation:pulse-ring 1.6s ease-out infinite;"></span>
      <span style="position:relative;width:16px;height:16px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 8px rgba(239,68,68,0.6);"></span>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  className: '',
})

const vehicleIcon = new L.DivIcon({
  html: `
    <div style="font-size:22px;filter:drop-shadow(0 4px 6px rgba(255,138,0,0.5));transform:translateY(-2px);">🚚</div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  className: '',
})

function FitToMarkers({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 12)
    } else {
      map.fitBounds(points, { padding: [50, 50] })
    }
  }, [JSON.stringify(points)])
  return null
}

function AnimatedRoute({ originPos, destinationPos, progress }) {
  const [drawn, setDrawn] = useState([])

  useEffect(() => {
    if (!originPos || !destinationPos) return
    let frame
    let t = 0
    function tick() {
      t = Math.min(t + 0.025, 1)
      setDrawn([
        originPos,
        [lerp(originPos[0], destinationPos[0], t), lerp(originPos[1], destinationPos[1], t)],
      ])
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [originPos, destinationPos])

  if (!originPos || !destinationPos) return null

  const vehiclePos = [lerp(originPos[0], destinationPos[0], progress), lerp(originPos[1], destinationPos[1], progress)]

  return (
    <>
      <Polyline positions={[originPos, destinationPos]} pathOptions={{ color: '#ff8a00', weight: 2, opacity: 0.25 }} />
      <Polyline positions={drawn} pathOptions={{ color: '#ff8a00', weight: 3, dashArray: '1 8', lineCap: 'round' }} />
      <Marker position={vehiclePos} icon={vehicleIcon} />
    </>
  )
}

export default function TrackingMap({ origin, destination, current, progress = 0.5 }) {
  const { theme } = useTheme?.() || { theme: 'light' }
  const originPos = toLatLng(origin)
  const destinationPos = toLatLng(destination)
  const currentPos = toLatLng(current) || originPos

  const fallbackCenter = [30.3753, 69.3451] // Pakistan center fallback
  const points = [originPos, destinationPos, currentPos].filter(Boolean)
  const center = points[0] || fallbackCenter

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  return (
    <MapContainer center={center} zoom={points.length ? 6 : 5} className="h-full w-full">
      <TileLayer attribution='&copy; OpenStreetMap contributors &copy; CARTO' url={tileUrl} />
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
      {originPos && destinationPos && (
        <AnimatedRoute originPos={originPos} destinationPos={destinationPos} progress={progress} />
      )}
    </MapContainer>
  )
}
