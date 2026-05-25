---
name: agent-visual-identity-design
description: Design minimal, gradient-based logos and visual identity for AI agents using @palette. Covers logo research, anime color palette constraints, SVG deliverables, and fleet-wide brand consistency.
triggers:
  - "design logos for agents"
  - "create agent logos"
  - "visual identity for agent fleet"
  - "gradient logo design"
  - "anime color palette"
  - "SVG logos for agents"
tags: [visual-design, agent-identity, logo-design, gradient, anime-palette, svg]
version: 1.0.0
---

# Agent Visual Identity Design

## Purpose

Design cohesive visual identities for AI agent fleets using @palette (Design System Artisan). Creates minimal, gradient-based logos that reflect each agent's role while maintaining brand consistency.

## When To Use

- Creating logos for new agents in the fleet
- Establishing visual identity for agent hierarchy
- Designing icons for dashboard/agent directory
- Building agent "avatars" for Discord/social presence

---

## Design System

### Color Constraints

Colors **MUST** come from the approved anime color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Electric Violet | `#4227F2` | Primary gradients, connection nodes |
| Soft Teal | `#6CD9BA` | Secondary gradients, accents |
| Deep Purple | `#3F289D` | Tertiary, depth, grounding |
| Vapor Pink | `#F06BFF` | Optional accent |
| Sunset Orange | `#FF6B6B` | Alert/Energy |

**Rule:** Research popular logos (Linear, Vercel, Stripe) for style inspiration, but ONLY use these colors in the final design.

### Logo Style

- **Minimal:** Clean lines, iconic shapes
- **Gradient:** Primary → Secondary color flow
- **Scalable:** Readable at 32px, sharp at 512px
- **Background Agnostic:** Works on light AND dark
- **Concept-Driven:** Evokes agent's core role

---

## Execution Pattern

### Step 1: Create Task Specification

Write task to: `~/.hermes/profiles/palette/jobs/logo-design-{agent}.md`

```markdown
# Logo Design Task: @{agent}

## Assignment for @palette

**Agent:** @{agent} - {Role}

### Requirements
1. Minimal, iconic shape
2. Gradient logo style (2026 aesthetic)
3. Colors ONLY from anime palette
4. Primary + secondary color in gradient
5. Evoke: {key concepts}

### Research Direction
- "gradient logo trends 2026"
- Linear.app, Vercel, Stripe aesthetics
- ONLY use anime palette for actual design

### Deliverables
1. `~/kiri/assets/logos/{agent}-logo.svg`
2. `~/kiri/assets/logos/{agent}-rationale.md`
3. Hex codes used from palette

### Acceptance Criteria
- ✅ 32px readable (favicon)
- ✅ 512px sharp (app icon)
- ✅ Light/dark compatible
- ✅ Anime palette colors only
- ✅ Clear concept alignment
```

### Step 2: Delegate to @palette

**Via Cron Job** (Reliable):
```bash
hermes.job.schedule()  # or cronjob create
name: "logo-design-{agent}"
prompt: "Read ~/.hermes/profiles/palette/jobs/logo-design-{agent}.md and execute"
schedule: "now"
```

**Direct Delegation** (If interactive):
- Start: `hermes -p palette`
- Reference task file
- Monitor execution

**⚠️ Never attempt:** `hermes -p palette --message "task"` — will fail with "invalid choice"

### Step 3: Verify Deliverables

Check created files:
```bash
ls -la ~/kiri/assets/logos/{agent}-*
```

Files should include:
- `{agent}-logo.svg` - Main scalable version
- `{agent}-logo-compact.svg` - Optimized for 32px
- `{agent}-rationale.md` - Design documentation

### Step 4: Copy to Windows Access

For user access from Windows File Explorer:
```bash
cp ~/kiri/assets/logos/{agent}-* /mnt/f/Logos/
```

---

## Example: @kiri Logo

**Concept:** Conductor baton transforming into orchestration waves

**Visual Elements:**
- Vertical stem (baton/authority)
- Three radiating wave arcs (coordinated output)
- Connection node (orchestration nexus)
- 45° diagonal gradient (motion direction)

**Colors:**
- Gradient: `#4227F2` → `#6CD9BA` → `#4227F2`
- Node: `#4227F2` solid
- Depth: `#3F289D` shadow

---

## Fleet Design Queue

Priority order for logo design (after @kiri):

1. **@forge** - Senior Software Engineer (hammer/code)
2. **@ember** - Code Quality (flame/polish)
3. **@scope** - Research Intelligence (magnifier/horizon)
4. **@launchpad** - Release Manager (rocket/deploy)
5. **@palette** - Design System Artisan (brush/palette)
6. **@mason** - Code Architect (building block/structure)
7. **@prism** - QA Automation (light spectrum/test)
8. **@temper** - QA Hardening (shield/protect)
9. **@sentinel** - Fleet Intelligence (eye/watch)
10. **@drift** - Integrity Monitor (flow/compass)
...

---

## Pitfalls

### Pitfall 1: Agent Dispatch Methods

**Direct execution fails:**
- ❌ `hermes -p palette --message "design logo"`
- ❌ `hermes -p palette` in background terminal
- ❌ Interactive input after starting agent

**What works:**
- ✅ Cron job with task file reference
- ✅ Direct profile execution: `hermes -p palette` (interactive only)

### Pitfall 2: Color Palette Enforcement

@palette may suggest colors outside anime palette. Verify:
- Check hex codes in rationale.md
- Ensure all colors match approved palette
- Reject designs with off-palette colors

### Pitfall 3: Windows File Access

`\wsl$\Ubuntu\home\...` paths often fail in File Explorer.

**Solution:** Copy to mounted Windows partition:
```bash
cp ~/kiri/assets/logos/* /mnt/f/Logos/
```

### Pitfall 4: Scalability Verification

Always verify:
- Open SVG in browser
- Zoom to 32px (should be readable)
- Check on dark background
- Check on light background

---

## Templates

See `templates/logo-task.md` for reusable task specification.

See `templates/anime-color-palette.md` for approved colors.

---

## Related Skills

- `design-delegation` - Delegate design work to autonomous agents
- `comfyui` - Generate images/video for advanced visual needs
- `sketch` - Quick HTML mockups for design iteration

---

v1.0.0 - Agent visual identity design system using @palette