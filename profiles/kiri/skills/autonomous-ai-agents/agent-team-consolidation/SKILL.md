---
name: agent-team-consolidation
description: Systematically consolidate and deduplicate agent teams, merge redundant roles, migrate unique agents between teams, and establish canonical configuration across MemPalace and filesystem. Workflow for post-architecture-clarification agent reorganization.
triggers:
  - "merge agent teams"
  - "consolidate core build into create team"
  - "deduplicate agent roles"
  - "agent team reorganization"
  - "create manifests for agents in mempalace only"
  - "inventory all agents across storage"
  - "find and merge duplicate agent configs"
  - "migrate agents between teams post consolidation"
version: 1.0.0
tags: [agent-consolidation, team-merger, deduplication, configuration-migration, agent-inventory]
---

# Agent Team Consolidation

## Overview

Systematically consolidate agent teams, deduplicate redundant roles, migrate unique agents between teams, and establish canonical manifests across distributed storage (MemPalace + filesystem).

**Use this when:**
- Two teams have overlapping responsibilities (e.g., Core Build Team and Create Team)
- Architecture clarification reveals redundant agent roles
- Agents exist in MemPalace only (no filesystem manifests)
- Post-merge agent inventory needed
- Canonical agent roster must be established

**Not for:**
- Single agent deployment (use agent-organization-coordination)
- Creating new agents from scratch (use agent-team-workflow-orchestration)
- Auditing what's built vs documented (use implementation-status-audit)

---

## The Consolidation Workflow

### Step 1: Discovery - Find All Agent Configs

**Across all storage locations:**

```bash
# Filesystem manifests
find ~/command_center/agents -name "manifest.json" -o -name "*.json"

# MemPalace agent rooms
mempalace_recall(wing="win_dadab976")  # Or relevant wing

# AgentBus tracking
cat ~/command_center/agents/agentBus.json

# Skills directory reference
grep -r "agent" ~/.hermes/skills/*/  # For agent-specific skills
```

**Output:** Complete list of agent configs discovered

---

### Step 2: Compare - Identify Redundancy

**Create comparison matrix:**

| Agent Name | Role | Team | Location | Models | Status |
|-----------|------|------|----------|--------|--------|
| research_engineer | Research | Core Build | MemPalace | kimi, llama | ACTIVE |
| Scope | Research | Create Team | manifest.json | kimi, claude | ACTIVE |
| devops_sre | Infrastructure | Core Build | MemPalace | kimi, deepseek | ACTIVE |
| Relay | CI/CD | Create Team | manifest.json | kimi, claude | ACTIVE |

**Redundancy detection:**
- **Same role, different teams** → MERGE (keep one, enhance with other's capabilities)
- **Unique role, no equivalent** → MIGRATE (rehome to appropriate team)
- **MemPalace only, no manifest** → CREATE (build filesystem manifest)

---

### Step 3: Plan - Consolidation Decision Matrix

**For each agent pair/group:**

```
Group: Research Engineers
├── research_engineer (Core Build)
└── Scope (Create Team)

Decision: MERGE into Scope
- Scope has filesystem manifest ✅
- Scope has MemPalace room ✅
- Enhance Scope with research_engineer capabilities
- Deprecate research_engineer config
```

```
Agent: tech_lead (Core Build)
Decision: MIGRATE to Create Team
- Unique role: Technical Leadership
- No equivalent in Create Team
- Create new manifest in ~/command_center/agents/tech_lead/
- Rehome from Core Build → Create Team
```

```
Agents: Exec Team (MemPalace only)
├── exec_assistant
├── smart_home_manager
└── wealth_coordinator

Decision: CREATE manifests
- These exist only in MemPalace
- Create filesystem manifests for Phase 3 deployment
- Keep MemPalace configs as source of truth
```

---

### Step 4: Execute - Merge, Migrate, Create

#### Pattern A: Merge Redundant Agents

**Choose survivor (usually the one with filesystem presence):**

```python
# 1. Read both configs
survivor = read_file("~/command_center/agents/scope/manifest.json")
redundant = mempalace_recall(wing="win_dadab976", room="research_engineer")

# 2. Merge capabilities
survivor["enhanced_capabilities"] = survivor.get("capabilities", []) + \
    [c for c in redundant["capabilities"] if c not in survivor.get("capabilities", [])]

# 3. Merge specialties
survivor["specialties"] = list(set(survivor.get("specialties", []) + redundant.get("specialties", [])))

# 4. Update documentation
survivor["consolidation_note"] = "Enhanced with research_engineer capabilities from Core Build Team"
survivor["source_agents"] = ["scope", "research_engineer"]

# 5. Save enhanced survivor
write_file("~/command_center/agents/scope/manifest.json", survivor)

# 6. Flag redundant as deprecated in MemPalace
mempalace_save(..., status="merged_into_scope", deprecated=True)
```

#### Pattern B: Migrate Unique Agent

```python
# 1. Read source config from MemPalace
source = mempalace_recall(wing="win_dadab976", room="tech_lead")

# 2. Create canonical manifest
tech_lead_manifest = {
    "agent": {
        "id": "tech_lead",
        "name": "TechLead",
        "role": "Technical Lead",
        "team": "create_team",  # NEW TEAM
        "source": "Core Build Team (consolidated)"
    },
    "focus": {
        "wing": "agent_org",
        "hall": "create_team",  # NEW HALL
        "room": "tech_lead"
    },
    # ... rest of config
}

# 3. Create directory and manifest
mkdir -p ~/command_center/agents/tech_lead/
write_file("~/command_center/agents/tech_lead/manifest.json", tech_lead_manifest)

# 4. Update MemPalace with new home
mempalace_save(
    wing="agent_org",
    hall="create_team",
    room="tech_lead",
    content="Migrated from Core Build Team to Create Team"
)
```

#### Pattern C: Create Manifests for MemPalace-Only Agents

```python
# For each MemPalace-only agent:
for agent in ["exec_assistant", "smart_home_manager", "wealth_coordinator"]:
    config = mempalace_recall(wing="win_dadab976", room=agent)
    
    manifest = {
        "agent": {
            "id": config["id"],
            "name": config["name"],
            "role": config["role"],
            "team": "exec_team",
            "phase": config.get("phase", "3 (Week 3)")
        },
        "responsibilities": config["responsibilities"],
        "capabilities": config["capabilities"],
        "models": config["models"],
        "integrations": config["integrations"],
        "security_requirements": config["security_requirements"],
        "risk_level": config["risk_level"],
        "mem_palace_mapping": config["mem_palace_mapping"],
        "knowledge_base": config["knowledge_base"]
    }
    
    mkdir -p f"~/command_center/agents/{agent}/"
    write_file(f"~/command_center/agents/{agent}/manifest.json", manifest)
```

---

### Step 5: Update Tracking - agentBus & Inventory

**Update agentBus.json with consolidation events:**

```json
{
  "type": "agent.consolidated",
  "timestamp": "2026-05-05T00:00:00Z",
  "data": {
    "action": "Core Build Team merged into Create Team",
    "merged_agents": ["research_engineer", "devops_sre", "qa_manager"],
    "merged_into": {
      "research_engineer": "scope",
      "devops_sre": "relay",
      "qa_manager": "prism"
    },
    "unique_agent_kept": "tech_lead",
    "new_agents_created": ["exec_assistant", "smart_home_manager", "wealth_coordinator"]
  }
}
```

**Create comprehensive inventory:**

```markdown
# AGENT_INVENTORY.md v2.0

## Consolidation Summary
- **Before:** 4 teams, 20 agents (with redundancy)
- **After:** 4 teams, 17 agents (merged 3, kept 1 unique, +3 new)

## Team Structure
### Create Team v2.0 (9 agents)
- Mason ✅
- Forge ✅
- Prism (+qa_manager) ✅
- Chronicle ✅
- Relay (+devops_sre) ✅
- Launchpad ✅
- Scope (+research_engineer) ✅
- Scale ✅
- tech_lead (NEW, migrated) ✅

### Exec Team (3 agents)
- exec_assistant (NEW, manifest created) 📋
- smart_home_manager (NEW, manifest created) 📋
- wealth_coordinator (NEW, manifest created) 📋

[... full inventory ...]
```

---

### Step 6: Verify - Cross-Reference Check

**Ensure consistency across all sources:**

| Agent | Filesystem | MemPalace | AgentBus | Consistency |
|-------|-----------|----------|----------|-------------|
| tech_lead | ✅ manifest.json | ✅ wing=create_team | ✅ deployed event | ✅ Match |
| research_engineer | ❌ | ⚠️ deprecated | ⚠️ merged event | ✅ Merged |
| exec_assistant | ✅ manifest.json | ✅ wing=exec | ✅ configured | ✅ Match |

**Red flags to check:**
- [ ] Duplicate manifests for same agent
- [ ] MemPalace room doesn't match manifest focus
- [ ] AgentBus missing events for new agents
- [ ] Models differ between sources

---

## Consolidation Decision Framework

### When to MERGE (vs keep separate)

**Merge when:**
- Same role name (Research Engineer vs Research Engineer)
- Overlapping capabilities > 70%
- Different teams solving same problem
- One has filesystem presence, other doesn't

**Don't merge when:**
- Different specialties (e.g., "Research" vs "Architecture Research")
- Different security levels (Exec vs Core Build)
- Different report chains (CEO vs Tech Lead)

### When to MIGRATE (vs deprecate)

**Migrate when:**
- Unique role with no equivalent
- Team consolidation makes old team obsolete
- Agent adds value to new team

**Don't migrate when:**
- Role is truly obsolete (should deprecate)
- Security model incompatible (Exec vs public)

### When to CREATE manifests (vs use MemPalace only)

**Create when:**
- Agent planned for deployment (Phase 2/3)
- Need filesystem reference point
- Team needs canonical manifest location

**Keep MemPalace-only when:**
- Conceptual agent (not yet planned)
- Agent purely for KG relationships
- Temporary/testing agent

---

## Pre/Post Consolidation Template

### Pre-Consolidation (Discovery Phase)

```
=== AGENT CONFIGURATION DISCOVERY ===

Teams Found:
- Create Team: 8 agents (filesystem + MemPalace)
- Core Build Team: 4 agents (MemPalace only)
- Revenue Team: 4 agents (MemPalace only)
- Exec Team: 3 agents (MemPalace only)

Redundancy Detected:
- research_engineer (Core Build) ↔ Scope (Create Team) [SAME ROLE]
- devops_sre (Core Build) ↔ Relay (Create Team) [OVERLAP: 80%]
- qa_manager (Core Build) ↔ Prism (Create Team) [OVERLAP: 90%]

Unique Agents:
- tech_lead (Core Build) → Migrate to Create Team
- [3 Exec Team agents] → Create manifests

DECISION: Merge Core Build into Create Team
- 3 agents merged into equivalents
- 1 agent migrated
- 3 agents created
```

### Post-Consolidation (Canonical State)

```
=== CONSOLIDATED AGENT ROSTER v2.0 ===

Total Agents: 17 (was 24, removed 7 redundancy)

Create Team v2.0: 9 agents
├── Mason (Code Architect)
├── Forge (Feature Dev)
├── Prism ← merged qa_manager capabilities
├── Chronicle (Version Control)
├── Relay ← merged devops_sre capabilities
├── Launchpad (Release)
├── Scope ← merged research_engineer capabilities
├── Scale (Performance)
└── tech_lead ← migrated from Core Build (NEW)

Revenue Team: 4 agents
├── revenue_strategist
├── market_analyst
├── business_dev
└── portfolio_manager

Exec Team: 3 agents (NEW manifests)
├── exec_assistant
├── smart_home_manager
└── wealth_coordinator

Market Intelligence: 1 agent
└── market-intel

---

Files Created/Updated:
- Updated: ~/command_center/agents/agentBus.json
- Created: ~/command_center/agents/tech_lead/manifest.json
- Created: ~/command_center/agents/exec_assistant/manifest.json
- Created: ~/command_center/agents/smart_home_manager/manifest.json
- Created: ~/command_center/agents/wealth_coordinator/manifest.json
- Updated: ~/command_center/AGENT_INVENTORY.md v2.0

MemPalace Updates:
- Marked: research_engineer, devops_sre, qa_manager as MERGED
- Migrated: tech_lead room from core_build to create_team
- Confirmed: Exec Team rooms in hall=exec
```

---

## Anti-Patterns (Never Do)

- **Delete without audit** - May lose unique capabilities
- **Keep both without merging** - Maintains redundancy
- **Merge different security levels** - Exec vs Core Build shouldn't mix
- **Create manifests for conceptual agents** - Waste of space
- **Update AgentBus without events** - Lose audit trail

---

## Comparison with Other Skills

| Skill | When to Use | This Skill | Difference |
|-------|-------------|-----------|------------|
| **agent-organization-coordination** | Set up new teams, establish hierarchies | AFTER architecture set | This consolidates; that establishes |
| **implementation-status-audit** | Check what's built vs documented | Parallel task | This fixes redundancy; that reports gaps |
| **agent-team-workflow-orchestration** | Deploy new team end-to-end | Creating manifests | This merges; that creates from scratch |
| This skill | Merge teams, deduplicate, migrate | This task | Consolidation-specific workflow |

---

## Example: Complete Consolidation Session

```python
# USER: "Consolidate Core Build Team into Create Team"
# ─────────────────────────────────────────────────────

# Step 1: Discover
agents = find_agents([
    "~/command_center/agents/*/manifest.json",
    "mem_palace:wing=win_dadab976"
])
# Found: 8 Create Team + 4 Core Build + 4 Revenue + 3 Exec = 19 configs

# Step 2: Compare
redundancies = detect_redundancy(agents)
# Found: research_engineer↔Scope, devops_sre↔Relay, qa_manager↔Prism

# Step 3: Plan
decisions = {
    "merge": {
        "research_engineer": "scope",
        "devops_sre": "relay",
        "qa_manager": "prism"
    },
    "migrate": ["tech_lead"],
    "create_manifests": ["exec_assistant", "smart_home_manager", "wealth_coordinator"]
}

# Step 4: Execute
for redundant, survivor in decisions["merge"].items():
    merge_agents(redundant, survivor)

for agent in decisions["migrate"]:
    migrate_agent(agent, from_team="core_build", to_team="create_team")

for agent in decisions["create_manifests"]:
    create_manifest(agent, source="mempalace")

# Step 5: Update tracking
update_agentBus(consolidation_events)
update_inventory("v2.0", total=17, merged=3, migrated=1, created=3)

# Step 6: Verify
verify_cross_reference(all_agents)

# OUTPUT: Complete consolidated roster, all configs canonical
```

---

## Remember

```
Discovery → Compare → Plan → Merge/Migrate/Create → Track → Verify

Redundant? → Merge (keep one, enhance with other)
Unique? → Migrate (rehome to appropriate team)
MemPalace-only? → Create manifest (for planned deployment)
Novel? → Document as new capability

Always update:
- Filesystem manifests (canonical)
- MemPalace (source of truth for runtime)
- AgentBus (event tracking)
- Inventory (human-readable reference)
```

**The goal:** Single canonical agent roster with no redundancy, complete manifests, and clear team assignments.

v1.0.0 - Agent team consolidation and deduplication workflow for multi-team agent frameworks
