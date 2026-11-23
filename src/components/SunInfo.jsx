import CompassArrow from './CompassArrow'
import ScoreBadge from './ScoreBadge'
import { fmtTime, fmtRange } from '../lib/sun'
import { scoreInfo, whenLabel } from '../lib/weather'

/** Zeiten, Golden/Blue Hour, Himmelsrichtung und Wolken-Score zum nächsten Ereignis. */
export default function SunInfo({ event, clouds, score, loading, weatherError, compact, hideScore }) {
  if (!event) return <p className="text-sm text-white/60">Für diesen Ort gibt es in den nächsten Tagen kein Ereignis.</p>
  const info = scoreInfo(score)
  const isSunset = event.mode === 'sunset'

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-3 ${hideScore ? 'hidden' : ''}`}>
        <ScoreBadge score={score} loading={loading} size={compact ? 'md' : 'lg'} />
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-white/50">{whenLabel(event)}</div>
          <div className="font-semibold leading-tight" style={{ color: loading ? undefined : info.color }}>
            {loading
              ? 'Prognose wird geladen …'
              : weatherError
                ? 'Wetterdaten gerade nicht erreichbar'
                : score == null
                  ? 'Noch keine Prognose verfügbar'
                  : `${info.label.charAt(0).toUpperCase()}${info.label.slice(1)}`}
          </div>
          {clouds && !loading && (
            <div className="text-xs text-white/50 mt-0.5">
              Wolken tief {clouds.low}% · mittel {clouds.mid}% · hoch {clouds.high}%
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-white/5 px-3 py-2 col-span-2">
            <dt className="text-xs text-white/50">{isSunset ? 'Sonnenuntergang' : 'Sonnenaufgang'}</dt>
            <dd className="text-xl font-bold tabular-nums">{fmtTime(event.time)} Uhr</dd>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-sun-gold/20 to-sun-orange/10 px-3 py-2">
            <dt className="text-xs text-sun-gold/90">Golden Hour</dt>
            <dd className="font-semibold tabular-nums">{fmtRange(event.golden)}</dd>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500/25 to-sun-purple/15 px-3 py-2">
            <dt className="text-xs text-blue-300">Blue Hour</dt>
            <dd className="font-semibold tabular-nums">{fmtRange(event.blue)}</dd>
          </div>
        </dl>
        <div className="flex flex-col items-center">
          <CompassArrow bearing={event.bearing} size={compact ? 64 : 76} />
          <div className="text-xs text-white/60 mt-1 tabular-nums">
            {Math.round(event.bearing)}° {event.compass}
          </div>
        </div>
      </div>
    </div>
  )
}
