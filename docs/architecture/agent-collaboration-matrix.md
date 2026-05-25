# AGENT COLLABORATION MATRIX
# Kiri Agent OS - Team Coordination Guide

## Overview
This document defines explicit collaboration relationships, handoff triggers, and workflow patterns between agents in the Kiri fleet.

## Team Structure

### Core Development Pod
| Agent | Primary Role | Secondary Role |
|-------|-------------|----------------|
| @mason | Code Architect | Technical Lead decisions |
| @forge | Senior Software Engineer | Implementation |
| @forgemaster | Repository Manager | Build orchestration |

### Research & Intelligence Pod
| Agent | Primary Role | Secondary Role |
|-------|-------------|----------------|
| @scope | Technology Research | Feasibility analysis |
| @horizon | Market Intelligence | Competitive analysis |
| @archivist | Project History | Pattern documentation |
| @codex | **Codebase Intelligence** | **Pattern analysis, dependencies** |

### Design & UX Pod
| Agent | Primary Role | Secondary Role |
|-------|-------------|----------------|
| @palette | Design Systems | UI/UX implementation |

### Quality & Validation Pod
| Agent | Primary Role | Secondary Role |
|-------|-------------|----------------|
| @ember | Code Quality | Style/lint validation |
| @prism | QA Automation | Test execution |
| @temper | QA Hardening | Security hardening |
| @scale | Performance Auditor | Optimization |

### Release & Operations Pod
| Agent | Primary Role | Secondary Role |
|-------|-------------|----------------|
| @launchpad | Release Manager | GitHub sync |
| @relay | CI/CD Pipeline | Build automation |
| @chronicle | Version Control | Git workflow |
| @keystone | Technical Lead | Architecture decisions |
| @relic | **Disaster Recovery** | **Snapshot preservation** |

### Executive & Personal Pod
| Agent | Primary Role | Secondary Role |
|-------|-------------|----------------|
| @ledger | Revenue Strategy | Business development |
| @surge | Business Development | Partnerships |
| @vault | Portfolio Management | Resource allocation |

### Intelligence Degradation Pod
| Agent | Primary Role | Secondary Role |
|-------|-------------|----------------|
| @sentinel | Fleet Health Monitor | Quality dashboard |
| @drift | Context Drift Detection | Behavioral monitoring |

### Orchestration
| Agent | Primary Role |
|-------|-------------|
| @kiri | The Conductor - routes all work |

---

## Collaboration Patterns by Workflow

### Pattern 1: Feature Development Flow
```
User Request
    ↓
@kiri (assesses scope)
    ↓
@mason (creates architecture)
    ↓
@palette (designs UI if needed)
    ↓
@forge (implements feature)
    ↓
@ember + @prism (code review + tests)
    ↓
@launchpad (prepares release)
    ↓
@chronicle (manages versioning)
    ↓
@launchpad (pushes to GitHub via git priv)
```

**Handoff Triggers:**
1. @kiri → @mason: When feature requires architecture decisions
2. @mason → @palette: When UI/UX design needed
3. @palette → @forge: When design approved and ready for implementation
4. @forge → @ember: When code complete, needs quality review
5. @ember → @prism: When code quality passes, needs automated testing
6. @prism → @launchpad: When tests pass, ready for release
7. @launchpad → @chronicle: When preparing version bump
8. @chronicle → @launchpad: When versioning complete, ready to push

**Escalation Paths:**
- Implementation blocked → @mason reviews architecture
- Design constraints → @mason resolves technical vs design conflict
- Release blockers → @keystone escalates timeline/architecture issues

---

### Pattern 2: Research-Driven Development
```
Research Question
    ↓
@scope (researches emerging technologies)
    ↓
@horizon (analyzes market landscape)
    ↓
@archivist (documents patterns from past projects)
    ↓
@mason (reviews research, designs architecture)
    ↓
@forge (implements based on research)
```

**Handoff Triggers:**
1. Research identified → @scope and @horizon work in parallel
2. Research complete → @archivist documents findings
3. Documentation complete → @mason designs architecture incorporating research
4. Architecture approved → @forge implements

**Escalation Paths:**
- Research suggests architecture changes → @keystone reviews
- Implementation conflicts with research findings → @scope clarifies

---

### Pattern 3: Codebase Intelligence Flow
```
Codebase Analysis Request
    ↓
@codex (analyzes repository structure)
    ↓
@relic (identifies patterns in codebase history)
    ↓
@archivist (documents findings)
    ↓
@mason (reviews for architecture implications)
```

**Handoff Triggers:**
1. Analysis request → @codex performs deep codebase scan
2. Structure analysis done → @relic identifies historical patterns
3. Pattern analysis complete → @archivist documents
4. Documentation done → @mason reviews for architectural decisions

**Escalation Paths:**
- Analysis reveals systemic issues → @keystone escalates

---

### Pattern 4: Degradation Detection Flow
```
Quality Alert Triggered
    ↓
@sentinel (monitors fleet health)
    ↓
@drift (investigates context drift)
    ↓
[If degradation confirmed]
    ↓
@ember (reviews affected agent code quality)
    ↓
@mason (reviews architecture if needed)
```

**Handoff Triggers:**
1. Metric threshold breached → @sentinel alerts
2. Alert triggered → @drift investigates root cause
3. Degradation confirmed → @ember reviews code quality
4. Code issues found → @mason reviews if architecture changes needed

**Escalation Paths:**
- Fleet-wide degradation → @keystone reviews
- Systemic issues → @kiri escalates to coordinator

---

### Pattern 5: Release Management Flow
```
Release Preparation
    ↓
@launchpad (coordinates release)
    ↓
@prism (final validation suite)
    ↓
@scale (performance validation)
    ↓
@chronicle (version bump)
    ↓
@relay (CI/CD pipeline execution)
    ↓
@launchpad (publishes to GitHub)
```

**Handoff Triggers:**
1. Release triggered → @launchpad coordinates
2. Coordination complete → @prism runs final tests
3. Tests pass → @scale validates performance
4. Performance OK → @chronicle creates version tag
5. Versioned → @relay executes deployment pipeline
6. Pipeline success → @launchpad publishes

**Escalation Paths:**
- Release blockers → @keystone resolves timeline/technical issues
- CI/CD failures → @relay investigates, @keystone for infrastructure

---

### Pattern 6: Strategic Business Flow
```
Business Opportunity
    ↓
@horizon (market research)
    ↓
@surge (partnership evaluation)
    ↓
@ledger (revenue modeling)
    ↓
@vault (resource allocation)
    ↓
@kiri (orchestrates implementation)
```

**Handoff Triggers:**
1. Opportunity identified → @horizon researches market
2. Market validated → @surge evaluates partnerships
3. Partnerships assessed → @ledger models revenue
4. Revenue modeled → @vault allocates resources
5. Resources allocated → @kiri orchestrates execution

**Escalation Paths:**
- Strategic decisions with implications → User (Dakota)
- Resource conflicts → User (Dakota)

---

## Collaboration Triggers Quick Reference

| From Agent | To Agent | Trigger Condition | Output Format |
|------------|----------|-----------------|---------------|
| @kiri | @mason | Feature requires architecture | Architecture doc |
| @mason | @palette | UI/UX design needed | Design spec |
| @palette | @forge | Design approved | Implementable UI |
| @forge | @ember | Code complete | PR for review |
| @forge | @prism | Code merged to branch | Tests triggered |
| @scope | @mason | Research complete | Feasibility report |
| @horizon | @ledger | Market data ready | Market analysis |
| @sentinel | @drift | Quality threshold breached | Alert + investigation |
| @drift | @ember | Degradation confirmed | Code review request |
| @prism | @launchpad | Tests pass | Release candidate |
| @launchpad | @chronicle | Release approved | Version bump needed |
| @chronicle | @launchpad | Version tagged | Push to remote |

---

## Anti-Patterns to Avoid

❌ **DO NOT** have every agent escalate to @mason (current problem)
❌ **DO NOT** use generic "works with forge/mason/keystone" (too vague)
❌ **DO NOT** escalate to user for technical issues (escalate to @keystone first)
❌ **DO NOT** bypass @kiri for orchestration (unless it's meta/strategic)

✅ **DO** define specific trigger conditions
✅ **DO** specify output formats for handoffs
✅ **DO** distinguish between technical escalation (@keystone) and business escalation (User)
✅ **DO** document parallel work possibilities (@scope + @horizon can work together)

---

## Future Collaboration Patterns to Define

When these scenarios arise:
1. **Security audit flow** (@bastion coordination)
2. **Personal productivity flow** (@adjunct, @hoard integration)
3. **IoT automation flow** (@haven coordination)
4. **Content/documentation flow** (@scribe, @quill differentiation)

---

*Document Version: 1.0*
*Last Updated: 2026-05-14*
*Maintained by: @kiri + @archivist*
