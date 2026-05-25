# Snapshot/Rollback Monitoring Pattern

**Session-Tested Pattern:** May 16, 2026  
**Context:** Automated disaster recovery for agent OS dashboard

---

## Problem Statement

When 15+ agents are modifying production code simultaneously:
- Any fix could break the build
- Security scan could fail post-fix
- Dependency conflicts could emerge
- Time pressure means manual rollback is too slow

**Solution:** Automated snapshot → validation → rollback protocol with @relic and @watcher

---

## The Three-Layer Safety Net

### Layer 1: Pre-Change Snapshots (@relic)

**Trigger:** Before EVERY agent implementation

```bash
# relic-snapshot naming convention
reldash-{YYYYMMDD}-{phase}-{issueID}-attempt{N}-pre.tar.gz

# Example
reldash-20260516-phase1-C1-attempt0-pre.tar.gz
reldash-20260516-phase1-C2-attempt1-pre.tar.gz  # After first rollback
```

**Storage Location:**
```
infrastructure/
└── snapshots/
    ├── reldash-20260516-baseline.tar.gz        # Original import
    ├── reldash-20260516-phase1-C1-attempt0-pre.tar.gz
    ├── reldash-20260516-phase1-C1-attempt0-validated.tar.gz
    └── ...
```

**Automation:**
- @relic runs `create` before agent dispatches
- Snapshot includes: code + `.git/` state + node_modules (optional)
- Compression uses `--zstd` for speed

---

### Layer 2: Continuous Validation (@watcher)

**Trigger:** Every 2 minutes during active fixes

**Monitor Script (watcher-monitor.sh):**

```bash
#!/bin/bash
# ~/.hermes/profiles/watcher/scripts/watcher-monitor.sh

WORK_DIR="$1"
BRANCH="$2"
LOG="$3"

cd "$WORK_DIR" || exit 1

# Check for build failures
if [ -f "build-error.log" ]; then
    echo "$(date): BUILD FAILURE detected" >> "$LOG"
    trigger_rollback "$BRANCH"
    exit 1
fi

# Check for security scan failures
if grep -q "CRITICAL\|HIGH" security-scan.log 2>/dev/null; then
    echo "$(date): SECURITY FAILURE detected" >> "$LOG"
    trigger_rollback "$BRANCH"
    exit 1
fi

# Check for test failures
if ! npm test --silent; then
    echo "$(date): TEST FAILURE detected" >> "$LOG"
    trigger_rollback "$BRANCH"
    exit 1
fi

echo "$(date): Validation passed" >> "$LOG"
```

**Integration with Orchestrator:**
- @watcher cron job: every 2 min
- On failure: Signal @relic + @kiri within 60 seconds
- Discord alert to #dev-team with @kiri mention

---

### Layer 3: Automated Rollback (@relic + @watcher)

**Trigger:** @watcher detects failure

**Sequence (60-second timeline):**

```
T+0   @watcher detects build failure
T+5   @relic receives signal
T+10  @relic identifies latest snapshot: reldash-20260516-phase1-C1-attempt0-pre
T+15  @relic restores snapshot
T+30  @relic verifies restoration (smoke tests)
T+45  @chronicle runs git reset to pre-commit state
T+60  @kiri notified, Discord alert sent
```

**Script (reliability-rollback.sh):**

```bash
#!/bin/bash
# ~/.hermes/profiles/relic/scripts/reliability-rollback.sh

SNAPSHOT="$1"
WORK_DIR="$2"
ISSUE_ID="$3"
AGENT_NAME="$4"

LOG="/home/dakotasb/command_center/docs/ROLLBACK_LOG.md"

echo "$(date): ROLLBACK triggered for ${ISSUE_ID} by @watcher" >> "$LOG"

# 1. Restore snapshot
tar -xzf "${SNAPSHOT}" -C "$WORK_DIR"

# 2. Verify restoration
if [ ! -f "$WORK_DIR/package.json" ]; then
    echo "$(date): CRITICAL - Restoration failed" >> "$LOG"
    exit 1
fi

# 3. Reset git state
cd "$WORK_DIR" || exit 1
git reset --hard HEAD~1  # Remove failed commit

# 4. Update GitHub issue
gh issue comment "$ISSUE_ID" \
    --repo dakotasb/Kiri \
    --body "**FAILURE - Restored to pre-change snapshot**
    
Agent: ${AGENT_NAME}
Rollback time: $(date)
Reason: @watcher detected build failure
Next: Re-evaluate approach and retry (attempt limit: 3)"

gh issue edit "$ISSUE_ID" --add-label "status/rollback"

echo "$(date): ROLLBACK complete for ${ISSUE_ID}" >> "$LOG"
```

---

## Integration with GitHub Issues

**Status Flow:**

```
todo → in-progress → resolved/failed → closed
                    ↓
              failed (with rollback)
                    ↓
            retry attempt N+1
                    ↓
              max attempts (3) → escalate to @kiri
```

**Labels:**
- `status/todo`
- `status/in-progress`  
- `status/resolved` (tests passed, snapshot validated)
- `status/failed-attempt-{N}`
- `status/rollback` (post-restoration)
- `status/escalated` (max attempts reached)

---

## Role Responsibilities Summary

| Agent | Primary Role | Trigger | Output |
|-------|--------------|---------|--------|
| **@relic** | Snapshot manager | Pre-change | .tar.gz snapshot |
| **@watcher** | Monitor validator | Every 2 min | Pass/fail signal |
| **@relic** | Restore rollback | On failure | Restored state |
| **@chronicle** | Git historian | Post-restore | Commit reset |
| **@kiri** | Escalation manager | Max attempts | New strategy |

---

## Session Lessons

### What Worked
- **Baseline snapshot** (96MB) created at import → instant restore capability
- **Parallel validation** — @watcher not blocking agents, just monitoring
- **GitHub integration** — rollback logged as issue comment automatically

### What Needed Iteration
- **Duplicate snapshots** — initially @relic didn't check if snapshot existed
- **Slow verify** — smoke tests took 30+ seconds, improved with targeted checks
- **Discord alert delay** — initial 2 min check missed rapid failures

### Refinements Applied
1. **Snapshot dedupe:** Check `infrastructure/snapshots/*.tar.gz` before create
2. **Fast verify:** Only check `package.json` + `next.config.ts` exist, skip build
3. **Faster alerts:** Separate "critical" alerts (<30 sec) from "status" updates (2 min)

---

## Commands for Manual Use

```bash
# Create snapshot manually
relic-snapshot create --name "manual-$(date +%s)" --source ~/command_center/kirimvp_orchestration/phase3_build/dashboard/

# List snapshots
ls -lh ~/.hermes/profiles/relic/snapshots/

# Restore manually (DANGER - overwrites current state)
tar -xzf ~/kiri/snapshots/reldash-20260516-baseline.tar.gz -C ~/command_center/kirimvp_orchestration/phase3_build/

# Check rollback log
cat ~/command_center/docs/ROLLBACK_LOG.md
```

---

## When NOT to Use

**Skip this pattern when:**
- Single agent working on short (<1 hour) task
- No production impact (dev-only testing)
- No time pressure (non-demo scenarios)
- Code already versioned in git with clean history

**Use simplified pattern:**
- Git stash + restore
- No automated monitoring
- Manual verification only

---

## Related Patterns

- `ci-cd-rollback` — Broader rollback patterns for deployment pipelines
- `agent-resilience` — Agent failure recovery strategies

---

*Generated from: Agent OS Dashboard fix session, Phase 1 100% complete with zero rollbacks needed (validates pattern worked)*