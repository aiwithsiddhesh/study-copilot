const STORAGE_KEY = 'study-copilot:student-id'

/** No real auth exists on the backend (student_id is a free path param —
 * see backend/registry.py) — this generates/persists a client-side id so
 * the same browser reuses the same student across visits, editable by the
 * user in the UI. */
export function getOrCreateStudentId(): string {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return existing

  const generated = `student-${Math.random().toString(36).slice(2, 8)}`
  localStorage.setItem(STORAGE_KEY, generated)
  return generated
}

export function setStudentId(id: string): void {
  localStorage.setItem(STORAGE_KEY, id)
}
