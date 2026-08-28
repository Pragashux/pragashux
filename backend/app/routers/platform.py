from __future__ import annotations

import json
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.ai.base import MockPaymentProvider
from app.ai.service import AIService
from app.config import get_settings
from app.db import get_db
from app.deps import current_user, require_admin
from app.models import (
    AuditLog,
    Certificate,
    Course,
    Enrollment,
    Module,
    Notification,
    NotificationPreference,
    Payment,
    Plan,
    Subscription,
    User,
)
from app.security import hash_password

router = APIRouter(tags=["platform"])


@router.get("/plans")
def plans(db: Session = Depends(get_db)):
    rows = db.query(Plan).filter(Plan.active.is_(True)).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "priceMonthly": p.price_monthly,
            "description": p.description,
            "features": json.loads(p.features or "[]"),
            "aiQuestionsLimit": p.ai_questions_limit,
            "certificates": p.certificates,
            "advancedAnalytics": p.advanced_analytics,
        }
        for p in rows
    ]


@router.get("/subscriptions/me")
def my_sub(db: Session = Depends(get_db), user: User = Depends(current_user)):
    sub = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id)
        .order_by(Subscription.created_at.desc())
        .first()
    )
    if sub is None:
        raise HTTPException(404, "No subscription")
    plan = db.get(Plan, sub.plan_id)
    return {
        "id": sub.id,
        "planId": sub.plan_id,
        "planName": plan.name if plan else sub.plan_id,
        "status": sub.status,
        "renewsAt": sub.renews_at.isoformat() if sub.renews_at else None,
        "trialEndsAt": sub.trial_ends_at.isoformat() if sub.trial_ends_at else None,
        "priceMonthly": plan.price_monthly if plan else 0,
    }


@router.post("/subscriptions/change")
def change_plan(body: dict, db: Session = Depends(get_db), user: User = Depends(current_user)):
    plan = db.get(Plan, body.get("plan_id"))
    if plan is None:
        raise HTTPException(404, "Plan not found")
    sub = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    if sub is None:
        sub = Subscription(user_id=user.id, plan_id=plan.id, status="active")
        db.add(sub)
    else:
        sub.plan_id = plan.id
        sub.status = "active"
        sub.renews_at = datetime.utcnow() + timedelta(days=30)
    db.commit()
    return {"ok": True, "planId": plan.id}


@router.post("/subscriptions/cancel")
def cancel(db: Session = Depends(get_db), user: User = Depends(current_user)):
    sub = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    if sub:
        sub.status = "cancelled"
        db.commit()
    return {"ok": True}


@router.get("/payments/history")
def payments(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = db.query(Payment).filter(Payment.user_id == user.id).all()
    if not rows:
        return [
            {
                "id": "pay_demo",
                "amount": 19,
                "currency": "USD",
                "status": "succeeded",
                "provider": "mock",
                "createdAt": datetime.utcnow().isoformat(),
            }
        ]
    return [
        {
            "id": p.id,
            "amount": p.amount,
            "currency": p.currency,
            "status": p.status,
            "provider": p.provider,
            "createdAt": p.created_at.isoformat(),
        }
        for p in rows
    ]


@router.post("/payments/intents")
def payment_intent(body: dict, user: User = Depends(current_user), db: Session = Depends(get_db)):
    plan = db.get(Plan, body.get("plan_id"))
    if plan is None:
        raise HTTPException(404, "Plan not found")
    # Production: branch on get_settings().payment_provider == "stripe"
    provider = MockPaymentProvider()
    return provider.create_intent(user.id, plan.id, plan.price_monthly, "USD")


@router.get("/notifications")
def notifications(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [
        {
            "id": n.id,
            "title": n.title,
            "body": n.body,
            "type": n.type,
            "isRead": n.is_read,
            "actionRoute": n.action_route,
            "createdAt": n.created_at.isoformat(),
        }
        for n in rows
    ]


@router.patch("/notifications/{nid}/read")
def read_notification(nid: str, db: Session = Depends(get_db), user: User = Depends(current_user)):
    row = db.get(Notification, nid)
    if row and row.user_id == user.id:
        row.is_read = True
        db.commit()
    return {"ok": True}


@router.get("/notifications/preferences")
def get_prefs(db: Session = Depends(get_db), user: User = Depends(current_user)):
    prefs = db.get(NotificationPreference, user.id)
    if prefs is None:
        prefs = NotificationPreference(user_id=user.id)
        db.add(prefs)
        db.commit()
    return {
        "lessonReminders": prefs.lesson_reminders,
        "assessments": prefs.assessments,
        "subscription": prefs.subscription,
        "aiRecommendations": prefs.ai_recommendations,
        "streak": prefs.streak,
    }


@router.patch("/notifications/preferences")
def set_prefs(body: dict, db: Session = Depends(get_db), user: User = Depends(current_user)):
    prefs = db.get(NotificationPreference, user.id) or NotificationPreference(user_id=user.id)
    db.add(prefs)
    mapping = {
        "lessonReminders": "lesson_reminders",
        "assessments": "assessments",
        "subscription": "subscription",
        "aiRecommendations": "ai_recommendations",
        "streak": "streak",
    }
    for key, attr in mapping.items():
        if key in body:
            setattr(prefs, attr, bool(body[key]))
    db.commit()
    return {"ok": True}


@router.get("/certificates")
def certificates(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = db.query(Certificate).filter(Certificate.user_id == user.id).all()
    return [
        {
            "id": c.id,
            "courseId": c.course_id,
            "courseTitle": c.course_title,
            "studentName": c.student_name,
            "issuedAt": c.issued_at.isoformat(),
            "credentialId": c.credential_id,
        }
        for c in rows
    ]


@router.post("/certificates/issue")
def issue_cert(body: dict, db: Session = Depends(get_db), user: User = Depends(current_user)):
    course_id = body.get("course_id")
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == user.id, Enrollment.course_id == course_id)
        .first()
    )
    if enrollment is None or enrollment.progress < 1:
        raise HTTPException(400, "Course is not complete")
    existing = (
        db.query(Certificate)
        .filter(Certificate.user_id == user.id, Certificate.course_id == course_id)
        .first()
    )
    if existing:
        return {"id": existing.id, "credentialId": existing.credential_id}
    course = db.get(Course, course_id)
    cert = Certificate(
        user_id=user.id,
        course_id=course_id,
        student_name=user.name,
        course_title=course.title if course else course_id,
        credential_id=f"ALOS-{course_id.upper()}-{user.id[:4]}",
    )
    db.add(cert)
    db.commit()
    return {"id": cert.id, "credentialId": cert.credential_id}


@router.get("/admin/dashboard")
def admin_dashboard(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    students = db.query(User).filter(User.role == "student").all()
    enrollments = db.query(Enrollment).all()
    svc = AIService()
    insights = [
        {
            "title": "Completion dipped on Module 4",
            "detail": "Course completion dropped 18% where research methods get dense.",
            "recommendation": "Simplify Module 4 and add practical examples.",
        },
        {
            "title": "At-risk learners",
            "detail": f"{sum(1 for s in students if s.streak_days < 3)} students show dropout risk signals.",
            "recommendation": "Trigger AI intervention plans this week.",
        },
    ]
    return {
        "totalStudents": len(students),
        "activeStudents": sum(1 for s in students if s.streak_days > 0),
        "newRegistrations": 48,
        "activeSubscriptions": db.query(Subscription).filter(Subscription.status == "active").count(),
        "revenue": 184250,
        "courseEnrollments": len(enrollments),
        "courseCompletion": 0.68,
        "studentEngagement": 0.74,
        "aiUsage": 12840,
        "atRiskStudents": sum(1 for s in students if s.streak_days < 3),
        "popularCourses": ["UX Design for Beginners", "Python for Curious Minds"],
        "failedAssessments": 126,
        "insights": insights,
        "students": [
            {
                **{
                    "id": s.id,
                    "name": s.name,
                    "email": s.email,
                    "streakDays": s.streak_days,
                    "skillLevel": s.skill_level,
                    "status": s.status,
                },
                "analysis": svc.analyze_student(
                    {
                        "engagement": 0.3 if s.streak_days < 3 else 0.8,
                        "fail_rate": 0.4 if s.streak_days < 3 else 0.1,
                        "days_inactive": 10 if s.streak_days == 0 else 0,
                        "behind": s.streak_days < 3,
                        "skill_level": s.skill_level,
                    }
                ),
            }
            for s in students
        ],
    }


@router.get("/admin/students")
def admin_students(
    q: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = db.query(User).filter(User.role == "student", User.status != "deleted")
    if q:
        like = f"%{q}%"
        query = query.filter(User.name.ilike(like) | User.email.ilike(like))
    return [
        {
            "id": s.id,
            "displayName": s.name,
            "email": s.email,
            "streakDays": s.streak_days,
            "totalXp": s.total_xp,
            "skillLevel": s.skill_level,
            "status": s.status,
            "photoUrl": s.photo_url,
        }
        for s in query.all()
    ]


@router.post("/admin/students")
def create_student(body: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    email = (body.get("email") or "").lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(409, "Email exists")
    user = User(
        email=email,
        name=body.get("name") or "Student",
        password_hash=hash_password(body.get("password") or "LearnOS@123"),
        role="student",
    )
    db.add(user)
    db.add(AuditLog(actor_id=admin.id, action="create_student", resource=email))
    db.commit()
    return {"id": user.id}


@router.patch("/admin/students/{sid}")
def edit_student(sid: str, body: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.get(User, sid)
    if user is None:
        raise HTTPException(404, "Not found")
    if "name" in body:
        user.name = body["name"]
    if "status" in body:
        user.status = body["status"]
    db.add(AuditLog(actor_id=admin.id, action="edit_student", resource=sid, detail=json.dumps(body)))
    db.commit()
    return {"ok": True}


@router.post("/admin/students/{sid}/suspend")
def suspend(sid: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.get(User, sid)
    if user is None:
        raise HTTPException(404, "Not found")
    user.status = "suspended"
    db.add(AuditLog(actor_id=admin.id, action="suspend_student", resource=sid))
    db.commit()
    return {"ok": True}


@router.delete("/admin/students/{sid}")
def delete_student(sid: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.get(User, sid)
    if user is None:
        raise HTTPException(404, "Not found")
    user.status = "deleted"
    db.add(AuditLog(actor_id=admin.id, action="delete_student", resource=sid))
    db.commit()
    return {"ok": True}


@router.post("/admin/courses/{cid}/publish")
def publish_course(cid: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    course = db.get(Course, cid)
    if course is None:
        raise HTTPException(404, "Not found")
    course.status = "published"
    db.add(AuditLog(actor_id=admin.id, action="publish_course", resource=cid))
    db.commit()
    return {"ok": True}


@router.post("/admin/courses")
def save_generated_course(body: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    course = Course(
        title=body.get("title") or "Untitled",
        description=body.get("description") or "",
        subject=body.get("subject") or "General",
        category=body.get("subject") or "General",
        difficulty=body.get("difficulty") or "beginner",
        audience=body.get("audience") or "",
        status="draft",
        generated_by_ai=True,
        summary=body.get("summary") or "",
        objectives=json.dumps(body.get("objectives") or []),
        tags=json.dumps(body.get("tags") or []),
        faqs=json.dumps(body.get("faqs") or []),
        thumbnail_url="https://picsum.photos/seed/aigen/800/450",
    )
    db.add(course)
    db.flush()
    for mi, module in enumerate(body.get("modules") or [], start=1):
        m = Module(
            course_id=course.id,
            title=module.get("title") or f"Module {mi}",
            description=module.get("description") or "",
            order=module.get("order") or mi,
        )
        db.add(m)
    db.add(AuditLog(actor_id=admin.id, action="create_course_draft", resource=course.id))
    db.commit()
    return {"id": course.id, "status": course.status}


@router.get("/admin/audit")
def audit(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    rows = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(50).all()
    return [
        {
            "id": a.id,
            "actorId": a.actor_id,
            "action": a.action,
            "resource": a.resource,
            "detail": a.detail,
            "createdAt": a.created_at.isoformat(),
        }
        for a in rows
    ]


@router.get("/admin/analytics")
def analytics(admin: User = Depends(require_admin)):
    return {
        "dailyActive": [420, 460, 390, 510, 488, 530, 512],
        "completions": [12, 18, 15, 22, 19, 24, 21],
        "aiUsage": [800, 920, 880, 1100, 990, 1200, 1180],
        "conversion": 0.18,
        "churn": 0.06,
        "retention": 0.81,
    }
