import { z } from 'zod'

/** Mirrors crewai_core/models/calendar.py::CalendarEvent */
export const calendarEventSchema = z.object({
  name: z.string(),
  date: z.string(), // ISO YYYY-MM-DD
})
export type CalendarEvent = z.infer<typeof calendarEventSchema>

/** Mirrors crewai_core/models/calendar.py::WeeklyAvailableHours */
export const weeklyAvailableHoursSchema = z.object({
  monday: z.number(),
  tuesday: z.number(),
  wednesday: z.number(),
  thursday: z.number(),
  friday: z.number(),
  saturday: z.number(),
  sunday: z.number(),
})
export type WeeklyAvailableHours = z.infer<typeof weeklyAvailableHoursSchema>

/** Mirrors crewai_core/models/calendar.py::RecurringActivity */
export const recurringActivitySchema = z.object({
  name: z.string(),
  day: z.string(),
  hours_blocked: z.number(),
})
export type RecurringActivity = z.infer<typeof recurringActivitySchema>

/** Mirrors crewai_core/models/calendar.py::PersonalGap */
export const personalGapSchema = z.object({
  reason: z.string(),
  start_date: z.string(),
  end_date: z.string(),
})
export type PersonalGap = z.infer<typeof personalGapSchema>

/** Mirrors crewai_core/models/calendar.py::CalendarStructure */
export const calendarStructureSchema = z.object({
  term_start: z.string(),
  term_end: z.string(),
  exam_dates: z.array(calendarEventSchema),
  assignment_deadlines: z.array(calendarEventSchema),
  weekly_available_hours: weeklyAvailableHoursSchema,
  recurring_activities: z.array(recurringActivitySchema),
  personal_gaps: z.array(personalGapSchema),
})
export type CalendarStructure = z.infer<typeof calendarStructureSchema>

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export function emptyCalendar(): CalendarStructure {
  return {
    term_start: '',
    term_end: '',
    exam_dates: [],
    assignment_deadlines: [],
    weekly_available_hours: {
      monday: 2,
      tuesday: 2,
      wednesday: 2,
      thursday: 2,
      friday: 2,
      saturday: 3,
      sunday: 3,
    },
    recurring_activities: [],
    personal_gaps: [],
  }
}
