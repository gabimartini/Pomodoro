import type { Durations, ModeOption } from './types'

export const MODES: ModeOption[] = [
  { key: 'focus', label: 'Focus' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' },
]

export const DEFAULT_DURATIONS: Durations = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
}
