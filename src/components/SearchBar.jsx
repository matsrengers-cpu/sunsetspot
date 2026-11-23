import { useState } from 'react'
import { searchPlaces } from '../lib/geo'

export default function SearchBar({ onSelect, onLocate, locating }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (q.trim().length < 2) return
    setBusy(true)
    setError('')
    try {
      const r = await searchPlaces(q.trim())
      setResults(r)
      if (!r.length) setError('Kein Ort gefunden.')
    } catch {
      setError('Suche gerade nicht möglich (offline?).')
    } finally {
      setBusy(false)
    }
  }

  function pick(r) {
    onSelect(r)
    setResults([])
    setQ(r.label)
  }

  return (
    <div className="relative">
      <form onSubmit={submit} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ort suchen, z.B. Münster Aasee"
            className="input pl-11"
            aria-label="Ort suchen"
            enterKeyHint="search"
          />
          {busy && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-sun-orange" />
          )}
        </div>
        <button
          type="button"
          onClick={onLocate}
          className="btn-ghost w-12 px-0 shrink-0"
          title="Meinen Standort verwenden"
          aria-label="Meinen Standort verwenden"
        >
          {locating ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-sun-orange" />
          ) : (
            <span aria-hidden>📍</span>
          )}
        </button>
      </form>
      {(results.length > 0 || error) && (
        <ul className="absolute z-[1100] mt-2 w-full overflow-hidden rounded-2xl glass">
          {error && <li className="px-4 py-3 text-sm text-white/60">{error}</li>}
          {results.map((r, i) => (
            <li key={i}>
              <button
                onClick={() => pick(r)}
                className="w-full text-left px-4 py-3 min-h-[48px] hover:bg-white/10 border-b border-white/5 last:border-0"
              >
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-xs text-white/40 truncate">{r.full}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
