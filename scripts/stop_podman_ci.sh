#!/usr/bin/env bash
# Stops the service started by scripts/setup_podman_ci.sh, by its recorded PID.
# Usage: scripts/stop_podman_ci.sh <work-dir>
set -euo pipefail

pid_file="$(realpath -m "${1:?work directory}")/service.pid"
[ -f "$pid_file" ] || exit 0
kill "$(cat "$pid_file")" 2>/dev/null || true
