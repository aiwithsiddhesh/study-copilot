export function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>
      <p style={{ color: 'var(--ink-soft)' }}>Built in the next step.</p>
    </div>
  )
}
