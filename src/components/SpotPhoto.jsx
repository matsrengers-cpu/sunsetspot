import { SPOT_TYPES } from '../lib/spots'

/** Foto des Spots oder ein farbiger Platzhalter mit Typ-Symbol. */
export default function SpotPhoto({ spot, className = '' }) {
  if (spot.photo_url) {
    return <img src={spot.photo_url} alt={`Foto: ${spot.name}`} loading="lazy" className={`object-cover ${className}`} />
  }
  return (
    <div className={`relative overflow-hidden bg-sun-gradient ${className}`} aria-hidden>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night-900 via-night-900/60 to-transparent" />
      <div className="absolute left-1/2 top-[38%] h-20 w-20 -translate-x-1/2 rounded-full bg-sun-gold/90 blur-[2px]" />
      <div className="absolute inset-0 grid place-items-center text-5xl pt-10">{SPOT_TYPES[spot.type]?.icon}</div>
    </div>
  )
}
