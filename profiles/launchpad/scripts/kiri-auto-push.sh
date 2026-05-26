#!/usr/bin/env bash
# Kiri Auto Push — runs every 15 min until Phase 1 complete
# Pushes fix/security-critical-issues → origin, retries once, logs result

REPO="/home/dakotasb/kiri"
BRANCH="fix/security-critical-issues"
LOG="$REPO/docs/GIT_PUSH_LOG.md"
MARKER="$REPO/.phase1_complete"

# If Phase 1 is marked complete, self-terminate cron job and exit
if [ -f "$MARKER" ]; then
  TS=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
  echo "| $TS | - | PHASE1_DONE | Marker found; auto-push cron job stopping |" >> "$LOG"
  # Remove this cron job
  hermes cronjob list 2>/dev/null | grep -i 'kiri-auto-push' | awk '{print $1}' | xargs -r hermes cronjob remove 2>/dev/null
  exit 0
fi

cd "$REPO" || exit 1

# Ensure we are on the right branch
CURRENT=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT" != "$BRANCH" ]; then
  TS=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
  echo "| $TS | - | SKIP | Not on branch $BRANCH (currently on $CURRENT) |" >> "$LOG"
  exit 0
fi

# Count commits not yet on origin
COMMIT_COUNT=$(git rev-list --count "$BRANCH" ^origin/$BRANCH 2>/dev/null || echo "0")

PUSH() {
  git push origin "$BRANCH" 2>&1
}

TS=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
OUTPUT=$(PUSH)
EXIT=$?

if [ $EXIT -ne 0 ]; then
  # Retry once
  sleep 5
  OUTPUT2=$(PUSH)
  EXIT2=$?
  if [ $EXIT2 -ne 0 ]; then
    echo "| $TS | $COMMIT_COUNT | ERROR | Push failed twice. Exit $EXIT2: ${OUTPUT2} |" >> "$LOG"
    exit 1
  else
    echo "| $TS | $COMMIT_COUNT | SUCCESS_RETRY | Succeeded on retry |" >> "$LOG"
    exit 0
  fi
else
  echo "| $TS | $COMMIT_COUNT | SUCCESS | $OUTPUT |" >> "$LOG"
  exit 0
fi
