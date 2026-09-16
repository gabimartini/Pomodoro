export type Mode = 'focus' | 'shortBreak' | 'longBreak'

export interface ModeOption {
  key: Mode
  label: string
}

export type Durations = Record<Mode, number>

export interface Session {
  id: string
  mode: string
  duration: number
}
