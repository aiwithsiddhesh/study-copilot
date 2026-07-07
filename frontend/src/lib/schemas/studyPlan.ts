import { z } from 'zod'

/** Mirrors crewai_core/models/study_plan.py::StudyPlanEntry */
export const studyPlanEntrySchema = z.object({
  subject: z.string(),
  topic_name: z.string(),
  hours_allocated: z.number(),
})
export type StudyPlanEntry = z.infer<typeof studyPlanEntrySchema>

/** Mirrors crewai_core/models/study_plan.py::DayPlan */
export const dayPlanSchema = z.object({
  date: z.string(), // ISO YYYY-MM-DD
  entries: z.array(studyPlanEntrySchema),
})
export type DayPlan = z.infer<typeof dayPlanSchema>

/** Mirrors crewai_core/models/study_plan.py::StudyPlan */
export const studyPlanSchema = z.object({
  days: z.array(dayPlanSchema),
})
export type StudyPlan = z.infer<typeof studyPlanSchema>
