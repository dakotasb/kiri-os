---
name: system-architecture
description: Explains the three-tier storage architecture of Hermes Agent + MemPalace
version: 1.0.0
---

# Hermes Agent Storage Architecture

## Mental Model: Factory vs Products

Think of Hermes as a **factory** that builds things. The factory has different storage areas:

### Tier 1: MemPalace (The Factory's Brain)
**What:** Knowledge, patterns, preferences, agent definitions
**Why:** So the factory remembers how to build things
**Format:** Semantic, searchable, context-aware
**Lives in:** Qdrant vector database (abstracted from you)
**Accessed via:** mempalace_search, mempalace_recall

**Examples:**
- "User prefers dark mode designs"
- "When deploying agents to AWS, use these steps"
- "Agent X specializes in data analysis"
- "This pattern of delegation works for UI builds"

### Tier 2: Skills (Factory's Playbooks)
**What:** Reusable procedures, workflows, checklists
**Why:** So you don't have to reinvent processes
**Format:** Markdown with steps, commands, pitfalls
**Lives in:** ~/.hermes/skills/<skill-name>/
**Accessed via:** skill_view, skill_manage

**Examples:**
- How to deploy an agent
- How to debug memory issues
- How to create a dashboard

### Tier 3: Filesystem (Factory Output)
**What:** Actual files, code, documents, deliverables
**Why:** This is what you actually use or give to others
**Format:** Whatever the file type is (HTML, Python, PDF, etc.)
**Lives in:** ~/ (your home directory, project folders, etc.)
**Accessed via:** Standard file operations

**Examples:**
- command-center.html (dashboard)
- analysis_report.pdf
- scraper.py

## Common Confusions

### "Where did my dashboard go?"
- **Answer:** It's a file at ~/command_center/command-center.html
- **Also saved:** The *knowledge* of how to build it is in MemPalace
- **The skill** used to build it is at ~/.hermes/skills/

### "Why isn't my dashboard searchable in MemPalace?"
- **Answer:** MemPalace stores *knowledge*, not file contents
- **What's in MemPalace:** "Built dashboard with Linear aesthetic, see ~/command_center/"
- **What's NOT in MemPalace:** The actual 134KB of HTML/CSS

### "I want to 'recall' my dashboard"
- **To see it:** Open the file: ~/command_center/command-center.html
- **To rebuild it:** Ask Hermes to use the 'design-dashboard' skill
- **To understand it:** Search MemPalace for context about why it was built

## Response Language

When Hermes creates something, look for these prefixes:

| Prefix | Means | Where It Lives |
|--------|-------|----------------|
| 📚 Knowledge | Learned insight, pattern, or preference | MemPalace |
| 📁 File | Actual deliverable | Filesystem (~/...) |
| 📖 Skill | Reusable procedure | ~/.hermes/skills/ |
| 👤 Agent | Agent definition/capabilities | MemPalace |

## Quick Reference

**I want to... → Do this**

- **See my dashboard** → Open ~/command_center/command-center.html
- **Rebuild my dashboard** → Ask Hermes: "Build dashboard using design-dashboard skill"
- **Understand design choices** → Search MemPalace: "why command center built"
- **See how to build dashboards** → View skill: skill_view("design-dashboard")
- **Find similar past work** → Search MemPalace: "dashboard projects"
- **Get the actual code** → Read the file: ~/command_center/command-center.html

## Multi-Palace Architecture (Advanced)

MemPalace is **not just one palace** — it's a **collection of domain-specific palaces**:

### Current Palaces in Your System:

| Palace | Purpose | Typical Contents |
|--------|---------|------------------|
| **agent_org** | Agent framework | Agent definitions, team configs, capabilities |
| **market_research_palace** | Market research | Competitive analysis, opportunities, pricing |
| **research_palace** | General research | Academic findings, reference materials |
| **sessions** | Conversation history | Transcripts, interaction patterns |
| **competitive_intel_palace** | Competitive tracking | Competitor moves, positioning |
| **personality_memory_palace** | User identity | Preferences, communication style, rules |

### Understanding Tunnels (Cross-Palace Connections)

**Tunnels** are references that connect knowledge across palaces:
- `agent_org → market_research_palace`: Agents can leverage pricing research
- `research_palace → agent_org": Technical research informs agent capabilities

**Current State Check:** `mempalace_find_tunnels()`

**When to Create Tunnels:**
- ✅ Agents need access to domain knowledge (agent_org ↔ market_research)
- ✅ User preferences apply across palaces (personality → all others)
- ❌ Isolated domains should remain siloed (sessions doesn't need agent configs)

### Auto-Routing

When you call `mempalace_session_summary()`, content **automatically routes** to the appropriate palace based on semantic similarity. You don't manually choose — the system decides:
- Dashboard insights → **agent_org**
- Pricing insights → **market_research_palace**
- Personal preferences → **personality_memory_palace**

### Architecture Question: Silos vs Connections

**Your Current Setup:**
- ✅ 6 distinct palaces (good domain separation)
- ❌ 0 tunnels (potential gap)

**The Trade-off:**
- **Siloed (0 tunnels):** Clean boundaries, no cross-contamination
- **Connected (with tunnels):** Agents leverage all knowledge, richer intelligence

**Recommendation:** For production Agent Framework, create tunnels: `agent_org ↔ market_research_palace` so agents can leverage competitive intelligence automatically.

## System Architecture Exploration Guide

**When to use:** Encountering unclear behavior, broken features, or gaps between intended vs actual architecture in multi-component systems (like MemPalace, databases, microservices, etc.)

**The Exploration Pattern:**

1. **Survey Current State**
   - Check what tools/commands are available
   - Review existing documentation (skills, READMEs)
   - Identify actual vs intended behavior
   - Look for error messages or constraint violations

2. **Trace the Stack**
   - Map dependencies (e.g., MCP → Node → Neo4j)
   - Check running processes and logs
   - Inspect configuration files (docker-compose.yml)
   - Review source code if accessible

3. **Identify the Gap**
   - Is it a bug (unintended behavior)?
   - Is it incomplete implementation (intended but not built)?
   - Is it a configuration issue?
   - Is it a design trade-off that's been documented?

4. **Evaluate Fix vs Workaround**

| Factor | Fix | Workaround |
|--------|-----|------------|
| **Risk** | May break other things | Safer, isolated |
| **Time** | Longer (debug, test, deploy) | Immediate |
| **Tech Debt** | Solves root cause | Adds documentation burden |
| **Production Ready?** | Usually yes, after testing | Often yes, if documented |

5. **Document the Decision**
   - Create/update skill with findings
   - Note the workaround pattern
   - Set conditions for when to revisit (e.g., "revisit when X months pass" or "when Y feature needed")

---

## Deep Dive Example: MemPalace Knowledge Graph Constraints

**Problem Type:** Neo4j constraint violation preventing KG operations

### Diagnosis Pattern

**Step 1: Identify the Error**
```
Error: "constraint_d61ec1a3": Failed to create Constraint( name='constraint_d61ec1a3', 
type='RELATIONSHIP UNIQUENESS', schema=()-[:REL {id}]-() )
Failed to populate index... Note that only the first found violation is shown.
```

**Root Cause:** Neo4j constraint index corruption - attempting to enforce uniqueness on relationship IDs that already have duplicates.

**Step 2: Assess System State**
- `mempalace_find_tunnels()` returns 0 (broken)
- `mempalace_kg_add()` fails (blocked)
- Other MemPalace features still work (semantic search, palace hierarchy)
- **Impact:** Medium - workaround exists (explicit search)

**Step 3: Decision Framework (Option A/B/C)**

| Option | Approach | Risk | Best For |
|--------|----------|------|----------|
| **A** (Conservative Fix) | Backup → Drop constraint → Deduplicate → Recreate | Low with backup | Production systems |
| **B** (Nuclear) | Full Neo4j rebuild | Data loss risk | Total corruption |
| **C** (Workaround) | Document pattern, use explicit search | Tech debt accumulates | Single-user, time-constrained |

**Recommendation:** For production with <20 agents, Option A is optimal balance of safety and functionality.

### Option A Execution Steps

**Pre-Flight (Mandatory):**
```bash
# Create backup directory
mkdir -p ~/mempalace/data/neo4j_backups

# Dump database
docker exec mempalace-neo4j neo4j-admin dump \
  --to=/data/neo4j_backups/backup_pre_fix_$(date +%s).db

# Verify backup
ls -lh ~/mempalace/data/neo4j_backups/
```

**Diagnosis Queries (Neo4j Browser at http://localhost:7474):**
```cypher
// Check for duplicate relationship IDs
MATCH ()-[r:REL]->()
WITH r.id AS relId, count(*) AS cnt
WHERE cnt > 1
RETURN relId, cnt
ORDER BY cnt DESC

// List all constraints
SHOW CONSTRAINTS
```

**The Fix:**
```cypher
// Step 1: Drop broken constraint
DROP CONSTRAINT constraint_d61ec1a3

// Step 2: Deduplicate (keep first occurrence, remove rest)
MATCH ()-[r:REL]->()
WITH r.id AS relId, collect(r) AS rels
WHERE size(rels) > 1
WITH rels[1..] AS duplicates
UNWIND duplicates AS dup
DELETE dup

// Step 3: Recreate constraint cleanly
CREATE CONSTRAINT constraint_d61ec1a3 
FOR ()-[r:REL]-() REQUIRE r.id IS UNIQUE
```

**Post-Flight Verification:**
```javascript
// Test KG operations
mempalace_kg_add({
  subject: "test_entity",
  predicate: "test_relation",
  object: "test_object"
})

// Verify query works
mempalace_kg_query("test_entity")
```

**Rollback Plan (if needed):**
```bash
docker exec mempalace-neo4j neo4j-admin load \
  --from=/data/neo4j_backups/[BACKUP_FILE].db
```

---

## Knowledge Capture Workflow Patterns

**Critical Insight:** Understanding how knowledge actually flows into MemPalace

### The Automatic Learning Myth

**What users expect:** "The system automatically learns from everything I do"
**Reality:** MemPalace has **NO automatic background learning**. Everything requires explicit API calls.

**The Two Paths to Knowledge Capture:**

| Path | When to Use | How It Works | MemPalace Result |
|------|-------------|--------------|------------------|
| **Delegated Agent (Complex)** | Research, synthesis, multi-step tasks | Agent decides importance as part of work | ✅ Automatic via agency |
| **Direct Work (Simple)** | Quick file creation, commands, fixes | Artifact Tracker logs + your explicit save | ✅ Manual + safety net |

**Key Clarification:**
- Agent "automatic" saving = Agent **agency** (explicit decision within task)
- NOT background monitoring (nothing watches silently)
- Direct work requires **you** to call save

### When to Delegate vs. Work Directly

**Use Delegated Agent WHEN:**
- Task requires synthesis (connecting dots)
- Multi-step complexity
- Analysis and research
- Decision-making about importance
- Result: Agent naturally saves to MemPalace

**Use Direct (YOU) WHEN:**
- Simple and fast (write a file, run a command)
- Clear what matters (you know importance immediately)
- Quick iteration (faster than spawning agent)
- Result: Artifact Tracker logs file + you say "save this" → MemPalace

### The Complementary Safety Net

**Artifact Tracker** (filesystem) + **MemPalace** (knowledge) work together:

```
Workflow:
├── File created (filesystem) → Artifact Tracker logs automatically
├── You do work
└── If important: "save this" → MemPalace receives curated knowledge

Recovery scenario:
├── Context lost (session ends)
├── Artifact Tracker: "File X exists at Y, created during session Z"
└── You: Link to MemPalace manually or via skill
```

**This prevents the "dashboard disaster":**
- File exists on disk ✅
- Agent failed before MemPalace save ❌
- **Artifact Tracker would have shown:** "File created, location known"
- Recovery: Possible even without context

### Production Vision: "Just Works" Mode

**For end users, hide complexity:**

```
User: "Build me a dashboard"
  ↓
System: Detect complexity → Spawn agent automatically
        Set up artifact tracking (safety)
        Agent works with MemPalace integration
        Validate output
  ↓
User: Gets working dashboard + searchable memory

Behind scenes (user never sees):
├── Tier classifications
├── Artifact vs MemPalace distinction
├── Manual save prompts
└── Complexity trade-offs
```

**The "wow" moment:** "I described what I wanted, and the system made it happen AND remembered how to do it again."

### The Power User Layer

**Advanced mode available for those who want it:**
- "Show me the artifact tracker"
- "Let me adjust the memory density"
- "I want to curate manually"

**But default is intelligent automation**

## Production Note

For multi-user deployments, this becomes:

```
Tier 1 (MemPalace): Shared knowledge across all users (multi-palace)
Tier 2 (Skills): Shared procedures across all users  
Tier 3 (Filesystem): User-specific or project-specific files
Tier 4 (Artifact Tracker): Automatic activity logs (new layer)
```

**Key:** Palace separation allows multi-tenancy, but tunnels enable intelligence sharing where appropriate.

**Production Readiness Checklist:**
- [ ] All critical paths have workarounds documented
- [ ] Broken features don't block primary workflows
- [ ] Skills exist for common diagnostic patterns
- [ ] Users understand the three-tier storage model
- [ ] Agent spawning works reliably (core dependency)
- [ ] Knowledge capture workflows are documented (NOT automatic background learning)