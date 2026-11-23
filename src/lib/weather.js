// Open-Meteo: kostenlose Wettervorhersage ohne API-Key.
// Wir holen stündliche Bewölkung in drei Höhenstufen für mehrere Orte auf einmal.

const BASE = 'https://api.open-meteo.com/v1/forecast'
const CACHE_MS = 30 * 60 * 1000
const cache = new Map() // key -> { ts, series }

export const pointKey = (lat, lng) => `${lat.toFixed(2)},${lng.toFixed(2)}`

/**
 * Lädt Bewölkungsdaten für mehrere Punkte. Gibt ein Objekt key -> series zurück.
 * series = { time: [unixSec...], low: [...], mid: [...], high: [...] }
 */
export async function fetchClouds(points) {
  const result = {}
  const todo = []
  const seen = new Set()
  for (const p of points) {
    const key = pointKey(p.lat, p.lng)
    const hit = cache.get(key)
    if (hit && Date.now() - hit.ts < CACHE_MS) result[key] = hit.series
    else if (!seen.has(key)) {
      seen.add(key)
      todo.push({ key, lat: +p.lat.toFixed(2), lng: +p.lng.toFixed(2) })
    }
  }

  // Open-Meteo erlaubt mehrere Koordinaten pro Anfrage (kommagetrennt).
  for (let i = 0; i < todo.length; i += 50) {
    const chunk = todo.slice(i, i + 50)
    const params = new URLSearchParams({
      latitude: chunk.map((c) => c.lat).join(','),
      longitude: chunk.map((c) => c.lng).join(','),
      hourly: 'cloud_cover_low,cloud_cover_mid,cloud_cover_high',
      timeformat: 'unixtime',
      timezone: 'GMT',
      forecast_days: '3',
    })
    const res = await fetch(`${BASE}?${params}`)
    if (!res.ok) throw new Error(`Open-Meteo: ${res.status}`)
    let data = await res.json()
    if (!Array.isArray(data)) data = [data]
    data.forEach((d, idx) => {
      const h = d.hourly
      const series = { time: h.time, low: h.cloud_cover_low, mid: h.cloud_cover_mid, high: h.cloud_cover_high }
      cache.set(chunk[idx].key, { ts: Date.now(), series })
      result[chunk[idx].key] = series
    })
  }
  return result
}

/** Bewölkung zu einem Zeitpunkt (lineare Interpolation zwischen zwei Stunden). */
export function cloudsAt(series, date) {
  if (!series || !date) return null
  const t = date.getTime() / 1000
  const { time } = series
  if (!time?.length || t < time[0] || t > time[time.length - 1]) return null
  let i = time.findIndex((x) => x >= t)
  if (i <= 0) i = 1
  const t0 = time[i - 1]
  const t1 = time[i]
  const f = t1 === t0 ? 0 : (t - t0) / (t1 - t0)
  const lerp = (arr) => {
    const a = arr[i - 1] ?? arr[i]
    const b = arr[i] ?? a
    return a == null ? null : a + (b - a) * f
  }
  const low = lerp(series.low)
  const mid = lerp(series.mid)
  const high = lerp(series.high)
  if (low == null || mid == null || high == null) return null
  return { low: Math.round(low), mid: Math.round(mid), high: Math.round(high) }
}

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))

/**
 * Score 0–100 für einen Sonnenauf-/untergang.
 * - Mittlere und hohe Wolken sind die "Leinwand", die angestrahlt wird: ideal ca. 30–70 %.
 *   Klarer Himmel ist okay, aber unspektakulär; komplett zu ist schlecht.
 * - Tiefe Wolken verdecken die Sonne am Horizont und bremsen das Licht aus.
 */
export function computeScore({ low, mid, high }) {
  // Hohe Wolken leuchten am längsten und intensivsten -> stärker gewichtet.
  const canvas = clamp((0.6 * high + 0.4 * mid) / 100) * 100
  const peak = Math.max(high, mid) // dichte Schicht in einer Höhe zählt auch

  let canvasScore
  if (canvas < 30) canvasScore = 0.4 + 0.6 * (canvas / 30) // 0 % -> 0.4, 30 % -> 1
  else if (canvas <= 70) canvasScore = 1
  else canvasScore = 1 - 0.75 * ((canvas - 70) / 30) // 100 % -> 0.25

  // Geschlossene Decke in einer Höhe (>90 %) lässt kaum Licht durch
  if (peak > 90) canvasScore *= 0.75

  // Tiefe Wolken: bis 10 % egal, ab ~80 % praktisch kein Sonnenuntergang sichtbar
  const lowFactor = clamp(1 - ((low - 10) / 70) * 0.92, 0.08, 1)

  return Math.round(100 * clamp(canvasScore * lowFactor))
}

/** Farbe + Klartext zum Score. */
export function scoreInfo(score) {
  if (score == null) return { color: '#8b8b9e', tone: 'none', label: 'keine Prognose' }
  if (score >= 80) return { color: '#22c55e', tone: 'good', label: 'sehr gute Bedingungen' }
  if (score >= 65) return { color: '#4ade80', tone: 'good', label: 'gute Bedingungen' }
  if (score >= 45) return { color: '#f59e0b', tone: 'mid', label: 'mittelmäßige Bedingungen' }
  if (score >= 25) return { color: '#f97316', tone: 'mid', label: 'eher schlechte Bedingungen' }
  return { color: '#ef4444', tone: 'bad', label: 'schlechte Bedingungen' }
}

/** "Heute Abend" / "Morgen früh" usw. */
export function whenLabel(event) {
  if (!event) return ''
  const part = event.mode === 'sunset' ? 'Abend' : 'früh'
  if (event.day === 'Heute') return event.mode === 'sunset' ? 'Heute Abend' : 'Heute früh'
  if (event.day === 'Morgen') return event.mode === 'sunset' ? 'Morgen Abend' : 'Morgen früh'
  return `${event.day} ${part}`
}
