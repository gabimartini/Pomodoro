import { useEffect, useRef, useState } from 'react'

type Mode = 'focus' | 'shortBreak' | 'longBreak'

type Session = {
  id: string
  mode: string
  duration: number
}

const MODES: { key: Mode; label: string; accent: string }[] = [
  { key: 'focus', label: 'Focus', accent: 'bg-rose-500' },
  { key: 'shortBreak', label: 'Short Break', accent: 'bg-emerald-500' },
  { key: 'longBreak', label: 'Long Break', accent: 'bg-sky-500' },
]

const DEFAULT_DURATIONS: Record<Mode, number> = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function App() {
  const [durations, setDurations] = useState<Record<Mode, number>>(DEFAULT_DURATIONS)
  const [mode, setMode] = useState<Mode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.focus * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])

  const activeModeConfig = MODES.find((m) => m.key === mode)!

  // Mirrors secondsLeft so the interval tick can read the latest value without
  // needing secondsLeft in its dependency array (which would restart the interval
  // every second).
  const secondsLeftRef = useRef(secondsLeft)
  useEffect(() => {
    secondsLeftRef.current = secondsLeft
  }, [secondsLeft])

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      const next = Math.max(0, secondsLeftRef.current - 1)
      secondsLeftRef.current = next
      setSecondsLeft(next)

      if (next === 0) {
        clearInterval(timer)
        setIsRunning(false)
        setSessions((prevSessions) => [
          ...prevSessions,
          {
            id: crypto.randomUUID(),
            mode: activeModeConfig.label,
            duration: durations[mode],
          },
        ])
      }
    }, 1000)

    return () => clearInterval(timer)
    // Only isRunning should retrigger this effect: mode/duration changes always
    // stop the timer via handleModeChange/handleDurationChange before they could
    // be observed here, so the closed-over values stay correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  const handleModeChange = (key: Mode) => {
    setMode(key)
    setSecondsLeft(durations[key] * 60)
    setIsRunning(false)
  }

  const handleDurationChange = (key: Mode, value: string) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return
    const clamped = Math.max(1, parsed)

    setDurations((prev) => ({ ...prev, [key]: clamped }))

    if (key === mode) {
      setSecondsLeft(clamped * 60)
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4 py-10 gap-8">
      <div className="inline-flex gap-1 rounded-full bg-slate-800 p-1">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => handleModeChange(m.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === m.key
                ? `${m.accent} text-white shadow`
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="text-8xl font-bold tabular-nums tracking-tight">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => secondsLeft > 0 && setIsRunning(true)}
          disabled={isRunning || secondsLeft === 0}
          className="rounded-lg bg-slate-100 px-6 py-2 font-medium text-slate-900 transition-opacity disabled:opacity-40"
        >
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
          className="rounded-lg bg-slate-800 px-6 py-2 font-medium transition-opacity disabled:opacity-40"
        >
          Pause
        </button>
        <button
          onClick={() => {
            setIsRunning(false)
            setSecondsLeft(durations[mode] * 60)
          }}
          className="rounded-lg bg-slate-800 px-6 py-2 font-medium"
        >
          Reset
        </button>
      </div>

      <div className="w-full max-w-md rounded-xl bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">Settings</h2>
        <div className="flex flex-col gap-3">
          {MODES.map((m) => (
            <label key={m.key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-300">{m.label} (minutes)</span>
              <input
                type="number"
                min={1}
                value={durations[m.key]}
                onChange={(e) => handleDurationChange(m.key, e.target.value)}
                className="w-20 rounded-md bg-slate-900 px-3 py-1 text-right outline-none ring-1 ring-slate-700 focus:ring-slate-400"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md rounded-xl bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">Today's sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-400">No sessions completed yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between rounded-md bg-slate-900 px-4 py-2 text-sm"
              >
                <span>{session.mode}</span>
                <span className="text-slate-400">{session.duration} min</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
