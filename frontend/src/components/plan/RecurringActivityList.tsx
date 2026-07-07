import type { RecurringActivity } from '@/lib/schemas/calendar'
import { DAYS_OF_WEEK } from '@/lib/schemas/calendar'

export function RecurringActivityList({
  items,
  onChange,
}: {
  items: RecurringActivity[]
  onChange: (items: RecurringActivity[]) => void
}) {
  function update(index: number, patch: Partial<RecurringActivity>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...items, { name: '', day: 'monday', hours_blocked: 1 }])
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Recurring activities</span>
        <button type="button" onClick={add} className="ghost-button">
          + Add activity
        </button>
      </div>
      {items.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', fontStyle: 'italic' }}>None added.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              placeholder="Name (e.g. Sports Practice)"
              value={item.name}
              onChange={(e) => update(i, { name: e.target.value })}
              className="field-input"
              style={{ flex: 2 }}
            />
            <select
              value={item.day}
              onChange={(e) => update(i, { day: e.target.value })}
              className="field-input"
              style={{ flex: 1 }}
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day.slice(0, 3)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={24}
              value={item.hours_blocked}
              onChange={(e) => update(i, { hours_blocked: Number(e.target.value) })}
              className="field-input tabular"
              style={{ width: 72 }}
            />
            <button type="button" onClick={() => remove(i)} className="icon-button" aria-label={`Remove ${item.name || 'activity'}`}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
