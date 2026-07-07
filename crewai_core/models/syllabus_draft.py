from typing import Literal

from pydantic import BaseModel, Field


class SyllabusDraftTopic(BaseModel):
    topic_name: str
    sub_topics: list[str] = Field(default_factory=list)
    source_confidence: Literal["matched", "uncertain"] = "matched"


class SyllabusDraftUnit(BaseModel):
    unit_name: str
    weightage_percent: float
    weightage_is_estimated: bool
    topics: list[SyllabusDraftTopic]


class SyllabusDraft(BaseModel):
    """Reviewable draft extracted from free-form text (e.g. a pasted book
    index) by SyllabusExtractorCrew — NOT Flow-safe on its own. A human must
    review/edit and explicitly confirm a SyllabusDraft (converting it to a
    real SyllabusStructure) before it can be included in raw_syllabi passed
    to StudyPlanFlow.kickoff_async()."""

    grade: str
    subject: str
    units: list[SyllabusDraftUnit]
    subject_mismatch: bool = False
    subject_mismatch_reason: str | None = None
