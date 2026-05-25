---
name: create-team-sequential-execution
description: Reliable sequential execution pattern for Create Team multi-agent MVP delivery via direct Python execution with Keystone as Project Manager.
trigger:
  - When user says "deploy Create Team"
  - When user says "run Create Team"
  - When building multi-agent MVP deliveries where coordinator manages phases
  - When coordinating agent teams for implementation
  - When user asks "are you doing this or are agents?" (boundary clarification needed)
---

# Create Team Execution - Sequential Pattern

**Purpose**: Reliable execution of multi-agent Create Team for delivering complete MVPs.

**Pattern**: Direct sequential execution via `execute_code`, NOT cron-based.

## Critical Boundary: Coordinator vs Agent Execution

**When user says "Deploy Create Team":**
- **I (Coordinator) DO**: Scope requirements, create spec, assign agents, manage phases
- **I (Coordinator) DO NOT**: Write HTML, CSS, or implementation code
- **Create Team Agents DO**: Actual module building via proper invocation

**This skill describes agent assignment and phase management ONLY.**
For actual agent invocation patterns, see `persistent-agent-invocation`.

## Execution Flow

### Phase 0: Project Initiation (Keystone - Coordinator)
- Keystone (you, as coordinator) initializes as Project Manager
- Load specification from JSON
- Assign all 13 agents to phases
- **CRITICAL**: Do NOT write implementation code here

### Phase Implementation
For each phase, choose ONE invocation method:

**Option A: Cron-based (persistent agents with configs)**
```python
job = cronjob(action="create", skills=["mason"], context_from=[prev_id])
cronjob(action="run", job_id=job["job_id"])  # Mason actually builds
```

**Option B: delegate_task with agent context (ephemeral but configured)**
```python
delegate_task(role="orchestrator", tasks=[
  {"goal": "Mason builds module X", "context": "agent_config_from_MCP"}
])
```

**Option C: Direct execution (YOU write code - last resort)**
```python
# ONLY if no agent configs exist yet
# Acknowledge to user: "Building initial version directly, 
# will convert to agent configs for v{N+1}"
## Execution Pattern

**Sequential via execute_code** with agent phase coordination.

### The Boundary Violation (Common Mistake)

**WRONG** - Coordinator doing agent work:
```python
def phase_1():
    # You're printing "MASON" but YOU'RE writing the HTML
    print("🧱 MASON: Building...")
    html = """<div>...</div>"""  # This is YOU writing code, not Mason
    return html

# Result: User can't tell if it's you or agents. It's YOU.
```

**CORRECT** - Agents do their work via proper invocation:
```python
# You coordinate
print("🗿 KEYSTONE: Deploying Phase 1 to Mason, Forge, Alloy")

# Agents execute
cronjob(action="run", job_id=mason_job_id)  # Actual Mason builds
# OR
delegate_task(agent_config="mason")  # Mason context loaded
# OR (if no configs yet)
execute_code()  # But acknowledge: "Initial v1, agents take over v2+"
```

### Phase 1: Core Layout & Navigation
**Assigned**: Mason (Architecture), Forge (CSS), Alloy (Sidebar)
**Action**: Deploy agents to build their assigned modules
**Coordinator Output**: Phase 1 deployment plan only

### Phase 2: Module Implementation
**Assigned**: Prism (Quality), Relay (Graph), Scope (Operations)
**Action**: Deploy agents to build their assigned modules
**Coordinator Output**: Phase 2 deployment plan only

### Phase 3: Integration
**Assigned**: Chronicle, Launchpad, Scale, Temper
**Action**: Deploy agents to integrate and test
**Coordinator Output**: Phase 3 deployment plan only

### Phase 4: Review
**Assigned**: Vantage, Bastion
**Action**: Deploy agents to review and audit
**Coordinator Output**: Final integration and report

---

## Execution Patterns

### Pattern A: Direct Sequential Execution (Default)
Use `execute_code` with agent phase coordination for immediate results.

### Pattern B: File-Based Phase Gates (Cron/Scheduled Jobs)
For long-running builds or cron jobs that need to resume between phases:

```
PHASE GATE CHECK → Spawn Agents → Integration → Signal Complete
       ↑                                                    ↓
       └────────────────────────────────────────────────────┘
                    (Next cron run continues)
```

**Implementation:**

```python
# In cron job or scheduled task
def orchestrate_phased_build():
    # Phase 1: Check for signal
    if os.path.exists("v{N}_build/phase1_complete.txt"):
        # Phase 2: Spawn parallel agents
        tasks = [
            {"goal": "Forge: Build Module A", ...},
            {"goal": "Prism: Build Module B", ...},
            ...
        ]
        results = delegate_task(tasks=tasks)  # Parallel execution
        
        # Phase 2: Integration
        integrate_results(results)
        
        # Phase 2: Signal complete
        write("v{N}_build/phase2_complete.txt", "Phase 2 complete")
    
    elif os.path.exists("v{N}_build/phase2_complete.txt"):
        # Phase 3: Integration agents
        ...
        write("v{N}_build/phase3_complete.txt", "Phase 3 complete")
    
    # etc...
```

**Use When:**
- Cron job needs to check progress and continue
- Build spans multiple scheduled runs
- State must persist between executions
- User wants explicit phase gates (file checkpoints)

### Phase 3: Integration (Chronicle, Launchpad, Scale, Temper)
- **Scale**: Generate unified CSS with design tokens
- **Launchpad**: Assemble final HTML
- **Temper**: Edge case testing
- **Chronicle**: Documentation

### Phase 4: Review & Security (Vantage, Bastion)
- **Vantage**: Code review (target: 95%+ score)
- **Bastion**: Security audit (0 critical issues)

## Success Factors

1. **File-based handoff**: Agents communicate via files in `v{X}_build/` directory
2. **Sequential phases**: Each phase waits for previous to complete
3. **Keystone as PM**: Coordinates between phases, generates final report
4. **No cron overhead**: Direct Python execution via `execute_code`
5. **RETAIN vs REPLACE**: When updating (v{N+1}), port ALL previous modules first, then ONLY modify what explicitly requested — prevents breaking working content

## Lessons from Failed Rebuilds

**The Backup/Restore Anti-Pattern (Next.js Projects):**

When Next.js projects fail, `cp -r backup/ current/` often **corrupts node_modules**:

```bash
# DANGEROUS: Binary mismatch between backup node_modules and current Node version
rm -rf mvp-dashboard
cp -r mvp-dashboard-backup-* mvp-dashboard
npm run dev  # → Error: Cannot find module '../server/require-hook'

# CORRECT: Archive old, create fresh, reinstall from package.json only
mv mvp-dashboard mvp-dashboard-broken-$(date +%s)
mkdir mvp-dashboard && cd mvp-dashboard
# Copy ONLY source files (src/, public/, config files)
# NEVER copy node_modules or .next from backup
cp -r ../mvp-dashboard-backup-*/src .
cp ../mvp-dashboard-backup-*/package.json .
cp ../mvp-dashboard-backup-*/next.config.js .
# ... other config files ...
npm install  # Fresh install matching current Node version
npm run dev  # ✅ Clean start
```

**Simultaneous Agent Collision Pattern:**

When multiple agents write to the same files:
```
launchpad writes page.tsx          [T+0s]
vantage overwrites page.tsx        [T+2s]  ← launchpad's changes lost
forge reads corrupted page.tsx     [T+5s]  ← builds on broken base
Result: Internal Server Error
```

**Prevention:** Use file-based handoff gates:
```
launchpad writes: v4/handoff/phase1/page.tsx.txt
keystone signals: v4/pending/phase1_complete.txt
vantage reads: v4/handoff/phase1/**              [T+0s after signal]
vantage writes: v4/handoff/phase2/**
forge reads: v4/handoff/phase2/**               [T+0s after phase2 signal]
```

**Decision Checklist Before Clean Rebuild:**

- [ ] >15 minutes spent on restoration/fix loops?
- [ ] `npm run build` succeeds but `npm run dev` crashes?
- [ ] Multiple agents were dispatched simultaneously on same files?
- [ ] `Internal Server Error` with no clear stack trace?
- [ ] Weird errors about missing modules that exist in node_modules?
- [ ] Old code appearing mysteriously (stale build cache)?

If 3+ checked: Start fresh. Don't chase the corruption.

## Tactical Recovery Workflow (When Dashboard Breaks)

**Use this when:** App shows "Internal Server Error" after multi-agent transformation, and you need to restore working state fast.

### Step 1: Survey State vs Backup

```python
# Compare current vs backup to find best restore candidate
def survey_recovery_options(base_path):
    current_src = os.path.join(base_path, "mvp-dashboard/src")
    backup_dirs = [d for d in os.listdir(base_path) if 'backup' in d]
    
    # Count .tsx/.ts files in each
    for backup in sorted(backup_dirs, reverse=True):  # Newest first
        backup_src = os.path.join(base_path, backup, "src")
        count = count_ts_files(backup_src)
        print(f"{backup}: {count} files")
    
    # Pick backup with most files (likely most complete)
    return best_backup
```

**Key insight:** File count comparison reveals which backup is most intact.

### Step 2: Archive Broken State (Forensics)

```bash
# NEVER delete broken state — archive for investigation
mv mvp-dashboard mvp-dashboard-broken-$(date +%Y%m%d-%H%M%S)
```

**Why:** You might need to diff against it later, or recover specific files the agents created.

### Step 3: Restore Working Backup

```bash
# Copy ONLY source files — NOT node_modules or .next
cp -r mvp-dashboard-backup-{TIMESTAMP} mvp-dashboard
```

**Critical:** Don't copy `node_modules/` or `.next/` — they contain compiled binaries that mismatch current Node version.

### Step 4: Clear Corrupted Dependencies

```bash
cd mvp-dashboard
rm -rf node_modules package-lock.json .next
```

**Why:** Backup's `node_modules` has absolute paths from when it was created. Always fresh install.

### Step 5: Fresh Install & Restart

```bash
npm install  # Rebuilds from package.json (clean)
npm run dev  # Start fresh
```

### Step 6: Verify Restoration

```bash
# Quick health check
curl -s http://localhost:3000 | grep -oE "(Dashboard|title)" | head -3
# Should return expected app title
```

### Full Recovery Script (Python)

```python
import shutil
import os
import subprocess

def tactical_dashboard_recovery(base_path):
    """
    Recover dashboard after failed multi-agent transformation.
    Assumes: server down, files corrupted, node_modules suspect
    """
    current = os.path.join(base_path, "mvp-dashboard")
    
    # 1. Archive broken (don't delete)
    broken = f"{current}-broken-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    shutil.move(current, broken)
    print(f"✅ Archived broken state: {broken}")
    
    # 2. Find best backup (most recent with src files)
    backups = sorted([d for d in os.listdir(base_path) 
                      if 'backup' in d and os.path.isdir(os.path.join(base_path, d))],
                     reverse=True)
    
    best_backup = None
    for backup in backups:
        src_path = os.path.join(base_path, backup, "src")
        if os.path.exists(src_path):
            file_count = sum(1 for root, dirs, files in os.walk(src_path)
                           for f in files if f.endswith(('.tsx', '.ts')))
            if file_count >= 20:  # Reasonable threshold
                best_backup = backup
                break
    
    if not best_backup:
        raise Exception("No viable backup found")
    
    # 3. Restore
    backup_path = os.path.join(base_path, best_backup)
    shutil.copytree(backup_path, current)
    print(f"✅ Restored from: {best_backup}")
    
    # 4. Clear corrupted deps
    for bad_dir in ['node_modules', '.next', 'package-lock.json']:
        bad_path = os.path.join(current, bad_dir)
        if os.path.exists(bad_path):
            if os.path.isdir(bad_path):
                shutil.rmtree(bad_path)
            else:
                os.remove(bad_path)
    print("✅ Cleared corrupted dependencies")
    
    # 5. Fresh install
    os.chdir(current)
    subprocess.run(['npm', 'install'], check=True)
    print("✅ Dependencies reinstalled")
    
    # 6. Start server (background)
    subprocess.Popen(['npm', 'run', 'dev'], 
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL)
    print("✅ Server starting...")
    
    return True
```

### Verification Checklist

- [ ] Server starts without module errors
- [ ] `curl localhost:3000` returns HTML (not "Internal Server Error")
- [ ] Expected title/brand appears in response
- [ ] Agent count matches expected
- [ ] Sidebar navigation renders correctly

## Critical Pattern: Incremental Updates

When building v{N+1} from v{N}:
```
1. Port ALL v{N} modules unchanged (Forge/Alloy task)
2. Identify what user explicitly wants ADDED or CHANGED
3. Only those specific modules get new work
4. Everything else remains identical to v{N}
```

**Anti-pattern to avoid**: Starting from scratch and "re-implementing" — loses proven working modules.

## Output Structure

```
~/command_center/v{N}_build/
├── v{N}_spec.json          # Architecture spec
├── header.html              # Unified header component
├── sidebar.html             # Navigation sidebar
├── module_*.html            # Individual modules
├── unified.css              # Consolidated styles
├── phase*_summary.json      # Phase completions
├── final_report.json        # Project summary
└── ../../command-center-v{N}.html  # Final deliverable
```

## Reference

- **Proven**: Command Center v7 (all 13 agents, 4 phases, 100% success)
- **Proven**: Command Center v8 (3 agents, 4 phases, focused module fixes)
- **File size**: ~12-30KB final HTML with inline CSS
- **Quality**: 97/100 code review, 0 security issues

## When to Use vs Alternatives

**Use this pattern when:**
- Direct execution via `execute_code` is available
- Need immediate, reliable results (no cron overhead)
- Team size is manageable (13 agents or fewer)
- File-based handoff acceptable

**Use cron-based execution when:**
- Need overnight/long-running autonomous processing
- Context_from chaining required across jobs
- Agent identity/config must load from MemPalace
- User prefers "set and forget" scheduling

## Trigger: Clean Rebuild After Failed Transformation

**Recognize these signs that repair will fail and clean rebuild is needed:**

1. **Multiple simultaneous agents overwrote each other's changes**
   - File conflicts between parallel agent writes
   - "Internal Server Error" after agent transformations

2. **Node modules corruption from restoration attempts**
   - `npm install` succeeds but `npm run dev` crashes
   - `Error: Cannot find module '../server/require-hook'`
   - `Internal Server Error` despite successful build

3. **Stale build cache persists across restorations**
   - Old POC ("AgentOrg") mysteriously appearing instead of new code
   - `.next` directory rebuilds but serves stale content

4. **Directory structure partially corrupted**
   - `src/app` exists but Next.js reports "Couldn't find any pages or app directory"
   - Missing pages after multiple restoration attempts

**Decision: When to start fresh vs repair**
- **REPAIR:** Single file issue, clear error message, build succeeds
- **REBUILD:** Multiple agents conflicted, node_modules corrupted, `dev` crashes despite `build` success, or >15 min spent on restoration loops

**Clean Rebuild Protocol:**
```bash
# 1. Archive (don't delete) broken version for forensics
mv mvp-dashboard mvp-dashboard-broken-$(date +%Y%m%d-%H%M%S)

# 2. Fresh workspace
mkdir -p phase{N}/shared_workspace/{pending,complete}

# 3. Dispatch CREATE TEAM sequentially
# keystone → mason → scope → forge → vantage → ...
# Each agent reads previous HANDOFF.md, writes next
# NO simultaneous agent execution during rebuild
```

**Critical:** Clean rebuilds use **sequential** agent dispatch only. Do NOT spawn multiple agents in parallel during reconstruction — that's what caused the original failure.

---