# YAML Structure & Agent Dispatch Troubleshooting

## The Problem

Agent dispatch via `hermes -p <agent> chat -q "..." -Q` fails with "unauthorized" or silently for some models but works for others. The API key is valid — the issue is config YAML structure.

## The Discovery

Hermes requires **nested structure under `model:` section**, not flat root-level keys. Wrong structure causes provider to not load properly, leading to authentication failures.

## Wrong vs Correct Structure

### ❌ WRONG (Flat - Root Level)
```yaml
provider: custom
model: kimi-k2.5
base_url: https://ollama.com/v1
api_key: ${OLLAMA_API_KEY}
```
**Result:** Provider not loaded → "unauthorized" errors

### ✅ CORRECT (Nested Under `model:`)
```yaml
model:
  provider: custom
  model: kimi-k2.5
  base_url: https://ollama.com/v1
  api_key: ${OLLAMA_API_KEY}
```
**Result:** Provider loads correctly → dispatch works

## Symptoms of Wrong Structure

| Indicator | Correct | Wrong Structure |
|-----------|---------|-----------------|
| `hermes -p agent chat -q "..."` | Works | "unauthorized" |
| Direct API test to base_url | Works | "unauthorized" |
| Gateway mode (for Kiri etc.) | Works | Works (separate auth) |
| Provider detection in logs | "custom" | Missing/defaults to wrong provider |

## Debugging Steps

### 1. Check Current Config Structure

```bash
# Look at a failing agent
cat ~/.hermes/profiles/<agent>/config.yaml | head -20

# Check if nested or flat
# Correct: sees "model:" on its own line with indented children
# Wrong: sees "provider:" at column 0
```

### 2. Verify With API Test

```bash
# Test if the key works at the endpoint
curl -X POST https://ollama.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OLLAMA_API_KEY" \
  -d '{"model": "kimi-k2.5", "messages": [{"role": "user", "content": "Hi"}]}'

# If this works but dispatch doesn't = structure problem
```

### 3. Bulk Fix All Profiles

```python
#!/usr/bin/env python3
"""Fix YAML structure for Hermes profiles."""
from pathlib import Path
import shutil

profiles_dir = Path.home() / ".hermes" / "profiles"

for profile_dir in profiles_dir.iterdir():
    if not profile_dir.is_dir():
        continue
    
    config_path = profile_dir / "config.yaml"
    if not config_path.exists():
        continue
    
    # Backup original
    shutil.copy2(config_path, config_path.with_suffix(".yaml.backup"))
    
    content = config_path.read_text()
    lines = content.split("\n")
    
    # Check if already nested (has "model:" followed by indented children)
    is_nested = False
    for i, line in enumerate(lines):
        if line.strip() == "model:":
            # Check next non-empty line
            for j in range(i+1, len(lines)):
                if lines[j].strip():
                    if lines[j].startswith("  "):
                        is_nested = True
                    break
            break
    
    if is_nested:
        print(f"✅ {profile_dir.name}: already nested")
        continue
    
    # Extract root-level keys
    provider = "custom"
    model = ""
    base_url = ""
    api_key = ""
    
    for line in lines:
        for key in ["provider", "model", "base_url", "api_key"]:
            if line.startswith(f"{key}:"):
                val = line.split(":", 1)[1].strip()
                if key == "provider": provider = val
                if key == "model": model = val
                if key == "base_url": base_url = val
                if key == "api_key": api_key = val
    
    if not model:
        print(f"⚠️  {profile_dir.name}: no model found, skip")
        continue
    
    # Build nested structure
    new_lines = []
    added_model_section = False
    
    for line in lines:
        # Skip root-level model/provider/base_url/api_key
        if any(line.startswith(f"{k}:") for k in ["provider", "model", "base_url", "api_key"]):
            # Add model section once at the right place
            if not added_model_section:
                new_model_line = f"model:\n  provider: {provider}\n  model: {model}"
                if base_url:
                    new_model_line += f"\n  base_url: {base_url}"
                if api_key:
                    new_model_line += f"\n  api_key: {api_key}"
                new_lines.append(new_model_line)
                added_model_section = True
            continue
        new_lines.append(line)
    
    config_path.write_text("\n".join(new_lines))
    print(f"✅ {profile_dir.name}: converted to nested structure")

print("\nDone. Backups saved as .yaml.backup")
```

## Key Insight

The **same API key** works in gateway mode but fails in CLI dispatch mode when YAML is flat because:
- Gateway uses `AUXILIARY_*_API_KEY` env vars directly
- CLI dispatch reads from profile config.yaml
- If config.yaml has wrong structure, Hermes never loads the custom provider properly
- Result: auth request goes to wrong endpoint or with wrong headers

## Validation

After fixing, test with:
```bash
# Test previously failing agents
hermes -p sentinel chat -q "Say hello" -Q    # kimi-k2.5
hermes -p ember chat -q "Say hello" -Q       # claude-sonnet-4
hermes -p palette chat -q "Say hello" -Q     # kimi-k2.6 / claude fallback
```

All should now work with the same API key that was "unauthorized" before.
