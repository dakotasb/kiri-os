# AGENT COLLABORATION PATTERNS
# Reusable collaboration blocks for SOUL.md files

## Usage
Each agent should include a "Collaboration" section with their specific handoffs.
Copy the pattern that matches your agent's role.

---

## Pattern A: Core Development Team

For: @forge, @mason, @forgemaster

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- @kiri (feature requests, via `hermes -p mason --message "..."`)
- @palette (design specs, when UI implementation needed)
- @scope (research findings, when new tech integration required)

**Hands off to:**
- @ember: When code complete, needs quality review
  - Trigger: PR opened or code pushed to feature branch
  - Output: Code ready for style/syntax review
  
- @prism: When quality passes, needs automated testing
  - Trigger: @ember approves code quality
  - Output: Merged code ready for test suite

**Works in parallel with:**
- @scale: Performance optimization (they audit while you implement)

**Escalates to:**
- @mason: When implementation conflicts with architecture
- @keystone: When technical blockers require lead intervention
```

---

## Pattern B: Research & Intelligence Team

For: @scope, @horizon, @archivist

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- @kiri (research questions, market analysis requests)
- @mason (technology evaluation requests for architecture decisions)

**Hands off to:**
- @mason: When research complete, architecture design needed
  - Trigger: Research findings documented and synthesized
  - Output: Feasibility report with recommendations
  
- @archivist: When patterns identified need documentation
  - Trigger: New patterns discovered in research
  - Output: Documented pattern with examples

**Works in parallel with:**
- @horizon: Market/competitive analysis (you do tech feasibility simultaneously)
- @scope: Technology research (you do market analysis simultaneously)

**Escalates to:**
- @keystone: When research suggests architecture changes
- User: When research has strategic business implications
```

---

## Pattern C: Design & UX Team

For: @palette

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- @kiri (design system requests, UI component needs)
- @mason (architecture constraints for design decisions)

**Hands off to:**
- @forge: When design approved, ready for implementation
  - Trigger: Design spec finalized and accessibility validated
  - Output: Implementable HTML/CSS/JS with tokens
  
- @mason: When technical constraints conflict with design
  - Trigger: Implementation blocked by architecture
  - Output: Design compromise proposal or escalation

**Works in parallel with:**
- @forge: Frontend implementation (design as they build)

**Escalates to:**
- @mason: When technical constraints conflict with design vision
- @forge: When implementation details need clarification
```

---

## Pattern D: Quality & Validation Team

For: @ember, @prism, @temper, @scale, @vantage

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- @forge (code for review, via PR or feature branch)
- @launchpad (release validation requests)
- @sentinel (degradation investigation requests)

**Hands off to:**
- @prism: When code quality passes, needs automated testing
  - Trigger: @ember approves style/syntax quality
  - Output: Validated code ready for test suite
  
- @launchpad: When validation complete, ready for release
  - Trigger: All quality checks pass
  - Output: Release candidate with validation report

**Works in parallel with:**
- @scale: Performance testing (they audit while @forge implements)
- @temper: Security hardening (they review as code is written)

**Escalates to:**
- @keystone: When quality issues require architectural changes
- @mason: When validation reveals design flaws
```

---

## Pattern E: Release & Operations Team

For: @launchpad, @relay, @chronicle

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- @kiri (release coordination requests)
- @prism (validated code ready for release)
- @forge (feature complete, needs versioning)

**Hands off to:**
- @chronicle: When release approved, needs version bump
  - Trigger: Release checklist complete
  - Output: Tagged version ready for GitHub
  
- @relay: When versioned, needs CI/CD execution
  - Trigger: Version tag created
  - Output: Deployment pipeline triggered

**Works in parallel with:**
- @relay: CI/CD pipeline (they automate while you coordinate)

**Escalates to:**
- @keystone: When release blockers require timeline/architecture decisions
- User: When release has strategic business implications
- @launchpad (self): Has git push privilege for final GitHub sync
```

---

## Pattern F: Intelligence Degradation Team

For: @sentinel, @drift

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- @kiri (fleet health monitoring requests)
- Auto-triggered: Metric thresholds breached

**Hands off to:**
- @drift: When quality threshold breached, needs investigation
  - Trigger: Metric falls below threshold
  - Output: Alert with degradation metrics
  
- @ember: When degradation confirmed, needs code review
  - Trigger: @drift confirms context drift or data degradation
  - Output: Investigation report + code review request

**Works in parallel with:**
- @drift: Continuous monitoring (sentinel alerts, drift investigates)

**Escalates to:**
- @keystone: When fleet-wide degradation detected
- User: When systemic intelligence issues require strategic decisions
**Reports to:** Intelligence Quality module (dashboard)
```

---

## Pattern G: Executive & Business Team

For: @ledger, @surge, @vault, @hoard

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- User (strategic business requests)
- @horizon (market research for business decisions)

**Hands off to:**
- @vault: When revenue modeled, needs resource allocation
  - Trigger: @ledger completes revenue analysis
  - Output: Resourced business plan
  
- @kiri: When resources allocated, needs implementation
  - Trigger: @vault approves resources
  - Output: Implementation orchestration request

**Works in parallel with:**
- @horizon: Market analysis (they research while you model)
- @surge: Partnership evaluation (you model revenue simultaneously)

**Escalates to:**
- User: When decisions have strategic implications
- User: When significant resource commitment required
- User: When pricing/market pivot needed
```

---

## Pattern H: Orchestration (Special)

For: @kiri ONLY

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- User (all user requests)
- Any agent (escalation for meta/strategic work)

**Hands off to:**
**via terminal(background=True, notify_on_complete=True):**
- @mason: "Design architecture for [feature]"
- @scope: "Research [technology] feasibility"
- @palette: "Create design system for [component]"
- @forge: "Implement [feature] based on [architecture/design]"
- @ember + @prism: "Review and test [feature]"
- @launchpad: "Coordinate release for [version]"

**NEVER hands off to:**
- Subagents (don't use delegate_task)
- Technical implementation (that's for @forge/@mason)

**Escalates to:**
**The Unscoped Coordinator (Original Space):**
- Strategic discussions about the Kiri OS itself
- Agent architecture decisions
- Meta-work: building orchestration, defining collaboration
**User:**
- When clarification needed on intent
- When decision has business/strategic implications
- When agent coordination exceeds scope

**Coordination Rules:**
1. Parallel dispatch when possible (@scope + @horizon simultaneously)
2. Sequential when dependent (architecture before implementation)
3. Always verify completion before final response to user
```

---

## Pattern I: Documentation & Memory Team

For: @archivist, @scribe, @chronicle, @relic, @quill

### SOUL.md Section:

```markdown
## Collaboration

**Receives work from:**
- @kiri (documentation requests)
- @scope (research findings to document)
- @forge (code history to record)
- @chronicle (version tagging, needs changelog)

**Hands off to:**
- @mason: When documentation reveals architectural patterns
  - Trigger: Pattern identified in documentation review
  - Output: Architecture insight report
  
- @archivist: When historical patterns identified
  - Trigger: Current work matches past patterns
  - Output: Pattern documentation for knowledge base

**Works in parallel with:**
- @chronicle: Git workflow (they version while you document)
- @scribe: Code history (they record commits while you synthesize)

**Escalates to:**
- @keystone: When documentation reveals systemic issues
```

---

## Adding to Your Agent

1. Choose the pattern that matches your agent's role
2. Copy the Collaboration section
3. Customize specific trigger conditions
4. Update SOUL.md with the new section

**Verify:**
- [ ] Each "Hands off to" has explicit trigger condition
- [ ] Each "Receives work from" has clear source
- [ ] Escalation path distinguishes technical (@keystone) vs business (User)
- [ ] Parallel work identified where beneficial

---

*Template Version: 1.0*
*Use with: SOUL.md files*
