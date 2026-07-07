import { z } from 'zod'

/** Mirrors crewai_core/models/quiz.py::QuizQuestion */
export const quizQuestionSchema = z.object({
  subject: z.string(),
  topic_name: z.string(),
  question_text: z.string(),
  options: z.array(z.string()),
  correct_option_index: z.number().int(),
})
export type QuizQuestion = z.infer<typeof quizQuestionSchema>

/** Mirrors crewai_core/models/quiz.py::QuizSet */
export const quizSetSchema = z.object({
  subject: z.string(),
  topic_name: z.string(),
  questions: z.array(quizQuestionSchema),
})
export type QuizSet = z.infer<typeof quizSetSchema>

/** Mirrors backend/routes.py::QuizRequest */
export const quizRequestSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
})
export type QuizRequest = z.infer<typeof quizRequestSchema>

/** Mirrors crewai_core/models/quiz_attempt.py::QuestionAnswer */
export const questionAnswerSchema = z.object({
  question_text: z.string(),
  selected_option_index: z.number().int(),
  correct: z.boolean(),
  response_time_seconds: z.number(),
  retries: z.number().int(),
})
export type QuestionAnswer = z.infer<typeof questionAnswerSchema>

/** Mirrors crewai_core/models/quiz_attempt.py::QuizAttempt (attempted_at is
 * stamped server-side by score_attempt() if omitted — the frontend does not
 * need to set it). */
export const quizAttemptSchema = z.object({
  subject: z.string(),
  topic_name: z.string(),
  answers: z.array(questionAnswerSchema),
  attempted_at: z.string().optional(),
})
export type QuizAttempt = z.infer<typeof quizAttemptSchema>
