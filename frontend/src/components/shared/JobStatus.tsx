import type { Job } from '@/lib/schemas/job'
import { ErrorBanner } from './ErrorBanner'

/** Reusable pending/failed indicator for any useJobPoll-backed action. */
export function JobStatus({
  job,
  pendingLabel = 'Working on it…',
}: {
  job: Job<unknown> | undefined
  pendingLabel?: string
}) {
  if (!job || job.status === 'pending') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--ink-soft)',
          fontSize: 14,
        }}
      >
        <span className="spinner" aria-hidden="true" />
        {pendingLabel}
      </div>
    )
  }

  if (job.status === 'failed') {
    return (
      <ErrorBanner
        error={{ message: job.error ?? 'Something went wrong.', httpStatus: job.http_status }}
      />
    )
  }

  return null
}
