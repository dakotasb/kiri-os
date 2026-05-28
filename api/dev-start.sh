#!/usr/bin/env bash
# Run kiri-api in WSL2 for local development.
# Dependencies live in WSL2-native fs to avoid NTFS symlink issues.
#
# Usage (from WSL2):
#   bash /mnt/d/Project\ Alpha/dashboard-v2/api/dev-start.sh

set -euo pipefail

DEPS_DIR="/home/dakotasb/kiri-api-local/node_modules"
API_DIR="$(dirname "$(realpath "$0")")"

if [[ ! -d "$DEPS_DIR" ]]; then
  echo "[kiri-api] Installing deps to $DEPS_DIR..."
  mkdir -p "$(dirname "$DEPS_DIR")"
  cp "$API_DIR/package.json" "$(dirname "$DEPS_DIR")/"
  (cd "$(dirname "$DEPS_DIR")" && npm install)
fi

export NODE_PATH="$DEPS_DIR"
export HERMES_DATA_DIR="${HERMES_DATA_DIR:-/home/dakotasb/.hermes}"
export MEMPALACE_URL="${MEMPALACE_URL:-http://localhost:3100}"
export QDRANT_URL="${QDRANT_URL:-http://localhost:6333}"
export PORT="${PORT:-4000}"

echo "[kiri-api] Starting on :$PORT — data=$HERMES_DATA_DIR"
exec node --watch "$API_DIR/server.js"
