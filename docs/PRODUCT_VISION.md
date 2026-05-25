# Kiri Product Vision v1.0

> **✅ Canonized** (dra_9042591c0a7a7f)  
> The single source of truth for the Agent Framework's architecture, philosophy, and execution patterns.

---

## Mission

**Empower high-talent individuals to become owners and leaders of their industry by providing an Agent OS that extends their capability, not replaces it.**

Built for those who want to:
- Get more done with less
- Retain top talent with top results
- Leverage AI as a force multiplier, not a replacement

---

## Core Philosophy

### The Hermes Differentiator

Hermes stands apart from other agent frameworks through its **three-tier memory architecture**:

| Tier | Purpose | Persistence |
|------|---------|-------------|
| **session_search** | Full conversation recall across all past sessions | FTS5 database, unlimited |
| **memory tool** | Personal notes + User profile (2,200 char limit) | Injected on EVERY turn |
| **MemPalace** | Semantic storage + Knowledge Graph + Agent configs | Qdrant + Neo4j, structured |

**Key Principle:** Session continuity WITHOUT bloat. Specifics via search, facts via memory, structure via MemPalace.

### Your Extension: The Agent Team OS

**What you're building on top of Hermes:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT FRAMEWORK STACK                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏛️  FOUNDATION: Hermes Native                                   │
│  ├─ session_search: Full conversation recall (FTS5)               │
│  ├─ memory tool: Personal notes + User profile (2,200 char)      │
│  ├─ skills: Reusable workflows + auto-capture                    │
│  ├─ MemPalace: Semantic storage + Knowledge Graph                │
│  └─ Multi-platform: Discord, CLI, etc. (same persistent memory)   │
│                                                                  │
│  🎭  YOUR EXTENSION: Create Team                                │
│  ├─ Specialized agent configs (Mason, Forge, Prism, etc.)       │
│  ├─ Multi-model routing: kimi → deepseek → llama → claude        │
│  ├─ Cron-based invocation: reliable config loading              │
│  └─ Agent accumulation: Each run builds context in MemPalace       │
│                                                                  │
│  🛡️  YOUR INNOVATION: Degradation Detection                      │
│  ├─ Input validation: Bad prompts, hallucinated data            │
│  ├─ Data integrity: DB quality, config drift detection          │
│  ├─ Context quality: Prevent bloat/confusion                    │
│  └─ Proactive: Catch before compounding                           │
│                                                                  │
│  🧬  YOUR DOMAIN EXPERTISE: People Systems DNA                   │
│  ├─ Escalation paths, feedback loops, team dynamics               │
│  ├─ Parallel processing for optimal learning                     │
│  └─ High-talent individual empowerment                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### The Three-Lens Market Position

| What Others Have | What You Have | Why It Matters |
|-----------------|---------------|----------------|
| Single ephemeral agents | Multi-agent teams with specialized roles | Scale through specialization |
| Per-session context | Persistent memory + Knowledge Graph | Continuity across sessions |
| Manual orchestration | Pattern-based Create Team | Reliability through structure |
| Reactive retrieval | Proactive degradation detection | Quality before compounding |
| Basic chat/code interfaces | Stunning dashboards for agency owners | Empowerment through UX |

**Your unique moat:** Degradation-aware agents that self-monitor, applied through the lens of your career understanding complex human organizational systems.

---

## Execution Patterns

### Pattern 1: Agent Invocation (CRITICAL)

**CORRECT:**
```
cronjob(
    action="run",
    skills=["mason"],              # Loads agent config from skills/
    context_from=["previous-job"], # Maintains accumulated context
    prompt="Review this architecture..."
)

Timeline:
T+0:      User requests work
T+1-2s:   Agent INVOKED (config loaded, identity established)
T+2s+:    Agent EXECUTES autonomously (minutes to hours)
Complete: Results saved to MemPalace, available for next run
```

**The "cron" pattern ensures reliable config loading, NOT scheduling delays.**

**ANTI-PATTERN (NEVER do this):**
```
delegate_task(goal="You are Mason, review this architecture...")

Result: Generic subagent, NO config loaded, NO accumulated memory,
        hard timeout, context lost
```

### Pattern 2: Multi-Model Routing

**Create Team agents are model-routed:**

| Task Type | Primary | Fallbacks | Task-Specific |
|-----------|---------|-----------|---------------|
| Feature dev | kimi-k2.5 | deepseek-r1, llama-3.2 | claude-3.5-sonnet |
| Architecture | kimi-k2.5 | deepseek-r1 | claude-3.5-sonnet |
| Testing | kimi-k2.5 | llama-3.2 | claude-3.5-haiku |
| Creative | kimi-k2.5 | llama-3.2 | - |

Config stored in `skills/[agent-name].md` and loaded on invocation.

### Pattern 3: Create Team Structure

**Agents exist as JSON configs in MemPalace (`win_dadab976` wing):**

| Agent | Role | Model Priority |
|-------|------|--------------|
| Mason | Code Architect | kimi → deepseek → claude |
| Forge | Feature Dev | kimi → deepseek → claude |
| Prism | Testing | kimi → llama → claude |
| Relay | CI/CD | kimi → deepseek |
| Scope | Scoping | kimi → deepseek |
| Scale | Performance | kimi → deepseek |
| Chronicle | Versioning | kimi → deepseek |

**Key principle:** "Deployed agents" are cron-invoked tasks with loaded configs, NOT persistent processes.

---

## Architecture Guardrails

### The Memory Constraint

**Memory limit: 2,200 characters**

**What belongs in memory:**
- User preferences (response style, format)
- Hard rules (delegation hierarchy, no HTML/CSS for Kiri)
- Environment facts (OS, installed tools, project conventions)
- Stable patterns that prevent repeated steering

**What does NOT belong in memory:**
- Task progress
- Session outcomes
- Completed-work logs
- Temporary TODO state
- Procedures/workflows (use skills instead)

**Memory is for reducing future steering, not logging history.**

### The Delegation Hierarchy

**ENFORCED pattern:**

```
User (strategic) → Kiri (orchestration/scoping) → Core Build Team (execution/leaf)
```

**Hard rule:** Kiri NEVER executes HTML/CSS/implementation directly.

Violation triggers immediate correction: "if you are doing it and not the core build team then stop that is not how we decided this would be done"

### Context Compaction

**Sessions rotate. Context clears.** MemPalace persists:

- Architecture decisions → `wing=agent_org/hall=architecture/room=[topic]`
- User preferences → `memory` tool (injected every turn)
- Agent work → `wing=win_dadab976/room=[agent-name]`
- Skills → `~/.hermes/skills/[category]/[skill-name]/`

**Pattern:** Filesystem captures automatically, MemPalace captures intentionally.

---

## The Degradation Detection Vision

### What It Prevents

The system you envision protects against:

```
Bad input → Compounding error → System degradation
    ↓           ↓                  ↓
Poor     Faulty logic      Context confusion
prompting  stacking         Knowledge loss

Before: Manual catch
After: Proactive detection before cascade
```

### Proactive Layers

1. **Input Validation** - Detect poor prompting that could damage agent/system
2. **Data Quality** - Scan for hallucinated data, DB issues, config drift
3. **Context Health** - Monitor for bloat, fragmentation, confusion

### Reactive Scans

1. **Logic Validation** - Catch faulty reasoning and accumulated errors
2. **Knowledge Audit** - Verify MemPalace consistency, tunnel integrity
3. **Agent Performance** - Track success rates, timeout patterns, degradation

**This is your unique innovation.** No other agent framework has built-in degradation awareness as core DNA.

---

## Target Audience

**Primary:** High-talent individuals who want to own their industry

- Consultants wanting to scale expertise
- Founders wanting leverage without hiring army
- Technical leaders managing complex systems
- Creatives wanting execution partners, not replacements

**What they want:**
- ✅ Results, not tools
- ✅ Agency over automation
- ✅ Quality preservation at scale
- ✅ Stunning interfaces that match their standards

**What they reject:**
- ❌ Generic chatbots
- ❌ Black-box AI they can't control
- ❌ Interfaces that look "enterprise software"
- ❌ Systems that degrade silently

---

## Success Metrics

**Product:**
- Time-to-first-results for new users < 30 minutes
- Agent task success rate > 90%
- Degradation caught before compounding > 95%
- User retention at 30 days > 60%

**Business:**
- High-talent individual productivity increase 3-5x
- Cost per output vs hiring equivalent 10-20% 
- Word-of-mouth growth >50% of new users

---

## Technical Principles

1. **Sparse > Dense** - MemPalace (manual curation over automatic capture)
2. **Bounded > Unbounded** - Agent tasks (iterative over monolithic)
3. **Scaffold > From-scratch** - Structure provided, agents fill
4. **Hybrid > Pure** - You/me for design, agents for implementation
5. **Explicit > Implicit** - Manual saves for strategic knowledge
6. **Prevention > Correction** - Degradation detection before cascade

---

## The Narrative

**What you tell investors:**

> "We're not building another AI tool. We're building the operating system for autonomous agent teams. Our unique insight came from studying how high-functioning human organizations work — escalation paths, feedback loops, specialization, parallel processing. We're applying that DNA to AI agents.
>
> The core differentiator is degradation detection. Just like bad code compounds, bad agent outputs compound. We catch it before it cascades. This is quality at scale."

**What you tell users:**

> "This isn't ChatGPT. This is your team of specialists that never forgets, always improves, and maintains quality as you scale. You focus on strategy, they handle execution."

---

## Canonized Status

**This document is the single source of truth.**

When agents or users ask "how does this work?" or "what's the pattern?" — this is the answer.

Changes must:
1. Be discussed and validated
2. Update this document
3. Update supporting memory entries
4. Cascade to agent configs

**Version:** v1.0  
**Canonized:** 2026-05-05  
**Next Review:** As architecture evolves

**This is the foundation.**
