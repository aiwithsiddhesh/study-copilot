import { useState } from 'react'
import type { RawSubjectSyllabus } from '@/lib/schemas/syllabus'

export function SubjectForm({ onAdd }: { onAdd: (subject: RawSubjectSyllabus) => void }) {
  const [subjectName, setSubjectName] = useState('')
  const [grade, setGrade] = useState('10')
  const [rawText, setRawText] = useState('')

  const canAdd = subjectName.trim().length > 0 && grade.trim().length > 0 && rawText.trim().length > 0

  function handleAdd() {
    if (!canAdd) return
    onAdd({ subject_name: subjectName.trim(), grade: grade.trim(), raw_index_text: rawText })
    setSubjectName('')
    setRawText('')
  }

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: 20,
        background: 'var(--paper-raised)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <label style={{ flex: 2 }}>
          <span className="field-label">Subject name</span>
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="e.g. Mathematics"
            className="field-input"
          />
        </label>
        <label style={{ flex: 1 }}>
          <span className="field-label">Grade</span>
          <input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="10" className="field-input" />
        </label>
      </div>

      <label>
        <span className="field-label">Paste the syllabus or book index — any format</span>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={'Unit 1: Real Numbers (10%)\n  - Euclid’s division lemma\n  - Irrational numbers\n\nUnit 2: Polynomials\n  ...'}
          rows={8}
          className="field-input"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical' }}
        />
      </label>

      <button type="button" onClick={handleAdd} disabled={!canAdd} className="primary-button" style={{ alignSelf: 'flex-start' }}>
        + Add subject
      </button>
    </div>
  )
}
