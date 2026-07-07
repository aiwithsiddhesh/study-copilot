import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { wellbeingFlagSchema, type WellbeingFlag } from '@/lib/schemas/wellbeing'

/**
 * POST /wellbeing-check returns the flag synchronously (or null) — not
 * job-polled, since it's a plain deterministic threshold check
 * (crewai_core/wellbeing_monitor.py), not an LLM call.
 *
 * The backend has no GET list endpoint for flags at all — check and ack
 * are the only two operations, and each only ever returns the ONE flag
 * it's currently acting on (a freshly-created one, or the one just
 * acknowledged). There's no way to page through flag history from this
 * API, so the page below only ever shows "the flag from your last check,"
 * not a running list — that's the real, honest shape of what's available.
 */
export function useWellbeingCheck(studentId: string) {
  return useMutation<WellbeingFlag | null, ApiError>({
    mutationFn: () => api.post(`/students/${studentId}/wellbeing-check`, wellbeingFlagSchema.nullable()),
  })
}

export function useWellbeingAck(studentId: string) {
  const queryClient = useQueryClient()
  return useMutation<WellbeingFlag, ApiError, { flag_id: string; reviewer_note: string }>({
    mutationFn: (body) => api.post(`/students/${studentId}/wellbeing-ack`, wellbeingFlagSchema, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wellbeing-check', studentId] })
    },
  })
}
