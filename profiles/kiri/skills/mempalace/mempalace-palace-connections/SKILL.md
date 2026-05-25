---
name: mempalace-palace-connections
description: Documents which palaces contain what information and how agents should access cross-palace knowledge
version: 1.0.0
---

# MemPalace Palace Connections Manual

## Palace Directory

### 1. agent_org
**Purpose:** Agent configurations and capabilities
**Access:** Private - only agent framework
**Contents:**
- Agent definitions (devops_sre, qa_manager, research_engineer, tech_lead)
- Team configurations (core_build, exec, revenue)
- Agent capabilities and specializations

**How agents should use:**
```python
# Spawn agent with specific role
from mempalace import recall
config = recall(wing="agent_org", hall="core_build", room="research_engineer")
```

### 2. market_research_palace (TUNNEL TARGET)
**Purpose:** Your comprehensive market research
**Access:** Public - agents should search here
**Contents:**
- SimilarWeb Analysis Summary
- Competitive intelligence data
- Market sizing (TAM/SAM/SOM)
- Pricing research
- CIS (Competitive Intelligence System) architecture

**How agents should use:**
```python
# Agents spawn, then search for market context
from mempalace import search
research = search("competitive landscape for [industry]", palace="market_research_palace")
```

### 3. competitive_intel_palace
**Purpose:** System-level competitive intelligence infrastructure
**Access:** Public - operational data
**Contents:**
- CIS Architecture Design
- Self-developed intelligence system specs
- Agent Framework integration patterns

### 4. kiri-opportunity-1 through kiri-opportunity-7
**Purpose:** Individual opportunity deep-dives
**Access:** Public - strategic intelligence
**State:** Currently empty (audit shows 0 drawers)
**Contents:** 
- Detailed opportunity analysis (intended)
- Market entry strategies (intended)

### 5. personality_memory_palace
**Purpose:** User preferences and identity
**Access:** Private - system-level
**Contents:**
- Your communication style
- Hard rules (e.g., "never commit without testing")
- Identity preferences

### 6. sessions
**Purpose:** Conversation transcripts
**Access:** Private
**Contents:**
- Past session history
- Interaction patterns

### 7. general
**Purpose:** Fallback storage
**Access:** Public
**State:** Currently empty (audit shows 0 drawers)

---

## Cross-Palace Intelligence Flows

### Flow 1: Agent Needs Market Context
```
Agent (agent_org) 
  → Spawns with research_engineer config
  → Searches market_research_palace for industry context
  → Searches competitive_intel_palace for CIS data
  → Returns intelligence-informed response
```

### Flow 2: Revenue Strategist Agent
```
Agent (agent_org/revenue/revenue_strategist)
  → Loads agent_config from agent_org
  → Searches kiri-market-research for opportunity context
  → Searches competitive_intel_palace for market data
  → Formulates strategy
```

### Flow 3: Market Validation
```
User: "Validate this opportunity"
Agent: validation_agent (agent_org/core_build)
  → Searches market_research_palace for precedent
  → Searches competitive_intel_palace for market sizing
  → Searches kiri-opportunity-* for related analysis
  → Returns validation report
```

---

## The Tunnel Problem

**Current State:** Knowledge Graph (KG) is broken
- `mempalace_kg_add()` fails with constraint violation
- `mempalace_find_tunnels()` returns 0
- No automatic cross-palace connections

**Workaround:** Explicit search across palaces

**Code Pattern:**
```python
# Instead of tunnel (doesn't work):
# kg = mempalace_kg_query("market_analyst")

# Use explicit multi-palace search:
results = []
for palace in ["market_research_palace", "competitive_intel_palace"]:
    results.extend(mempalace_search(query, palace=palace))
```

---

## Key Files to Reference

| File | Palace | Purpose |
|------|--------|---------|
| SimilarWeb Analysis | market_research_palace | Competitor analysis methodology |
| CIS Architecture | competitive_intel_palace | Self-developed intel system design |
| Agent Configs | agent_org | Agent capability definitions |
| Command Center | ~/command_center/ | File-based asset (not in MemPalace) |

---

## Future: When Tunnels Are Fixed

When `mempalace_kg_add()` works:
1. Link `agent_org//revenue/market_analyst` → `market_research_palace`
2. Link `agent_org//operations/reports` → `competitive_intel_palace`
3. Link `kiri-opportunity-*` palaces → unified `kiri-research` wing

Until then: **Search explicitly, document connections manually**.