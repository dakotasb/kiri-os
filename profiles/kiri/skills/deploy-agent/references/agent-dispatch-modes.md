# Agent Dispatch Modes Reference

## Critical Distinction

There are TWO ways to invoke an agent, and they produce VERY different results:

### Method 1: `delegate_task` (Subagent - Ephemeral)

```python
delegate_task(
    goal="Build a login system",
    role="forge",
    toolsets=["web", "terminal", "file"]
)
```

**What you get:** A generic worker with limited context.
- ❌ No SOUL.md identity loaded
- ❌ No agent-specific skills symlinks
- ❌ No memory of being @forge
- ✅ Quick to spawn
- ✅ Lightweight

**Use case:** One-off tasks where agent identity doesn't matter.

### Method 2: `hermes -p <agent>` (Real Agent - Persistent Identity)

```bash
terminal(
    command="hermes -p forge --message 'Build a login system'",
    background=True,
    notify_on_complete=True
)
```

**What you get:** The actual @forge agent with full identity.
- ✅ Loads SOUL.md with agent persona
- ✅ Proper config.yaml scope
- ✅ Symlinks to correct skills
- ✅ Maintains agent continuity
- ✅ Can escalate and coordinate

**Use case:** When you want the REAL agent, not a generic worker.

## Comparison Matrix

| Aspect | `delegate_task` | `hermes -p <agent>` |
|--------|----------------|---------------------|
| Identity | Generic subagent | Full agent persona |
| SOUL.md | ❌ Not loaded | ✅ Fully loaded |
| Skills | Passed via toolsets | Symlinked from profile |
| Memory | Ephemeral | Persistent across calls |
| Performance | Fast spawn | Profile load time |
| Use case | Quick task | Proper agent work |

## Decision Tree

```
Need agent to do work?
    ↓
Is agent identity important (SOUL.md, skills, patterns)?
    ↓ YES → Use hermes -p <agent>
             ↓
    ↓ NO  → Use delegate_task
             ↓
Quick one-off task?
```

## Pitfall: Confusing the Two

**The user's preference (from session):**
> "That would be subagents and not actual agents? Did we port a behavior I'm trying to avoid?"

When building an agent orchestrator (@kiri), use `hermes -p <agent>` to spawn REAL agents, never `delegate_task` for agent delegation.

`delegate_task` creates faceless workers. Named agents carry full identity, skills, and patterns from their profiles.
