from __future__ import annotations

import json
import re
from typing import Any
from uuid import uuid4

from app.ai.base import HttpLLMProvider, LLMProvider
from app.ai.mock_provider import MockLLMProvider
from app.config import get_settings

AI_UNAVAILABLE = "AI is temporarily unavailable. Please try again."


def get_llm() -> LLMProvider:
    settings = get_settings()
    if settings.llm_provider == "openai" and settings.llm_api_key:
        return HttpLLMProvider(settings.llm_api_key, settings.llm_base_url, settings.llm_model)
    return MockLLMProvider()


class AIService:
    """Single intelligence layer used by student tutor and admin automation."""

    def __init__(self, llm: LLMProvider | None = None) -> None:
        self.llm = llm or get_llm()

    def chat(self, message: str, context: dict[str, Any]) -> str:
        try:
            system = (
                "You are a personal teacher for AI LearnOS. Be warm, precise, and Socratic when useful. "
                "Never mention being a generic chatbot. Use the student's course, lesson, skill, and mistakes."
            )
            return self.llm.complete(system, message, context)
        except Exception:
            return AI_UNAVAILABLE

    def explain(self, text: str, mode: str, context: dict[str, Any]) -> str:
        prompts = {
            "simpler": f"Explain more simply: {text}",
            "example": f"Give me an example of: {text}",
            "summary": f"Summarize: {text}",
            "from_start": f"Teach me from the beginning: {text}",
            "real_world": f"Give me real-world examples of: {text}",
            "quiz": f"Quiz me on: {text}",
        }
        return self.chat(prompts.get(mode, text), context)

    def generate_quiz(self, topic: str, count: int, difficulty: str) -> dict[str, Any]:
        questions = []
        stems = [
            ("mcq", f"What best describes {topic}?", 1),
            ("true_false", f"{topic} is only useful for experts.", 1),
            ("mcq", f"Which method is most appropriate when studying {topic}?", 0),
            ("short", f"In one sentence, why does {topic} matter?", None),
            ("scenario", f"A team is stuck. How would you apply {topic} this week?", None),
        ]
        for i in range(count):
            qtype, prompt, correct = stems[i % len(stems)]
            questions.append(
                {
                    "id": f"gq_{i+1}",
                    "prompt": prompt + (f" ({difficulty})" if qtype == "mcq" else ""),
                    "qtype": qtype,
                    "options": [
                        "A surface-level opinion survey",
                        "A structured way to reduce design risk",
                        "A branding exercise",
                        "A coding interview trick",
                    ]
                    if qtype in {"mcq", "multiple"}
                    else ["True", "False"]
                    if qtype == "true_false"
                    else [],
                    "correct_index": correct,
                    "explanation": f"Connect {topic} back to a decision you can test.",
                    "topic": topic,
                }
            )
        return {"title": f"{topic} practice", "questions": questions}

    def flashcards(self, topic: str, count: int) -> list[dict[str, str]]:
        cards = []
        for i in range(count):
            cards.append(
                {
                    "front": f"{topic}: concept {i+1}",
                    "back": f"Use this idea to make a clearer decision in your next critique or research session.",
                }
            )
        return cards

    def daily_plan(self, context: dict[str, Any]) -> dict[str, Any]:
        course = context.get("course_title") or "UX Design for Beginners"
        weak = (context.get("weak_topics") or ["User research"])[0]
        return {
            "title": "Today's goal",
            "estimated_minutes": 35,
            "items": [
                {"id": "p1", "title": f"Complete the next lesson in {course}", "minutes": 12, "kind": "lesson"},
                {"id": "p2", "title": f"Review {weak}", "minutes": 10, "kind": "revision"},
                {"id": "p3", "title": "Take a 10-question quiz", "minutes": 8, "kind": "quiz"},
                {"id": "p4", "title": "Practice one case study", "minutes": 5, "kind": "practice"},
            ],
            "rationale": f"You are building consistency. Extra time on {weak} will raise assessment scores.",
        }

    def study_session(self, topic: str, minutes: int, difficulty: str) -> dict[str, Any]:
        slice_m = max(5, minutes // 4)
        return {
            "topic": topic,
            "minutes": minutes,
            "difficulty": difficulty,
            "blocks": [
                {"kind": "explanation", "minutes": slice_m, "content": f"Plain-language briefing on {topic}."},
                {"kind": "example", "minutes": slice_m, "content": f"A worked example applying {topic}."},
                {"kind": "practice", "minutes": slice_m, "content": f"One short exercise at {difficulty} level."},
                {"kind": "quiz", "minutes": minutes - 3 * slice_m, "content": "Close with a 4-question check."},
            ],
        }

    def evaluate_answers(self, questions: list[dict[str, Any]], answers: dict[str, Any]) -> dict[str, Any]:
        correct = 0
        details = []
        weak: dict[str, int] = {}
        for q in questions:
            qid = q["id"]
            expected = q.get("correct_index")
            got = answers.get(qid)
            ok = expected is not None and got == expected
            if ok:
                correct += 1
            else:
                topic = q.get("topic") or "fundamentals"
                weak[topic] = weak.get(topic, 0) + 1
            details.append(
                {
                    "question_id": qid,
                    "correct": ok,
                    "expected": expected,
                    "explanation": q.get("explanation") or "Review the lesson notes for this concept.",
                }
            )
        total = max(len(questions), 1)
        pct = round(100 * correct / total)
        weak_topics = sorted(weak, key=weak.get, reverse=True)
        return {
            "score": correct,
            "total": total,
            "percentage": pct,
            "passed": pct >= 70,
            "details": details,
            "weak_topics": weak_topics,
            "recommended_revision": weak_topics[:2],
            "next_action": (
                f"Revise {weak_topics[0]} with a simpler explanation and a practice quiz."
                if weak_topics
                else "Advance to the next lesson — you are ready."
            ),
        }

    def evaluate_assignment(self, brief: str, criteria: list[str], text: str) -> dict[str, Any]:
        length = len(text.split())
        score = 62
        if length > 80:
            score += 12
        if any(word.lower() in text.lower() for word in ["user", "research", "test", "insight"]):
            score += 10
        score = min(score, 96)
        return {
            "score": score,
            "strengths": [
                "You stated a clear problem.",
                "The write-up is structured enough to review.",
            ],
            "weaknesses": [
                "Add evidence from at least one method.",
                "Spell out the design decision your insight unlocks.",
            ],
            "feedback": f"Against the brief ({brief[:120]}…), this draft is {'strong' if score >= 80 else 'promising'}.",
            "improvements": [
                "Quote one observation.",
                "Name the next experiment.",
            ],
            "recommended_materials": [
                "Lesson: Research methods",
                "Quiz: User research fundamentals",
            ],
            "criteria": criteria,
        }

    def generate_course(
        self,
        name: str,
        description: str,
        subject: str,
        difficulty: str,
        audience: str,
        objectives: list[str],
    ) -> dict[str, Any]:
        modules = _course_blueprint(name, subject)
        return {
            "title": name,
            "description": description or f"An AI-authored path through {name} for {audience}.",
            "subject": subject,
            "difficulty": difficulty,
            "audience": audience,
            "objectives": objectives
            or [
                f"Explain core ideas in {name}",
                "Practice with realistic exercises",
                "Assess readiness with quizzes and an assignment",
            ],
            "summary": f"{name} is sequenced from foundations to applied practice.",
            "faqs": [
                {"q": "Who is this for?", "a": audience},
                {"q": "How is AI used?", "a": "Structure, materials, quizzes, and tutoring are generated then editable."},
            ],
            "modules": modules,
            "status": "draft",
            "generated_by_ai": True,
        }

    def recommend(self, profile: dict[str, Any]) -> list[dict[str, str]]:
        weak = (profile.get("weak_topics") or ["User research"])[0]
        course = profile.get("current_course") or "UX Design for Beginners"
        progress = int((profile.get("progress") or 0.65) * 100)
        return [
            {
                "title": f"You are {progress}% through {course}",
                "body": f"AI recommends a 15-minute revision session on {weak} today.",
                "action": "revision",
            },
            {
                "title": "Next lesson",
                "body": "Continue where you stopped — keep the streak alive.",
                "action": "next_lesson",
            },
            {
                "title": "Practice quiz",
                "body": f"A short quiz will confirm whether {weak} has stuck.",
                "action": "quiz",
            },
        ]

    def analyze_student(self, stats: dict[str, Any]) -> dict[str, Any]:
        engagement = stats.get("engagement", 0.4)
        fail_rate = stats.get("fail_rate", 0.35)
        flags = []
        if engagement < 0.45:
            flags.append("low_engagement")
        if fail_rate > 0.3:
            flags.append("weak_topics")
        if stats.get("days_inactive", 0) >= 7:
            flags.append("dropout_risk")
        if stats.get("behind", False):
            flags.append("falling_behind")
        return {
            "skill_level": stats.get("skill_level", "beginner"),
            "flags": flags,
            "needs_intervention": bool(flags),
            "summary": ", ".join(flags) or "on_track",
        }

    def admin_assist(self, prompt: str, snapshot: dict[str, Any]) -> dict[str, Any]:
        p = prompt.lower()
        if "delete" in p:
            return {
                "reply": "This action is destructive. Confirm to proceed.",
                "requires_confirmation": True,
                "kind": "delete",
                "payload": {"prompt": prompt},
            }
        if "inactive" in p:
            return {
                "reply": f"{snapshot.get('inactive_students', 18)} students look inactive this week.",
                "requires_confirmation": False,
            }
        if "struggl" in p:
            names = snapshot.get("struggling", ["Jordan Lee", "Riley Chen"])
            return {
                "reply": "Students needing intervention: " + ", ".join(names),
                "requires_confirmation": False,
            }
        if "best" in p and "course" in p:
            return {
                "reply": snapshot.get("best_course", "UX Design for Beginners is performing best (completion 78%)."),
                "requires_confirmation": False,
            }
        if "low completion" in p:
            return {
                "reply": snapshot.get(
                    "low_completion",
                    "Course completion dropped on Module 4 of several design courses. Simplify and add examples.",
                ),
                "requires_confirmation": False,
            }
        if "report" in p:
            return {
                "reply": (
                    "Monthly report: active students "
                    f"{snapshot.get('active_students', 3921)}, revenue "
                    f"${snapshot.get('revenue', 184250):,}, AI sessions "
                    f"{snapshot.get('ai_sessions', 12840)}."
                ),
                "requires_confirmation": False,
            }
        if "create" in p and "course" in p:
            title = _extract_course_title(prompt)
            draft = self.generate_course(title, "", "General", "beginner", "New learners", [])
            return {
                "reply": f"Prepared a draft course titled “{title}”. Review modules before publishing.",
                "requires_confirmation": False,
                "draft_course": draft,
            }
        return {
            "reply": self.chat(prompt, {"course_title": "Admin workspace"}),
            "requires_confirmation": False,
        }


def _extract_course_title(prompt: str) -> str:
    match = re.search(r"about (.+)$", prompt.strip(), re.I)
    if match:
        return match.group(1).strip(" .")
    return "New AI course"


def _course_blueprint(name: str, subject: str) -> list[dict[str, Any]]:
    if "ux" in name.lower() or "ux" in subject.lower():
        structure = [
            (
                "Introduction to UX",
                ["What is UX?", "UX vs UI", "Design Thinking", "User Research"],
            ),
            (
                "User Research",
                ["Research Methods", "Interviews", "Surveys", "Personas"],
            ),
            (
                "Experience Design",
                ["User flows", "Wireframes", "Usability testing", "Iteration"],
            ),
        ]
    else:
        structure = [
            (f"Introduction to {name}", ["What is this field?", "Core vocabulary", "How professionals work", "First exercise"]),
            ("Foundations", ["Mental models", "Methods", "Tools", "Practice lab"]),
            ("Application", ["Case study", "Quiz", "Assignment", "Revision"]),
        ]
    modules = []
    for mi, (mtitle, lessons) in enumerate(structure, start=1):
        lesson_objs = []
        for li, ltitle in enumerate(lessons, start=1):
            lesson_objs.append(
                {
                    "id": str(uuid4()),
                    "title": ltitle,
                    "description": f"Learn {ltitle} in the context of {name}.",
                    "content": (
                        f"# {ltitle}\n\n"
                        f"This lesson explains {ltitle} with a beginner-friendly arc: definition, "
                        "why it matters, a worked example, and a short practice prompt.\n\n"
                        "## Why it matters\n"
                        "You will use this idea to make a better product decision, not to memorize jargon.\n\n"
                        "## Practice\n"
                        "Write three bullets you could share with a teammate tomorrow."
                    ),
                    "type": "article" if li % 2 else "video",
                    "duration_minutes": 8 + li * 2,
                    "order": li,
                    "examples": [f"Team example applying {ltitle}."],
                    "exercises": [f"Sketch how {ltitle} shows up in an app you use daily."],
                    "flashcards": [
                        {"front": ltitle, "back": f"A practical definition of {ltitle}."},
                    ],
                }
            )
        modules.append(
            {
                "id": str(uuid4()),
                "title": mtitle,
                "description": f"Module {mi}: {mtitle}",
                "order": mi,
                "lessons": lesson_objs,
                "quiz": {
                    "title": f"{mtitle} check",
                    "questions": [
                        {
                            "prompt": f"What is the goal of {mtitle}?",
                            "options": ["Decoration", "Reducing user friction with evidence", "Shipping faster only", "Ignoring research"],
                            "correct_index": 1,
                            "qtype": "mcq",
                        }
                    ],
                },
                "assignment": {
                    "title": f"{mtitle} studio task",
                    "brief": f"Apply {mtitle} to a product you know and submit a one-page write-up.",
                },
            }
        )
    return modules
