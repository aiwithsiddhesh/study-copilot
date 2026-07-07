"""Evaluate the Syllabus Extractor Crew via CrewAI's built-in test/eval
harness (Crew.test), per Section 3.6 of the build prompt.

Usage:
    uv run python -m crewai_core.crews.syllabus_extractor.test_crew [n_iterations]
"""

import sys

if sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from dotenv import load_dotenv

load_dotenv()

from crewai_core.crews.syllabus_extractor.crew import SyllabusExtractorCrew

SAMPLE_RAW_INDEX_TEXT = """
Mathematics - Grade 10 Index

1. Real Numbers (10%)
   1.1 Euclid's Division Lemma
   1.2 Fundamental Theorem of Arithmetic
   1.3 Irrational Numbers

2. Polynomials
   2.1 Zeroes of a Polynomial
   2.2 Relationship between Zeroes and Coefficients
   2.3 Division Algorithm for Polynomials

3. Pair of Linear Equations in Two Variables (15%)
   3.1 Graphical Method
   3.2 Substitution Method
   3.3 Elimination Method

4. Triangles
   4.1 Similar Triangles
   4.2 Pythagoras Theorem
"""


def main() -> None:
    n_iterations = int(sys.argv[1]) if len(sys.argv) > 1 else 2

    crew_instance = SyllabusExtractorCrew(
        subject_name="Mathematics", grade="10", raw_index_text=SAMPLE_RAW_INDEX_TEXT
    )

    print(f"Testing SyllabusExtractorCrew on 'Mathematics' for {n_iterations} iterations...")
    crew_instance.crew().test(
        n_iterations=n_iterations,
        eval_llm="gpt-4o-mini",
        inputs={
            "subject_name": crew_instance.subject_name,
            "grade": crew_instance.grade,
            "raw_index_text": crew_instance.raw_index_text,
        },
    )


if __name__ == "__main__":
    main()
