import type { Durations, Mode, ModeOption } from '../types'

interface SettingsPanelProps {
  modes: ModeOption[]
  durations: Durations
  onDurationChange: (mode: Mode, value: string) => void
}

function SettingsPanel({ modes, durations, onDurationChange }: SettingsPanelProps) {
  return (
    <div className="w-full rounded-2xl bg-orange-100 p-5">
      <h2 className="mb-3 text-sm font-semibold text-amber-900">Settings</h2>
      <div className="flex flex-col gap-3">
        {modes.map((m) => (
          <label key={m.key} className="flex items-center justify-between gap-4">
            <span className="text-sm text-amber-800">{m.label} (minutes)</span>
            <input
              type="number"
              min={1}
              value={durations[m.key]}
              onChange={(e) => onDurationChange(m.key, e.target.value)}
              className="w-20 rounded-2xl border border-orange-200 bg-white px-3 py-1 text-right text-amber-900 outline-none focus:border-[#f6c90f] focus:ring-2 focus:ring-[#f6c90f]/40"
            />
          </label>
        ))}
      </div>
    </div>
  )
}

export default SettingsPanel
