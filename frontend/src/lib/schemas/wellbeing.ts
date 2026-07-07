import { z } from 'zod'

/** Mirrors crewai_core/models/wellbeing_flag.py::WellbeingFlag */
export const wellbeingFlagSchema = z.object({
  id: z.string(),
  reason: z.string(),
  flagged_at: z.string(),
  days_since_last_activity: z.number().int().nullable(),
  acknowledged: z.boolean(),
  reviewer_note: z.string().nullable(),
})
export type WellbeingFlag = z.infer<typeof wellbeingFlagSchema>

/** Mirrors backend/routes.py::WellbeingAckRequest */
export const wellbeingAckRequestSchema = z.object({
  flag_id: z.string(),
  reviewer_note: z.string(),
})
export type WellbeingAckRequest = z.infer<typeof wellbeingAckRequestSchema>
