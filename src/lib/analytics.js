// Datenschutzfreundliche, cookielose Besucherstatistik mit Plausible.
// Platzhalter: Trage VITE_PLAUSIBLE_DOMAIN in die .env ein, sobald du ein
// Plausible-Konto hast. Ohne Eintrag wird nichts geladen.
// Das Skript wird zusätzlich nur geladen, wenn der Nutzer im Banner
// der Statistik zugestimmt hat.
import { getConsent, onConsentChange } from './consent'

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN
const SRC = import.meta.env.VITE_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'
let loaded = false

function load() {
  if (loaded || !DOMAIN) return
  loaded = true
  const s = document.createElement('script')
  s.defer = true
  s.dataset.domain = DOMAIN
  s.src = SRC
  document.head.appendChild(s)
  window.plausible =
    window.plausible ||
    function () {
      ;(window.plausible.q = window.plausible.q || []).push(arguments)
    }
}

export function initAnalytics() {
  if (getConsent()?.statistics) load()
  onConsentChange((c) => c.statistics && load())
}

/** Eigene Events, z.B. track('Spot hinzugefügt'). */
export function track(event, props) {
  if (loaded && window.plausible) window.plausible(event, props ? { props } : undefined)
}
