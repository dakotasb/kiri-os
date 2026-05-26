---
name: deploy-agent
description: Minimal procedure to deploy an agent from MemPalace configuration. Queries agent_org namespace for agent config, validates integrations, spawns via delegate_task. All agent data lives in MemPalace, not in this skill.
version: 1.0.0
author: Hermes Agent
---

# Deploy Agent Skill

## Purpose
Deploy any agent defined in MemPalace with a single command. This skill contains **only the procedure**—all agent data (configs, integrations, directives) lives in MemPalace.

## Usage
```
/skill deploy-agent
```

Or in conversation:
```
Deploy agent tech_lead
```

## Procedure

### Step 1: Query MemPalace for Agent Config
```
mempalace_recall(
  wing="agent_org",
  room="<agent_name>"
)
```

### Step 2: Validate Required Integrations
Check available tools and credentials against agent's integration list from MemPalace config.

### Step 3: Spawn Agent

**CRITICAL: Choose the right dispatch mode**

See `references/agent-dispatch-modes.md` for full details.

**Option A: Spawn REAL agent (recommended for orchestration)**
```bash
terminal(
  command="hermes -p <agent_name> --message '<task_description>'",
  background=True,
  notify_on_complete=True
)
```
- Loads full SOUL.md identity
- Uses agent's config.yaml scope
- Maintains agent continuity

**Option B: Spawn subagent (ephemeral tasks)**
```python
delegate_task(
  goal="<task_description>",
  role="<agent_name>",
  toolsets=["web", "terminal", "file", "browser"]
)
```
- Generic worker without SOUL.md
- Quick to spawn
- No persistent identity

**Pitfall:** Using `delegate_task` when you need the REAL agent's SOUL.md, skills, and patterns. This creates a faceless subagent instead of the named agent.

### Step 4: Save Deployment Record
```
mempalace_save(
  palace="personality_memory_palace",
  wing="agent_org",
  hall="operations",
  room="deployments",
  closet="<agent_name>",
  content="Deployment timestamp, status, task_id from delegate_task"
)
```

## Agent Data Structure (in MemPalace)

### MemPalace Taxonomy Pattern
```
wing=agent_org
├── hall=core_build     (rooms: tech_lead, research_engineer, devops_sre, qa_manager, network_security)
├── hall=revenue        (rooms: revenue_strategist, market_analyst, portfolio_manager, business_dev, lead_generator)
├── hall=exec           (rooms: exec_assistant, smart_home_manager, wealth_coordinator)
├── hall=teams          (team-level configs)
└── hall=operations     (reports, task_queue, system_config)

Each agent room contains:
└── closet=agent_config (role, responsibilities, integrations, etc.)
```

### Agent Config Fields (closet=agent_config)
- **Role**: Primary function
- **Responsibilities**: What they do (7-10 items)
- **Initial Directive**: MVP1 task — what to accomplish first
- **Model Preferences**: Task→model mapping (e.g., "Analysis: kimi-k2.5, Coding: deepseek-r1")
- **Integrations**: Required tools/credentials, phased by Week 1/2/3
- **Collaboration**: Who they report to, partner with, escalate to
- **Report Cadence**: Daily/weekly/monthly deliverables
- **Risk Level**: Low/Medium/High/**Critical**
- **Deployment Phase**: 1/2/3 (Week X)

## Available Agents (Query MemPalace)

To see all configured agents:
```
mempalace_list_rooms(wing="agent_org")
```

Or by team:
```
mempalace_recall(wing="agent_org", hall="core_build")
mempalace_recall(wing="agent_org", hall="revenue")
mempalace_recall(wing="agent_org", hall="exec")
```

## Deployment Phases

### Phase 1 (Week 1): Core Build Team (Low Risk)
Focus: Infrastructure, development, security foundations before financial/personal systems.
| Agent | Primary Function | Key Integrations |
|-------|-----------------|------------------|
| **tech_lead** | Code review, architecture | GitHub, code analysis |
| **research_engineer** | Tech research, POCs | arXiv, blog monitoring, browser automation |
| **devops_sre** | Infrastructure, CI/CD | Docker, GitHub Actions, monitoring tools |
| **qa_manager** | Testing, quality gates | pytest, coverage tools |
| **network_security** | Security monitoring, vuln scanning | nmap, Wireshark, router APIs |

### Phase 2 (Week 2): Revenue Team (High Risk - Financial Data)
Focus: Revenue operations with sandbox testing before production APIs.
| Agent | Primary Function | Key Integrations |
|-------|-----------------|------------------|
| **revenue_strategist** | Revenue optimization, pricing | Plaid Sandbox, spreadsheets, Polymarket |
| **market_analyst** | Competitive intelligence | Web research, arxiv, blog monitoring |
| **portfolio_manager** | Investment management | Brokerage APIs (read-only), market data |
| **business_dev** | Partnership pipeline | Discord, CRM (Phase 2), LinkedIn (Phase 2) |
| **lead_generator** | Customer acquisition, sales | Discord communities, web research |

### Phase 3 (Week 3): Executive Team (Critical Risk - Personal Data/Home)
Focus: Personal productivity with gated smart home access.
| Agent | Primary Function | Key Integrations |
|-------|-----------------|------------------|
| **exec_assistant** | Calendar, scheduling, daily briefings | Google Calendar (dedicated account), Notion |
| **smart_home_manager** | IoT management, automation | Google Home, Philips Hue (local API) |
| **wealth_coordinator** | Personal wealth tracking | Plaid (Phase 2+), portfolio_manager partnership |

## Available Agents

Before deployment, verify:
1. Required toolsets are enabled
2. API credentials are available in ~/.hermes/.env
3. MCP servers are connected
4. Network access is configured (firewall/VLAN if needed)

## Security & Risk Framework

### Risk Level Definitions
| Level | Characteristics | Security Gates |
|-------|-----------------|----------------|
| **Low** | Code/repos only, no personal data | Standard access |
| **Medium** | Customer-facing, limited write | Approval for writes |
| **High** | Financial data, read-only APIs | Dedicated accounts, tokenized access |
| **Critical** | Physical control, home access | Read-only Week 1, gated approval Week 2+, network isolation |

### Financial Data Security
**Phased Approach:**
1. **Phase 1 (Manual CSV):** Export → `~/.hermes/financial_data/`. Zero API credentials.
2. **Phase 2 (Sandbox):** Plaid Sandbox with fake data. Test token flow.
3. **Phase 3+ (Production):** Read-only Plaid/brokerage APIs. Dedicated accounts, never main account.

**Critical Rule:** Never store bank login credentials. Use tokenized intermediaries (Plaid) with read-only scopes.

### Smart Home Security
- **Dedicated Google account** `dakota-exec-team@gmail.com` — NOT your personal account
- **Read-only default** — Agent can see status, cannot act without approval
- **Approval gates:** Week 1 = monitor only, Week 2+ = pre-approved automations, Week 4+ = conditional writes
- **Explicit exclusions:** Door locks, security disable, camera off — require manual CEO approval always
- **Network isolation:** VLAN segmentation if hosting sensitive services locally

### Service Account Pattern
For high-risk integrations (smart home, financial):
```
Main Account: dakota@gmail.com (your life)
    ↓
Dedicated Service: dakota-exec-team@gmail.com (agent access)
    ├── Calendar access (exec_assistant)
    └── Google Home access (smart_home_manager)
```
- If token compromised: blast radius limited to this account
- Can revoke without nuking your main Google identity
- Can scope OAuth permissions narrowly

## Deployment Phases

1. Agent executes initial directive
2. Results saved to MemPalace (wing=agent_org, hall=<agent>, room=deliverables)
3. Report generated according to agent's cadence
4. Next deployment scheduled (if recurring)

## Example Deployment

```
User: "Deploy agent tech_lead"

Hermes:
1. mempalace_recall(wing="agent_org", room="tech_lead") 
   → Gets agent_config closet
2. Validates GitHub API available, terminal access OK
3. delegate_task(
     goal="Execute as Tech Lead: Audit codebase, establish quality baselines",
     context="Tech Lead Agent - Technical direction...",
     role="tech_lead",
     toolsets=["web", "terminal", "file", "browser"],
     model="kimi-k2.5"
   )
4. mempalace_save deployment record to operations/deployments/tech_lead
5. Report: "Tech Lead deployed. Task ID: xxx. Initial directive active."
```

## Notes

- **NO agent data in this skill** - all configs in MemPalace
- **Ephemeral agents** - spawn via delegate_task, not persistent processes
- **Results in MemPalace** - all outputs saved back to agent_org hierarchy
- **Minimal context** - this skill is <100 lines, loads only what's needed