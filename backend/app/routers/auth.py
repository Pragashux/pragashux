import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import current_user
from app.models import NotificationPreference, Subscription, User
from app.security import create_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = "student"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str


class ForgotIn(BaseModel):
    email: EmailStr


def _user_out(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "displayName": user.name,
        "role": user.role,
        "photoUrl": user.photo_url,
        "bio": user.bio,
        "streakDays": user.streak_days,
        "totalXp": user.total_xp,
        "skillLevel": user.skill_level,
        "interests": json.loads(user.interests or "[]"),
        "goals": json.loads(user.goals or "[]"),
        "onboardingComplete": user.onboarding_complete,
        "preferredFormat": user.preferred_format,
        "status": user.status,
    }


def _tokens(user: User) -> dict:
    return {
        "access_token": create_token(user.id, user.role),
        "refresh_token": create_token(user.id, user.role, refresh=True),
        "token_type": "bearer",
        "user": _user_out(user),
    }


@router.post("/register")
def register(body: RegisterIn, db: Session = Depends(get_db)):
    if body.role not in {"student", "admin"}:
        raise HTTPException(400, "Invalid role")
    if db.query(User).filter(User.email == body.email.lower()).first():
        raise HTTPException(409, "Email already registered")
    user = User(
        email=body.email.lower(),
        name=body.name.strip(),
        password_hash=hash_password(body.password),
        role="student" if body.role != "admin" else "student",
    )
    db.add(user)
    db.flush()
    db.add(Subscription(user_id=user.id, plan_id="free", status="active"))
    db.add(NotificationPreference(user_id=user.id))
    db.commit()
    db.refresh(user)
    return _tokens(user)


@router.post("/login")
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower()).first()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    if user.status == "suspended":
        raise HTTPException(403, "Account suspended")
    return _tokens(user)


@router.post("/refresh")
def refresh(body: RefreshIn, db: Session = Depends(get_db)):
    from app.security import decode_token

    try:
        payload = decode_token(body.refresh_token)
    except ValueError as exc:
        raise HTTPException(401, "Invalid token") from exc
    if payload.get("type") != "refresh":
        raise HTTPException(401, "Invalid token type")
    user = db.get(User, payload["sub"])
    if user is None:
        raise HTTPException(401, "User not found")
    return _tokens(user)


@router.post("/forgot-password")
def forgot(body: ForgotIn, db: Session = Depends(get_db)):
    # Always succeed to avoid account enumeration.
    _ = db.query(User).filter(User.email == body.email.lower()).first()
    return {"ok": True}


@router.get("/me")
def me(user: User = Depends(current_user)):
    return _user_out(user)


@router.patch("/me")
def update_me(body: dict, user: User = Depends(current_user), db: Session = Depends(get_db)):
    if "name" in body:
        user.name = str(body["name"])[:80]
    if "bio" in body:
        user.bio = str(body["bio"])[:500]
    if "interests" in body:
        user.interests = json.dumps(body["interests"])
    if "goals" in body:
        user.goals = json.dumps(body["goals"])
    if "skillLevel" in body:
        user.skill_level = str(body["skillLevel"])
    if "preferredFormat" in body:
        user.preferred_format = str(body["preferredFormat"])
    if "onboardingComplete" in body:
        user.onboarding_complete = bool(body["onboardingComplete"])
    db.commit()
    db.refresh(user)
    return _user_out(user)


@router.delete("/me")
def delete_me(user: User = Depends(current_user), db: Session = Depends(get_db)):
    user.status = "deleted"
    user.email = f"deleted-{user.id}@invalid.local"
    db.commit()
    return {"ok": True}
