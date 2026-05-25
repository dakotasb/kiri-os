---
name: mass-agent-orchestration
description: Orchestrate mass parallel agent deployments (10+ agents) across multiple phases with real-time monitoring, rate limit handling, auth fallback, and file relocation
triggers:
  - "deploy all agents"
  - "run them in parallel"
  - "mass agent deployment"
  - "orchestrate 20+ agents"
  - "deploy each agent we have"
toolsets: ["terminal", "cronjob"]
---

# Mass Agent Orchestration

Mass parallel agent deployment with operational resilience for complex builds requiring coordination across infrastructure, intelligence, UI/UX, documentation, and testing phases.

## When to Use

- Deploying 10+ agents simultaneously for a complex build
- Multi-phase parallel execution with real-time monitoring needs
- Handling rate limits (HTTP 429), auth failures, directory misalignments
- Background process monitoring with completion notifications
- Orchestration requiring file relocation and retry logic

## Core Pattern

```
Phase 1 (Infrastructure) → Phase 2 (Intelligence) → Phase 3 (UI) ...
       ↓ Parallel within each phase
   ┌─────────┐
   │ relay   │
   │ surge   │
   │ scope   │
   │ haven   │
   └─────────┘
   ┌──────────┐
   │ watcher  │ (real-time status)
   └──────────┘
```

## Deployment Procedure

### Step 1: Plan Phases

Group agents by concern:

| Phase | Focus | Example Agents |
|-------|-------|----------------|
| P1 | Infrastructure | relay, surge, scope, haven |
| P2 | Intelligence | intel, vantage, horizon, compass |
| P3 | UI/UX | alloy, prism, forge, launchpad |
| P4 | Documentation | scribe, archivist, chronicle, hoard |
| P5 | Testing/Security | temper, sentry, bastion, scale |
| Bonus | Strategic | watcher, mediator, quill, drift |

### Step 2: Dispatch with CORRECT METHOD (CRITICAL)

**❌ WRONG - Python subprocess in execute_code:**
```python
# BAD: Can't poll, output hidden, breaks verification
subprocess.Popen(['hermes', '-p', 'sentry', 'chat', '-q', '...'])
```

**✅ CORRECT - terminal tool with background=true:**
```yaml
tool: terminal
background: true
command: "hermes -p sentry chat -q 'Create API endpoints...'"
watch_patterns: ["build", "complete", "error"]
```

**Why terminal tool:**
- Returns session_id for `process.poll()`
- Output captured and visible
- Can wait/check completion
- Matches user expectation: `@agent` → `hermes -p agent`

### Step 2.5: OBSESSIVE POLLING (User Directive)

**When user says:** "Regularly check on the progress and restart or redo dispatch if needed"

**Poll cadence:**
- Every **30-60 seconds** during active work
- Every **2 minutes** if silent but likely still working
- **Immediately** if user asks for status

**Poll pattern:**
```python
def obsessive_poll(session_id, agent_name, timeout_minutes=10):
    for elapsed in range(0, timeout_minutes * 60, 30):  # Every 30s
        status = process.poll(session_id)
        if status['status'] == 'running':
            print(f"⏳ @{agent_name} still running ({elapsed}s)...")
            if elapsed > 180 and no_output_seen:  # 3min timeout
                print(f"🚨 @{agent_name} stuck, redispatching...")
                kill(session_id)
                new_session = dispatch(agent_name, task)
                return obsessive_poll(new_session, agent_name)
        elif status['status'] == 'exited':
            print(f"✅ @{agent_name} complete!")
            return status['output']
        time.sleep(30)
```

### Step 3: Batch Launch (Parallel)

Deploy each phase simultaneously using background processes:

```bash
# Launch with proper auth and directory context
cd ~/project && OLLAMA_API_KEY=*** hermes -p relay -z "WebSocket resilience..." &
cd ~/project && OLLAMA_API_KEY=*** hermes -p surge -z "Agent controls..." &
```
### Step 1.5: Fix Agent Timeout Configuration

If agents fail silently (appear launched but produce no output), check timeout configuration:

```bash
# Check current timeout
grep "timeout:" ~/.hermes/config.yaml

# If timeout: 180, increase to 600 for agent work
# Agents often need >180s for complex tasks
```

**Critical:** Agent profiles may have `timeout: 180` default causing silent failures. Patch before orchestration:

```yaml
# ~/.hermes/config.yaml
model:
  timeout: 600  # Was 180 — prevents agent timeouts
```

**Dispatch with explicit timeout context:**

```bash
# Use execute_code with generous timeout instead of terminal for complex orchestration
```python
import subprocess
import time

# Batch 1: Core (stagger 3 second delays)
for agent, task in batch_1:
    log = f'/tmp/monitor/{agent}.log'
    with open(log, 'w') as f:
        subprocess.Popen(
            ['hermes', '-p', agent, 'chat', '-q', task],
            stdout=f, stderr=subprocess.STDOUT,
            start_new_session=True
        )
    time.sleep(3)  # Prevent system overload

# Wait between batches
print("Batch 1 launched — waiting 5 minutes...")
time.sleep(300)  # 5 min delay before next batch
```

```
Hermes tool call:
```yaml
tool: terminal
background: true
name: "p1_relay_websocket"
notify_on_complete: true
command: "cd ~/project && OLLAMA_API_KEY=*** hermes -p relay -z '...'"
```

### Step 3: Monitor & Handle Failures

**HTTP 429 Rate Limit:**
- Wait 60s
- Retry with explicit model: `--model kimi-k2.5 --provider ollama_cloud`
- Reduce concurrent batch size to 10-12

**Auth Failure (Claude token missing):**
```bash
# Fallback to Ollama Cloud
hermes -p agent --model kimi-k2.5 --provider ollama_cloud -z "..."
```

**Wrong Directory (files in /mnt/c/ instead of ~/project/):**
```bash
mkdir -p ~/project/src/middleware && \
cp /mnt/c/Users/.../securityMiddleware.js ~/project/src/middleware/security.ts
cp /mnt/c/Users/.../app.js ~/project/src/middleware/app-security.js
```

### Step 4: Status Tracking

Report progress as:

```
Phase 1: Infrastructure     ████████████████ 100% ✅
Phase 2: Intelligence       ████████░░░░░░░░  50% 🔄
Phase 3: UI/UX              ████░░░░░░░░░░░░  25% 🔄

Complete:   8 agents ████████
Running:    20 agents ████████████████░░░░
Failed:     2 agents ██
```

## Validation Checkpoints

- [ ] All agents launched with `background: true`
- [ ] `notify_on_complete: true` set on all dispatches
- [ ] **Correct working directory** (`cd ~/project &&` prefix)
- [ ] **Agent timeout set to 600s** (not default 180s) — prevents silent failures
- [ ] Progress reported after each completion
- [ ] Failed agents retried with `--model` fallback
- [ ] Files relocated if agents wrote to wrong paths
- [ ] Rate limit recovery tested (429 handling)
- [ ] Server health monitored (stop agents if OOM kills occur)
- [ ] Process count throttled (kill oldest if >30 running)

## Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| Command uses & | Foreground + background operator | Use `background: true` in tool call |
| No notifications | Missing `notify_on_complete` | Always set to true |
| Rate limit 429 | Batch size >15 agents | Throttle to 10-12 concurrent |
| Files in wrong dir | Agent wrote to /mnt/c/ or backup dir | Relocate with `cp` from staging-backup-* |
| Auth not inherited | Child process isolation | Use `OLLAMA_API_KEY=` prefix |
| Servers killed (OOM) | 40+ agents eating memory | **Let agents finish before debugging servers** |
| Agent process leaks | Failed agents remain | Monitor with `ps aux \| grep hermes` |
| Pre-existing bugs | Import errors, malformed mocks | Track as "critical blockers" for post-deployment fix |

**CRITICAL: Server Management During Deployment**

When servers crash due to memory pressure from agent load:

```
STRICT ORDER:
1. Let all agents finish (don't restart servers mid-flight)
2. Then debug server access
3. Fix critical blockers discovered during deployment
```

**File Relocation from Backup Directories**

Agents may write to `/home/user/staging-dashboard-backup-*/` during rate-limit recovery:

```bash
BACKUP_DIR=$(ls -d /home/user/staging-dashboard-backup-* | head -1)
cp "$BACKUP_DIR/src/components/*.tsx" ~/project/src/components/
```

**Post-Deployment Blocker Tracking**

Document these for final fix phase:
- Import errors (`Lightning` → `Zap`)
- Malformed test mocks (duplicate `});`)
- Type errors in pre-existing components

## Status Reporting Best Practice

**Real-time visual progress tracking is the PRIMARY PURPOSE of this orchestration.** The UI exists to surface this information clearly.

The user specifically noted: *"the way you provided status reports on this multi agent orchestration is one of the primary reasons why this UI exists"*

### Report Format — Required Elements

Use this exact format after every agent completion:

```
## Deployment Update

**Phase 1: Infrastructure — 100% COMPLETE** ✅
- relay    ✅ WebSocket resilience (useRealtime.ts, 33KB)
- surge    ✅ Agent fleet controls (control/route.ts)
- scope    ✅ System metrics (correct directory)
- haven    ✅ Health monitoring (6 services)

═══════════════════════════════════════════════════════════════

Complete:    8 agents    ████████░░░░░░░░░░░░ 25%
Running:     20 agents   ████████████████░░░░ 60%
Failed:      2 agents    ██░░░░░░░░░░░░░░░░░░  5%

**Recent completions:**
- 🟢 @relay — WebSocket resilience
- 🟢 @surge — Agent fleet controls
- 🔴 @scope — System metrics (wrong directory, relocating)
- 🟢 @haven — Health monitoring

**Actions:**
- 🔄 Moved 3 security files from /mnt/c/Users/... to correct directory
- ⏳ Retry @intel with ollama cloud (429 rate limit, waiting 60s)
- ⚠️ Build errors: 3 TypeScript issues tracked for post-deployment fix
```

### Visual Status Indicators (Required)

| Symbol | Meaning |
|--------|---------|
| ✅ 🟢 | Agent completed successfully |
| 🔄 🟡 | Agent running / retrying |
| 🔴 ❌ | Agent failed / requires intervention |
| ⏳ 🕐 | Waiting for rate limit / queue |
-→ ⚠️ | File relocation needed |

### Progress Bars (ASCII Required)

Use block characters for visual progress:
- `█` = complete
- `░` = remaining
- Percentage on right

```
Phase 1 Infrastructure:    ████████████████ 100% ✅
Phase 2 Intelligence:      ████████████░░░░  75% 🔄
Phase 3 UI/UX:             ██████████░░░░░░  62% 🔄
Phase 4 Documentation:     ████████░░░░░░░░  50% 🔄
Phase 5 Testing:           ████░░░░░░░░░░░░  25% 🔄
Bonus:                    ████░░░░░░░░░░░░  25% 🔄
```

### Server Management During Deployment

**CRITICAL:** When servers crash (OOM/memory pressure) during agent deployment:

```
═══════════════════════════════════════════════════════════════
SERVER STATUS
═══════════════════════════════════════════════════════════════
Production (3000): 🔴 Killed (OOM from 42 agents)
Staging (3001):    🟡 Down (process terminated)

Action: Let agents finish BEFORE restarting servers
─────────────────────────────────────────────────────────────
Agents running: 18 processes
Time to completion: ~5-10 minutes
Server restart time: ~30 seconds
─────────────────────────────────────────────────────────────
DECISION: Let agents complete, then restart servers
═══════════════════════════════════════════════════════════════
```

**Justification:** Agent processes represent 30-60 min of distributed work. Server restart is 30 seconds. Preserve the expensive work first.

**Then:** After agents complete → restart servers → debug → verify

## Post-Deployment Server Discipline

**STRICT ORDER** when servers crash during mass deployment:

1. **Let ALL agents finish first** — don't interrupt agent work to fix servers
2. **Then debug server access** — check process list, restart if needed
3. **Then fix critical blockers** — TypeScript errors, import fixes, etc.

Justification: Agent processes represent 30-60 min of distributed work. Server restart is 30 seconds. Preserve the expensive work.

### Validation Gate Blocking Pattern

**CRITICAL: When agents "complete" but deliverables are BLOCKED**

This is the most dangerous failure mode — agents ran, files exist, but quality gates prevent delivery. The user sees **nothing** despite "successful" completion.

**The Core Problem:**
During a major orchestration with 35+ agents across functional teams, agents completed work (52 files modified, 18 reports generated), but the validation gate agent (@launchpad) blocked final delivery because 4 of 5 quality criteria failed. The user's perception: "Nothing seems to have changed" — even though substantial work was completed.

**Detection Pattern — User Says:**
- "Nothing seems to have changed"
- "The agents completed but I don't see results"
- "What happened to the orchestration?"
- "I'm not seeing any differences"

**Root Cause:** Agents executed successfully (exited 0, files modified), but validation gates failed, preventing delivery. The LAUNCH GATE agent correctly blocked deployment.

### The Pattern

```
Agent Execution:     ✅ All 35 agents "completed"
Artifacts Created:   ✅ 52 files modified, 18 reports generated
Quality Gates:       ❌ 4 of 5 criteria FAILED
Delivery Status:     🚫 BLOCKED - Nothing delivered to user
User Perception:     "Nothing changed" / "No progress"
"Why don't I see changes?" → Because BLOCKED, not because agents failed
```

### Why This Happens

| Scenario | Cause | User Impact |
|----------|-------|-------------|
| Build passes but tests fail | 22 tests failing with PARSE_ERROR | Code compiles, doesn't work |
| Console noise in production | 39 console.log statements | "Unclean" production build |
| Hardcoded colors remain | UI not unified to design system | Visual inconsistency |
| Mock data paths exist | simulation.ts still present | Risk of fake data in demo |

**The LAUNCH GATE agent (@launchpad) correctly blocks delivery** when criteria fail. This is working as designed.

### Detection

Check for blocked delivery:

```bash
# Look for LAUNCH_GATE.md or similar
cat ~/project/LAUNCH_GATE.md | grep -E "BLOCKED|PASS|FAIL"

# Should show:
# Overall Status: BLOCKED
# Criteria: X of Y passed
```

### Recovery Options — User Chooses Path

**When user says "nothing seems to have changed" or "complete the original orchestration":**

**IMMEDIATE INVESTIGATION REQUIRED:**

1. **Check LAUNCH_GATE.md or VALIDATION_REPORT.md** — likely exists with BLOCKED status
2. **Review agent output** — Did agents run? Were they blocked?
3. **Present the pattern clearly** — "Agents ran, validation blocked, nothing delivered"

**Then present these options:**

---

**OPTION A: Quick Fix (30 minutes)**

**Do:** Dispatch NEW agents to fix ONLY the validation blockers:
- Remove remaining console.log statements (typically 20-30 in API routes/hooks)
- Delete `simulation.ts` or mock data files
- Replace hardcoded hex colors with design tokens (charts may be exempt)
- Skip failing tests if test infrastructure is broken

**Goal:** Get MVP2 delivered to user ASAP

**Risk:** Some technical debt remains (tests may still fail)

---

**OPTION B: Full Quality Pass (2+ hours)**

**Do:** Complete production-quality validation:
- Debug Vitest/Oxc parser errors (may be config issue, not code)
- Properly unify all colors to semantic tokens
- Fix all test failures (badge variants, keyboard hooks, e2e filters)
- Full validation gate pass

**Goal:** Production-ready MVP2 with all gates passing

**Risk:** Longer delay, may uncover deeper issues

---

**OPTION C: Resume From Checkpoint**

**Do:** Direct fixes (coordinator) on blockers while agents tackle remaining work:
- Coordinator removes console.logs directly (faster than agent dispatch)
- Agents continue with their assigned tasks
- Parallel execution

**Goal:** Fastest path to unblock + complete remaining work

**Risk:** Requires credential restoration or terminal-based execution

---

**DECISION FRAMEWORK:**

| User Priority | Suggest Option |
|---------------|----------------|
| "Want to see progress NOW" | C (Resume) → A (Quick Fix) |
| "Full quality, no shortcuts" | B (Full Pass) |
| "Just unblock and continue" | A (Quick Fix) |
| "Agents keep failing" | C (Resume with direct fixes) |

**CRITICAL DIFFERENCE:** This is NOT "agents failed" — this is "agents completed but gates blocked delivery." The orchestration infrastructure is working. The validation criteria need attention.

### Communication Template

```
## 🚨 MVP BLOCKED — Validation Gate Prevented Delivery

**The agents DID modify 52 files, but LAUNCH GATE blocked final delivery.**

### Why You Don't See Changes

| Criterion | Status | Issue |
|-----------|--------|-------|
| Build Passes | ✅ PASS | Production build works |
| All Tests Pass | ❌ FAIL | 22 tests failed with PARSE_ERROR |
| No Console Errors | ❌ FAIL | 39 console.log statements in production code |
| UI Unified | ❌ FAIL | Hardcoded hex colors still present |
| Live Data | ❌ FAIL | Mock data paths (simulation.ts) still exist |

**4 of 5 quality criteria failed. @launchpad correctly BLOCKED delivery.**

### What Agents Actually Did

**✅ Completed:**
- 52 source files modified
- Firefox optimizations applied
- CSS containment added
- Design tokens added to globals.css
- API endpoint created (/api/agents/fleet)

**❌ Blocked by Quality Gates:**
- Console noise not cleaned up
- Hardcoded colors in MarketIntelligence.tsx (#94a3b8, #1e293b)
- Tests won't execute
- Mock data simulation.ts still exists

### Two Paths Forward

**A) Quick Fix (30 minutes)** — Deploy agents to fix only the blockers
**B) Full Quality Pass (2 hours)** — Debug tests, proper unification, full validation

Which do you prefer?
```

### Prevention

**Before dispatching mass agents, warn user:**

> "When deploying 35+ agents overnight, they will create artifacts and modify files. However, a validation gate (@launchpad) will check 5 quality criteria. If any fail, delivery is BLOCKED and you'll see nothing in the morning — even though agents ran. Common blockers: console.logs in production, hardcoded colors, failing tests, mock data still present. I will set up the gate agent to report status clearly."

## Post-Deployment Build Error Triage

When agents complete but leave TypeScript/compilation errors blocking server startup:

### Option A: Fast Inline Fix (Preferred for Blockers)

**Don't wait for a new agent deployment** — fix critical blockers directly:

```bash
# 1. Get error list from build
npm run build 2>&1 | grep -E "Type error|Failed to compile" | head -10

# 2. Fix each error sequentially with patch tool
# Common patterns:
# - CardHeader className error: wrap in div
# - Tooltip formatter type: remove explicit type annotation
# - Import errors: change Lightning → Zap (lucide-react)
# - Object possibly undefined: add optional chaining or default
```

**Example fixes:**

| Error Pattern | Fix | File |
|---------------|-----|------|
| `CardHeader doesn't accept className` | Wrap content in div with className | `.tsx` components |
| `Tooltip formatter type mismatch` | Change `(value: number)` to `(value) => (value as number)` | Charts |
| `Property 'chain' does not exist` | Add to interface: `chain?: string;` | Types |
| `Import 'Lightning' from 'lucide-react'` | Change to `Zap` (correct icon name) | Components |
| `is possibly 'undefined'` | Add `?? 0` or `?.` chaining | Data access |
| `Duplicate closing braces in mock` | Remove extra `});` | Test files |

### Option B: Deploy Debug Agent (5+ errors)

If comprehensive type fixes needed:

```bash
hermes -p ember -z "Fix TypeScript errors for ~/project/src/:
Run npm run build, fix each error with patch tool. Focus on:
1. Card className props — wrap with divs
2. Tooltip formatter annotations — use (value as number)
3. Interface missing fields — add chain?, change?, etc.
4. Import errors — Lightning→Zap, etc.
Keep running until 'Compiled successfully'
"
```

### Critical Blocker Tracking

Even during agent deployment, track blockers as discovered:

```
═══════════════════════════════════════════════════════════════
CRITICAL BLOCKERS (pre-existing, not agent-introduced)
═══════════════════════════════════════════════════════════════

Build Errors Blocking Server:
1. MarketIntelligence.tsx:216 — CardHeader className (pre-existing)
2. QuickActions.tsx:60 — Lightning import (pre-existing)
3. 5 API test files — duplicate }); in mocks (temper agent)

Deferred until agents complete:
- Will fix in final phase
- Agents can continue working (their deliverables compile)
═══════════════════════════════════════════════════════════════
```

## Example Output Format (Full Session Summary)

```
═══════════════════════════════════════════════════════════════
                    AGENT DEPLOYMENT SUMMARY
═══════════════════════════════════════════════════════════════

TOTAL AGENTS:     34 deployed
SUCCESSFUL:       33 agents    ████████████████████ 97%
FAILED:            1 agent     ░░░░░░░░░░░░░░░░░░░░  3%

═══════════════════════════════════════════════════════════════

PHASE COMPLETION:
═══════════════════════════════════════════════════════════════

Phase 1: Infrastructure      ████████████████████ 100% ✅ (4/4)
Phase 2: Intelligence        ███████████████████░  75% ✅ (3/4)
Phase 3: UI/UX               ████████████████████ 100% ✅ (4/4)
Phase 4 Documentation          ██████████████████░░  90% ✅ (4+/4)
Phase 5 Testing/Security     █████████████████░░░  75% ✅ (3/4)
Bonus:                       ██████████░░░░░░░░░  50% ✅ (5/10)

═══════════════════════════════════════════════════════════════

DELIVERABLES BY AGENT:
═══════════════════════════════════════════════════════════════
- relay:       WebSocket resilience (33KB useRealtime.ts)
- surge:       Agent fleet controls (7KB control/route.ts)
- scope:       System metrics charts (27KB)
- haven:       Health monitoring (6 services)
- chronicle:   Timeline/activity feed (9 files, +1,719 lines)
- ...

═══════════════════════════════════════════════════════════════

CRITICAL BLOCKERS FIXED:
═══════════════════════════════════════════════════════════════
✅ CardHeader className — wrapped with div
✅ Lightning import — changed to Zap
✅ 5 API test mocks — removed extra });
✅ Type annotations — fixed formatter types
✅ AuditQuery interface — added chain field

═══════════════════════════════════════════════════════════════

SERVER STATUS:
═══════════════════════════════════════════════════════════════
Production (3000):    ✅ Online
Staging (3001):         ✅ Online — Build passed

═══════════════════════════════════════════════════════════════
```

**Key principles from this session:**

1. **Visual status reporting** — Progress bars, phase completion, emoji indicators are PRIMARY purpose
2. **Server restart discipline** — Let agents finish before fixing servers (preserves 30-60min of work vs 30s restart)
3. **Inline error triage** — Fix TypeScript blockers directly instead of waiting for another agent
4. **Track blockers early** — Document issues as discovered, even while agents are running

## Live Build Error Triage

When agents complete but leave TypeScript/compilation errors:

**Don't wait for a new agent deployment** — fix inline:
1. Run `npm run build` to get error list
2. Fix each error directly with `patch` tool
3. Common fixes: CardHeader className → wrap in div, tooltip formatter types
4. Track patterns: "Pre-existing bug" vs "Agent-introduced"

**Document blockers as discovered:**
- [ ] Import error: `Lightning` → `Zap` (lucide-react)
- [ ] Type error: CardHeader doesn't accept `className`
- [ ] Mock error: Duplicate `});` in test files
- [ ] Formatter type: `(value: number)` → `(value) => (value as number)`

## Example Output Format

```
## Deployment Update

**Phase 1: Infrastructure — 100% COMPLETE** ✅
- relay    ✅ WebSocket resilience (useRealtime.ts)
- surge    ✅ Agent fleet controls (control/route.ts)
- scope    ✅ System metrics ⏳ expected
- haven    ✅ Health monitoring ⏳ expected

**Complete:** 8 agents | **Running:** 20 agents | **Failed:** 2 agents

**Actions:** Moved 3 security files to correct directory
```
