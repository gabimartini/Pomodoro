import { useEffect, useRef, useState } from 'react'
import ModeSelector from './components/ModeSelector'
import SessionList from './components/SessionList'
import SettingsPanel from './components/SettingsPanel'
import TimerDisplay from './components/TimerDisplay'
import { DEFAULT_DURATIONS, MODES } from './constants'
import type { Durations, Mode, Session } from './types'

function App() {
  const [mode, setMode] = useState<Mode>('focus')
  const [durations, setDurations] = useState<Durations>(DEFAULT_DURATIONS)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.focus * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])

  const activeModeLabel = MODES.find((m) => m.key === mode)!.label

  // Mirrors secondsLeft so the interval tick can read the latest value
  // without needing secondsLeft in its dependency array (which would
  // otherwise restart the interval every second).
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
          { id: crypto.randomUUID(), mode: activeModeLabel, duration: durations[mode] },
        ])
      }
    }, 1000)

    return () => clearInterval(timer)
    // Only isRunning should retrigger this effect: mode/duration changes always
    // stop the timer via handleModeChange/handleDurationChange before they could
    // be observed here, so the closed-over values stay correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode)
    setSecondsLeft(durations[nextMode] * 60)
    setIsRunning(false)
  }

  const handleDurationChange = (changedMode: Mode, value: string) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return
    const clamped = Math.max(1, parsed)

    setDurations((prev) => ({ ...prev, [changedMode]: clamped }))

    if (changedMode === mode) {
      setSecondsLeft(clamped * 60)
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setSecondsLeft(durations[mode] * 60)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-md">
        <h1 className="text-xl font-bold text-amber-900">🍅 Pomodoro</h1>

        <ModeSelector modes={MODES} activeMode={mode} onSelect={handleModeChange} />

        <TimerDisplay minutes={minutes} seconds={seconds} />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => secondsLeft > 0 && setIsRunning(true)}
            disabled={isRunning || secondsLeft === 0}
            className="rounded-2xl bg-[#f6c90f] px-6 py-2 font-semibold text-amber-900 transition-colors hover:bg-[#e0b60d] disabled:opacity-40"
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => setIsRunning(false)}
            disabled={!isRunning}
            className="rounded-2xl bg-orange-100 px-6 py-2 font-semibold text-amber-900 transition-colors hover:bg-orange-200 disabled:opacity-40"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl bg-orange-100 px-6 py-2 font-semibold text-amber-900 transition-colors hover:bg-orange-200"
          >
            Reset
          </button>
        </div>

        <SettingsPanel modes={MODES} durations={durations} onDurationChange={handleDurationChange} />

        <SessionList sessions={sessions} />
      </div>
    </div>
  )
}

export default App
