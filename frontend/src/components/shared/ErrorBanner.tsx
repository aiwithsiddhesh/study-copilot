import { ApiError } from '@/lib/api'

/**
 * Maps backend/errors.py::classify_job_exception's HTTP status codes to a
 * plain-English message. 502 in particular is the real, user-facing
 * consequence of a guardrail hard-rejecting bad input (e.g. the syllabus
 * text not matching its declared subject, or the AI's own output failing
 * validation) — verified live against the real backend this session, so
 * this must read as "fix your input," not a generic crash.
 */
function messageForStatus(httpStatus: number | null, fallback: string): string {
  switch (httpStatus) {
    case 404:
      return "We couldn't find that — it may not exist yet, or the ID might be wrong."
    case 409:
      return "This isn't ready yet. Give it a moment and try again."
    case 422:
      return "That request doesn't match what we have on record — double-check the subject or topic name."
    case 502:
      return "We couldn't process that input. Check that the text you pasted actually matches the subject you named, and that it reads like a real syllabus or index, then try again."
    default:
      return fallback
  }
}

type BannerError =
  | ApiError
  | { message: string; httpStatus: number | null }
  | string
  | null
  | undefined

export function ErrorBanner({ error }: { error: BannerError }) {
  if (!error) return null

  const message =
    typeof error === 'string'
      ? error
      : messageForStatus(error.httpStatus, error.message)

  return (
    <div
      role="alert"
      style={{
        background: 'var(--danger-bg)',
        color: 'var(--danger)',
        border: '1px solid var(--danger)',
        borderRadius: 8,
        padding: '12px 16px',
        fontSize: 14,
      }}
    >
      {message}
    </div>
  )
}
