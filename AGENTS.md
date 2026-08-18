# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project overview

**Vibrant LMS** is an enterprise-grade Learning Management System for **iOS** and **Android**, built with Flutter. The app runs in **demo mode** by default with mock repositories and offline data — no Firebase credentials are required for local development.

## Cursor Cloud specific instructions

### Repository state

- **Stack:** Flutter 3.x (stable), Dart 3.x, Android SDK 36
- **Primary targets:** Android and iOS mobile apps
- **Cloud preview:** Android emulator (API 30) + `flutter build apk`
- **Demo mode:** `configureDependencies(demoMode: true)` in `main.dart`

### Available VM tooling

| Tool | Location / version |
|------|-------------------|
| Flutter SDK | `/opt/flutter/bin` (stable channel) |
| Android SDK | `/opt/android-sdk` (platform 36, build-tools 36.0.0) |
| Android emulator | AVD `vibrant_lms_api30` (Pixel 5, API 30) |
| Java (OpenJDK) | 21.x |
| Chrome | Pre-installed (optional web preview) |

**iOS builds are not supported in Cloud Agents** (requires macOS/Xcode). Use Android for cloud-based mobile development and testing.

### Services

| Service | Required? | How to run |
|---------|-----------|------------|
| Android emulator | For `flutter run` on device | `.cursor/scripts/cloud-agent-start.sh` |
| Flutter app on emulator | After emulator boots | `flutter run -d android` |

The environment `start` script launches the Android emulator. First boot can take up to 5 minutes with software acceleration; if the emulator is not online yet, use `flutter build apk` to validate Android builds.

### Install

```bash
.cursor/scripts/cloud-agent-install.sh
```

### Lint / test / build (mobile)

```bash
export PATH="/opt/flutter/bin:$PATH"
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk

flutter analyze
flutter test
flutter build apk --debug
flutter build apk --release
```

### Run on Android emulator

```bash
export PATH="/opt/flutter/bin:/opt/android-sdk/platform-tools:/opt/android-sdk/emulator:$PATH"
export ANDROID_HOME=/opt/android-sdk

# Start emulator (if not already running; first boot ~5 min with software acceleration)
.cursor/scripts/cloud-agent-start.sh

# Build and install the x86_64 split APK (required for emulator deploy)
.cursor/scripts/install-on-emulator.sh

# Or deploy directly with Flutter once the emulator is fully booted
flutter run -d android
```

**Note:** The emulator uses software rendering (`-accel off`) in Cloud Agents. Use `flutter build apk --split-per-abi` and install `app-x86_64-debug.apk` for reliable emulator deployment. iOS builds require macOS/Xcode and are not available in Cloud Agents.

### Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Student | `student@vibrant.lms` | `Vibrant@123` |
| Admin | `admin@vibrant.lms` | `Vibrant@123` |

OTP demo code: any 6 digits (e.g. `123456`).

### Optional web preview

Web is supported but secondary to mobile targets:

```bash
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8080
```

### Firebase (production only)

Firebase is optional. Demo mode skips Firebase initialization. To enable production Firebase:

1. Run `flutterfire configure`
2. Set `demoMode: false` in `main.dart`
3. Replace mock repository registrations in `lib/core/di/injection.dart`
