# Session 2026-05-17: Git Reset Destroys Working Code (Not External Overwrite)

## Disaster Recovery Analysis

**Initial Assumption:** External process overwrote the working dashboard with Terminal/Metrics.

**Actual Root Cause:** `git reset --hard` destroyed working commits that contained Terminal/Metrics implementation.

## The Evidence

### Git Reflog Shows the Destruction

```bash
git reflog | head -20

30abb0b HEAD@{1}: commit: [fix] PHASE 5: Complete - Build passes
a8c6dd8 HEAD@{0}: reset: moving to a8c6dd8  ← DESTRUCTION HAPPENED HERE
```

**Commit `30abb0b`** (May 16 14:39) had working code:
- `src/components/dashboard/SystemMetrics.tsx` ✅
- `src/app/api/system/metrics/route.ts` ✅  
- `src/store/metrics-slice.ts` ✅
- `src/stores/metrics-store.ts` ✅

**Commit `a8c6dd8`** (May 16 00:31) was reset target:
- Baseline import from staging
- NO Terminal/Metrics implementation
- Pre-orchestration state

### The Diff Shows What Was Lost

```bash
git diff 30abb0b..a8c6dd8 --name-only | grep -E "(terminal|metrics)"

src/app/api/system/metrics/route.ts          ← DELETED
src/components/dashboard/SystemMetrics.tsx     ← DELETED
src/store/metrics-slice.ts                     ← DELETED
src/stores/metrics-store.ts                    ← DELETED
```

**Lesson:** The orchestration project DID build Terminal/Metrics. They were destroyed by resetting to baseline instead of fixing forward.

## Why Snapshot Recovery Failed

### Available Snapshots

| Snapshot | Date | Contents | Terminal/Metrics? |
|----------|------|----------|-------------------|
| `~/snapshots/dashboard-pre-color-update/` | May 16 @ 16:47 | Pre-orchestration baseline | ❌ NO |
| `dashboard-backup-current-20260517-205102` | May 17 @ 20:51 | Broken orchestration state | ❌ NO (placeholders only) |
| Commit `30abb0b` | May 16 @ 14:39 | Working orchestration build | ✅ YES (but reset away) |

**The Problem:** We restored to `dashboard-pre-color-update` which was the **import baseline**, not the **post-implementation** state.

### Why `30abb0b` Wasn't in Snapshots

- Git commits ≠ Snapshots
- The working build existed in git only
- No external snapshot was taken before the reset
- The reset destroyed the only copy of working Terminal/Metrics

## Recovery Options

### Option 1: Restore from Git (Possible!)

```bash
git checkout 30abb0b
# or
git reset --hard 30abb0b  # Restore the destroyed work
```

**Status:** Possible via git reflog

### Option 2: Rebuild from Scratch

**Required:** Re-implement Terminal and Metrics components

### Option 3: Accept Current State

**Current:** Basic AgentCards dashboard, no Terminal/Metrics

## The Real Lesson

**"Overwrite" Can Mean:**

| Type | Mechanism | Detection | Recovery |
|------|-----------|-----------|----------|
| **External overwrite** | `rsync`, `cp -r`, `mv` | Check file timestamps, missing files | Restore from snapshots/backups |
| **Git reset destruction** | `git reset --hard <old-commit>` | Check `git reflog` | `git reset --hard <lost-commit>` |
| **Git filter-repo rewrite** | History rewrite | `/tmp/*-git-backup-*` created | Restore from temp backup |
| **Manual deletion** | `rm -rf` | Check Trash, `.Trash-*` | File recovery tools, backups |

**This Session:** Git reset destruction, not external overwrite.

## Prevention Pattern

**Before resetting:**
```bash
# 1. Create snapshot of current state (even if "broken")
tar -czf ~/snapshots/dashboard-working-$(date +%Y%m%d-%H%M%S).tar.gz src/ components/

# 2. Verify snapshot has what you need
tar -tzf ~/snapshots/dashboard-working-*.tar.gz | grep -E "(terminal|metrics)"

# 3. Only then reset
git reset --hard <baseline>
```

## Forensic Commands

```bash
# Check if code was destroyed by reset
git reflog | grep "reset:"

# Find what was lost between commits
git diff <working-commit>..<reset-target> --name-only

# Check if lost commit still exists (not garbage collected)
git fsck --lost-found 2>/dev/null | head -10

# Recover detached commit
git checkout <sha>
git checkout -b recovered-<feature>
```

## Summary

**The working Terminal and Metrics were:**
1. ✅ Built successfully during orchestration (commit `30abb0b`)
2. ❌ Destroyed by `git reset --hard a8c6dd8` (back to baseline)
3. ❌ Not captured in external snapshots
4. ✅ Recoverable via `git reflog` if needed

**The "overwrite" was a git reset, not an external file operation.**
