---
name: design-system-collaboration
description: >
  Orchestrate multi-agent teams to create comprehensive design systems while preserving 
  accumulated design wisdom from previous iterations. Agents study existing implementations,
  extract best patterns, formalize into tokens/documentation, and apply systematically with
  sequential handoffs between research, documentation, and implementation phases.
version: 1.1.0
tags: [design-system, multi-agent, collaboration, pattern-preservation, token-generation, accent-colors, logo-design, brand-tokens]
triggers:
  - create design system for existing UI
  - formalize design patterns across multiple UI versions
  - preserve accumulated design wisdom in documentation
  - multi-agent design system with historical research
  - study existing UI and create design tokens
  - iterate on established design with agent teams
  - extract visual DNA from working implementations
  - incorporate logo colors into design tokens
  - add branding palette extension
---

# Multi-Agent Design System Collaboration

## Purpose

Capture the **visual DNA** of accumulated UI iterations and formalize it into a comprehensive design system through **coordinated agent teams**.

The problem: Beautiful working UIs developed through iterative agent work (3000 → 3001 → 3002) accumulate design wisdom from web research (Linear.app, Stripe, Vercel aesthetics) but **lack formalized documentation**. When new agents work on the UI, they:
- Don't know which patterns came from rigorous web research vs. arbitrary choices
- Can't access the accumulated wisdom of previous iterations
- Make decisions that drift from established aesthetic
- Waste time rediscovering solved design problems

The solution: Multi-agent collaboration to study, document, and preserve design patterns.

---

## When To Use

Use this workflow when:
- ✅ Multiple UI iterations exist with accumulated design wisdom
- ✅ Web research informed aesthetic decisions (Linear.app, etc.)
- ✅ Need formal design system for scaling UI work
- ✅ Want to preserve "best of" patterns from all iterations
- ✅ Planning iterative UI enhancement with agent teams
- ✅ Current UI works but lacks documented design system

### ⚠️ Critical Difference

**This is NOT:**
- ❌ Creating UI from scratch (use `interactive-dashboard-builder`)
- ❌ Iterating on existing UI (use `ui-iterative-refinement`)
- ❌ Single-agent design documentation (use `design-system-extraction`)

**This IS:**
- ✅ Multi-agent collaboration for comprehensive design system creation
- ✅ Preserving historical wisdom from accumulated iterations
- ✅ Research-backed design token generation
- ✅ Sequential handoff: Research → Document → Apply

---

## The Three-Agent Collaboration

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: RESEARCH (@palette or design researcher)          │
│  ┌─────────────┐                                            │
│  │ Study       │  Read existing design docs                  │
│  │   DESIGN.md │  Analyze current UI globals.css            │
│  │   PRODUCT_  │  Review iteration history                  │
│  │      VISION │  Extract web research artifacts            │
│  └──────┬──────┘                                            │
│         │                                                    │
│         └─→ Output: Raw design analysis, pattern catalog     │
│                                                    │         │
│  PHASE 2: DOCUMENTATION (@keystone or design architect)      │
│         │                                                    │
│         └─→ Input: Raw analysis from Phase 1                 │
│               ┌──────────────┐                             │
│               │  Formalize     │  Create DESIGN_SYSTEM.md    │
│               │    into        │  Create design-tokens.json │
│               │    tokens      │  Document semantic names   │
│               └──────┬─────────┘                             │
│                      │                                       │
│                      └─→ Output: Design system specification  │
│                                                    │         │
│  PHASE 3: APPLY (@prism or UI implementer)                   │
│                      │                                       │
│                      └─→ Input: Design system spec           │
│                            ┌──────────────┐                  │
│                            │  Apply to      │  Update all     │
│                            │  existing      │  components     │
│                            │  components    │  Verify         │
│                            └──────┬───────┘                  │
│                                   │                          │
│                                   └─→ Output: Aligned UI     │
└─────────────────────────────────────────────────────────────┘
```

---

## Agent Roles

### Agent 1: Pattern Researcher (@palette)

**Goal:** Study existing implementations and extract all design patterns

**Scope:**
- Read `DESIGN.md` (core vision)
- Read `PRODUCT_VISION.md` (strategic intent)
- Read `iteration_final/DESIGN.md` (latest patterns)
- Read `ux_design_spec.md` (UX standards)
- Analyze `globals.css` + `tailwind.config.ts`
- Study all dashboard components
- Extract "best of" from 3000/3001/3002 iterations
- Catalog accumulated web research (Linear.app, etc.)

**Output:** Raw design analysis with pattern catalog

**Working Directory:** `~/command_center/kirimvp_orchestration/phase3_build/design-system/`

---

### Agent 2: Design Architect (@keystone)

**Goal:** Formalize raw analysis into comprehensive design system

**Scope:**
- Take Phase 1 research as input
- Create `DESIGN_SYSTEM.md` with:
  - Core principles (Linear.app aesthetic, 8px grid, dark-first)
  - Color system (semantic tokens, status colors)
  - Typography scale (Inter family, geometric precision)
  - Spacing system (8px grid)
  - Elevation model (luminance-based, glow effects)
  - Animation timing (100ms/150ms/300ms/400ms)
  - Component patterns (cards, buttons, inputs)
- Create `design-tokens.json` (machine-readable source of truth)

**Key:** Document **semantic names**, not hex values

**Output:** Complete design system specification

---

### Agent 3: System Implementer (@prism)

**Goal:** Apply design system to all existing components

**Scope:**
- Take Phase 2 specification as input
- Update **all** components to match tokens:
  - Sidebar styling (colors, borders, hover states)
  - Card modules (backgrounds, borders, shadows)
  - Chat bar (match module aesthetics)
  - Agent cards (status colors, typography)
- Replace hardcoded colors with semantic tokens
- Verify alignment across entire dashboard

**Output:** Consistent, documented UI

---

## Sequential Handoff Protocol

**CRITICAL:** These phases must run **sequentially**, not parallel.

```python
# Phase 1: Research
delegate_task(
    goal="Study design patterns",
    context="...",
    agent="@palette"
)
# Wait for completion notification...

# Phase 2: Documentation
delegate_task(
    goal="Create DESIGN_SYSTEM.md",
    context_from=["palette-task-id"],  # Inherit Phase 1 output
    agent="@keystone"
)
# Wait for completion notification...

# Phase 3: Implementation
delegate_task(
    goal="Apply design system to components",
    context_from=["keystone-task-id"],  # Inherit Phase 2 output
    agent="@prism"
)
```

---

## Required Capabilities

**Give each agent maximum capabilities:**

| Capability | Why |
|------------|-----|
| Main/Aux/Fallback models | Design work benefits from multi-model comparison |
| Web research skills | Reference market-leading UIs (Linear, Stripe, Vercel) |
| Design-delegation skill | Create visual assets if needed |
| Popular-web-designs skill | Access 54+ real design systems |
| File access | Read/write design docs and components |

---

## Design System Principles to Preserve

### Linear.app Aesthetic
- **Dark-first**: Deepest blacks, subtle surface layers
- **Geometric precision**: 8px grid, exact alignment
- **Restrained palette**: Status colors semantic, neutrals dominant
- **Micro-interactions**: Fast, purposeful (100-400ms)
- **High contrast**: White text on black, clear hierarchy

### From Accumulated Iterations
- **Emerald/Amber/Blue accents** for status only
- **Slate/zinc neutrals** for surfaces (not gray with green/blue tint)
- **ease-out-expo** for all transitions
- **Card-based** modular layout
- **Fixed sidebar** with offset content

---

## Output Artifacts

### 1. DESIGN_SYSTEM.md
```markdown
# Kiri Design System

## Core Principles
1. Dark-first aesthetic
2. Linear.app geometric precision
3. Semantic color tokens
...

## Color System
| Token | Value | Usage |
|-------|-------|-------|
| --background | hsl(240 10% 3.9%) | Deepest layer |
| --surface-100 | #0a0a0f | Cards/panels |
| --accent-emerald | #10b981 | Online/success |
...

## Typography
| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Inter | 600 | 24px |
| Body | Inter | 400 | 14px |
...
```

### 2. design-tokens.json
```json
{
  "colors": {
    "background": {"value": "hsl(240 10% 3.9%)", "type": "color"},
    "surface": {
      "100": {"value": "#0a0a0f", "type": "color"},
      "200": {"value": "#141417", "type": "color"}
    },
    "accent": {
      "emerald": {"value": "#10b981", "type": "color"},
      "amber": {"value": "#f59e0b", "type": "color"}
    }
  },
  "typography": {...},
  "spacing": {...},
  "animation": {...}
}
```

### 3. Component Token Mapping
```tsx
// Before: Hardcoded
<button className="bg-blue-600 text-white" />

// After: Semantic tokens
<button className="bg-accent text-accent-foreground" />
```

  - Logo/branding token extensions
  - Multi-model agent access for design research
  - Preservation snapshots before changes

---

## Quick Reference: Execution Patterns

### For Design System Creation (This Skill)

```python
# Phase 1: Research (Background mode - complex)
terminal(
    command="hermes -p palette -z 'Research task...'",
    background=True,
    notify_on_complete=True
)
# Wait for notification...

# Phase 2: Documentation
terminal(
    command="hermes -p keystone -z 'Create DESIGN_SYSTEM.md...'",
    background=True,
    notify_on_complete=True
)
# Wait for notification...

# Phase 3: Implementation
terminal(
    command="hermes -p prism -z 'Apply tokens to components...'",
    background=True,
    notify_on_complete=True
)
```

**Why background mode?** Design system work exceeds 180s foreground timeout. Background mode with `notify_on_complete=True` is the reliable pattern.

---

## Failure Patterns & Solutions

### Pattern 1: Agent Profile Config Errors

**Symptom:** Agent spawns but exits immediately with YAML parsing errors.

**Root Cause:** Profile `config.yaml` has formatting issues (indentation, misplaced keys).

**Solution:**
```bash
# Validate YAML before dispatch:
python3 -c "import yaml; yaml.safe_load(open('~/.hermes/profiles/agent/config.yaml'))"

# If invalid, fix or delete and recreate profile
rm -rf ~/.hermes/profiles/agent/  # Then recreate cleanly
```

---

### Pattern 2: SOUL.md Context Overflow (Silent Failures)

**Symptom:** Agent "completes" with exit code 0, produces **no output**, **no files**, **zero tool calls**.

**Diagnostic:**
```bash
# Check session log:
cat ~/.hermes/profiles/agent/sessions/session_latest.json | \
  jq '.messages | length'  # Shows: 1 (only user prompt, no tool execution)
```

**Root Cause:** SOUL.md too large (2,000+ characters) + task prompt exceeds model context window. Model cannot process, exits silently.

**Solution:**

**Option A: Reduce SOUL.md to minimal size**
```bash
cat > ~/.hermes/profiles/agent/SOUL.md << 'EOF'
# Agent Name - Brief Role

## Role
One-line description.

## Core Tasks
1. Task category 1
2. Task category 2
3. Task category 3

## Alert Levels
GREEN (>80%), YELLOW (60-80%), ORANGE (40-60%), RED (<40%)
EOF
# Total: ~200-400 characters (was 2,800+)
```

**Option B: Use interactive mode for complex personas**
```bash
# Interactive mode handles larger context
hermes -p agent chat
# Then provide detailed persona in conversation
```

**The Rule:**
```
Oneshot dispatch (-z) → Minimal SOUL.md required (<500 chars)
Interactive mode (chat) → Any SOUL.md size OK
```

---

### Pattern 3: Timeout Differences (delegate_task vs hermes -p)

**Critical Distinction:**

| Dispatch Method | Timeout | Best For |
|-----------------|---------|----------|
| `delegate_task` | 600s | Bounded tasks, parallel execution |
| `hermes -p` foreground | 180s | Quick queries (<120s expected) |
| `hermes -p` background | Unlimited | Complex design/code work |
| Gateway dispatch | Unlimited | Full tool access, no limit |

**For Design System Work:**

```python
# ❌ WRONG — Will timeout at 180s
terminal(command="hermes -p palette -z 'Create design system...'")

# ✅ CORRECT — Background mode for complex work
terminal(
    command="hermes -p palette -z 'Create design system...'",
    background=True,
    notify_on_complete=True
)

# ✅ ALSO CORRECT — delegate_task with 600s
delegate_task(goal="Create design system...")
```

**Historical Context:** Previous "successful" 500-800s agent deployments likely used background mode or gateway dispatch, not foreground terminal.

---

### Pattern 4: Provider Configuration Not Propagated

**Symptom:** Background `hermes -p` processes fail with "No inference provider configured."

**Root Cause:** Child processes don't inherit parent session's provider configuration.

**Solution:**

**Option 1: Export before dispatch**
```bash
export OLLAMA_API_KEY=your_key_here
export OLLAMA_BASE_URL=https://ollama.com/v1
hermes -p agent -z "Task..."
```

**Option 2: Inline environment**
```bash
OLLAMA_API_KEY=your_key hermes -p agent -z "Task..."
```

**Option 3: Use delegate_task instead** (handles auth propagation)
```python
delegate_task(goal="Task...", toolsets=["file"])
```

---

### Pattern 5: Working Directory Confusion (Files in Wrong Location)

**Symptom:** Agent reports success but files appear in wrong directory (e.g., `phase3_build/src/` instead of `mvp-dashboard-staging/src/`).

**Root Cause:** Relative paths (`../design-system/`) confuse agent about actual working directory, especially when files need to be created.

**Solution:**

**Always use absolute paths in prompts:**
```bash
# ❌ AMBIGUOUS — relative paths confuse working dir
cd ~/project && hermes -p agent -z "Update files in ../design-system/..."

# ✅ EXPLICIT — absolute path for working directory
cd ~/project/mvp-dashboard-staging && hermes -p agent -z "Update files... Study /home/user/project/design-system/..."

# ✅ ALSO CORRECT — cd first, then dispatch with explicit paths
hermes -p agent chat --workdir ~/project/mvp-dashboard-staging
```

**Pre-flight check:**
```bash
# Verify where agent will work
pwd  # Should be exact project root
ls -la src/components/  # Verify components exist here
```

---

### Pattern 6: Gateway Stopped (Code Work Times Out)

**Pattern:** Simple queries succeed, code work times out at 180s.

**Diagnosis:**
```bash
hermes status | grep "Gateway Service"
# Output: Gateway Service   ✗ stopped
```

**Root Cause:** Code work (file writes, terminal commands) requires gateway for tool dispatch. Without gateway, agent process hangs.

**Solutions:**
1. Start gateway: `hermes gateway run` (blocks terminal)
2. Use tmux: `tmux new -s hermes-gateway 'hermes gateway run'`
3. Use `delegate_task` instead (bypasses profile/gateway system)

**Summary Decision Tree:**
```
Need to dispatch agents?
├── Simple query (<60s)? → hermes -p foreground OK
├── Complex work? → Use background=True + notify_on_complete=True
└── Need full tool chain? → Ensure gateway running OR use delegate_task
```

---

## Extended Pattern: Accent Colors & Branding

When incorporating visual identity elements (logos, inspired palettes):

### Adding Accent Palettes

Reference image-based palettes map to semantic roles:

```
Palette extracted from visual reference:
├── Primary accent: Cyan #6CD9BA / Green #07D98C (CTA buttons)
├── Secondary accent: Royal Blue #1E18D9 / Blue #4227F2 (links)
├── Brand highlight: Lavender #B775BF / Pink #F27EB4 (logo, badges)
├── Dark accent: Purple #3F289D / Magenta #A60D61 (deep states)
└── Neutral dark: Navy #13121A / Dark #400224 (shadows)

Usage rules:
- Base colors (slate/gray): PRESERVE — do not replace
- Accent slots: EXTEND — add to design tokens with semantic names
- Logo: EXTEND — dedicated brand token category
```

### Brand Token Extension

```json
{
  "colors": {
    "base": {
      "background": { "value": "hsl(240 10% 3.9%)" },
      "foreground": { "value": "hsl(0 0% 98%)" }
    },
    "accent": {
      "emerald": { "value": "#10b981", "usage": "online/success" },
      "amber": { "value": "#f59e0b", "usage": "warning/idle" },
      "blue": { "value": "#3b82f6", "usage": "active/progress" }
    },
    "brand": {
      "primary": { "value": "#6CD9BA", "source": "logo palette", "usage": "logo, primary-accent" },
      "secondary": { "value": "#B775BF", "source": "logo palette", "usage": "badges, highlights" },
      "dark": { "value": "#13121A", "source": "logo palette", "usage": "shadows, depth" }
    }
  }
}
```

### Oversight Agent Pattern

For complex multi-phase collaborations, add oversight:

| Phase | Agent | Task | Oversight |
|-------|-------|------|-----------|
| 1 | Researcher | Extract patterns | @keystone monitors progress |
| 2 | Document | Formalize tokens | @keystone verifies output |
| 3 | Implementer | Apply to UI | @keystone coordinates handoffs |
| - | @relic | Preserve snapshots | Before/after state |

**Oversight responsibilities:**
- Validate sequential execution order
- Check agent health/retry on failure
- Ensure output artifacts exist before handoff
- Coordinate preservation snapshots

---

### Concrete Values + Semantic Names (Best Practice)

**Pattern evolved:** Design systems benefit from **both** semantic names **and** concrete hex/RGBA values.

**Structure:**
```json
{
  "values": {
    "voidBlack": "#0a0a0c",
    "violetAccent": "#8b5cf6",
    "borderSubtle": "rgba(255, 255, 255, 0.04)"
  },
  "colors": {
    "background": {
      "value": "{voidBlack}",
      "description": "Deepest background layer"
    }
  }
}
```

**Why both:**
- **Semantic names** for developer ergonomics (`bg-background`)
- **Concrete values** for implementer reference (no guessing hex codes)
- **Machine-readable** for automated design system tools

**When reviewing design systems, ensure:**
```bash
# Check tokens have concrete values
grep -E '"value":\s*"#[0-9a-f]' design-tokens.json | wc -l
# Expected: >0

grep -E '"values":\s*\{' design-tokens.json
# Expected: Found (root-level values section)
```

---

## Verification Checklist

After Phase 3 (@prism) completes:

```bash
# 1. No hardcoded colors remaining
grep -r "blue-600\\|emerald-600" src/components/*.tsx | wc -l
# Expected: 0

# 2. All using semantic tokens
grep -r "bg-accent\\|text-muted-foreground" src/components/*.tsx | wc -l
# Expected: >0

# 3. Build passes
npm run build
# Expected: success

# 4. Visual verification
# Check: All modules use consistent backgrounds
# Check: Status colors follow semantic rules
# Check: No decorative blue in neutral states
```

---

## Related Skills

- `design-system-extraction` — Single-agent token extraction (use before this skill for smaller scope)
- `ui-iterative-refinement` — Surgical UI updates after design system documented
- `subagent-driven-development` — Generic agent delegation (use for non-design tasks)
- `build-artifact-recovery` — Snapshot preservation before major changes

---

## Example Execution

**User:** "Create design system preserving 3000/3001 accumulated wisdom"

```
Kiri: "Deploying 3-agent collaboration"

[Phase 1: @palette researching...]
→ Analyzed DESIGN.md, PRODUCT_VISION.md, iteration_final/DESIGN.md
→ Extracted Linear.app patterns, 8px grid, ease-out-expo
→ Cataloged web research artifacts
→ Output: pattern-catalog.md

[Phase 2: @keystone formalizing...]
→ Created DESIGN_SYSTEM.md with semantic tokens
→ Created design-tokens.json
→ Documented 8px grid, typography scale, component patterns
→ Output: design-system/

[Phase 3: @prism applying...]
→ Updated all components to use tokens
→ Removed hardcoded colors
→ Verified alignment across dashboard
→ Output: Consistent UI

Kiri: "Complete. DESIGN_SYSTEM.md and design-tokens.json created. 
All components aligned. Ready for iterative UI work with documented system."
```
