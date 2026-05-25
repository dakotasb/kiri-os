# Persistence Patterns in Agent Dispatch Architecture

**Document Purpose**: Document persistence guarantees across different agent spawning modes in Hermes Agent.

**Related Documents**: 
- `ARCHITECTURE.md` - Overall system design
- `AGENT_INVENTORY.md` - Agent definitions and manifests

---

## Executive Summary

The Agent Dispatch Architecture supports **two distinct execution patterns** with fundamentally different persistence characteristics:

| Pattern | Use Case | Persistence Guarantee |
|---------|----------|----------------------|
| **delegate_task** | Ephemeral subagents, quick tasks | ⚠️ Session-scoped |
| **cronjob** | Persistent agents, autonomous work | ✅ Process-scoped |

**Key Insight**: Subagents spawned via `delegate_task` exist only within the parent's session context and their durable writes may not propagate. Agents spawned via `cronjob` are independent processes with full persistence guarantees.

---

## 1. Execution Pattern Comparison

### 1.1 delegate_task (Subagent Mode)

**Architecture**:
```
Parent Session
├─ Context window (shared)
├─ Memory state (shared)
├─ Tool references (shared)
└─ delegate_task spawn
    ├─ Same process
    ├─ Same context
    └─ Returns to parent on completion
```

**Characteristics**:
- Runs within parent's process
- Shares parent's context window
- Inherits parent's toolsets
- **Lifetime**: Task duration only
- **Output**: Returns to parent, can write to parent's output directory

**When to Use**:
- Quick analysis (summarize, review, check)
- Code review within active conversation
- Single-file tasks with immediate results
- Work that doesn't need to survive session end

**Persistence Caveats**:
- ✅ File writes → Survive (in parent's output dir)
- ⚠️ Skill creation → May not persist to persistent storage
- ⚠️ MemPalace writes → May not commit
- ⚠️ Memory store updates → Session-scoped only
- ❌ Context state → Lost on task completion

### 1.2 cronjob (Process Mode)

**Architecture**:
```
Parent Session
cronjob_create()
└─ Spawns new AIAgent Process (independent)
    ├─ Own context window
    ├─ Own memory space
    ├─ Own tool references
    ├─ Connects to Ollama Cloud via proxy
    └─ Properly terminates with cleanup
```

**Characteristics**:
- Runs as independent process
- Own context window
- Full tool access
- **Lifetime**: As defined by schedule (cron expressions)
- **Output**: Writes to own output directory

**When to Use**:
- Developing/revising skills
- MemPalace knowledge capture
- Cross-session memory updates
- Autonomous scheduled work
- Work that must survive disconnects

**Persistence Guarantees**:
- ✅ File writes → Survive (in agent's output dir)
- ✅ Skill creation → Persisted to `~/.hermes/skills/`
- ✅ MemPalace writes → Committed to Qdrant via session_end hooks
- ✅ Memory store updates → Survive across sessions
- ✅ Context state → Scheduled re-runs restore state from files

---

## 2. Persistence by Feature

### 2.1 Skill Development

**delegate_task Subagent**:
```python
# This may create the file but skill won't be loaded on next session
skill_manage(action="create", name="my-skill", ...)
# File exists but registry may not update
```

**Cron Agent**:
```python
# This persists - skill available in future sessions
skill_manage(action="create", name="my-skill", ...)
# File created + registry updated + available immediately
```

**Recommendation**: Use cron agents for skill development. Use delegate_task only for skill usage.

### 2.2 MemPalace Writes

**delegate_task Subagent**:
```python
# Writes may complete but not trigger session_end hooks
mempalace_mempalace_save(...)
# Drawer may be staged but ingestion uncertain
```

**Cron Agent**:
```python
# Guaranteed persistence via session_end hooks
mempalace_mempalace_save(...)
# Stop hook triggers Qdrant ingestion
```

**Recommendation**: Always use cron agents for MemPalace operations.

### 2.3 Memory Store Updates

**delegate_task Subagent**:
```python
memory(target="user", action="add", content="preference")
# Added to parent's in-memory state
# Lost if parent session ends unexpectedly
```

**Cron Agent**:
```python
memory(target="user", action="add", content="preference")
# Committed to durable storage on session end
```

**Recommendation**: Cron agents for durable preferences, delegate_task for session context only.

---

## 3. Cascade Architecture

**Multi-Level Agent Dispatch**:

```
Level 0: Your CLI/Gateway Session
├─ Can spawn: cron jobs (persistent, scheduled)
└─ Can spawn: delegate_task (temporary, immediate)

Level 1: Cron-Spun Agent (Keystone, Mason, etc.)
├─ Independent process with own model
├─ Can spawn: delegate_task (temporary subagents)
├─ Can spawn: NEW cron jobs (adds to fleet)
├─ Can spawn: ACP agents (Claude Code, Codex)
└─ Properly terminates with full persistence

Level 2: Sub-sub-agents
└─ delegate_task from Level 1 agents
   └─ Session-scoped, inherits Level 1 context
```

**Key Pattern**: Cron agents can delegate to temporary workers for quick tasks within their session, but those subagents don't have the same persistence guarantees as the parent cron agent.

---

## 4. Auxiliary Model Configuration

### 4.1 Per-Agent Auxiliary Models

Each persistent agent can configure its own auxiliary models, isolated from other agents.

**Configuration via Agent Startup**:
```json
{
  "agent": {
    "on_start": [
      "/model vision --provider openrouter --model anthropic/claude-sonnet",
      "/model compression --provider openrouter --model google/gemini-2.5-flash"
    ]
  }
}
```

**Runtime Configuration** (within agent code):
```python
# Agent configures its own aux models
agent.run_slash_command("/model vision --provider X --model Y --auxiliary")
```

### 4.2 Agent Model Partitioning

```
Fleet: Architecture Team
├─ Keystone (deepseek-v4-pro main)
│  └─ Aux: Vision=Claude, Compression=Gemini Flash
│
├─ Sentinel (kimi-k2.6 main)
│  └─ Aux: Vision=GPT-4o, Compression=Mistral
│
└─ Temper (deepseek-v3.1 main)
   └─ Aux: Vision=Sonnet, Compression=Qwen

Fleet: Implementation Team
├─ Mason (kimi-k2.5 main)
│  └─ Aux: Vision=Claude, Compression=Gemini
│
└─ Weld (deepseek-v4-flash main)
   └─ Aux: Vision=GPT-4o, Compression=Mistral
```

Each agent has independent auxiliary configurations. This enables:
- Model specialization by team/function
- Cost optimization (cheap aux models for specific tasks)
- Capability isolation (no cross-contamination between agents)

---

## 5. Decision Framework

### 5.1 When to Use delegate_task

Use `delegate_task` when:
- ✅ Task completes within single conversation
- ✅ Result needed immediately by parent
- ✅ No need for skill/memory persistence
- ✅ Working with parent session context
- ✅ One-shot analysis or review

**Example**:
```python
delegate_task(
    goal="Review this code for security issues",
    context={
        "code_file": "/path/to/file.py",
        "security_standards": "OWASP Top 10"
    }
)
# Returns findings to parent, no persistence needed
```

### 5.2 When to Use cronjob

Use `cronjob_create` when:
- ✅ Work must survive session disconnects
- ✅ Skill development or revision required
- ✅ MemPalace knowledge capture needed
- ✅ Durable memory store updates required
- ✅ Scheduled/recurring work
- ✅ Autonomous agent with defined identity
- ✅ Cross-session state persistence

**Example**:
```python
cronjob_create(
    prompt="Analyze codebase and create skills for common patterns",
    schedule="0 2 * * *",  # Daily at 2 AM
    model={"model": "deepseek-v4-pro", "provider": "custom"},
    deliver="local"
)
# Agent runs independently, full persistence guaranteed
```

### 5.3 Hybrid Pattern

**Most powerful approach**: Combine both patterns

```
Cron Agent (Keystone - PM)
├─ Spawns at 9 AM daily (cron)
├─ Reviews overnight work (persistence required)
├─ Delegates code review to ephemeral subagent (delegate_task)
│  └─ Subagent returns findings immediately
├─ Updates skill based on patterns (skill_manage - persists)
├─ Schedules follow-up for blocked items (cronjob - persists)
└─ Commits observations to MemPalace (persists)
```

---

## 6. Best Practices

### 6.1 Design Guidelines

1. **Persistence Required?** → Use cronjob
2. **Quick Answer Needed?** → Use delegate_task
3. **Skill Creation?** → Always use cronjob
4. **MemPalace Writes?** → Always use cronjob
5. **Memory Updates?** → Prefer cronjob for durable info

### 6.2 Anti-Patterns

❌ **Don't**: Use delegate_task to create skills
❌ **Don't**: Expect MemPalace writes from subagents to persist
❌ **Don't**: Use cron jobs for one-off questions (overhead)
❌ **Don't**: Mix persistence-critical work in ephemeral subagents

### 6.3 Verification

To verify persistence:

1. **Skill created?** Check `~/.hermes/skills/`
2. **MemPalace written?** Check Qdrant via `mempalace_search`
3. **Memory stored?** Restart Hermes, verify still available
4. **Cron job output?** Check `~/.hermes/cron/output/`

---

## 7. Technical Implications

### 7.1 Session Hooks

**Cron Agents** have full lifecycle:
```
agent_start → work → session_summary → session_end → Stop hook
                                          ↓
                                   Qdrant ingestion
```

**delegate_task Subagents** may not trigger all hooks:
```
task_start → work → task_end → (hooks may fire in parent context)
```

### 7.2 Context Isolation

- **Cron agents**: Full isolation, no shared state
- **delegate_task**: Shared context, potential interference

### 7.3 Resource Management

- **Cron agents**: Independent resource limits (configured per manifest)
- **delegate_task**: Shares parent's resource pool

---

## 8. Migration Guide

### 8.1 Converting delegate_task to Cron Job

**Before** (ephemeral, may lose persistence):
```python
delegate_task(
    goal="Create skill for error handling",
    context={"error_patterns": errors}
)
```

**After** (durable, guaranteed persistence):
```python
cronjob_create(
    prompt="Create skill for error handling based on: {errors}",
    schedule="*/5 * * * *",  # Run once, cancels itself
    model={"model": "deepseek-v4-pro", "provider": "custom"},
    context_from=[]  # No dependency
)
```

---

## 9. Related Concepts

- **Multi-Model Dispatch**: Per-agent model selection via cronjob model parameter
- **Agent Hierarchy**: Parent-child relationships with persistence boundaries
- **Session Scoping**: Understanding context lifetime and isolation

---

**Document Version**: vF.2  
**Last Updated**: 2026-05-06  
**Author**: Kiri / Dakota