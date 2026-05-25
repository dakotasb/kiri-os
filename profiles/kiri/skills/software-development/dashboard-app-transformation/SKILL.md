---
name: dashboard-app-transformation
description: Deploy parallel agents to transform/rebrand an existing dashboard application (Next.js/React) with structural changes, navigation renames, layout updates, and new components. Includes backup, rename operations, top bar integration, and new page creation with research-backed design patterns.
triggers:
  - "rebrand my dashboard"
  - "transform the app interface"
  - "rename sections in my dashboard"
  - "add top bar to all pages"
  - "restructure navigation"
  - "create new home page with panels"
  - "transform command center to new brand"
  - "add universal components across app"
  - "redesign dashboard layout"
  - "rebrand agent orchestration interface"
version: 1.0.0
---

# Dashboard Application Transformation

Deploy parallel agents to transform/rebrand an existing dashboard application with structural changes, navigation renames, layout updates, and new components.

## When To Use

Use this pattern when:
- Rebranding/restructuring an existing dashboard (e.g., "Command Center" → "Kiri")
- Renaming navigation sections across all pages
- Adding universal components (top bar, chat interface, status bar)
- Creating new Home page with multiple panels/cards
- Restructuring routes and page hierarchy
- Parallel UI work across multiple files/components

**Not for:**
- New dashboard from scratch (use `interactive-dashboard-builder`)
- Single component tweaks (use `ui-iterative-refinement`)
- Sequential phase-gated work (use `multi-phase-profile-orchestration`)

## The Pattern

```
Step 1: BACKUP
  ↓
Step 2: Deploy agents in PARALLEL for transformation tasks
  ├── Agent A: Navigation renames (sidebar, routes, titles)
  ├── Agent B: Universal component (top bar with chat/status)
  ├── Agent C: New page/layout (Home with multiple panels)
  ├── Agent D: New profiles/agents if needed
  └── Agent E: Research-backed design patterns
  ↓
Step 3: Restart dev server
  ↓
Step 4: Verify transformation
```

## Execution Steps

### Step 1: Create Backup

```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/
cp -r mvp-dashboard mvp-dashboard-backup-$(date +%Y%m%d-%H%M%S)
```

### Step 2: Deploy Parallel Transformation Agents

Each agent works independently on specific transformation tasks:

**Agent A: Navigation & Route Renaming**
```
Goal: Rename navigation sections across app
- "Dashboard" → "Agents"
- "Agents" → "Teams"  
- Update all route references in sidebar.tsx
- Update page files and their exports
- Change app title from "Command Center" to "Kiri"
- Update metadata in layout.tsx
Context: Working directory: ~/command_center/kirimvp_orchestration/phase3_build/mvp-dashboard/
Toolsets: [terminal, file]
```

**Agent B: Universal Top Bar Component**
```
Goal: Create universal top bar (src/components/top-bar.tsx)
Features:
- "Ask Kiri" chat input with purple send button
- System Operational status (green dot + text)
- Agent metrics: "30 Agents" (white number) / "12 Running" (cyan number)
- "New Task" button
- Props for dynamic data: agentCount, runningCount, systemStatus
- Fixed position, appears on ALL pages

Add to layout.tsx:
<TopBar agentCount={agentCount} runningCount={runningCount} />
<Context.Provider>...

Design: Match existing dark theme (slate-950), violet accents
Toolsets: [terminal, file]
```

**Agent C: New Home Page Layout**
```
Goal: Create Home page (src/app/page.tsx) with 3 panels

Panel 1: Agent Fleet Health
- Card with header "Agent Fleet Health"
- 6 agent cards with icons, names, roles, status badges
- Summary stats grid (Online/Busy/Idle/Offline counts)
- Color-coded: green=online, blue=busy, amber=idle, gray=offline

Panel 2: Parallel Execution
- Card with header "Parallel Execution"
- Gantt-style progress bars showing phases
- Phases: Research → Build → Deploy → Validate
- Color-coded bars: amber, blue, violet, emerald
- Timeline legend (0%, 25%, 50%, 75%, 100%)

Panel 3: Intelligence Quality  
- Card with header "Intelligence Quality"
- Progress bars with percentages:
  * Prompt Health: 96%
  * Data Quality: 88%
  * Logic Validation: 94%
  * Context Integrity: 72%
  * Degradation Risk: 12%
- System Intelligence Score: 92/100
- Color gradient: green (>90), blue (>70), amber (>50), red (<50)

Layout: grid grid-cols-1 lg:grid-cols-3 gap-6
Toolsets: [terminal, file]
```

**Agent D: New Agent Profiles (if needed)**
```
Goal: Create new agent profiles in ~/.hermes/profiles/
Agents: ember, watcher, sentry, harbor, quill, drift, compass
For each:
- config.yaml with model assignment
- SOUL.md with persona and responsibilities
- Bash wrapper in ~/.local/bin/

Update dashboard agents.ts to include new agents
Toolsets: [terminal, file]
```

**Agent E: Design Pattern Research (Optional)**
```
Goal: Research competitive intelligence UI patterns
Look at: SimilarWeb, Jenkins, GitHub Actions, Linear.app
Output: Research document with panel layouts, visualization patterns
Use: web, research
```

### Step 3: Parallel Deployment

```python
# Deploy all agents simultaneously
# They work on independent files, no conflicts expected

subprocess.Popen(["hermes", "-p", "vantage", "-z", "Task A: Rename navigation..."])
subprocess.Popen(["hermes", "-p", "launchpad", "-z", "Task B: Create top bar..."])
subprocess.Popen(["hermes", "-p", "forge", "-z", "Task C: Create Home page..."])
subprocess.Popen(["hermes", "-p", "horizon", "-z", "Task E: Research designs..."])
```

### Step 4: Restart Dev Server

```bash
# Kill old process
fuser -k 3000/tcp

# Restart to pick up changes
cd ~/command_center/kirimvp_orchestration/phase3_build/mvp-dashboard
npm run dev

# Verify
curl -s http://localhost:3000 | grep "Command Center"  # Should be 0
curl -s http://localhost:3000 | grep "Kiri"  # Should be > 0
```

### Step 5: Verify Transformation

```bash
# Check navigation renamed
grep -n "Agents" src/components/sidebar.tsx
grep -n "Teams" src/components/sidebar.tsx

# Check top bar exists
ls -la src/components/top-bar.tsx

# Check Home page has 3 panels
grep -c "Card" src/app/page.tsx  # Should be multiple

# Check app title updated
grep "Kiri" src/app/layout.tsx
```

## Key Files to Modify

| File | Task | Agent |
|------|------|-------|
| src/components/sidebar.tsx | Rename nav items | vantage |
| src/app/layout.tsx | Update title | vantage |
| src/components/top-bar.tsx | Create universal bar | launchpad |
| src/app/(dashboard)/layout.tsx | Integrate top bar | launchpad |
| src/app/(dashboard)/page.tsx | New Home with 3 panels | forge |
| src/app/(dashboard)/agents/page.tsx | Create renamed page | forge |
| src/app/(dashboard)/teams/page.tsx | Create renamed page | forge |
| src/data/agents.ts | Update agent list | scope/forge |

## Design Patterns Reference

### Panel Layout (from Linear/Jenkins)
```
┌─────────────────────────────────────────────┐
│ Header: Kiri Dashboard — 30 agents deployed │
├───────────────┬───────────────┬─────────────┤
│ Agent Fleet   │ Parallel      │ Intelligence│
│ Health        │ Execution     │ Quality     │
│               │               │             │
│ • Keystone    │ Research ▓▓   │ Prompt 96%  │
│ • Codex       │ Build    ▓▓▓  │ Data    88% │
│ • Forge       │ Deploy   ▓▓   │ Logic   94% │
│               │ Validate ▓▓▓▓ │ Context 72% │
│               │               │ Risk    12% │
└───────────────┴───────────────┴─────────────┘
```

### Top Bar (from image references)
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Ask Kiri...] [🔮]        ● System Operational    30 Agents    12 Running  │
│                           (green dot)          (white)      (cyan)       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Verification Checklist

- [ ] Backup created with timestamp
- [ ] Navigation renamed (Dashboard→Agents, Agents→Teams)
- [ ] Sidebar title changed to "Kiri"
- [ ] Top bar appears on all pages (fixed position)
- [ ] Top bar has chat input, status, agent counts, New Task button
- [ ] Home page exists with 3 panels
- [ ] Fleet Health shows 6 agent cards with proper status colors
- [ ] Parallel Execution shows Gantt-style phase bars
- [ ] Intelligence Quality shows 5 progress bars with scores
- [ ] Dev server restarted and serving correctly
- [ ] All 30 agents visible in Teams page
- [ ] No "Command Center" text remains in codebase

## Failure Modes & Recovery

### Failure Mode 1: Node Modules Corruption After Restore

**Symptom:** `Error: Cannot find module '../server/require-hook'` after copying backup

**Cause:** Backup contains `node_modules/` with binary paths pointing to absolute locations that no longer exist

**Recovery:**
```bash
# After cp -r backup/ current/, do NOT try to reuse node_modules
cd ~/command_center/kirimvp_orchestration/phase3_build/mvp-dashboard
rm -rf node_modules package-lock.json  # MUST delete from backup
npm install  # Fresh install required
npm run dev
```

**Prevention:** Always clear node_modules from backup before starting server

### Failure Mode 2: File Conflicts From Parallel Agents

**Symptom:** `INTERNAL SERVER ERROR` or broken layout after agents complete

**Cause:** Multiple agents modified same file (e.g., `layout.tsx` updated by both agent A and agent B)

**Recovery:**
```bash
# 1. Restore clean backup
cd ~/command_center/kirimvp_orchestration/phase3_build/
rm -rf mvp-dashboard
cp -r mvp-dashboard-backup-{TIMESTAMP} mvp-dashboard

# 2. Clear corrupted node_modules
cd mvp-dashboard
rm -rf node_modules package-lock.json .next
npm install

# 3. Re-run agents SEQUENTIALLY (not parallel):
# - Agent A: Navigation (modifies sidebar.tsx only)
# - Wait completion, verify
# - Agent B: Top bar (modifies top-bar.tsx, layout.tsx)
# - Wait completion, verify
# - Agent C: Home page (modifies page.tsx only)
```

### Failure Mode 3: Server Claims Port But Returns 500

**Symptom:** `lsof -i :3000` shows process, `curl` returns "Internal Server Error"

**Diagnosis:**
```bash
# Check if it's Next.js module error or app code error
tail -50 ~/.npm/_logs/*-debug.log  # Module errors
# OR
cat mvp-dashboard/.next/server/app/page.js  # Check compiled output
```

**Recovery:**
```bash
# Full reset
fuser -k 3000/tcp
rm -rf .next
npm run build  # Verify build works first
npm run dev    # Then start dev server
```

### Failure Mode 4: Build Succeeds But Dev Server Fails

**Symptom:** `npm run build` works, `npm run dev` crashes

**Cause:** Dev mode requires specific module resolution that production build doesn't

**Recovery:**
```bash
# Dev mode needs clean slate
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Failure Mode 5: Agent Corrupted Dashboard / Port Won't Start

**Symptom:** Dashboard was working, agent "nuked" it, port 3001 non-responsive or returns 500

**Common Causes:**
- Agent deleted/modified critical files (node_modules, .next, src/app/)
- Dependencies installed with incompatible versions
- Turbopack cache corruption
- Multiple conflicting next.config files

**Recovery Protocol:**

```bash
# Step 1: Stop any running servers
pkill -9 -f "next"  # Kill all Next.js processes

# Step 2: Clear ALL corrupted caches
rm -rf .next dev dist node_modules package-lock.json

# Step 3: Reinstall with compatibility flag
npm install --legacy-peer-deps
# (Use --force if --legacy-peer-deps fails)

# Step 4: Check/fix port configuration
# Add to next.config.js if not present:
"""
const nextConfig = {
  server: {
    port: 3001,  // Or your preferred port
  },
  // ... rest of config
}
"""

# Step 5: Start with explicit port
PORT=3001 npm run dev

# Step 6: Verify
sleep 30 && curl -s http://localhost:3001/ | grep -oE "title|Dashboard|Loading" | head -3
```

**Verification Checklist:**
- [ ] Port 3001 (or configured port) shows LISTEN in `lsof -iTCP:3001`
- [ ] `curl http://localhost:3001/` returns HTML (not 000 or 500)
- [ ] Dashboard renders without INTERNAL SERVER ERROR
- [ ] Routes respond: /, /dashboard, /agents, etc.

## Pre-Flight Verification (DO THIS FIRST)

Before ANY transformation:

```bash
# 1. Verify current state works
cd ~/command_center/kirimvp_orchestration/phase3_build/mvp-dashboard
curl -s http://localhost:3000 | grep -o "Command Center" | head -1
# Should return: "Command Center"

# 2. Create fresh backup
cp -r mvp-dashboard mvp-dashboard-backup-$(date +%Y%m%d-%H%M%S)

# 3. Stop server
fuser -k 3000/tcp

# 4. Note agent count / current state for verification later
```

## Agent Coordination Rules

To avoid conflicts when deploying parallel agents:

### ✅ Safe to Parallelize:
| Task | Files Modified | Can Parallel |
|------|---------------|--------------|
| Create new component | `src/components/new.tsx` | ✅ Yes |
| Rename sidebar items | `src/components/sidebar.tsx` | ✅ Yes |
| Update page content | `src/app/teams/page.tsx` | ✅ Yes |
| Create agent profiles | `~/.hermes/profiles/*` | ✅ Yes |

### ❌ Must Be Sequential:
| Task | Files Modified | Conflict Risk |
|------|---------------|---------------|
| Create TopBar + integrate | `top-bar.tsx` + `layout.tsx` | **HIGH** |
| Rename routes + update nav | `sidebar.tsx` + `page.tsx` | **MEDIUM** |
| Add global styles + change theme | `layout.tsx` + CSS files | **HIGH** |

### Rule: Shared File = Sequential Execution

If two agents touch the same file, they run sequentially:
```python
# Bad - causes conflicts:
delegate_task(agent="launchpad", goal="Create top bar and add to layout")
delegate_task(agent="vantage", goal="Rename nav and update layout")
# Both modify layout.tsx → corruption

# Good - sequential:
delegate_task(agent="vantage", goal="Rename nav...")  # First
# Wait... verify sidebar.tsx only changed
delegate_task(agent="launchpad", goal="Create top bar...")  # Second
```

## Example: Complete Transformation

```
User: "Transform my Command Center dashboard into 'Kiri' with new nav and panels"

Hermes:
1. Backup current state
   ↓
2. Deploy 4 agents in parallel:
   - vantage: Rename Dashboard→Agents, Agents→Teams, title→"Kiri"
   - launchpad: Create universal top bar with chat, status, metrics
   - forge: New Home page with 3-panel layout (Fleet/Parallel/Quality)
   - horizon: Research competitive intel UI patterns (async)
   ↓
3. Restart dev server on port 3000
   ↓
4. Verify transformation complete
   ↓
Result: "Kiri Dashboard" live with 30 agents, universal top bar, 3 Home panels
```

## Comparison with Other Skills

| Skill | Use When | This Skill Covers |
|-------|----------|-------------------|
| agent-team-workflow-orchestration | Create Team pattern specifically | Generic transformation playbook |
| multi-phase-profile-orchestration | Sequential phase dependencies | Parallel transformation tasks |
| ui-iterative-refinement | Surgical UI tweaks | Full structural rebrand/rename |
| subagent-driven-development | Generic multi-agent work | Dashboard-specific transformation |
| This skill (NEW) | Rebrand/restructure existing dashboard | App transformation with parallel agents |

## Key Principles

1. **Always backup first** — Rollback if transformation goes wrong
2. **Deploy agents in parallel** — Independent tasks, no conflicts
3. **Match existing design system** — Use same colors, spacing, typography
4. **Verify each change** — Spot check files, restart server, confirm serving
5. **Research-backed design** — Look at Linear, Jenkins, GitHub for patterns

v1.0.0 — Dashboard application transformation with parallel agent deployment