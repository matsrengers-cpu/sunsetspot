import { useCallback, useEffect, useMemo, useState } from 'react'
import MapView from '../components/MapView'
import ModeToggle from '../components/ModeToggle'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import SunInfo from '../components/SunInfo'
import SpotDetail from '../components/SpotDetail'
import AddSpotForm from '../components/AddSpotForm'
import FooterLinks from '../components/FooterLinks'
import ScoreBadge from '../components/ScoreBadge'
import { MUENSTER, distanceKm, fmtDistance, getCurrentPosition } from '../lib/geo'
import { loadSpots, matchesMode, SPOT_TYPES } from '../lib/spots'
import { getNextSunEvent, fmtTime } from '../lib/sun'
import { fetchClouds, cloudsAt, computeScore, pointKey, scoreInfo, whenLabel } from '../lib/weather'
import { useFavorites } from '../lib/favorites'
import { storage } from '../lib/storage'
import { isSupabaseConfigured } from '../lib/supabase'
import { track } from '../lib/analytics'

// TODO (spätere Erweiterung): Push-Benachrichtigungen bei guten Bedingungen.
//   Idee: Web-Push (VAPID) über den Service Worker. Nutzer abonniert Favoriten-Spots,
//   eine Supabase Edge Function (Cron, z.B. 2 h vor Auf-/Untergang) berechnet den
//   Score über Open-Meteo und schickt bei Score >= 70 eine Push-Nachricht.
//   Benötigt: Tabelle "push_subscriptions", VAPID-Keys, Einwilligung im Banner.

function usePersistent(key, initial) {
  const [v, setV] = useState(() => storage.get(key, initial))
  const set = useCallback(
    (x) => {
      setV(x)
      storage.set(key, x)
    },
    [key],
  )
  return [v, set]
}

export default function Home() {
  const [mode, setMode] = usePersistent('sunsetspots.mode', 'sunset')
  const [radius, setRadius] = usePersistent('sunsetspots.radius', 15)
  const [center, setCenter] = useState(MUENSTER)
  const [userPos, setUserPos] = useState(null)
  const [locating, setLocating] = useState(true)
  const [locNote, setLocNote] = useState('')

  const [spots, setSpots] = useState([])
  const [spotsError, setSpotsError] = useState('')
  const [types, setTypes] = useState(() => new Set())
  const [favOnly, setFavOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [clouds, setClouds] = useState({})
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState(false)

  const [addMode, setAddMode] = useState(false)
  const [newPos, setNewPos] = useState(null)
  const [toast, setToast] = useState('')

  const { favs, toggle: toggleFav } = useFavorites()
  const [now, setNow] = useState(() => new Date())

  // Uhrzeit jede Minute aktualisieren (damit "nächster" Auf-/Untergang stimmt)
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(t)
  }, [])

  // ---------- Standort ----------
  const locate = useCallback(async (initial = false) => {
    setLocating(true)
    try {
      const pos = await getCurrentPosition()
      setUserPos(pos)
      setCenter(pos)
      setLocNote('')
    } catch {
      if (initial) setLocNote('Standort nicht freigegeben – wir zeigen Münster.')
      else setToast('Standort nicht verfügbar. Bitte in den Browser-Einstellungen erlauben.')
    } finally {
      setLocating(false)
    }
  }, [])
  useEffect(() => {
    locate(true)
  }, [locate])

  // ---------- Spots laden ----------
  useEffect(() => {
    loadSpots()
      .then(setSpots)
      .catch((e) => {
        console.error(e)
        setSpotsError('Spots konnten nicht geladen werden.')
      })
  }, [])

  // ---------- Gefilterte Spots im Radius ----------
  const visible = useMemo(() => {
    return spots
      .map((s) => ({ ...s, distance: distanceKm(center, s) }))
      .filter(
        (s) =>
          s.distance <= radius &&
          matchesMode(s, mode) &&
          (types.size === 0 || types.has(s.type)) &&
          (!favOnly || favs.has(s.id)),
      )
      .sort((a, b) => a.distance - b.distance)
  }, [spots, center, radius, mode, types, favOnly, favs])

  // ---------- Wetter für Mittelpunkt + sichtbare Spots ----------
  const pointsKey = useMemo(
    () => [pointKey(center.lat, center.lng), ...visible.map((s) => pointKey(s.lat, s.lng))].join('|'),
    [center, visible],
  )
  useEffect(() => {
    let cancelled = false
    const pts = pointsKey.split('|').map((k) => {
      const [lat, lng] = k.split(',').map(Number)
      return { lat, lng }
    })
    setWeatherLoading(true)
    const t = setTimeout(() => {
      fetchClouds(pts)
        .then((res) => {
          if (cancelled) return
          setClouds((prev) => ({ ...prev, ...res }))
          setWeatherError(false)
        })
        .catch((e) => {
          console.warn(e)
          if (!cancelled) setWeatherError(true)
        })
        .finally(() => !cancelled && setWeatherLoading(false))
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [pointsKey])

  // ---------- Ereignis + Score je Ort ----------
  const forecastFor = useCallback(
    (lat, lng) => {
      const event = getNextSunEvent(mode, lat, lng, now)
      const c = event ? cloudsAt(clouds[pointKey(lat, lng)], event.time) : null
      return { event, clouds: c, score: c ? computeScore(c) : null }
    },
    [mode, now, clouds],
  )

  const centerForecast = useMemo(() => forecastFor(center.lat, center.lng), [forecastFor, center])
  const spotForecasts = useMemo(() => {
    const out = {}
    for (const s of visible) out[s.id] = forecastFor(s.lat, s.lng)
    return out
  }, [visible, forecastFor])
  const scores = useMemo(() => Object.fromEntries(Object.entries(spotForecasts).map(([id, f]) => [id, f.score])), [spotForecasts])

  const ranked = useMemo(
    () => [...visible].sort((a, b) => (scores[b.id] ?? -1) - (scores[a.id] ?? -1) || a.distance - b.distance),
    [visible, scores],
  )

  const selected = spots.find((s) => s.id === selectedId)
  const selectedForecast = selected ? spotForecasts[selected.id] ?? forecastFor(selected.lat, selected.lng) : null

  // Ausgewählten Spot schließen, wenn er herausgefiltert wird
  useEffect(() => {
    if (selectedId && !visible.some((s) => s.id === selectedId)) setSelectedId(null)
  }, [visible, selectedId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(t)
  }, [toast])

  // ---------- Aktionen ----------
  const toggleType = (id) =>
    setTypes((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  function startAdd() {
    setSelectedId(null)
    setNewPos(null)
    setAddMode(true)
  }
  function cancelAdd() {
    setAddMode(false)
    setNewPos(null)
  }
  function onMapClick(latlng) {
    if (addMode) {
      setNewPos({ lat: latlng.lat, lng: latlng.lng })
      setAddMode(false)
    }
  }
  function onCreated(spot) {
    setSpots((prev) => [spot, ...prev])
    setNewPos(null)
    track('Spot hinzugefügt', { type: spot.type })
    if (distanceKm(center, spot) > radius) setRadius(Math.min(50, Math.ceil(distanceKm(center, spot)) + 1))
    if (!matchesMode(spot, mode)) setMode(spot.suitability)
    setTypes(new Set())
    setFavOnly(false)
    setSelectedId(spot.id)
    setToast('Danke! Dein Spot wurde gespeichert. 🌅')
  }

  const gradient = mode === 'sunset' ? 'bg-sun-gradient' : 'bg-dawn-gradient'
  const activeFilters = types.size + (favOnly ? 1 : 0)
  const centerInfo = scoreInfo(centerForecast.score)

  // ---------- Inhalt des unteren Panels ----------
  let sheet
  if (newPos) {
    sheet = <AddSpotForm position={newPos} onCancel={cancelAdd} onCreated={onCreated} onPickAgain={() => { setNewPos(null); setAddMode(true) }} />
  } else if (selected) {
    sheet = (
      <SpotDetail
        spot={selected}
        distance={distanceKm(center, selected)}
        centerLabel={center.label}
        event={selectedForecast.event}
        clouds={selectedForecast.clouds}
        score={selectedForecast.score}
        loading={weatherLoading && selectedForecast.score == null}
        weatherError={weatherError}
        isFav={favs.has(selected.id)}
        onFav={() => toggleFav(selected.id)}
        onClose={() => setSelectedId(null)}
      />
    )
  } else {
    sheet = (
      <div className="p-4">
        <button
          className="w-full flex items-center gap-3 text-left md:pointer-events-none"
          onClick={() => setSheetOpen((o) => !o)}
          aria-expanded={sheetOpen}
        >
          <ScoreBadge score={centerForecast.score} loading={weatherLoading && centerForecast.score == null} />
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wider text-white/50 truncate">Prognose · {center.label}</div>
            <div className="font-semibold leading-tight truncate" style={{ color: centerForecast.score != null ? centerInfo.color : undefined }}>
              {centerForecast.event
                ? `${whenLabel(centerForecast.event)}: ${
                    centerForecast.score != null ? centerInfo.label : weatherError ? 'Wetter offline' : 'Prognose lädt …'
                  }`
                : 'Kein Ereignis'}
            </div>
            {centerForecast.event && (
              <div className="text-xs text-white/60">
                {mode === 'sunset' ? '🌇' : '🌅'} {fmtTime(centerForecast.event.time)} Uhr · Richtung {centerForecast.event.compass} (
                {Math.round(centerForecast.event.bearing)}°)
              </div>
            )}
          </div>
          <span className={`md:hidden text-white/50 transition ${sheetOpen ? 'rotate-180' : ''}`} aria-hidden>
            ▲
          </span>
        </button>

        <div className={`${sheetOpen ? 'block' : 'hidden'} md:block mt-4 space-y-5`}>
          <SunInfo
            event={centerForecast.event}
            clouds={centerForecast.clouds}
            score={centerForecast.score}
            loading={weatherLoading && centerForecast.score == null}
            weatherError={weatherError}
            compact
            hideScore
          />
          {centerForecast.clouds && (
            <p className="text-xs text-white/50 -mt-2">
              Wolken tief {centerForecast.clouds.low}% · mittel {centerForecast.clouds.mid}% · hoch {centerForecast.clouds.high}% – mittlere
              und hohe Wolken leuchten, tiefe Wolken verdecken die Sonne.
            </p>
          )}
          <section>
            <h3 className="text-sm font-semibold text-white/80 mb-2">
              Beste Spots im Umkreis ({ranked.length})
            </h3>
            {spotsError && <p className="text-sm text-red-400">{spotsError}</p>}
            {ranked.length === 0 && !spotsError && (
              <p className="text-sm text-white/50">
                Keine passenden Spots im Radius. Vergrößere den Radius, ändere die Filter oder füge selbst einen Spot hinzu.
              </p>
            )}
            <ul className="space-y-2">
              {ranked.map((s) => {
                const f = spotForecasts[s.id]
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setSelectedId(s.id)}
                      className="w-full flex items-center gap-3 rounded-2xl bg-white/5 hover:bg-white/10 p-2.5 min-h-[56px] text-left transition"
                    >
                      <ScoreBadge score={f?.score} size="sm" loading={weatherLoading && f?.score == null} />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {favs.has(s.id) && <span className="text-sun-pink">♥ </span>}
                          {s.name}
                        </div>
                        <div className="text-xs text-white/50">
                          {SPOT_TYPES[s.type]?.icon} {SPOT_TYPES[s.type]?.label} · {fmtDistance(s.distance)}
                          {f?.event && ` · ${fmtTime(f.event.time)} Uhr`}
                        </div>
                      </div>
                      <span className="text-white/30" aria-hidden>›</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
          {!isSupabaseConfigured && (
            <p className="text-xs text-white/40">
              Demo-Modus: Supabase ist noch nicht verbunden – es werden Beispiel-Spots angezeigt.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <main className="fixed inset-0 overflow-hidden">
      <MapView
        center={center}
        radius={radius}
        spots={visible}
        scores={scores}
        selectedId={selectedId}
        onSelect={setSelectedId}
        favs={favs}
        userPos={userPos}
        addMode={addMode}
        newPos={newPos}
        onMapClick={onMapClick}
        mode={mode}
      />

      {/* Linke Spalte (Desktop) bzw. oben/unten gestapelt (Handy) */}
      <div className="pointer-events-none absolute inset-0 z-[1000] flex flex-col justify-between md:justify-start md:gap-3 md:w-[440px] md:p-4">
        {/* ---------- Kopfbereich ---------- */}
        <header className="pointer-events-auto glass rounded-b-3xl md:rounded-3xl p-3 space-y-3 safe-top">
          <div className="flex items-center justify-between gap-2">
            <h1 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
              <span className={`h-8 w-8 rounded-full ${gradient} grid place-items-center text-base shadow-lg`} aria-hidden>
                ☀️
              </span>
              <span className="text-gradient">SunsetSpots</span>
            </h1>
            <button
              className={`chip ${activeFilters ? 'chip-on' : 'chip-off'} md:hidden`}
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              ⚙︎ Filter{activeFilters ? ` (${activeFilters})` : ''}
            </button>
          </div>
          <ModeToggle mode={mode} onChange={(m) => { setMode(m); track('Modus', { mode: m }) }} />
          <SearchBar
            onSelect={(r) => {
              setCenter(r)
              setSelectedId(null)
            }}
            onLocate={() => locate(false)}
            locating={locating}
          />
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <FilterBar
              radius={radius}
              onRadius={setRadius}
              types={types}
              onToggleType={toggleType}
              favOnly={favOnly}
              onFavOnly={setFavOnly}
              count={visible.length}
            />
          </div>
          {!showFilters && (
            <div className="md:hidden flex items-center gap-3">
              <span className="text-xs text-white/60 whitespace-nowrap tabular-nums">{radius} km</span>
              <input
                type="range"
                min={1}
                max={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="flex-1 h-8 accent-[#ff8a3d]"
                aria-label="Radius in Kilometern"
              />
              <span className="text-xs text-white/50 whitespace-nowrap">{visible.length} Spots</span>
            </div>
          )}
          {locNote && <p className="text-xs text-sun-gold/90">{locNote}</p>}
        </header>

        {/* ---------- Unteres Panel ---------- */}
        <div className="relative pointer-events-none md:flex-1 md:min-h-0 flex flex-col justify-end md:justify-start">
          {/* Spot hinzufügen */}
          {!newPos && !addMode && (
            <button
              onClick={startAdd}
              className={`pointer-events-auto absolute -top-16 right-3 ${selected || sheetOpen ? 'hidden md:flex' : 'flex'} md:fixed md:top-auto md:bottom-8 md:right-8 h-14 rounded-full ${gradient} text-night-950 font-bold px-5 shadow-xl shadow-sun-pink/30 items-center gap-2 active:scale-95 transition`}
              aria-label="Eigenen Spot hinzufügen"
            >
              <span className="text-2xl leading-none">＋</span>
              <span className="text-sm">Spot</span>
            </button>
          )}

          {addMode ? (
            <div className="pointer-events-auto glass rounded-t-3xl md:rounded-3xl p-4 safe-bottom space-y-3">
              <p className="font-semibold">📍 Tippe auf die Karte, um die Position des neuen Spots zu setzen.</p>
              <button className="btn-ghost w-full" onClick={cancelAdd}>
                Abbrechen
              </button>
            </div>
          ) : (
            <div
              className={`pointer-events-auto glass rounded-t-3xl md:rounded-3xl overflow-y-auto overscroll-contain md:max-h-full ${
                selected || newPos ? 'max-h-[72vh]' : sheetOpen ? 'max-h-[60vh]' : 'max-h-[40vh]'
              }`}
            >
              {sheet}
              <div className="px-4 pb-3 safe-bottom">
                <FooterLinks />
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div role="status" className="fixed left-1/2 top-1/2 z-[1500] -translate-x-1/2 -translate-y-1/2 glass rounded-2xl px-5 py-3 text-sm font-medium max-w-[90vw] text-center">
          {toast}
        </div>
      )}
    </main>
  )
}
