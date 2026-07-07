import { z } from 'zod'

/** Mirrors crewai_core/models/syllabus.py::SyllabusTopic */
export const syllabusTopicSchema = z.object({
  topic_name: z.string(),
  sub_topics: z.array(z.string()),
})
export type SyllabusTopic = z.infer<typeof syllabusTopicSchema>

/** Mirrors crewai_core/models/syllabus.py::SyllabusUnit */
export const syllabusUnitSchema = z.object({
  unit_name: z.string(),
  weightage_percent: z.number(),
  topics: z.array(syllabusTopicSchema),
})
export type SyllabusUnit = z.infer<typeof syllabusUnitSchema>

/** Mirrors crewai_core/models/syllabus.py::SyllabusStructure */
export const syllabusStructureSchema = z.object({
  grade: z.string(),
  subject: z.string(),
  units: z.array(syllabusUnitSchema),
})
export type SyllabusStructure = z.infer<typeof syllabusStructureSchema>

/**
 * Mirrors backend/routes.py::RawSubjectSyllabus — one subject's syllabus
 * exactly as the student typed/pasted it in. This is the ONLY syllabus
 * input shape the frontend ever sends: there is no separate "already
 * structured" path (see backend/routes.py's module docstring).
 */
export const rawSubjectSyllabusSchema = z.object({
  subject_name: z.string().min(1, 'Subject name is required'),
  grade: z.string().min(1, 'Grade is required'),
  raw_index_text: z.string().min(1, 'Paste the syllabus/index text'),
})
export type RawSubjectSyllabus = z.infer<typeof rawSubjectSyllabusSchema>
