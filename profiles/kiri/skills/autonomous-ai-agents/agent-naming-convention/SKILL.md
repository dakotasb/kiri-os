---
name: agent-naming-convention
description: Establish and enforce agent naming conventions across a multi-agent framework, including clever metaphor selection, systematic renaming coordination, and synchronization across filesystem manifests, MemPalace storage, and documentation.
triggers:
  - "rename all agents to follow naming convention"
  - "establish agent naming standard"
  - "clever metaphor names for agents"
  - "systematic agent renaming"
  - "naming convention overhaul for agent teams"
  - "single word agent names with metaphors"
  - "renaming agents across manifests and mempalace"
version: 1.0.0
tags: [agent-naming, naming-convention, metaphor-names, agent-identity, systematic-renaming]
---

# Agent Naming Convention

## Overview

Establish and enforce consistent, clever, memorable naming conventions for agent frameworks. Rename existing agents systematically while coordinating updates across filesystem manifests, MemPalace rooms, and documentation.

**Use this when:**
- Agent roster has grown inconsistent or hard to remember
- Want single-word, clever metaphor names for all agents
- Need to rename agents across filesystem + MemPalace + code
- Establishing taxonomy for new agent framework
- Rebranding/restructuring existing agent teams

**Not for:**
- Creating first agents from scratch (use agent-team-workflow-orchestration)
- Merging agent teams (use agent-team-consolidation)
- One-off renames without convention (just patch the file)

---

## The Clever Metaphor Naming Pattern

### Convention Rules

| Rule | Example | Anti-Pattern |
|------|---------|--------------|
| **Single word** | `Forge`, `Prism` | `CodeBuilder`, `test_runner` |
| **Metaphor meaning** | `Mason` (builds foundations) | `Agent1`, `Helper` |
| **Pronounceable** | `Keystone` | `SRE-Dev` |
| **Team-appropriate theme** | Create Team = Building metaphors | Mixed themes across teams |
| **Unique within framework** | No duplicates | `Scope` and `Scout` both for research |

### Team Theme Examples

| Team | Theme | Agents |
|------|-------|--------|
| **Create/Build** | Foundation, Construction, Craftsmanship | Mason 🧱, Forge 🔨, Prism 🔍, Relay ⚡, Keystone 🗿 |
| **Revenue/Business** | Finance, Growth, Records | Ledger 📒, Horizon 🌅, Surge ⚡, Vault 🔒 |
| **Exec/Personal** | Support, Safety, Service | Adjunct 📋, Haven 🏠, Hoard 💰 |
| **Intel/Research** | Vision, Information, Distance | Intel 📊, Scope 🔬, Horizon 🌅 |
| **Security** | Protection, Guarding | Sentinel 🛡️, Shield, Watch |
| **Integration** | Connection, Joining | Weld 🔗, Bridge, Link |

---

## The Renaming Workflow

### Step 1: Audit Current Names

**Discover all agent names across sources:**

```bash
# Filesystem manifests
ls ~/command_center/agents/
# → mason/ forge/ prism/ market-intel/ exec_assistant/ ...

# MemPalace rooms
mempalace_list_rooms(wing="agent_org")
# → mason, forge, research_engineer, exec_team...

# Code references
grep -r "agent-id" ~/command_center/agents/*/manifest.json

# Documentation
grep -E "^\|.*\|" ~/command_center/AGENT_INVENTORY.md
```

**Identify naming inconsistencies:**
- Snake_case vs PascalCase vs lowercase: `exec_assistant`, `MarketIntelligence`
- Multi-word vs single-word: `smart_home_manager` vs `Forge`
- Descriptive vs metaphor: `revenue_strategist` vs `Ledger`

---

### Step 2: Design Naming Taxonomy

**Define themes per team:**

```python
naming_taxonomy = {
    "create_team": {
        "theme": "Foundation/Construction/Craftsmanship",
        "agents": {
            "Mason": ("Foundation", "🧱"),
            "Forge": ("Construction", "🔨"),
            "Prism": ("Refinement", "🔍"),
            "Relay": ("Transmission", "⚡"),
            "Keystone": ("Cornerstone", "🗿"),  # renamed from tech_lead
            "Weld": ("Connection", "🔗"),      # new
            "Anvil": ("Hardening", "⚒️"),      # new
        }
    },
    "revenue_team": {
        "theme": "Finance/Growth/Protection",
        "agents": {
            "Ledger": ("Record-keeping", "📒"),   # was revenue_strategist
            "Horizon": ("Vision/Distance", "🌅"), # was market_analyst
            "Surge": ("Growth/Energy", "⚡"),     # was business_dev
            "Vault": ("Protection", "🔒"),        # was portfolio_manager
        }
    },
    "exec_team": {
        "theme": "Support/Safety/Personal",
        "agents": {
            "Adjunct": ("Helper", "📋"),        # was exec_assistant
            "Haven": ("Safety", "🏠"),          # was smart_home_manager
            "Hoard": ("Accumulation", "💰"),    # was wealth_coordinator
        }
    }
}
```

**Validation checklist:**
- [ ] Each name is single word
- [ ] Metaphor is clear and appropriate to role
- [ ] Emoji complements metaphor
- [ ] No duplicates across teams
- [ ] Names are memorable and pronounceable

---

### Step 3: Plan Rename Operations

**Create rename mapping:**

| Old Name | New Name | Team | Filesystem | MemPalace | Manifest |
|----------|----------|------|------------|-----------|----------|
| tech_lead | **Keystone** | Create | mv dir | update room | patch id |
| market-intel | **Intel** | Market Intel | mv dir | update room | patch id |
| revenue_strategist | **Ledger** | Revenue | new dir | update room | new manifest |
| exec_assistant | **Adjunct** | Exec | mv dir | update room | patch id |

**Identify cascaded references:**
- Dependencies in other manifests (`"agent": "prism"` → might reference old name)
- AgentBus events with agent IDs
- Documentation tables
- Cron job configurations with `skills=["old-name"]`

---

### Step 4: Execute Systematic Renames

#### Pattern A: Rename Filesystem Directory

```bash
# Rename directory
mv ~/command_center/agents/tech_lead \
   ~/command_center/agents/Keystone

mv ~/command_center/agents/market-intel \
   ~/command_center/agents/Intel

mv ~/command_center/agents/exec_assistant \
   ~/command_center/agents/Adjunct

mv ~/command_center/agents/smart_home_manager \
   ~/command_center/agents/Haven

mv ~/command_center/agents/wealth_coordinator \
   ~/command_center/agents/Hoard
```

#### Pattern B: Update Manifest Internal Fields

```python
# Patch manifest.json with new identity
patch(
    path="~/command_center/agents/Keystone/manifest.json",
    old_string='"agent": {\n    "id": "tech_lead",\n    "name": "TechLead",\n    "display_name": "Tech Lead",',
    new_string='"agent": {\n    "id": "Keystone",\n    "name": "Keystone",\n    "display_name": "Keystone",'
)

# Update emoji to match metaphor
patch(
    path="~/command_center/agents/Keystone/manifest.json",
    old_string='"emoji": "👨‍💻",',
    new_string='"emoji": "🗿",  # Cornerstone metaphor'
)

# Update description with metaphor explanation
patch(
    path="~/command_center/agents/Keystone/manifest.json",
    old_string='"description": "Technical lead..."',
    new_string='"description": "Like a keystone that holds an arch together..."'
)
```

#### Pattern C: Create New Manifests for New Names

```python
# For agents being created under new names (not renamed)
# Example: Weld, Anvil, Vantage, Sentinel (were missing, now created)

weld_manifest = {
    "agent": {
        "id": "Weld",
        "name": "Weld",
        "display_name": "Weld",
        "emoji": "🔗",
        "role": "Integration Engineer",
        "specialty": "System Integration and Connection",
        "description": "Like a weld that joins separate metals into one solid piece...",
    },
    "team": "create_team",
    # ... rest of config
}

write_file("~/command_center/agents/Weld/manifest.json", weld_manifest)
```

---

### Step 5: Update MemPalace References

**Rename rooms to match new agent names:**

```python
# Save agent config to new MemPalace location
mempalace_save(
    palace="personality_memory_palace",
    wing="agent_org",
    hall="create_team",
    room="Keystone",  # was "tech_lead"
    closet="agent",
    content="Agent config for Keystone (formerly tech_lead)",
    importance=4
)

# Document renaming event for audit trail
mempalace_save(
    palace="personality_memory_palace", 
    wing="agent_org",
    hall="naming",
    room="convention",
    closet="renaming",
    content="""
    AGENT RENAMING EVENT:
    - tech_lead → Keystone (Cornerstone metaphor)
    - market-intel → Intel (Information metaphor)
    - revenue_strategist → Ledger (Finance metaphor)
    ...
    """,
    importance=5
)
```

---

### Step 6: Update Documentation

**Rewrite inventory with new names:**

```markdown
# AGENT_INVENTORY.md v2.1

## Team Structure

### Create Team (13 agents)
| # | Agent | Role | Emoji | Metaphor |
|---|-------|------|-------|----------|
| 1 | **Mason** | Code Architect | 🧱 | Foundation |
| 2 | **Forge** | Senior Engineer | 🔨 | Construction |
| 3 | **Prism** | QA Engineer | 🔍 | Refinement |
| ... | ... | ... | ... | ... |
| 9 | **Keystone** | Tech Lead | 🗿 | Cornerstone |
| 10 | **Weld** | Integration | 🔗 | Connection |

### Revenue Team (4 agents)
| # | Agent | Role | Emoji | Metaphor |
|---|-------|------|-------|----------|
| 15 | **Ledger** | Revenue Strategy | 📒 | Record-keeping |
| 16 | **Horizon** | Market Intel | 🌅 | Vision/Distance |
| ... | ... | ... | ... | ... |
```

**Update execution examples:**

```python
# Before (old names):
cronjob(skills=["tech_lead"], ...)
cronjob(skills=["market-intel"], ...)

# After (new names):
cronjob(skills=["Keystone"], ...)
cronjob(skills=["Intel"], ...)
```

---

### Step 6.5: Handle User Corrections (if needed)

If user requests name changes after initial attempt:

**Example:** You created "Weld", user wants "Alloy"

```bash
# Rename directory
mv ~/command_center/agents/Weld \
   ~/command_center/agents/Alloy

# Update manifest identity fields
patch(
    path="~/command_center/agents/Alloy/manifest.json",
    old_string='"id": "Weld",\n    "name": "Weld",',
    new_string='"id": "Alloy",\n    "name": "Alloy",'
)

# Preserve: emoji, role, capabilities, models (these stay correct)
# Update: metaphor in description if it changed
```

**Update MemPalace:** Rename room and document change

```python
mempalace_save(
    room="Alloy",  # was "Weld"
    content="Agent config...",
    importance=4
)

mempalace_save(
    room="convention",
    closet="renaming",
    content="Weld → Alloy (correction per user preference)",
    importance=5
)
```

**Update documentation:** Fix inventory table

```markdown
# Before
| 10 | **Weld** | Integration Engineer | 🔗 | Connection |

# After  
| 10 | **Alloy** | Integration Engineer | 🔗 | Integration |
```

**Re-validate:** Ensure all three systems in sync

---

### Step 7: Verify Complete Rename

**Cross-reference check:**

```python
def verify_rename(old_name, new_name, team):
    """Verify rename was complete across all sources."""
    
    checks = {
        "filesystem": path_exists(f"~/command_center/agents/{new_name}/manifest.json"),
        "old_filesystem": not path_exists(f"~/command_center/agents/{old_name}"),
        "manifest_id": manifest_has_field(new_name, f'"id": "{new_name}"'),
        "mempalace_room": mempalace_room_exists(team, new_name),
        "documentation": inventory_mentions(new_name),
        "no_old_refs": not grep_contains("~/command_center/", old_name),
    }
    
    all_pass = all(checks.values())
    return {"verified": all_pass, "checks": checks}

# Run for each rename
for old, new in rename_mappings.items():
    result = verify_rename(old, new, team="create_team")
    assert result["verified"], f"Rename incomplete: {old} → {new}"
```

---

## Naming Taxonomy Design Principles

### Selecting Good Metaphors

| Role Type | Metaphor Category | Examples |
|-----------|-------------------|----------|
| **Architect/Lead** | Structural/Foundation | Mason 🧱, Keystone 🗿, Cornerstone, Anchor |
| **Builder/Developer** | Craft/Construction | Forge 🔨, Weld 🔗, Cast, Melt |
| **Researcher** | Vision/Discovery | Scope 🔬, Horizon 🌅, Lens 👁️, Compass |
| **Quality/Testing** | Refinement/Hardening | Prism 🔍, Anvil ⚒️, Temper, Polish |
| **Operations** | Movement/Transmission | Relay ⚡, Launchpad 🚀, Pipeline, Flow |
| **Security** | Protection/Guarding | Sentinel 🛡️, Shield, Bastion, Watch |
| **Finance** | Accumulation/Records | Ledger 📒, Vault 🔒, Hoard 💰, Count |
| **Growth** | Energy/Expansion | Surge ⚡, Spark, Bloom, Rise |

### Avoid These Anti-Patterns

| Anti-Pattern | Why Bad | Better Alternative |
|--------------|---------|------------------|
| `Agent7` | Meaningless | `Relay` (transmission metaphor) |
| `CodeBuilder` | Literal, no cleverness | `Forge` (metalworking metaphor) |
| `the-test-agent` | Hyphenated, lowercase | `Prism` (refinement metaphor) |
| `User` | Reserved term | `Adjunct` (support metaphor) |
| `Alpha`, `Beta` | Overused | `Mason` (craft metaphor) |

---

## Comparison with Other Skills

| Skill | When to Use | This Skill |
|-------|-------------|-----------|
| **agent-team-consolidation** | Merging duplicate teams/roles | AFTER consolidation, for naming |
| **agent-organization-coordination** | Hierarchy & governance setup | Naming taxonomy within hierarchy |
| **agent-team-workflow-orchestration** | Creating agents from scratch | Naming as part of creation |
| This skill | Renaming existing agents, establishing conventions | Post-hoc naming overhaul |

---

## Example: Complete Naming Overhaul

```python
# USER: "Rename all agents to clever single-word metaphors"

# Step 1: Audit
# Found: tech_lead, exec_assistant, market-intel (inconsistent)
#         mason, forge (already good)

# Step 2: Design Taxonomy
# Theme per team identified

# Step 3: Plan renames
# tech_lead → Keystone (Cornerstone)
# exec_assistant → Adjunct (Helper)
# market-intel → Intel (Information)

# Step 4: Execute filesystem renames
terminal("mv ~/command_center/agents/tech_lead ~/command_center/agents/Keystone")
# ... for each

# Step 5: Patch manifests
patch(path="~/command_center/agents/Keystone/manifest.json", ...)
# ... for each

# Step 6: Update MemPalace
mempalace_save(room="Keystone", ...) # new location
mempalace_save(room="naming", ...)   # audit trail

# Step 7: Update inventory
write_file("~/command_center/AGENT_INVENTORY.md", new_content)

# Step 8: Verify
grep("~/command_center/", "tech_lead") # should find nothing
ls("~/command_center/agents/Keystone/") # should exist
```

**Result:** All 21 agents renamed to clever single-word metaphors, fully synchronized across filesystem, MemPalace, and documentation.

---

## Remember

```
AUDIT → DESIGN → PLAN → EXECUTE → SYNC → DOCUMENT → VERIFY

Audit: Discover all agent names
Design: Select metaphor themes per team
Plan: Create rename mapping with dependencies
Execute: Rename directories and patch manifests
Sync: Update MemPalace rooms and audit trail
Document: Rewrite inventory with new names
Verify: Cross-reference check for completeness

Metaphor > Literal
Single Word > Multi-word
Theme-aligned > Random
Consistent > Clever-but-confusing
```

**The goal:** Agent names so memorable and appropriate that you never have to look them up.

v1.0.0 - Agent naming convention establishment and enforcement for multi-agent frameworks
