import { z } from 'zod'

/** Mirrors crewai_core/models/weak_topic.py::TopicStatus */
export const topicStatusSchema = z.enum(['Not Started', 'Struggling', 'Improving', 'Mastered'])
export type TopicStatus = z.infer<typeof topicStatusSchema>

/** Mirrors crewai_core/models/weak_topic.py::WeakTopicUpdate */
export const weakTopicUpdateSchema = z.object({
  subject: z.string(),
  topic_name: z.string(),
  status: topicStatusSchema,
  attempts_considered: z.number().int(),
  accuracy: z.number(),
})
export type WeakTopicUpdate = z.infer<typeof weakTopicUpdateSchema>
