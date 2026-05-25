# Session: Agent Config Structure Fix - 2026-05-15

## Problem Summary

36 Hermes agent profiles had **flat config structure** causing "unauthorized" errors when dispatching via CLI.

## Root Cause

Config keys at root YAML level instead of nested under `model:`:

```yaml
# WRONG (flat)
api_key: ${OLLAMA_API_KEY}
base_url: https://ollama.com/v1
model: kimi-k2.5
provider: custom

# CORRECT (nested)
model:
  provider: custom
  model: kimi-k2.5
  base_url: https://ollama.com/v1
  api_key: ${OLLAMA_API_KEY}
```

## Env Var Discovery

**Critical finding:** Gateway and CLI use **different auth mechanisms**:

| Context | Uses | Key Source |
|---------|------|------------|
| Gateway | `AUXILIARY_APPROVAL_API_KEY`, `AUXILIARY_VISION_API_KEY`, etc. | Environment (loaded by gateway process) |
| CLI dispatch | `OLLAMA_API_KEY` | Must be in `~/.hermes/.env` |

**Issue:** `OLLAMA_API_KEY` was empty/undefined despite AUXILIARY_* keys being set.

## Fix Applied

1. Restructured all 36 profiles from flat to nested config
2. Added `OLLAMA_API_KEY=14424e57a46e405d88d09a0e10d41140.K4gIdsRCYu8zlCG3C_QNH` to `~/.hermes/.env`
3. Backed up originals to `config.yaml.backup`

## Verification

```bash
# Check if fixed
hermes -p <agent> chat -q "Test" -Q

# Should succeed (no "unauthorized" error)
```

## Bulk Fix Script

See `templates/fix-profile-configs.py` for the script used to fix all profiles.

## Files Modified

- `~/.hermes/.env` - Added OLLAMA_API_KEY
- `~/.hermes/profiles/*/config.yaml` - Restructured 36 profiles
- `~/.hermes/profiles/*/config.yaml.backup` - Backups created

## Learnings

1. Always backup before bulk config changes
2. Gateway and CLI have separate auth flows
3. Config structure validation is strict - flat keys fail silently or with "unauthorized"
4. Env var `${VAR}` syntax works in YAML but shell must have var defined
