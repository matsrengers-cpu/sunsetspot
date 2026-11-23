import SpotPhoto from './SpotPhoto'
import SunInfo from './SunInfo'
import { SPOT_TYPES, SUITABILITY } from '../lib/spots'
import { fmtDistance } from '../lib/geo'

export default function SpotDetail({ spot, distance, centerLabel, event, clouds, score, loading, weatherError, isFav, onFav, onClose }) {
  const type = SPOT_TYPES[spot.type]
  const suit = SUITABILITY[spot.suitability]
  return (
    <article className="flex flex-col" aria-label={spot.name}>
      <div className="relative">
        <SpotPhoto spot={spot} className="h-40 md:h-48 w-full rounded-t-3xl" />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 h-11 w-11 rounded-full bg-night-950/70 backdrop-blur grid place-items-center text-xl"
          aria-label="Schließen"
        >
          ✕
        </button>
        <button
          onClick={onFav}
          className={`absolute right-16 top-3 h-11 w-11 rounded-full backdrop-blur grid place-items-center text-xl ${
            isFav ? 'bg-sun-pink text-white' : 'bg-night-950/70 text-white'
          }`}
          aria-label={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          aria-pressed={isFav}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold leading-tight">{spot.name}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2.5 py-1">
              {type?.icon} {type?.label}
            </span>
            <span className="rounded-full bg-sun-orange/15 text-sun-gold px-2.5 py-1" title={suit?.hint}>
              {spot.suitability !== 'sunset' && '🌅 '}
              {spot.suitability !== 'sunrise' && '🌇 '}
              {suit?.label}
            </span>
            {distance != null && (
              <span className="rounded-full bg-white/10 px-2.5 py-1">
                📏 {fmtDistance(distance)} {centerLabel ? `von ${centerLabel}` : ''}
              </span>
            )}
          </div>
        </div>
        {spot.description && <p className="text-sm text-white/75 leading-relaxed">{spot.description}</p>}
        <SunInfo event={event} clouds={clouds} score={score} loading={loading} weatherError={weatherError} />
        <a
          className="btn-ghost w-full"
          href={`https://www.openstreetmap.org/directions?route=%3B${spot.lat}%2C${spot.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🧭 Route planen
        </a>
      </div>
    </article>
  )
}
