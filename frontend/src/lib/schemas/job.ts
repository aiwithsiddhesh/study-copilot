import { z } from 'zod'

/**
 * Mirrors backend/jobs.py's job record shape exactly:
 *   {"status": "pending"|"done"|"failed", "result": None, "error": None, "http_status": None}
 * result/error/http_status are only populated once status leaves "pending".
 * Parameterized over the result schema since every endpoint's job wraps a
 * different payload (StudyPlan, QuizSet, the /attempts summary object).
 */
export function jobSchema<T extends z.ZodTypeAny>(resultSchema: T) {
  return z.object({
    status: z.enum(['pending', 'done', 'failed']),
    result: resultSchema.nullable(),
    error: z.string().nullable(),
    http_status: z.number().int().nullable(),
  })
}
export type Job<T> = {
  status: 'pending' | 'done' | 'failed'
  result: T | null
  error: string | null
  http_status: number | null
}

/** Mirrors backend/routes.py::create_plan's POST/create_quiz/submit_attempt
 * immediate response — just the job id to poll. */
export const jobIdResponseSchema = z.object({
  job_id: z.string(),
})
export type JobIdResponse = z.infer<typeof jobIdResponseSchema>

/** Mirrors backend/routes.py::submit_attempt's job result payload shape
 * (not a Pydantic model on the backend — an inline dict). */
import { weakTopicUpdateSchema } from './weakTopic'

export const attemptResultSchema = z.object({
  weak_topic_update: weakTopicUpdateSchema,
  plan_optimizer_triggered: z.boolean(),
})
export type AttemptResult = z.infer<typeof attemptResultSchema>
