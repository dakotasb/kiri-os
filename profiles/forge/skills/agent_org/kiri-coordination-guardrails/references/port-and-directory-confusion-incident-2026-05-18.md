# Port and Directory Confusion Incident - 2026-05-18

## Timeline

| Time | Event |
|------|-------|
| Session start | User asks about validation status for Phase 2 on "orchestration project v2" |
| Throughout | Complete Phase 2 validation and fixes applied to `~/command_center/dashboard-iteration-v1/` |
| Mid-session | User asks "Should we run a build and do human validation before phase 3?" |
| Later | "Dispatch agents to fix build errors" - CSS @layer fixes applied to dashboard-iteration-v1 |
| **Critical moment** | User: "Woah woah woah I thought all this was happening on 3003?" |

## The Problem

**Two directories in same git repo:**
- `~/command_center/dashboard-iteration-v1/` - Where all Phase 2 fixes were applied
- `~/command_center/kirimvp_orchestration/phase3_build/dashboard/` - Where user expected work to be

**Both:**
- Same branch (`main`)
- Same git log (recent commits showed Phase 2 fixes)
- Same package.json scripts

## What Was Applied Wrong

| Fix | Where Applied | Where User Expected |
|-----|---------------|---------------------|
| SystemMetrics.tsx deletion | `dashboard-iteration-v1/src/components/dashboard/` | Should have been `phase3_build/dashboard/src/components/dashboard/` |
| design-tokens.css | `dashboard-iteration-v1/src/styles/` | Should have been `phase3_build/dashboard/src/styles/` |
| useMetrics.ts fix | `dashboard-iteration-v1/src/hooks/` | Should have been `phase3_build/dashboard/src/hooks/` |
| agent-api.ts wiring | `dashboard-iteration-v1/src/lib/` | Should have been `phase3_build/dashboard/src/lib/` |

## Discovery Evidence

```
Git root: /home/dakotasb/command_center (same for both directories)
Branch: main (both directories show identical branch state)

Port configuration found:
- Both next.config.js files identical, no hardcoded port
- Default Next.js port is 3000
- User mentioned 3003 specifically for orchestration project
```

## Root Cause

**Assumption without verification:**
- Started working on `dashboard-iteration-v1/` because it had been used in previous work
- Never verified port-to-directory mapping with user
- Didn't check if orchestration project required different directory

## User's Actual Architecture

- `dashboard-iteration-v1/` - Development iteration directory (possibly for experimentation)
- `kirimvp_orchestration/phase3_build/dashboard/` - Production orchestration project
- Port 3003 specified for orchestration (not 3001 where server was running)

## Recovery Required

**Must determine:**
1. Is `dashboard-iteration-v1/` a working copy that gets merged to `phase3_build/dashboard/`?
2. Are they truly separate codebases that diverged?
3. Should fixes be copied over or re-applied?
4. Where should Phase 3 features actually be implemented?

## Prevention Protocol

**Execute BEFORE any work on existing multi-directory projects:**

```bash
# 1. Find all candidate directories
find ~ -name "*dashboard*" -type d 2>/dev/null | head -20

# 2. Check what ports are expected/used
grep -r "300[0-9]" <dirs> --include="package.json" --include=".env*" 2>/dev/null

# 3. What's actually running
ss -tlnp | grep -E "300[0-9]"

# 4. ASK USER EXPLICITLY:
"Confirming: Project X is located at [PATH], runs on port [PORT], correct?"
```

## Lesson

**Never assume directory-port mapping.** Two directories with identical git state can serve completely different purposes. User specifying a port number ("3003") is a signal to verify directory mapping immediately.
