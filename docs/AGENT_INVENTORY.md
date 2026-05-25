# Agent Framework — Consolidated Agent Inventory v2.2

> **Status:** Canonized, Consolidated, Renamed, and Ready for Execution  
> **Total Agents:** 21 across 4 Teams  
> **Last Updated:** 2026-05-06  
> **Inventory Version:** v2.2

---

## Executive Summary

**All agents now follow single-word clever metaphor naming convention.**

- **tech_lead** → **Keystone** 🗿 (central stone)
- **4 NEW agents:** Alloy 🔗, Temper ⚒️, Vantage 👁️, Bastion 🛡️
- **9 other agents renamed** to fit financial/support themes

### Team Summary:

| Team | Agents | Metaphor Theme |
|------|--------|----------------|
| **Create Team** | 13 | Foundation/Building/Craftsmanship |
| **Market Intelligence** | 1 | Information |
| **Revenue Team** | 4 | Finance/Business/Growth |
| **Exec Team** | 3 | Support/Personal |
| **TOTAL** | **21** | All single-word, clever metaphors |

---

## 🔨 CREATE TEAM (13 Agents)

All agents use **building/craftsmanship metaphors** — names that evoke creation, refinement, and structural integrity.

| # | Agent | Role | Emoji | Metaphor | Status |
|---|-------|------|-------|----------|--------|
| 1 | **Mason** | Code Architect Lead | 🧱 | Foundation — stone construction | ✅ Active |
| 2 | **Forge** | Senior Software Engineer | 🔨 | Construction — shaping raw metal | ✅ Active |
| 3 | **Prism** | QA Automation Engineer | 🔍 | Refinement — revealing hidden spectra | ✅ Active |
| 4 | **Relay** | CI/CD Pipeline Engineer | ⚡ | Transmission — signal without loss | ✅ Active |
| 5 | **Scope** | Research Engineer | 🔬 | Investigation — bringing distant into view | ✅ Active |
| 6 | **Chronicle** | Documentation Specialist | 📝 | Knowledge — recording history | ✅ Active |
| 7 | **Launchpad** | DevOps Engineer | 🚀 | Deployment — safe departure | ✅ Active |
| 8 | **Scale** | Performance Auditor | 📊 | Measurement — accurate weight | ✅ Active |
| 9 | **Keystone** | Technical Lead | 🗿 | Cornerstone — holds arch together | 📋 Ready |
| 10 | **Alloy** | Integration Engineer | 🔗 | Integration — metals fused together | 📋 Ready |
| 11 | **Temper** | QA Hardening Engineer | ⚒️ | Hardening — strengthening through heat | 📋 Ready |
| 12 | **Vantage** | UAT Engineer | 👁️ | Viewpoint — seeing from user's perspective | 📋 Ready |
| 13 | **Bastion** | Security Engineer | 🛡️ | Protection — fortified stronghold | 📋 Ready |

### Keystone (was tech_lead)
- **Original:** tech_lead
- **Metaphor:** The central stone in an arch that holds everything together
- **Role:** Technical leadership, architecture decisions, code review
- **Status:** Ready
- **Location:** `~/command_center/agents/Keystone/manifest.json`

---

## 📊 MARKET INTELLIGENCE (1 Agent)

| # | Agent | Role | Emoji | Metaphor | Status |
|---|-------|------|-------|----------|--------|
| 14 | **Intel** | Market Intelligence | 📊 | Information — gathering intelligence | ✅ Active |

**Origin:** was market-intel  
**Location:** `~/command_center/agents/Intel/manifest.json`

---

## 💰 REVENUE TEAM (4 Agents)

All agents use **financial/business metaphors** — names that evoke wealth, growth, and strategic vision.

| # | Agent | Role | Emoji | Metaphor | Status |
|---|-------|------|-------|----------|--------|
| 15 | **Ledger** | Revenue Strategy Lead | 📒 | Record-keeping — financial truth | 📋 Phase 2 |
| 16 | **Horizon** | Market Intelligence Analyst | 🌅 | Vision — what's coming from afar | 📋 Phase 2 |
| 17 | **Surge** | Business Development Lead | ⚡ | Growth — energy driving expansion | 📋 Phase 2 |
| 18 | **Vault** | Portfolio Manager | 🔒 | Protection — secure storage | 📋 Phase 2 |

**Origins:**
- Ledger ← revenue_strategist
- Horizon ← market_analyst
- Surge ← business_dev
- Vault ← portfolio_manager

**Location:** `~/command_center/agents/{Ledger,Horizon,Surge,Vault}/manifest.json`

---

## 👑 EXEC TEAM (3 Agents)

All agents use **support/personal metaphors** — names that evoke assistance, safety, and personal wealth.

| # | Agent | Role | Emoji | Metaphor | Status |
|---|-------|------|-------|----------|--------|
| 19 | **Adjunct** | Personal Productivity | 📋 | Helper — supplementary support | 📋 Phase 3 |
| 20 | **Haven** | Smart Home Manager | 🏠 | Safety — shelter and comfort | 📋 Phase 3 |
| 21 | **Hoard** | Wealth Coordinator | 💰 | Accumulation — treasure preserved | 📋 Phase 3 |

**Origins:**
- Adjunct ← exec_assistant
- Haven ← smart_home_manager
- Hoard ← wealth_coordinator

**Location:** `~/command_center/agents/{Adjunct,Haven,Hoard}/manifest.json`

---

## Agent Directory Structure

```
~/command_center/agents/
├── Mason/
├── Forge/
├── Prism/
├── Relay/
├── Scope/
├── Chronicle/
├── Launchpad/
├── Scale/
├── Keystone/          # was tech_lead
├── Alloy/             # NEW - Integration
├── Temper/            # NEW - QA Hardening
├── Vantage/           # NEW - UAT
├── Bastion/           # NEW - Security
├── Intel/             # was market-intel
├── Ledger/            # was revenue_strategist
├── Horizon/           # was market_analyst
├── Surge/             # was business_dev
├── Vault/             # was portfolio_manager
├── Adjunct/           # was exec_assistant
├── Haven/             # was smart_home_manager
├── Hoard/             # was wealth_coordinator
└── agentBus.json
```

---

## Execution Pattern

All agents invoked via:

```python
cronjob(
    action="run",
    skills=["AgentName"],  # e.g., "Alloy", "Keystone", "Ledger"
    context_from=["previous-job-id"],
    prompt="Task description"
)
```

**Agent ID = Agent Name** for all 21 agents (single-word, no spaces).

---

## Change Log

### v2.2 (2026-05-06)
- **CORRECTED** agent names to original planned names:
  - Weld → **Alloy**
  - Anvil → **Temper**
  - Sentinel → **Bastion**
- **CONFIRMED** Keystone (was tech_lead) — the central stone
- **CONFIRMED** Vantage (unchanged)
- Total: 21 agents, all correctly named

### v2.1 (2026-05-06)
- **RENAMED** all agents to clever metaphors
- **CREATED** 4 new agents for original missing slots

### v2.0 (2026-05-05)
- **MERGED** Core Build Team into Create Team
- **KEPT** only tech_lead as unique (now Keystone)

### v1.0 (2026-05-04)
- Initial inventory: 20 agents across 4 teams

---

## Manifest Validation

All 21 agents have:
- ✅ `id` field matching directory name
- ✅ `name` field matching display name
- ✅ `emoji` appropriate to metaphor
- ✅ `role` and `specialty` defined
- ✅ Multi-model routing configured
- ✅ MemPalace storage mapping
- ✅ Team and hall assignments

---

*End of Inventory v2.2 — All Names Validated*
