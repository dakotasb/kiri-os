# Session: 3001 vs 3003 Directory Confusion

**Date:** 2026-05-18/19  
**Problem:** Applied Phase 2 fixes to `dashboard-iteration-v1/` but user expected them in `phase3_build/dashboard/` for port 3003

## The Confusion

| Location | Port | Status | Treatment |
|----------|------|--------|-----------|
| `~/command_center/dashboard-iteration-v1/` | 3001 (dev:wsl: 172 IP) | Running, had Phase 3 work | **Touched (wrong)** |
| `~/command_center/kirimvp_orchestration/phase3_build/dashboard/` | Should be 3003 | Needed Phase 2 fixes | **Missed (wrong)** |

User statement: "3001 works and we shouldn't touch it at all"

## What User Actually Wanted

Fixes applied to `dashboard-iteration-v1/` needed to be **copied** (not moved) to `phase3_build/dashboard/` so:
- 3001 baseline remains untouched
- 3003 gets the fixes for validation

## Migration Pattern Used

```bash
# 1. Ensure target directories exist
mkdir -p ~/kirimvp_orchestration/phase3_build/dashboard/src/styles

# 2. Copy specific files (not directories)
cp ~/dashboard-iteration-v1/src/styles/design-tokens.css \
   ~/kirimvp_orchestration/phase3_build/dashboard/src/styles/

cp ~/dashboard-iteration-v1/src/hooks/useMetrics.ts \
   ~/kirimvp_orchestration/phase3_build/dashboard/src/hooks/

cp ~/dashboard-iteration-v1/src/lib/agent-api.ts \
   ~/kirimvp_orchestration/phase3_build/dashboard/src/lib/

# 3. Delete removed files
rm ~/kirimvp_orchestration/phase3_build/dashboard/src/components/dashboard/SystemMetrics.tsx

# 4. Build and start on NEW port
cd ~/kirimvp_orchestration/phase3_build/dashboard
npm run build
PORT=3003 npm run dev
```

## Critical Validation Steps

After migration, verify:
1. Original port (3001) still responds - **baseline preserved**
2. New port (3003) responds - **migration succeeded**
3. API returns expected data format
4. Files expected deleted are gone
5. Files expected created exist

## User Correction Signals

| User Says | Meaning |
|-----------|---------|
| "3001 works and we shouldn't touch it" | Hands off baseline, use different port |
| "this was happening on 3003?" | Agent is working on wrong directory/port |
| "3001 and 3003 are now the same" | Baseline was accidentally modified |
| "I don't care" (after violation) | Proceed with workaround, learn for next time |

## Key Rule

When user says "leave X alone", it means:
- X remains running (port X)
- X's directory is NOT modified
- Changes happen to Y (port Y)
- Validate Y works before declaring victory
