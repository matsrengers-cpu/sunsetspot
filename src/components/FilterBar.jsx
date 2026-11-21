import { SPOT_TYPES } from '../lib/spots'

export default function FilterBar({ radius, onRadius, types, onToggleType, favOnly, onFavOnly, count }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label htmlFor="radius" className="text-sm text-white/70 whitespace-nowrap">
          Radius <span className="font-semibold text-white tabular-nums">{radius} km</span>
        </label>
        <input
          id="radius"
          type="range"
          min={1}
          max={50}
          step={1}
          value={radius}
          onChange={(e) => onRadius(Number(e.target.value))}
          className="flex-1 h-10 accent-[#ff8a3d] cursor-pointer"
        />
        <span className="text-xs text-white/50 whitespace-nowrap tabular-nums">{count} Spots</span>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5">
        <button className={favOnly ? 'chip-on' : 'chip-off'} onClick={() => onFavOnly(!favOnly)} aria-pressed={favOnly}>
          <span aria-hidden>♥</span> Favoriten
        </button>
        {Object.entries(SPOT_TYPES).map(([id, t]) => {
          const on = types.has(id)
          return (
            <button key={id} className={on ? 'chip-on' : 'chip-off'} onClick={() => onToggleType(id)} aria-pressed={on}>
              <span aria-hidden>{t.icon}</span> {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
