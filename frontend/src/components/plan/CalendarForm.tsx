import type { CalendarStructure } from '@/lib/schemas/calendar'
import { DAYS_OF_WEEK } from '@/lib/schemas/calendar'
import { ExamDeadlineList } from './ExamDeadlineList'
import { RecurringActivityList } from './RecurringActivityList'
import { PersonalGapList } from './PersonalGapList'

export function CalendarForm({
  calendar,
  onChange,
}: {
  calendar: CalendarStructure
  onChange: (calendar: CalendarStructure) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <label style={{ flex: 1 }}>
          <span className="field-label">Term start</span>
          <input
            type="date"
            value={calendar.term_start}
            onChange={(e) => onChange({ ...calendar, term_start: e.target.value })}
            className="field-input"
          />
        </label>
        <label style={{ flex: 1 }}>
          <span className="field-label">Term end</span>
          <input
            type="date"
            value={calendar.term_end}
            onChange={(e) => onChange({ ...calendar, term_end: e.target.value })}
            className="field-input"
          />
        </label>
      </div>

      <div>
        <span className="field-label">Weekly available hours</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 6 }}>
          {DAYS_OF_WEEK.map((day) => (
            <label key={day} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--ink-faint)', textTransform: 'capitalize' }}>
                {day.slice(0, 3)}
              </span>
              <input
                type="number"
                min={0}
                max={24}
                value={calendar.weekly_available_hours[day]}
                onChange={(e) =>
                  onChange({
                    ...calendar,
                    weekly_available_hours: {
                      ...calendar.weekly_available_hours,
                      [day]: Number(e.target.value),
                    },
                  })
                }
                className="field-input tabular"
                style={{ textAlign: 'center', marginTop: 4 }}
              />
            </label>
          ))}
        </div>
      </div>

      <ExamDeadlineList
        label="Exam dates"
        addLabel="+ Add exam"
        items={calendar.exam_dates}
        onChange={(exam_dates) => onChange({ ...calendar, exam_dates })}
      />

      <ExamDeadlineList
        label="Assignment deadlines"
        addLabel="+ Add deadline"
        items={calendar.assignment_deadlines}
        onChange={(assignment_deadlines) => onChange({ ...calendar, assignment_deadlines })}
      />

      <RecurringActivityList
        items={calendar.recurring_activities}
        onChange={(recurring_activities) => onChange({ ...calendar, recurring_activities })}
      />

      <PersonalGapList
        items={calendar.personal_gaps}
        onChange={(personal_gaps) => onChange({ ...calendar, personal_gaps })}
      />
    </div>
  )
}
