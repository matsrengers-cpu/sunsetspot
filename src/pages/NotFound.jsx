import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-full grid place-items-center p-6 text-center">
      <div>
        <div className="text-6xl mb-4">🌒</div>
        <h1 className="text-2xl font-bold">Hier geht die Sonne nicht auf.</h1>
        <p className="text-white/60 mt-2">Diese Seite gibt es nicht.</p>
        <Link to="/" className="btn-primary mt-6">Zur Karte</Link>
      </div>
    </div>
  )
}
