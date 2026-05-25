---
name: design-delegation
description: Delegate UI/UX design work to autonomous design agents. Spawns specialized agents that leverage popular-web-designs and design-md skills to create complete visual identities including DESIGN.md specs and working HTML implementations.
version: 1.0.0
author: Hermes Agent
license: MIT
triggers:
  - "need a dashboard designed"
  - "create a UI for"
  - "design a web interface"
  - "build me a dashboard"
  - "make it look like Linear"
  - "need a design system"
  - "stunning UI for"
  - "create the visual design"
  - "delegated agent for UI design"
---

# Design Delegation Skill

Delegate UI/UX design work to autonomous design agents. This pattern leverages existing design system skills (`popular-web-designs`, `design-md`) to spawn specialized agents that create complete visual identities.

## When to Use

- User wants a dashboard or UI designed
- Need to create a design system for a new product
- Want "stunning" or professional-grade web interfaces
- Creating product-specific visual identities
- Need DESIGN.md specs + working HTML implementations

## Pattern Overview

```
Spawn specialized design agent → 
Uses popular-web-designs skill (research templates) →
Uses design-md skill (create token specs) →
Produces DESIGN.md + HTML implementation + README rationale
```

## The Delegation Pattern

### 1. Create the Design Agent via Cronjob

Spawn a dedicated agent with full context:

```
Skill: cronjob(action='create')
Prompt: "You are the UI Design Director for [PROJECT].

Your Mission:
Design a [DASHBOARD/UI TYPE] using [DESIGN INSPIRATIONS].

Required Steps:
1. Research Design Direction
   - skill_view(name='popular-web-designs') 
   - Examine: linear.app.md, stripe.md, vercel.md, etc.
   
2. Create DESIGN.md
   - skill_view(name='design-md') for format
   - Define: colors, typography, spacing, components
   
3. Build [filename].html
   - [DESCRIBE KEY FEATURES/MODULES]
   
4. Write README.md explaining design rationale

Deliverables in ~/[PROJECT]/:
- DESIGN.md - Design system spec
- [filename].html - Working implementation  
- README.md - Design decisions and philosophy

Design Direction: [SPECIFIC AESTHETIC GUIDANCE]"
```

### 2. Agent Executes Autonomously

The spawned agent:
- Loads `popular-web-designs` skill, researches templates
- Loads `design-md` skill, creates proper token specs
- Writes DESIGN.md with Google spec format
- Implements full HTML/CSS/JS dashboard
- Documents design philosophy in README

### 3. Receive Deliverables

Agent produces:
- `~/[PROJECT]/DESIGN.md` - Formal design tokens
- `~/[PROJECT]/[filename].html` - Working interface
- `~/[PROJECT]/README.md` - Rationale and usage

## Design Inspiration Guide

Reference these templates for different aesthetics:

| Need | Primary | Secondary | Tertiary |
|------|---------|-----------|----------|
| Developer tools | Linear.app | Vercel | Raycast |
| Dashboard/data | Stripe | Sentry | Supabase |
| Clean/minimal | Notion | Cal.com | Replicate |
| AI/ML products | Cohere | ElevenLabs | Mistral |
| Dark power user | Cursor | Warp | x.ai |
| Friendly/playful | PostHog | Lovable | Figma |

## Example Missions

### Agent Framework Command Center
```
Design the "Agent OS" - an operating system interface for managing 
autonomous agent teams. Not a tools dashboard - intelligent systems 
that get smarter.

8 modules: Fleet Health, Parallel Execution Grid, Team Orchestration, 
Memory & Knowledge Graph, Intelligence Quality Monitor, Market Intelligence, 
Active Operations, Performance Analytics.

Dark mode, developer aesthetic, Linear.app precision.
```

### Competitive Intelligence Dashboard
```
A market research dashboard for tracking competitors and opportunities.

Modules: competitor cards, traffic trends, opportunity scoring, 
alert feed, comparison views.

Stripe-inspired data presentation, clean minimal aesthetic.
```

### Revenue Analytics Interface
```
Revenue team command center showing pipeline, forecasts, 
performance metrics, team productivity.

Modules: pipeline funnel, team performance cards, forecasting 
visualization, alert system.

Vercel-style developer focus, dark theme, monospace accents.
```

## Key Principles

### Agent Framing Matters
- **Not** "build a dashboard"
- **IS** "design the operating system for X"

The agent needs to understand this is infrastructure, not decoration.

### Module Abundance > Feature Sprawl
Better 8 well-defined modules than 20 half-baked features. Each module should be:
- Visually distinct
- Data-driven
- Interactive where appropriate
- Clear purpose

### Design Philosophy in Prompt
Always include the "philosophy" paragraph:
- What this IS (operating system, command center, cockpit)
- What this is NOT (tools dashboard, admin panel, reports page)
- Who uses it (power users, technical operators, high-talent individuals)

## Verification Steps

After agent completes, check:

1. **DESIGN.md exists and lints**
   ```bash
   npx -y @google/design.md lint DESIGN.md
   ```

2. **HTML renders correctly**
   ```bash
   open [filename].html
   # or
   python3 -m http.server 8080
   ```

3. **README captures philosophy**
   - Explains what this IS and IS NOT
   - Design decisions justified
   - Usage instructions clear

4. **Visual quality**
   - No broken layouts
   - Typography consistent
   - Colors match DESIGN.md tokens
   - Interactive elements work

## Tooling Requirements

The spawned agent needs:
- `skills` toolset - to load popular-web-designs, design-md
- `file` toolset - to write deliverables
- `terminal` toolset - optional, for CLI validation
- `web` toolset - optional, for research

## Common Pitfalls

### Vague Design Direction
**Bad:** "Make it look modern"
**Good:** "Linear.app minimal aesthetic, dark mode first, purple accent for AI elements, developer power-user feel"

### Missing Context
The agent doesn't know your product. Include:
- What the user does
- What pain this solves
- Key workflows
- Competitive positioning

### Over-scoping First Iteration
Start with one complete module rather than 5 half-complete ones.

## Remember

This pattern creates **investment-grade design artifacts**:
- DESIGN.md = Reusable design tokens for future work
- HTML = Working reference implementation
- README = Design philosophy captured

The agent does the work. You get production-ready materials.
