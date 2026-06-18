// Free address search & reverse-geocoding via OpenStreetMap's Nominatim API.
// No API key required; usage policy: https://operations.osmfoundation.org/policies/nominatim/
const BASE_URL = 'https://nominatim.openstreetmap.org'

function parseResult(r) {
  return {
    label: r.display_name,
    lat: Number(r.lat),
    lng: Number(r.lon),
    city:
      r.address?.city || r.address?.town || r.address?.village || r.address?.county || r.display_name.split(',')[0],
    country: r.address?.country || '',
  }
}

export async function searchAddress(query) {
  if (!query || query.trim().length < 3) return []
  const url = `${BASE_URL}/search?format=jsonv2&addressdetails=1&limit=5&accept-language=en&q=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Address search failed')
  const data = await res.json()
  return data.map(parseResult)
}

export async function reverseGeocode(lat, lng) {
  const url = `${BASE_URL}/reverse?format=jsonv2&addressdetails=1&accept-language=en&lat=${lat}&lon=${lng}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Reverse geocoding failed')
  const data = await res.json()
  return parseResult(data)
}
