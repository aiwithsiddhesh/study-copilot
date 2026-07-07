# Screenshots for the project README

Drop PNGs here with these exact filenames and the main README's image tags
will resolve automatically:

| Filename | Capture |
|---|---|
| `dashboard-empty.png` | `/` for a brand-new student (localStorage cleared / new id) — shows "No study plan yet." |
| `build-plan.png` | `/plan/build` with at least one subject added to the pending list and the calendar section filled in |
| `study-calendar.png` | `/plan/calendar` after a real plan has been generated |
| `quiz-question.png` | `/quiz` mid-quiz, one `QuestionCard` showing with an option selected |
| `quiz-result.png` | `/quiz` after submitting an attempt — the `QuizResult` card showing a mastery status pill |
| `analytics.png` | `/analytics` with at least one subject's hours/topics data |
| `wellbeing-flagged.png` | `/wellbeing` after a check that returned a flag (needs the last quiz attempt to be ≥ 7 real days old — not reachable in a single fresh session without a dev backdate hook) |

Suggested capture flow:

```bash
uv run uvicorn backend.app:app --reload   # terminal 1
cd frontend && npm run dev                 # terminal 2
```

Open `http://localhost:5173`, build one small real plan (one subject,
2–3 day calendar) to get real data into most of these screens, then
navigate through each page and screenshot it at ~1400px width or wider so
the sidebar + content are both visible.
