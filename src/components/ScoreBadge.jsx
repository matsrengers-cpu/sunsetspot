import { scoreInfo } from '../lib/weather'

export default function ScoreBadge({ score, size = 'md', loading }) {
  const info = scoreInfo(score)
  const dim = size === 'lg' ? 'h-16 w-16 text-2xl' : size === 'sm' ? 'h-9 w-9 text-sm' : 'h-12 w-12 text-lg'
  return (
    <div
      className={`${dim} shrink-0 rounded-full grid place-items-center font-bold tabular-nums text-night-950`}
      style={{ background: loading ? '#372a57' : info.color, boxShadow: `0 0 24px ${info.color}55` }}
      aria-label={score == null ? 'Keine Prognose' : `Score ${score} von 100`}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : score ?? '?'}
    </div>
  )
}
