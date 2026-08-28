from __future__ import annotations

import json
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.service import AIService
from app.db import get_db
from app.deps import current_user, require_admin
from app.models import (
    AIInteraction,
    Assessment,
    AssessmentSubmission,
    Assignment,
    AssignmentSubmission,
    PendingAdminAction,
    Question,
    User,
)

router = APIRouter(tags=["ai"])
svc = AIService()


def _ctx(user: User, body: dict) -> dict:
    return {
        "course_title": body.get("course_title") or body.get("courseTitle"),
        "lesson_title": body.get("lesson_title") or body.get("lessonTitle"),
        "skill_level": user.skill_level,
        "weak_topics": body.get("weak_topics") or ["User research"],
        "progress": body.get("progress"),
    }


@router.post("/ai/chat")
def chat(body: dict, db: Session = Depends(get_db), user: User = Depends(current_user)):
    message = (body.get("message") or "").strip()
    if not message:
        raise HTTPException(400, "message required")
    reply = svc.chat(message, _ctx(user, body))
    db.add(AIInteraction(user_id=user.id, role="user", message=message, course_id=body.get("course_id"), lesson_id=body.get("lesson_id")))
    db.add(AIInteraction(user_id=user.id, role="assistant", message=reply, course_id=body.get("course_id"), lesson_id=body.get("lesson_id")))
    db.commit()
    return {"reply": reply}


@router.post("/ai/explain")
def explain(body: dict, user: User = Depends(current_user)):
    text = body.get("text") or ""
    mode = body.get("mode") or "simpler"
    return {"reply": svc.explain(text, mode, _ctx(user, body))}


@router.post("/ai/quiz")
def quiz(body: dict, user: User = Depends(current_user)):
    topic = body.get("topic") or "this lesson"
    return svc.generate_quiz(topic, int(body.get("count") or 5), body.get("difficulty") or "beginner")


@router.post("/ai/flashcards")
def flashcards(body: dict, user: User = Depends(current_user)):
    return {"cards": svc.flashcards(body.get("topic") or "UX", int(body.get("count") or 6))}


@router.post("/ai/daily-plan")
def daily_plan(body: dict, user: User = Depends(current_user)):
    return svc.daily_plan(_ctx(user, body))


@router.post("/ai/study-session")
def study_session(body: dict, user: User = Depends(current_user)):
    return svc.study_session(
        body.get("topic") or "UX Research",
        int(body.get("minutes") or 20),
        body.get("difficulty") or "beginner",
    )


@router.post("/ai/recommendations")
def recommendations(body: dict, user: User = Depends(current_user)):
    return {"items": svc.recommend(_ctx(user, body))}


@router.get("/assessments")
def list_assessments(course_id: str, db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = db.query(Assessment).filter(Assessment.course_id == course_id).all()
    out = []
    for a in rows:
        questions = db.query(Question).filter(Question.assessment_id == a.id).all()
        out.append(
            {
                "id": a.id,
                "courseId": a.course_id,
                "title": a.title,
                "type": a.type,
                "durationMinutes": a.duration_minutes,
                "passingScore": a.passing_score,
                "description": a.description,
                "questions": [
                    {
                        "id": q.id,
                        "prompt": q.prompt,
                        "qtype": q.qtype,
                        "options": json.loads(q.options or "[]"),
                        "explanation": q.explanation,
                        "topic": q.topic,
                    }
                    for q in questions
                ],
            }
        )
    return out


@router.post("/assessments/{assessment_id}/submit")
def submit_assessment(
    assessment_id: str,
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(current_user),
):
    assessment = db.get(Assessment, assessment_id)
    if assessment is None:
        raise HTTPException(404, "Assessment not found")
    questions = db.query(Question).filter(Question.assessment_id == assessment_id).all()
    qdicts = [
        {
            "id": q.id,
            "correct_index": q.correct_index,
            "explanation": q.explanation,
            "topic": q.topic,
        }
        for q in questions
    ]
    answers = body.get("answers") or {}
    result = svc.evaluate_answers(qdicts, answers)
    db.add(
        AssessmentSubmission(
            assessment_id=assessment_id,
            user_id=user.id,
            answers=json.dumps(answers),
            score=result["percentage"],
            passed=result["passed"],
            weak_topics=json.dumps(result["weak_topics"]),
            feedback=result["next_action"],
        )
    )
    db.commit()
    return result


@router.get("/assignments")
def assignments(course_id: str, db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = db.query(Assignment).filter(Assignment.course_id == course_id).all()
    return [
        {
            "id": a.id,
            "courseId": a.course_id,
            "title": a.title,
            "brief": a.brief,
            "criteria": json.loads(a.criteria or "[]"),
        }
        for a in rows
    ]


@router.post("/assignments/{assignment_id}/submit")
def submit_assignment(
    assignment_id: str,
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(current_user),
):
    assignment = db.get(Assignment, assignment_id)
    if assignment is None:
        raise HTTPException(404, "Assignment not found")
    text = body.get("text") or ""
    evaluation = svc.evaluate_assignment(assignment.brief, json.loads(assignment.criteria or "[]"), text)
    row = AssignmentSubmission(
        assignment_id=assignment_id,
        user_id=user.id,
        text=text,
        file_url=body.get("file_url"),
        file_type=body.get("file_type") or "text",
        ai_score=evaluation["score"],
        ai_feedback=evaluation["feedback"],
        strengths=json.dumps(evaluation["strengths"]),
        weaknesses=json.dumps(evaluation["weaknesses"]),
        status="pending_admin_review",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id, **evaluation, "status": row.status}


@router.post("/admin/ai/generate-course")
def generate_course(body: dict, admin: User = Depends(require_admin)):
    draft = svc.generate_course(
        body.get("name") or "Untitled course",
        body.get("description") or "",
        body.get("subject") or "General",
        body.get("difficulty") or "beginner",
        body.get("audience") or "Learners",
        body.get("objectives") or [],
    )
    return draft


@router.post("/admin/ai/assist")
def admin_assist(body: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    prompt = (body.get("prompt") or "").strip()
    snapshot = {
        "inactive_students": db.query(User).filter(User.role == "student", User.streak_days == 0).count(),
        "active_students": db.query(User).filter(User.role == "student", User.streak_days > 0).count(),
        "struggling": [u.name for u in db.query(User).filter(User.role == "student", User.streak_days < 3).all()],
        "best_course": "UX Design for Beginners is performing best (completion 78%).",
        "revenue": 184250,
        "ai_sessions": db.query(AIInteraction).count(),
    }
    result = svc.admin_assist(prompt, snapshot)
    if result.get("requires_confirmation"):
        action = PendingAdminAction(
            admin_id=admin.id,
            kind=result.get("kind") or "unknown",
            payload=json.dumps(result.get("payload") or {}),
        )
        db.add(action)
        db.commit()
        result["action_id"] = action.id
    return result


@router.post("/admin/ai/confirm-action")
def confirm_action(body: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    action_id = body.get("action_id")
    action = db.get(PendingAdminAction, action_id)
    if action is None:
        raise HTTPException(404, "Action not found")
    if not body.get("confirmed"):
        action.status = "cancelled"
        db.commit()
        return {"status": "cancelled"}
    action.status = "confirmed"
    db.commit()
    return {"status": "confirmed", "note": "Destructive action recorded. Production hook executes here."}
