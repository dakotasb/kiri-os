---
name: implementation-status-audit
description: Audit architecture documentation against actual system implementation to identify gaps between documented vision and operational reality. Prevents "documentation drift" where aspirational designs mislead users about what currently works.
triggers:
  - "Are we congruent with design intent"
  - "validate the architecture is implemented"
  - "what is actually built vs documented"
  - "documentation vs reality gap"
  - "agent framework actually working"
  - "system architecture validation needed"
  - "is this implemented or just spec'd"
  - "multi-model routing actually working"
  - "agents use different models or same model"
  - "task-specific model routing implemented"
  - "how do I get actual multi-model execution"
version: 1.0.0
tags: [architecture-audit, implementation-status, documentation-drift, system-validation, agent-framework]
---

# Implementation Status Audit

## The Pattern

**Documentation exists:** "Agents are deployable entities with memory"  
**Reality is:** Configs exist, runtime doesn't  
**User feels:** Gaslit, confused, frustrated

This audit distinguishes between:
- **Architecture** (design intent, documented)
- **Implementation** (what actually runs)
- **Configuration** (stored data, not processes)

---

## Audit Framework

### Step 1: Classify Each Component

For every claimed capability, ask:

| Question | Yes | No |
|----------|-----|-----|
 Does config exist in MemPalace/files? | Configuration ✅ | Not designed ❌ |
 Does runtime/execution layer exist? | Implementation ✅ | Spec only ⚠️ |
 Can I invoke it immediately? | Operational ✅ | Scheduled/delayed ⏭️ |

**Reality levels:**
1. **SPEC** — Documented, no code (aspirational)
2. **CONFIG** — Files exist, not executable (storage)
3. **SCHEDULED** — Cron jobs, batch execution (deferred)
4. **OPERATIONAL** — Real-time invocation (fully built)

---

## Common Gap Patterns in Agent Framework

### Pattern A: "Deployed" Means Config Written

**Claim:** "Create Team deployed with 6 agents"  
**Reality:** Configs in ~/command_center/agents/, no process manager
**Gap:** "Deployed" interpreted differently by user vs implementer

### Pattern B: Architecture Congruence ≠ Implementation Complete

**Claim:** "System is congruent with MemPalace design"  
**Reality:** Storage layer works, execution layer doesn't  
**Gap:** Architecture valid, implementation partial

### Pattern C: Vision Documents as Truth

**Claim:** "11 agents operational across 3 teams" (from vision doc)  
**Reality:** 11 agent configs exist, no runtime wakes them  
**Gap:** Configuration exists but dispatch layer missing

### Pattern D: API Parameter Dropping (Critical Bug)

**Claim:** `cronjob_create(model="deepseek-v4-pro")` spawns agent with that model  
**Reality:** All cron jobs use config.yaml default (`kimi-k2.5`) regardless of model param  
**Root Cause:** scheduler.py lines 880-895 — `model` not persisted to jobs.json, then overwritten by config default

**Detection:**
- Jobs show `model: null` in storage despite API parameter
- Environment shows `HERMES_MODEL: null` at runtime
- `job.get("model")` returns None → falls through to config default

**Investigation Method:**
When API parameter appears to be ignored:

1. **Check schema definition** in tool file:
   - What type does the schema expect? (string vs object)
   - What property names are defined?

2. **Trace transformation** in tool handler:
   - Find `_normalize_*` functions
   - Check `_resolve_*` functions
   - Look for `model_obj.get("model")` expecting dict but getting string

3. **Verify storage** in jobs.json:
   - Is the parameter persisting?
   - If null, drop happens between API and storage

4. **Trace execution** in scheduler:
   - Check scheduler reads field: `job.get("model")`
   - Look for fallback: `job.get("model") or config_default`
   - Verify priority: API param > env var > config

**Common Root Causes:**
- Type mismatch: Tool receives string, handler expects object
- Normalization dropping: Empty string → None → not stored
- Schema mismatch: Schema says "object" but passes string
- Scheduler fallback: `if not job.get("model")` True for None

**Impact:** Multi-model dispatch is **non-functional**.

## Bridging the Gap: Implementation Options

When audit identifies multi-model configuration without runtime:

### Option 1: OpenRouter Provider Proxy (Recommended)
```yaml
# Update config.yaml
model:
  provider: openrouter
  api_key: ${OPENROUTER_API_KEY}

# Pass model in cron job
cronjob(
    action="create",
    model="claude-3.5-sonnet",  # OpenRouter routes
    skills=["agent-name"],
    ...
)
```
**Effort:** Low (provider swap)  
**Benefit:** Immediate multi-model access via single endpoint  
**Requirement:** OpenRouter API key

### Option 2: Wrapper Script Dispatcher
Pre-execution hook reads manifest.json → sets HERMES_MODEL → spawns process

**Effort:** Medium (custom dispatcher)  
**Benefit:** Leverages existing configs  
**Requirement:** Shell/Python wrapper layer

### Option 3: Full Dispatcher Service (Long-term)
Middleware that intercepts agent tasks → reads task_mapping → routes to appropriate model

**Effort:** High (new architecture)  
**Benefit:** True multi-model execution with performance tracking  
**Requirement:** Significant development

## Method 1: File System Check

---

## How To Audit

### Method 1: File System Check
```bash
ls ~/command_center/agents/*/manifest.json  # Config exists?
ps aux | grep "revenue_strategist"          # Process running?
crontab -l | grep "revenue"                 # Scheduled?
```

### Method 2: MemPalace Query
```python
# Check for agent runtime entries vs config entries
mempalace_search("agent runtime process manager")  # Empty?
mempalace_recall(wing="revenue")                   # Configs only?
```

### Method 3: Invocation Test
```python
# Can I invoke immediately?
invoke_agent("revenue_strategist", "task")  # Tool exists? → NO
delegate_task(...)                           # Spawns generic subagent → YES
```

---

## The Honest Reporting Template

After audit, report:

```
=== IMPLEMENTATION STATUS AUDIT ===
Component: Agent Invocation System

✅ ARCHITECTURE (Documented & Valid)
- MemPalace extends agent memory
- Multi-model routing configured
- Wing/hall/room taxonomy operational

⚠️ CONFIGURATION (Stored, Not Running)
- 11 agent configs in ~/command_center/agents/
- multi-model schemas in manifests
- taxonomy populated in MemPalace

⏭️ SCHEDULED (Deferred Execution)
- cron jobs for daily reports operational
- overnight research cycles work
- 6/6 cron jobs healthy

❌ NOT IMPLEMENTED (Current Gap)
- Real-time agent process manager
- immediate invocation primitive
- AgentBus pub/sub runtime
- Command Center backend API

=== REALITY CHECK ===
User asks: "Deploy the revenue team"
What happens: Configs written ✓
User expects: Processes wake up ✗
Gap: Deployment = Config, not Runtime

=== RECOMMENDATION ===
Option A: Build missing runtime (3-5 days)
Option B: Rename "deploy" → "configure" in docs
Option C: Document gaps explicitly in vision docs
```

---

## Why This Keeps Happening

| Role | Perspective | Assumption |
|------|-------------|------------|
| User | "I have 11 agents" | Agents = running processes |
| Coordinator (Me) | "Config is deployed" | Deploy = files written |
| Vision Doc | "Architecture documented" | Describes final state |

**The mismatch:** Nobody confirmed shared definition of "deployed" and "operational."

---

## Prevention Patterns

### 1. Explicit Status Sections

Add to ALL vision documents:
```markdown
### Implementation Status
| Component | Status | Since |
|-----------|--------|-------|
| Agent Configs | ✅ Operational | 2026-05-01 |
| Agent Runtime | ❌ Not Built | — |
| AgentBus | ⚠️ Spec Only | vF.4 target |
```

### 2. "Deployed" Definition

Establish shared vocabulary:
- **Configured** = Files written ✓
- **Deployed** = Runtime scheduled/polling ✓
- **Operational** = Immediate invocation works ✓

### 3. Regular Re-audits

Every 2 weeks or major milestone:
- Inventory MemPalace for new capabilities
- Check runtime vs config status
- Update docs to reflect reality

---

## Behavioral Alignment Audit

**Beyond system state:** Sometimes components ARE built, but current behavior doesn't follow documented patterns.

### Pattern: Documented But Ignored

**What happened:**
1. Product Vision v1.0 specifies: "Use cron-based execution with skills/context_from for agent work"
2. I default to: `delegate_task(goal="do this")` (ignores documented pattern)
3. Result: Generic subagent, no config loaded, user confused

**Audit trigger:** User says "You said X in the docs but did Y" or "that's not how we decided this would work"

### Detection Framework

Before invoking tools for agent work, check:

```
Does documented pattern exist for this workflow?
├── Search memory for "Agent Framework Execution Model"
├── Check if skill exists for this pattern
└── If documented pattern ≠ default instinct → FOLLOW DOCUMENTED
```

### Common Divergence Patterns

| Documented Pattern | My Default | Correction |
|-------------------|------------|------------|
 Cron + skills[] for agent work | delegate_task() | Use cronjob |
 Multi-model from agent configs | Generic subagent | Load config |
 Delegate to Create Team agents | Spawn ephemeral | Route to persistent |

### Memory Enforcement

**When pattern established:**
```
memory action="add" target="memory" 
content="Agent Framework Execution Model: ..."
```

**When pattern changes:**
```
memory action="replace" old_text="Agent Framework..." 
content="UPDATED: ..."
```

**Rule:** Memory update required whenever execution model changes. Do not silently diverge.

### Execution Model as Documented Preference:

Some patterns are explicitly documented as canon (e.g., Kiri Product Vision v1.0). These are NOT optional optimizations — they are the system preference. Examples:

- **Agent invocation:** cron + skills + context_from (NOT delegate_task)
- **Delegation hierarchy:** User → Kiri (coordination) → Core Build Team (execution)
- **Memory constraint:** 2,200 char limit for user preferences + hard rules

### Critical Discovery: What "Agent Execution" Actually Means

**Documented/Ideal:** "Spawn autonomous agents that build artifacts"  
**Actual/Operational:** "Schedule cron jobs that load agent configs via skills=[]"

**The Gap:** Agent configs exist in MemPalace/files but there is NO real-time agent process manager. The "agents" are organizational abstractions invoked via:

```python
# What actually works (cron-based):
cronjob(
    action="create",
    skills=["mason"],  # Loads agent config from skill
    context_from=["previous-phase"],
    prompt="Build module X..."
)
# Then: cronjob(action="run", job_id=job_id) for immediate execution
```

**What does NOT work reliably:**
- `delegate_task` spawning "agents" (creates ephemeral subagent without config)
- `execute_code` with prints like "🧱 MASON:..." (roleplay, not actual agent)
- Direct implementation by coordinator pretending to be agents

**Honest Status Report Template:**
```
DOCUMENTED: "13 autonomous agents execute phases"
REALITY: "13 agent configs exist; cron executes them sequentially"
USER expectation: Agents wake up and build → ❌ Not implemented
OPERATIONAL reality: Cron loads configs, executes immediately ✅ WORKS

Correction: Use cron-based with Keystone orchestration monitoring phases
```

**When execution diverges from documented pattern:**

```
User: "You said X in the docs but did Y"

Audit response:
1. Acknowledge: "You're right, I diverged from documented pattern"
2. Verify: Check MemPalace/skill for canonical document
3. Compare: Current behavior vs documented pattern
4. Correct: Immediately switch to documented pattern
5. Enforce: Update memory to prevent recurrence

Example:
  Documented: "Agent work MUST use cron + skills + context_from"
  Behavior: Used delegate_task (ephemeral, no config loaded)
  Correction: "Switching to cron-based invocation with proper config loading"
  Memory update: "Agent Framework Execution Model: cron + skills + context_from..."
```

**Key principle:** Execution models are preferences encoded in documentation AND memory. Both must be referenced before acting. Defaulting to "what seems faster" violates system design.

### Behavioral Audit Checklist

When user feels "workflow documentation exists but not followed":

- [ ] Check if canonized document exists (MemPalace, skills)
- [ ] Check my memory for system preferences
- [ ] Compare current behavior to documented pattern
- [ ] If diverged: Acknowledge, correct, update memory to prevent recurrence
- [ ] Verify skill consumption (did I reference the right skill?)

## When User Feels "Gaslit"

**Translation:** Documentation promised X, Y doesn't work as expected, nobody clarified the gap.

**Proper response:**
```
"You're experiencing documentation drift. 
Let me audit what's actually built vs what's documented.

[Run audit framework above]

Here's the honest status. The vision is valid, 
but these specific gaps exist. Here's how we bridge them..."
```

---

## Pattern: Post-Architecture-Clarification Agent Inventory

**When:** After execution model is clarified (e.g., "agents use cron+skills, not delegate_task")

**Action:** Systematically inventory ALL agent configurations to verify readiness for new pattern

**Methodology:**

### Step 1: Discover All Config Locations
```bash
# Filesystem manifests
find ~/command_center/agents -name "manifest.json"

# MemPalace agent storage
grep -r "agent" ~/.hermes/skills/
# + mempalace_recall(wing="win_dadab976")

# AgentBus tracking
ls ~/command_center/agents/agentBus.json
```

### Step 2: Validate Each Agent Config
For each agent found, verify:
- ✅ manifest.json exists and parses
- ✅ multi-model routing configured (primary, fallback, task_mapping)
- ✅ MemPalace room mapping established
- ✅ capabilities list documented
- ✅ dependencies declared
- ✅ invocation pattern compatible with new model

### Step 3: Cross-Reference Sources
| Agent | Filesystem | MemPalace | AgentBus | Status |
|-------|-----------|-----------|----------|--------|
| mason | ✅ | ✅ | ✅ | Ready |
| forge | ✅ | ✅ | ✅ | Ready |
| [name] | ⚠️ | ✅ | ❌ | Partial |

### Step 4: Document Complete Inventory
Create comprehensive inventory document including:
- Total agent count by team
- Each agent's role, models, capabilities
- File locations (manifest paths)
- MemPalace wing/hall/room mappings
- Execution readiness status
- Invocation examples for each

**Output:** AGENT_INVENTORY.md with status "Ready for [new pattern] execution"

### Step 5: Update Canonical Docs
Ensure Product Vision or architecture docs reflect:
- Exact number of operational agents
- Complete execution pattern specification
- File locations for all configs
- Any agents configured but not yet deployed

**This prevents future "where are my agents?" confusion.**

---

## Result Template

```markdown
# Agent Framework — Complete Agent Inventory

**Total Agents:** 13 across 4 Teams  
**Status:** Ready for [pattern] execution  

## Teams
- Create Team: 8 agents ✅ Ready
- Revenue Team: 4 agents ✅ Configured  
- Market Intelligence: 1 agent ✅ Active

## invocation Cheat Sheet
cronjob(action="run", skills=["AGENT_NAME"], context_from=["previous"])

## File Locations
- Manifests: ~/command_center/agents/*/manifest.json
- AgentBus: ~/command_center/agents/agentBus.json
- MemPalace: wing=win_dadab976
```

---

## Triggers for This Skill

- User asks "is this congruent with design?" 
- User says "we said this was ready"
- After building agent teams/deployments (audit check)
- When documentation feels "aspirational"
- User escalation: "why doesn't this work"

---

## Version History

v1.0.0 - Documentation drift detection for agent framework architecture
