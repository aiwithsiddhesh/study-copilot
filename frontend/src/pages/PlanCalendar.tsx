import { useOutletContext } from 'react-router-dom'
import { usePlanStatus } from '@/hooks/usePlan'
import { ApiError } from '@/lib/api'

type Context = { studentId: string }

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function PlanCalendar() {
  const { studentId } = useOutletContext<Context>()
  const planStatus = usePlanStatus(studentId)

  if (planStatus.isLoading) {
    return <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>
  }

  const notFound = planStatus.error instanceof ApiError && planStatus.error.httpStatus === 404
  if (notFound) {
    return (
      <div>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Study calendar</h1>
        <p style={{ color: 'var(--ink-soft)' }}>No plan yet — build one first.</p>
      </div>
    )
  }

  if (planStatus.error) {
    return <p style={{ color: 'var(--danger)' }}>Something went wrong loading your plan.</p>
  }

  if (planStatus.data && !planStatus.data.ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-soft)' }}>
        <span className="spinner" aria-hidden="true" />
        Your plan is still being generated…
      </div>
    )
  }

  const plan = planStatus.data?.study_plan
  if (!plan || plan.days.length === 0) {
    return <p style={{ color: 'var(--ink-soft)' }}>Your plan has no days yet.</p>
  }

  const totalHours = plan.days.reduce(
    (sum, day) => sum + day.entries.reduce((daySum, e) => daySum + e.hours_allocated, 0),
    0,
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Study calendar</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }} className="tabular">
          {plan.days.length} day{plan.days.length === 1 ? '' : 's'} · {totalHours} hour{totalHours === 1 ? '' : 's'} total
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {plan.days.map((day, i) => {
          const dayHours = day.entries.reduce((sum, e) => sum + e.hours_allocated, 0)
          return (
            <div
              key={day.date}
              className="stagger-item"
              style={{
                animationDelay: `${Math.min(i, 10) * 40}ms`,
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '16px 20px',
                background: 'var(--paper-raised)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>
                  {formatDate(day.date)}
                </span>
                <span className="tabular" style={{ fontSize: 13, color: 'var(--ink-faint)' }}>
                  {dayHours}h
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {day.entries.map((entry, j) => (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: 'var(--paper-sunken)',
                    }}
                  >
                    <span>
                      <strong>{entry.subject}</strong>
                      <span style={{ color: 'var(--ink-soft)' }}> — {entry.topic_name}</span>
                    </span>
                    <span className="tabular" style={{ color: 'var(--ink-faint)' }}>
                      {entry.hours_allocated}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
