import type { CalendarEvent } from '@/lib/schemas/calendar'

/** Shared repeatable-row editor for exam_dates/assignment_deadlines — both
 * are {name, date} in CalendarStructure. */
export function ExamDeadlineList({
  label,
  addLabel,
  items,
  onChange,
}: {
  label: string
  addLabel: string
  items: CalendarEvent[]
  onChange: (items: CalendarEvent[]) => void
}) {
  function update(index: number, patch: Partial<CalendarEvent>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...items, { name: '', date: '' }])
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>{label}</span>
        <button type="button" onClick={add} className="ghost-button">
          {addLabel}
        </button>
      </div>
      {items.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', fontStyle: 'italic' }}>None added.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              placeholder="Name"
              value={item.name}
              onChange={(e) => update(i, { name: e.target.value })}
              className="field-input"
              style={{ flex: 2 }}
            />
            <input
              type="date"
              value={item.date}
              onChange={(e) => update(i, { date: e.target.value })}
              className="field-input"
              style={{ flex: 1 }}
            />
            <button type="button" onClick={() => remove(i)} className="icon-button" aria-label={`Remove ${item.name || label}`}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
