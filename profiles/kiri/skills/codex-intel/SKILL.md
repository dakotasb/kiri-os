---
skill_name: codex-intel
codename: codex
version: "1.0.0"
description: |
  Codebase Intelligence Analyst - studies repositories to extract patterns
  and generate intelligence reports. Surveys GitHub repos, analyzes architectures,
  and identifies best practices for optimization of other agents.
triggers:
  - "analyze repository"
  - "survey codebase"
  - "extract patterns"
  - "codex report"
  - "study patterns"
authors:
  - "Kiri"
requirements:
  - "git"
  - "curl"
  - "jq"
  - "python3"
---

# Codex - Codebase Intelligence Analyst

## Overview

Codex analyzes codebases to extract patterns, architectures, and best practices
from successful projects. Similar to market intelligence but focused on code
and implementation patterns.

## Key Responsibilities

1. **Repository Analysis** - Deep dive into open-source projects
2. **Pattern Extraction** - Identify optimal structures and approaches
3. **Intelligence Reports** - Generate actionable insights for other agents
4. **Knowledge Building** - Maintain pattern databases

## Usage Patterns

### Analyze a Repository

```bash
# Quick analysis of a GitHub repo
python ~/.hermes/skills/codex-intel/scripts/analyze_repo.py \
  --repo microsoft/playwright \
  --category testing_framework

# Detailed architecture analysis
python ~/.hermes/skills/codex-intel/scripts/analyze_repo.py \
  --repo apache/superset \
  --depth deep \
  --focus architecture,state_management
```

### Survey Multiple Repos

```bash
# Survey dashboard frameworks
python ~/.hermes/skills/codex-intel/scripts/survey_category.py \
  --category ui_dashboards \
  --repos grafana/metabase/superset

# Study agent frameworks
python ~/.hermes/skills/codex-intel/scripts/survey_category.py \
  --category agent_frameworks
```

### Generate Report for Agent

```bash
# Create optimization recommendations for specific agent
python ~/.hermes/skills/codex-intel/scripts/generate_recommendations.py \
  --target-agent mason \
  --focus architecture,patterns
```

## Model Selection

Codex uses different models for different analysis types:

| Task Type | Model | Reason |
|-----------|-------|--------|
| Deep Analysis | `deepseek-v4-pro` | Reasoning depth for complex architectures |
| Pattern Extraction | `deepseek-v4-pro` | Identifying abstractions and patterns |
| Architecture | `claude-3.5-sonnet` | Structural understanding |
| Survey/Trending | `kimi-k2.5` | Speed and context window |
| Security Patterns | `claude-3.5-sonnet` | Security expertise |

## Model Detection

Codex automatically logs the model being used for each analysis. The skill includes model detection that:
1. Logs environment variables at script startup
2. Checks config.yaml default if env vars not set
3. Reports the actual model in output metadata
4. Validates per-job model selection is working

This ensures the dispatcher's multi-model routing is functioning correctly.

## Output Format

All reports go to:
- Patterns: `~/command_center/artefacts/codex/patterns/{category}_{timestamp}.md`
- Recommendations: `~/command_center/artefacts/codex/recommendations/{target_agent}_{timestamp}.md`
- Knowledge Base: `~/command_center/knowledge/codex/{category}_patterns.json`

## Integration with Other Agents

Codex feeds intelligence into:
- **Mason**: Architecture patterns and code organization
- **Keystone**: Technical standards and best practices
- **Prism**: Testing patterns and strategies
- **Bastion**: Security patterns and hardening approaches
- **Forge**: Implementation patterns and techniques

## Typical Workflow

1. **Codex** surveys category (2-3 hours)
2. **Codex** generates pattern report
3. **Mason/Keystone** reviews recommendations
4. **Target Agents** update manifests with new patterns

## Commands

```
@Codex survey [category]
@Codex analyze [repo_url]
@Codex recommend [target_agent]
@Codex report [category]
```

## Notes

- Always respect rate limits when calling GitHub API
- Cache results to avoid repeated analysis
- Cross-reference findings with multiple sources
- Update knowledge base incrementally
