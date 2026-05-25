---
name: multi-agent-task-decomposition
description: Decompose complex multi-faceted tasks and distribute across specialized agent teams with parallel execution and sequential dependency chaining. Covers breaking work into role-based subtasks, dispatching via cronjob with skills=[] and context_from=[], or sequential execution via direct Python orchestration when cron fails.
triggers:
  - "have the create team build"
  - "delegate this to the team"
  - "split this among agents"
  - "parallel agent execution"
  - "agents work together on"
  - "distribute this task across agents"
  - "assign this to mason/forge/prism"
  - "use multiple agents for this"
  - "break this into subtasks for agents"
  - "create team timed out"
  - "cron job failed agent execution"
  - "run agents in sequence not parallel"
tags: [agent-orchestration, task-decomposition, parallel-execution, team-workflow, sequential-execution, fallback-pattern]
version: 1.1.0
---

# Multi-Agent Task Decomposition

## Purpose

Decompose complex tasks into specialized subtasks and distribute across an agent team for parallel execution with sequential dependencies where needed.

## When To Use

Use this skill when:
- A complex task has multiple distinct components (architecture, implementation, testing, integration)
- Multiple agents with different specialties can work in parallel
- Some components depend on others (sequential chain within parallel execution)
- The user explicitly asks to "have the Create Team do this" or similar

**Prerequisites:**
- Agent team exists with defined roles (e.g., Mason/Forge/Prism/Keystone)
- Task can be logically split by specialty

**Not for:**
- Single agent tasks (use persistent-agent-invocation)
- Initial team setup (use agent-team-workflow-orchestration)
- Simple sequential delegation (use delegate_task)

---

## The Decomposition Pattern

### Step 1: Identify Agent Specialties

**Create Team roles:**
- **Mason** — Architecture, structure, patterns
- **Forge** — Implementation, coding, HTML/CSS/JS
- **Prism** — Testing, validation, JavaScript interactions
- **Keystone** — Integration, review, merging components

**Extendable to any team:**
- Match task components to agent specialties
- Identify parallelizable work (independent components)
- Identify sequential work (dependencies)

### Step 2: Decompose Task

**Break into role-based subtasks:**

```
User Request: "Build v6 dashboard with Intelligence Quality, Fleet Health, 
               KG Graph, Memory, Analytics, Ask Kiri, New Operation"

Component Analysis:
├── Architecture & Structure → Mason (independent)
├── HTML/CSS Implementation → Forge (parallel to Mason)
├── JavaScript Interactions → Prism (parallel to Mason/Forge)
├── KG Graph (from vf3) → Keystone needs above (sequential)
└── Final Integration → Keystone (sequential, depends on all)
```

### Step 3: Dispatch via Cronjob

**Parallel execution (independent):**

```python
# Mason — Architecture (runs immediately)
cronjob(
    action="run",
    skills=["Mason"],
    prompt="Design architecture for X... [specific requirements]",
    context_from=[]  # No dependencies
)

# Forge — Implementation (runs immediately, parallel)
cronjob(
    action="run",
    skills=["Forge"],
    prompt="Build HTML/CSS... [specific requirements]",
    context_from=[]  # No dependencies, parallel to Mason
)

# Prism — Interactions (runs immediately, parallel)
cronjob(
    action="run",
    skills=["Prism"],
    prompt="Build JavaScript... [specific requirements]",
    context_from=[]  # No dependencies, parallel to others
)
```

**Sequential execution (dependent):**

```python
# Keystone — Integration (waits for all)
cronjob(
    action="run",
    skills=["Keystone"],
    prompt="Merge all components into final X...",
    context_from=[
        "mason-job-id",   # Load Mason's architecture
        "forge-job-id",   # Load Forge's implementation
        "prism-job-id"    # Load Prism's interactions
    ]
)
```

### Step 4: Coordinate via MemPalace

**Save task context for cross-reference:**

```python
mempalace_save(
    palace="personality_memory_palace",
    wing="agent_org",
    hall="[project]",
    room="[task]",
    closet="decomposition",
    content="""
    TASK: [Description]
    AGENT ASSIGNMENTS:
    - Mason: [Architecture/Structure]
    - Forge: [Implementation]
    - Prism: [Testing/Interactions]
    - Keystone: [Integration]
    
    JOB IDs:
    - mason: [job-id-1]
    - forge: [job-id-2]
    - prism: [job-id-3]
    - keystone: [job-id-4]
    
    DEPENDENCIES:
    - Parallel: Mason, Forge, Prism
    - Sequential: Keystone depends on above
    """,
    importance=5
)
```

### Step 5: Handle Results

**Each agent delivers to:**
- Files (e.g., `~/command_center/v6_architecture.md`)
- MemPalace (for context chaining)
- Console output (for verification)

**Keystone's job:** Merge deliverables into final output

---

## Cron Execution Guardrails

### Scheduling Precision

**When user says "in X minutes" — they mean ONE-TIME, not recurring.**

❌ **Wrong**: `schedule="*/2 * * * *"` (runs every 2 minutes forever)
✅ **Right**: `schedule="27 16 6 5 *"` (runs once at 16:27 on May 6)

**Calculate exact one-time cron:**
```python
from datetime import datetime, timedelta

future = datetime.now() + timedelta(minutes=2)
cron_expr = f"{future.minute} {future.hour} {future.day} {future.month} *"
# Result: "27 16 6 5 *" (one-time at 16:27 CDT)
```

### Model Override Format (Critical)

❌ **Wrong**: `model="deepseek-v4-pro"` (string — fails silently, uses config default)
✅ **Right**: `model={"model": "deepseek-v4-pro", "provider": "custom"}` (object — explicit override)

```python
cronjob(
    action="create",
    model={"model": "deepseek-v4-pro", "provider": "custom"},  # ← OBJECT
    ...
)
```

### Auto-Monitoring Pattern

**After creating a cron job, poll for completion:**

```python
# Expected output file path
expected_file = "~/command_center/model_test/agent_deliverable.json"

# Poll after expected completion (give 2-3x buffer)
# Check: ls -la ~/command_center/model_test/ | grep deliverable
```

**Never assume "created" = "completed".** Always verify output files exist before declaring success to user.

### Context Chaining with Files

When agents depend on previous deliverables (like Keystone → Codex output):

```python
# Keystone reads Codex's file as input
keystone_prompt = """
Read this file FIRST: /home/user/command_center/model_test/codex_research.md
Then produce your analysis...
"""
```

This decouples agents from `context_from` timeouts — file-based handoff is more reliable than scheduler-based context injection.

---

## Modern Execution: Hermes Profile-Based (Recommended)

**Current Best Practice:** Use native Hermes profiles instead of cron for immediate, reliable execution.

### Pattern: Multi-Phase Orchestration with Phase Gates

**Overview:** Sequential phases where agents within each phase run in parallel.

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: Foundation Research (Parallel)                     │
│  • scope: UI framework research                             │
│  • intel: Competitor analysis                               │
│  • horizon: Market trends                                   │
│  [Gate: All outputs written before Phase 2]                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: Architecture (Sequential Validation)               │
│  • mason: Architecture blueprint (requires Phase 1)          │
│  • keystone: Technical standards (parallel to mason)         │
│  • vantage: UX design spec (parallel to mason)               │
│  [Gate: Architecture approved before Phase 3]               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: Build (Parallel Tracks)                          │
│  • forge: Implementation                                    │
│  • prism: Test suite                                         │
│  • codex: Codebase analysis                                  │
│  • relay: CI/CD pipeline                                     │
│  [Gate: Tests pass before Phase 4]                           │
└─────────────────────────────────────────────────────────────┘
```

### Implementation: Phase-Gate Pattern with File Handoff

**Step 1: Create orchestration workspace**

```python
import os
workspace = os.path.expanduser("~/command_center/orchestration/run_001/")
os.makedirs(f"{workspace}phase1_outputs", exist_ok=True)
os.makedirs(f"{workspace}phase2_outputs", exist_ok=True)
os.makedirs(f"{workspace}phase3_outputs", exist_ok=True)
```

**Step 2: Deploy Phase 1 agents in parallel**

```python
# Deploy all Phase 1 agents simultaneously
agents_p1 = [
    ("scope", "Research UI frameworks...", "kimi-k2.5"),
    ("intel", "Analyze competitor patterns...", "mistral-large-3:675b"),
    ("horizon", "Research market trends...", "mistral-large-3:675b")
]

for agent, task, model in agents_p1:
    # Native profile spawning - immediate execution
    cmd = f'hermes -p {agent} -m {model} -z "{task}"'
    # Agents write to absolute paths in workspace
```

**Step 3: Wait for Phase 1 completion**

```python
import time
import glob

# Poll for outputs
def wait_for_phase(phase_dir, expected_count, timeout=300):
    start = time.time()
    while time.time() - start < timeout:
        files = glob.glob(f"{phase_dir}/*.md")
        if len(files) >= expected_count:
            return True
        time.sleep(10)
    return False

# Gate: Phase 1 must complete before Phase 2
if wait_for_phase(f"{workspace}phase1_outputs", 3):
    deploy_phase_2()
else:
    raise Exception("Phase 1 timeout")
```

**Step 4: Deploy Phase 2 with context from Phase 1**

```python
# Phase 2 agents can read Phase 1 outputs for context
mason_task = """
Read Phase 1 research from {workspace}phase1_outputs/
Then design architecture...
Save to {workspace}phase2_outputs/mvp_architecture.md
""".format(workspace=workspace)

# Deploy sequentially or parallel based on dependencies
mason -z "{mason_task}"
keystone -z "Review and approve..."
vangage -z "Design UX..."
```

### File-Based Context Passing

```python
# Phase 3 reads Phase 2 deliverables
forge_task = """
Read architecture from {workspace}phase2_outputs/mvp_architecture.md
Implement components per spec.
Save to {workspace}phase3_outputs/components/
"""

# Parallel execution
forge -z "{forge_task}" &
prism -z "Create tests..." &
wait  # Both complete before Phase 4
```

### Tracking with Todo

```python
# Track phase status
todo(todos=[
    {"id": "p1", "content": "Phase 1: UI Research", "status": "completed"},
    {"id": "p2", "content": "Phase 2: Architecture", "status": "in_progress"},
    {"id": "p3", "content": "Phase 3: Build", "status": "pending"},
    {"id": "p4", "content": "Phase 4: Degradation Detection", "status": "pending"}
])
```

## Execution Patterns

### Pattern A: Full Parallel + Final Integration

```python
# All agents start immediately
mason_job = cronjob(skills=["Mason"], prompt="...")
forge_job = cronjob(skills=["Forge"], prompt="...")
prism_job = cronjob(skills=["Prism"], prompt="...")

# Keystone waits, integrates all
keystone_job = cronjob(
    skills=["Keystone"],
    prompt="Integrate architecture + implementation + interactions",
    context_from=[mason_job, forge_job, prism_job]
)
```

### Pattern A2: Profile-Based Parallel (Modern)

```python
# Deploy agents in parallel using native profiles
import concurrent.futures

def deploy_agent(agent_name, task, model):
    result = subprocess.run(
        ["hermes", "-p", agent_name, "-m", model, "-z", task],
        capture_output=True,
        text=True
    )
    return {"agent": agent_name, "success": result.returncode == 0}

agents = [("mason", "Design...", "deepseek-v4-pro"), 
          ("forge", "Build...", "kimi-k2.5"),
          ("ember", "Research...", "mistral-large-3:675b")]

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(lambda a: deploy_agent(*a), agents))
```

**CRITICAL: `delegate_task` vs `hermes -p` Dispatch**

There are TWO ways to dispatch work to agents — they are NOT equivalent:

| Method | Creates | Has SOUL.md | Use Case |
|--------|---------|-------------|----------|
| `delegate_task(role="forge")` | **Subagent** - ephemeral worker | ❌ No - generic context only | Quick, throwaway tasks |
| `hermes -p forge` | **Real Agent** - full profile | ✅ Yes - complete identity, skills, patterns | Production work |

**When to use which:**
- Use **`hermes -p <agent>`** (via terminal) when you need the actual agent with its SOUL.md, skills, and established patterns
- Use **`delegate_task`** only for ephemeral subagents when you don't need agent identity

**Wrong Pattern (creates subagent):**
```python
delegate_task(
    role="forge",  # Just a label, not the real @forge
    goal="build feature"
)
# → Faceless worker with generic capabilities. No SOUL.md loaded.
```

**Correct Pattern (spawns real agent):**
```python
terminal(
    command="hermes -p forge --message 'build feature'",
    background=True,
    notify_on_complete=True
)
# → Real @forge agent with SOUL.md, skills, and architectural knowledge
```

**Rule:** For multi-agent orchestration in production, always use `hermes -p <agent>` dispatch, never bare `delegate_task`.

### Pattern B: Staged Parallel Groups

```python
# Stage 1: Foundation
design_jobs = [
    cronjob(skills=["Mason"], prompt="Design UI..."),
    cronjob(skills=["Scope"], prompt="Research tech...")
]

# Stage 2: Build (depends on design)
build_jobs = [
    cronjob(
        skills=["Forge"],
        prompt="Implement from designs...",
        context_from=design_jobs
    ),
    cronjob(
        skills=["Relay"],
        prompt="Setup infrastructure...",
        context_from=design_jobs
    )
]

# Stage 3: Validate (depends on build)
prism_job = cronjob(
    skills=["Prism"],
    prompt="Test implementation...",
    context_from=build_jobs
)
```

### Pattern C: Quick Parallel (No Integration)

```python
# Multiple agents work independently, no final merger
cronjob(skills=["Mason"], prompt="Audit architecture...")
cronjob(skills=["Forge"], prompt="Refactor module A...")
cronjob(skills=["Prism"], prompt="Write tests...")
# No Keystone — parallel work streams
```

---

## Reference Passing

### Passing Original Command Center + vF3 References

When user references multiple sources:

```
User: "have the create team make v6 using 
        original command center for Intelligence Quality and 
        vf3 for KG Graph"

Agent Assignments:
- Mason: Architecture using both sources
  (specifies what comes from where)
- Forge: Implementation with source attribution
  ("Intelligence Quality from original style, KG from vf3")
- Prism: Interactions matching vf3 patterns
- Keystone: Merge with source preservation
```

**In prompts:**
```
Mason prompt: "Design v6 using original command-center.html as 
               reference for Intelligence Quality module and 
               vf3 for team container patterns"

Forge prompt: "Build HTML/CSS. Intelligence Quality module should 
               mirror original command-center.html style. 
               KG Graph extract from command-center-vf3.html"
```

---

## Example: Complete Session

### User Request
```
"Build Command Center v6 with:
- Intelligence Quality (original CC style)
- Fleet Health (vf3 team containers, cleaner)
- KG Graph (from vf3)
- Memory & KG combined
- Performance & Analytics
- Ask Kiri functional
- New Operation modal

Use Create Team, make it remotely accessible"
```

### Decomposition
```
ANALYSIS:
├── Architecture (component hierarchy, layouts, data flow)
├── Implementation (HTML/CSS for 6 modules)
├── Interactions (JavaScript, modals, real-time)
├── Integration (merge all + KG graph extraction)

AGENT ASSIGNMENT:
├── Mason → Architecture
├── Forge → HTML/CSS Implementation
├── Prism → JavaScript Interactions
└── Keystone → Integration (waits for above)
```

### Execution
```python
# Step 1: Dispatch parallel jobs
cronjob(
    skills=["Mason"],
    prompt="Design v6 architecture... Original CC + vf3 refs...",
    context_from=[]
)

cronjob(
    skills=["Forge"],
    prompt="Build HTML/CSS... 6 modules... dark theme...",
    context_from=[]
)

cronjob(
    skills=["Prism"],
    prompt="Build JavaScript... Ask Kiri sends to Kiri... New Operation modal...",
    context_from=[]
)

# Step 2: Dispatch integration (depends on above)
cronjob(
    skills=["Keystone"],
    prompt="Merge all into command-center-v6.html. Extract KG from vf3...",
    context_from=["mason-job", "forge-job", "prism-job"]
)
```

### Result
```
OUTPUT: ~/command_center/command-center-v6.html
- Mason's architecture incorporated
- Forge's HTML/CSS included
- Prism's JavaScript wired
- KG Graph from vf3 extracted
```

---

## Comparison with Other Skills

| Skill | Best For | This Skill Covers |
|-------|----------|-------------------|
| `persistent-agent-invocation` | Single agent, technical execution | Multi-agent orchestration |
| `agent-team-workflow-orchestration` | Initial team deployment | Using existing team for work |
| `iterative-agent-pipeline` | Multi-iteration refinement | Parallel decomposition |
| `delegate_task` | Ephemeral subagents | Persistent team agents |
| This skill | Breaking complex work across a team | Decomposition + orchestration |

---

## Key Principles

1. **Match to Specialty:** Mason→Architecture, Forge→Code, Prism→Testing
2. **Parallel First:** Dispatch independent work simultaneously
3. **Context Chain:** Use `context_from` for sequential dependencies
4. **MemPalace Anchor:** Save task decomposition for reference
5. **Keystone Finalizes:** Integration agent depends on all others

---

## Common Pitfalls

### The "Every 2 Minutes" Trap

**User says**: "Run this in 2 minutes"  
**You think**: `*/2 * * * *` — WRONG! That's EVERY 2 minutes forever.

**Correct interpretation**: "Schedule ONE-TIME at current time + 2 minutes"

```python
now = datetime.now()
future = now + timedelta(minutes=2)
schedule = f"{future.minute} {future.hour} {future.day} {future.month} *"
```

### The String Model Trap

String model = silent failure + uses default from config. Always use object format with explicit provider.

### The "Created = Running" Assumption

Jobs can be created but:
- Scheduler not running
- Time already passed (missed the window)
- Schedule format error (invalid cron)

**Verify**: Check `jobs.json` for `last_run_at`, `last_status`, and poll output files.

### The "I'll Remember to Check" Trap

You won't. Automate it:
- Record expected output paths at creation time
- Poll for files after expected completion + 2-3 min buffer
- Report file existence/size to user, not just "job scheduled"

---

## Anti-Patterns

- ❌ Sequential when parallel works (slower)
- ❌ Same agent for everything (loses specialization)
- ❌ No context_from for dependencies (broken integration)
- ❌ Skip MemPalace tracking (lost visibility)
- ❌ Don't specify references (agents miss requirements)

---

## Reminder

```
User says: "have the create team build X"
Hermes thinks: "complex task, multiple specialties, parallel execution"
Hermes does:
  1. Decompose by specialty
  2. Dispatch parallel (Mason/Forge/Prism)
  3. Chain sequential (Keystone)
  4. Save to MemPalace
  5. Deliver integrated result
```

**The goal:** Complex work done fast by the right specialists, properly integrated.

v1.0.0 - Multi-agent task decomposition and parallel execution
