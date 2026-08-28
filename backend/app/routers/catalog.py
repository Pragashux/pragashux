from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import current_user
from app.models import (
    Course,
    Enrollment,
    Lesson,
    LessonProgress,
    Module,
    User,
)

router = APIRouter(tags=["catalog"])


def _course_dict(course: Course, enrollment: Enrollment | None = None) -> dict:
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "category": course.category,
        "subject": course.subject,
        "difficulty": course.difficulty,
        "thumbnailUrl": course.thumbnail_url,
        "level": course.difficulty,
        "rating": course.rating,
        "reviewCount": course.review_count,
        "studentsCount": course.students_count,
        "durationHours": course.duration_hours,
        "price": course.price,
        "isFeatured": course.is_featured,
        "isPopular": course.is_popular,
        "isTrending": course.is_trending,
        "objectives": json.loads(course.objectives or "[]"),
        "tags": json.loads(course.tags or "[]"),
        "summary": course.summary,
        "status": course.status,
        "progress": enrollment.progress if enrollment else 0,
        "enrollmentStatus": enrollment.status if enrollment else "notEnrolled",
        "lessonsCount": sum(len(m.lessons) for m in course.modules),
    }


@router.get("/courses")
def list_courses(
    q: str | None = None,
    category: str | None = None,
    level: str | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(current_user),
):
    query = db.query(Course).filter(Course.status == "published")
    if category and category.lower() != "all":
        query = query.filter(Course.category == category)
    if level:
        query = query.filter(Course.difficulty == level)
    if q:
        like = f"%{q}%"
        query = query.filter(Course.title.ilike(like) | Course.tags.ilike(like))
    courses = query.all()
    if sort == "popular":
        courses.sort(key=lambda c: c.students_count, reverse=True)
    elif sort == "new":
        courses.sort(key=lambda c: c.created_at, reverse=True)
    enrollments = {
        e.course_id: e
        for e in db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
    }
    return [_course_dict(c, enrollments.get(c.id)) for c in courses]


@router.get("/courses/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db), user: User = Depends(current_user)):
    course = db.get(Course, course_id)
    if course is None:
        raise HTTPException(404, "Course not found")
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == user.id, Enrollment.course_id == course_id)
        .first()
    )
    return _course_dict(course, enrollment)


@router.get("/courses/{course_id}/modules")
def modules(course_id: str, db: Session = Depends(get_db), user: User = Depends(current_user)):
    course = db.get(Course, course_id)
    if course is None:
        raise HTTPException(404, "Course not found")
    progress = {
        p.lesson_id: p
        for p in db.query(LessonProgress).filter(LessonProgress.user_id == user.id).all()
    }
    payload = []
    for module in course.modules:
        lessons = []
        for lesson in module.lessons:
            p = progress.get(lesson.id)
            lessons.append(
                {
                    "id": lesson.id,
                    "moduleId": module.id,
                    "title": lesson.title,
                    "description": lesson.description,
                    "type": lesson.type,
                    "durationMinutes": lesson.duration_minutes,
                    "contentUrl": lesson.content_url,
                    "contentHtml": lesson.content,
                    "order": lesson.order,
                    "isCompleted": bool(p and p.completed),
                    "isBookmarked": bool(p and p.bookmarked),
                }
            )
        payload.append(
            {
                "id": module.id,
                "title": module.title,
                "description": module.description,
                "order": module.order,
                "lessons": lessons,
            }
        )
    return payload


@router.post("/courses/{course_id}/enroll")
def enroll(course_id: str, db: Session = Depends(get_db), user: User = Depends(current_user)):
    course = db.get(Course, course_id)
    if course is None:
        raise HTTPException(404, "Course not found")
    existing = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == user.id, Enrollment.course_id == course_id)
        .first()
    )
    if existing:
        return _course_dict(course, existing)
    enrollment = Enrollment(user_id=user.id, course_id=course_id, status="enrolled", progress=0.01)
    db.add(enrollment)
    course.students_count += 1
    db.commit()
    return _course_dict(course, enrollment)


@router.post("/progress/lessons/{lesson_id}")
def save_progress(
    lesson_id: str,
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(current_user),
):
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(404, "Lesson not found")
    row = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == user.id, LessonProgress.lesson_id == lesson_id)
        .first()
    )
    if row is None:
        row = LessonProgress(user_id=user.id, lesson_id=lesson_id)
        db.add(row)
    if "completed" in body:
        row.completed = bool(body["completed"])
    if "bookmarked" in body:
        row.bookmarked = bool(body["bookmarked"])
    if "notes" in body:
        row.notes = str(body["notes"])[:4000]
    if "position_seconds" in body:
        row.position_seconds = int(body["position_seconds"])
    db.commit()
    return {"ok": True}


@router.get("/search")
def search(q: str = Query(min_length=1), db: Session = Depends(get_db), user: User = Depends(current_user)):
    like = f"%{q}%"
    courses = db.query(Course).filter(Course.title.ilike(like)).limit(10).all()
    lessons = db.query(Lesson).filter(Lesson.title.ilike(like)).limit(10).all()
    return {
        "courses": [{"id": c.id, "title": c.title, "type": "course"} for c in courses],
        "lessons": [{"id": l.id, "title": l.title, "type": "lesson", "moduleId": l.module_id} for l in lessons],
        "semanticNote": "Keyword search now. Semantic ranking plugs into AIService.search later.",
    }


@router.get("/home")
def home(db: Session = Depends(get_db), user: User = Depends(current_user)):
    from app.ai.service import AIService

    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
    current = next((e for e in enrollments if e.status == "enrolled"), None)
    course = db.get(Course, current.course_id) if current else None
    svc = AIService()
    recs = svc.recommend(
        {
            "current_course": course.title if course else None,
            "progress": current.progress if current else 0,
            "weak_topics": ["User research"],
        }
    )
    plan = svc.daily_plan(
        {
            "course_title": course.title if course else "your path",
            "weak_topics": ["User research"],
        }
    )
    return {
        "greeting": _greeting(user.name),
        "user": {"name": user.name, "streakDays": user.streak_days, "skillLevel": user.skill_level},
        "continueCourse": {
            "id": course.id,
            "title": course.title,
            "progress": current.progress,
            "lastLessonId": current.last_lesson_id,
        }
        if course and current
        else None,
        "todayGoal": plan,
        "recommendations": recs,
        "upcomingAssessment": {"title": "User Research check", "courseId": "c_ux"} if course else None,
        "weakTopic": "User research",
        "certificatesCount": 1 if any(e.status == "completed" for e in enrollments) else 0,
    }


def _greeting(name: str) -> str:
    hour = __import__("datetime").datetime.now().hour
    part = "morning" if hour < 12 else "afternoon" if hour < 17 else "evening"
    first = name.split(" ")[0]
    return f"Good {part}, {first}"
