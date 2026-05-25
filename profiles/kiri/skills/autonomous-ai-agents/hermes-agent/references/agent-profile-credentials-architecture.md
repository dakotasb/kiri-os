# Agent Profile Credentials Architecture

## Overview

Hermes Agent profiles use a **three-layer credential system** for API authentication:

1. **Environment Variables** (`.env` file) — Required for CLI dispatch
2. **Credential Pool** (`auth.json`) — Required for gateway runtime
3. **Config References** (`config.yaml`) — References to env vars

All three must be consistent for an agent to authenticate successfully.

---

## The Three Layers

### Layer 1: Environment Variables (`.env`)

**Location:** `~/.hermes/profiles/<profile>/.env`

**Purpose:** Provides API keys to the shell environment when dispatching agents via CLI

**Required for:** `hermes -p <profile> chat -q "..."`

**Example:**
```bash
# ~/.hermes/profiles/forge/.env
GATEWAY_ALLOW_ALL_USERS=true
OLLAMA_API_KEY=14424e57a46e405d88d09a0e10d41140.K4gIdsRCYu8zlCG3CYje_QNH
```

### Layer 2: Credential Pool (`auth.json`)

**Location:** `~/.hermes/profiles/<profile>/auth.json`

**Purpose:** Stores credential pool for multi-key rotation and gateway runtime

**Required for:** Gateway-connected agents (Discord, Telegram, etc.)

**Example:**
```json
{
  "version": 1,
  "credential_pool": {
    "ollama-cloud": [
      {
        "label": "OLLAMA_API_KEY",
        "auth_type": "api_key",
        "source": "env:OLLAMA_API_KEY",
        "access_token": "14424e57a46e405d88d09a0e10d41140.K4gIdsRCYu8zlCG3CYje_QNH",
        "base_url": "https://ollama.com/v1"
      }
    ]
  }
}
```

### Layer 3: Config References (`config.yaml`)

**Location:** `~/.hermes/profiles/<profile>/config.yaml`

**Purpose:** References to credential sources via `${ENV_VAR}` syntax

**Example:**
```yaml
model:
  provider: custom
  model: kimi-k2.5
  base_url: https://ollama.com/v1
  api_key: ${OLLAMA_API_KEY}  # References .env value
temperature: 0.7
```

---

## Failure Patterns

### Pattern 1: Missing `.env` File

**Symptom:**
```
Error: unauthorized
HTTP 401: unauthorized
```

**Root cause:** Profile has `auth.json` (copied from another profile) but no `.env` file

**Detection:**
```bash
for p in ~/.hermes/profiles/*; do
  [ ! -f "$p/.env" ] && echo "Missing .env: $(basename $p)"
done
```

**Fix:**
Create `.env` file with required keys:
```bash
# Template for new .env
cat > ~/.hermes/profiles/<profile>/.env << 'EOF'
GATEWAY_ALLOW_ALL_USERS=true
OLLAMA_API_KEY=<correct-key-from-kiri>
EOF
```

### Pattern 2: Stale API Key in `.env`

**Symptom:** Same as above — HTTP 401 errors

**Root cause:** Profile has `.env` but with an expired/invalid key

**Detection:** Compare keys across profiles
```bash
grep OLLAMA_API_KEY ~/.hermes/profiles/*/env 2>/dev/null | sort | uniq -c
```

**Fix:** Standardize on the master key (usually from `~/.hermes/` or `~/.hermes/profiles/kiri/.env`)

### Pattern 3: Wrong Key Format

**Symptom:** HTTP 401 despite key being present

**Root cause:** Environment has different key than credential pool

**Example:**
- `.env` has: `OLLAMA_API_KEY=14424e46-3f53-4b7b-8f04-d4d31bed_QNH` (old)
- `auth.json` has: `14424e57a46e405d88d09a0e10d41140.K4gIdsRCYu8zlCG3CYje_QNH` (new)

**Fix:** Ensure both `.env` and `auth.json` have the same key

---

## Bulk Fix Procedure

When multiple profiles are missing credentials or have wrong keys:

### Step 1: Identify the Master Key

The working key is usually in:
- `~/.hermes/.env` (default profile)
- `~/.hermes/profiles/kiri/.env` (orchestrator)
- The most recently created/used profile

```bash
# Extract the working key
grep OLLAMA_API_KEY ~/.hermes/profiles/kiri/.env | cut -d= -f2
```

### Step 2: Find Missing Profiles

```python
import os
import glob

profiles_missing_env = []
for profile_dir in glob.glob('/home/user/.hermes/profiles/*/):
    if not os.path.exists(f"{profile_dir}/.env"):
        profiles_missing_env.append(os.path.basename(profile_dir))

print(f"Missing .env: {profiles_missing_env}")
```

### Step 3: Bulk Create `.env` and `auth.json`

```python
import os
import json

CORRECT_KEY = "your-key-here"
MASTER_AUTH_JSON_PATH = "/home/user/.hermes/profiles/kiri/auth.json"

with open(MASTER_AUTH_JSON_PATH, 'r') as f:
    master_auth = f.read()

for profile in profiles_missing_env:
    profile_path = f"/home/user/.hermes/profiles/{profile}"
    
    # Create .env
    env_content = f"""GATEWAY_ALLOW_ALL_USERS=true
OLLAMA_API_KEY={CORRECT_KEY}
"""
    with open(f"{profile_path}/.env", 'w') as f:
        f.write(env_content)
    
    # Copy auth.json
    with open(f"{profile_path}/auth.json", 'w') as f:
        f.write(master_auth)
    
    print(f"Fixed: {profile}")
```

### Step 4: Restart Affected Agents

Agents must be restarted to pick up new credentials:

```bash
# If running via systemd
systemctl --user restart hermes-<profile>

# Or if running via tmux/screen
hermes -p <profile> gateway restart
```

---

## Verification

### Test Individual Agent

```bash
export OLLAMA_API_KEY="<correct-key>"
hermes -p <profile> chat -q "Confirm you are operational" -Q
```

Expected: Agent responds with status confirmation
Failure: "Error: unauthorized" or timeout

### Test All Agents

See `scripts/test-agent-dispatch.py` in the hermes-agent skill for automated testing.

---

## Best Practices

1. **Create `.env` at profile creation time** — Don't wait for auth errors
2. **Copy `auth.json` from a working profile** — Ensures credential pool consistency
3. **Use `GATEWAY_ALLOW_ALL_USERS=true`** — Prevents pairing code issues
4. **Standardize on one master key** — Don't mix multiple API keys across profiles
5. **Document the master key location** — Usually `~/.hermes/profiles/kiri/.env`

---

## Related Files

- `templates/fix-profile-configs.py` — Python script for bulk fixing
- `references/gateway-restart-safety.md` — Safe gateway restart procedures
- `session-2026-05-15-config-structure-fix.md` — Config structure debugging
