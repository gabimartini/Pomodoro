interface TimerDisplayProps {
  minutes: number
  seconds: number
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  return (
    <div className="font-mono text-7xl font-bold tabular-nums text-amber-900">
      {pad(minutes)}:{pad(seconds)}
    </div>
  )
}

export default TimerDisplay
