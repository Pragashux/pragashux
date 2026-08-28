from __future__ import annotations

import json
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models import (
    Achievement,
    Assessment,
    Assignment,
    Certificate,
    Course,
    Enrollment,
    Lesson,
    LessonProgress,
    Module,
    Notification,
    Plan,
    Question,
    Subscription,
    User,
)
from app.security import hash_password


def seed_if_empty(db: Session) -> None:
    if db.query(User).first():
        return

    student = User(
        id="student_1",
        email="student@ailearnos.app",
        name="Sam Rivera",
        password_hash=hash_password("LearnOS@123"),
        role="student",
        photo_url="https://i.pravatar.cc/150?u=samlearnos",
        streak_days=12,
        total_xp=2840,
        skill_level="intermediate",
        preferred_format="mixed",
        interests=json.dumps(["UX Design", "Product", "AI"]),
        goals=json.dumps(["Land a UX role", "Build a portfolio"]),
        onboarding_complete=True,
    )
    admin = User(
        id="admin_1",
        email="admin@ailearnos.app",
        name="Alex Morgan",
        password_hash=hash_password("LearnOS@123"),
        role="admin",
        photo_url="https://i.pravatar.cc/150?u=alexadmin",
        onboarding_complete=True,
    )
    db.add_all([student, admin])

    struggling = [
        ("Jordan Lee", "jordan@ailearnos.app", 0.22, 2),
        ("Riley Chen", "riley@ailearnos.app", 0.31, 0),
        ("Ava Patel", "ava@ailearnos.app", 0.54, 5),
        ("Noah Brooks", "noah@ailearnos.app", 0.18, 0),
    ]
    extra_users = []
    for i, (name, email, _p, streak) in enumerate(struggling, start=2):
        extra_users.append(
            User(
                id=f"student_{i}",
                email=email,
                name=name,
                password_hash=hash_password("LearnOS@123"),
                role="student",
                photo_url=f"https://i.pravatar.cc/150?u={email}",
                streak_days=streak,
                total_xp=400 * i,
                skill_level="beginner",
                interests=json.dumps(["UX Design"]),
                goals=json.dumps(["Improve fundamentals"]),
                onboarding_complete=True,
            )
        )
    db.add_all(extra_users)

    for plan in (
        Plan(
            id="free",
            name="Free",
            price_monthly=0,
            description="Limited courses, limited AI questions, basic progress.",
            features=json.dumps(["2 courses", "20 AI questions / month", "Basic progress"]),
            ai_questions_limit=20,
        ),
        Plan(
            id="pro",
            name="Pro",
            price_monthly=19,
            description="Unlimited courses, AI tutor, quizzes, and personalized learning.",
            features=json.dumps(
                ["Unlimited courses", "AI tutor", "AI quizzes & materials", "Personalized learning"]
            ),
            ai_questions_limit=9999,
            unlimited_courses=True,
        ),
        Plan(
            id="premium",
            name="Premium",
            price_monthly=39,
            description="Everything in Pro plus plans, analytics, certificates, priority tutor.",
            features=json.dumps(
                [
                    "Everything in Pro",
                    "AI learning plan",
                    "Advanced analytics",
                    "Certificates",
                    "Priority AI tutor",
                    "Advanced assessments",
                ]
            ),
            ai_questions_limit=9999,
            unlimited_courses=True,
            certificates=True,
            advanced_analytics=True,
        ),
    ):
        db.add(plan)

    db.add(
        Subscription(
            user_id="student_1",
            plan_id="pro",
            status="active",
            renews_at=datetime.utcnow() + timedelta(days=18),
            trial_ends_at=datetime.utcnow() - timedelta(days=12),
        )
    )

    courses = _courses()
    db.add_all(courses)
    db.flush()

    ux = next(c for c in courses if c.id == "c_ux")
    _add_ux_curriculum(db, ux.id)
    for course in courses:
        if course.id == "c_ux":
            continue
        _add_generic_curriculum(db, course)

    db.add(
        Enrollment(
            user_id="student_1",
            course_id="c_ux",
            status="enrolled",
            progress=0.65,
            last_lesson_id="c_ux_l4",
        )
    )
    db.add(
        Enrollment(
            user_id="student_1",
            course_id="c_cloud",
            status="completed",
            progress=1.0,
        )
    )
    for sid, cid, prog in (
        ("student_2", "c_ux", 0.22),
        ("student_3", "c_ux", 0.31),
        ("student_4", "c_python", 0.54),
        ("student_5", "c_ux", 0.18),
    ):
        db.add(Enrollment(user_id=sid, course_id=cid, status="enrolled", progress=prog))

    db.add(
        Certificate(
            user_id="student_1",
            course_id="c_cloud",
            student_name="Sam Rivera",
            course_title="Cloud Fundamentals for Product Teams",
            credential_id="ALOS-CLD-2026-88421",
        )
    )
    db.add_all(
        [
            Notification(
                user_id="student_1",
                title="AI recommends a 15-minute revision",
                body="Your User Research fundamentals need a short refresh today.",
                type="ai_recommendation",
                action_route="/learn/c_ux",
            ),
            Notification(
                user_id="student_1",
                title="Keep your 12-day streak",
                body="Complete today's lesson to protect your streak.",
                type="streak",
                action_route="/home",
            ),
            Notification(
                user_id="student_1",
                title="Certificate available",
                body="Cloud Fundamentals is ready to share.",
                type="certificate",
                action_route="/certificates",
                is_read=True,
            ),
        ]
    )
    db.add(
        Achievement(
            user_id="student_1",
            title="Week Warrior",
            description="Maintain a 7-day streak",
            icon="local_fire_department",
            earned_at=datetime.utcnow(),
        )
    )
    db.commit()


def _courses() -> list[Course]:
    return [
        Course(
            id="c_ux",
            title="UX Design for Beginners",
            description="From curiosity to craft: research, flows, and usability with an AI tutor beside you.",
            subject="UX Design",
            category="Design",
            difficulty="beginner",
            audience="Career changers and junior PMs",
            thumbnail_url="https://picsum.photos/seed/uxbegin/800/450",
            rating=4.91,
            review_count=2140,
            students_count=18640,
            duration_hours=11,
            price=0,
            is_featured=True,
            is_popular=True,
            is_trending=True,
            objectives=json.dumps(
                [
                    "Explain UX vs UI with confidence",
                    "Run lightweight user research",
                    "Map a flow and test it",
                ]
            ),
            tags=json.dumps(["UX", "Research", "Design Thinking"]),
            summary="A guided beginner path with AI-generated practice baked into every module.",
            generated_by_ai=True,
        ),
        Course(
            id="c_python",
            title="Python for Curious Minds",
            description="Practical Python with AI-generated drills, not syntax marathons.",
            subject="Python",
            category="Development",
            difficulty="beginner",
            thumbnail_url="https://picsum.photos/seed/pythonai/800/450",
            is_popular=True,
            students_count=22110,
            duration_hours=16,
            tags=json.dumps(["Python", "Programming"]),
        ),
        Course(
            id="c_ml",
            title="Practical Machine Learning",
            description="Models, leakage, and evaluation — taught like a patient mentor.",
            subject="Machine Learning",
            category="Data Science",
            difficulty="intermediate",
            thumbnail_url="https://picsum.photos/seed/mlos/800/450",
            is_featured=True,
            students_count=15400,
            duration_hours=20,
            price=49,
            tags=json.dumps(["ML", "Python"]),
        ),
        Course(
            id="c_a11y",
            title="Accessible Interfaces",
            description="WCAG as product quality, not a compliance afterthought.",
            subject="Accessibility",
            category="Design",
            difficulty="intermediate",
            thumbnail_url="https://picsum.photos/seed/a11yos/800/450",
            students_count=7200,
            duration_hours=8,
            price=29,
            tags=json.dumps(["Accessibility", "WCAG"]),
        ),
        Course(
            id="c_cloud",
            title="Cloud Fundamentals for Product Teams",
            description="Auth, storage, and the moving parts behind a modern app.",
            subject="Cloud",
            category="Cloud",
            difficulty="beginner",
            thumbnail_url="https://picsum.photos/seed/cloudos/800/450",
            students_count=13400,
            duration_hours=10,
            is_popular=True,
            tags=json.dumps(["Cloud", "Backend"]),
        ),
    ]


def _add_ux_curriculum(db: Session, course_id: str) -> None:
    modules = [
        (
            "Introduction to UX",
            [
                ("What is UX?", "UX is how a product feels to use over time, not how a screen looks in a screenshot."),
                ("UX vs UI", "UI is the surface. UX is the journey, including the parts nobody designed on purpose."),
                ("Design Thinking", "Empathize, define, ideate, prototype, test — a loop, not a waterfall."),
                ("User Research", "Research exists to reduce expensive guesses."),
            ],
        ),
        (
            "User Research",
            [
                ("Research Methods", "Match the question to the method: observe, ask, or measure."),
                ("Interviews", "Ask about the last time, not the hypothetical future."),
                ("Surveys", "Surveys scale opinions; they rarely explain surprising behavior."),
                ("Personas", "A persona is a decision tool, not a poster."),
            ],
        ),
        (
            "Experience Design",
            [
                ("User flows", "If the happy path needs a map, the product is asking too much."),
                ("Wireframes", "Low fidelity is a feature: it invites critique of structure."),
                ("Usability testing", "Watch people attempt real tasks. Silence is data."),
                ("Iteration", "Ship the learning, not the first idea."),
            ],
        ),
    ]
    lesson_ids = []
    for mi, (mtitle, lessons) in enumerate(modules, start=1):
        module = Module(
            id=f"c_ux_m{mi}",
            course_id=course_id,
            title=mtitle,
            description=mtitle,
            order=mi,
        )
        db.add(module)
        db.flush()
        for li, (ltitle, body) in enumerate(lessons, start=1):
            lid = f"c_ux_l{(mi - 1) * 4 + li}"
            lesson_ids.append(lid)
            db.add(
                Lesson(
                    id=lid,
                    module_id=module.id,
                    title=ltitle,
                    description=body,
                    content=f"# {ltitle}\n\n{body}\n\n## Example\nA team ships a feature nobody asked for. Research would have shown the real job-to-be-done.\n\n## Try this\nExplain {ltitle} to a friend in four sentences.",
                    type="article" if li % 2 else "video",
                    duration_minutes=8 + li,
                    content_url="https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4"
                    if li % 2 == 0
                    else None,
                    order=li,
                )
            )
        assessment = Assessment(
            id=f"c_ux_a{mi}",
            course_id=course_id,
            title=f"{mtitle} check",
            type="quiz",
            description=f"AI-generated check for {mtitle}",
        )
        db.add(assessment)
        db.flush()
        db.add(
            Question(
                id=f"c_ux_q{mi}1",
                assessment_id=assessment.id,
                prompt=f"What is the main purpose of {mtitle}?",
                qtype="mcq",
                options=json.dumps(
                    [
                        "Make screens prettier",
                        "Reduce risk with evidence about people",
                        "Replace engineering",
                        "Increase animation",
                    ]
                ),
                correct_index=1,
                explanation="UX work is about evidence and outcomes, not decoration.",
                topic=mtitle,
            )
        )
        db.add(
            Question(
                id=f"c_ux_q{mi}2",
                assessment_id=assessment.id,
                prompt="Usability testing is primarily about collecting opinions.",
                qtype="true_false",
                options=json.dumps(["True", "False"]),
                correct_index=1,
                explanation="Testing observes behavior during tasks.",
                topic="Usability testing",
            )
        )
        db.add(
            Assignment(
                id=f"c_ux_as{mi}",
                course_id=course_id,
                title=f"{mtitle} studio",
                brief=f"Apply {mtitle} to an app you use weekly. Submit a one-page insight.",
                criteria=json.dumps(["Clarity", "Evidence", "Next step"]),
            )
        )

    db.add(
        LessonProgress(
            user_id="student_1",
            lesson_id="c_ux_l1",
            completed=True,
        )
    )
    db.add(
        LessonProgress(
            user_id="student_1",
            lesson_id="c_ux_l2",
            completed=True,
            bookmarked=True,
        )
    )
    db.add(
        LessonProgress(
            user_id="student_1",
            lesson_id="c_ux_l3",
            completed=True,
        )
    )


def _add_generic_curriculum(db: Session, course: Course) -> None:
    module = Module(
        id=f"{course.id}_m1",
        course_id=course.id,
        title="Getting started",
        order=1,
        description="Foundations",
    )
    db.add(module)
    db.flush()
    for i, title in enumerate(["Welcome", "Core ideas", "Practice lab", "Checkpoint"], start=1):
        db.add(
            Lesson(
                id=f"{course.id}_l{i}",
                module_id=module.id,
                title=title,
                description=title,
                content=f"# {title}\n\nGuided notes for {course.title}.",
                type="article",
                duration_minutes=10,
                order=i,
            )
        )
    assessment = Assessment(
        id=f"{course.id}_quiz",
        course_id=course.id,
        title="Foundations quiz",
        type="quiz",
    )
    db.add(assessment)
    db.flush()
    db.add(
        Question(
            id=f"{course.id}_q1",
            assessment_id=assessment.id,
            prompt=f"What is the first step when learning {course.subject}?",
            qtype="mcq",
            options=json.dumps(["Skip practice", "Build a mental model", "Memorize tools", "Ignore feedback"]),
            correct_index=1,
            explanation="Start with a model you can test.",
            topic=course.subject,
        )
    )
