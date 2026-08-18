# Vibrant LMS

Enterprise-grade Learning Management System for **iOS** and **Android**, built with Flutter.

## Highlights

- **Student Portal** — dashboard, catalog, learning player, assessments, certificates, notifications, profile & analytics
- **Admin Portal** — KPIs, course management, student directory, engagement analytics
- **Clean Architecture** — features → domain / data / presentation, repository pattern, `get_it` DI
- **State** — `flutter_bloc` + secure session storage
- **Navigation** — `go_router` with role-based redirects
- **Design** — Material 3, design tokens, light/dark themes, responsive phone & tablet shells
- **Firebase-ready** — Auth, Firestore, Storage, FCM facades (demo mode runs offline with mocks)
- **REST-ready** — `Dio` `ApiClient` with bearer token interceptor

## Demo credentials

| Role    | Email                 | Password     |
|---------|-----------------------|--------------|
| Student | `student@vibrant.lms` | `Vibrant@123` |
| Admin   | `admin@vibrant.lms`   | `Vibrant@123` |

OTP demo code: any 6 digits (e.g. `123456`).

## Project structure

```
lib/
├── core/           # constants, DI, errors, network, usecases
├── shared/         # entities, reusable widgets
├── features/       # auth, dashboard, courses, lessons, assessments,
│                   # certificates, analytics, notifications, profile, admin
├── services/       # secure storage, Firebase, FCM
├── routes/         # GoRouter + role guards
└── themes/         # tokens, typography, Material 3 themes
```

## Getting started

```bash
flutter pub get
flutter run
```

### Enable Firebase (production)

1. Create a Firebase project and enable Auth, Firestore, Storage, FCM.
2. Run `flutterfire configure`.
3. Set `demoMode: false` in `main.dart` → `configureDependencies`.
4. Replace `Mock*Repository` registrations in `lib/core/di/injection.dart` with Firebase implementations.

### Platforms

- Android (`minSdk` per Flutter defaults)
- iOS 13+

## Design system

- Primary teal `#0F766E`, coral accent `#EA580C`
- Display: **Outfit** · Body: **Plus Jakarta Sans** (`google_fonts`)
- Tokens: `lib/themes/app_tokens.dart`
- Themes: `lib/themes/app_theme.dart`

## Scripts

```bash
flutter analyze
flutter test
flutter build apk
flutter build ios
```
