---
name: multi-phase-orchestration-with-integration
version: "1.0.0"
description: >
  Orchestrate complex multi-phase projects with parallel implementation phases
  followed by mandatory integration phases. Prevents the common failure mode
  where parallel agent work creates integration debt that blocks completion.
  
  Covers: phase decomposition, parallel dispatch within phases, integration
  gates, validation layers, git reconciliation, and build verification.
  
triggers:
  - "multi-phase project"
  - "parallel agents with integration"
  - "phase 5 integration"
  - "orchestrate phases"
  - "finish the implementation"
  - "verify everything works together"
  - "integrate parallel work"
  - "project has phases"
tags: [multi-phase, orchestration, integration, parallel-execution, validation]
---

# Multi-Phase Orchestration with Integration

## Overview

This skill addresses a critical failure mode in multi-agent projects:

**The Problem:**
```
Phase 1-4: Implementation (parallel agents, fast)
         ↓
   Multiple agents → Multiple branches → Uncoordinated
         ↓
Integration failure discovered late
         ↓
PROJECT BLOCKED: No common history, build errors, git divergence
```

**The Solution:**
```
Phase 1-N: Implementation (parallel within phases)
         ↓
Phase N+1: INTEGRATION (mandatory, sequential)
         ↓
   Merge conflicts resolved
   Git history reconciled
   Build verified
   Tests pass
         ↓
DONE: Working, shippable artifact
```

## Architecture

### Phase Types

| Phase Type | Execution | Purpose | Example |
|------------|-----------|---------|---------|
| **Implementation** | Parallel | Create fixes/features | Phase 1: Security fixes |
| **Integration** | Sequential | Reconcile parallel work | Phase 5: Merge, build, verify |
| **Validation** | Sequential | Prove correctness | Phase 6: End-to-end testing |

### Why Integration Phases Are Mandatory

Parallel implementation WITHOUT integration creates:
- **Git divergence**: Different branches with no common ancestor
- **Build breakage**: TypeScript errors from conflicting changes
- **File location confusion**: Staging vs production directories
- **Commit attribution loss**: Who did what becomes unclear
- **History pollution**: Large binaries, node_modules tracked

## Process

### Phase Implementation: Parallel vs Sequential

#### Parallel Dispatch (Default)
```python
# Phase 1-N: Implementation - agents working simultaneously
agents = [
    {"agent": "temper", "task": "C4 ask-kiri validation"},
    {"agent": "forge", "task": "PLUGIN system exports"},
    {"agent": "prism", "task": "H9 start button wiring"}
]

# Dispatch all simultaneously
for agent_config in agents:
    terminal(
        command=f'hermes -p {agent_config["agent"]} chat -q "{agent_config["task"]}"',
        background=True,
        notify_on_complete=True
    )
```

#### Sequential Dispatch (User-Requested)
**Signal phrases:** "1 and then 2", "do X first", "one at a time", "in order"

```python
# When user explicitly requests sequential execution
# Phase 2: Fix API - WAIT for completion
dispatch_1 = terminal(
    command='hermes -p mason chat -q "Fix the API 404 issue..."',
    background=True,
    notify_on_complete=True
)
wait_for_completion(dispatch_1)  # BLOCK until done

# Only then dispatch Phase 2 verification
# Phase 2b: Verify - runs AFTER Phase 2a completes
dispatch_2 = terminal(
    command='hermes -p sentry chat -q "Verify the API fix..."',
    background=True,
    notify_on_complete=True
)
wait_for_completion(dispatch_2)

# Then report combined results
```

**Why sequential?**
- User wants ordered verification (second agent validates first's work)
- Dependencies (can't verify until fix exists)
- Resource contention (same port/filesystem locks)
- User testing orchestration capability with explicit sequencing

### Integration Phase (Sequential)

```python
# Phase N+1: Integration (CANNOT be parallel)

# Step 1: Git reconciliation
terminal("git merge --allow-unrelated-histories fix/phase-1-branch")
terminal("git filter-repo --path-glob 'node_modules' --invert-paths")  # Clean history

# Step 2: Build verification
terminal("npm install && npm run build")  # This WILL find integration issues

# Step 3: Fix integration errors
# - TypeScript type conflicts
# - Import path issues
# - Missing dependencies

# Step 4: Final validation
terminal("npm run test")  # Prove functionality
terminal("git push origin main")  # Ship it
```

## Integration Phase Responsibilities

### 1. Git History Reconciliation

**Problem:** Parallel branches diverge, no common ancestor

**Solution:**
```bash
# Force merge unrelated histories
git merge --allow-unrelated-histories <branch>

# Clean up large files
git filter-repo --path-glob 'node_modules' --invert-paths

# Verify history
git log --oneline --graph --all
```

### 2. Build Verification

**Problem:** Each agent's code works in isolation, breaks together

**Solution:**
```bash
# This WILL surface integration issues
npm ci  # Clean install
npm run build  # TypeScript compilation
npm run test  # Functional verification
```

**Common Integration Errors:**
- Type mismatches between components
- Import path resolution failures
- Duplicate variable declarations
- Missing peer dependencies

### 3. File Relocation

**Problem:** Agent worked in staging instead of production directory

**Solution (Staged Mover Pattern):**
```python
# Already dispatched with implementation agents
# See agent-dispatch skill: Staged Mover Agent pattern
```

### 4. Final Push

**Problem:** Cleaned history diverges from remote

**Solution:**
```bash
# Force push cleaned history
git push --force-with-lease origin main

# Verify remote matches local
git log --oneline origin/main
```

## Validation Layers

### Layer 0: User Sign-Off Gate (CRITICAL)

**The Rule:** Never self-certify phase completion. Always obtain explicit user validation.

**Anti-Pattern:**
```python
# WRONG: Self-certifying completion
for agent in fix_agents:
    dispatch(agent)

# I verified independently — all good!
send_message("All fixes done, proceeding to Phase 3!")
```

**Correct Pattern:**
```python
# 1. Dispatch fix agents
for agent in fix_agents:
    dispatch(agent)

# 2. Dispatch independent validator
validator_task = """
VALIDATE fixes in ~/project/. Check:
1. Fix A complete with evidence
2. Fix B complete with evidence
3. Fix C complete with evidence
Write formal report to /tmp/phase-validation.txt
Report: PASS/FAIL per item with evidence.
"""
dispatch("keystone", validator_task)

# 3. WAIT for user directive
# User may say: "wait for formal report" 
# → Block and poll until report exists
send_message("Fixes dispatched. Waiting for formal validation report...")

# 4. Only proceed on explicit user approval
# User: "ok proceed" → Phase 3
# User: "fix X first" → Re-dispatch
```

**Validation Gate Checklist:**
- [ ] Independent agent validator dispatched
- [ ] Formal report generated (file or direct response)
- [ ] User explicitly approves phase transition
- [ ] No self-certification of "looks good"

### Layer 1: Git Verification
- Commits on remote: `git log origin/main`
- History cleaned: No files >100MB
- Branches merged: `git branch --merged main`

### Layer 2: File Existence
- Critical files present: `find src/components -name "*.tsx"`
- No orphaned files: `git status --short`

### Layer 3: Build Verification
- TypeScript compiles: `npm run build`
- No warnings treated as errors
- Bundle generates successfully

### Layer 4: Functional Validation
- Components render without runtime errors
- API endpoints respond correctly
- User flows work end-to-end

## Anti-Patterns

### ❌ Wrong Dispatch Syntax

**Problem:** `hermes chat -p agent_name` injects prompt but agents may not execute properly.

**Correct:** `hermes -p agent_name chat -q "task"`

**Wrong:**
```python
# Agents may receive prompt but not execute
tasks = [
    ("forge", "delete file"),
    ("mason", "fix code")
]
for agent, task in tasks:
    subprocess.Popen(['hermes', 'chat', '-p', agent, task])  # WRONG
```

**Right:**
```python
# Correct syntax for agent dispatch
for agent, task in tasks:
    subprocess.Popen(
        ['hermes', '-p', agent, 'chat', '-q', task],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True
    )
## Anti-Patterns

### ❌ Wrong Dispatch Syntax

**Problem:** `hermes chat -p agent_name` injects prompt but agents may not execute properly.

**Correct:** `hermes -p agent_name chat -q "task"`

**Wrong:**
```python
# Agents may receive prompt but not execute
tasks = [
    ("forge", "delete file"),
    ("mason", "fix code")
]
for agent, task in tasks:
    subprocess.Popen(['hermes', 'chat', '-p', agent, task])  # WRONG
```

**Right:**
```python
# Correct syntax for agent dispatch
for agent, task in tasks:
    subprocess.Popen(
        ['hermes', '-p', agent, 'chat', '-q', task],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True
    )
```

### ❌ Wrong Directory Target

**Problem:** Applying fixes to the wrong codebase location while production runs elsewhere.

**Example:**
```python
# Agent dispatches apply to ~/project/staging/
hermes -p forge "Fix ~/project/staging/src/components/bad-file.tsx"

# BUT production server runs from ~/project/production/ on port 3001
# Result: Fixes applied to unused code, production still broken
```

**Detection:**
```bash
# Find all candidate directories
find ~ -name "package.json" -path "*/dashboard/*" 2>/dev/null

# Identify which is actually running
ss -tlnp | grep -E "3001|3003"
ps aux | grep "next dev" | grep -v grep

# Verify the running server's path
readlink -f /proc/$(pgrep -f "next dev" | head -1)/cwd 2>/dev/null
```

**Prevention:**
```python
# BEFORE dispatching agents:
"""
1. Identify the ACTIVE server:
   - Which port? (3001, 3003)
   - Which directory is serving?
   
2. Verify target directory matches active server:
   - curl localhost:PORT → works?
   - echo $PWD in that directory
   
3. THEN dispatch fixes to the CORRECT path
"""
```

**Session Example:**
- Phase 2 fixes dispatched to `~/command_center/dashboard-iteration-v1/`
- Build succeeded, commits made
- BUT production server running from `~/command_center/kirimvp_orchestration/phase3_build/dashboard/` on port 3001
- Result: Phase 2 complete... on the wrong codebase

### ❌ Skip Integration Phase

**Wrong:**
```python
# Dispatch all agents
for agent in agents:
    terminal(f"hermes -p {agent} ...", background=True)

# Report done immediately
send_message("All agents dispatched, project complete!")
```

**Result:** Agents finish, create commits in wrong places, nobody merges, build never verified, project technically incomplete.

### ✅ Include Integration Phase

**Right:**
```python
# Dispatch all agents
for agent in agents:
    terminal(f"hermes -p {agent} ...", background=True)

# Wait for completion
for proc in processes:
    process(action="wait", session_id=proc)

# MANDATORY: Integration phase
terminal("hermes -p chronicle 'Merge all branches to main'")
terminal("hermes -p keystone 'Verify build passes'")
terminal("git push origin main")

# Report ACTUAL completion
send_message("All fixes integrated, built, and pushed!")
```

## Implementation Template

```python
def orchestrate_with_integration(phases):
    """
    phases: [
        {"name": "Phase 1: Security", "agents": [...], "parallel": True},
        {"name": "Phase 2: Core", "agents": [...], "parallel": True},
        {"name": "Phase 5: Integration", "agents": ["chronicle", "keystone"], "parallel": False}
    ]
    """
    
    # Implementation phases (parallel)
    for phase in phases[:-1]:  # All but last
        if phase["parallel"]:
            for agent in phase["agents"]:
                dispatch_parallel(agent, phase["tasks"])
    
    # Integration phase (sequential, mandatory)
    integration = phases[-1]
    for agent in integration["agents"]:
        dispatch_sequential(agent, integration["tasks"])
        wait_for_completion()
        verify_success()
    
    return "COMPLETE: All phases including integration done"
```

## Session Evidence

**This skill extracted from real session:**
- 5 phases planned
- Phases 1-4: Parallel implementation (fast)
- Phase 5: Integration (blocked on git divergence, TypeScript errors)
- Required: Git history cleanup, force push, build fixes, file relocation
- Lesson: Integration phase ALWAYS takes longer than expected but is non-negotiable

## References

See `references/` directory for:
- Session transcripts showing integration failures
- Build error patterns and fixes
- Git reconciliation commands
- Validation checklists

### Related Skills

- **dashboard-module-architecture** — Feature consolidation and dual accessibility patterns (module + full page)
- **agent-dispatch** — Spawning agents with correct syntax and model routing