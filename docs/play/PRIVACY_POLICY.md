# Privacy policy — AI LearnOS

**Last updated:** 28 August 2026  
**Status:** Product draft. Host this policy at a public HTTPS URL and have counsel review it before Play submission. Do not invent a legal entity here.

Contact for privacy requests: `[privacy contact email — add before launch]`

## Who we are

AI LearnOS is an AI-assisted learning application for Android. This policy describes data the **current app and backend** handle.

## Information we collect

| Data | Collected | Shared with third parties from the device | Purpose | Required |
|---|---|---|---|---|
| Name | Yes (account) | No | Identify the learner | Required to register |
| Email | Yes | No | Sign-in, account recovery | Required |
| Password | Yes (sent to server; stored hashed; not stored on device) | No | Authentication | Required |
| Profile (bio, interests, goals, skill level) | Yes if you set them | No | Personalization | Optional |
| Course enrollments and lesson progress | Yes | No | Teaching and analytics | Required to learn |
| Assessment answers and scores | Yes | No | Evaluation and recommendations | When you take a quiz |
| Assignment submissions | Yes | No | Feedback | When you submit |
| AI tutor messages | Yes (via our backend) | Backend may send prompts to a configured LLM provider | Tutoring | When you use AI Tutor |
| Subscription / Play purchase tokens | When Play Billing is enabled | Google Play processes payment | Entitlements | If you subscribe |
| Notification preference flags | Yes | No | Reminders you opt into | Optional |
| Device/app diagnostics | Only if you later enable crash reporting | Crash vendor if configured | Stability | Optional; **not enabled in this source drop** |

We do **not** currently collect: contacts, SMS, call logs, precise location, microphone, camera, or photos (no image picker permission is declared).

## AI processing

The Android app does not embed LLM API keys. Prompts go to the LearnOS API. If the operator configures an LLM provider, prompts and necessary learning context may be sent to that provider under the operator’s agreement with them.

AI output can be wrong. It is an educational assistant, not a human teacher.

## Sharing

We do not sell personal information. Sharing is limited to:

- **Google Play** for distribution and, when enabled, billing
- **LLM provider** configured on the server (if any)
- **Infrastructure** (hosting) the operator uses for the API

## Retention and deletion

Account data is kept while the account is active. Use **Settings → Delete account** to request deletion. The backend marks the user deleted and clears the local session. Backups may lag until rotated. You can also email the privacy contact.

## Security

Transport uses HTTPS in release builds. Access tokens are stored in Android encrypted storage. Passwords are hashed on the server.

## Children

AI LearnOS is **not directed at children under 13**. We do not knowingly collect data from children. If you believe a child registered, contact us to delete the account.

## Your rights

Depending on your region you may request access, correction, or deletion. Use in-app deletion or the privacy contact.

## Changes

We will update this document and the hosted URL when practices change.
