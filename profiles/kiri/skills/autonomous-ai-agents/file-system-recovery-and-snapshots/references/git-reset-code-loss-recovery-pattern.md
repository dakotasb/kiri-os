# Git Reset Code Loss Recovery Pattern

## The Problem

**Pattern:** Developer runs `git reset --hard <commit>` or `git reset --hard HEAD~N` to "fix" a messy history - but permanently discards working code with features, fixes, and implementations.

**The Damage:**
- Code existed in git history
- Code was working and deployed/tested
- Reset wipes the commit entirely (no reflog if --hard)
- Subsequent commits on "clean" base overwrite the reset commits
- **Result:** Working Terminal, Metrics, and APIs vanish

## Detection Pattern

**When user says:**
- "features were lost"
- "it was there before"
- "this used to work"
- "we had [X] before the reset"

**Check for reset evidence:**
```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard
git reflog
```

### Reflog Pattern - Smoking Gun

```
a8c6dd8 HEAD@{0}: reset: moving to a8c6dd8           ← Current position
30abb0b HEAD@{1}: reset: moving to 30abb0b           ← RESET TARGET (lost!)
a8c6dd8 HEAD@{2}: reset: moving to a8c6dd8           ← Previous reset
30abb0b HEAD@{3}: reset: moving to 30abb0b           ← Was here
30abb0b HEAD@{4}: commit: [fix] PHASE 5: Complete   ← Working version!
```

**Interpretation:**
- `30abb0b` was a working commit with features
- Someone reset to `a8c6dd8` (baseline)
- Those features are now orphaned in reflog
- If garbage-collected, they're **gone forever**

## Recovery Steps

### Step 1: Identify the Lost Commit

```bash
# Look for commits that existed between baseline and now
git reflog | grep -E "commit:|reset: moving"

# Check each "lost" commit for features
git show COMMIT:src/components/dashboard/SystemMetrics.tsx 2>/dev/null && echo "HAS SystemMetrics!"
git show COMMIT:src/app/api/system/metrics/route.ts 2>/dev/null && echo "HAS metrics API!"
git show COMMIT:src/components/terminal/Terminal.tsx 2>/dev/null && echo "HAS Terminal!"
```

### Step 2: Diff to See What Was Lost

```bash
# Compare lost commit vs baseline
git diff COMMIT..BASELINE --name-only | grep -E "(terminal|metrics|Terminal|Metrics)"

# View the actual changes
git diff COMMIT..BASELINE -- src/components/dashboard/SystemMetrics.tsx
```

### Step 3: Recovery Options

| State | Recovery Method |
|-------|-----------------|
| Commit in reflog, not garbage-collected | `git checkout COMMIT` or git worktree |
| Commit garbage-collected, snapshot exists | Use snapshot (see file-system-recovery-and-snapshots) |
| Only .next build artifacts exist | Reverse engineer from compiled chunks |
| All sources lost | Rewrite features from scratch |

### Step 4: Test Recovery to New Directory (CRITICAL)

**Never recover to current working directory - verify first:**

```bash
# Create isolated test environment
git worktree add ../dashboard-test-COMMITHASH COMMIT

# Or extract via archive
mkdir -p ../dashboard-test-COMMIT
git archive COMMIT | tar -x -C ../dashboard-test-COMMIT

# Start server on NEW port
npm install
npx next dev -p 3002

# Verify features
curl http://localhost:3002 | grep -E "(Terminal|terminal|metrics|Metrics)"
```

### Step 5: Merge Recovery to Current

Once verified working:

```bash
# Cherry-pick specific files from lost commit
git checkout COMMIT -- src/components/dashboard/SystemMetrics.tsx
git checkout COMMIT -- src/app/api/system/metrics/
git checkout COMMIT -- src/stores/metrics-store.ts

# Or cherry-pick entire commit (if base is same)
git cherry-pick COMMIT

# Test on main port
curl http://localhost:3001
```

## Prevention

### Never Use

```bash
git reset --hard COMMIT    # Discards working code forever
git reset --hard HEAD~5    # Nukes last 5 commits
```

### Use Instead

```bash
git reset --soft COMMIT    # Keep changes staged
git reset COMMIT           # Keep changes unstaged
git rebase -i HEAD~5       # Clean history, apply commits on top
git stash                  # Shelve changes temporarily
```

### Pre-Reset Safety

```bash
# Before ANY destructive git operation:
git branch backup-before-reset
git tag backup-$(date +%Y%m%d-%H%M%S)

# Then it's safe to reset - you can recover from backup branch
```

## Session Case Study: 2026-05-17

**What happened:**
- Dashboard had working Terminal and Metrics (commit `30abb0b`)
- Orchestration project hit issues
- Someone ran `git reset --hard a8c6dd8` to "clean slate"
- `30abb0b` was discarded
- We only had `dashboard-pre-color-update` snapshot (pre-commit baseline)
- Working features: **LOST**

**Discovery:**
```bash
git reflog | head -20
# Showed: 30abb0b ← a8c6dd8 ← 30abb0b pattern

git diff 30abb0b..a8c6dd8 --name-only
# Showed: SystemMetrics.tsx, metrics routes, stores deleted
```

**Recovery attempt:**
```bash
git worktree add ../dashboard-v6-test 30abb0b
# Started on port 3002 to verify before merging
```

**Lesson:** Reflog is your friend. Check it before assuming features "never existed."

## Signal Phrases

User describes scenario matching this pattern:
- "it was there before these changes were ITERATIONS not implementations" ← Features existed
- "the only snapshot was BEFORE that was implemented" ← Snapshot predates features
- "[X] is now LOST" ← Strong reset indicator
- Features missing but "should have been built" ← Check reflog

## Reference Commands

```bash
# View specific file from any commit
git show COMMIT:path/to/file

# Extract commit to directory
git archive COMMIT | tar -x -C /target/dir

# Create worktree (isolated checkout)
git worktree add ../test-dir COMMIT

# See what commits exist on all refs
git log --all --oneline --graph -30

# Find dangling commits (not on any branch)
git fsck --lost-found --dangling
```

---

**When in doubt:** Check reflog. The code may still be there, just not on the current branch.