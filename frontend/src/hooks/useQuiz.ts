import { useJobPoll } from './useJobPoll'
import { quizSetSchema } from '@/lib/schemas/quiz'
import { attemptResultSchema } from '@/lib/schemas/job'

export function useCreateQuiz(studentId: string) {
  return useJobPoll({
    startPath: `/students/${studentId}/quiz`,
    resultSchema: quizSetSchema,
  })
}

export function useSubmitAttempt(studentId: string) {
  return useJobPoll({
    startPath: `/students/${studentId}/attempts`,
    resultSchema: attemptResultSchema,
  })
}
