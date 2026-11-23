export default function ModeToggle({ mode, onChange }) {
  const opts = [
    { id: 'sunrise', label: 'Sonnenaufgang', icon: '🌅' },
    { id: 'sunset', label: 'Sonnenuntergang', icon: '🌇' },
  ]
  return (
    <div role="tablist" aria-label="Auf- oder Untergang" className="grid grid-cols-2 gap-1 rounded-2xl bg-night-800 p-1 border border-white/10">
      {opts.map((o) => {
        const active = mode === o.id
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={`flex items-center justify-center gap-1.5 rounded-xl min-h-[44px] px-3 text-sm font-semibold transition ${
              active
                ? `${o.id === 'sunset' ? 'bg-sun-gradient' : 'bg-dawn-gradient'} text-night-950 shadow-lg`
                : 'text-white/70 hover:text-white'
            }`}
          >
            <span aria-hidden>{o.icon}</span>
            <span>{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
