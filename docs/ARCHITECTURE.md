# AI LearnOS — Architecture

**AI LearnOS** is an AI-first Learning Management System. The Android client never talks to an LLM provider directly. All intelligence flows through a backend `AIService` so keys, rate limits, and audit logs stay server-side.

```
Android / iOS (Flutter, Material 3)
        │  REST + JWT
        ▼
   LearnOS API (FastAPI)
        │
        ├── Auth, RBAC, validation, rate limits, audit
        ├── Domain repositories (SQLAlchemy)
        └── AIService (provider-agnostic)
                ├── MockLLMProvider   (demo / CI)
                └── HttpLLMProvider   (OpenAI-compatible; env-configured)
```

## Why Flutter on Android

The product’s primary surface is Android. The repo already ships a Kotlin `MainActivity` host (`android/`). Flutter is the UI/domain layer so the same clean architecture can later target iOS and web without duplicating the LMS. Jetpack Compose can be introduced as an additional native module later; it is **not** required to ship Android.

## Layers (mobile)

| Layer | Responsibility |
|---|---|
| `features/*/presentation` | Compose-style Flutter UI, BLoC |
| `features/*/domain` | Repository interfaces, use cases |
| `features/*/data` | Mock + REST implementations |
| `core/network` | Dio + JWT interceptor |
| `core/ai` | Client facade over `/v1/ai/*` (no secrets) |
| `services` | Secure storage, FCM facade, offline cache |

## Feature modules

`auth` · `onboarding` · `home` · `courses` · `learning` · `ai` · `assessment` · `assignment` · `subscription` · `profile` · `notifications` · `certificates` · `search` · `admin` · `analytics`

## Roles

- **Student** — learn, subscribe, talk to the tutor, take assessments
- **Admin** — platform KPIs, students, courses, AI generation (approval required for publish/delete)

## AI contracts

`AIService` methods: `chat`, `generate_course`, `generate_quiz`, `summarize`, `evaluate_answers`, `evaluate_assignment`, `recommend`, `analyze_student`, `admin_assist`, `study_session`, `daily_plan`.

Production wiring: set `LLM_PROVIDER=openai` and `LLM_API_KEY` on the **server**. The Android app only stores JWT tokens.

## Payments

`PaymentProvider` is an interface. `MockPaymentProvider` records intents. Stripe (or similar) plugs in without UI changes.

## Offline

Lessons, course outlines, and progress are cached. Progress queues locally and syncs when `ApiClient` succeeds.
