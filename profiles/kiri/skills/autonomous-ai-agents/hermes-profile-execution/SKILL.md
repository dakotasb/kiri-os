---
name: hermes-profile-execution
description: Migrate from unreliable cron-based agent execution to native Hermes profile system with task-specific model selection and fallback chains. Enables reliable multi-model orchestration with `-m` model override, profile isolation, and automatic failover.
triggers:
  - "cron jobs unreliable"
  - "manifest system failing"
  - "agent execution timing out"
  - "transition to profile-based agents"
  - "multi-model agent orchestration"
  - "task-specific model selection"
  - "fallback chains for agents"
  - "need reliable agent spawning"
  - "cron vs profiles"
  - "Option 4 hybrid execution"
  - "agent profiles with different models"
  - "bulk agent creation"
  - "migrate multiple agents from manifests"
  - "create many agent profiles"
  - "automated agent setup"
  - "22 agents need CLI wrappers"
tags: [hermes-profiles, model-selection, fallback-chains, multi-agent-execution, cron-replacement, reliability]
version: 1.0.0
---

# Hermes Profile-Based Execution

## Purpose

Replace unreliable cron/manifest-based agent execution with native Hermes profiles that support task-specific model selection, automatic fallback chains, and isolated agent state.

## When To Use

Use this skill when:
- Cron jobs miss execution windows or fail silently
- Manifest-based agent execution proves unreliable
- Need task-specific model routing (architecture tasks need reasoning models, coding tasks need fast models)
- Require automatic failover between models when primary is unavailable
- Agent context compacts and loses state across long-running tasks
- Need isolated agent state (profiles) instead of shared global state

**This is an ABANDON-AND-REBUILD pattern** — not a fix of existing cron, but a migration to native Hermes profiles.

---

## The Problem: Cron/Manifest Reliability

### Why Cron Fails for Agents

| Failure Mode | Impact | Why It Happens |
|-------------|--------|----------------|
| Missed windows | Job never runs | Scheduler lag, timezone confusion |
| Silent failures | No error reporting | Jobs removed before completion seen |
| No state isolation | Context pollution | All agents share same environment |
| No automatic retry | Manual recovery only | Cron has no built-in retry |
| Context compaction | Lost state | Long jobs lose memory as context compacts |
| `context_from` timeouts | Broken dependency chains | Injecting prior job context times out |

### Why Manifests Fail

| Failure Mode | Impact | Why It Happens |
|-------------|--------|----------------|
| Self-bias | Agents default to coordinator's model | Manifest not consulted |
| Model drift | Stale model references | Manifests not validated against provider |
| Dispatcher overhead | Additional failure point | Requires separate manifest parsing system |

---

## The Solution: Hybrid Option 4

### Native Hermes Features Used

1. **Agent Profiles** (`~/.hermes/profiles/<name>/`)
   - Isolated home directory per agent
   - Separate `config.yaml` with model default
   - Separate MemPalace instance
   - Separate `.env` and state

2. **Profile Wrappers** (`~/.local/bin/<profile_name>`)
   - Direct shell execution: `mason -z "task"`
   - No scheduler, no polling, immediate spawn
   - `exec hermes -p <name> "$@"`

3. **Task-Specific Model Selection** (`-m` flag)
   - Override profile default per task: `mason -z "task" -m qwen3.5:397b`
   - Combined with profile fallback chains

4. **Fallback Chains** (`hermes fallback add`)
   - `mistral-large-3:675b` → `kimi-k2.5` → `qwen3.5:397b`
   - Automatic failover if primary model unavailable

---

## Implementation Steps

### Step 1: Bulk Profile Creation (Recommended for Teams)

For migrating multiple agents (10+), use Python to automate bulk profile creation:

```python
import subprocess
import yaml
import os

# Define your agent matrix with roles and models
AGENTS = {
    "mason": {"role": "Code Architect Lead", "primary": "deepseek-v4-pro"},
    "forge": {"role": "Senior Software Engineer", "primary": "deepseek-v4-pro"},
    "prism": {"role": "QA Automation Engineer", "primary": "deepseek-v4-pro"},
    "keystone": {"role": "Technical Lead", "primary": "kimi-k2.5"},
    "horizon": {"role": "Market Intelligence Analyst", "primary": "mistral-large-3:675b"},
    "intel": {"role": "Market Intelligence Analyst", "primary": "mistral-large-3:675b"},
    # ... add remaining agents
}

# Step 1: Create profiles from default
for agent in AGENTS:
    subprocess.run(["hermes", "profile", "create", agent, "--clone"])

# Step 2: Set primary models in config.yaml
config_dir = os.path.expanduser("~/.hermes/profiles/")
for agent, config in AGENTS.items():
    config_path = os.path.join(config_dir, agent, "config.yaml")
    with open(config_path, 'r') as f:
        cfg = yaml.safe_load(f) or {}
    
    cfg['model'] = config['primary']
    cfg['provider'] = "custom"
    cfg['base_url'] = "https://ollama.com/v1"
    
    with open(config_path, 'w') as f:
        yaml.dump(cfg, f)
```

### Step 2: Generate SOUL.md (Agent Personas)

Create role-specific personas per agent:

```python
agent_personas = {
    "mason": """You are Mason, the Code Architect Lead...
MISSION: Design and document software architecture...
CORE RESPONSIBILITIES:
- Analyze and document software architecture
- Identify and establish design patterns
...""",
    "forge": """You are Forge, the Senior Software Engineer...
MISSION: Implement features from specifications...
...""",
    # ... one per agent
}

# Write SOUL.md for each agent
for agent, persona in agent_personas.items():
    soul_path = os.path.join(config_dir, agent, "SOUL.md")
    with open(soul_path, 'w') as f:
        f.write(persona)
```

### Alternative Step 1: Manual Profile Creation

For individual agent setup:

```bash
# Clone default profile for each agent
hermes profile create mason --clone
hermes profile create forge --clone
hermes profile create prism --clone
hermes profile create keystone --clone
hermes profile create horizon --clone
hermes profile create intel --clone
```

**Effect:** Each profile at `~/.hermes/profiles/<name>/` with:
- Isolated `home/` directory
- Isolated `config.yaml`
- Isolated `SOUL.md` (copied from default, customize per role)

### Step 2: Set Model Defaults

Edit `~/.hermes/profiles/<name>/config.yaml`:

```yaml
model:
  default: kimi-k2.5  # Primary model for this agent
  temperature: 0.3
  
options:
  provider: custom
  base_url: https://ollama.com/v1
```

**Per-Agent Model Strategy:**

| Agent | Specialization | Default Model | Quick Tasks | Reasoning | Implementation |
|-------|---------------|-------------|-------------|-----------|----------------|
| **Mason** | Architecture | `deepseek-v4-pro` | `deepseek-v4-flash` | `deepseek-v4-pro` | — |
| **Forge** | Implementation | `deepseek-v4-pro` | `deepseek-v4-flash` | — | `qwen3.5:397b` |
| **Prism** | Testing | `deepseek-v4-pro` | `deepseek-v4-flash` | `deepseek-v4-pro` | `qwen3.5:397b` |
| **Keystone** | Integration | `kimi-k2.5` | `deepseek-v4-flash` | `kimi-k2.5` | `deepseek-v4-pro` |
| **Horizon** | Research | `mistral-large-3:675b` | `deepseek-v4-flash` | `kimi-k2.5` | — |
| **Intel** | Analysis | `mistral-large-3:675b` | — | `deepseek-v4-pro` | — |

### Step 3: Configure Fallback Chains

```bash
# For each profile, configure fallback chain
hermes profile use mason
hermes fallback clear
hermes fallback add  # Select mistral-large-3:675b
hermes fallback add  # Select kimi-k2.5
hermes fallback add  # Select qwen3.5:397b

hermes profile use forge
hermes fallback clear
hermes fallback add  # Select qwen3.5:397b
hermes fallback add  # Select kimi-k2.5
hermes fallback add  # Select mistral-large-3:675b

# ... repeat for each profile
```

**Fallback Chain Strategy:**
- Primary → Reasoning alternative → Fast alternative → Reliable fallback
- Chains are profile-specific (Mason uses different chain than Forge)

### Step 4: Create CLI Wrappers (Required for Direct Execution)

Create shell wrappers so agents can be called as commands:

```bash
# Create wrappers for all agents
agents=("mason" "forge" "prism" "keystone" "horizon" "intel")
for agent in "${agents[@]}"; do
    cat > ~/.local/bin/$agent << 'EOF'
#!/bin/sh
exec hermes -p AGENT "$@"
EOF
    sed -i "s/AGENT/$agent/g" ~/.local/bin/$agent
    chmod +x ~/.local/bin/$agent
done
```

**Or via Python for bulk creation:**

```python
import os

agents = ["mason", "forge", "prism", "keystone", "horizon", "intel"]
bin_dir = os.path.expanduser("~/.local/bin/")

for agent in agents:
    wrapper_path = os.path.join(bin_dir, agent)
    content = f'#!/bin/sh\nexec hermes -p {agent} "$@"\n'
    with open(wrapper_path, 'w') as f:
        f.write(content)
    os.chmod(wrapper_path, 0o755)
```

**Test wrappers:**

```bash
which mason forge prism  # Should return paths
mason -z "Hello from mason"  # Should spawn with mason profile
```

### Step 5: Python Orchestrator (Optional but Recommended)

```python
#!/usr/bin/env python3
"""AgentOrchestrator: Spawn agents with task-appropriate model selection."""

import subprocess
import time
import json
from datetime import datetime
from pathlib import Path

PROFILE_CONFIGS = {
    "mason": {
        "default": "deepseek-v4-pro",
        "fallback_chain": ["mistral-large-3:675b", "kimi-k2.5", "qwen3.5:397b"],
        "task_models": {
            "arch": "deepseek-v4-pro",
            "integration": "kimi-k2.5",
            "refactoring": "qwen3.5:397b",
            "test_design": "deepseek-v4-pro",
            "structure": "deepseek-v4-pro",
            "component_design": "deepseek-v4-pro",
            "quick": "deepseek-v4-flash"
        }
    },
    "forge": {
        "default": "deepseek-v4-pro",
        "fallback_chain": ["qwen3.5:397b", "kimi-k2.5", "mistral-large-3:675b"],
        "task_models": {
            "coding": "qwen3.5:397b",
            "html": "qwen3.5:397b",
            "css": "qwen3.5:397b",
            "javascript": "qwen3.5:397b",
            "quick": "deepseek-v4-flash",
            "implementation": "deepseek-v4-pro"
        }
    },
    # ... etc for each profile
}

def spawn_agent(profile_name: str, prompt: str, task_type: str = "default", 
                output_file: str = None, wait: bool = True, timeout: int = 600):
    """Spawn an agent with task-specific model selection."""
    
    config = PROFILE_CONFIGS.get(profile_name, {})
    
    # Task-specific model selection (Hybrid Option 4)
    if task_type in config.get("task_models", {}):
        model = config["task_models"][task_type]
    else:
        model = config.get("default", "deepseek-v4-pro")
    
    # Build command
    cmd = [
        profile_name,  # Profile wrapper: mason, forge, etc.
        "-z", prompt,
        "-m", model,
        "--provider", "custom"
    ]
    
    # Add output file directive
    if output_file:
        cmd.extend(["-o", output_file])
    
    # Execute
    print(f"[{datetime.now()}] Spawning {profile_name} with model {model}")
    print(f"  Fallback chain: {' → '.join(config.get('fallback_chain', []))}")
    
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=timeout
    )
    
    return {
        "profile": profile_name,
        "model": model,
        "exit_code": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr
    }
```

### Step 5: Shared Workspace Setup

```bash
# Create shared directory structure
mkdir -p ~/command_center/shared_agent_workspace/{pending,working,complete}

# Agents write to complete/, poll from pending/
# Absolute paths required (profiles have isolated home directories)
```

---

## Usage Patterns

### Pattern 1: Task-Specific Model Selection

```python
# Architecture task → deepseek-v4-pro
python orchestrator.py mason \
  "Design checkpoint architecture" \
  --type arch

# Coding task → qwen3.5:397b
python orchestrator.py forge \
  "Build auth module" \
  --type coding
```

### Pattern 2: Manual Spawn with Model Override

```bash
# Bypass orchestrator, explicit model
mason -z "Quick architecture review" \
  -m deepseek-v4-flash \
  --provider custom
```

### Pattern 3: Dependency Chain (File-Based Handoff)

```python
# Step 1: Horizon researches
python orchestrator.py horizon \
  "Research AI market" \
  --type market_analysis \
  --output ~/command_center/shared_agent_workspace/complete/horizon_research.md

# Step 2: Intel reads and analyzes (manual or polled trigger)
python orchestrator.py intel \
  "Read horizon_research.md from /home/user/... and analyze threats" \
  --type competitor_tracking
```

---

## Key Advantages Over Cron/Manifest

| Feature | Cron + Manifest | Profile-Based (Hybrid Option 4) |
|---------|---------------|--------------------------------|
| **Reliability** | ❌ Misses windows | ✅ Direct execution |
| **Model routing** | ⚠️ Self-bias | ✅ Task-specific + explicit override |
| **Fallback chains** | ❌ Imperative code | ✅ Native `hermes fallback` |
| **State isolation** | ❌ Shared | ✅ Per-profile home/config/MemPalace |
| **Native support** | ❌ Custom build | ✅ Hermes CLI native |
| **Execution latency** | ⚠️ Wait for poll | ✅ Immediate spawn |
| **Debugging** | ⚠️ Scheduler logs | ✅ Direct terminal output |

---

## Migration from Cron

### Before (Unreliable)

```python
# Cron-based with context chaining (fragile)
cronjob(
    action="create",
    name="mason-arch",
    schedule="* * * * *",  # Or wrong one-time calc
    skills=["mason"],
    context_from=["previous-job-id"]  # Times out
)
cronjob(action="run", job_id="mason-arch")
```

### After (Reliable)

```python
# Direct profile spawn with file-based handoff
subprocess.run([
    "mason", "-z", "Design arch", 
    "-m", "deepseek-v4-pro", "--provider", "custom"
], check=True)

# Next agent reads file, no context injection
subprocess.run([
    "keystone", "-z", 
    "Read /home/user/command_center/complete/mason_arch.md and integrate"
])
```

---

## Comparison with Other Execution Patterns

| Pattern | Use When | Don't Use When |
|---------|----------|----------------|
| **This skill** | Cron/manifest unreliable | Simple one-off tasks |
| `cronjob` | Daily reports, scheduled summaries | Real-time, dependable workflows |
| `delegate_task` | Bounded single tasks, parallel execution | Multi-step, stateful, persistent agents |
| Manifests | None — deprecated | — |

---

## Known Limitations

1. **Manual dependency chain** — No automatic "wait for Task A → Task B"
   - **Workaround:** File polling or explicit sequential execution

2. **No automatic retry** — Failed agents don't auto-respawn
   - **Workaround:** Timeout detection + retry logic in orchestrator

3. **Isolated memories** — Each profile has separate MemPalace
   - **Workaround:** Shared workspace for deliverables

4. **Interactive fallback setup** — `hermes fallback add` is TUI-based
   - **Mitigation:** One-time manual setup, persists in config

---

## Verification Steps

### Test Profile Spawning

```bash
# Test basic spawn
mason -z "Hello from mason profile" --provider custom
# Check: ~/.hermes/profiles/mason/home/ for output

# Test model override
mason -z "Quick task" -m deepseek-v4-flash --provider custom

# Test fallback (simulate primary model failure)
# Set invalid primary in config, verify fallback chain activates
```

### Test Orchestrator

```bash
# Query model selection
python orchestrator.py mason "test" --type arch --model-info

# Spawn and verify
python orchestrator.py mason "test" --type arch --output test.md
ls ~/command_center/shared_agent_workspace/complete/test.md
```

---

## Summary

**The Rule:** When cron/manifest reliability fails, migrate to native Hermes profiles with task-specific model selection and fallback chains.

**Why This Works:**
- Native platform features (profiles, fallback) → No custom infrastructure
- Direct execution → No scheduler failures
- Task-model mapping → Optimal model per workload
- Fallback chains → Automatic failover

**The Timeline:**
1. Create profiles (1 hour)
2. Configure fallback chains (30 min)
3. Write orchestrator (2 hours)
4. Test end-to-end (1 hour)

**Total:** Half day for production-grade reliability.

---

v1.0.0 — Profile-based execution for reliable multi-model agent orchestration