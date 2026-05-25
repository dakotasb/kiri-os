# Team-Based Agent Creation Template

## Overview

Create agents organized into logical teams for better coordination and resource management.

## Team Structure

```
~/.hermes/teams/
├── Personal.json         # Personal productivity team
├── Engineering.json      # Software development team  
├── Operations.json       # Infrastructure/monitoring team
└── Creative.json         # Design/content team
```

## Template: Creating a Team Agent

### Step 1: Create Team Configuration

```json
{
  "name": "Personal",
  "description": "Personal productivity and schedule optimization team",
  "created": "2026-05-15",
  "lead_agent": "tempo",
  "members": ["tempo"],
  "focus_areas": [
    "calendar_management",
    "schedule_optimization",
    "productivity_systems"
  ],
  "objectives": [
    "Maximize deep work hours per week",
    "Minimize low-value meetings",
    "Align daily schedule with strategic goals"
  ]
}
```

### Step 2: Create Agent Profile with Team Assignment

```yaml
# config.yaml
_config_version: 22
model:
  provider: custom
  model: kimi-k2.5
  base_url: https://ollama.com/v1
  api_key: ${OLLAMA_API_KEY}
  fallback_models:
    - kimi-k2.6
    - deepseek-v4-flash
  temperature: 0.7

agent:
  api_max_retries: 3
  gateway_notify_interval: 180
  gateway_timeout: 1800
  max_turns: 90
  tool_use_enforcement: auto

approvals:
  mode: auto
  cron_mode: auto
  timeout: 60

team:
  name: Personal
  role: schedule-optimizer
  lead: true

auxiliary:
  session_search:
    api_key: ${OLLAMA_API_KEY}
    base_url: https://ollama.com/v1
    model: deepseek-v4-flash
    provider: custom
    timeout: 30
    max_concurrency: 3

toolsets:
  - hermes-cli
  - file
  - memory
  - session_search
  - todo

memory:
  enabled: true
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200
  user_char_limit: 1375
```

### Step 3: Create SOUL.md with Execution Directives

```markdown
# [Agent Name] - [Role]

## Role
[Brief description]

## Mission
[Core purpose statement]

## Core Capabilities
1. [Capability 1]
2. [Capability 2]
3. [Capability 3]

## Integration Points
- [Service 1]: [How agent integrates]
- [Service 2]: [Integration method]

## Execution Protocol

When given a task:
1. **Execute immediately** — Do not ask for confirmation before starting
2. **Work autonomously** — Handle complexity, duration, and obstacles yourself
3. **Use all available tools** — terminal, file, code_execution, delegate_task as needed
4. **Report completion** — Summarize what was done and where deliverables are saved
5. **Escalate only when blocked** — Ask for help only when technically stuck, not for approval

You are trusted to complete tasks of any scope without oversight. Act decisively.

## Deliverables
- [Output location 1]
- [Output location 2]

## Dependencies
- API credential 1
- API credential 2
```

## Complete Script

```python
#!/usr/bin/env python3
"""Create a team-based agent."""

import os
import json
import yaml
from pathlib import Path

def create_team_agent(
    agent_name: str,
    team_name: str,
    role: str,
    model: str,
    soul_content: str,
    is_lead: bool = False
):
    """Create a complete team-based agent."""
    
    # Get API key from existing profile
    with open(Path.home() / '.hermes/profiles/kiri/.env') as f:
        for line in f:
            if line.startswith('OLLAMA_API_KEY='):
                api_key = line.split('=', 1)[1].strip()
                break
    
    # Create profile directory
    profile_path = Path.home() / '.hermes' / 'profiles' / agent_name
    profile_path.mkdir(parents=True, exist_ok=True)
    
    for subdir in ['memories', 'sessions', 'logs', 'cron']:
        (profile_path / subdir).mkdir(exist_ok=True)
    
    # Create config.yaml
    config = {
        '_config_version': 22,
        'model': {
            'provider': 'custom',
            'model': model,
            'base_url': 'https://ollama.com/v1',
            'api_key': '${OLLAMA_API_KEY}',
            'fallback_models': ['kimi-k2.6', 'deepseek-v4-flash'],
            'temperature': 0.7
        },
        'agent': {
            'api_max_retries': 3,
            'gateway_timeout': 1800,
            'max_turns': 90,
            'tool_use_enforcement': 'auto'
        },
        'approvals': {
            'mode': 'auto',
            'cron_mode': 'auto',
            'timeout': 60
        },
        'team': {
            'name': team_name,
            'role': role,
            'lead': is_lead
        },
        'toolsets': ['hermes-cli', 'file', 'memory'],
        'memory': {
            'enabled': True,
            'memory_char_limit': 2200,
            'user_char_limit': 1375
        }
    }
    
    with open(profile_path / 'config.yaml', 'w') as f:
        yaml.dump(config, f, default_flow_style=False)
    
    # Create SOUL.md
    with open(profile_path / 'SOUL.md', 'w') as f:
        f.write(soul_content)
    
    # Create .env
    env_content = f"""OLLAMA_API_KEY={api_key}
OLLAMA_BASE_URL=https://ollama.com/v1
HERMES_MAX_ITERATIONS=90
"""
    with open(profile_path / '.env', 'w') as f:
        f.write(env_content)
    os.chmod(profile_path / '.env', 0o600)
    
    # Create team.json
    team_meta = {
        'team': team_name,
        'created': '2026-05-15',
        'lead_agent': agent_name if is_lead else None,
        'members': [agent_name]
    }
    with open(profile_path / 'team.json', 'w') as f:
        json.dump(team_meta, f, indent=2)
    
    print(f"✅ Created @{agent_name} on Team '{team_name}'")
    print(f"   Role: {role}")
    print(f"   Lead: {is_lead}")
    print(f"   Model: {model}")

# Example usage
if __name__ == '__main__':
    create_team_agent(
        agent_name='tempo',
        team_name='Personal',
        role='schedule-optimizer',
        model='kimi-k2.5',
        soul_content='# Tempo - Schedule Optimizer\n\n...',
        is_lead=True
    )
```

## Team Commands

```bash
# List all agents in a team
hermes profile list | grep -f <(jq -r '.members[]' ~/.hermes/teams/Personal.json)

# Start all team agents
for agent in $(jq -r '.members[]' ~/.hermes/teams/Personal.json); do
  hermes -p $agent gateway run &
done

# Dispatch to team lead
hermes -p $(jq -r '.lead_agent' ~/.hermes/teams/Personal.json) chat -q "task"
```