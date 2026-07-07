import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useCreateQuiz, useSubmitAttempt } from '@/hooks/useQuiz'
import { QuestionCard, type QuestionAnswerDraft } from '@/components/quiz/QuestionCard'
import { QuizResult } from '@/components/quiz/QuizResult'
import { JobStatus } from '@/components/shared/JobStatus'
import { ErrorBanner } from '@/components/shared/ErrorBanner'

type Context = { studentId: string }

export function Quiz() {
  const { studentId } = useOutletContext<Context>()
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [answers, setAnswers] = useState<QuestionAnswerDraft[]>([])

  const createQuiz = useCreateQuiz(studentId)
  const submitAttempt = useSubmitAttempt(studentId)

  const quiz = createQuiz.job?.result

  function handleRequest() {
    setAnswers([])
    createQuiz.start({ subject: subject.trim(), topic: topic.trim() })
  }

  function handleAnswer(answer: QuestionAnswerDraft) {
    const nextAnswers = [...answers, answer]
    setAnswers(nextAnswers)

    if (quiz && nextAnswers.length === quiz.questions.length) {
      submitAttempt.start({
        subject: quiz.subject,
        topic_name: quiz.topic_name,
        answers: nextAnswers,
      })
    }
  }

  function handleRestart() {
    createQuiz.reset()
    submitAttempt.reset()
    setAnswers([])
    setSubject('')
    setTopic('')
  }

  if (submitAttempt.isDone && submitAttempt.job?.result) {
    const correctCount = answers.filter((a) => a.correct).length
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <QuizResult result={submitAttempt.job.result} correctCount={correctCount} total={answers.length} />
        <button type="button" className="primary-button" style={{ alignSelf: 'flex-start' }} onClick={handleRestart}>
          Take another quiz
        </button>
      </div>
    )
  }

  if (submitAttempt.isRunning) {
    return <JobStatus job={submitAttempt.job} pendingLabel="Scoring your attempt…" />
  }

  if (submitAttempt.isFailed) {
    return <JobStatus job={submitAttempt.job} />
  }

  if (quiz && answers.length < quiz.questions.length) {
    return (
      <div style={{ maxWidth: 560 }}>
        <QuestionCard
          key={answers.length}
          question={quiz.questions[answers.length]}
          index={answers.length}
          total={quiz.questions.length}
          onAnswer={handleAnswer}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
      <header>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Take a quiz</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
          Request questions on any topic from your syllabus, any time — it doesn't need to be a day the plan has reached yet.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label>
          <span className="field-label">Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" className="field-input" />
        </label>
        <label>
          <span className="field-label">Topic</span>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Irrational numbers" className="field-input" />
        </label>
        <button
          type="button"
          onClick={handleRequest}
          disabled={!subject.trim() || !topic.trim() || createQuiz.isRunning}
          className="primary-button"
          style={{ alignSelf: 'flex-start' }}
        >
          Generate quiz
        </button>
        {createQuiz.startError && <ErrorBanner error={createQuiz.startError} />}
        {createQuiz.isRunning && <JobStatus job={createQuiz.job} pendingLabel="Writing your quiz…" />}
        {createQuiz.isFailed && <JobStatus job={createQuiz.job} />}
      </div>
    </div>
  )
}
