import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent, openConsentEvent } from '../lib/consent'

/**
 * Einwilligungsbanner beim ersten Besuch.
 * SunsetSpots setzt selbst keine Tracking-Cookies. Technisch notwendig sind
 * localStorage-Einträge (Favoriten, Einstellungen) sowie die Dienste für Karte,
 * Wetter und Datenbank. Optional: cookielose Statistik (Plausible).
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(() => getConsent() == null)
  const [stats, setStats] = useState(() => getConsent()?.statistics ?? false)
  const [details, setDetails] = useState(false)

  useEffect(() => {
    const h = () => {
      setStats(getConsent()?.statistics ?? false)
      setDetails(true)
      setOpen(true)
    }
    window.addEventListener(openConsentEvent, h)
    return () => window.removeEventListener(openConsentEvent, h)
  }, [])

  if (!open) return null

  const save = (statistics) => {
    setConsent({ statistics })
    setOpen(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[2000] p-3 md:p-6 safe-bottom pointer-events-none">
      <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="glass pointer-events-auto mx-auto max-w-xl rounded-3xl p-5">
        <h2 id="consent-title" className="text-lg font-bold">
          🍪 Kurz zum Datenschutz
        </h2>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          Wir verwenden keine Werbe- oder Tracking-Cookies. Für die Funktion speichern wir Einstellungen und Favoriten lokal auf
          deinem Gerät und laden Karte, Wetter und Spots von externen Diensten. Mit deiner Zustimmung erfassen wir zusätzlich
          eine anonyme, cookielose Besucherstatistik. Mehr in der{' '}
          <Link to="/datenschutz" className="text-sun-orange underline" onClick={() => setDetails(true)}>
            Datenschutzerklärung
          </Link>
          .
        </p>

        {details && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3">
              <div>
                <div className="text-sm font-semibold">Notwendig</div>
                <div className="text-xs text-white/50">Karte (OpenStreetMap), Wetter (Open-Meteo), Spots (Supabase), lokale Einstellungen</div>
              </div>
              <span className="text-xs text-white/50 whitespace-nowrap">immer aktiv</span>
            </div>
            <label className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3 cursor-pointer">
              <div>
                <div className="text-sm font-semibold">Statistik</div>
                <div className="text-xs text-white/50">Plausible Analytics – anonym, ohne Cookies</div>
              </div>
              <input type="checkbox" className="h-6 w-6 accent-[#ff8a3d]" checked={stats} onChange={(e) => setStats(e.target.checked)} />
            </label>
          </div>
        )}

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {details ? (
            <button className="btn-ghost sm:col-span-1" onClick={() => save(stats)}>Auswahl speichern</button>
          ) : (
            <button className="btn-ghost" onClick={() => setDetails(true)}>Einstellungen</button>
          )}
          <button className="btn-ghost" onClick={() => save(false)}>Nur notwendige</button>
          <button className="btn-primary" onClick={() => save(true)}>Alle akzeptieren</button>
        </div>
      </div>
    </div>
  )
}
