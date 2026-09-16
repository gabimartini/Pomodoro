import type { Mode, ModeOption } from '../types'

interface ModeSelectorProps {
  modes: ModeOption[]
  activeMode: Mode
  onSelect: (mode: Mode) => void
}

function ModeSelector({ modes, activeMode, onSelect }: ModeSelectorProps) {
  return (
    <div className="inline-flex gap-1 rounded-2xl bg-orange-100 p-1">
      {modes.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onSelect(m.key)}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
            activeMode === m.key
              ? 'bg-[#f6c90f] text-amber-900 shadow-md'
              : 'text-amber-700 hover:bg-orange-200'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}

export default ModeSelector
