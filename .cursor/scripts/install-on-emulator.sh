#!/usr/bin/env bash
# Install the Vibrant LMS debug APK on the running Android emulator (x86_64).
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-/opt/android-sdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export PATH="/opt/flutter/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:${PATH:-}"

cd /workspace

APK="build/app/outputs/flutter-apk/app-x86_64-debug.apk"
if [[ ! -f "$APK" ]]; then
  flutter build apk --debug --split-per-abi
fi

echo "Waiting for package manager..."
for _ in $(seq 1 60); do
  if adb shell pm list packages 2>/dev/null | grep -q "package:"; then
    break
  fi
  sleep 5
done

adb install -t -g -r "$APK"
echo "Installed $APK"
