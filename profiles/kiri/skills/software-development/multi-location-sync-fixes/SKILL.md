---
name: multi-location-sync-fixes
description: Migrate code changes between project directories when fixes were applied to the wrong location. Ensures working baselines are preserved while validating changes in isolated staging.
version: 1.0.0
tags: [multi-location, migration, validation, baselines, file-sync, port-management]
---

# Multi-Location Fix Migration

## The Problem

You have multiple copies of a project (e.g., `dashboard-iteration-v1/` and `phase3_build/dashboard/`). Fixes were applied to Location A, but Location B is the "canonical" or "production" instance. Changes need to be migrated without disturbing working services.

## When To Use

- Accidentally modified staging instead of production
- Need to validate fixes in isolation before promoting
- Multiple parallel development tracks with different purposes
- User specifies: "Leave X alone" / "Don't touch Y" / "Preserved baseline"

## The Pattern: Validate on Staging, Preserve Baseline

### Step 1: Identify All Locations

```bash
# Discover dashboard locations
find ~/command_center -name "next.config.js" -path "*dashboard*" 2>/dev/null | xargs dirname

# Check which is currently running (if any)
ss -tlnp | grep -E ":300[0-9]"
```

**Identify by convention:**
- **Baseline/Production**: Running service user says "don't touch" (e.g., port 3001)
- **Staging/Development**: Where iteration happens (e.g., port 3003)

### Step 2: Capture Current State

Before any migration, document what exists where:

```bash
echo "=== Location A (Has fixes) ===" 
ls ~/location-a/src/hooks/ | grep -E "use.*\.ts"
ls ~/location-a/src/styles/ | grep -E ".*\.css"
cd ~/location-a && git log --oneline -3

echo "=== Location B (Needs fixes) ==="
ls ~/location-b/src/hooks/ | grep -E "use.*\.ts"
ls ~/location-b/src/styles/ | grep -E ".*\.css"
cd ~/location-b && git log --oneline -3
```

### Step 3: Copy Files (Not Merge)

**Critical:** Copy individual fixed files, not entire directories (to preserve Location B's state).

```bash
# Ensure target directory exists
mkdir -p ~/location-b/src/styles
mkdir -p ~/location-b/src/lib

# Copy specific fixed files
cp ~/location-a/src/styles/design-tokens.css ~/location-b/src/styles/
cp ~/location-a/src/hooks/useMetrics.ts ~/location-b/src/hooks/
cp ~/location-a/src/lib/agent-api.ts ~/location-b/src/lib/
cp ~/location-a/src/app/globals.css ~/location-b/src/app/

# Remove files that should be deleted
rm -f ~/location-b/src/components/dashboard/SystemMetrics.tsx
```

### Step 4: Build and Validate on New Port

```bash
cd ~/location-b

# Clean build
rm -rf .next
npm run build

# Start on NEW port (don't disturb baseline)
PORT=3003 npm run dev &

sleep 10
curl -s localhost:3003 | grep -o "<title>.*</title>"
```

### Step 5: Verify Fixes Are Present

```bash
# API returns real data (not mocks)
curl -s localhost:3003/api/system/metrics | head -20

# Files deleted/created exist as expected
ls ~/location-b/src/styles/design-tokens.css 2>/dev/null && echo "✓ Tokens exist"
ls ~/location-b/src/components/dashboard/SystemMetrics.tsx 2>/dev/null || echo "✓ SystemMetrics deleted"
```

## Safety Rules

| Rule | Why |
|------|-----|
| **Never modify baseline directly** | "3001 works, don't touch it" means hands off |
| **Always use new port for validation** | Parallel instances prevent collision |
| **Verify which directory is canonical** | `pwd` and `git log` before every operation |
| **Copy specific files, not directories** | Prevents wiping Location B's other state |
| **Clean build before starting** | Stale cache from Location A can corrupt Location B |

## Verification Checklist

After migration, verify:
- [ ] Baseline port (3001) still running and untouched
- [ ] Staging port (3003) responds correctly
- [ ] API endpoints return real data, not mocks
- [ ] Files expected to be deleted are gone
- [ ] Files expected to be created exist
- [ ] Build passes without errors

## Session Example

**Scenario:** Phase 2 fixes went to `dashboard-iteration-v1/` but need promotion to `phase3_build/dashboard/` for validation on port 3003.

```bash
# 1. Baseline check (LEAVE ALONE)
ss -tlnp | grep 3001  # Confirm still running, PID unchanged

# 2. Identify what needs migration
cd ~/dashboard-iteration-v1
git diff HEAD~5 --name-only  # Files changed in Phase 2

# 3. Copy to canonical location
mkdir -p ~/phase3_build/dashboard/src/styles
cp src/styles/design-tokens.css ~/phase3_build/dashboard/src/styles/
cp src/hooks/useMetrics.ts ~/phase3_build/dashboard/src/hooks/
cp src/lib/agent-api.ts ~/phase3_build/dashboard/src/lib/
rm ~/phase3_build/dashboard/src/components/dashboard/SystemMetrics.tsx

# 4. Build and validate on 3003
cd ~/phase3_build/dashboard
npm run build
PORT=3003 npm run dev
curl localhost:3003/api/system/metrics  # Real CPU/disk data
```

## Related Skills

- `staging-dev-server-copy` — Creating parallel instances
- `react-dashboard-validation` — Systematic dashboard verification
- `build-artifact-recovery` — If migration corrupts something