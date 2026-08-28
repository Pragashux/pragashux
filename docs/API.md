# AI LearnOS API contracts

Base URL: `http://127.0.0.1:8000/v1` (dev)  
Auth: `Authorization: Bearer <access_token>`  
Content-Type: `application/json`

Environment (server only): `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE_MINUTES`, `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `PAYMENT_PROVIDER`, `STORAGE_DIR`, `FCM_SERVER_KEY`.

## Auth

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register` | `{name,email,password,role?}` |
| POST | `/auth/login` | `{email,password}` → `{access_token,refresh_token,user}` |
| POST | `/auth/refresh` | `{refresh_token}` |
| POST | `/auth/forgot-password` | `{email}` |
| GET | `/auth/me` | current user |

## Catalog & learning

| Method | Path |
|---|---|
| GET | `/courses?q=&category=&level=&sort=` |
| GET | `/courses/{id}` |
| GET | `/courses/{id}/modules` |
| POST | `/courses/{id}/enroll` |
| POST | `/progress/lessons/{id}` | `{completed,position_seconds}` |
| GET | `/search?q=` |

## AI (always backend-proxied)

| Method | Path | Body |
|---|---|---|
| POST | `/ai/chat` | `{message,course_id?,lesson_id?,history?}` |
| POST | `/ai/explain` | `{text,mode}` (`simpler`,`example`,`summary`,`from_start`,`real_world`) |
| POST | `/ai/quiz` | `{topic,count,difficulty}` |
| POST | `/ai/flashcards` | `{topic,count}` |
| POST | `/ai/daily-plan` | optional `{date}` |
| POST | `/ai/study-session` | `{topic,minutes,difficulty}` |
| POST | `/ai/recommendations` | — |
| POST | `/admin/ai/generate-course` | `{name,description,subject,difficulty,audience,objectives}` |
| POST | `/admin/ai/assist` | `{prompt}` |
| POST | `/admin/ai/confirm-action` | `{action_id,confirmed}` |

Destructive admin AI actions return `{requires_confirmation:true, action_id}` until confirmed.

## Assessments & assignments

| Method | Path |
|---|---|
| GET | `/assessments?course_id=` |
| POST | `/assessments/{id}/submit` | `{answers:[{question_id,value}]}` |
| GET | `/assignments?course_id=` |
| POST | `/assignments/{id}/submit` | multipart or `{text,file_url}` |
| POST | `/admin/assignments/{id}/finalize` | `{submission_id,score,feedback}` |

## Subscriptions

| Method | Path |
|---|---|
| GET | `/plans` |
| GET | `/subscriptions/me` |
| POST | `/subscriptions/change` | `{plan_id}` |
| POST | `/subscriptions/cancel` |
| GET | `/payments/history` |
| POST | `/payments/intents` | `{plan_id}` → mock client secret |

## Admin

| Method | Path |
|---|---|
| GET | `/admin/dashboard` |
| GET/POST/PATCH/DELETE | `/admin/students` |
| POST | `/admin/students/{id}/suspend` |
| GET/PATCH | `/admin/courses` |
| POST | `/admin/courses/{id}/publish` |
| GET | `/admin/analytics` |
| GET | `/admin/audit` |

## Notifications & certificates

| Method | Path |
|---|---|
| GET | `/notifications` |
| PATCH | `/notifications/{id}/read` |
| PATCH | `/notifications/preferences` |
| GET | `/certificates` |
| POST | `/certificates/issue` | `{course_id}` (eligibility checks) |
