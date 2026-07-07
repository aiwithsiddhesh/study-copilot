import type { AttemptResult } from '@/lib/schemas/job'

const STATUS_STYLES: Record<string, { fg: string; bg: string }> = {
  'Not Started': { fg: 'var(--status-not-started)', bg: 'var(--status-not-started-bg)' },
  Struggling: { fg: 'var(--status-struggling)', bg: 'var(--status-struggling-bg)' },
  Improving: { fg: 'var(--status-improving)', bg: 'var(--status-improving-bg)' },
  Mastered: { fg: 'var(--status-mastered)', bg: 'var(--status-mastered-bg)' },
}

export function QuizResult({ result, correctCount, total }: { result: AttemptResult; correctCount: number; total: number }) {
  const { weak_topic_update, plan_optimizer_triggered } = result
  const style = STATUS_STYLES[weak_topic_update.status] ?? STATUS_STYLES['Not Started']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 480 }}>
      <h1 style={{ fontSize: 26 }}>Quiz complete</h1>

      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: 22,
          background: 'var(--paper-raised)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <p className="tabular" style={{ fontSize: 15, marginBottom: 12 }}>
          You got <strong>{correctCount}</strong> of <strong>{total}</strong> correct.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{weak_topic_update.topic_name}:</span>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 20,
              color: style.fg,
              background: style.bg,
            }}
          >
            {weak_topic_update.status}
          </span>
        </div>

        {plan_optimizer_triggered && (
          <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--ink-soft)' }}>
            You're struggling with this topic, so we've adjusted the rest of your study plan to give it more attention.
          </p>
        )}
      </div>
    </div>
  )
}
