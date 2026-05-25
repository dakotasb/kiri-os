# Session-Specific Agent Role Lessons

## Phase 5 Dashboard Orchestration - Agent Role Misassignment Pitfall

**Date:** 2026-05-16
**Session:** Dashboard validation to GitHub push preparation

---

### What Happened

**User Report:** "Dashboard stuck on loading system metrics"
**Kiri's Response:** Dispatch @ember to diagnose and fix

**Problem:** @ember is a **VALIDATION** agent, not an **IMPLEMENTATION** agent

**Result:**
- @ember returned: "Build production-ready!" (validation passed)
- Bug was NOT fixed (no code changes made)
- User questioned: "what is ember made for?"

---

### Agent Role Matrix (Updated)

| Agent | Type | Correct For | Wrong For |
|-------|------|-------------|-----------|
| **@ember** | **Testing/Validation** | ✅ Verify builds, report diagnostics, test endpoints | ❌ **Code fixes, file edits, patches** |
| **@forgemaster** | **Implementation** | ✅ Code fixes, implement patches, make commits | ❌ Pure validation without changes |
| **@chronicle** | **Version Control** | ✅ Git history analysis, branch recovery | ❌ Code debugging, implementation |
| **@launchpad** | **Release** | ✅ Push commits, manage releases | ❌ Code fixes, debugging |

---

### The Fix Pattern

**Layer 1: Diagnose (Validation Agent)**
```
@ember: "Missing Authorization header in metrics-store.ts line 34"
        "Browser cache has old code without header"
```

**Layer 2: Implement (Implementation Agent)** ← CRITICAL SWITCH
```
WRONG: Keep @ember trying to "fix" it
CORRECT: Dispatch @forgemaster to add the header

@forgemaster: "Added 'Authorization': 'Bearer dev-key-123' to line 36"
               "Committed: [fix] AUTH: Add Authorization header"
```

**Layer 3: Verify (Validation Agent)**
```
@ember: "Verified: curl returns metrics data correctly"
        "Browser hard refresh required to clear cache"
```

---

### Recognition Signals

**You dispatched the WRONG agent when:**
1. Agent returns "already present" or "works for me" but bug persists
2. Agent reports success but no files changed
3. Agent struggles with file edits (wrong toolset for role)
4. User asks "what is [agent] made for?" ← Red flag

**Correct fix:**
```python
# WRONG - validation agent doing implementation
delegate_task("@ember", "Fix the auth header")  # Will timeout or fail silently

# CORRECT - switch to implementation agent
"Switching to @forgemaster for code fix..."
delegate_task("@forgemaster", "Add Authorization header to metrics-store.ts")
```

---

### User Feedback on This Pattern

**Quoting user:**
> "what is ember made for?"

**Interpretation:** Immediate recognition of wrong agent for task.

**Response should have been:**
> "You're right - @ember validates, let me dispatch @forgemaster for the actual code fix."

---

## Related

- **Skill:** build-vs-runtime-validation (Layer 5: Browser cache invalidation critical)
- **Skill:** real-time-orchestration-communication (Proactive status updates)
- **Memory:** User expects agent-based execution, not direct fixes