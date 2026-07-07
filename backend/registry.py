"""In-memory registry mapping student_id -> (StudyPlanFlow, asyncio.Lock).

In-memory only, per student, for the lifetime of this process. There is no
rehydration from CrewAI's own @persist() SQLite store on process restart —
a restart loses the registry (though CrewAI's own SQLite checkpoint still
exists on disk; this app just never reads it back into the registry).

Every operation that touches flow.state must hold that student's lock for
its full duration (see backend/routes.py) — this registry only owns
construction/replacement of the (Flow, Lock) pair, not the locking
discipline around using them.
"""

import asyncio

from crewai_core.flow import StudyPlanFlow
from crewai_core.models.syllabus import SyllabusStructure

_registry: dict[str, tuple[StudyPlanFlow, asyncio.Lock]] = {}


def get(student_id: str) -> tuple[StudyPlanFlow, asyncio.Lock] | None:
    return _registry.get(student_id)


def create_or_replace(
    student_id: str,
    raw_syllabi: list[dict],
    raw_calendar: dict,
    pre_analyzed_syllabi: list[SyllabusStructure] | None = None,
) -> tuple[StudyPlanFlow, asyncio.Lock]:
    """(Re)create the Flow for this student. A repeat call for a student_id
    that already has a Flow is a deliberate "start this student over": the
    prior Flow instance (and its accumulated quiz_history/weak_topics/
    wellbeing_flags) is discarded, not merged or rejected.

    pre_analyzed_syllabi: passed straight through to StudyPlanFlow — see
    its docstring. backend/routes.py's /plan already converts each
    subject's raw text via SyllabusExtractorCrew before calling this, so
    the Flow must not re-run SyllabusAnalystCrew on already-clean data.
    """
    if student_id in _registry:
        print(
            f"=== registry: replacing existing Flow for student_id={student_id!r} — "
            "prior quiz_history/weak_topics/wellbeing_flags are discarded ==="
        )

    flow = StudyPlanFlow(
        raw_syllabi=raw_syllabi,
        raw_calendar=raw_calendar,
        pre_analyzed_syllabi=pre_analyzed_syllabi,
    )
    lock = asyncio.Lock()
    _registry[student_id] = (flow, lock)
    return flow, lock
