---
name: agent-team-workflow-orchestration
description: Deploy a complete agent team with dashboard integration and git workflow. Covers the full lifecycle from architectural design through agent deployment to UI connection and version control establishment.
version: 1.0.0
author: Hermes Agent
license: MIT
triggers:
  - "deploy my agent team"
  - "set up agents with dashboard"
  - "create team with UI integration"
  - "initialize agent organization with command center"
  - "deploy multi-agent system with monitoring"
  - "create team of agents"
  - "set up agent team and connect to dashboard"
  - "deploy agents Fleet Health"
  - "establish agent team with version control"
  - "create Create Team pattern"
---

# Agent Team Workflow Orchestration

## Purpose
Deploy a complete agent team with dashboard integration and git workflow. Covers the full lifecycle from architectural design through agent deployment to UI connection and version control establishment.

## When To Use

Use this skill when you need to:
- Deploy multiple specialized agents as a coordinated team
- Connect agents to a dashboard UI for real-time status monitoring
- Establish git workflow for agent team development
- Create a "Create Team" pattern (foundation → development → testing → operations)
- Set up agent organization with Command Center integration

**Prerequisites:**
- MemPalace agent_org namespace configured
- Command Center HTML dashboard exists
- Git repository initialized (or will be)

**Not for:** Single agent deployment (use `deploy-agent`), pure UI building (use `interactive-dashboard-builder`)

## The Complete Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: ARCHITECTURE                                       │
│  • Design agent taxonomy (wing/hall/room/closet)              │
│  • Define agent roles, responsibilities, collaboration        │
│  • Create integration architecture (dashboard <-> agents)     │
│  • Write architecture document                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: AGENT DEPLOYMENT (Ordered)                         │
│  • Deploy Chronicle (Version Keeper) - foundation first       │
│  • Deploy Mason (Code Architect) - structure second          │
│  • Deploy Prism (Test Engineer) - validation third           │
│  • Deploy Forge (Feature Dev) - development last             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: UI INTEGRATION                                     │
│  • Implement AgentBus (pub/sub event system)                 │
│  • Create AgentStatusBridge (bus <-> DOM connection)         │
│  • Add agent cards to Fleet Health module                    │
│  • Simulate agent activity (demo mode)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: GIT & DEVOPS                                       │
│  • Create agents/ directory structure                        │
│  • Establish agent manifest pattern                        │
│  • Create RELEASES.md                                        │
│  • Commit with descriptive message                         │
└─────────────────────────────────────────────────────────────┘
```

## Phase 1: Architecture

### Step 1: Design Agent Taxonomy

Create MemPalace structure for the team:

```python
# Example: Create Team (vF.4 Foundation)
mempalace_save(
    palace="personality_memory_palace",
    wing="agent_org",
    hall="create_team",
    room="chronicle",
    closet="agent_config",
    content="""
    ## Chronicle — Version Keeper
    
    **Role:** Git repository management, version control, deployment history
    **Secondary Name:** Version Control Specialist
    
    ### Identity
    A meticulous keeper of truth...
    
    ### Primary Responsibilities
    1. Maintain git repository health and hygiene
    2. Create and enforce branching strategies
    3. Tag releases and manage versioning
    ...
    
    ### Initial Directive (MVP1)
    Audit the repository, establish conventions
    
    ### Model Preferences
    - Git operations: claude-3.5-sonnet
    - Documentation: kimi-k2.5
    
    ### Integrations
    - Week 1: Git CLI, GitHub API
    - Week 2: Semantic versioning automation
    
    ### Risk Level
    Low — Repository access only
    """,
    importance=5
)
```

Repeat for each agent (Mason, Prism, Forge).

### Step 2: Write Integration Architecture

Create `architecture/agent-os-integration-design.md`:

```markdown
# Agent OS Integration Architecture

## System Diagram
[agents] → AgentBus → AgentStatusBridge → [Command Center UI]

## Communication Protocol
```json
{
  "agent": "forge",
  "event": "agent.deployed|agent.status|agent.progress|agent.error",
  "timestamp": "...",
  "payload": { ... }
}
```

## MemPalace Taxonomy
wing: agent_org
├── hall: create_team
│   ├── room: chronicle
│   ├── room: mason
│   ├── room: prism
│   └── room: forge
```

## Phase 1.5: Model Configuration Strategy (CRITICAL PROTOCOL)

**DANGER:** Incorrectly assuming model availability is the #1 cause of degraded agent performance. Multi-model task mapping is a CORE architectural principle, not optional optimization.

### Step 1: Model Verification Protocol (NEVER SKIP)

**BEFORE assuming provider constraints, CHECK actual available models:**

```bash
# Check Hermes configuration for provider
cat ~/.hermes/config.yaml | grep -A5 "provider:"

# Check ALL available models via API
# This reveals what you ACTUALLY have access to
curl -s "YOUR_API_BASE/models" -H "Authorization: Bearer $API_KEY" 2>/dev/null | jq '.data[].id'

# Common sources with multi-model availability despite "provider: ollama":
# - OpenRouter (gives access to deepseek-r1, claude, etc. via Ollama protocol)
# - Custom endpoints
# - Cloud providers with model routing
```

**The Skill's Mistake I Committed:**
- Assumed "provider: ollama-cloud" meant "only kimi-k2.5 and qwen available"
- Applied Option B (limited models) when user actually had multi-model access
- Broke task-specific routing by overwriting configs with single-model configs

**The Rule:** Check actual available models, not just provider name, before configuration.

### Step 2: Provider-Actual vs Provider-Named

| Provider Name | What It Might Include | ALWAYS VERIFY |
|--------------|----------------------|---------------|
| `ollama` | Local install only | List models with `ollama list` |
| `ollama-cloud` | May include OpenRouter or other routing | Check API/models endpoint |
| `openai` | GPT family + potentially others | `/models` response |
| `anthropic` | Claude + third-party | `/models` response |

### Step 3: Multi-Model Task Mapping (Non-Negotiable)

**If ANY agent uses task-specific mappings, ALL should.** This is a system-level architecture decision.

```json
{
  "models": {
    "primary": "kimi-k2.5",
    "fallback": ["deepseek-r1", "llama-3.2-90b"],
    "task_mapping": {
      "coding": "claude-3.5-sonnet",
      "documentation": "claude-3.5-sonnet",
      "analysis": "deepseek-r1",
      "patterns": "deepseek-r1",
      "git": "deepseek-r1",
      "ui": "claude-3.5-sonnet",
      "test_design": "claude-3.5-sonnet"
    }
  }
}
```

**Agent-Specific Mappings:**

| Agent | Primary | Fallback | Task-Specific |
|-------|---------|----------|---------------|
| **Chronicle** | kimi-k2.5 | deepseek-r1, llama-3.2-90b | git→deepseek-r1, docs→claude-3.5-sonnet, analysis→claude-3.5-sonnet |
| **Mason** | kimi-k2.5 | deepseek-r1, llama-3.2-90b | arch→kimi-k2.5, patterns→deepseek-r1, docs→claude-3.5-sonnet |
| **Prism** | kimi-k2.5 | deepseek-r1, llama-3.2-90b | test_design→claude-3.5-sonnet, coverage→deepseek-r1, impl→kimi-k2.5 |
| **Forge** | kimi-k2.5 | deepseek-r1, llama-3.2-90b | coding→kimi-k2.5, ui→claude-3.5-sonnet, complex→deepseek-r1 |

#### Option B: Single Provider (Ollama Cloud Only) - DEPRECATED MISCONCEPTION
**Only if NO other models available after verification.**

```json
{
  "models": {
    "primary": "kimi-k2.5",
    "fallback": ["qwen3.5:cloud"],
    "task_mapping": {
      "all_tasks": "kimi-k2.5"
    }
  }
}
```

**Reality with ollama-cloud:**
- All agents use `kimi-k2.5` as primary
- `qwen3.5:cloud` serves as fallback/variation
- Task mappings are more about **role specialization** than model diversity

**Acceptable distribution:**
- **kimi-k2.5:** 100% of agent primary tasks
- **qwen3.5:cloud:** 100% of fallback scenarios

#### Option C: Hybrid (Primary via API, Fallback via Ollama)
**Best of both.** Use strong models when possible, fallback to local.

```json
{
  "models": {
    "primary": "claude-3.5-sonnet",
    "fallback": ["kimi-k2.5", "qwen3.5:cloud"],
    "task_mapping": {
      "critical": "claude-3.5-sonnet",
      "standard": "kimi-k2.5",
      "fallback": "qwen3.5:cloud"
    }
  }
}
```

### Step 3: Store Configuration

**In MemPalace (for agent behavior):**
```python
mempalace_save(
    palace="personality_memory_palace",
    wing="agent_org",
    hall="create_team",
    room="chronicle",
    closet="agent_config",
    content="""
    ### Models (Adapted for ollama-cloud)
    ```json
    {
      "primary": "kimi-k2.5",
      "fallback": ["qwen3.5:cloud", "kimi-k2.5"],
      "task_mapping": {
        "git": "kimi-k2.5",
        "docs": "kimi-k2.5",
        "analysis": "kimi-k2.5"
      },
      "provider_constraint": "ollama-cloud",
      "note": "Limited to kimi-k2.5 and qwen3.5:cloud per provider constraints"
    }
    ```
    """,
    importance=5
)
```

**In manifest.json (for deployment reference):**
```json
{
  "models": {
    "primary": "kimi-k2.5",
    "fallback": ["qwen3.5:cloud", "kimi-k2.5"],
    "task_mapping": {
      "git": "kimi-k2.5",
      "docs": "kimi-k2.5",
      "analysis": "kimi-k2.5"
    },
    "provider": "ollama-cloud",
    "upgrade_path": "Add OpenAI/Anthropic API keys for Claude/GPT-4o access"
  }
}
```

### Step 4: Document Provider Constraints

Create `architecture/MODEL_CONSTRAINTS.md`:

```markdown
# Model Configuration for Create Team

## Current Provider: Ollama Cloud
**Available:** kimi-k2.5, qwen3.5:cloud

### Unified Configuration
All 8 agents use kimi-k2.5 as primary. This is acceptable because:
- kimi-k2.5 is capable generalist
- Agent differentiation comes from **role/specialization**, not model
- Task-specific optimization less critical than team coordination

### Upgrade Path
To enable model diversity:
1. Add OpenAI API key → GPT-4o for communication tasks
2. Add Anthropic API key → Claude 3.5 Sonnet for coding tasks
3. Update agent configs with task-specific routing
4. Maintain ollama-cloud as fallback

### Files to Update When Adding APIs
- agents/*/manifest.json (all 8)
- agents/*/models.primary (if changed)
- MemPalace configs for each agent
```

### Why Provider-Aware Configuration Matters

1. **Deployment Reality:** You can't use models your provider doesn't host
2. **Cost Optimization:** Single-provider may be cheaper
3. **Latency:** Local (ollama) vs API has different performance characteristics
4. **Fallback Strategy:** What happens when API is down? Local model serves as backup
5. **Agent Team Design:** Multiple weak agents with specialization > one strong agent

### Step 4: Configuration Verification and Recovery Protocol

**CRITICAL:** Always verify existing configs BEFORE modifying. Multi-model setups are fragile.

#### Pre-Modiication Checklist:
```bash
# 1. Read existing agent configs
for agent in chronicle mason prism forge; do
  echo "=== $agent ==="
  cat ~/command_center/agents/${agent}/manifest.json | jq -r '.models'
done

# 2. Document current state
# If task_mapping exists with multiple models, PRESERVE IT
# Never overwrite without preserving original
```

#### If You Accidentally Overwrite (Recovery):
```bash
# 1. Check git for original
git log --oneline ~/command_center/agents/*/manifest.json | head -5
git show ORIG_COMMIT:agents/chronicle/manifest.json > /tmp/backup.json

# 2. Restore
git checkout agents/*/manifest.json  # Revert all changed

# 3. Or restore selectively
for agent in chronicle mason prism forge; do
  git show HEAD~1:agents/${agent}/manifest.json > agents/${agent}/manifest.json
done

# 4. Re-verify
./scripts/verify-agent-configs.sh
```

#### Deployment Verification:
```bash
# After any config change, verify multi-model structure preserved
node -e "
const fs = require('fs');
const agents = ['chronicle', 'mason', 'prism', 'forge'];
agents.forEach(a => {
  const m = JSON.parse(fs.readFileSync(\`agents/\${a}/manifest.json\`));
  const hasMulti = m.models?.task_mapping && Object.keys(m.models.task_mapping).length > 1;
  console.log(\`\${a}: \${hasMulti ? '✅ Multi-model' : '⚠️ Single-model'}\`);
});
"
```

#### Anti-Pattern: What NOT to Do
```bash
# ❌ WRONG: Assume single provider
for agent in chronicle mason prism forge; do
  cat > agents/${agent}/manifest.json <<'EOF'
  {"models":{"primary":"kimi-k2.5","fallback":["qwen3.5"]}}
  EOF
done

# ❌ WRONG: Overwrite task-specific mappings without checking
# ❌ WRONG: Apply "limited" config to all agents "for consistency"
```

#### Post-Deployment Verification Checklist:
- [ ] Provider confirmed AND actual available models verified
- [ ] EACH agent config read and inspected BEFORE modification
- [ ] task_mapping objects examined (not just primary/fallback)
- [ ] Post-change: All agents show multi-model structure
- [ ] Post-change: task_mapping keys are task-specific (git, docs, analysis)
- [ ] Git committed with config verification report

**Example mismatch caught:**
> User: "Chronicle should use claude for docs"
> Check: `cat agents/chronicle/manifest.json | jq '.models.task_mapping'`
> Current: `{"git":"deepseek-r1", "docs":"claude-3.5-sonnet"}`
> Result: **PRESERVED** — docs already use claude, git uses deepseek-r1
> Action: No changes needed, config already optimal

---

## Phase 2: Agent Deployment (Critical Ordering)

**Deploy in this order** — each depends on previous:

### 2.1 Chronicle First (Foundation)

**Why first:** Establishes git/version baseline for all others.

**delegate_task:**
```
goal: DEPLOY: Chronicle — Version Keeper Agent
      Initialize git workflow, agent registry, RELEASES.md
      Create agents/ directory structure
      Write manifest.json
context: Agent config from MemPalace wing=agent_org, room=chronicle
         Working directory: ~/command_center/
role: leaf  (or specific model preference from config)
toolsets: [terminal, file]
```

**Deliverables:**
- agents/chronicle/manifest.json
- agents/mason/, agents/prism/, agents/forge/ (empty)
- RELEASES.md
- Deployment report JSON

### 2.2 Mason Second (Structure)

**Why second:** Needs Chronicle's git structure; other agents need Mason's architecture guidance.

**delegate_task:**
```
goal: DEPLOY: Mason — Code Architect Agent
      Audit existing codebase (command-center-vf3.html)
      Create ARCHITECTURE.md with patterns
      Write manifest.json
context: architecture/agent-os-integration-design.md
         Chronicle deployed (foundation ready)
role: leaf
toolsets: [terminal, file]
```

**Deliverables:**
- architecture/ARCHITECTURE.md
- agents/mason/manifest.json
- Code review capabilities defined

### 2.3 Prism Third (Validation)

**Why third:** Testing infrastructure must exist before development begins.

**delegate_task:**
```
goal: DEPLOY: Prism — Test Engineer Agent
      Create test infrastructure (Playwright)
      Write smoke tests for critical paths
      Create TESTING.md
      Write manifest.json
context: Mason's architecture documented
         Command Center vF.3 structure known
role: leaf
toolsets: [terminal, file]
```

**Deliverables:**
- tests/ directory with e2e/, components/
- TESTING.md
- Smoke tests (sidebar, modules, modals)
- agents/prism/manifest.json

### 2.4 Forge Fourth (Development)

**Why last:** Needs Mason's architecture, Prism's testing, Chronicle's versioning.

**delegate_task:**
```
goal: DEPLOY: Forge — Feature Developer Agent
      Review architecture documents
      Implement AgentBus (event system)
      Create vF.4-ROADMAP.md
      Write manifest.json
context: All Phase 1 agents deployed
         Architecture defined
role: leaf
toolsets: [terminal, file]
```

**Deliverables:**
- src/agent-bus.js
- vF4-ROADMAP.md
- agents/forge/manifest.json

## Phase 3: UI Integration

### Step 1: Implement AgentBus

`src/agent-bus.js`:
```javascript
class AgentBus {
  constructor() {
    this.events = {};
    this.history = [];
  }
  
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  
  publish(event, data) {
    this.history.push({ event, data, time: Date.now() });
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
}

window.agentBus = new AgentBus();
```

### Step 2: Create AgentStatusBridge

`src/agent-status-bridge.js`:
```javascript
class AgentStatusBridge {
  constructor() {
    this.agents = new Map();
    this.init();
  }
  
  init() {
    // Subscribe to agent events
    window.agentBus?.subscribe('agent.deployed', data => this.onDeploy(data));
    window.agentBus?.subscribe('agent.status', data => this.onStatus(data));
    
    // Dispatch to UI
    document.dispatchEvent(new CustomEvent('fleetHealthUpdate', {
      detail: { agents: [...this.agents.values()] }
    }));
  }
  
  onDeploy(data) {
    this.agents.set(data.agent, { ...data, lastUpdate: Date.now() });
    this.updateUI();
  }
}

window.agentBridge = new AgentStatusBridge();
```

### Step 3: Modify Dashboard HTML

Add to `<head>`:
```html
<script src="src/agent-bus.js"></script>
<script src="src/agent-status-bridge.js"></script>
```

Add Create Team section to Fleet Health:
```html
<div class="team-section">
  <div class="team-header">CREATE TEAM (vF.4)</div>
  <div class="agent-card" data-agent="chronicle">
    <span class="agent-status active"></span>
    <span class="agent-name">Chronicle</span>
    <span class="agent-role">Version Keeper</span>
  </div>
  <!-- Mason, Prism, Forge -->
</div>
```

### Step 4: Simulate Activity (Demo Mode)

```javascript
// Demo: Emit deployment events
setTimeout(() => {
  window.agentBus?.publish('agent.deployed', {
    agent: 'chronicle',
    status: 'active',
    capabilities: ['version_control']
  });
  // ... Mason, Prism, Forge
}, 1000);
```

## Phase 4: Git Workflow

### Emergency Model Config Recovery Protocol

**When to use:** If you accidentally overwrite multi-model agent configs with simplified ones.

#### Immediate Recovery Steps:

```bash
# DISCOVER the last good commit
git log --oneline -- agents/*/manifest.json | head -10

# IDENTIFY what changed
git diff HEAD~1 -- agents/*/manifest.json | head -50

# RESTORE all agent configs from previous commit
git checkout HEAD~1 -- agents/chronicle/manifest.json \
                     agents/mason/manifest.json \
                     agents/prism/manifest.json \
                     agents/forge/manifest.json

# Verify restoration: Check for task_mapping existence
grep -l "task_mapping" agents/*/manifest.json
# Should return all 4 files

# Re-test with verification script
node scripts/verify-agent-configs.js
```

#### Prevention Checklist (Always Before Agent Config Changes):
- [ ] Read current manifest.json before any modification
- [ ] Check for `task_mapping` keys and document them
- [ ] If `task_mapping` exists → multi-model architecture → MUST PRESERVE
- [ ] Never assume provider limitations override existing task-specific routing
- [ ] Verification: After any change, all agents still have task mappings

#### MemPalace Recovery (If MemPalace configs overwritten):
```python
# Check MemPalace for historical versions
from hermes_tools import run_shell
diary_entries = run_shell("mempalace_diary_read agent_name=create_team limit=20")

# Re-save from diary or restore from git
git show HEAD~2:memories/agent_org/create_team/*/agent_config > /tmp/recovery.json
```

### Standard Git Workflow

### Directory Structure

```
~/command_center/
├── .git/
├── agents/
│   ├── chronicle/manifest.json
│   ├── mason/manifest.json
│   ├── prism/manifest.json
│   └── forge/manifest.json
├── architecture/
│   ├── agent-os-integration-design.md
│   └── ARCHITECTURE.md
├── src/
│   ├── agent-bus.js
│   └── agent-status-bridge.js
├── tests/
│   └── (test files)
├── command-center-vf3.html
├── RELEASES.md
├── TESTING.md
└── vF4-ROADMAP.md
```

### Initial Commit

```bash
git add -A
git commit -m "Create Team (A+C): Deploy Phase 1 agents + AgentBus + Fleet Health live updates"
```

### Agent Development Workflow

When Forge develops vF.4 features:
1. Forge creates feature branch
2. Forge implements feature, uses AgentBus to report progress
3. Prism validates with tests
4. Mason reviews architecture
5. Chronicle merges and tags
6. Launchpad releases (Phase 2)

## CRITICAL SAFETY PROTOCOLS (ENFORCED)

These failures ACTUALLY HAPPENED and MUST NOT repeat:

### Protocol 1: Checkpoint Before Advance
**The Violation:** Dispatched Phase 3 agents BEFORE Phase 2 snapshot existed.
**The Catch:** User explicitly stopped me: "Snapshot before every phase" rule ignored.
**The Fix:**
```
Phase N completes → SNAPSHOT FIRST → Git commit → THEN dispatch Phase N+1
```
**Pitfall:** Never assume "we can snapshot later." The user's "only do phase 3 for now" is a test of discipline, not just a scope change.

### Protocol 2: Independent Validation Gate
**The Violation:** Assumed Phase 2 complete based on agent reports, no validation.
**The Catch:** Phase 2 work existed in wrong directory (validated phase4_kiri, actual work in dashboard-iteration-v1).
**The Fix:**
```
1. Identify correct working directory BEFORE validation
2. Dispatch independent validator (@keystone) with explicit paths
3. Wait for validation report
4. User sign-off: PASSED / CONDITIONAL / FAILED
5. If FAILED → fix first, do NOT advance
```

### Protocol 3: Skill-Match Validation
**The Violation:** Dispatched @ember for design-tokens (wrong agent).
**The Catch:** User corrected: "shouldn't palette handle the design-tokens?"
**The Rule:** Double-check agent-domain alignment:
| Task | Wrong Agent | Correct Agent |
|------|-------------|---------------|
| Design tokens | @ember (general) | @palette (design system) |
| System metrics | @prism with /proc | @archivist with Hermes logs |
| Security/auth | @ember | @sentry |

### Protocol 4: Data Source Verification
**The Violation:** @prism returned generic Linux metrics (/proc/cpuinfo) instead of Hermes metrics (agent processes).
**The Discovery:** User rejected: "This is WSL PC metrics, NOT Hermes Agent OS metrics."
**The Rule:** When implementing data displays, ALWAYS verify data source:
- ❌ "Real data" ≠ correct data source
- ❌ System metrics ≠ Agent OS metrics
- ✅ Must match user's mental model of what should be displayed

Ask: "Should this show PC hardware or Agent system state?"

## Verification Checklist

- [ ] Phase 1: Architecture document created, MemPalace seeded
- [ ] Phase 2: All 4 agents deployed in order (Chronicle → Mason → Prism → Forge)
- [ ] **SAFETY:** Phase 2 snapshot exists BEFORE Phase 3 dispatch
- [ ] **SAFETY:** Phase 2 validation report reviewed (not just "agents said done")
- [ ] **SAFETY:** Correct working directory verified before validation
- [ ] Phase 3: AgentBus and StatusBridge working, agents visible in Fleet Health
- [ ] Phase 4: Git committed, agents/ directory structured
- [ ] Console shows: "Agent Chronicle deployed", "Agent Mason deployed", etc.
- [ ] All manifest.json files present in agents//
- [ ] Event bus receives and displays agent status updates

## Next Steps

To scale to Phase 2 and Phase 3:
1. Seed new agents in MemPalace (Bastion, Scale, Bounty for Phase 2)
2. Run this same workflow pattern
3. Add new agent cards to Fleet Health
4. Extend AgentBus for new event types

## Comparison with Other Skills

| Skill | Best For | This Skill Covers |
|-------|----------|-------------------|
| `agent-organization-coordination` | Hierarchy design, governance | Execution + UI integration |
| `deploy-agent` | Single agent technical deploy | Multi-agent team with ordering |
| `interactive-dashboard-builder` | UI construction | Agent-specific integration |

## Example: Complete Orchestration

```
User: "Deploy the Create Team with dashboard integration"

Hermes:
1. Phase 1: Architecture
   - Write agent-os-integration-design.md
   - Seed Chronicle, Mason, Prism, Forge to MemPalace
   
2. Phase 2: Deployment
   - delegate_task Chronicle → establishes git/registry
   - delegate_task Mason → audits architecture  
   - delegate_task Prism → creates test infra
   - delegate_task Forge → implements AgentBus
   
3. Phase 3: Integration
   - Add scripts to HTML
   - Modify Fleet Health module
   - Demo events activate
   
4. Phase 4: Git
   - Structure agents/ directory
   - Commit with descriptive message
   
Result: 4 agents active, visible in dashboard, ready for work
```

## Key Principle

**Chronicle before Forge** — Infrastructure before feature development. The Create Team pattern demonstrates the foundation → structure → validation → development sequence that scales to any agent team.
