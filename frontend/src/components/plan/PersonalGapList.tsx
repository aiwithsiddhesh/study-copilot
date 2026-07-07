import type { PersonalGap } from '@/lib/schemas/calendar'

export function PersonalGapList({
  items,
  onChange,
}: {
  items: PersonalGap[]
  onChange: (items: PersonalGap[]) => void
}) {
  function update(index: number, patch: Partial<PersonalGap>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...items, { reason: '', start_date: '', end_date: '' }])
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Personal gaps</span>
        <button type="button" onClick={add} className="ghost-button">
          + Add gap
        </button>
      </div>
      {items.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', fontStyle: 'italic' }}>None added.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              placeholder="Reason (e.g. Family Travel)"
              value={item.reason}
              onChange={(e) => update(i, { reason: e.target.value })}
              className="field-input"
              style={{ flex: 2 }}
            />
            <input
              type="date"
              value={item.start_date}
              onChange={(e) => update(i, { start_date: e.target.value })}
              className="field-input"
              style={{ flex: 1 }}
            />
            <input
              type="date"
              value={item.end_date}
              onChange={(e) => update(i, { end_date: e.target.value })}
              className="field-input"
              style={{ flex: 1 }}
            />
            <button type="button" onClick={() => remove(i)} className="icon-button" aria-label={`Remove ${item.reason || 'gap'}`}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
