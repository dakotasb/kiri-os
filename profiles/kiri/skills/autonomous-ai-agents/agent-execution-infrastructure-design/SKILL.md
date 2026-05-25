---
name: agent-execution-infrastructure-design
description: Design reliable execution infrastructure for multi-agent workflows when current patterns (cron, delegate_task) fail to provide dependable multi-step orchestration. Evaluates scheduling models, state persistence mechanisms, failure recovery patterns, and validates architectural alternatives before implementation.
triggers:
  - "cron is not reliable enough"
  - "delegate_task times out for multi-step work"
  - "need reliable workflow execution"
  - "design execution infrastructure for agents"
  - "workflow engine for agent orchestration"
  - "need checkpointing for agent runs"
  - "event-driven agent execution"
  - "state machine for workflows"
  - "circuit breaker for agent failures"
  - "persistence layer for agent state"
  - "execution model comparison"
  - "cron vs temporal vs langgraph"
  - "design phase zero execution"
  - "workflow reliability architecture"
  - "why can't agents run multi-day projects"
tags: [execution-infrastructure, workflow-design, reliability-architecture, state-management, checkpointing, event-driven, circuit-breakers]
version: 1.0.0
---

# Agent Execution Infrastructure Design

## Purpose

Design reliable execution infrastructure for multi-agent workflows when current patterns (cron-based scheduling, ephemeral delegation) prove insufficient for dependable multi-step orchestration.

Use this skill when:
- Cron jobs miss execution windows or fail silently
- `delegate_task` times out on complex multi-step work
- Multi-day projects lose state in context compaction
- No automatic dependency management between tasks
- Need checkpointing/time-travel for agent workflows
- Evaluating workflow engines (Temporal, LangGraph, etc.) for agent orchestration

**Not for:**
- Troubleshooting existing cron jobs (use `delegation-troubleshooting`)
- Breaking tasks into subtasks (use `multi-agent-task-decomposition`)
- Single-shot agent execution (use `persistent-agent-invocation`)

---

## The Problem Pattern

**Current infrastructure gaps:**

| Pattern | Reliability | Dependencies | State Persistence | Failure Recovery |
|---------|-------------|--------------|-------------------|------------------|
| **Cron-based** | ❌ Misses windows | ❌ Manual | ❌ Lost on compaction | ❌ Silent failures |
| **Ephemeral (delegate_task)** | ✅ Immediate | ❌ None | ❌ Session-scoped | ⚠️ Timeout only |
| **Needed: Stateful Workflows** | ✅ Event-driven | ✅ DAG-native | ✅ Durable | ✅ Circuit breakers |

**When you need this skill:**

```
User: "Can agents run a 10-day project autonomously?"
Reality: Cron loses track, context compacts, failures silent
→ Design execution infrastructure FIRST
```

---

## Execution Model Evaluation

### Model 1: Cron-Based Scheduling

**Current implementation:**
- Time-based triggers via `cronjob` tool
- Jobs polled by scheduler process
- Limited dependency management

**Failure modes:**
- Timezone confusion (CDT vs UTC)
- Missed execution windows (scheduler lag)
- No retry logic on failure
- Jobs removed before completion
- Assumes "created = running"

**Verdict:** Suitable for daily reports, not multi-step workflows.

---

### Model 2: Ephemeral Execution (`delegate_task`)

**Current implementation:**
- Spawn agent, execute, discard context
- 600s hard timeout
- No accumulated memory

**Failure modes:**
- Complex tasks exceed timeout
- No partial result persistence
- Session-scoped only
- Context isolation prevents coordination

**Verdict:** Suitable for bounded single tasks, not chains.

---

### Model 3: Workflow Engines (Temporal, Prefect, Dagster)

**Pattern:** Production-grade workflow orchestration

| Engine | Persistence | Dependencies | Failure Handling |
|--------|-------------|--------------|----------------|
| **Temporal** | Deterministic state machines | Native DAG | Built-in retries |
| **Prefect** | Task-level checkpointing | Dynamic DAGs | Exponential backoff |
| **Dagster** | Asset-based lineage | Software-defined | Step-level retry |

**Pros:**
- Production reliability (used by Stripe, Netflix)
- Checkpoint/resume capability
- Explicit dependency graphs
- Configurable retry policies

**Cons:**
- Infrastructure overhead (separate servers)
- Integration complexity with agent frameworks
- Overkill for simple coordination

**Verdict:** Consider for Phase 2 enterprise-grade requirements.

---

### Model 4: Agent Framework Patterns

**LangGraph approach:**
- Stateful graph/DAG execution
- Built-in checkpointing via LangSmith
- Shared State object as communication bus
- Deterministic control flow

**AutoGen approach:**
- Conversational multi-agent
- Basic persistence (ChatHistory)
- Config lists with failover
- Nested chat patterns

**CrewAI approach:**
- Sequential/hierarchical
- Minimal persistence
- Limited async support

**Verdict:** LangGraph checkpointing is the reference architecture to adapt.

---

## Recommended Architecture: Hybrid Event-Driven State Machine

### Design Principles

1. **Event-Driven over Cron-Driven**
   - Events: `schedule_event`, `dependency_complete`, `error_retry`
   - Replaces time-based polling with explicit triggers

2. **Explicit Dependency Graph**
   - Workflows as DAGs with nodes (tasks) and edges
   - Fan-out/fan-in support for parallelism
   - Critical path analysis

3. **Checkpoint Everything**
   - After each task: save to SQLite + MemPalace
   - Before validation gates: checkpoint for rollback
   - Resume from last checkpoint on failure

4. **Validation Gates with Circuit Breakers**
   - Gates: `manual_approval`, `automated_check`, `quality_threshold`
   - Fail fast after N retries
   - Automatic rollback on gate failure

---

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ Event Bus    │───▶│ State Machine│───▶│ Scheduler    │ │
│  │ (Redis/PubSub)   │ (Persistent) │    │ (Priority Q) │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  WORKFLOW EXECUTION LAYER                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  Task 1  │───▶│  Task 2  │───▶│  Task 3  │             │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘             │
│       │               │               │                     │
│       ▼               ▼               ▼                     │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         CHECKPOINT STORE (SQLite + MemPalace)         │  │
│  │   - Task state after every completion                │  │
│  │   - Retry count, failure history                      │  │
│  │   - Validation gate results                           │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Patterns

### Pattern 1: Hybrid Workflow Engine (HWE)

**Components:**
- **Event Bus Layer** (Redis/PubSub): Replaces unreliable cron
- **State Machine** (SQLite): Tracks workflow state
- **Dependency Graph Executor**: DAG execution with fan-out/fan-in
- **Checkpoint Store** (MemPalace + SQLite): Durable state + semantic memory
- **Circuit Breakers**: Fail fast after N retries

**Migration timeline:**
- Phase 0.1: Event bus + SQLite state store (2 weeks)
- Phase 0.2: DAG dependency graphs (2 weeks)
- Phase 0.3: Checkpointing + recovery (2 weeks)
- Phase 0.4: Validation gates (2 weeks)

**Total:** 8 weeks for robust infrastructure

---

### Pattern 2: Adopt LangGraph Checkpointing

**Integration approach:**
- Use LangGraph's `PostgresSaver`/`SqliteSaver` for checkpointing
- Adapt StateGraph patterns to agent execution model
- Map MemPalace hierarchical memory to LangGraph checkpoints

**Benefits:**
- Best-in-class checkpointing (time travel, interrupts)
- Proven in production
- Native to agent framework ecosystem

---

### Pattern 3: Temporal.io Integration

**When to use:**
- Need enterprise-grade reliability
- Multi-day workflows with human-in-the-loop
- Compensation transactions required

**Integration:**
- Define workflows as Temporal activities
- Agent execution as activities within workflows
- MemPalace as the state store

---

## Decision Framework

### When to Build Custom (HWE)

Use when:
- Tight integration with MemPalace required
- Need agent-specific patterns (skills, multi-model routing)
- Moderate complexity (days to weeks, not months)
- Team has infrastructure capacity

**Timeline:** 6-8 weeks

---

### When to Adopt Existing (LangGraph)

Use when:
- Checkpointing is primary requirement
- Can adapt to LangGraph's StateGraph model
- Faster time-to-value preferred over customization
- Less infrastructure ownership desired

**Timeline:** 3-4 weeks integration

---

### When to Use Enterprise (Temporal)

Use when:
- Requires multi-day workflow reliability
- Human-in-the-loop interrupts critical
- Compensation/saga patterns needed
- Infrastructure team available

**Timeline:** 4-6 weeks integration + infrastructure setup

---

## Key Insights from Research

### Why Agents Can't Compress Timelines Arbitrarily

**Sequential dependencies are architectural, not organizational:**
```
Design → Implement → Integrate → Test
  2d        3d          2d        3d
```

You can't test before implementation exists. This is true for agents too.

**Bottlenecks are decision time, not typing:**
- Schema design requires architectural deliberation
- Integration testing discovers emergent surfaces
- Failure modes require anticipatory reasoning

**Agents can be SLOWER at architecture:**
- Lack intuitive understanding of implicit patterns
- May miss compatibility constraints
- Require 2-3 iterations vs human's 1

**Realistic compression:** 50-60% (with parallelization), not 90%+

---

## Verification Patterns

### Pattern: Auto-Monitoring for Job Completion

**After spawning execution, don't assume success:**

```python
# Record expected output at creation time
expected_file = "~/command_center/model_test/agent_deliverable.json"
job_id = cronjob(...)

# Poll after expected completion + buffer
# Check: ls -la ~/command_center/model_test/ | grep deliverable

# Verify before declaring success
if file_exists(expected_file) and file_size > 0:
    report("Agent completed successfully")
else:
    report("Job may have failed — investigate")
```

---

### Pattern: Dependency Chain Validation

**Before declaring multi-step workflow complete:**

```
✅ Step 1 output exists and valid
✅ Step 2 consumed Step 1 output
✅ Step 3 consumed Step 2 output
✅ Final deliverable produced
```

Use file-based handoffs between steps — more reliable than scheduler context injection.

---

## Anti-Patterns

### ❌ Design Infrastructure Blindsided

```
"Build the features, we'll figure out execution later"
→ Agents timeout, lose state, unreliable delivery
```

**Fix:** Design execution infrastructure FIRST when multi-step reliability required.

---

### ❌ Assume "Hours" for Complex Work

```
"Agents are fast, this 14-day project will take 1 day"
→ Dependencies still sequential, testing still required
→ Compressed timeline unrealistic
```

**Fix:** Account for architectural dependencies. 50% compression possible, not 90%.

---

### ❌ Skip Phase 0 (Execution Reliability)

```
"Cron works for daily reports, it'll work for workflows"
→ Cron misses windows, dependencies manual, failures silent
```

**Fix:** Phase 0 = execution infrastructure. Phase 1+ = features on reliable foundation.

---

## Related Skills

- `delegation-troubleshooting` — Fix existing cron/delegation issues
- `multi-agent-task-decomposition` — Break tasks into parallel/sequential subtasks
- `iterative-agent-pipeline` — Multi-iteration refinement patterns
- `persistent-agent-invocation` — Cron vs delegate_task trade-offs

---

## Summary

**The hard truth:** Current infrastructure (cron, ephemeral delegation) cannot reliably execute multi-day, multi-step agent workflows without human babysitting.

**The solution:** Design execution infrastructure (event-driven state machines, checkpointing, circuit breakers) before attempting complex multi-agent projects.

**The timeline:** Infrastructure first (6-8 weeks), then features on solid foundation.

**The alternative:** Human-in-the-loop coordination for all multi-step work (feasible but not autonomous).

---

v1.0.0 — Execution infrastructure design for reliable multi-agent workflows