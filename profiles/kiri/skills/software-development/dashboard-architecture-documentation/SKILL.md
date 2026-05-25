---
name: dashboard-architecture-documentation
description: >
  Create comprehensive architecture documentation by analyzing and merging design patterns from multiple existing dashboard/UI versions.
  Surveys existing implementations (v5, vf3, etc.), extracts visual patterns, component structures, CSS tokens, and technical specifications.
  Produces unified technical documentation including visual layout diagrams, design system tokens, component hierarchies, JavaScript architecture,
  API contracts, and agent/component registries. Used when consolidating UI evolution tracks or creating authoritative architecture specs
  before implementation.
version: 1.0.0
author: Mason (Code Architect Lead)
license: MIT
tags: [architecture, dashboard, ui-specification, design-system, documentation, merge, consolidation]
triggers:
  - Design Command Center vN architecture
  - Merge X and Y into unified architecture
  - Architecture document from existing versions
  - Consolidate visual framework evolution
  - Create dashboard architecture specification
  - v5 + vf3 into v6 specification
  - Design system documentation from existing files
  - Architecture spec with CSS tokens and component hierarchy
  - Module layout specification with grid diagrams
  - Agent registry documentation
---

# Dashboard Architecture Documentation

Create comprehensive architecture documentation by analyzing and merging design patterns from multiple existing dashboard/UI versions.

## When To Use

Use this skill when:
- Consolidating UI evolution tracks (e.g., merging v5 + VF3 into v6)
- Creating authoritative architecture specs before implementation
- Multiple reference files exist with different design patterns to merge
- Need human-readable architecture MD (not JSON machine specs)
- Must document DESIGN decisions (what to keep, merge, discard)
- Building formal architecture documents with full technical depth

**Not for:** Implementation planning (use `writing-plans`), JSON specs for multi-phase builds (use `ui-reference-hybrid-spec`), or building dashboards (use `interactive-dashboard-builder`).

## Core Workflow

### Phase 1: Survey Existing Implementations

Identify and read all relevant version files:

```bash
# Find existing versions
find ~/project -name "*command-center*.html" -o -name "*v[0-9]*.html" -o -name "*vf*.html" 2>/dev/null | head -20

# Check for existing architecture docs
ls -la ~/project/*architecture*.md ~/project/*spec*.md 2>/dev/null
```

Read key source files to understand patterns:
- ORIGINAL v5 (feature-rich, complex)
- VF3 (refined visual framework)
- Any intermediate versions

### Phase 2: Extract Design Patterns

From each source, extract:

**CSS Design Tokens:**
```
v5 (ORIGINAL):
  --bg-primary: #0D0D0F → vf3: #0A0A0C (darker)
  --accent-violet: #6E56CF (same both)
  --spacing-md: 12px vs 16px
```

**Module Structures:**
```
v5 Intelligence Quality: Circular gauge + 5 metrics
vf3 Fleet Health: Clean team containers with pill badges
v5 Performance: Charts + pipeline bars
vf3 Ask Kiri: Full-width input bar
```

**Component Patterns:**
- Card headers with actions
- Metric displays
- Status badges
- Progress indicators
- Grid layouts (12-column, flex-wrap)

### Phase 3: Define Merge Strategy

Document what comes from where:

| Element | Source | Reason |
|---------|--------|--------|
| CSS Tokens | vf3 | Cleaner, more consistent |
| Intelligence Gauge | ORIGINAL | Feature-complete |
| Fleet Containers | vf3 | Clean, maintainable |
| Agent Cards | vf3 | Better visual hierarchy |
| Ask Kiri | vf3 | Established pattern |

### Phase 4: Create Architecture Document

Structure the output MD file:

```markdown
# Command Center v6 Architecture Document

**Author:** [Agent Name] (Code Architect Lead)
**Version:** 6.0.0
**Date:** YYYY-MM-DD

## Executive Summary
- Convergence of [v5] (feature-rich) + [vf3] (refined visual framework)
- Key merge points listed

## 1. Visual Layout
### 1.1 Grid Architecture
ASCII layout diagram showing module placements

### 1.2 Module Placement Table
| Position | Module | Width | Source | Features |
| Row 1, Col 1 | Intelligence Quality | 4 cols | ORIGINAL | Circular gauge |

### 1.3 Responsive Breakpoints
CSS media queries

## 2. Design System
### 2.1 CSS Token Architecture
Merged token set with notes on source decisions

### 2.2 Typography System
Font families, type scale

### 2.3 Elevation & Depth
Shadow/border hierarchy

## 3. Component Hierarchy
Tree diagrams for each module

## 4. Agent/Entity Registry
Complete catalogue (21 agents with roles, emojis, teams)

## 5. JavaScript Architecture
- EventBus pattern
- ModuleRegistry
- DataService
- Initialization flow

## 6. API Contracts
TypeScript-style interface definitions

## 7. File Structure
Directory layout blueprint

## 8. Implementation Checklist
Phased rollout tasks

## 9. Design References
Color palettes, team colors
```

## Key Sections

### Visual Layout ASCII Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER (64px)                        │
├─────────┬───────────────────────────────────────────────────┤
│         │  ┌──────────┬──────────┬──────────┐              │
│ Sidebar │  │ Module 1 │ Module 2 │ Module 3 │              │
│(240px)  │  │ (4 cols) │ (4 cols) │ (4 cols) │              │
│         │  ├──────────┴──────────┴──────────┤              │
│         │  │ Module 4 (6) │ Module 5 (6)      │              │
│         │  └────────────────────────────────┘              │
└─────────┴─────────────────────────────────────────────────────┘
```

### Module Specifications

For each module, document:
- **Source file**: Where pattern originated
- **Layout**: Grid span (col-4, col-6, etc.)
- **Component tree**: Nested structure
- **CSS classes**: Required styling
- **Data structure**: Props/state shape
- **Interactions**: Event handlers

### Agent Registry

Complete table catalogue:
```
| Agent | Emoji | Role | Team | Function |
|-------|-------|------|------|----------|
| Mason | 🏗️ | Code Architect | Dev | Architecture decisions |
| Forge | 🔨 | Feature Dev | Dev | Implementation |
```

Team containers with color coding:
```
Dev: #6E56CF, Ops: #10B981, QA: #F59E0B, etc.
```

### Design Token Tables

Merged CSS tokens with source annotations:
```css
:root {
  /* Background: VF3 Priority (darker, more consistent) */
  --bg-primary: #0A0A0C;      /* was #0D0D0F in v5 */
  --bg-secondary: #0F1011;    /* vf3 */
  
  /* Accent: Keep v5 violet (established brand) */
  --accent-violet: #6E56CF;   /* same both */
  --accent-violet-hover: #7C66D9;
}
```

### JavaScript Patterns

Document architectural patterns:
- EventBus (pub/sub for decoupled modules)
- ModuleRegistry (dynamic module loading)
- DataService (caching + polling)
- AgentStatusService (21-agent state management)

## Merge Decision Framework

When consolidating versions, evaluate:

| Criteria | Winner | Rationale |
|----------|--------|-----------|
| CSS Consistency | vf3 | More complete token system |
| Feature Completeness | v5 | More modules implemented |
| Visual Polish | vf3 | Cleaner, modern aesthetic |
| Maintainability | vf3 | Simpler component structure |
| Established Pattern | v5 | Some features only exist there |

Document the decision for each conflict:
```
BACKGROUND COLORS: Use vf3's #0A0A0C (darker) over v5's #0D0D0F
- vf3 has more consistent elevation system
- Darker background provides better contrast for cards
```

## Output Validation

Verify the architecture document includes:
- [ ] ASCII layout diagram showing all modules
- [ ] Table mapping sources → features
- [ ] CSS token table with 40+ tokens
- [ ] Component hierarchy trees for each module
- [ ] Complete agent/entity registry
- [ ] JavaScript architecture patterns
- [ ] API contract definitions
- [ ] File structure blueprint
- [ ] Implementation phase checklist
- [ ] Design reference (colors, typography)

## Next Steps

After architecture documentation is complete:
1. Review with stakeholders
2. Hand off to implementation (use `writing-plans` for task breakdown)
3. Create scaffold HTML (Phase 2)
4. Finalize implementation (Phase 3)
5. Deploy (Phase 4)

## Common Pitfalls

**❌ Don't:** Copy/paste large code blocks into architecture doc
**✅ Do:** Describe patterns, structures, contracts

**❌ Don't:** Make implementation commitments
**✅ Do:** Document "what" and "why", not "how to code"

**❌ Don't:** Omit source attributions
**✅ Do:** Clearly mark which version each pattern came from

**❌ Don't:** Ignore responsive breakpoints
**✅ Do:** Specify grid behavior at 1440px, 1024px, 768px, 640px

**❌ Don't:** Skip the agent registry
**✅ Do:** Catalog all 21 agents with roles, emojis, teams

## Example Output

See: `~/command_center/v6_architecture.md`

Structure followed:
- 794 lines
- 9 major sections
- 21 agents catalogued
- 50+ CSS tokens
- ASCII layout diagrams
- Module hierarchy trees
- API contracts (TypeScript-style)
- 5-phase implementation checklist
