#!/usr/bin/env bash
set -euo pipefail

export PATH="/opt/flutter/bin:${PATH:-}"

cd /workspace
flutter pub get
