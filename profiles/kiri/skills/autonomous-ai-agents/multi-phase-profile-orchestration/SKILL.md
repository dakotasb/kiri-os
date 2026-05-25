---
name: multi-phase-profile-orchestration
description: Orchestrate agent deployments across multiple sequential phases using native Hermes profiles, with parallel execution within phases, file-based handoff gates, and todo-tracked status. For complex builds requiring architectural phases (design → build → test → deploy) where agents within each phase run in parallel.
triggers:
  - "deploy agents in phases"
  - "run multi-phase agent build"
  - "phase-gated agent deployment"
  - "orchestrate agent teams sequentially"
  - "build this in phases with agents"
  - "run overnight agent deployment"
  - "parallel agents within phases"
  - "sequential phase dependencies"
version: 1.0.0
---

# Multi-Phase Profile Orchestration

## Purpose

Orchestrate complex agent deployments across multiple sequential phases using native Hermes profiles. Each phase has dependencies on previous phases (sequential), but agents within a phase execute in parallel. Communication between phases uses file-based handoff to workspace directories.

## When To Use

Use this pattern when:
- Complex deliverable requires multiple sequential stages (research → architecture → build → validate)
- Agents within each stage can work in parallel
- Phase gates are required (don't start Phase 2 until Phase 1 complete)
- User expects overnight/long-running deployment with morning delivery
- Native Hermes profile system is active (not cron, not old dispatcher)

**Not for:**
- Single-phase parallel work (use `delegate_task`)
- Cron-based iterations (use `iterative-agent-pipeline`)
- Create Team pattern specifically (use `create-team-sequential-execution`)
- Simple sequential delegation (use direct profile spawning)

## Pattern: Phase-Gate Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: [Phase Name]                                       │
│  • Agent A (parallel) → Output to phase1_outputs/           │
│  • Agent B (parallel) → Output to phase1_outputs/           │
│  • Agent C (parallel) → Output to phase1_outputs/           │
│  [GATE: Poll for completion before Phase 2]                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: [Dependent Phase]                                  │
│  • Agent D reads Phase 1 outputs for context                  │
│  • Agent E reads Phase 1 outputs for context                  │
│  [GATE: Poll for completion before Phase 3]                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: [Build Phase]                                      │
│  • Multiple agents in parallel tracks                          │
│  • Each writes to subdirectories                             │
└─────────────────────────────────────────────────────────────┘
```

## Execution Flow

### Step 1: Create Workspace

### Step 1.5: Verify Base State

Before starting multi-phase orchestration, verify the starting point:

```python
# Check git state to understand current baseline
cd {workspace} && git log --oneline -5

# Verify which branch is active
git branch --show-current

# Check for uncommitted changes
git status --short

# If submodule is involved, verify it's initialized
git submodule status
git submodule update --init  # if needed
```

**Session Recovery Pattern:** When user says "I'm back, continue where we left off":
1. Look in workspace for existing files (~/command_center/, ~/kiri/)
2. Check git log for recent commits to identify active phase
3. Verify branch matches expected (e.g., fix/security-critical-issues, main)
4. If submodule work happened, use `git log --oneline --all --since=2.days` to find actual work location

```python
import os

workspace = os.path.expanduser("~/command_center/orchestration/run_001/")
os.makedirs(f"{workspace}phase1_research", exist_ok=True)
os.makedirs(f"{workspace}phase2_architecture", exist_ok=True)
os.makedirs(f"{workspace}phase3_build", exist_ok=True)
```

### Step 2: Deploy Phase 1 (Parallel)

```python
# Define agents with tasks and target models
agents_p1 = [
    ("scope", "Research task... Save to workspace/phase1_research/scope_research.md", "kimi-k2.5"),
    ("intel", "Analysis task... Save to workspace/phase1_research/intel_analysis.md", "mistral-large-3:675b"),
    ("horizon", "Market research... Save to workspace/phase1_research/horizon_trends.md", "mistral-large-3:675b")
]

# Deploy in parallel using native profiles
for agent, task, model in agents_p1:
    # Must use ABSOLUTE paths for file handoff
    subprocess.Popen([
        "hermes", "-p", agent, "-m", model, "-z", 
        f'{task}'
    ])
```

### Step 3: Gate Completion

```python
import glob
import time

def wait_for_phase(directory, expected_count, timeout=300):
    """Poll for phase completion"""
    start = time.time()
    while time.time() - start < timeout:
        files = glob.glob(f"{directory}/*.md")
        if len(files) >= expected_count:
            return True
        time.sleep(10)
    return False

# Gate: Phase 1 must complete before Phase 2
if wait_for_phase(f"{workspace}phase1_research", 3, timeout=600):
    deploy_phase_2()
else:
    handle_timeout()
```

### Step 4: Deploy Phase 2 (Reads Phase 1)

```python
# Phase 2 agents get Phase 1 outputs as context
# Files written to workspace/phase1_research/*.md

mason_task = """
Read Phase 1 research from /home/user/command_center/orchestration/run_001/phase1_research/
Then create architecture document.
Save to /home/user/command_center/orchestration/run_001/phase2_architecture/mvp_architecture.md
"""

# Sequential deployment or parallel depending on dependencies
mason_result = subprocess.run(["hermes", "-p", "mason", "-m", "deepseek-v4-pro", "-z", mason_task])
```

### Step 5: Track with Todo

```python
todo(todos=[
    {"id": "p1", "content": "Phase 1: Research", "status": "completed"},
    {"id": "p2", "content": "Phase 2: Architecture", "status": "in_progress"},
    {"id": "p3", "content": "Phase 3: Build", "status": "pending"},
    {"id": "p4", "content": "Phase 4: Validation", "status": "pending"}
])
```

## File-Based Handoff Protocol

**Critical Rule:** Agents MUST use absolute paths to workspace

```python
# ❌ BAD: Relative paths lost in profile isolation
"Save to output.md"

# ✅ GOOD: Absolute paths work from any profile
"Save to /home/user/command_center/orchestration/run_001/phase1_research/output.md"
```

**Workspace Structure:**
```
~/command_center/orchestration/
  run_001/
    phase1_research/
      scope_research.md
      intel_analysis.md
      horizon_trends.md
    phase2_architecture/
      mvp_architecture.md
      technical_standards.md
      ux_design_spec.md
    phase3_build/
      (empty until Phase 3 starts)
```

## Common Phase Patterns

### Pattern A: Research → Architecture → Build → Validate
```
Phase 1: scope, intel, horizon → Research
Phase 2: mason, keystone → Architecture (depends on Phase 1)
Phase 3: forge, prism → Build (depends on Phase 2)
Phase 4: temper, bastion → Validate (depends on Phase 3)
```

### Pattern B: Multiple Parallel Tracks
```
Phase 1: Research (3 agents parallel)
Phase 2: Design + Testing setup (2 tracks parallel, both use Phase 1)
Phase 3: Implementation (4 agents parallel, 4 subdirectories)
```

### Pattern C: Overnight Delivery
```
# Set up before user leaves
Phase 1 deployed → agents run while user away
Phase 2 auto-starts on Phase 1 completion
User returns to completed deliverables
```

## Model Assignment Strategy

Diversify models across agent families for optimal results:

```python
# Research/analysis phases: Balanced, comprehensive models
research_models = ["kimi-k2.5", "mistral-large-3:675b", "deepseek-v4-pro"]

# Architecture phases: Strong system design
architecture_models = ["deepseek-v4-pro", "kimi-k2.6"]

# Build phases: Code generation specialists
build_models = ["qwen3.5:397b", "devstral-2:123b", "kimi-k2.5"]

# Validation phases: Security/fault detection focus
validation_models = ["deepseek-v4-pro", "mistral-large-3:675b"]

# Avoid >32% concentration in any single model family
def assign_models(agents, available_models, max_concentration=0.32):
    """Distribute agents across model families"""
    total = len(agents)
    max_per_model = int(total * max_concentration)
    
    assignments = {}
    model_counts = {m: 0 for m in available_models}
    
    for i, agent in enumerate(agents):
        # Pick least-used model
        model = min(model_counts, key=model_counts.get)
        if model_counts[model] >= max_per_model:
            # Force diversity
            model = sorted(model_counts.items(), key=lambda x: x[1])[0][0]
        
        assignments[agent] = model
        model_counts[model] += 1
    
    return assignments

# Example for 22 agents across 5 model families
agents_22 = ["mason", "forge", "prism", "scope", "intel", "horizon", 
             "keystone", "vantage", "codex", "relay", "bastion", ...]
models_5 = ["kimi-k2.5", "deepseek-v4-pro", "mistral-large-3:675b", 
            "qwen3.5:397b", "devstral-2:123b"]

assignments = assign_models(agents_22, models_5)
# Result: Distributed ~4-5 agents per model, no concentration >32%
```

```bash
# Check process status
ps aux | grep "hermes -p" | grep -v grep

# Check file outputs
ls -lh ~/command_center/orchestration/run_001/phase*_*/

# Watch logs
tail -f /tmp/forge_build.log /tmp/prism_test.log
```

## Verification Checklist

- [ ] Workspace created with subdirectories for each phase
- [ ] Phase 1 agents deployed with model specifications
- [ ] Phase gate polling in place before Phase 2
- [ ] Agents use absolute paths (not relative)
- [ ] Todo tracking shows phase status
- [ ] Output files verified before declaring completion

## Example: Complete 4-Phase Orchestration

**User: "Deploy agents to build my MVP dashboard overnight"**

```python
# Phase 1: Research (scope, intel, horizon)
# Phase 2: Architecture (mason, keystone, vantage) 
# Phase 3: Build (forge, prism, codex, relay)
# Phase 4: Degradation Detection (bastion, temper)

workspace = os.path.expanduser("~/command_center/kirimvp_orchestration/")
os.makedirs(f"{workspace}phase1_ui_decision", exist_ok=True)
os.makedirs(f"{workspace}phase2_architecture", exist_ok=True)
os.makedirs(f"{workspace}phase3_build", exist_ok=True)
os.makedirs(f"{workspace}phase4_degradation", exist_ok=True)

# Phase 1: Deploy 3 agents in parallel
for agent, task, model in agents_p1:
    subprocess.Popen([...])

# Wait... poll... deploy Phase 2 when Phase 1 complete
if wait_for_phase(f"{workspace}phase1_ui_decision", 3):
    deploy_phase_2()
```

**Morning deliverable:** Working code in `phase3_build/`

## Proven Pattern: UI Framework Selection → MVP Build

**Use Case:** Tech stack decisions requiring research before implementation

```python
# Phase 1: UI Framework Decision (Parallel Research)
agents_p1 = [
    ("scope", "Research Next.js, SvelteKit, Nuxt for dashboard framework. Score each (0-100) on SSR, ecosystem, performance, DX. Save to workspace/phase1_ui_decision/", "kimi-k2.5"),
    ("intel", "Analyze UI framework ecosystem maturity, hiring implications, long-term viability. Save to workspace/phase1_ui_decision/", "mistral-large-3:675b"),
    ("horizon", "Research emerging UI trends, check if chosen framework aligns with future direction. Save to workspace/phase1_ui_decision/", "mistral-large-3:675b")
]

# Phase 2: Architecture + Design (Sequential after Phase 1)
# mason: Technical architecture → workspace/phase2_architecture/
# keystone: Standards/best practices → workspace/phase2_architecture/  
# vantage: UX design spec → workspace/phase2_architecture/

# Phase 3: Build (Parallel implementation)
# forge: Next.js dashboard code → workspace/phase3_build/mvp-dashboard/
# prism: Test suite → workspace/phase3_build/testing/
# codex: Documentation → workspace/phase3_build/documentation/
# relay: Deployment scripts → workspace/phase3_build/deployment/

# Phase 4: Degradation Detection (Validation)
# bastion: Security audit → workspace/phase4_degradation/
# temper: Logic/fault detection → workspace/phase4_degradation/
```

**Proven Results:**
- Phase 1: 632-line framework research report, Next.js selected (Score 95/100)
- Phase 2: Architecture docs + UX spec + technical standards
- Phase 3: Working Next.js 14 dashboard with 22 agents, searchable/filterable grid, dark mode
- Total agents: 22 (scales beyond Create Team's 13)

**Model Diversity Applied:**
- Research phases: kimi-k2.5, mistral-large (balanced analysis)
- Architecture: deepseek-v4-pro (strong system design)
- Build: qwen3.5, devstral-2 (code generation)
- Validation: vary by agent role

## Todo Tracking Integration

Track phase execution state for user visibility:

```python
# Initialize at start
todo(todos=[
    {"id": "p1", "content": "Phase 1: UI Framework Research (scope, intel, horizon)", "status": "in_progress"},
    {"id": "p2", "content": "Phase 2: Architecture Design (mason, keystone, vantage)", "status": "pending"},
    {"id": "p3", "content": "Phase 3: Build & Test (forge, prism, codex, relay)", "status": "pending"},
    {"id": "p4", "content": "Phase 4: Degradation Detection (bastion, temper)", "status": "pending"}
])

# Update on phase completion
todo(todos=[
    {"id": "p1", "content": "Phase 1: Complete ✓", "status": "completed"},
    {"id": "p2", "content": "Phase 2: Architecture Design", "status": "in_progress"}
], merge=True)
```

## Pattern: Research-Gated Implementation

When the user needs to decide something before building:

```
Phase 1: Research Options
  → Multiple parallel agents investigate alternatives
  → Weighted scores, trade-off analysis
  → Consensus recommendation

Gate: Research complete → Decision made

Phase 2: Architecture around chosen option
  → Design specifically for selected framework/approach
  → No longer considering alternatives

Phase 3+: Implementation
  → Build assuming Phase 1 decision
  → Validation confirms decision was sound
```

**Key insight:** Phase 1 agents make recommendation; Phase 2+ agents treat it as settled fact.

## Validation as Final Phase

Make validation/audit the last phase for production readiness:

```python
# Phase 4: Degradation Detection (Security + Logic)
phase4_agents = [
    ("bastion", "Security audit: Review Phase 3 code for vulnerabilities, auth flaws, XSS. Save report to phase4_degradation/", "deepseek-v4-pro"),
    ("temper", "Logic validation: Check for faulty logic, degradation patterns, anti-patterns. Save report to phase4_degradation/", "mistral-large-3:675b")
]

# Quality gates: Block if validation fails
if bastion_report.find("CRITICAL") > 0:
    halt_deployment()
if temper_report.find("degradation") > 0:
    flag_for_review()

# Final deliverable includes validation reports
final_package = {
    "code": "phase3_build/",
    "docs": "phase2_architecture/",
    "validation": "phase4_degradation/",
    "status": "production_ready" if validation_passed else "review_required"
}
```

**Why Final Phase:**
- Detects issues before production (not after)
- Provides audit trail for compliance
- Prevents degradation compound (no bad code on bad code)
- Clear go/no-go decision point

### Phase Completion Verification

**CRITICAL: Ensure claimed phases are ACTUALLY dispatched**

When user says: "I thought Phase 3 and 4 were already running"
→ This signals I **mentioned** phases but never **dispatched** them

**Verification Pattern:**
```python
# After claiming "Phase 3 and 4 will handle X"
# IMMEDIATELY dispatch - don't wait, don't buffer

phases_to_dispatch = [
    ("@mason", "phase_3_task"),
    ("@keystone", "phase_3_task"), 
    ("@launchpad", "phase_4_task"),
    ("@forgemaster", "phase_4_task"),
]

for agent, task in phases_to_dispatch:
    terminal(background=True, command=f'hermes -p {agent} chat -q "{task}" -Q')
    
# Confirm: "Dispatched Phase 3 (4 agents) and Phase 4 (4 agents)"
```

**Anti-Pattern:**
```markdown
❌ "The remaining issues will be handled in Phase 3 and Phase 4" 
   → User assumes they're running
   → They're NOT running
   → User frustration: "I thought they were already running"

✅ "Dispatching Phase 3 and 4 NOW:"
   → @mason for state management
   → @keystone for hydration fix
   → @launchpad for Docker
   → (4 active sessions)
```

### Swarm Mode: Massive Parallel Deployment

For deployments where **all agents run simultaneously** without phase gates (20+ agents attacking different workstreams):

### When to Use Swarm Mode

- **Scale**: 15+ agents working concurrently
- **Independence**: Agents don't depend on each other's outputs
- **Shared target**: All agents work on same codebase/system
- **Notification tracking**: Use `notify_on_complete` instead of file polling
- **Speed priority**: Complete faster than phased approach

### Swarm Deployment Pattern

```python
# Deploy 24 agents in parallel across 5 categories
agents = {
    "infrastructure": ["relay", "scope", "surge", "haven"],
    "intelligence": ["intel", "vantage", "horizon", "compass"],
    "ui_ux": ["alloy", "prism", "forge", "launchpad"],
    "documentation": ["scribe", "archivist", "chronicle", "hoard"],
    "testing": ["temper", "sentry", "bastion", "scale"],
    "bonus": ["watcher", "mediator", "quill", "drift", "harbor", "ledger", "vault", "adjunct", "forgemaster", "codex"]
}

for category, agent_list in agents.items():
    for agent in agent_list:
        terminal(
            background=True,
            command=f'hermes -p {agent} -z "Task for port 3001..."',
            name=f"{category}_{agent}",
            notify_on_complete=True
        )
```

### Monitoring Swarm Progress

```python
# Check active agent processes
terminal(command="ps aux | grep 'hermes -p' | grep -v grep | wc -l")

# Poll for status
process(action="list")  # Returns all background processes

# Each completion triggers notification with output
```

### Swarm vs Phase-Gate Trade-offs

| Aspect | Swarm Mode | Phase-Gate |
|--------|------------|------------|
| Speed | Fastest (all parallel) | Slower (sequential blocks) |
| Coordination | Minimal | Required (handoff files) |
| Risk of conflict | Higher (same files) | Lower (isolated phases) |
| Use case | Infrastructure assault | Complex multi-step builds |
| Agent count | 15-50 | 5-15 per phase |
| Tracking | Notifications | File polling |

### When Swarm Mode Works Best

✅ Dashboard hardening (agents target different components)
✅ Multi-faceted system improvements (metrics + UI + docs + tests)
✅ Emergency response (all hands on deck)
✅ Proof of concept (demonstrate agent army capability)

❌ Complex dependencies (Phase 2 needs Phase 1 output)
❌ Shared critical resources (database migrations)
❌ Production deployment (coordination required)

## Comparison with Other Skills

| Skill | Best For | This Skill Covers |
|-------|----------|-------------------|
| `create-team-sequential-execution` | Create Team pattern with Keystone PM | Generic multi-phase orchestration |
| `multi-agent-task-decomposition` | Parallel decomposition | Phase-gated sequential dependencies |
| `iterative-agent-pipeline` | Cron-based iterations | Profile-native deployment |
| `agent-team-workflow-orchestration` | Create Team full lifecycle | Any agent team, any phases |
| This skill | Phase-gated + Swarm mode orchestration | Gated phases OR massive parallel deployments |

| Skill | Best For | This Skill Covers |
|-------|----------|-------------------|
| `create-team-sequential-execution` | Create Team pattern with Keystone PM | Generic multi-phase orchestration |
| `multi-agent-task-decomposition` | Parallel decomposition | Phase-gated sequential dependencies |
| `iterative-agent-pipeline` | Cron-based iterations | Profile-native deployment |
| `agent-team-workflow-orchestration` | Create Team full lifecycle | Any agent team, any phases |
| This skill | Phase-gated profile orchestration | Sequential blocks with parallel internals |

## Key Principles

1. **Native Profiles:** Use `hermes -p agentname` (not cron, not dispatcher)
2. **Absolute Paths:** Every agent writes to workspace via full path
3. **Phase Gates:** Poll for completion before next phase
4. **Todo Tracking:** User visibility into which phase is active
5. **File Handoff:** Phase N reads Phase N-1 outputs for context

## PITFALLS: Critical Violations from Session Experience

### PITFALL 1: Dispatching Before Snapshot (USER CORRECTION: "why is 3001 down?")

**Violation:** User expects baseline server (3001) preserved while work happens on 3003.
**What I did:** Started dispatching Phase 3 agents without verifying 3001 was running.
**Result:** User confusion when 3001 was down - they expected it preserved as working baseline.

**Correct Protocol:**
```markdown
1. Verify baseline server status: "3001 running: YES"
2. Copy to 3003 workspace
3. Confirm isolation: "3001 untouched, 3003 active"
4. Only THEN dispatch on 3003
```

### PITFALL 2: Starting Phase N+1 Before Phase N Checkpoint

**Violation:** Did not create Phase 2 snapshot BEFORE starting Phase 3.
**What I did:** Dispatched Phase 3 agents, user had to stop me and demand snapshot.
**Result:** Protocol violation - "I violated the sequence"

**User Correction:** "why is there no snapshot before phase 2 which is it?"
**My response:** "I contradicted myself... I should have: 1. Snapshot Phase 2 2. Git commit 3. THEN dispatch Phase 3"

**Lesson:** Snapshot MUST exist BEFORE next phase dispatch, not created reactively.

### PITFALL 3: Assuming Instead of Verifying

**Violation:** Claimed "3001 was never running" but user KNEW it was working.
**What I did:** Trusted incomplete forensic data over user knowledge.
**User Correction:** "showing you 3003 and 3001. Mind you we started this project bc I could see 3001 was working"

**Lesson:** When user says "it was working," trust them over incomplete investigation.

### PITFALL 4: Stopping Updates Without Warning

**Violation:** After user said "goodnight," I stopped providing status updates.
**What I did:** Stopped dispatching, didn't continue overnight work.
**User Response (4 hours later):** "What has been done in the last 4 hours?" → "nothing has been done"

**Lesson:** User said "The work doesn't stop because you're sleeping" - that was explicit permission to continue, not to stop.

## Anti-Patterns

- ❌ Using cron for immediate execution (use profiles directly)
- ❌ Relative paths ("save to output.md")
- ❌ No phase gates (phases may race/overlap)
- ❌ Not polling for completion (declaring success too early)
- ❌ Skipping todo tracking (user loses visibility)
- ❌ **Dispatching before snapshot (PITFALL 1)**
- ❌ **Starting next phase before current phase checkpoint (PITFALL 2)**
- ❌ **Assuming over user knowledge (PITFALL 3)**
- ❌ **Stopping work without explicit stop signal (PITFALL 4)**

## Remember

```
User says: "build this in phases"
Hermes thinks: "multi-phase profile orchestration"
Hermes does:
  1. Create workspace with phase directories
  2. Deploy Phase 1 agents in parallel
  3. Poll for completion
  4. Deploy Phase 2 with context from Phase 1
  5. Track status with todo
  6. Deliver working code
```

v1.0.0 - Multi-phase profile orchestration with phase gates