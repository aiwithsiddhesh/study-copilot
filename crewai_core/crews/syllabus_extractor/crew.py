from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

from crewai_core.models.syllabus_draft import SyllabusDraft

from .guardrails import make_syllabus_extractor_guardrail


def log_step(step_output) -> None:
    print(f"[SyllabusExtractor step] {step_output}")


@CrewBase
class SyllabusExtractorCrew:
    """Runs once per subject to extract a reviewable SyllabusDraft from raw,
    unstructured index/table-of-contents text (e.g. a pasted book index) —
    the input has no assumed structure (headings, indentation, and
    numbering may be inconsistent or absent), unlike SyllabusAnalystCrew's
    already-structured JSON input, which this crew does not replace or
    modify.

    The input text's origin (pasted textarea, uploaded file converted to
    text, OCR output, or anything else) is out of scope here — this crew
    only ever receives a plain string.

    Output is a SyllabusDraft, not a SyllabusStructure — it is not consumed
    by the Flow directly; a human must review/edit and explicitly confirm it
    first (see backend/routes.py's syllabus-draft endpoints)."""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    def __init__(self, subject_name: str, grade: str, raw_index_text: str):
        self.subject_name = subject_name
        self.grade = grade
        self.raw_index_text = raw_index_text

    @agent
    def syllabus_extractor(self) -> Agent:
        return Agent(
            config=self.agents_config["syllabus_extractor"],
            max_rpm=5,
            step_callback=log_step,
            verbose=True,
        )

    @task
    def extract_syllabus_task(self) -> Task:
        return Task(
            config=self.tasks_config["extract_syllabus_task"],
            agent=self.syllabus_extractor(),
            output_pydantic=SyllabusDraft,
            guardrail=make_syllabus_extractor_guardrail(self.subject_name, self.raw_index_text),
            guardrail_max_retries=3,
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
