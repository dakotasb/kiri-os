---
name: dashboard-component-integration
description: >
  Integrate existing UI components from multiple versioned sources into a unified working deliverable.
  Reads architecture specifications, HTML/CSS from one source, JavaScript from another, and specific modules
  from reference files, then merges them into a single cohesive output. Handles merge decisions,
  conflict resolution between sources, and produces production-ready integrated code.
version: 1.0.0
author: Keystone (Technical Lead)
license: MIT
tags: [dashboard, ui-integration, merge-components, version-consolidation, multi-source]
triggers:
  - Integrate Command Center vN
  - Merge X HTML with Y JavaScript
  - Combine modules from multiple files into one
  - Integrate components from Mason/Forge/Prism
  - Merge architecture with implementation
  - Consolidate vN components into unified file
  - Read architecture and merge with existing builds
  - Combine CSS from X, JS from Y, modules from Z
---

# Dashboard Component Integration

Integrate existing UI components from multiple versioned sources into a unified working deliverable.

## When To Use

Use this skill when:
- Multiple agents have produced separate artifacts (architecture doc, HTML/CSS, JavaScript, modules)
- Need to combine these into a single unified output file
- User specifies exact sources for each component ("Mason's architecture", "Forge's HTML", "Prism's JS")
- Integration requires merging design tokens, component structures, and interactive functionality
- Output is a single working file (not documentation or specification)
- Components come from different files that must be unified

**Not for:** Creating architecture docs (use `dashboard-architecture-documentation`), producing JSON specs (use `ui-reference-hybrid-spec`), or building from scratch (use `interactive-dashboard-builder`).

## Core Workflow

### Phase 1: Discover and Read Source Files

Identify all referenced source files and read them completely:

```bash
# Find architecture documents
ls ~/project/*architecture*.md ~/project/*spec*.md 2>/dev/null

# Find HTML/CSS implementations
ls ~/project/*v[0-9]*.html ~/project/*vf*.html 2>/dev/null

# Find JavaScript modules
ls ~/project/*v[0-9]*.js ~/project/*_[a-z]*.js 2>/dev/null
```

Read each source file to extract:
- **Architecture doc**: Layout specifications, design tokens, module definitions
- **HTML/CSS file**: Structure, styling, component markup
- **JavaScript file**: Interactivity, event handling, data management
- **Reference files**: Specific modules to extract (KG graphs, team containers, etc.)

### Phase 2: Extract Components by Source

Map each component to its source:

| Component | Source File | Extraction Strategy |
|-----------|-------------|---------------------|
| CSS Tokens | v6_architecture.md | Parse token tables from Section 2 |
| Card Structure | v6_forge.html | Extract `.module-card` patterns |
| Agent Registry | v6_architecture.md | Parse agent table from Section 4 |
| JavaScript Core | v6_prism.js | Copy `CommandCenterV6` class |
| KG Node Graph | command-center-vf3.html | Extract SVG graph module |
| Team Containers | command-center-vf3.html | Extract team grid pattern |

### Phase 3: Merge Design System

Consolidate CSS tokens from multiple sources:

```css
/* Priority: VF3 for consistency, v5 for brand established colors */
:root {
  /* Background: VF3 Priority (darker, more consistent) */
  --bg-primary: #0A0A0C;      /* from vf3 */
  --bg-secondary: #0F1011;    /* from vf3 */
  
  /* Accent: v5 Priority (established brand color) */
  --accent-violet: #6E56CF;   /* from v5 architecture */
  --accent-violet-hover: #7C66D9;
  
  /* Status: vf3 for cleaner palette */
  --success: #10B981;         /* from vf3 */
  --warning: #F59E0B;
}
```

**Merge Rules:**
1. When sources conflict, prefer the cleaner/more complete token set
2. Keep established brand colors (avoid changing recognizable accents)
3. Ensure full coverage (50+ tokens for professional dashboards)
4. Document each decision with source attribution

### Phase 4: Assemble HTML Structure

Build the output file structure from merged sources:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Command Center vN | Integrated</title>
  
  <style>
    /* ============ MERGED DESIGN TOKENS ============ */
    /* From: v6_architecture.md Section 2 + vf3 */
    :root {
      --bg-primary: #0A0A0C;
      /* ... 50+ tokens ... */
    }
    
    /* ============ BASE STYLES ============ */
    /* From: v6_forge.html (adapted) */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { /* ... */ }
    
    /* ============ LAYOUT ============ */
    /* From: Architecture Section 1 */
    .app-container { max-width: 1600px; margin: 0 auto; }
    .dashboard-grid { 
      display: grid; 
      grid-template-columns: repeat(12, 1fr);
      gap: 20px;
    }
    /* ... col-4, col-6, col-12 ... */
    
    /* ============ MODULE COMPONENTS ============ */
    /* Card: Adapted from v6_forge.html */
    .module-card { /* ... */ }
    
    /* Intelligence Quality: From v6_forge.html */
    .iq-module { /* ... */ }
    .gauge-container { /* ... */ }
    
    /* Agent Fleet: From vf3 (clean team containers) */
    .fleet-grid { /* ... */ }
    .team-container { /* ... */ }
    
    /* KG Node Graph: From vf3 */
    .kg-graph { /* ... */ }
    .graph-node { /* ... */ }
    
    /* Ask Kiri: From vf3 + architecture */
    .ask-kiri-container { /* ... */ }
  </style>
</head>
<body>
  <!-- Background from vf3 -->
  <div class="bg-grid"></div>
  <div class="bg-glow"></div>
  
  <div class="app-container">
    <!-- Header: Merged from v6_forge + architecture -->
    <header class="header">
      <!-- ... -->
    </header>
    
    <!-- Dashboard Grid: From architecture Section 1 layout -->
    <div class="dashboard-grid">
      <!-- Module 1: Intelligence Quality (v5 style) -->
      <div class="module-card col-4 iq-module">
        <!-- Merged from v6_forge.html -->
      </div>
      
      <!-- Module 2: Agent Fleet (vf3 style) -->
      <div class="module-card col-4">
        <!-- Merged from vf3 + agent registry from architecture -->
      </div>
      
      <!-- Module 3: KG Node Graph (vf3) -->
      <div class="module-card col-4">
        <!-- Merged from command-center-vf3.html -->
      </div>
      
      <!-- Module 4: Performance Analytics (v5) -->
      <div class="module-card col-6">
        <!-- Merged from v6_forge.html -->
      </div>
      
      <!-- Module 5: Memory & KG (vf3) -->
      <div class="module-card col-6">
        <!-- Merged from vf3 -->
      </div>
      
      <!-- Module 6: Ask Kiri + Operations (vf3) -->
      <div class="module-card col-12">
        <!-- Merged from vf3 + architecture spec -->
      </div>
    </div>
  </div>
  
  <script>
    // ============ MERGED JAVASCRIPT ============
    // Core: Adapted from v6_prism.js CommandCenterV6 class
    // Event handlers: From v6_forge.html + interactivity requirements
    
    class CommandCenterV6 {
      constructor() {
        // Initialize modules
      }
      
      // KG Graph animation from vf3 patterns
      initializeKGGraph() { /* ... */ }
      
      // Agent status from architecture Section 4
      initializeAgents() { /* ... */ }
    }
    
    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
      // Animate IQ Gauge (from v6_forge.html)
      setTimeout(() => {
        document.getElementById('iqGauge').classList.add('animate');
      }, 300);
    });
  </script>
</body>
</html>
```

### Phase 5: Handle Source Conflicts

When sources provide different implementations of the same component:

**Strategy: Evaluate and Select**

| Component | v5 Implementation | vf3 Implementation | Decision | Rationale |
|-----------|-------------------|-------------------|----------|-----------|
| Card headers | Complex with tabs | Clean minimal | vf3 | More maintainable |
| Agent badges | Text labels | Pill badges | vf3 | Better visual hierarchy |
| Status indicators | Color dots + text | Pill badges | vf3 | Cleaner, established |
| Intelligence gauge | Circular SVG | Horizontal bars | Architecture spec | Follow specification |
| Ask Kiri | Compact input | Full-width bar | vf3 | More prominent |

**Document each decision:**
```javascript
// NOTE: Using vf3's Agent Fleet container pattern over v5's table view
// Rationale: Better visual hierarchy, supports 21 agents across 6 teams
// Source: command-center-vf3.html lines 1514-1774
```

### Phase 6: Add Missing Components

When the architecture specifies components not in source files:

1. **Check all source files thoroughly** - may be in unexpected location
2. **Create from architecture spec** - if clearly documented
3. **Adapt similar components** - modify existing patterns
4. **Mark as TODO** - if truly missing and can't be synthesized

**Example - Adding 21-Agent Registry:**
```javascript
// From architecture Section 4 - Agent Registry Table
// Adapting vf3's 8-agent pattern to 21 agents per architecture spec
const agents = [
  { id: 'mason', name: 'Mason', emoji: '🏗️', role: 'Code Architect Lead', team: 'dev' },
  { id: 'forge', name: 'Forge', emoji: '🔨', role: 'Feature Developer', team: 'dev' },
  // ... 19 more agents
];
```

### Phase 7: Final Quality Check

Validate the integrated output:

```bash
# 1. File structure check
grep -c "</html>" ~/command_center/command-center-v6.html
grep -c "</script>" ~/command_center/command-center-v6.html
grep -c "</style>" ~/command_center/command-center-v6.html

# 2. Module presence check
grep -c "iq-module" ~/command_center/command-center-v6.html      # Intelligence Quality
grep -c "fleet-grid" ~/command_center/command-center-v6.html      # Agent Fleet
grep -c "kg-graph" ~/command_center/command-center-v6.html        # KG Node Graph
grep -c "perf-metric" ~/command_center/command-center-v6.html     # Performance
grep -c "ask-kiri" ~/command_center/command-center-v6.html        # Ask Kiri

# 3. Token completeness check
grep -c "--bg-primary" ~/command_center/command-center-v6.html
grep -c "--accent-violet" ~/command_center/command-center-v6.html
grep -c "--text-primary" ~/command_center/command-center-v6.html
```

**Manual checklist:**
- [ ] All required modules present per architecture
- [ ] All 21 agents from registry included
- [ ] CSS tokens complete (50+)
- [ ] Layout matches architecture grid spec
- [ ] Interactivity JavaScript included
- [ ] Merge decisions documented in comments
- [ ] Source attributions in file header

## Sample File Header

```html
<!--
  Command Center v6.0.0 - Integrated Build
  ========================================
  
  COMPONENTS SOURCED FROM:
  - Architecture: v6_architecture.md (Mason - Code Architect Lead)
  - HTML/CSS:     v6_forge.html (Forge - Feature Developer)
  - JavaScript:   v6_prism.js (Prism - Test Engineer)
  - KG Graph:     command-center-vf3.html (VF3 Visual Framework)
  
  MERGE DECISIONS:
  - CSS Tokens: vf3 priority (cleaner, more consistent)
  - Intelligence Gauge: From v5 per architecture (circular SVG)
  - Agent Fleet: vf3 pattern adapted for 21 agents
  - Team Colors: From architecture Section 4
  - Performance Analytics: From v6_forge.html
  - Ask Kiri: vf3 full-width pattern
  - Memory & KG: Combined vf3 panel
  
  Generated: $(date)
-->
```

## Output Location

Standard location: `~/command_center/command-center-v{N}.html`

## Next Steps

After integration:
1. Open in browser to verify rendering
2. Run validation checklist
3. Address any missing components
4. Hand off for testing/deployment
5. Document any integration issues for future merges

## Common Pitfalls

**❌ Don't:** Copy entire files blindly
**✅ Do:** Cherry-pick specific modules/patterns from each source

**❌ Don't:** Lose source attributions
**✅ Do:** Document where each component came from

**❌ Don't:** Ignore architecture specifications
**✅ Do:** Architecture doc is the authority - follow its specs even if source files differ

**❌ Don't:** Skip modules mentioned in architecture
**✅ Do:** All 7 modules from architecture must be present

**❌ Don't:** Use inconsistent design tokens
**✅ Do:** Merge tokens systematically with documented priorities

**❌ Don't:** Forget to adapt for correct agent count
**✅ Do:** Expand vf3's 8-agent pattern to architecture's 21 agents

**❌ Don't:** Omit JavaScript interactivity
**✅ Do:** Include animations, event handlers, and state management

## Integration Patterns

### Pattern A: Architecture-Driven
When architecture is authoritative and source files are reference implementations:
1. Read architecture first to understand intended design
2. Extract patterns from source files that match architecture
3. Create missing components according to architecture spec
4. Adapt existing patterns to match architectural vision

### Pattern B: Reference-Driven
When user says "Use X from file A, Y from file B":
1. Parse specific requirements (component → source mapping)
2. Extract exact components from specified files
3. Merge with minimal modification
4. Document provenance clearly

### Pattern C: Best-of-Breed
When multiple sources offer different approaches to same component:
1. Evaluate each implementation objectively
2. Select based on: visual clarity, maintainability, feature completeness
3. Document rationale for selection
4. Adapt selected component to fit merged design system
