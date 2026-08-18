#!/usr/bin/env bash
# Idempotent Android SDK bootstrap for Cloud Agent mobile development.
set -euo pipefail

ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-/opt/android-sdk}"
CMDLINE_TOOLS_ZIP="${CMDLINE_TOOLS_ZIP:-/tmp/commandlinetools-linux.zip}"
CMDLINE_TOOLS_URL="${CMDLINE_TOOLS_URL:-https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip}"

export ANDROID_HOME="$ANDROID_SDK_ROOT"
export ANDROID_SDK_ROOT
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator:${PATH:-}"

if [[ ! -x "$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]]; then
  echo "Installing Android command-line tools into $ANDROID_SDK_ROOT"
  sudo mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"
  if [[ ! -f "$CMDLINE_TOOLS_ZIP" ]]; then
    curl -fsSL "$CMDLINE_TOOLS_URL" -o "$CMDLINE_TOOLS_ZIP"
  fi
  rm -rf /tmp/android-cmdline-tools
  unzip -q "$CMDLINE_TOOLS_ZIP" -d /tmp/android-cmdline-tools
  sudo rm -rf "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  sudo mv /tmp/android-cmdline-tools/cmdline-tools "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  sudo chown -R "$(whoami):$(whoami)" "$ANDROID_SDK_ROOT"
fi

yes | sdkmanager --licenses >/dev/null || true

sdkmanager --install \
  "platform-tools" \
  "emulator" \
  "platforms;android-36" \
  "build-tools;36.0.0" \
  "system-images;android-34;google_apis;x86_64"

AVD_NAME="${ANDROID_AVD_NAME:-vibrant_lms_api34}"
if ! avdmanager list avd | grep -q "Name: $AVD_NAME"; then
  echo "no" | avdmanager create avd \
    --name "$AVD_NAME" \
    --package "system-images;android-34;google_apis;x86_64" \
    --device "pixel_7" \
    --force
fi

export PATH="/opt/flutter/bin:${PATH:-}"
flutter config --android-sdk "$ANDROID_SDK_ROOT" >/dev/null
yes | flutter doctor --android-licenses >/dev/null || true

# Persist KVM access for emulator acceleration in Cloud Agent VMs.
if [[ -e /dev/kvm ]]; then
  sudo groupadd -r kvm 2>/dev/null || true
  sudo gpasswd -a "$(whoami)" kvm 2>/dev/null || true
  sudo chmod 666 /dev/kvm 2>/dev/null || true
fi

echo "Android SDK ready at $ANDROID_SDK_ROOT"
