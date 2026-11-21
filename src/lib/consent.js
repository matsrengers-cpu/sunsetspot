import { storage } from './storage'

const KEY = 'sunsetspots.consent.v1'
const listeners = new Set()

/** @returns {{statistics:boolean, date:string} | null} */
export const getConsent = () => storage.get(KEY, null)

export function setConsent(value) {
  const c = { ...value, date: new Date().toISOString() }
  storage.set(KEY, c)
  listeners.forEach((fn) => fn(c))
}

export function onConsentChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Erlaubt dem Footer-Link "Cookie-Einstellungen", das Banner erneut zu öffnen.
export const openConsentEvent = 'sunsetspots:open-consent'
export const openConsentSettings = () => window.dispatchEvent(new Event(openConsentEvent))
