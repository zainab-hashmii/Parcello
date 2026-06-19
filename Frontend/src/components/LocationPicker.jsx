import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { searchAddress, reverseGeocode } from '../api/geocode'

const PIN_COLORS = { pickup: '#22c55e', drop: '#ef4444' }

function pinIcon(color) {
  return new L.Icon({
    iconUrl:
      'data:image/svg+xml;base64,' +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
        <circle cx="17" cy="17" r="11" fill="${color}" stroke="white" stroke-width="3"/>
      </svg>`),
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function ClickToPlace({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function FlyToSelection({ lat, lng, zoom, flySeq }) {
  const map = useMap()
  useEffect(() => {
    if (lat == null || lng == null || flySeq === 0) return
    map.flyTo([lat, lng], zoom, { duration: 1.1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flySeq])
  return null
}

const DEFAULT_CENTER = [30.3753, 69.3451] // Pakistan

export default function LocationPicker({ kind = 'pickup', value, onChange }) {
  const [query, setQuery] = useState(value?.label || '')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [flySeq, setFlySeq] = useState(0)
  const debounceRef = useRef(null)

  useEffect(() => {
    setQuery(value?.label || '')
  }, [value?.label])

  function handleQueryChange(e) {
    const q = e.target.value
    setQuery(q)
    setShowSuggestions(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        setSuggestions(await searchAddress(q))
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  function selectSuggestion(result) {
    onChange(result)
    setQuery(result.label)
    setSuggestions([])
    setShowSuggestions(false)
    setFlySeq((n) => n + 1)
  }

  async function handleMapPick(lat, lng) {
    onChange({ lat, lng, label: 'Locating address...', city: '', country: '' })
    try {
      const result = await reverseGeocode(lat, lng)
      onChange({ ...result, zoom: undefined })
      setQuery(result.label)
    } catch {
      onChange({ lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, city: '', country: '' })
    }
  }

  const center = value?.lat != null ? [value.lat, value.lng] : DEFAULT_CENTER
  const flyZoom = value?.zoom ?? 15

  return (
    <div>
      <div className="relative">
        <input
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={kind === 'pickup' ? 'Search pickup address...' : 'Search drop-off address...'}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
        />
        {showSuggestions && (searching || suggestions.length > 0) && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {searching && <p className="px-3 py-2 text-xs text-ink/40">Searching...</p>}
            {!searching &&
              suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-orange-50"
                >
                  {s.label}
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="mt-2 h-48 overflow-hidden rounded-xl border border-gray-200">
        <MapContainer center={center} zoom={value?.lat != null ? flyZoom : 5} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ClickToPlace onPick={handleMapPick} />
          <FlyToSelection lat={value?.lat} lng={value?.lng} zoom={flyZoom} flySeq={flySeq} />
          {value?.lat != null && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon(PIN_COLORS[kind])}
              draggable
              eventHandlers={{
                dragend: (e) => handleMapPick(e.target.getLatLng().lat, e.target.getLatLng().lng),
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="mt-1 text-xs text-ink/40">Search above, or click/drag the pin to set the exact spot.</p>
    </div>
  )
}
