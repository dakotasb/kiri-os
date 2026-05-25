# MCP Tool Wiring Requirements

## Discovery (2026-05-13)

**Issue:** MCP tools registered in main `~/.hermes/config.yaml` were NOT available to agents configured only at the main level.

**Root Cause:** Agents must explicitly declare `mcp_servers` in their individual profile `config.yaml` files. The main config's `mcp_servers` section and `delegation.inherit_mcp_toolsets: true` setting do NOT propagate MCP tool availability to agents.

## Required Pattern

### Wrong (Main Config Only)
```yaml
# ~/.hermes/config.yaml - DOES NOT WORK
mcp_servers:
  mempalace:
    url: http://localhost:3100/mcp

delegation:
  inherit_mcp_toolsets: true
```

### Correct (Profile-Level Required)
```yaml
# ~/.hermes/profiles/agent_name/config.yaml
mcp_servers:
  mempalace:
    url: http://localhost:3100/mcp
    # tools: [...]  # Optional: limit which tools
```

## Verification

```bash
# Check session JSON for MCP tools
ls ~/.hermes/profiles/<agent>/sessions/session_*.json | head -1 | xargs cat | jq '.tools'

# Should show mcp_mempalace_* tools, not just hermes-cli
```

## Batch Update Script

```bash
#!/bin/bash
# Add mcp_servers to all agent profiles

MCP_CONFIG='

# MCP Memory Server
mcp_servers:
  mempalace:
    url: http://localhost:3100/mcp'

for profile in ~/.hermes/profiles/*/config.yaml; do
    if ! grep -q "mcp_servers:" "$profile"; then
        echo "$MCP_CONFIG" >> "$profile"
        echo "Updated: $profile"
    fi
done
```

## Session Evidence

**Profile Configurations Checked:** 36 agent configs  
**With mcp_servers:** 0  
**Without mcp_servers:** 36  
**Result:** No agent could access `mcp_mempalace_*` tools

**Session Session JSON:** `~/.hermes/profiles/sentinel/sessions/session_20260511_135826_e58de9.json` showed 33 tools, zero MCP tools.

**Log Search:** 0 matches for "mempalace" across 16,451 lines (agent.log + errors.log)

## Recommendation

Always add `mcp_servers` section to agent profiles that need MCP tools. Do not rely on main config inheritance.
