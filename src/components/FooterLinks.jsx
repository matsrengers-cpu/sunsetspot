import { Link } from 'react-router-dom'
import { openConsentSettings } from '../lib/consent'

export default function FooterLinks({ className = '' }) {
  return (
    <nav className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 ${className}`} aria-label="Rechtliches">
      <Link to="/impressum" className="hover:text-white py-1">Impressum</Link>
      <Link to="/datenschutz" className="hover:text-white py-1">Datenschutz</Link>
      <button type="button" onClick={openConsentSettings} className="hover:text-white py-1">
        Cookie-Einstellungen
      </button>
    </nav>
  )
}
