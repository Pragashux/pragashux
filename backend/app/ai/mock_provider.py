from __future__ import annotations

from typing import Any


class MockLLMProvider:
    """Deterministic tutor used when no production LLM key is configured."""

    def complete(self, system: str, user: str, context: dict[str, Any] | None = None) -> str:
        ctx = context or {}
        text = user.lower()
        lesson = ctx.get("lesson_title") or "this lesson"
        course = ctx.get("course_title") or "your course"
        skill = ctx.get("skill_level") or "beginner"
        weak = ctx.get("weak_topics") or ["user research"]

        if "quiz" in text:
            return (
                f"Here is a 3-question check on {lesson} ({course}), tuned for a {skill} learner.\n"
                "1. What is the primary goal of this topic?\n"
                "2. Name one method you would use in practice.\n"
                "3. What mistake should you avoid?\n"
                "Reply with your answers and I will mark them."
            )
        if "example" in text:
            return (
                f"A real-world example for {lesson}: a product team interviews five customers "
                "before redesigning checkout. They discover the drop-off is trust, not layout — "
                "so they add order reassurance instead of a new animation."
            )
        if "wrong" in text or "mistake" in text:
            return (
                "Your answer missed the 'why'. In usability testing we observe behavior; "
                "surveys collect opinions. Mixing those up is the most common error I see."
            )
        if "simpler" in text or "don't understand" in text or "dont understand" in text:
            return (
                f"Let’s slow {lesson} down. Imagine teaching a friend in two sentences: "
                "the idea exists to reduce guesswork. We watch real people, note friction, then change the design. "
                f"Your notes suggest extra practice on {weak[0]}."
            )
        if "summar" in text:
            return (
                f"Summary of {lesson}: define the problem, pick a method that fits the question, "
                "collect evidence, and convert insights into a design decision."
            )
        if "plan" in text:
            return (
                "Today's 35-minute plan:\n"
                "1. Finish the current lesson (12 min)\n"
                "2. Revise your weakest topic (10 min)\n"
                "3. Take a 10-question quiz (8 min)\n"
                "4. One case-study sketch (5 min)"
            )
        return (
            f"I’m your tutor for {course}. You are currently on {lesson}. "
            f"At {skill} level, I will keep explanations concrete. "
            f"Ask me to explain simpler, give an example, quiz you, or start from the beginning.\n\n"
            f"On your question: {user.strip()}\n"
            "The short answer is to connect the concept to a decision you can make in a real product. "
            "If you tell me what confused you, I will unpack that part first."
        )
