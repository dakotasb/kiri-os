# Session 2026-05-17: Orchestration Project Overwrite Analysis

## The Question
User asked: "We need to find out why we had to do disaster recovery. somewhere in the orchestration project the entire dashboard was replaced with a whole new product."

## What Was Discovered

### The Orchestration Project Structure
```
~/command_center/kirimvp_orchestration/
├── phase1_ui_decision/          # UI research (competitor analysis, trends)
├── phase2_architecture/         # NEW "CommandCenter Agent Dashboard" spec
│   └── ux_design_spec.md         # Linear-inspired, dark-first, NEW architecture
└── phase3_build/
    ├── dashboard/                # Current (from snapshot, MISSING Terminal/Metrics)
    ├── dashboard-backup-current-20260517-205102/
    ├── mvp-dashboard/            # Original working version
    └── mvp-dashboard-staging/
```

### Root Cause: Parallel Rebuild, Not Incremental Update

**What happened:**
1. **May 16 00:31** - Baseline import: commit `a8c6dd8 [BASELINE] Import dashboard from staging backup`
2. **May 16-17** - Orchestration project built **NEW** `dashboard/` from scratch
3. **The "relic snapshot"** (`~/snapshots/dashboard-pre-color-update/`) captured state AFTER baseline import but BEFORE orchestration Phase 1-5 fixes

### Why Terminal/Metrics Are "Lost"

| Feature | Status in Snapshot | Status in Orchestration |
|---------|-------------------|------------------------|
| **Terminal** | Placeholder only ("Web-based terminal interface coming soon") | Started but incomplete |
| **Metrics** | `dashboard-stats.tsx` present | `SystemMetrics.tsx` added later |
| **AgentCards** | ✅ Working | ✅ Working |

**The "loss" was not an overwrite — it was restoring to a pre-implementation state.**

The orchestration project was **mid-implementation** when it broke. We restored to the last known **stable** state (May 16 baseline), which predated the Terminal/Metrics implementation.

### Git History Evidence

```
Git commits showing orchestration additions:
├── 6da79ed [fix] BUILD: Fix formatter type in SystemMetrics
├── 4ddcaad [fix] BUILD: Fix TypeScript type assertion in SystemMetrics
├── 56d1400 [fix] BUILD: Correct metrics route import path
└── 6c57297 [merge] Phase 5: Complete critical fixes merge
```

**API routes existed in broken version:**
- `/api/system/metrics`
- `/api/agents/start`, `/api/agents/stop`, `/api/agents/status`
- `/api/plugins/*`

**But the working snapshot (May 16) didn't have these yet.**

## Key Insight

**There was no "malicious overwrite."**

The disaster recovery was necessary because:
1. Orchestration project created a **parallel implementation** in new `dashboard/` directory
2. This implementation was **incomplete/unstable** when it broke
3. Only safe recovery point was the **pre-orchestration baseline**
4. Features added *during* orchestration (Terminal, Metrics) were lost because they never reached a stable checkpoint

## Prevention Pattern

```
Orchestration project workflow:
├── Import baseline (working state)
├── Create NEW directory for new architecture
├── Build incrementally with VALIDATION CHECKPOINTS
├── BEFORE each major phase: snapshot working state
├── If breaks: can restore to LAST checkpoint, not baseline
└── Result: Features preserved at each stable point
```

## Session Learning

**When user asks "how did this get overwritten":**
1. Check if it's a **git overwrite** (rare) or **external snapshot restore** (common)
2. Look for parallel directories, not just git history
3. Identify WHERE features were added (in-flight work vs stable checkpoints)
4. Verify: Are features "lost" or "never reached stable state"?

**In this case:**
- **Not** "The dashboard was replaced with a new product"
- **Actually** "We restored to before the new product was finished"

The features exist in broken/orchestration state but were never committed to a working snapshot.