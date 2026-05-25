---
name: ui-reference-hybrid-spec
description: >
  Create structured UI specifications by cherry-picking modules from multiple existing version reference files.
  Handles hybrid version builds where requirements specify exact sources and modifications (e.g., "module from v6 + module from v7").
  Outputs machine-readable build specifications with module provenance, CSS requirements, and validation criteria
  for downstream multi-phase implementation.
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [ui-specification, reference-based-build, hybrid-ui, version-cherry-pick, multi-phase]
triggers:
  - command_center_reference_build
  - version_N_from_existing_versions
  - combine_modules_from_multiple_files
  - specific_module_from_vX_plus_module_from_vY
  - build_spec_from_reference_files
  - cherry_pick_UI_components
  - hybrid_version_specification
  - strict_requirements_USE_from_X_not_Y
---

# UI Reference Hybrid Specification

Create structured build specifications by combining modules from multiple existing UI version files.

## When To Use

Use this skill when:
- User has existing UI version files (v6.html, v7.html, vf3.html, etc.)
- Wants to create new version N combining specific modules from each
- Requirements specify exact source files per module (e.g., "Agents from v6")
- Requirements specify strict modifications (e.g., "NOT circular gauge")
- Build is multi-phase (spec → scaffold → finalize → deploy)
- Need machine-readable spec output for downstream agents phases

## Core Workflow

### Step 1: Discover Reference Files

Identify all available version files in the workspace:

```python
# Pattern: version-named HTML files or build directories
search_files(target="files", pattern="**/*v[0-9]*.html")
search_files(target="files", pattern="**/*vf*.html")
search_files(target="files", pattern="**/*final*.html")

# Also check build directories
terminal("find ~/project -type d -name 'v*_build' -o -name '*_build'")
```

### Step 2: Parse Requirements

Extract atomic requirements from user instruction:

```
Input: "ADD Agent Fleet module from v6-final, KEEP Intelligence as horizontal bars from v7, ADD Market Intel from vf3"

→ Requirement 1: {action: "add", module: "agent_fleet", source: "v6-final.html"}
→ Requirement 2: {action: "keep", module: "intelligence_quality", source: "v7.html", constraint: "horizontal_bars"}
→ Requirement 3: {action: "add", module: "market_intelligence", source: "vf3.html"}
```

**CRITICAL: Parse "NOT" requirements**

```
"NOT circular gauge" → explicit constraint in spec
"MUST be horizontal bars" → validation criteria requirement
```

### Step 3: Read Source Files

Read each referenced file to extract module specifications:

For HTML files, look for:
- Module containers with IDs/classes (e.g., `id="module-agents"`)
- Component structure (cards, grids, lists)
- CSS classes and design tokens
- Data structures (agent lists, metrics arrays)

```python
# Read HTML source files
read_file("~/project/command-center-v6-final.html")
read_file("~/project/command-center-v7.html")
read_file("~/project/command-center-vf3.html")
```

**Extract module content using grep patterns:**

```bash
# Agent Fleet from v6
grep -A 50 "Agent Fleet" v6-final.html | head -60

# Market Intelligence from vf3
grep -B 2 -A 30 "1,847" vf3.html
```

### Step 4: Build Module Specifications

For each module, create detailed spec:

```json
{
  "id": "agent_fleet_health",
  "name": "Agent Fleet Health",
  "source": "v6-final.html",
  "action": "add",
  "layout": {"col_span": 4, "grid_column": "span 4"},
  "spec": {
    "title": "Agent Fleet Health",
    "total_agents": 21,
    "teams": [
      {"name": "Create Team", "count": 13, "agents": [...]},
      {"name": "Market Intelligence", "count": 1, "agents": [...]},
      {"name": "Revenue Team", "count": 4, "agents": [...]},
      {"name": "Executive", "count": 3, "agents": [...]}
    ],
    "css_requirements": ["..."]
  }
}
```

### Step 5: Define Design System

Base the design system on the most complete reference version:

```json
{
  "design_system": {
    "base": "v7.0.0 (complete)",
    "tokens": {
      "colors": { "bg_primary": "#0A0A0C", "accent_violet": "#6E56CF" },
      "fonts": { "ui": "Inter, system-ui, sans-serif" }
    }
  }
}
```

### Step 6: Create Layout Grid

Specify 12-column grid layout with module placements:

```
Row 1: [Intelligence Quality (col-4)] [Agent Fleet Health (col-4)] [Market Intelligence (col-4)]
Row 2: [Memory & KG (col-6)] [Performance (col-6)]
Row 3: [KG Graph (col-6)] [Active Operations (col-6)]
```

### Step 7: Document Global Components

Include retained global components:

```json
{
  "global_components": {
    "sidebar": {"source": "v7.0.0", "action": "retain"},
    "header": {"source": "v7.0.0", "action": "retain"}
  }
}
```

### Step 8: Define Build Phases

Specify the multi-phase orchestration:

```json
{
  "phases": {
    "phase1": {"name": "Architect", "status": "in_progress", "output": "spec.json"},
    "phase2": {"name": "Scaffold", "status": "pending", "depends_on": "phase1"},
    "phase3": {"name": "Finalize", "status": "pending", "depends_on": "phase2"},
    "phase4": {"name": "Deploy", "status": "pending", "depends_on": "phase3"}
  }
}
```

### Step 9: Validation Criteria

Create specific validation criteria:

```json
{
  "validation_criteria": [
    "Intelligence Quality displays 5 horizontal bars (not circular)",
    "Agent Fleet Health shows 21 agent pill badges across 4 teams",
    "Market Intelligence shows 1,847 insights metric with activity list",
    "All v7 modules present and functional"
  ]
}
```

### Step 10: Output Specification

Write structured JSON specification:

```python
{
  "version": "11.0.0",
  "name": "Command Center v11 - Reference-based Build",
  "phase": 1,
  "build_type": "reference_based",
  "modules": [...],
  "global_components": [...],
  "phases": [...],
  "validation_criteria": [...],
  "build_notes": [
    "Intelligence Quality MUST use horizontal bars with green/orange/red colors",
    "v10 (incorrectly) used circular gauge - v11 restores horizontal bars"
  ]
}
```

## Specification Schema

Complete spec.json structure:

```json
{
  "version": "string",
  "name": "string",
  "phase": 1,
  "phase_name": "Architect (Mason) - Specification",
  "build_type": "reference_based",
  "objective": "string",
  
  "design_system": {
    "base": "string",
    "tokens": {
      "colors": {},
      "fonts": {},
      "borders": {}
    }
  },
  
  "layout": {
    "type": "sidebar_grid",
    "sidebar_width": "240px",
    "header_height": "64px",
    "grid_columns": 12,
    "gap": "20px"
  },
  
  "modules": [
    {
      "id": "string",
      "name": "string", 
      "source": "string",
      "action": "add|keep|retain|modify",
      "priority": "high|medium|low",
      "layout": {"col_span": 4, "grid_column": "span 4"},
      "spec": {
        "title": "string",
        "icon": "string",
        "data": {},
        "css_requirements": []
      }
    }
  ],
  
  "global_components": {
    "sidebar": {"source": "string", "action": "string", "spec": {}},
    "header": {"source": "string", "action": "string", "spec": {}}
  },
  
  "phases": {
    "phase1": {"name": "string", "status": "in_progress", "output": "string"},
    "phase2": {"name": "string", "status": "pending", "input": "string", "output": "string"}
  },
  
  "validation_criteria": ["string"],
  "build_notes": ["string"]
}
```

## Module Extraction Patterns

### Agent Fleet Module
```python
# Source: v6-final.html
{
  "id": "agent_fleet_health",
  "teams": [
    {
      "name": "Create Team",
      "count": 13,
      "agents": [
        {"name": "Mason", "emoji": "🏗️", "status": "active|busy|idle"}
      ]
    }
  ],
  "css_requirements": [
    ".team-section { margin-bottom: var(--space-lg); }",
    ".agent-card { display: flex; ... }",
    ".status-active { background: var(--success); }"
  ]
}
```

### Intelligence Quality Module
```python
# Source: v7.html (modified)
{
  "id": "intelligence_quality", 
  "display_type": "horizontal_bars",  # NOT circular gauge
  "metrics": [
    {"name": "Prompt Quality", "value": 96, "fill_class": "quality-excellent"},
    {"name": "Safety Compliance", "value": 12, "fill_class": "quality-critical"}
  ]
}
```

### Market Intelligence Module
```python
# Source: vf3.html
{
  "id": "market_intelligence",
  "metrics": {"daily_insights": {"value": "1,847", "change": "+12%"}},
  "activities": [
    {"name": "Competitor Analysis", "status": "active", "meta": "..."}
  ],
  "coverage_score": 94.5
}
```

## Common Requirement Patterns

| Pattern | Example | Action |
|---------|---------|--------|
| "ADD module from vX" | "ADD Agent Fleet from v6" | Create new spec entry with source attribution |
| "KEEP module" | "KEEP Intelligence Quality" | Retain from source, note in spec |
| "NOT X" / "MUST NOT" | "NOT circular gauge" | Add explicit constraint to spec |
| "RETAIN all" | "RETAIN all v7 modules" | Copy all v7 modules as-is to spec |
| Specific values | "1,847 insights" | Extract exact values from source |
| Layout span | "col-4", "span 6" | Record in layout specification |

## Post-Specification Handoff

After creating spec.json:

1. **Validate JSON structure**
   ```bash
   python3 -m json.tool spec.json > /dev/null && echo "Valid"
   ```

2. **Document for downstream phases**
   - Phase 2 (Scaffold) reads spec.json → produces HTML scaffold
   - Phase 3 (Finalize) validates against spec
   - Phase 4 (Deploy) deploys final output

3. **Trigger next phase**
   ```
   Specification complete. Phase 2 scaffold ready to trigger.
   ```

## Build Notes Pattern

Always include explanatory notes:

```json
{
  "build_notes": [
    "Intelligence Quality MUST use horizontal bars with color coding",
    "v10 incorrectly used circular gauge - v11 corrects this",
    "Agent Fleet shows 21 agents in pill badges (from v6)",
    "Market Intelligence shows 1,847 insights (from vf3)"
  ]
}
```

## Validation Criteria Pattern

Specific, verifiable criteria:

```json
{
  "validation_criteria": [
    "Intelligence Quality displays 5 horizontal bars (not circular)",
    "Agent Fleet Health shows 21 agent pill badges across 4 teams",
    "Market Intelligence shows 1,847 insights metric",
    "All v7 modules present and functional",
    "Grid layout follows 12-column specification"
  ]
}
```
