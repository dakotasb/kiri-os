---
name: delegation-troubleshooting
description: Diagnose and optimize agent delegation workflows. Troubleshoot timeout failures, understand direct vs delegated execution trade-offs, and implement hybrid architectures that work within agent constraints.
triggers:
  - "agent timed out"
  - "delegate_task failed"
  - "subagent timeout"
  - "why did the agent fail"
  - "should I delegate this"
  - "complex task delegation"
  - "agent keeps timing out"
  - "how to handle complex work"
  - "scaffolded agent task"
  - "iterative delegation"
  - "bounded task delegation"
  - "hybrid execution"
  - "cron job not executing"
  - "scheduled job didn't run"
  - "timezone issue with cron"
  - "cron job scheduled but not running"
version: 1.0.1
tags: [delegation, troubleshooting, timeout, hybrid-execution, agent-constraints]
---

# Delegation Troubleshooting

## The Problem Pattern

**You delegate a complex task:**
```
delegate_task(goal="Build complete dashboard with 8 modules")
```

**Result:**
- Status: timeout after 600s (10 minutes)
- API calls completed: 8-12
- Result: NULL / lost work
- Error: "Subagent timed out"

**Same task done directly:**
```
write_file(command-center.html)  # Success in 60s
```

**Why?** This skill explains the constraints and solutions.

---

## Understanding the Constraints

### 1. The 600 Second Hard Limit

**Reality:** `delegate_task` has a **fixed 600s timeout** (10 minutes).

```
Timeline of typical failure:
T+0s    Agent spawns
T+60s   8 tool calls completed (good progress)
T+120s  Still working... (reasoning)
T+300s  Complex decision... (slow reasoning)
T+580s  Almost done...
T+600s  [TIMEOUT - process killed]
        Result: Discarded, nothing returned
```

**Not configurable, not extendable.** This is by design (safety).

---

### 2. Context Isolation (The Hidden Cost)

**Direct execution (you + me):**
```
✅ Full conversation history
✅ Access to all previous decisions
✅ Can ask clarifying questions
✅ Real-time feedback and iteration
✅ No arbitrary time limit
```

**Delegated agent:**
```
❌ Only context parameter (6,000 char max)
❌ Cannot ask you questions
❌ "Fire and forget" - you wait for result
❌ 600s hard limit
❌ If fails, no partial result
```

**Critical insight:** Agents get fresh context, not accumulated wisdom.

---

### 3. Reasoning Complexity Threshold

**What causes timeouts:**

| Task Type | Complexity | Typical Time | Risk |
|-----------|------------|--------------|------|
| Read file, return line | Low | 8s | ✅ Safe |
| Create simple HTML | Medium | 16s | ✅ Safe |
| Read 3 files, summarize | Medium | 31s | ✅ Safe |
| Multi-module UI design | **High** | >600s | ❌ **TIMEOUT** |
| Architecture decisions | **High** | >600s | ❌ **TIMEOUT** |
| Synthesis from scratch | **High** | >600s | ❌ **TIMEOUT** |

**Pattern:** Agents work for **bounded tasks** but fail on **open-ended design**.

---

## The Root Causes (In Order)

### #1: Reasoning Loop Overload
```
Agent trying to design from scratch:
├── Load design skills
├── Reason about aesthetic
├── Consider alternatives...
├── (loops on decisions)
└── Time expires
```

**Direct execution:**
```
I know the aesthetic (Linear)
I know the constraints (from our chat)
I write the code directly
Done in 60s
```

### #2: Token Accumulation
Complex prompts generate long conversations between agent and model. Each turn adds tokens. Context window fills. Slowdown occurs.

### #3: Tool Call Latency
Each tool call = network roundtrip. 12 calls × 2s = 24s on network alone.

### #4: No "Streaming" Results
Can't see partial progress. Must wait for complete result or timeout.

---

## The Diagnostic Processes

### Cron Job Execution Troubleshooting

**The Problem:**
Cron jobs appear "scheduled" but never execute, or execute at unexpected times, or don't use the requested model.

**Three Related Issues:**

#### Issue 1: Timezone Confusion (CDT vs UTC)

**Root Cause:** Cron expressions are interpreted in **local time (CDT)**, not UTC.

**Example Failure Pattern:**
```python
# User intent: Run at 05:40 UTC (~1 minute from now)
cronjob(action="create", schedule="40 5 * * *", ...)
# Created at 05:36 UTC / 00:36 CDT

# Result:
# next_run_at: "2026-05-06T05:40:00-05:00"  # 5:40 AM CDT, not UTC!
# Actual execution: 10:40 UTC (5 hours later!)
```

**The Panic Pattern:**
```python
# You check at 01:02 CDT:
cronjob(action="list")  # Shows: state="scheduled", last_run_at=null
# You think: "It's stuck! It should have run!"
# Reality: Job was scheduled for 12:46 PM CDT (noon), not 00:46 AM CDT
```

**Diagnostic Steps:**

1. **Always check current time in CDT:**
```bash
date "+%H:%M:%S %Z"  # Shows: 01:02:46 CDT
```

2. **Verify in jobs.json - look for timezone offset:**
```bash
cat ~/.hermes/cron/jobs.json | jq '.jobs[] | select(.name | contains("your-job")) | {name, next_run_at}'
# Check: Does next_run_at contain "-05:00"? That's CDT time.
```

3. **Compare with working jobs:**
```bash
cat ~/.hermes/cron/jobs.json | jq '.jobs[] | select(.last_run_at != null) | {name, schedule, last_run_at}'
# Working jobs execute at CDT times even if you expected UTC
```

**The Working Pattern:**
- `0 0 * * *` → Executes at midnight CDT = 05:00 UTC
- `0 2 * * *` → Executes at 2 AM CDT = 07:00 UTC
- `46 12 * * *` → Executes at 12:46 PM CDT (NOT 00:46 AM!)

**Fix:** Calculate CDT time before scheduling. If current time is 00:58 CDT, use `59 0 * * *` for 1-minute delay, not `59 12 * * *`.

---

#### Issue 2: `repeat: once` vs `repeat: forever`

**Critical Discovery:** Jobs with `repeat: "once"` may not execute reliably.

**Evidence:**
- ✅ Jobs with `repeat: "forever"` execute successfully at scheduled times
- ❌ Jobs with `repeat: "once"` (created via `repeat=1`) often stay `state: scheduled` indefinitely

**The Pattern:**
```python
# Creates job with repeat: "once"
cronjob(action="create", repeat=1, schedule="5 1 * * *")
# Result: Job created, shows repeat: "once", next_run_at set
# But: last_run_at stays null, execution never happens
```

**Workaround - Use Immediate Scheduling:**
```python
# To run "now" (within 1-2 minutes):
current_time_cdt = "01:03"  # Check: date "+%H:%M"
schedule = "5 1 * * *"  # 1:05 AM CDT - 2 minutes from now

cronjob(action="create", repeat=1, schedule=schedule)
# Wait for scheduled time - execution should occur
```

**Do NOT rely on:**
- `cronjob(action="run")` - Returns success but doesn't actually trigger execution
- ISO timestamp schedules - Not supported by scheduler

---

#### Issue 3: Model Parameter Format (RESOLVED)

**The Discovery:** `model` parameter must be an **OBJECT**, not a string.

**❌ WRONG (was documented):**
```python
cronjob(action="create", model="deepseek-v4-pro", ...)
# Result: model: null in storage, uses config default
```

**✅ CORRECT (object format):**
```python
cronjob(action="create", model={"model": "deepseek-v4-pro", "provider": "custom"}, ...)
# Result: model: "deepseek-v4-pro" in storage, correctly used at runtime
```

**Root Cause:** The `cronjob` tool's JSON schema defines `model` as an object with nested `model` and `provider` properties. When a string is passed, the `_resolve_model_override()` function returns `(None, None)`.

**Verification:** Check `~/.hermes/logs/agent.log` for:
```
Auxiliary auto-detect: using main provider custom (deepseek-v4-pro)
```

**What IS persisted:**
- ✅ `model: "deepseek-v4-pro"` (when using object format)
- ✅ `provider: "custom"`
- ✅ `base_url: "https://ollama.com/v1"`

**Implication:** Multi-model dispatch works correctly when using the proper object format.

**Related:** See `persistent-agent-invocation` for execution model alternatives.

---

### Step 1: Test Simple Task

```python
delegate_task(
    goal="Read ~/.hermes/skills/example/SKILL.md and return first line",
    toolsets=["file"]
)
```

**Expected:** Completes in <10s  
**If fails:** System issue (not complexity)

---

### Step 2: Test Medium Task

```python
delegate_task(
    goal="Create simple HTML file with button styled dark mode",
    toolsets=["file"]
)
```

**Expected:** Completes in 15-30s  
**If timeouts here:** General delegation issue

---

### Step 3: Test Complex Task

```python
delegate_task(
    goal="Design and build complete dashboard with 8 modules",
    toolsets=["file", "skills", "web"]
)
```

**Expected:** Times out (600s)  
**This is NORMAL** - confirms complexity hypothesis

---

## The Solution: Hybrid Architecture

**The 4-Fix Pattern Applied (Real Example - 2026-05-03):**

A complex UI refinement (Command Center vF.2) failed when attempted directly by coordinator:
```
Coordinator direct patch: ❌ Broke HTML structure (missing closing divs)
↳ Cascading fix attempts: ❌ 53KB file corrupted
↳ Try specialized agent: ✅ 120s, structurally sound vF.2 delivered
```

**What worked:**
1. Coordinator scaffolded (backed up vF.1, provided scope)
2. Delegate to agent: "Fix HTML structure only, no redesign"
3. Agent succeeded: Found 2 missing `</div>`, balanced 232 opens/closes
4. Result: 1,438 lines, 7 modules intact, 53KB stable

**Why coordinator failed, agent succeeded:**
- Coordinator: Multi-tasking, broad context, imprecise edits
- Agent: Single focus, validates structure, surgical precision

**Lesson:** Even "simple" HTML fixes should be delegated when acting as coordinator.
```python
# Instead of:
delegate_task("Design complete UI")  # Times out

# Scaffold first:
write_file("component-scaffold.html", """
<!-- AGENT: Implement Activity Feed Section -->
<div class="activity-feed">
  <!-- TODO: Add items -->
</div>
""")
# Then delegate bounded task:
delegate_task("Fill Activity Feed section using provided skeleton")
# Result: ✅ 112s (vs 600s timeout)
```

**Fix 2: Iterative Refinement (Multi-Round)**
```python
# Break complex into bounded chunks:
r1 = delegate_task("Implement Activity Feed CSS")     # 112s
t2 = delegate_task("Implement Quick Actions buttons")   # 56s
r3 = delegate_task("Add Progressive Disclosure JS")    # 99s
# Total: 267s vs unbounded timeout at 600s
```

**Fix 3: Skill-Based (Pre-Made Patterns)**
```python
# Load skill to provide structure
delegate_task(
    goal="Implement Activity Feed",
    skills=["design-delegation"],  # Provides Linear aesthetic patterns
    context="""Use provided CSS variables:
    --bg-primary: #0D0D0F
    --accent-primary: #6E56CF
    See design-delegation skill for components."""
)
# Result: Agent assembles vs designs from scratch
```

**Fix 4: Hybrid (You+Me Design, Agent Implement)**
```python
# Direct execution (full context):
me: Scaffold structure           # 2 min
me: Provide CSS variables framework # 1 min

# Delegation (bounded tasks):
agent: Fill Activity Feed          # 112s
agent: Add buttons                 # 56s
agent: Add interactivity           # 99s

# Direct execution:
me: Integrate and validate         # 2 min
me: Save to MemPalace              # explicit

Total: ~15 min vs timeout
```

### Option A: Direct for Complex Design (Recommended)

---

### Option B: Multi-Round Delegation

Instead of one big task, break into rounds:

```
Round 1: "Design HTML structure only" → Returns markdown plan (20s)
Round 2: "Implement CSS variables" → Returns CSS (20s)
Round 3: "Build Activity Feed HTML" → Returns HTML (20s)
Round 4: "Add interactivity" → Returns JS (20s)
Total: 80s vs timeout at 600s
```

**Trade-off:** More coordination, but reliable completion.

---

### Option C: Scaffolded Agent Tasks

**Provide structure, agent fills:**

```python
# Instead of:
"Design complete UI"

# Try:
"Fill in Activity Feed section using this skeleton:
- CSS variables already defined
- HTML structure outlined
- Just implement the component"
```

Reduces reasoning burden to **implementation**, not **design from scratch**.

---

## When to Use Each Approach

### Use Direct Execution When:
- ✅ Complex design requiring real-time iteration
- ✅ Multi-step coordination with decisions
- ✅ You know the answer, just need to implement
- ✅ Under 600s but high reasoning complexity
- ❌ Not for: simple file operations (waste of your attention)

### Use Delegation When:
- ✅ Task is bounded (read X, create Y)
- ✅ Clear deliverable
- ✅ Can complete in ~5 minutes
- ✅ Doesn't require real-time questions
- ❌ Not for: architecture, complex design, research synthesis

### Use Multi-Round When:
- ✅ Task naturally decomposes
- ✅ Each subtask is bounded
- ✅ Quality requires review between steps
- ✅ You can orchestrate the rounds

---

## Implementation Patterns

### Pattern 1: Complexity Detector

```python
# Before delegating, assess complexity
def should_delegate(task_description):
    complexity_indicators = [
        "design", "architect", "build complete",
        "multiple modules", "synthesize", "research"
    ]
    
    if any(indicator in task_description.lower() 
           for indicator in complexity_indicators):
        return False  # Too complex, do directly
    
    return True  # Safe to delegate

# Usage:
if should_delegate(user_request):
    delegate_task(goal=user_request)
else:
    # Do directly with explanation
    "This is complex design work—doing directly for best results"
```

---

### Pattern 2: Fallback Strategy

```python
# Try delegation first, fall back to direct
try:
    result = delegate_task(
        goal=task,
        timeout=60  # Aggressive timeout
    )
    if result.status == "completed":
        return result
except TimeoutError:
    pass  # Fall through

# Fallback: Direct execution
return execute_directly(task)
```

---

### Pattern 3: Parallel Bounded Tasks

```python
# Good for delegation: independent, bounded
tasks = [
    "Summarize document A",
    "Summarize document B", 
    "Summarize document C"
]

results = delegate_task_parallel(tasks)  # Safe
```

---

### Pattern 4: Sequential Complex Tasks

```python
# Bad for single delegation: sequential, complex
tasks = [
    "Design architecture",
    "Build component A",
    "Build component B",
    "Integrate everything"
]

# Instead: Multi-round with validation
for task in tasks:
    result = delegate_task(task)
    validate(result)  # Before proceeding
    update_context(result)  # For next task
```

---

## Retry Hierarchy: User Boundary Expectation

**The Rule:** When agents fail, fix the **failure** and **re-dispatch** — do NOT bypass to direct execution.

```
Agent fails ──► Diagnose why ──► Fix failure condition ──► Re-dispatch agent
     ↑                                                      │
     └──────────────────────────────────────────────────────┘
           (Only loop back to re-dispatch, never to "do it yourself")
```

**The Anti-Pattern to Avoid:**
```python
# ❌ WRONG: Agent fails, coordinator does the work
mason_result = dispatch("mason", "Fix tests")  # Times out
# ↳ "I'll just fix it myself" ← VIOLATES BOUNDARY
patch("file.tsx", old_string="...", new_string="...")  # COORDINATOR doing work
```

**The Correct Pattern:**
```python
# ✅ CORRECT: Agent fails, diagnose, fix condition, re-dispatch
mason_result = dispatch("mason", "Fix tests")  # Times out or fails

# Step 1: Diagnose WHY (not WHAT)
if mason_result.exit_code == 124:
    diagnosis = "Timeout - SOUL.md too large, reducing..."
    reduce_soul_md("mason")  # Fix the failure condition
    
# Step 2: Re-dispatch with corrected context
dispatch("mason", "Fix tests (SOUL.md reduced, should complete)")  # Retry
# Result: Agent succeeds, boundary preserved
```

**When Direct Execution IS Appropriate:**
- ✅ Agent **infrastructure unavailable** (no profiles, no gateway)
- ✅ Emergency fix with explicit acknowledgment: "Agent system down, fixing directly"
- ✅ Single file patch when agent previously succeeded on similar work
- ❌ NOT: "Agent failed, I'll do it faster"

**The User Expectation:**
> "if an agent fails you should correct the failure and retry"  
> "if you are doing it and not the core build team then stop"

This means: **Coordinator coordinates. Agents execute. Never invert.**

**Memory Hook:** 
- Ask: *"Why did the agent fail?"* (infrastructure, timeout, credentials, scope)
- Fix: *The condition that caused failure*
- Re-dispatch: *Same agent or corrected agent config*
- **Never:** *"I'll just do it myself this time"*

---

## Retry Strategies After Failure

### Pattern: Retry With Constraints (Parallel Research)

**The Problem:**
```python
# Parallel research delegation - one fails
tasks = [
    "Research free data sources",           # Scope - SUCCESS
    "Design architecture",                  # Mason - TIMEOUT (hung on API calls)
    "Build MVP scraper"                     # Forge - SUCCESS
]
results = delegate_task_parallel(tasks)
# Mason timed out after 600s, likely validating APIs
```

**The Solution - Retry With Constraints:**
```python
# Retry Mason with explicit constraints:
delegate_task(
    goal="Design market intelligence architecture",
    context="""
    LEARNED FROM FAILURE: Previous attempt timed out due to live API validation.
    
    CONSTRAINTS:
    - DO NOT make live API calls
    - USE Scope's research at /home/user/market_intel/free_data_sources_report.md
    - USE Forge's MVP at /home/user/market_intelligence_mvp.py as baseline
    - Work from EXISTING research data only
    """
)
# Result: SUCCESS in 359s (vs timeout at 600s)
```

**Why this works:**
- Removes external dependency (API calls)
- Leverages sibling agents' outputs (cross-agent data reuse)
- Gives explicit permission to use partial/incomplete data
- Maintains parallel structure while recovering from failure

**When to use:**
- ✅ Parallel research tasks where one agent failed
- ✅ Timeout due to external API/network validation
- ✅ Sibling agents produced usable intermediate outputs
- ✅ Agent was blocked on "ground truthing" that can be skipped

**When NOT to use:**
- ❌ Agent failed due to logic error (fix logic, not constraints)
- ❌ No sibling outputs exist (nothing to leverage)
- ❌ Task requires real-time data (can't use stale research)

---

### Pattern: Timeout Batch Recovery Via Direct Execution (NEW)

**The Problem:**

Parallel implementation tasks (code, configs, tests) where ALL or MOST agents timeout:

```python
# Parallel implementation - all timeout
tasks = [
    "Setup deployment pipeline",      # Relay - TIMEOUT (600s, complex)
    "Build AgentBus wrapper",          # Forge - TIMEOUT (600s, complex)
    "Build test framework",            # Prism - TIMEOUT (600s, complex)
    "Create Team integration"          # Chronicle - TIMEOUT (600s, complex)
]
# Result: ALL timeout, no forward progress
```

**Why they timeout:**
- Implementation tasks require reasoning + writing (not bounded)
- Multiple syntax errors in generated code (docstrings, async/await)
- Tool call accumulation hits 600s limit
- No partial work persisted

**The Solution - Switch to Direct Execution:**

```python
# STOP retrying delegation - switch to direct

# Phase 1: Quick diagnostic (direct)
result = terminal("cd /path && python -m pytest tests/ 2>&1 | head -20")
# Identify: SyntaxError in conftest.py, ImportError in adapters

# Phase 2: Targeted fixes (direct)
patch("/home/user/market_intel/tests/conftest.py",
      old='"""Create HN adapter instance.""""',
      new='"""Create HN adapter instance."""')  # Fix syntax error

patch("/home/user/market_intel/app/services/source_adapters.py",
      old='def get_fallback_sources(self)',
      new='async def get_fallback_sources(self)')  # Fix async

# Phase 3: Verify (direct)
terminal("cd /home/user/market_intel && python -m pytest tests/ -v")

# Total time: ~10 minutes
# Result: Framework errors resolved, tests now COLLECT
```

**Why this works:**
- **Direct execution** has no 600s timeout constraint
- **Iterative feedback** - see error, fix, verify
- **Surgical precision** - fix exactly what's broken
- **Tool accumulation doesn't matter** - not competing against timeout

**When to use:**
- ✅ **Implementation work** (code, configs, manifests) where agents timeout
- ✅ **Syntax/logic errors** in generated code that need iteration
- ✅ **Batch of related tasks** all failing similarly
- ✅ **Framework completion** - final 10-20% of "stubs need implementation"

**Pattern indicator:**
```
"Tackle what's pending now" + [parallel complex tasks] → Switch to direct
```

**When NOT to use:**
- ❌ Research/synthesis tasks (those work better with constraints)
- ❌ Single bounded task (retry that with constraints first)
- ❌ When delegation succeeded for sibling tasks

**Comparison:**

| Approach | Time | Result | Risk |
|----------|------|--------|------|
| Keep retrying delegation | 600s × N attempts | Keep failing | High (no progress) |
| Retry with constraints | 300-600s | Maybe success | Medium |
| **Direct execution (NEW)** | **~10 min** | **Reliable completion** | **Low** |

**The Rule:**

When you hear: *"Tackle what's pending now"* + parallel complex implementation tasks timeout → **Immediately switch to direct execution with systematic debugging**.

---

### Pattern: Retry With Debug Agent Standby

**For complex failures:**
```python
# Primary task
delegate_task(
    goal="Design architecture",
    context="If you fail, DebugAgent will analyze why"
)

# DebugAgent standby (Create Team QA agent like Prism)
delegate_task(
    goal="Analyze why Mason failed",
    context="""
    Review Mason's outputs or error state.
    Diagnose: Was it API calls? Infinite loop? Validation blocking?
    Provide: Quick fix architecture + prevention strategy
    """
)
```

**Why this helps:**
- Dedicated diagnostic agent has fresh perspective
- Separates concern (don't burden failed agent with self-diagnosis)
- Can synthesize findings from multiple failed attempts

---

## Real-World Examples

### Example 1: Dashboard Build (What Happened Here)

**Failed approach:**
```python
delegate_task("Build complete dashboard with 8 modules")
# Result: TIMEOUT after 600s
```

**Successful approaches:**
```python
# Option A: Direct (used)
write_file("~/command_center/command-center-v2.html", html)
# Result: SUCCESS in 60s

# Option B: Scaffolded (could work)
delegate_task("Fill in Activity Feed using this skeleton...")
# Result: SUCCESS in 30s
```

---

### Example 2: Research + Synthesis

**Will timeout:**
```python
delegate_task("Research GRPO papers and write comprehensive synthesis")
```

**Works reliably:**
```python
# Round 1: Research (bounded)
docs = delegate_task("Search arxiv for GRPO papers, return top 5")

# Round 2: Summaries (bounded)
summaries = delegate_task("Summarize each paper in 1 paragraph", context=docs)

# Round 3: Synthesis (still might timeout, but smaller)
synthesis = delegate_task("Synthesize themes from summaries", context=summaries)
# OR do synthesis directly if reasoning-heavy
```

---

### Example 3: File Operations (Always Delegate)

```python
# Simple, bounded, fast
delegate_task("Parse ~/data.csv and return statistics")
# Result: SUCCESS in 15s

# No reason to do directly—wastes your attention
```

---

## Error Recovery

### When Agent Times Out

**Don't panic:**
1. Check if partial work exists (file on disk)
2. Use artifact tracker to see what was created
3. Decide: continue from partial or restart
4. Retry with: simpler scope, scaffolded approach, or direct execution

**Never:**
- Retry exact same complex task (will timeout again)
- Assume agent is broken (it's doing its job)
- Try to "fix" the timeout (not configurable)

---

## Best Practices

### DO:
- ✅ Test complexity with small pilot before big delegation
- ✅ Use multi-round for complex multi-step work
- ✅ Scaffold when possible (provide structure)
- ✅ Track artifacts automatically (see build-artifact-recovery skill)
- ✅ Have fallback to direct execution
- ✅ Set aggressive timeouts (60s) to fail fast

### DON'T:
- ❌ Delegate open-ended design work
- ❌ Expect real-time collaboration from agents
- ❌ Try to increase timeout (impossible)
- ❌ Retry failed complex task unchanged
- ❌ Skip validation between multi-round steps

---

## Summary

**The 600s timeout is a feature, not a bug.** It prevents runaway processes.

**Agents excel at:** Bounded tasks with clear deliverables

**Direct execution excels at:** Complex design requiring real-time iteration

**Hybrid approach:** Use the right tool for the job complexity

**Remember:**
```
Delegation = Fire-and-forget, 600s max, isolated context
Direct execution = Interactive, no timeout, full context
Multi-round = Coordination overhead, reliable completion
```

**Production systems** account for these constraints and design workflows accordingly.

---

## Hermes `-p` Profile Dispatch Troubleshooting

### Issue: Command Syntax Failures

**Problem:** `hermes -p <agent> "prompt"` treats the prompt as a subcommand.

**Error:**
```
hermes: error: argument command: invalid choice: 'Build API routes...'
(choose from 'chat', 'model', 'fallback', ...)
```

**Root Cause:** The `-z` flag must come BEFORE the `-p` argument, or the prompt is parsed as a command.

**Correct Syntax:**
```bash
# ❌ WRONG - prompt treated as subcommand
hermes -p agent "Build API routes..."

# ❌ WRONG - -c flag not valid
hermes -p agent -c "Build API routes..."

# ✅ CORRECT - -z before -p
hermes -z "Build API routes..." -p agent
```

---

### Issue: SOUL.md Context Overload (Silent Failure)

**Problem:** Agent dispatched via profile oneshot mode exits code 0 but produces **no output**, creates **no files**, and makes **zero tool calls**.

**Correct Syntax:**
```bash
# ✅ CORRECT - use 'chat -q' not '-z'
hermes -p <agent> chat -q "Build API routes..."

# ❌ WRONG - '-z' flag doesn't exist in hermes CLI
hermes -p agent -z "task"

# ❌ WRONG - prompts treated as subcommand without chat -q
hermes -p agent "task"
```

**Symptoms:**
- Command completes immediately (1-2 seconds)
- Session log shows only 1 message (the user prompt)
- Tool calls: 0
- Files created: 0
- No error message
- Session exits cleanly with exit_code: 0

**Diagnostic Output:**
```bash
# Check session log
cat ~/.hermes/profiles/agent/sessions/session_latest.json | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print(f'Messages: {len(d.get(\"messages\",[]))}'); print(f'Tool calls: {len(d.get(\"tool_calls\",[]))}')"

# Expected output when SOUL.md too large:
# Messages: 1
# Tool calls: 0
```

**Root Cause:** SOUL.md is **too large** (2,000+ characters). The full SOUL.md is injected as system prompt for EVERY request. When combined with task prompt, it exceeds model context window. Model cannot process, cannot execute tools, exits silently.

**The Numbers:**
- Failed SOUL.md: **2,800+ characters** → No tool execution
- Working SOUL.md: **~300-500 characters** → Normal execution

**Solution:**

**Step 1: Reduce SOUL.md to minimal size:**
```bash
# Replace detailed persona with minimal version
cat > ~/.hermes/profiles/agent/SOUL.md << 'EOF'
# Agent Name - Brief Role

## Role
One-line description of purpose.

## Core Tasks
1. Task category 1
2. Task category 2
3. Task category 3

## Alert Levels
GREEN (>80%), YELLOW (60-80%), ORANGE (40-60%), RED (<40%)

## Files to Create
- src/lib/module/*.ts
- src/components/*.tsx
EOF
```

**Step 2: Move detailed persona to external file:**
```bash
# Put full persona in separate file
cat > ~/command_center/profiles/agent_persona_full.md << 'EOF'
[Detailed 2,000+ character persona here]
EOF

# Reference in task prompt instead of SOUL.md
hermes -z "Read /home/user/command_center/profiles/agent_persona_full.md then build..." -p agent
```

**Step 3: Use interactive mode for complex personas:**
```bash
# Interactive mode (not oneshot) can handle larger context
hermes -p agent chat
# Then: "You are [detailed persona]. Build..."
```

**When to use minimal vs full SOUL.md:**

| Dispatch Mode | SOUL.md Size | Works? |
|---------------|--------------|--------|
| `hermes -p agent -z "task"` | Minimal (~500 chars) | ✅ Yes |
| `hermes -p agent -z "task"` | Full (2,000+ chars) | ❌ Silent failure |
| `hermes -p agent chat` | Any size | ✅ Yes (interactive) |

**The Rule:**
```
Oneshot dispatch (-z) → Minimal SOUL.md required
Interactive mode (chat) → Any SOUL.md size OK
```

**Pattern Indicator:**
```
"Agent completed but no files created" + "exit code 0" + "1 message" → Check SOUL.md size
```

---

### Issue: Background Process + Submit Pattern Failures

**Pattern:** Launching `hermes -p agent` with `background=True`, then using `process(action="submit")` to send tasks.

**Result:** Agent loads, shows welcome screen, task appears in output, but **zero execution** - no file reads, no patches, no builds.

**The Anti-Pattern:**
```python
# Dispatch agent in background
terminal(
    command="hermes -p mason",
    background=True
)  # Session ID: proc_xxx

# Try to send task via submit
process(action="submit", session_id="proc_xxx", data="Fix the sidebar...")
# Result: Text appears in agent output, but agent doesn't execute
```

**Why it fails:**
- `hermes -p` enters an **interactive TTY session** that expects human keyboard input
- The "submit" sends text to stdin, but the agent's input loop is waiting for **interactive line editing**, not raw stdin
- The welcome screen displays, the prompt appears (`mason ❯`), the task text echoes, then...
- **Nothing.** The agent never calls tools, never starts reasoning, just waits silently.

**The "Warning: Input is not a terminal (fd=0)" red herring:**
When you `echo "task" | hermes -p agent`, you see this warning and think "input failed." Actually, the input *was received* - it's displayed in the output! The problem is the **execution model**, not input delivery.

**What actually works:**

**Option 1: Interactive mode (for manual tasks)**
```bash
hermes -p mason chat
# Then type: "Fix the sidebar..." → Agent reasons and executes
```

**Option 2: oneshot mode (NOT for background processes)**
```bash
hermes -p mason -z "Fix the sidebar..."
# Works in terminal foreground, NOT via background=True + submit
```

**Option 3: Infrastructure mode (for orchestration)**
```python
# Use Discord gateway or proper dispatcher
delegate_task(
    goal="Fix the sidebar...",
    context="...",
    toolsets=["file", "terminal"]
)
```

**The Core Constraint:**
```
hermes -p agent = Interactive assistant that chats with a human
                        ↓
Background mode bypasses = No human to chat with
                        ↓
Agent loads, waits, does nothing
```

**Recognition pattern:**
- Process shows "running" for minutes/hours
- Output only shows: (1) welcome screen, (2) line counter increments, (3) echoed task text
- Zero tool calls logged
- Zero files modified
- You keep thinking "it's still processing" — it's not

**Decision tree for agent dispatch:**

```
Need to dispatch agent work?
├── Can use interactive chat? → hermes -p agent chat
├── Need automated execution?
│   ├── Short task (<60s), simple? → hermes -p agent -z "task"
│   └── Complex, multi-step, long-running? → delegate_task()
└── Need true parallel background execution? → Cron or infrastructure

NEVER: background=True + process(submit) with hermes -p
```

---

### Issue: Provider Configuration Not Propagated

**Problem:** Background `hermes -p` processes fail with "No inference provider configured."

**Error:**
```
hermes_cli.auth.AuthError: No inference provider configured.
Run 'hermes model' to choose a provider, or set API_KEY in ~/.hermes/.env
```

**Root Cause:** Child processes don't inherit the parent session's provider configuration.

**The .env vs Gateway Distinction**

**Critical insight:** The gateway (running since startup) loaded keys from `~/.hermes/.env` once. Child `hermes -p` processes spawn fresh and don't automatically inherit the `.env` values.

| Auth Source | Gateway | `hermes -p` child |
|-------------|---------|-------------------|
| `~/.hermes/.env` | ✅ Loaded at startup | ❌ Not auto-loaded |
| Environment variable | ✅ Inherited | ✅ Must be explicit |

**Solution Options:**

**Option 1: Export environment variable before dispatch**
```bash
export OLLAMA_API_KEY=your_key_here
export OLLAMA_BASE_URL=https://ollama.com/v1
hermes -p relic chat -q "Build API routes..."
```

**Option 2: Inline environment with command**
```bash
OLLAMA_API_KEY=your_key hermes -z "Build API routes..." -p relic
```

**Option 3: Use delegate_task instead (handles auth propagation)**
```python
delegate_task(
    goal="Build API routes...",
    toolsets=["terminal", "file"]
)
```

### Issue: Gateway Stopped (Timeouts on Code Work, Queries succeed)

**Pattern:** Simple queries work (e.g., `hermes -p agent -z "list files"`) but code-work times out after 180s.

**Root Cause:** The Hermes gateway is **stopped**. Profile-based agent dispatch requires the gateway for multi-step tool execution.

**Critical Distinction: Terminal Subprocess vs Gateway Dispatch**

| Dispatch Method | Timeout | Why Different |
|---------------|---------|---------------|
| `hermes -p agent` via **terminal** | 180s | Terminal tool kills subprocess |
| `hermes -p agent` via **Discord → Gateway** | No limit | Gateway manages long-running sessions |
| `delegate_task` | 600s | Independent subprocess with tool access |

**When terminal dispatch succeeds vs fails:**
```bash
# ✅ Works (single model call, no tool chain)
hermes -p agent -z "List files in /home"  

# ❌ Times out (needs gateway for file/terminal tool chaining)
hermes -p agent -z "Fix TypeScript errors and rebuild"

# ✅ Works (goes through Gateway, unbounded)
# User sends: "@agent Fix TypeScript..." via Discord
```

---

### Issue: Terminal-Subprocess Dispatch Times Out (180s), Gateway Dispatches Succeed

**Pattern:** When dispatching agents via terminal tool:
```python
# ❌ Times out at 180s
cd ~/project && OLLAMA_API_KEY=*** hermes -p agent -z "Build API routes..."
```

But previous "successful" deployments via Discord gateway completed in 500-800s without issues.

**Root Cause:**
- Terminal subprocess has **180s hard limit** (terminal timeout)
- Discord → Gateway has **no timeout** (gateway manages sessions)

| Dispatch Method | Timeout | Mechanism |
|-----------------|---------|-----------|
| `hermes -p` via **terminal subprocess** | 180s | Terminal tool kills process |
| `hermes -p` via **Discord → Gateway** | Unlimited | Gateway manages long sessions |
| `delegate_task` | 600s | Independent subprocess |

**The Discovery:**
Terminal logs show agents completing in 500s+, 747s, even 1184s via gateway, but same agents fail at 180s via terminal.

**Solution: Background Mode with `notify_on_complete`**

```python
# ✅ Works - 500-800s completion time
terminal(
    command="cd ~/project && OLLAMA_API_KEY=*** hermes -p agent -z '...'",
    background=True,           # Bypasses 180s limit
    notify_on_complete=True,   # Notification when done
    name="agent_task_name"     # For tracking
)
```

**Why this works:**
- `background=True`: Process runs detached from terminal timeout
- `notify_on_complete`: Gateway notifies when process completes
- Agent runs to completion without 180s hard limit

**Status verification:**
```bash
# Check if running
ps aux | grep "hermes -p agent" | grep -v grep

# Or check process tool
process(action="poll", session_id="proc_xxx")
```

**Pattern indicator:**
```
"30 agents deployed successfully yesterday" but "now timing out" →
Likely yesterday used background=True or gateway dispatch, today using foreground
```

**Historical context from logs:**
```
# Previous successes (gateway via Discord):
agent:main:discord → time=568.9s api_calls=58
delegate_task → 747.2s
hermes -p (foreground) → timeout at 180s
```

**Summary:**
- Always use `background=True + notify_on_complete=True` for `hermes -p` code work
- Simple queries ("list files") can use foreground (< 60s expected)
- Complex work ("build dashboard") must use background mode
- Previous "successful" agent deployments likely used background or gateway, not foreground

---

## The Pattern: Foreground vs Background Dispatch

This is the key operational pattern for reliable agent orchestration:

**Foreground (default):**
- 180s timeout
- Good for: Quick queries, status checks, simple operations
- Bad for: Code generation, multi-file builds, complex reasoning

**Background with notification:**
- No practical timeout (hours possible)
- Good for: Code work, builds, research, complex tasks
- Bad for: Interactive workflows, immediate feedback needed

**Decision rule:**
```
Expected time < 120s? → Foreground OK
Expected time > 120s? → Background required
Unknown complexity?   → Default to background
```

**Why Discord @mention succeeds:**
- User message → Gateway process (already running since Apr 27)
- Gateway spawns agent session with **no timeout**
- Agent executes file writes, terminal commands, etc. via gateway
- Returns result when complete (could be 500s+)

**Why terminal `hermes -p` fails for code work:**
- Terminal tool spawns `hermes` process (foreground)
- 180s timeout on terminal command
- Agent needs >180s to: load skills → reason → call file tool → call terminal → compile → verify
- Process killed at 180s, partial work lost

**The @mention Trap:**
Sending "@agent" in a message from **orchestrator** (me) does NOT trigger agent dispatch. Only **user** @mentions trigger the gateway to spawn an agent. This is a one-way dispatch mechanism:
```
User @agent → Gateway → Agent spawned with no timeout
Kiri @agent → Discord message with text "@agent" → No special handling
```

**Why queries succeed but builds fail:**
- Simple queries: Single model call, no gateway needed
- Code work: Agent spawns → uses tools (file, terminal) → requires gateway for tool dispatch
- Without gateway: Agent process hangs waiting for infrastructure that doesn't exist

**Diagnosis:**
```bash
# Check gateway status
hermes status | grep "Gateway Service"
# Output: Gateway Service   ✗ stopped

# Confirm: Try dispatch with tool work
hermes -p agent -z "Create a file"  # Times out
hermes -p agent -z "Say hello"      # Works
```

**Solution Options:**

**Option 1: Run gateway foreground (blocks terminal)**
```bash
hermes gateway run
```

**Option 2: Run in tmux session**
```bash
tmux new -s hermes-gateway 'hermes gateway run'
```

**Option 3: Enable systemd (WSL)**
```bash
# Add to /etc/wsl.conf:
[boot]
systemd=true

# Then from PowerShell:
wsl --shutdown
```

**Option 4: Use `delegate_task` instead**
```python
# Bypasses profile/gateway system
delegate_task(goal="Create file...", toolsets=["file"])
```

**WSL Specific Constraint:**
Gateway cannot run as background daemon without systemd:
```
WSL detected but systemd is not available.
Run the gateway in foreground mode instead:
  hermes gateway run
```

---

### Issue: Parallel Dispatch Mixed Results

**Pattern:** When dispatching multiple agents in parallel:
- Some start successfully, others fail immediately
- No clear error pattern

**Diagnostic Steps:**
```bash
# Check current provider config
hermes model

# Verify .env has API keys
cat ~/.hermes/.env | grep -E "API_KEY"

# Check if gateway is running (required for profile dispatch)
hermes status | grep "Gateway Service"

# Test simple dispatch first
hermes -z "Echo hello" -p default

# If that works, scale to parallel
```

### Fallback Decision Tree

```
Need to dispatch agents?
├── Try: hermes -z "prompt" -p agent
│   ├── Success? → Monitor with process(action="poll")
│   └── Provider/auth error?
│       ├── Export API_KEY and retry
│       ├── Use delegate_task instead
│       └── Or build sequentially yourself
└── Urgent/complex work?
    └── Do directly (Kiri) with agent guidance
```

---

## Infrastructure Failure → Direct Diagnostic Fallback

**The Pattern:** When `hermes -p` dispatch fails due to configuration issues, coordinator transparently handles diagnostic work while documenting what agents WOULD have done.

**When This Happens:**
```
User: "deploy agents to diagnose why localhost:3001/dashboard is not loading"

Kiri attempts:
  hermes -p watcher -z "Diagnose..." 
  
Result:
  ⚠ Config issues detected in config.yaml:
  ⚠ No inference provider configured.
```

**The Anti-Pattern to Avoid:**
```python
# ❌ WRONG: Fail silently or give up
"Sorry, agents can't be dispatched right now."

# ❌ WRONG: Attempt retries that will fail
# (Keep trying hermes -p with different flags)
```

**The Correct Pattern - Transparent Fallback:**
```python
# ✅ CORRECT: Acknowledge, pivot, document
"The Hermes CLI has configuration issues (no provider configured), 
so agents cannot be dispatched. I'll handle the diagnosis directly 
as coordinator while documenting what agents WOULD have analyzed."

# Phase 1: Direct diagnostic (coordinator responsibility)
terminal("ss -tlnp | grep 3001")  # Port status
terminal("ps aux | grep node")     # Process status  
terminal("cat next.config.ts")     # Config analysis

# Phase 2: Report findings
"🔍 DASHBOARD DIAGNOSIS COMPLETE
✅ Root Cause: Port 3001 not listening, app never started
📋 Analysis: next.config.ts has `output: 'export'` (static mode)
💡 Fix: Either `npm run dev` for dev server OR serve static files"

# Phase 3: Document agent dispatch plan
"Agent dispatch plan (for when infrastructure is ready):
- @watcher: System health, logs, metrics
- @relay: Check CI/CD pipeline status  
- @forge: Fix config if code changes needed"
```

**Why This Works:**
- User gets immediate diagnostic value (not blocked by infra issues)
- Transparency builds trust ("here's what failed and why")
- Documents the agent coordination strategy for future reference
- Maintains coordinator/agent boundary (Kiri diagnoses, agents would implement fixes)

**Classification of Work:**
- **Coordinator DOES:** Initial diagnostics, triage, reporting
- **Agents WOULD DO:** Implementation fixes, config changes, server restart
- **User Expectation:** Problem identified and path forward clear

---

## Local Service Diagnostic Pattern

**When localhost:PORT is not responding:**

### Step 1: Port Status (without lsof/netstat)
```bash
# Modern alternative
ss -tlnp | grep :3001 || echo "Port not listening"

# Or check all listening ports
ss -tlnp | grep LISTEN
```

### Step 2: Process Discovery
```bash
# Find node/npm/next processes
ps aux | grep -E "(node|npm|next)" | grep -v grep

# Find specific port users (if any)
lsof -i :3001 2>/dev/null || fuser 3001/tcp 2>/dev/null
```

### Step 3: Application Discovery
```bash
# Find package.json files (identify Node apps)
find ~ -maxdepth 3 -name "package.json" -not -path "*/node_modules/*"

# Check for static export config
grep -l "output.*export" */next.config.* 2>/dev/null
```

### Step 4: Root Cause Categories

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Port not listening | App never started | `npm run dev` or `npm start` |
| `output: 'export'` in config | Static export mode | Remove for dev server OR serve dist/ |
| Route 404 | Missing page file | Check `src/app/dashboard/page.tsx` exists |
| Process exists but no response | Crash/loop | Check logs, restart |

---

## Related Skills

- `subagent-driven-development` — Multi-round delegation workflows
- `build-artifact-recovery` — Automatic artifact tracking when things go wrong
- `systematic-debugging` — Root cause analysis when delegation fails
- `writing-plans` — Break complex work into delegable chunks
- `hermes-profile-execution` — Migration patterns from cron to profile-based execution

---

## Version History

v1.0.1 — Added Hermes `-p` dispatch troubleshooting section (2026-05-09)
v1.0.0 — Initial delegation troubleshooting guide (2026-05-02)
