#!/usr/bin/env bash
set -euo pipefail

export PATH="/opt/flutter/bin:${PATH:-}"

cd /workspace
exec flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8080
