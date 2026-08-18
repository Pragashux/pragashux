# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project overview

**Vibrant LMS** is an enterprise-grade Learning Management System for iOS, Android, and web preview, built with Flutter. The app runs in **demo mode** by default with mock repositories and offline data — no Firebase credentials are required for local development.

## Cursor Cloud specific instructions

### Repository state

- **Stack:** Flutter 3.x (stable), Dart 3.x
- **Primary target:** Mobile (iOS/Android); web is used for Cloud Agent preview
- **Demo mode:** `configureDependencies(demoMode: true)` in `main.dart`

### Available VM tooling

The Cloud Agent environment includes:

| Tool | Location / version |
|------|-------------------|
| Flutter SDK | `/opt/flutter/bin` (stable channel) |
| Chrome | Pre-installed for web preview and computer-use testing |
| Java (OpenJDK) | 21.x (Android toolchain not configured in cloud) |

### Services

| Service | Required? | How to run |
|---------|-----------|------------|
| Flutter web dev server | For UI preview | `flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8080` |

The environment `start` script launches the web dev server automatically on port **8080**.

### Install

```bash
.cursor/scripts/cloud-agent-install.sh
# or: flutter pub get
```

### Lint / test / build

```bash
export PATH="/opt/flutter/bin:$PATH"
flutter analyze
flutter test
flutter build web
```

### Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Student | `student@vibrant.lms` | `Vibrant@123` |
| Admin | `admin@vibrant.lms` | `Vibrant@123` |

OTP demo code: any 6 digits (e.g. `123456`).

### Local preview (web)

```bash
export PATH="/opt/flutter/bin:$PATH"
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8080
```

Open `http://127.0.0.1:8080/` in Chrome to interact with the app.

### Firebase (production only)

Firebase is optional. Demo mode skips Firebase initialization. To enable production Firebase:

1. Run `flutterfire configure`
2. Set `demoMode: false` in `main.dart`
3. Replace mock repository registrations in `lib/core/di/injection.dart`
