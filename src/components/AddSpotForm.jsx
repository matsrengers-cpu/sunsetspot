import { useState } from 'react'
import { SPOT_TYPES, SUITABILITY, createSpot } from '../lib/spots'
import { isSupabaseConfigured } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function AddSpotForm({ position, onCancel, onCreated, onPickAgain }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('see')
  const [suitability, setSuitability] = useState('sunset')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [agree, setAgree] = useState(false)

  function onFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) return setError('Bitte ein Bild auswählen.')
    if (f.size > 15 * 1024 * 1024) return setError('Das Bild ist zu groß (max. 15 MB).')
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function submit(e) {
    e.preventDefault()
    if (name.trim().length < 2) return setError('Bitte gib einen Namen ein.')
    setBusy(true)
    setError('')
    try {
      const spot = await createSpot({ name, type, suitability, description, lat: position.lat, lng: position.lng, file })
      onCreated(spot)
    } catch (err) {
      console.error(err)
      setError('Speichern fehlgeschlagen. Bitte später erneut versuchen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="p-4 space-y-4" aria-label="Neuen Spot hinzufügen">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Neuer Spot</h2>
          <p className="text-xs text-white/50 tabular-nums">
            Position: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}{' '}
            <button type="button" onClick={onPickAgain} className="text-sun-orange underline ml-1">
              ändern
            </button>
          </p>
        </div>
        <button type="button" onClick={onCancel} className="h-11 w-11 rounded-full bg-white/5 grid place-items-center text-xl" aria-label="Abbrechen">
          ✕
        </button>
      </div>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-sun-gold/10 border border-sun-gold/30 text-sun-gold text-xs p-3">
          Demo-Modus: Supabase ist noch nicht verbunden. Der Spot wird nur auf diesem Gerät gespeichert.
        </p>
      )}

      <div>
        <label className="label" htmlFor="spot-name">Name *</label>
        <input id="spot-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required placeholder="z.B. Aussichtspunkt am Kanal" />
      </div>

      <fieldset>
        <legend className="label">Spot-Typ</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SPOT_TYPES).map(([id, t]) => (
            <button type="button" key={id} className={type === id ? 'chip-on' : 'chip-off'} onClick={() => setType(id)} aria-pressed={type === id}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Eignung</legend>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(SUITABILITY).map(([id, s]) => (
            <button
              type="button"
              key={id}
              onClick={() => setSuitability(id)}
              aria-pressed={suitability === id}
              className={`rounded-2xl border px-2 py-2 min-h-[56px] text-xs font-semibold transition ${
                suitability === id ? 'bg-sun-gradient text-night-950 border-transparent' : 'bg-white/5 border-white/15 text-white/80'
              }`}
            >
              <div className="text-base">{id === 'sunrise' ? '🌅' : id === 'sunset' ? '🌇' : '🌅🌇'}</div>
              {s.short}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/40 mt-1.5">{SUITABILITY[suitability].hint}</p>
      </fieldset>

      <div>
        <label className="label" htmlFor="spot-desc">Beschreibung</label>
        <textarea
          id="spot-desc"
          className="input py-3 min-h-[96px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={600}
          placeholder="Was macht den Ort besonders? Wie kommt man hin?"
        />
      </div>

      <div>
        <span className="label">Foto</span>
        <label className="flex items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-3 cursor-pointer min-h-[64px]">
          {preview ? (
            <img src={preview} alt="Vorschau" className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <span className="h-16 w-16 rounded-xl bg-night-800 grid place-items-center text-2xl" aria-hidden>📷</span>
          )}
          <span className="text-sm text-white/70">{file ? file.name : 'Foto auswählen oder aufnehmen'}</span>
          <input type="file" accept="image/*" className="sr-only" onChange={onFile} />
        </label>
      </div>

      <label className="flex items-start gap-3 text-xs text-white/60">
        <input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#ff8a3d]" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
        <span>
          Ich habe die Rechte an dem Foto, auf dem keine erkennbaren Personen ohne deren Einwilligung zu sehen sind, und bin
          einverstanden, dass Spot und Foto öffentlich angezeigt werden. Siehe{' '}
          <Link to="/datenschutz" className="underline">Datenschutzerklärung</Link>.
        </span>
      </label>

      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Abbrechen</button>
        <button type="submit" className="btn-primary" disabled={busy || !agree}>
          {busy ? 'Speichere …' : 'Spot speichern'}
        </button>
      </div>
    </form>
  )
}
