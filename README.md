# AI LearnOS

AI-first Learning Management System. The Android client is Flutter (Material 3) hosted in a Kotlin `MainActivity`. Intelligence, keys, and payments live on the FastAPI backend.

> Student subscribes → AI understands the student → AI teaches the journey → AI generates materials → AI evaluates → AI adapts → AI helps admins run the platform.

## Demo credentials

| Role    | Email                     | Password     |
|---------|---------------------------|--------------|
| Student | `student@ailearnos.app`   | `LearnOS@123` |
| Admin   | `admin@ailearnos.app`     | `LearnOS@123` |

## Architecture

See `docs/ARCHITECTURE.md` and `docs/API.md`.

```
Android app  →  REST + JWT  →  FastAPI  →  AIService  →  MockLLM or OpenAI-compatible provider
```

LLM API keys never ship in the Android app.

## Mobile (Flutter / Android)

```bash
export PATH="/opt/flutter/bin:$PATH"
flutter pub get
flutter test
flutter analyze
flutter run
```

## Backend

```bash
cd backend
python3 -m pip install -r requirements.txt
cp .env.example .env   # set JWT_SECRET; add LLM_API_KEY only on the server
python3 -m pytest
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health: `GET http://127.0.0.1:8000/health`

When `LLM_PROVIDER=mock` (default), the tutor and course generator use a deterministic engine. Set `LLM_PROVIDER=openai` and `LLM_API_KEY` to switch providers without changing the Android client.

Payments use `MockPaymentProvider`. A Stripe implementation plugs into the same `PaymentProvider` interface.

## Feature map

Student: auth, onboarding, home, catalog, course player, AI tutor, study mode, daily plan, assessments, assignments, subscriptions, certificates, notifications, profile.

Admin: dashboard KPIs, student directory with at-risk flags, AI course generator (review before publish), analytics, admin assistant (destructive actions require confirmation).
