---
name: design-system-extraction
description: >
  Extract and formalize design system documentation (tokens, colors, typography, components) 
  from a working UI implementation to create a DESIGN.md reference. Enables safe iterative 
  UI development by establishing "source of truth" for design integrity.
version: 1.0.0
tags: [design-system, ui-documentation, design-tokens, visual-patterns, iteration-safety]
---

# Design System Extraction

## Purpose

Capture the **visual DNA** of a working dashboard/UI and formalize it into documentation that preserves design integrity during iterations.

## When To Use

Use this skill when:
- ✅ Adding new UI components that must match existing aesthetic
- ✅ Preparing for multi-agent UI iteration (prevent design drift)
- ✅ Working dashboard exists but design principles aren't documented
- ✅ Need "source of truth" for design system decisions

### ⚠️ Critical Difference

**This is NOT:**
- ❌ Creating UI from scratch (use `interactive-dashboard-builder`)
- ❌ Iterating on existing UI (use `ui-iterative-refinement`)
- ❌ Merging multiple UI versions (use `dashboard-architecture-documentation`)

**This IS:**
- ✅ Extracting design system FROM existing working implementation
- ✅ Creating formal documentation to ENABLE safe iteration
- ✅ Establishing guardrails BEFORE changes

---

## Core Philosophy

**Document working state BEFORE iterating.**

The problem: Beautiful working UIs get degraded during iterations because:
- No record of original color values
- No documented spacing patterns
- No component style reference
- Multiple agents make inconsistent decisions

The solution: Extract and formalize design system as DESIGN.md, then iterate with reference.

---

## Required Input

1. **Working dashboard location** — Path to existing implementation
2. **Technology stack** — Next.js, React, vanilla HTML/CSS, etc.
3. **Scope** — What to document (colors only? full system?)

---

## Extraction Process

### Phase 1: Mine Design Tokens

```bash
# Colors from CSS/Tailwind globals
grep -E "background|foreground|primary|accent" src/app/globals.css
grep -E "colors:" tailwind.config.ts

# Spacing/Radii from config
grep -E "spacing|radius|borderRadius" tailwind.config.ts

# Typography from CSS
grep -E "font|text-" src/app/globals.css
```

**Extract specific values:**
```
FOUND:
--background: hsl(240 10% 3.9%)  /* slate-950 */
--accent-violet: #6E56CF         /* Primary action */
--radius-md: 8px                 /* Card radius */
--text-primary: #F7F8F8          /* Headings */
```

### Phase 2: Catalog Component Patterns

**Find representative components:**
```bash
# shadcn/ui patterns
cat src/components/ui/card.tsx
cat src/components/ui/button.tsx

# Custom components
cat src/components/agent-card.tsx
cat src/components/sidebar.tsx
```

**Document patterns:**
```tsx
// Card Pattern
"rounded-lg border bg-card text-card-foreground shadow-sm"

// Button Pattern  
"inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4"

// Status Dot
"relative flex h-3 w-3 rounded-full bg-green-500"
```

### Phase 3: Organize Into DESIGN.md

**Standard sections:**
1. **Core Principles** — Philosophy, never-break rules
2. **Color System** — Semantic tokens, status colors, accent
3. **Typography** — Scale, fonts, hierarchy rules
4. **Spacing & Radii** — Consistent sizing system
5. **Component Patterns** — How to build cards, buttons, inputs
6. **Anti-Patterns** — What NOT to do
7. **File Locations** — Where to find reference implementations

---

## DESIGN.md Template

```markdown
# [Project] — Design System
## Applied Design Principles for Iterative Development

---

## 🎨 Core Principles

### 1. [Principle Name]
```
--token: value  /* Description */
```
**Rule:** [When to use, when not to use]

### 2. [Next Principle]
...

---

## 🎨 Color System

### Status Colors
| Status | Token | Usage |
|--------|-------|-------|
| Online | `#27A644` / `bg-green-500` | Healthy, ready |
| Busy | `#59A5F1` / `bg-blue-500` | Working, processing |
| Idle | `#F1B859` / `bg-amber-500` | Available but inactive |
| Offline | Gray scale | Disconnected |

### Semantic Colors
```css
--background: hsl(240 10% 3.9%)  /* Deepest black */
--surface-100: #19191B          /* Cards/panels */
--accent: #6E56CF               /* Primary actions */
...etc
```

---

## 🔤 Typography Scale

| Element | Class | Usage |
|---------|-------|-------|
| Page Title | `text-2xl font-semibold` | Main headings |
| Body | `text-sm text-muted-foreground` | Descriptions |
...etc

---

## 🧩 Component Patterns

### Card Pattern
```tsx
"rounded-lg border bg-card text-card-foreground shadow-sm"
```

### Button Pattern
```tsx
"inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4"
```

---

## 📦 File Locations

- **Components:** `src/components/ui/`
- **Data:** `src/data/`
- **Global styles:** `src/app/globals.css`

---

## ⚠️ Anti-Patterns (Do NOT)

❌ True black (`#000000`) — use `--background`  
❌ Harsh borders — use `rgba(255,255,255,0.06)`  
❌ Sharp corners — use at least `4px` radius  
```

---

## Verification

After creating DESIGN.md, verify it:
1. **Contains specific values** — Not "dark theme" but `--background: hsl(240 10% 3.9%)`
2. **Includes anti-patterns** — What NOT to do
3. **Has file references** — Where to look for examples
4. **Is actionable** — Agent can read and implement from it

---

## Usage in Iteration

```
PHASE 0: Extract Design System
├── Create DESIGN.md from working implementation
└── Store at project root

PHASE 1+: Iterate Safely
├── Agent reads DESIGN.md before any changes
├── Implements new components per documented patterns
├── Validates compliance with design system
└── Preserves visual integrity
```

---

## Example

**Task:** "Add chat bar to existing dashboard"

**Without this skill:**
- Agent guesses colors, gets them wrong
- Border contrast too high
- Button radius doesn't match existing
- User: "It looks off" — multiple rounds

**With this skill:**
- DESIGN.md says: "Purple accent: #6E56CF, subtle borders: rgba(255,255,255,0.06), radius: rounded-full"
- Agent implements correctly first time
- User: "Perfect, matches exactly"

---

## Pitfalls

- ❌ Don't extract from broken/beta UIs — extract from PRODUCTION-READY implementation
- ❌ Don't document aspirational patterns — document ACTUAL patterns
- ❌ Don't skip anti-patterns section — it's as important as DOs
- ❌ **Tailwind CSS `@layer` directive conflict**: When creating `design-tokens.css` for import into a Tailwind project, do NOT wrap the content in `@layer base { }`. The `@import` statement must come AFTER `@tailwind base` in `globals.css`, and `@layer base` in an imported file requires `@tailwind base` to already be defined. Place `@tailwind` directives FIRST in `globals.css`, then `@import` the design tokens file. Example:
  ```css
  /* globals.css - CORRECT order */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  /* Import design tokens AFTER Tailwind directives */
  @import "../styles/design-tokens.css";
  ```
  ```css
  /* design-tokens.css - NO @layer wrapper! */
  :root {
    --token-mint: #6CD9BA;
    /* ... tokens ... */
  }
  ```
