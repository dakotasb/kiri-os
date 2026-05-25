# Agent-Role Matching Rules

**Session-derived rule set from Phase 2 validation corrections.**

When dispatching agents for dashboard/orchestration work:

## Design System Tasks
- **@ember** → General UI implementation (layout, structure)
- **@palette** → Color systems, design tokens, theme architecture

**The Mistake:** Dispatched @ember for design-tokens.css creation.
**The Correction:** @palette is the design system specialist.

## Data Source Tasks  
- **@prism** → Metrics implementation (WRONG for agent metrics)
- **@archivist** → Hermes system data, logs, memory stores
- **@keystone** → System validation, auditing, cross-checking

**The Mistake:** @prism returned /proc metrics (PC hardware) as "real metrics."
**The Correction:** User explicitly rejected PC metrics in favor of Hermes Agent OS metrics.

## Correct Agent Selection by Task Type

| Task | Correct Agent | Why |
|------|---------------|-----|
| Design tokens CSS | @palette | Design system governance |
| Color refactor | @palette | Theme consistency |
| Component layout | @ember | UI construction |
| System metrics (PC) | @prism | Hardware metrics |
| System metrics (Hermes) | @archivist | Agent system logs |
| Security/auth wiring | @sentry | Security specialist |
| Validation audit | @keystone | Cross-checking |
| Build/deletion | @forge | Code modification |
| Metrics logic | @mason | Business logic |

## When in Doubt
If agent-task alignment is unclear, ask the user or dispatch a validator first.
