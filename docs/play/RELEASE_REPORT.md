# Release report — AI LearnOS Android

This document describes a **submission-ready** Android App Bundle. It does **not** mean Google Play has reviewed or approved the app.

## Identity

| Field | Value |
|---|---|
| Application ID | `com.ailearnos.app` |
| App name | AI LearnOS |
| versionName | `1.0.0` |
| versionCode | `1` |
| minSdk | 24 |
| targetSdk / compileSdk | 36 |
| AGP | 8.11.1 |
| Gradle | 8.14.3 |
| Kotlin | 2.2.20 |
| Flutter | 3.47.0 |
| Dart | 3.13.0 |

## Artifact

| Field | Value |
|---|---|
| Build date (UTC) | 2026-08-28 |
| Variant | `release` (`bundleRelease`) |
| R8 | Enabled (`isMinifyEnabled` + `isShrinkResources`) |
| Debuggable | false |
| DEMO_MODE | false (compile-time) |
| API_BASE_URL | `https://api.ailearnos.app/v1` |
| AAB path | `build/app/outputs/bundle/release/app-release.aab` |
| AAB SHA-256 | `6d7697ca3d65927d4d99db23954fcf484c5e17d136e8e5c3e760bf8a27ed8396` |
| Signing | Local **upload** keystore via gitignored `android/keystore.properties` |

The cloud-agent keystore is **environment-only**. Enroll **your** upload key in Play App Signing before a public listing. Do not commit `.jks` or passwords.

## Tests completed (this environment)

- `flutter analyze` — no issues
- `flutter test` — 9 passed
- `flutter build appbundle --release` — succeeded

Not run here: device/emulator install of the release APK, live production API login, Play Billing SKU purchase.

## Known issues / operator work

1. Host the production FastAPI (or change `API_BASE_URL`). Release auth is remote and will fail until that host exists.
2. Course catalog / AI tutor **content** still uses in-app repositories (curriculum cache). Purchases do not.
3. `PlayBillingService` fails closed until Play Console products + `in_app_purchase` are wired.
4. Privacy policy and terms must be **public HTTPS URLs** for Play Console.
5. Capture phone screenshots from a real device (see `PLAY_STORE_SCREENSHOTS.md`).
6. Complete Data safety, IARC rating, and reviewer credentials in Console.
7. Flutter 3.47 warns that Gradle 9.1 / AGP 9.0.1 / Kotlin 2.3.20 will be required soon; this build uses the current **minimum** versions Flutter 3.47 accepts.

## Google Play submission checklist

See `GOOGLE_PLAY_RELEASE_CHECKLIST.md`.
