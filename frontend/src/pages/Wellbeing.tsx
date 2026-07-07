import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useWellbeingAck, useWellbeingCheck } from '@/hooks/useWellbeing'
import { ErrorBanner } from '@/components/shared/ErrorBanner'
import type { WellbeingFlag } from '@/lib/schemas/wellbeing'

type Context = { studentId: string }

export function Wellbeing() {
  const { studentId } = useOutletContext<Context>()
  const check = useWellbeingCheck(studentId)
  const ack = useWellbeingAck(studentId)
  const [note, setNote] = useState('')
  const [flag, setFlag] = useState<WellbeingFlag | null | undefined>(undefined)

  function runCheck() {
    check.mutate(undefined, {
      onSuccess: (result) => {
        setFlag(result)
        setNote('')
      },
    })
  }

  function acknowledge() {
    if (!flag) return
    ack.mutate(
      { flag_id: flag.id, reviewer_note: note },
      { onSuccess: (updated) => setFlag(updated) },
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 520 }}>
      <header>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Wellbeing check</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
          A threshold-based check for quiz inactivity — not a diagnosis of how a student is feeling, just a signal
          for a real person to look into.
        </p>
      </header>

      <button type="button" onClick={runCheck} disabled={check.isPending} className="primary-button" style={{ alignSelf: 'flex-start' }}>
        Run wellbeing check
      </button>

      {check.error && <ErrorBanner error={check.error} />}

      {flag === null && (
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>No flag warranted — activity looks fine.</p>
      )}

      {flag && (
        <div
          style={{
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: 20,
            background: 'var(--paper-raised)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontSize: 14.5 }}>{flag.reason}</p>
            <span
              style={{
                flexShrink: 0,
                marginLeft: 12,
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 20,
                color: flag.acknowledged ? 'var(--status-mastered)' : 'var(--status-struggling)',
                background: flag.acknowledged ? 'var(--status-mastered-bg)' : 'var(--status-struggling-bg)',
              }}
            >
              {flag.acknowledged ? 'Acknowledged' : 'Needs review'}
            </span>
          </div>

          <p className="tabular" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            Flagged {flag.flagged_at}
          </p>

          {flag.acknowledged ? (
            flag.reviewer_note && (
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', fontStyle: 'italic' }}>“{flag.reviewer_note}”</p>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label>
                <span className="field-label">Reviewer note</span>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Looked into it, all good."
                  className="field-input"
                />
              </label>
              <button
                type="button"
                onClick={acknowledge}
                disabled={ack.isPending}
                className="primary-button"
                style={{ alignSelf: 'flex-start' }}
              >
                Acknowledge
              </button>
              {ack.error && <ErrorBanner error={ack.error} />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
