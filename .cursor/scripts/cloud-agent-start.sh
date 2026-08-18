#!/usr/bin/env bash
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-/opt/android-sdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export PATH="/opt/flutter/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:${PATH:-}"

AVD_NAME="${ANDROID_AVD_NAME:-vibrant_lms_api30}"
EMULATOR_LOG="${EMULATOR_LOG:-/tmp/android-emulator.log}"
BOOT_TIMEOUT_SECONDS="${BOOT_TIMEOUT_SECONDS:-300}"

# Ensure KVM is usable for x86_64 emulator acceleration in Cloud Agent VMs.
if [[ -e /dev/kvm ]] && ! [[ -r /dev/kvm && -w /dev/kvm ]]; then
  sudo groupadd -r kvm 2>/dev/null || true
  sudo gpasswd -a "$(whoami)" kvm 2>/dev/null || true
  sudo chmod 666 /dev/kvm 2>/dev/null || true
fi

adb start-server >/dev/null 2>&1 || true

is_emulator_ready() {
  adb devices 2>/dev/null | awk 'NR>1 && $1 ~ /^emulator-/ && $2 == "device" { found=1 } END { exit(found ? 0 : 1) }'
}

is_android_fully_booted() {
  local boot pkg
  boot=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)
  pkg=$(adb shell pm path android 2>/dev/null | head -1 || true)
  [[ "$boot" == "1" && -n "$pkg" ]]
}

if is_emulator_ready; then
  echo "Android emulator already connected."
  exit 0
fi

# Clean up stale offline emulator entries before launching a new instance.
if adb devices 2>/dev/null | awk 'NR>1 && $1 ~ /^emulator-/ { found=1 } END { exit(found ? 0 : 1) }'; then
  while read -r pid _; do
    [[ -n "$pid" ]] && kill -9 "$pid" 2>/dev/null || true
  done < <(pgrep -f "qemu-system-x86_64.*${AVD_NAME}" || true)
  adb kill-server >/dev/null 2>&1 || true
  adb start-server >/dev/null 2>&1 || true
  sleep 2
fi

if ! pgrep -f "qemu-system-x86_64.*${AVD_NAME}" >/dev/null 2>&1; then
  echo "Starting Android emulator (${AVD_NAME})..."
  nohup emulator -avd "$AVD_NAME" \
    -no-window \
    -no-audio \
    -no-boot-anim \
    -gpu off \
    -accel off \
    -no-snapshot-save \
    -no-snapshot-load \
    -partition-size 4096 \
    -memory 2048 \
    >"$EMULATOR_LOG" 2>&1 &
fi

echo "Waiting up to ${BOOT_TIMEOUT_SECONDS}s for emulator to boot..."
end=$((SECONDS + BOOT_TIMEOUT_SECONDS))
while (( SECONDS < end )); do
  if is_emulator_ready && is_android_fully_booted; then
    echo "Android emulator ready."
    exit 0
  fi
  sleep 5
done

echo "Emulator not ready yet; APK builds still work. See $EMULATOR_LOG" >&2
echo "Run: flutter build apk --debug  OR  flutter run -d android (once emulator is online)" >&2
exit 0
