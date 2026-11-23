import { Link } from 'react-router-dom'
import FooterLinks from '../components/FooterLinks'

export default function LegalLayout({ title, children }) {
  return (
    <div className="min-h-full bg-night-950">
      <header className="sticky top-0 z-10 glass safe-top">
        <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
          <Link to="/" className="btn-ghost px-3" aria-label="Zurück zur Karte">
            ← Karte
          </Link>
          <span className="font-extrabold text-gradient">SunsetSpots</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 legal">
        <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
        {children}
      </main>
      <footer className="mx-auto max-w-3xl px-4 pb-10 safe-bottom">
        <FooterLinks />
      </footer>
    </div>
  )
}
