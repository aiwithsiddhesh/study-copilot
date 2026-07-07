import { useEffect, useRef, useState } from 'react'
import type { QuizQuestion } from '@/lib/schemas/quiz'

export type QuestionAnswerDraft = {
  question_text: string
  selected_option_index: number
  correct: boolean
  response_time_seconds: number
  retries: number
}

/**
 * One question, with a REAL per-question timer (starts the moment the
 * question mounts, stops when the student moves on) and REAL retry
 * counting (every time the student changes their selection before
 * confirming) — this is what crewai_core/performance_tracker.py's
 * classify_answer() actually keys off (fast/slow x correct/wrong), so
 * placeholder timing would make that signal meaningless. Decided with the
 * user: real timing/retries, not a fixed placeholder.
 */
export function QuestionCard({
  question,
  index,
  total,
  onAnswer,
}: {
  question: QuizQuestion
  index: number
  total: number
  onAnswer: (answer: QuestionAnswerDraft) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [retries, setRetries] = useState(0)
  const startedAt = useRef(performance.now())

  useEffect(() => {
    startedAt.current = performance.now()
    setSelected(null)
    setRetries(0)
  }, [question])

  function selectOption(optionIndex: number) {
    if (selected !== null && selected !== optionIndex) {
      setRetries((r) => r + 1)
    }
    setSelected(optionIndex)
  }

  function handleNext() {
    if (selected === null) return
    const elapsedSeconds = (performance.now() - startedAt.current) / 1000
    onAnswer({
      question_text: question.question_text,
      selected_option_index: selected,
      correct: selected === question.correct_option_index,
      response_time_seconds: Math.round(elapsedSeconds * 10) / 10,
      retries,
    })
  }

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: 24,
        background: 'var(--paper-raised)',
        boxShadow: 'var(--shadow-soft)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-faint)' }}>
        <span className="tabular">
          Question {index + 1} of {total}
        </span>
        <span>{question.topic_name}</span>
      </div>

      <p style={{ fontSize: 17, lineHeight: 1.5 }}>{question.question_text}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.options.map((option, i) => {
          const isSelected = selected === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => selectOption(i)}
              style={{
                textAlign: 'left',
                padding: '11px 14px',
                borderRadius: 8,
                border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--line-strong)'}`,
                background: isSelected ? 'var(--accent-soft)' : 'var(--paper)',
                color: 'var(--ink)',
                cursor: 'pointer',
                fontSize: 14.5,
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
            >
              {option}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={selected === null}
        className="primary-button"
        style={{ alignSelf: 'flex-end' }}
      >
        {index + 1 === total ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}
