import type { RawSubjectSyllabus } from '@/lib/schemas/syllabus'

export function PendingSubjectList({
  subjects,
  onRemove,
}: {
  subjects: RawSubjectSyllabus[]
  onRemove: (index: number) => void
}) {
  if (subjects.length === 0) {
    return (
      <p style={{ fontSize: 13, color: 'var(--ink-faint)', fontStyle: 'italic' }}>
        No subjects added yet — add at least one above.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {subjects.map((subject, i) => (
        <div
          key={i}
          className="stagger-item"
          style={{
            animationDelay: `${i * 50}ms`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '10px 14px',
            background: 'var(--paper-sunken)',
          }}
        >
          <div>
            <span style={{ fontWeight: 600 }}>{subject.subject_name}</span>
            <span style={{ color: 'var(--ink-faint)', fontSize: 13 }}> · Grade {subject.grade}</span>
          </div>
          <button type="button" onClick={() => onRemove(i)} className="icon-button" aria-label={`Remove ${subject.subject_name}`}>
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
