import type { Session } from '../types'

interface SessionListProps {
  sessions: Session[]
}

function SessionList({ sessions }: SessionListProps) {
  return (
    <div className="w-full rounded-2xl bg-orange-100 p-5">
      <h2 className="mb-3 text-sm font-semibold text-amber-900">Today's sessions</h2>
      {sessions.length === 0 ? (
        <p className="text-sm text-amber-700">No sessions completed yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-2 text-sm text-amber-900"
            >
              <span>{session.mode}</span>
              <span className="text-amber-600">{session.duration} min</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SessionList
