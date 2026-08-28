# Play Store release audit — AI LearnOS

Date: 2026-08-28  
Scope: Flutter Android client (`android/`) + FastAPI backend. This is a **submission-readiness** audit, not Google Play approval.

## Critical issues (fixed in this change)

| Issue | Risk | Fix |
|---|---|---|
| Release signed with debug keys | Play rejects / insecure | Release signing via gitignored `keystore.properties` |
| Application ID `com.vibrant.vibrant_lms` | Wrong brand; unpublished so change is safe | `com.ailearnos.app` |
| App label “Vibrant LMS” | Store mismatch | `AI LearnOS` |
| `configureDependencies(demoMode: true)` in `main` | Production mock login | `AppConfig.demoMode` (default **false** in release) |
| Demo email/password on login UI | Policy / security | Shown only in `kDebugMode` |
| Mock subscription success in all builds | Play Billing policy | `PlayBillingService` fails closed in release |
| No account deletion | Play account deletion requirement | Settings → Delete account + `DELETE /v1/auth/me` |
| Cleartext `http://127.0.0.1` as default API | Security | HTTPS production default; cleartext only in debug manifest |
| No R8 | Larger/unobfuscated release | minify + shrink + targeted keep rules |
| Generic Flutter splash/icon branding | Store quality | Adaptive icon + branded splash |

## Security

- JWT and LLM keys are **not** in the Android tree. AI calls are designed to go through the backend `AIService`.
- Tokens use `flutter_secure_storage` (EncryptedSharedPreferences on Android).
- `allowBackup=false`, HTTPS-only network security config in release.
- Passwords are not stored on device. Server hashes passwords (PBKDF2).
- Logcat logging is disabled in release (`Logger` level off / guarded).

## Build

- AGP **8.11.1**, Gradle **8.14.3**, Kotlin **2.2.20**, compile/target SDK **36**, min SDK **24**.
- Version `1.0.0` (`versionCode` 1) from `pubspec.yaml`.

## Play policy risks (owner must finish)

1. **Host a production API** at `https://api.ailearnos.app` (or pass `--dart-define=API_BASE_URL=...`). Release auth is remote and will fail without it.
2. **Google Play Billing products** must be created in Play Console and `PlayBillingService` wired to `in_app_purchase` / Play Billing Library. Until then, Android digital purchases fail closed (no fake success).
3. **Privacy policy URL** must be publicly hosted; Play Console requires a live URL.
4. **Upload key**: replace the local upload keystore with the key you enroll in Play App Signing. Do not lose it.
5. **Content rating** questionnaire in Play Console (education; not designed for children under 13).
6. **Firebase/FCM** is optional; not configured. Notification permission is declared; in-app preferences exist.

## Mock data remaining

Course catalog, lessons, and AI tutor **content** still use in-app repositories so learning UI works offline. That is curriculum cache, not a fake payment. **Authentication and Play purchases do not succeed via mocks in release.**
