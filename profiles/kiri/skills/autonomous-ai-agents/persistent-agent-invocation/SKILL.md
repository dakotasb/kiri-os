---
name: persistent-agent-invocation
description: Route work to persistent Create Team agents (with configs/memory in MemPalace) via cron-based execution with skills=[] and context_from=[] vs spawning ephemeral delegate_task subagents. cron-based execution reliably loads agent configs; delegate_task spawns generic subagents without identity or accumulated memory.
triggers:
  - "use the actual revenue team"
  - "actual agent team"
  - "delegate_task vs Create Team"
  - "persistent agents not temporary"
  - "invoke specific agent"
  - "spawn agent vs use configured agent"
  - "the real agent team not a subagent"
  - "why did you spawn a subagent"
  - "revenue_strategist not delegate_task"
  - "Create Team agent invocation"
  - "did you generate this or delegate to the actual agent team"
  - "overnight iterations worked but this didn't"
  - "next cycle"  # When referring to agent invocation timing
  - "cron vs delegate_task"
  - "skills and context_from"
version: 1.0.1
tags: [agent-invocation, Create-Team, persistent-agents, ephemeral-subagents, delegation-choice, cron-scheduling, skills-loading, context-chaining]
---

# Persistent Agent Invocation

## Execution Model Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EPHEMERAL SUBAGENTS (delegate_task)                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  Lifecycle: Spawned on demand, lives 5 minutes, dies forever                  │
│  Memory: None (fresh context only)                                          │
│  Config: None (generic Hermes)                                              │
│  Identity: Temporary worker                                                 │
│  Cost: 600s timeout hard limit                                            │
│  Best for: Bounded tasks, one-off work, parallel execution                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PERSISTENT AGENTS (Create Team / Hermes Profiles)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Lifecycle: Configured in MemPalace/filesystem, ongoing existence           │
│  Memory: Accumulates across sessions via MemPalace                             │
│  Config: Named agents with SOUL.md, model configs, multi-model settings       │
│  Identity: Specialist with role, skills, task mappings                      │
│  Execution Methods:                                                           │
│    - Cron jobs: schedule + skills + context_from                            │
│    - Hermes profiles: `hermes -p agent_name chat -q "task"`                 │
│    - Event-driven: Webhooks, KG triggers                                      │
│  Best for: Domain expertise, multi-session work, team coordination         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Both cron agents and profile agents have proper session hooks for MemPalace persistence.**

The earlier distinction of "cron only" was incorrect — use `hermes -p agent_name` for immediate execution with same persistence guarantees as cron-based scheduling.

---

## When User Means "The Actual Agent Team"

**User says:** *"use the actual revenue team"*
**User means:** Persistent Create Team agents with configs in MemPalace
**NOT:** `delegate_task(goal="do revenue work")` spawning temporary subagent

**The Test:**
```
"Did the agent exist before this task was assigned?"

Yes  → Use persistent invocation (Create Team)
No   → delegate_task spawns ephemeral subagent
```

---

## How to Invoke Persistent Agents

### Method 1: Cron Job with Immediate Execution (Recommended)

**Best for:** ALL Create Team agent work requiring proper config loading, accumulated context, and MemPalace persistence

**Two-step immediate execution** (triggers now, not scheduled):

```python
# Step 1: Create the job
created = cronjob(
    action="create",
    name="revenue-max-funding-analysis",
    schedule="0 0 * * *",  # Required but overridden by run
    prompt="""
    As revenue_strategist, analyze maximum funding opportunity
    for AI Agent Orchestration Platform.
    
    Use existing research in MemPalace:
    - wing=revenue, room=opportunities
    - Compare to comparable raises (CrewAI, Dify, etc.)
    
    Deliver: Max funding recommendation with scenarios
    """,
    skills=["revenue_strategist"],  # Loads agent config with multi-model settings
    context_from=["previous-revenue-job-id"]  # Accumulated agent memory
)
# Returns: { "success": true, "job_id": "abc123...", ... }

# Step 2: Trigger immediate execution
cronjob(
    action="run",
    job_id=created["job_id"]  # From create step
)
```

**Critical Nuance - Timing:**
- **Invocation:** IMMEDIATE (1-2 seconds to spawn with proper config)
- **Execution:** Variable (minutes to hours depending on task complexity)

**Alternative: Scheduled Execution** (if user explicitly requests delayed/future run):

```python
# Single scheduled run at specific time
cronjob(
    action="create",
    name="nightly-analysis",
    schedule="0 2 * * *",  # 2 AM daily
    repeat=1,  # Once only
    ...
)

The phrase "next cycle" or "scheduled execution" describes the spawn mechanism with proper setup/teardown - NOT a delay. Agent begins work immediately, runs autonomously until complete.

**Why This Pattern Works (Overnight Iterations):**
```
Job 1: Load skills=["forge"] + context_from=["prev"] → Execute → Save to MemPalace
   ↓
Job 2: Load skills=["mason"] + context_from=["job-1"] → Execute → Save to MemPalace
   ↓
Job 3: Load skills=["prism"] + context_from=["job-1","job-2"] → Synthesize
```
Each job spawns with proper identity and context - this is why overnight iterations succeed while `delegate_task` fails.

**Pros:** 
- Native integration with Create Team
- Loads agent config, accumulated memory, multi-model settings
- Reliable MemPalace persistence
- **Immediate start** (1-2s invocation)

**Cons:** 
- Must use `context_from` for accumulated memory (not automatic)
- Requires explicit skill loading (not default behavior)

---

### Method 2: MemPalace Task Queue (Self-Discovery)

**Best for:** Urgent tasks that agents can pick up

```python
# Save task to agent's MemPalace location
mempalace_save(
    palace="agent_org",
    wing="revenue",  # revenue_strategist monitors this wing
    hall="funding-strategy",
    room="analysis-requests",
    closet="max-funding-opportunity",
    content="""
    TASK: Max Funding Opportunity Analysis
    Priority: HIGH
    Requested: 2026-05-04
    
    Analyze maximum justifiable raise amount for
    AI Agent Orchestration Platform based on:
    - Existing $100K target research
    - Comparable raises in agent space
    - Market opportunity validation
    
    Deliverable: Executive recommendation with range
    """
)

# Agent discovers this via scheduled scan or notification
```

**Pros:** Persistent agents check their queues
**Cons:** Not immediate, requires agent self-monitoring

---

### Method 3: Knowledge Graph Trigger (Event-Driven)

**Best for:** Tasks triggered by related work completion

```python
# Link new task to existing work
mempalace_kg_add(
    subject="max-funding-analysis-request",
    predicate="assigned_to",
    object="revenue_strategist"
)

# Agent monitors KG for new assignments
```

**Pros:** Event-driven architecture
**Cons:** Requires KG monitoring infrastructure

---

### Method 4: Direct Execution (Historical Gap - Now Solved)

~~**The Reality:** There is NO clean tool for immediate persistent agent invocation.~~

**Solved:** Use cron `action="create"` then `action="run"` for immediate execution.

**Previous Workarounds (deprecated in favor of create+run):**
- ~~`delegate_task`~~ → Spawns ephemeral subagent ❌
- ~~`cronjob create` only~~ → Scheduled, not immediate ⏭️

**Current Pattern for "Run Now":**
```python
# Immediate execution with full agent config loading
job = cronjob(action="create", name="...", skills=["agent-name"], ...)
cronjob(action="run", job_id=job["job_id"])  # Executes immediately
```

---

## The Tool Gap Documentation [DEPRECATED]

**~~Missing Tool:~~** `invoke_agent(agent_name, task, priority)` 

**Status:** RESOLVED via cronjob `action="run"` on created jobs.

**Pattern:**
```
1. cronjob(action="create", skills=["agent-name"], ...) → Get job_id
2. cronjob(action="run", job_id=job_id) → Immediate execution with full config
```

**Key Insight:** If user says overnight/scheduled iterations worked but immediate requests fail, they are describing:
```
FAILED: delegate_task(goal="do X") → Generic subagent, no config, times out
WORKED: cronjob + skills=["agent"] + context_from=["prev"] → Proper identity, loaded config, success
```

This is the signature of the **ephemeral vs persistent agent mismatch**.

### When to Use Which

| Task Type | Use | NOT |
|-----------|-----|-----|
 Max funding analysis | **Cron to revenue_strategist** | delegate_task |
Daily revenue snapshot | **Cron to revenue team** | delegate_task |
Market research | **Scope agent (dedicated)** | Generic research subagent |
Code architecture | **Mason agent (dedicated)** | delegate_task |
Test framework | **Prism agent (dedicated)** | delegate_task |
 Bounded file operation | delegate_task | Cron overhead |
 One-off data extraction | delegate_task | Persistent agent spawn |
 Any work requiring accumulated agent memory | **Cron + skills + context_from** | delegate_task (loses memory) |

---

## The Architecture Violation

### What I Did Wrong (May 4, 2026)

```python
# VIOLATION: Spawned ephemeral subagent for domain work
delegate_task(
    goal="Max funding opportunity analysis",
    context="..."  # No prior relationship, no accumulated memory
)
# Result: Temporary agent did research, vanished
# Wrong: Should have routed to persistent revenue_strategist
```

### What I Should Have Done

```python
# CORRECT: Route to persistent agent via appropriate channel

# Option A: Cron schedule
cronjob(
    action="create",
    name="revenue-analysis-task",
    schedule="...",
    prompt="As revenue_strategist: [task]"
)

# Option B: MemPalace queue
mempalace_save(
    palace="agent_org",
    wing="revenue",
    room="task-queue",
### Method 4: Direct Execution (Historical Gap - Now Solved)

~~**The Reality:** There is NO clean tool for immediate persistent agent invocation.~~

**Solved:** Use cron `action="create"` then `action="run"` for immediate execution.

**Previous Workarounds (deprecated in favor of create+run):**
- ~~`delegate_task`~~ → Spawns ephemeral subagent ❌
- ~~`cronjob create` only~~ → Scheduled, not immediate ⏭️

**Current Pattern for "Run Now":**
```python
# Immediate execution with full agent config loading
job = cronjob(action="create", name="...", skills=["agent-name"], ...)
cronjob(action="run", job_id=job["job_id"])  # Executes immediately
```

---

## The Tool Gap Documentation [DEPRECATED]

**~~Missing Tool:~~** `invoke_agent(agent_name, task, priority)` 

**Status:** RESOLVED via cronjob `action="run"` on created jobs.

**Pattern:**
```
1. cronjob(action="create", skills=["agent-name"], ...) → Get job_id
2. cronjob(action="run", job_id=job_id) → Immediate execution with full config
```

---

## User Escalation Pattern

**When user catches the mistake:**

```
User: "Did you generate this or delegate to the actual revenue agent team?"

Me: "You're right - I used delegate_task (ephemeral) instead of 
     routing to persistent revenue_strategist. 
     
     This is because I don't have an immediate invocation tool for
     Create Team agents. Current workarounds:
     1. Cron schedule (delayed)
     2. MemPalace queue (self-service)
     3. Do directly (what I should have offered)
     
     How would you prefer I invoke specific Create Team agents?"
```

---

## Best Practices

### DO:
- ✅ Check if agent exists in MemPalace before spawning subagent
- ✅ Use named agents (revenue_strategist) for domain work
- ✅ Preserve accumulated agent memory across tasks
- ✅ Route to appropriate team via palace/wing routing
- ✅ Acknowledge tool gap when immediate invocation needed

### DON'T:
- ❌ Use delegate_task for work requiring domain expertise
- ❌ Spawn generic subagent when named specialist exists
- ❌ Bypass Create Team architecture for convenience
- ❌ Assume delegate_task = "use the agent team"

---

## Related Skills

- `agent-organization-coordination` — Hierarchy and governance
- `delegation-troubleshooting` — Timeout and execution trade-offs
- `iterative-agent-pipeline` — Context chaining mechanics

---

## Summary

**The Rule:**

If the answer to *"Did this agent exist before the task was assigned?"* is **YES** → Invoke via Create Team (cron, queue, or acknowledge gap)

If **NO** → delegate_task spawns appropriate ephemeral subagent

**Your Create Team agents are specialists with memory.** Don't replace them with generic temporary workers.

---

## Version History

v1.0.0 - Document ephemeral vs persistent agent invocation distinction
