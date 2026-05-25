# Ollama Cloud Model Mappings & Persona Optimization

## Invalid Model Names Fixed

| Invalid Format | Valid Ollama Cloud Model | Agents Updated |
|---------------|-------------------------|----------------|
| `deepseek-v4-pro` | `deepseek-v3-0324` | @codex, @ember, @forge, @horizon, @mason, @temper |
| `mistral-large-3:675b` | `mistral-large-3` | @archivist, @forgemaster, @hoard, @prism, @sentry, @vault |
| `qwen3.5:397b` | `qwen3:235b` | @harbor, @scale, @surge |
| `devstral-2:123b` | `deepseek-v3-0324` | @bastion, @scope |

## Valid Ollama Cloud Models

```python
VALID_OLLAMA_CLOUD_MODELS = [
    'kimi-k2.5',
    'kimi-k2.6',
    'claude-sonnet-4-20250514',
    'gemma-3-27b-it',
    'deepseek-v3-0324',
    'command-a',
    'mistral-large-3',
    'llama-4-maverick',
    'qwen3:235b'
]
```

## Persona-Based Model Assignments

### Coding/Technical Agents → `deepseek-v3-0324`
Strong reasoning for code generation, architecture analysis, technical implementation.

**Agents:** @codex, @forge, @mason, @temper, @ember, @bastion, @scope, @horizon

### Design/Creative Agents → `kimi-k2.6`
Optimized for creative tasks, visual design work, design system tasks.

**Agents:** @palette, @launchpad, @alloy

### Writing/Documentation Agents → `claude-sonnet-4-20250514`
Excellent writing quality, documentation, content creation.

**Agents:** @scribe, @chronicle, @quill

### Security/Monitoring Agents → `mistral-large-3`
Strong instruction following, good for security tasks, monitoring, enforcement.

**Agents:** @sentinel, @sentry, @watcher, @archivist, @prism, @forgemaster, @hoard, @vault

### Data/Storage Agents → `qwen3:235b`
Large context handling, good for data-intensive work.

**Agents:** @ledger, @harbor, @scale, @surge

### Orchestration/Coordination Agents → `kimi-k2.5`
Reliable, consistent responses for coordination tasks.

**Agents:** @kiri, @adjunct, @relay, @compass, @keystone, @relic, @vantage, @haven, @drift, @mediator

## Fallback Model Chains

```python
FALLBACK_CHAINS = {
    'deepseek-v3-0324': ['deepseek-v3-0324', 'kimi-k2.5', 'gemma-3-27b-it'],
    'kimi-k2.6': ['kimi-k2.6', 'kimi-k2.5', 'claude-sonnet-4-20250514'],
    'kimi-k2.5': ['kimi-k2.5', 'claude-sonnet-4-20250514', 'gemma-3-27b-it'],
    'claude-sonnet-4-20250514': ['claude-sonnet-4-20250514', 'kimi-k2.5', 'gemma-3-27b-it'],
    'mistral-large-3': ['mistral-large-3', 'kimi-k2.5', 'command-a'],
    'qwen3:235b': ['qwen3:235b', 'kimi-k2.5', 'gemma-3-27b-it'],
    'gemma-3-27b-it': ['gemma-3-27b-it', 'kimi-k2.5', 'command-a'],
    'command-a': ['command-a', 'kimi-k2.5', 'gemma-3-27b-it'],
    'llama-4-maverick': ['llama-4-maverick', 'kimi-k2.5', 'gemma-3-27b-it'],
}
```

## Configuration Format

```yaml
model:
  provider: custom
  model: <primary-model>
  base_url: https://ollama.com/v1
  api_key: ${OLLAMA_API_KEY}
  temperature: 0.7
  fallback_models:
    - <fallback-1>
    - <fallback-2>
```

## Distribution After Optimization

| Model | Count | Percentage |
|-------|-------|------------|
| `kimi-k2.5` | 10 | 27.8% |
| `mistral-large-3` | 8 | 22.2% |
| `deepseek-v3-0324` | 8 | 22.2% |
| `qwen3:235b` | 4 | 11.1% |
| `kimi-k2.6` | 3 | 8.3% |
| `claude-sonnet-4-20250514` | 3 | 8.3% |

## Bulk Update Script Pattern

```python
import yaml
import os

PROFILES_DIR = '/home/dakotasb/.hermes/profiles'

# Define mappings
MODEL_MAPPING = {
    'deepseek-v4-pro': 'deepseek-v3-0324',
    'mistral-large-3:675b': 'mistral-large-3',
    'qwen3.5:397b': 'qwen3:235b',
    'devstral-2:123b': 'deepseek-v3-0324',
}

PERSONA_MODELS = {
    'codex': 'deepseek-v3-0324',
    'forge': 'deepseek-v3-0324',
    # ... etc
}

FALLBACK_CHAINS = {
    'deepseek-v3-0324': ['deepseek-v3-0324', 'kimi-k2.5', 'gemma-3-27b-it'],
    # ... etc
}

for profile in os.listdir(PROFILES_DIR):
    config_path = f'{PROFILES_DIR}/{profile}/config.yaml'
    if not os.path.exists(config_path):
        continue
    
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    # Fix invalid model names
    current_model = config.get('model', {}).get('model', 'kimi-k2.5')
    if current_model in MODEL_MAPPING:
        config['model']['model'] = MODEL_MAPPING[current_model]
    
    # Add fallbacks
    current_model = config['model']['model']
    if current_model in FALLBACK_CHAINS:
        config['model']['fallback_models'] = FALLBACK_CHAINS[current_model][1:]
    
    # Write back
    with open(config_path, 'w') as f:
        yaml.dump(config, f, default_flow_style=False)
```
