---
name: agent-organization-coordination
description: Establish governance hierarchies, coordination patterns, and strategic documentation architectures for autonomous agent organizations. Defines the three-tier command structure (User → Coordinator → Agent Teams), escalation protocols, synthesis workflows, and reference documentation patterns that enable scalable multi-agent operations.
version: 1.0.0
author: Kiri (Primary Coordinator)
license: MIT
triggers:
  - "how should my agents be organized"
  - "set up agent teams for coordination"
  - "how do I manage multiple agent teams"
  - "coordinate revenue build and exec teams"
  - "establish agent governance hierarchy"
  - "who reviews agent deliverables"
  - "how do agents escalate to me"
  - "agent organization three tier architecture"
  - "user coordinator agent teams pattern"
  - "multi-agent coordination without micromanaging"
  - "strategic reference documentation for agent org"
---

# Agent Organization Coordination

## Overview

Establish governance hierarchies, coordination patterns, and strategic documentation architectures for autonomous agent organizations.

**Core principle:** User makes strategic decisions → Coordinator handles synthesis/escalation → Agent Teams execute autonomously with iteration and cross-validation.

## When to Use

Use this pattern when:
- Running 3+ agent teams simultaneously
- Need quality gates before deliverables reach User
- Want "overnight iteration" with minimal oversight
- Multi-team projects requiring conflict resolution
- Building reference documentation for agent org
- Establishing escalation protocols

**vs. single-agent delegation:**
- Multi-team = coordination layer needed (this skill)
- Single-agent = direct delegation (no coordination needed)

**vs. iterative-agent-pipeline:**
- This skill = organizational hierarchy and governance
- Iterative-agent-pipeline = technical mechanics of context chaining
- These complement: Pipeline runs within teams, this coordinates between teams

## The Three-Tier Architecture

### Visual Hierarchy

```
┌─────────────────────────────────────────┐
│         USER (You)                      │
│   Strategic Decisions, Final Approvals  │
│   Exception Handling, Board-Level Input │
└─────────────────┬───────────────────────┘
                  │
                  │ ESCALATION ONLY
                  │ (conflicts, risks, commitments)
                  │
┌─────────────────▼───────────────────────┐
│       KIRI (Primary Coordinator)          │
│  - Synthesis across all agent outputs     │
│  - Cross-team orchestration             │
│  - Context preservation across sessions │
│  - Exception routing to User            │
│  - Timeline management                  │
│  - Quality gate enforcement             │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌───▼────┐  ┌────▼───┐
│Revenue │  │ Core   │  │  Exec  │
│ Team   │  │ Build  │  │  Team  │
│(N agents)│ │(N agents)│ │(N agents)│
└────────┘  └────────┘  └────────┘
```

### Tier Responsibilities

**USER (Tier 1):**
- Strategic decisions only
- Final approvals
- Exception handling (when teams conflict)
- Risk decisions ("proceed with X?")
- External commitments ("agree to deadline?")

**Why:** Prevents "autonomous drift" - system cannot run away from human oversight.

**COORDINATOR (Tier 2):**
- Synthesize agent outputs into options with trade-offs
- Cross-team orchestration (parallel execution)
- Context preservation (agents are stateless, coordinator remembers)
- Exception routing (only escalate when needed)
- Timeline management (deadlines, dependencies)
- Quality gates (before deliverables reach User)

**Why:** Single point of synthesis. User gets clean options, not 11 separate pings.

**AGENT TEAMS (Tier 3):**
- Domain specialization (revenue, build, exec)
- Parallel execution (teams work simultaneously)
- Iterative refinement (4-step process with cross-validation)
- Persistent memory via MemPalace (not just session context)
- Deliver structured outputs

**Why:** Scale without proportional human oversight.

## Multi-Team Coordination Pattern

### Standard Workflow

**Step 1: User Initiates**
```
User: "Build the pitch deck"
```

**Step 2: Coordinator Creates + Saves**
```python
write_file("~/pitch/document.md", content)

# Save to appropriate MemPalace location
mempalace_save(
    palace="market_research_palace",
    wing="funding-strategy",
    content="..."
)
```

**Step 3: Coordinator Routes to Teams**
```python
# Revenue Team - validate market claims
mempalace_save(
    palace="agent_org",
    wing="revenue",
    closet="pitch-review",
    content="Validate market size, pricing, opportunities. Due Sunday."
)

# Core Build Team - validate technical claims  
mempalace_save(
    palace="agent_org",
    wing="core_build",
    closet="pitch-review",
    content="Validate system metrics, delegation improvements. Due Sunday."
)

# Exec Team - oversight and synthesis prep
mempalace_save(
    palace="agent_org",
    wing="exec",
    closet="coordination",
    content="Monitor both reviews, escalate conflicts, prepare executive briefing. Due Sunday 6PM."
)
```

**Step 4: Teams Execute Autonomously**
- Revenue Team: Runs 4-iteration overnight pipeline
- Build Team: Runs 3-iteration design cycle
- Exec Team: Monitors, prepares synthesis

**Step 5: Coordinator Collects + Synthesizes**
```python
# Sunday: Read all feedback
revenue_feedback = read_file("~/revenue_team/pitch_review.md")
build_feedback = read_file("~/build_team/pitch_review.md")

# Synthesize options
options = [
    "Option A: Keep pricing as-is (revenue validates, build neutral)",
    "Option B: Adjust pricing per revenue feedback (risk: lower ARPU)",
    "Option C: Add technical detail per build feedback (risk: complexity)"
]

# Present to User with trade-offs
```

**Step 6: User Decides**
```
You: "Go with Option A, but add technical validation as appendix"
```

**Step 7: Coordinator Finalizes + Delivers**
```python
# Update document per decision
patch(...)

# Save final
write_file("~/pitch/final.md", content)
```

### User Touchpoint Frequency

| Day | Interaction | Purpose |
|-----|-------------|---------|
| 1 | Initiate + Request reviews | Strategic direction |
| 3 | Review synthesized options | Strategic decisions |
| 3 | Approve final | Final sign-off |

**Everything else:** Automated by coordinator.

## Escalation Protocols

### Auto-Handle (Coordinator)
- Routine synthesis
- Timeline management
- Cross-team communication
- Artifact tracking
- Progress monitoring

### Escalate to User
**Only when:**
- Teams have **conflicting recommendations** (strategic trade-off)
- **Risk decisions** required ("proceed with unvalidated claim?")
- **External commitments** ("agree to Monday deadline?")
- **Strategic trade-offs** ("resource allocation?")
- **Budget/scope decisions** ("cut feature X to meet deadline?")

**Why:** Prevents decision fatigue while preserving human oversight for consequential choices.

## Strategic Reference Documentation

### Purpose
Create canonical documents that:
- Serve as "north star" for agent teams
- Provide consistent context across sessions
- Enable Knowledge Graph linking
- Support investor/stakeholder communication

### Pattern

```python
# Create reference document
mempalace_save(
    palace="agent_org",
    wing="founder-vision",
    room="system-architecture",
    closet="full-system-reference",
    content="""
    STRATEGIC REFERENCE: [System Name] Vision & Architecture
    
    === THE EVOLUTION TIMELINE ===
    Phase 1: [What happened]
    Phase 2: [What happened]
    Phase 3: [What happened]
    
    === THE COMPLETE ARCHITECTURE ===
    [Hierarchy diagram]
    
    === KEY DIFFERENTIATORS ===
    1. [Differentiator]
    2. [Differentiator]
    
    === THE PITCH NARRATIVE ===
    "[Unified story]"
    
    === CURRENT STATUS SNAPSHOT ===
    - Metric: Value
    - Metric: Value
    
    === REFERENCE USAGE ===
    - For User: [use case]
    - For Coordinator: [use case]
    - For Agent Teams: [use case]
    
    Last Updated: [Date]
    Author: [Who]
    Status: Active Reference
    Next Review: [When]
    """,
    importance=5
)

# Link to Knowledge Graph
mempalace_kg_add(
    subject="system-name",
    predicate="documented_in",
    object="strategic-reference"
)
```

### Benefits
- **You:** Strategic decisions, investor conversations
- **Coordinator:** Synthesis alignment, consistency
- **Agent Teams:** Context for deliverables, iteration alignment
- **Exec Team:** High-level oversight

## MemPalace Routing Strategy

### By Team

| Team | Palace | Wing |
|------|--------|------|
| Revenue | agent_org | revenue |
| Core Build | agent_org | core_build |
| Exec | agent_org | exec |
| Cross-team coordination | agent_org | operations |
| Strategic vision | market_research_palace | funding-strategy |
| Product testing | agent_org | product-testing |

### Linking Pattern

```python
# Every major deliverable gets KG link
mempalace_kg_add(
    subject="pitch-v2.1",
    predicate="requires_review_by",
    object="revenue-team"
)

mempalace_kg_add(
    subject="pitch-v2.1",
    predicate="requires_review_by",
    object="build-team"
)

mempalace_kg_add(
    subject="pitch-v2.1",
    predicate="coordinated_by",
    object="exec-team"
)
```

**Why:** Discoverability via `mempalace_kg_query()` for context retrieval.

## Parallel Operation Demonstration

### Pattern for Investor Pitch

```
Timeline: May 2-4, 2026

TONIGHT (May 2):
  2AM → Build Team: UI Iter 1 (Foundation)
  4AM → Build Team: UI Iter 2 (Refinement)
  6AM → Build Team: UI Iter 3 (Final)
  
OVERNIGHT (May 3):
  8AM → Product Test: MVP Iter 1 (Foundation)
  
OVERNIGHT (May 4):
  2AM → Product Test: MVP Iter 2 (Validation)
  6AM → Product Test: MVP Iter 3 (Final)
  6AM → Build Team: Command Center vF delivered

RESULT: Two complete products from autonomous teams
  - Command Center UI (internal)
  - CompetitorTracker MVP (external proof)
```

**Validation:** Both pipelines use same 4-delegation improvements, same MemPalace infrastructure, same iteration methodology.

## Quality Gates

### Before Reaching User

**Gate 1: Team Validation**
- Did Revenue Team validate market claims?
- Did Build Team validate technical claims?
- Any conflicts between team findings?

**Gate 2: Confidence Scoring**
- Are claims backed by multiple iterations?
- Are contradictions flagged (not hidden)?
- Is there convergence analysis?

**Gate 3: Presentation-Ready**
- Executive summary stands alone?
- Options include trade-offs?
- Only escalations require User input?

## Collaboration Handoffs: When to Pass Between Agents

### The Problem
Most agent SOUL.md files have **generic** "works with: forge, mason, keystone" patterns. This is copy-paste, not coordination design.

### Solution: Explicit Handoff Triggers

Define in each agent's SOUL.md:

```markdown
## Collaboration Handoffs

### I Complete, Next Agent Receives
- **Design complete** → @mason reviews architecture
- **Code complete** → @ember reviews quality
- **Testing complete** → @launchpad stages release

### I Receive, Previous Agent Completed
- **Architecture approved** → I implement
- **Code reviewed** → I fix or @forge implements
- **Release staged** → I verify deployment

### Parallel Work
- **@mason designs** (simultaneous with) **@horizon researches**
- **@forge builds** (informed by) **@scope tech evaluation**
```

### Anti-Pattern: Generic Copy-Paste
```markdown
❌ Bad: "Works with: forge, mason, keystone"
✅ Good: "Architecture decision made → Escalate to @keystone"
✅ Good: "Design ready for review → Hand to @mason"
✅ Good: "Code ready → @ember validates, @forge implements"
```

## Comparison with Other Skills

| Skill | Covers | This Skill Covers |
|-------|--------|-------------------|
| iterative-agent-pipeline | Technical iteration mechanics (context_from, validation) | Organizational hierarchy and governance |
| subagent-driven-development | Parallel task execution within scope | Multi-team orchestration between scopes |
| delegation-troubleshooting | Fixing failed delegations | Establishing coordination patterns |
| build-artifact-recovery | Artifact tracking | Strategic reference documentation |

## Agent Taxonomy: Inherent vs User-Facing

In mature multi-agent platforms, agents typically fall into two categories with different lifecycles and visibility:

### Inherent Agents (System Layer)
- **Purpose:** Platform functionality (orchestration, monitoring, cost control)
- **Lifecycle:** Always active, maintained by platform
- **Visibility:** Transparent to users, benefit without direct interaction
- **Examples:** orchestrator, degradation_monitor, learning_aggregator, cost_controller
- **Scaling:** Capabilities scale with tier, presence is constant

### User-Facing Agents (Application Layer)
- **Purpose:** User tasks (coding, research, content, business functions)
- **Lifecycle:** Deployed on demand by users
- **Visibility:** Direct interaction, catalog/marketplace discovery
- **Examples:** forge, mason, horizon, plus user-created agents
- **Scaling:** Count limited by tier, capabilities expand with tier

### Dual-Presence Agents
Some agents serve both roles with different scopes:
- **adjunct** — Inherent: system productivity; User-facing: personal assistant
- **keystone** — Inherent: technical standards; User-facing: project leadership
- **ledger** — Inherent: resource tracking; User-facing: financial strategy

### UI Implications
- Same interface across all tiers
- Feature exposure scales (business features appear as users upgrade)
- Inherent agents are "the OS", user-facing are "the apps"

## Example: Complete Coordination Flow

```python
# USER: "Create investor pitch"
# ─────────────────────────────

# Step 1: Create document
write_file("~/pitch/v1.md", pitch_content)

# Step 2: Save to MemPalace (canonical location)
mempalace_save(
    palace="market_research_palace",
    wing="funding-strategy",
    hall="founder-poc",
    room="investor-materials",
    closet="pitch-deck-v2",
    content=pitch_content,
    importance=5
)

# Step 3: Route to teams for review
mempalace_save(
    palace="agent_org",
    wing="revenue",
    hall="pitch-review",
    room="revenue-palace",
    closet="pitch-for-review",
    content="Validate market claims..."
)

mempalace_save(
    palace="agent_org",
    wing="win_dadab976",  # core_build
    hall="core_build",
    room="tech_lead",
    closet="pitch-review",
    content="Validate technical claims..."
)

mempalace_save(
    palace="agent_org",
    wing="win_dadab976",
    hall="exec",
    room="exec_assistant",
    closet="exec-team-coordination",
    content="Monitor reviews, escalate conflicts..."
)

# Step 4: Teams execute (overnight iterations)
# [Teams run autonomously via cron jobs]

# Step 5: Collect feedback (Sunday)
revenue = read_file("~/revenue_team/pitch_review.md")
build = read_file("~/build_team/pitch_review.md")

# Step 6: Synthesize options
options = synthesize_options(revenue, build)

# Step 7: Present to User
options_text = """
Option A: [Description] [Trade-offs]
Option B: [Description] [Trade-offs]
Option C: [Description] [Trade-offs]
"""

# Step 8: User decides
user_choice = "Option A with appendix"

# Step 9: Finalize and deliver
apply_choice(user_choice)
write_file("~/pitch/final.md", final_content)

# Step 10: Save final to MemPalace
mempalace_save(
    palace="market_research_palace",
    closet="pitch-deck-v2-final"
)

# USER TOUCHPOINTS: Day 1 (twice), Day 3 (decision), Day 3 (final review)
# COORDINATOR ACTIONS: 15+ steps automated
# TEAM ACTIONS: 4-iteration pipelines run autonomously
```

## Remember

```
User = CEO (strategic only)
Coordinator = COO (operations and synthesis)
Agent Teams = Departments (autonomous execution)

Escalation = Strategic decisions, risks, commitments
Synthesis = Options with trade-offs, not raw data
Reference = North star for all participants
Parallel = Multiple teams, same methodology
Quality Gates = Before reaching User
```

**The goal:** Professional deliverables with minimal human oversight, maximal autonomy.

## Version History

v1.0.0 - Agent organization coordination architecture for multi-team autonomous operations
