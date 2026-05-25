---
name: iterative-ui-component-addition
version: 2.0.0
description: Safe workflow for adding UI components via agents with verification fallback. Supports both simple dispatch-and-verify and full 6-phase sequential pipeline with specialized agents.
tags: [ui, react, nextjs, agent-delegation, verification, fallback, multi-agent-pipeline]
trigger: |
  Adding a new UI component to a React/Next.js dashboard using an agent tool, OR
  building a multi-module dashboard page from a reference image while preserving existing design system (replicate structure, NOT colors), OR
  when an agent reports success but the component file doesn't actually exist, OR
  any iterative UI workflow requiring "agent creates → verify → fallback to manual if needed → validate", OR
  making iterative UI refinements that require design integrity preservation with snapshot safety, OR
  using a specialized agent team (mason/forge/keystone/ember OR relic/scope/forge/ember/prism) for phased UI development, OR
  restoring a previously-existing component that was deliberately removed or excluded from git, OR
  fixing color system violations (wrong border colors, incorrect accent usage, slate vs gray corrections)
---

# Iterative UI Component Addition

Safe workflow for adding UI components via agent tools with validation checkpoints.
Handles agent silent failures by falling back to manual file creation.
Used after DESIGN.md exists and specifies component requirements.

## Workflow Selection

Choose the right workflow based on complexity:

| Scenario | Workflow | Agents |
|----------|----------|--------|
| Simple component addition, one agent | **Quick Mode** (Steps 1-5) | Any build agent |
| Multi-module dashboard from reference image | **Sequential Build Mode** | mason → forge → keystone → ember |
| Design-critical changes, alignment to spec | **Pipeline Mode** (6-Phase Cycle) | relic/scope/forge/ember/prism |
| Working with specialized agent team | **Pipeline Mode** | As above |
| Need perfect fidelity to DESIGN.md | **Pipeline Mode** | As above |

### Sequential Build Mode (for Dashboard Modules)

When building from a reference image while preserving existing design system:

**Agent Sequence:**
1. **@mason** (Architect) → Create types, components, data structures
2. **@forge** (Builder) → Assemble complete page with all modules
3. **@keystone** (Reviewer) → Validate design system compliance, no color drift
4. **@ember** (Validator) → Test build, verify modules render

**Key Principle:** Replicate STRUCTURE from reference image, but use COLORS/TYPOGRAPHY from existing design system (slate/emerald/amber/blue/gray, NOT purple/pink from reference).

**Timing:** Dispatch each agent with 4-5 minute intervals to prevent overlap:
```python
cronjob_create(name="mason-dash-arch", schedule="1m", ...)
cronjob_create(name="forge-dash-build", schedule="5m", context_from=[mason_job], ...)
cronjob_create(name="keystone-dash-review", schedule="10m", context_from=[mason_job, forge_job], ...)
cronjob_create(name="ember-dash-validate", schedule="15m", context_from=[...], ...)
```

### FORGE Agent Phase: Assembling Pre-Architected Components

When you are the FORGE agent (or acting as one) and receive context from a MASON architecture job:

**Input Context:**
- MASON's output with file list: `src/types/dashboard*.ts`, `src/components/dashboard/*.tsx`, `src/data/dashboard*.ts`
- Main page target: `src/app/(dashboard)/[page]/page.tsx`
- Navigation target: `src/components/sidebar.tsx` (or similar)

**Execution Steps:**

1. **Verify architecture files exist**
   ```bash
   # Check types exist
   ls -la src/types/dashboard*.ts
   
   # Check data exists
   ls -la src/data/dashboard*.ts
   
   # Check components exist
   ls -la src/components/dashboard/
   ```
   If files don't exist, report: `MASON_FILES_MISSING` with list of missing files.

2. **Read the architecture**
   - Import types to understand data structures
   - Import components to understand props
   - Import data to use in the page

3. **Create the main page**
   - Use exact grid layout from spec (e.g., `grid-cols-3` for rows 1-2, `grid-cols-2` for row 3)
   - Import all components from `@/components/dashboard/`
   - Import data from `@/data/dashboard*` or `@/data/dashboard-page*`
   - Import types as needed

4. **Update navigation**
   ```typescript
   // Add to navItems array in sidebar.tsx
   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
   ```

5. **Build and verify**
   ```bash
   npm run build 2>&1 | tail -20
   ```
   Must exit 0 with no TypeScript errors.

6. **Report completion**
   Output format:
   ```
   CONFIRM_FORGE_COMPLETE
   
   ### Summary
   - Page created: src/app/(dashboard)/dashboard/page.tsx
   - Navigation updated: src/components/sidebar.tsx
   - Build status: Success
   
   ### Files Modified/Created
   ```

**Color Constraints:**
- Only use: `bg-card`, `emerald-500`, `amber-500`, `blue-500`, `slate-*`
- NO purple/pink colors
- Follow existing card patterns: `rounded-lg border bg-card text-card-foreground shadow-sm`

**Spacing:** Dispatch each agent with 4-5 minute intervals to prevent overlap:
```python
cronjob_create(name="mason-dash-arch", schedule="1m", ...)
cronjob_create(name="forge-dash-build", schedule="5m", context_from=[mason_job], ...)
cronjob_create(name="keystone-dash-review", schedule="10m", context_from=[mason_job, forge_job], ...)
cronjob_create(name="ember-dash-validate", schedule="15m", context_from=[...], ...)
```

## Workflow A: Quick Mode (Simple)

For straightforward component additions with a single agent.

## Workflow B: Pipeline Mode (Design-Integrity-First)

Use when DESIGN.md exists and design fidelity is critical. Leverages specialized agent team.

### Agent Roles
| Agent | Phase | Responsibility |
|-------|-------|----------------|
| **Relic** | Pre / Post | Snapshots working state before/after |
| **Scope** | Research | Extract exact specs from DESIGN.md |
| **Forge** | Build | Implement component to exact spec |
| **Ember** | Validate | Check for style drift vs DESIGN.md |
| **Prism** | Test | Build verification, functionality check |
| **(You)** | Gate | Approve/reject, trigger Relic restore if rejected |

### The 6-Phase Cycle

```
ITERATION (each change):
├─ RELIC: SNAPSHOT current working state
├─ SCOPE: RESEARCH exact design specs
├─ FORGE: IMPLEMENT component/modification  
├─ EMBER: VALIDATE quality (no drift)
├─ PRISM: TEST functionality (build + interactive)
└─ RELIC: SNAPSHOT new state (if approved)

DECISION: approve → keep | reject → Relic restore
```

### Step-by-Step Pipeline Mode

#### Phase 1: RELIC — Snapshot Current State

Create backup before any changes:

```bash
# Manual snapshot (relic CLI may have connection issues)
cd ~/infrastructure/backup-system/snapshots
mkdir -p <project>-pre-<change>-$(date +%Y%m%d-%H%M%S)
cp -r <project-path>/src <project>-pre-<change>-*/
```

Mark todo: `RELIC: Snapshot current working state` → ✅

#### Phase 2: SCOPE — Research Exact Design Specs

Extract precise specifications from DESIGN.md for the change:

```python
delegate_task(
    goal="Extract EXACT design specs from DESIGN.md for the [component/change]",
    context="""
    Read: ~/project/DESIGN.md
    
    Extract these specific values:
    1. Element height (h-X)
    2. Container padding (px-X, py-X)
    3. Border radius exact value
    4. Input border styling specifics
    5. Button sizing and alignment spacing
    6. Gap between elements
    7. Header/container height
    8. Placeholder text formatting
    9. Flex patterns (flex-1 vs w-full usage)
    
    Return structured specification document that Forge can follow EXACTLY.
    """,
    toolsets=['file']
)
```

Example output: Table with "Current (Wrong) → Design Spec (Correct)" values

Mark todo: `SCOPE: Research exact design specs` → ✅

#### Phase 3: FORGE — Implement to Exact Spec

Dispatch Forge with detailed spec from Scope:

```python
delegate_task(
    goal="Build/fix [component-name] to match DESIGN.md exactly",
    context="""
    EXACT SPECIFICATIONS from Scope research:
    - Container: bg-surface-100 px-4 h-12, NOT bg-card px-1
    - Input: border-0 bg-transparent flex-1 h-full focus-visible:ring-0
    - Send button: h-8 w-8 (not h-10 w-10)
    - [Any other specific fixes]
    
    File: src/components/[component-name].tsx
    
    Follow DESIGN.md exactly. No creative interpretation.
    """,
    toolsets=['file', 'terminal']
)
```

Mark todo: `FORGE: Fix [specific change]` → ✅

**If EMBER finds issues:** Add todo `FORGE FIX: [specific issue]`, dispatch again, then re-run EMBER.

#### Phase 4: EMBER — Validate No Style Drift

Compare implementation against DESIGN.md spec:

```python
delegate_task(
    goal="VALIDATE [component] follows DESIGN.md exactly. NO style drift",
    context="""
    Check file: src/components/[component-name].tsx
    
    DESIGN.md required specs: [paste from Scope output]
    
    Read the file and compare EACH className against DESIGN.md.
    Report any discrepancies as FAILURES.
    Report perfect alignment as PASSED.
    
    If drift found, say exactly what's wrong and where.
    """,
    toolsets=['file']
)
```

**EMBER Output:**
- ✅ PASSED — proceed to PRISM
- ❌ PARTIAL FAILURE — dispatch FORGE FIX with specific issue list

Mark todo: `EMBER: Validate quality` → ✅

#### Phase 5: PRISM — Test Functionality

Build and verify everything works:

```python
delegate_task(
    goal="TEST [component] changes end-to-end",
    context=""""
    1. Build: npm run build (check for errors)
    2. Verify renders: curl http://localhost:3000 | grep "[expected-text]"
    3. Check interactive functionality still works
    
    Report: Build status, any errors, functionality verification.
    """,
    toolsets=['terminal']
)
```

**PRISM tests:**
- Build passes (no TypeScript/lint errors)
- Component renders (HTML verification)
- Interactive elements work (onChange, onKeyDown, etc.)
- Visual appearance correct

Mark todo: `PRISM: Test functionality` → ✅

#### Phase 6: User Decision Gate

**Present summary:**

| Phase | Status | Key Finding |
|-------|--------|-------------|
| RELIC | ✅ | Snapshot created: `<backup-path>` |
| SCOPE | ✅ | Specs extracted from DESIGN.md |
| FORGE | ✅ | Implemented [specific changes] |
| EMBER | ✅ | No style drift detected |
| PRISM | ✅ | Build passes, functionality verified |

**Your DECISION:**
- **Approve** → "Keep" → Create final Relic snapshot
- **Reject** → "Restore" → Relic restores from pre-change snapshot

#### Phase 7: RELIC — Final Snapshot (if approved)

Only if user approves:

```bash
mkdir -p <project>-post-<change>-$(date +%Y%m%d-%H%M%S)
cp -r <project-path>/src <project>-post-<change>-*/
```

Mark todo: `RELIC: Snapshot new state` → ✅

---

## Quick Mode Procedure (Workflow A)

### Step 1: Pre-flight
- Confirm DESIGN.md exists with component specifications
- Ensure dev server is running on expected port
- Verify agent profile is ready for dispatch

### Step 2: Dispatch Agent
```
hermes -p <agent> "Create <component-name> in src/components/"
```
- Include DESIGN.md path in context if agent supports it
- Specify exact file path: `src/components/<kebab-case>.tsx`

### Step 3: Verification (CRITICAL)
```bash
ls -la src/components/<component-name>.tsx
cat src/components/<component-name>.tsx | head -20
```
**If file doesn't exist → GO TO FALLBACK**

### Step 4: Integration
- Read `layout.tsx` or target page file
- Add import: `import { ComponentName } from "@/components/component-name"`
- Insert JSX where specified
- Verify @/ path alias (not relative paths)

### Step 5: Build & Validate
```bash
npm run build
curl -s http://localhost:3000 | grep -o '<expected-text>' | wc -l
```

### Step 6: FALLBACK — Manual Creation
**When:** Agent reported success but file missing (silent failure)

```
write_file path=src/components/<name>.tsx
```
- Follow DESIGN.md specification exactly
- Include `"use client"` if using hooks
- Import UI components from `@/components/ui/`

## Pitfalls
- Confirm DESIGN.md exists with component specifications
- Ensure dev server is running on expected port
- Verify agent profile is ready for dispatch

### Step 2: Dispatch Agent
```
hermes -p <agent> "Create <component-name> in src/components/"
```
- Include DESIGN.md path in context if agent supports it
- Specify exact file path: `src/components/<kebab-case>.tsx`

### Step 3: Verification (CRITICAL)
```bash
ls -la src/components/<component-name>.tsx
cat src/components/<component-name>.tsx | head -20
```
**If file doesn't exist → GO TO FALLBACK**

### Step 4: Integration
- Read `layout.tsx` or target page file
- Add import: `import { ComponentName } from "@/components/component-name"`
- Insert JSX where specified
- Verify @/ path alias (not relative paths)

### Step 5: Build & Validate
```bash
npm run build
curl -s http://localhost:3000 | grep -o '<expected-text>' | wc -l
```

### Step 6: FALLBACK — Manual Creation
**When:** Agent reported success but file missing (silent failure)

```
write_file path=src/components/<name>.tsx
```
- Follow DESIGN.md specification exactly
- Include `"use client"` if using hooks
- Import UI components from `@/components/ui/`

## Governance / Delegation Hierarchy

**CRITICAL:** This workflow requires strict role separation. Kiri (orchestrator) must NEVER do implementation directly.

| Role | Responsibility | What NOT to do |
|------|----------------|--------------|
| **User** | Strategic decisions, approvals | - |
| **Kiri** | Orchestration, dispatch, verification | Never use `delegate_task` or `write_file` for implementation |
| **Core Build Team** | Implementation (Forge, Relic, Ember, Prism, Scope) | Never bypass via direct subagent calls |

**Correct Dispatch Pattern:**
```bash
# ✅ CORRECT: Dispatch through agent profile
hermes -p forge "Create component per DESIGN.md..."

# ❌ WRONG: Direct implementation via delegate_task
delegate_task(goal="Create component...")  # Kiri becomes executor - VIOLATION
```

**Trigger condition:** If you find yourself writing component code or using `delegate_task` for build work, STOP. Redispatch through proper agent profile.

## Pitfalls

| Issue | Prevention |
|-------|------------|
| Agent silent failure | Always `ls` verify before proceeding |
| Import path errors | Use `@/components/` never `../../` |
| Server not reflecting changes | Explicit restart after layout.tsx changes |
| Duplicate UI elements | Check if page-level buttons duplicate layout-level |
| **Delegation hierarchy violation** | Use `hermes -p <agent>`, never `delegate_task` for builds |

## Verification Checklist

- [ ] File exists: `ls -la src/components/<name>.tsx`
- [ ] File non-empty: `wc -c > 500`
- [ ] Renders correctly: `curl | grep` finds expected text
- [ ] Build passes: `npm run build` exits 0
