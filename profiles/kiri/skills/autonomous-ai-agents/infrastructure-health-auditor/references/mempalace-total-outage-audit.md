# Session-Based Infrastructure Audit: MemPalace Total Outage

## Session Context
**Date:** 2026-05-13  
**User:** Dakota (35-agent fleet)  
**System:** MemPalace with Qdrant + Neo4j  
**Expected:** Agents writing diaries, recalling memories, using illuminate

## Discovery

User asked: *"check if our system is optimally using our unique mempalace setup at all. I don't think any agents including you have touched it in some time I'm not seeing diary entries or anything storing."*

## Audit Results

### Container Status
```bash
docker ps | grep mempalace
# Result: Cannot connect to Docker daemon
```
**Status:** ❌ Docker daemon not running

### Service Health
```bash
curl http://localhost:3100/mcp
curl http://localhost:6333/collections  
curl http://localhost:7474/
# All: Connection refused
```
**Status:** ❌ All services unreachable

### Configuration Wiring
```bash
# Main Hermes config
grep "mcp_servers:" ~/.hermes/config.yaml
# Result: Present (lines 303-304)

# Agent profile configs  
grep "mcp_servers:" ~/.hermes/profiles/*/config.yaml | wc -l
# Result: 0 (out of 36 profiles)
```
**Status:** ⚠️ Main config has MCP but no profiles inherit it

### Tool Availability in Sessions
```bash
# Checked session: sentinel/session_20260511_135826_e58de9.json
jq '.tools | map(select(startswith("mcp_")))' session.json
# Result: []
```
**Status:** ❌ Zero MCP tools in agent session data

### Log Analysis
```bash
# Searched: ~/.hermes/logs/agent.log (11,123 lines)
# Searched: ~/.hermes/logs/errors.log (5,428 lines)
# Pattern: "mempalace", "illuminate", "diary", "mcp_mempalace"
# Result: 0 matches
```
**Status:** ❌ No evidence of mempalace usage ever

### Data Files
```bash
# Qdrant collections: 14 found
ls ~/.mempalace/data/qdrant/collections/
# Last modification: May 13, 08:20 UTC (~15 hours prior)

# Neo4j: Present and sized
ls -lh ~/.mempalace/data/neo4j/databases/neo4j/*store*
```
**Status:** ✅ Data exists but stale (last write 15 hours ago)

## Root Causes Identified

### Cause 1: Docker Infrastructure Failure (P0)
- Docker daemon completely stopped
- All 3 containers (qdrant, neo4j, mempalace-server) offline
- Services unavailable on any port

### Cause 2: MCP Profile Wiring Gap (P1)
- Main `~/.hermes/config.yaml` has `mcp_servers.memlpalace` defined
- BUT: Zero agent profiles declare `mcp_servers`
- Hermes `delegation.inherit_mcp_toolsets: true` does NOT propagate
- Result: Agents never get MCP tools in their function list

### Cause 3: Gateway Never Picked Up Config (P1)
- Even if profiles had mcp_servers, gateway started before config changes
- Sessions show no MCP tools available
- Requires gateway restart after profile updates

## Evidence Preservation

**Log Excerpt from agent.log:**
```
# Shows normal Hermes operations
# But NO mempalace calls, NO illuminate, NO diary writes
# Pattern: browser_*, execute_code, memory, skill_*
# Total mempalace occurrences: 0
```

**Session JSON Excerpt:**
```json
{
  "tools": [
    "browser_back",
    "browser_click",
    "delegate_task",
    "execute_code",
    "memory",
    "skill_manage",
    "terminal",
    "write_file"
    // ... 33 tools total
    // ZERO mcp_* tools
  ]
}
```

## Remediation Applied

### Step 1: Restart Docker (Not executed - user to approve)
```bash
sudo dockerd &
cd ~/mempalace && docker compose up -d
```

### Step 2: Add MCP to Profiles (Recommended)
```bash
for profile in ~/.hermes/profiles/*/config.yaml; do
    if ! grep -q "mcp_servers:" "$profile"; then
        cat >> "$profile" << 'EOF'

mcp_servers:
  mempalace:
    url: http://localhost:3100/mcp
EOF
    fi
done
```

### Step 3: Gateway Restart (Required)
```bash
pkill -f "hermes gateway"
hermes gateway
```

## Lesson: Zombie Infrastructure Detection

This session revealed **perfect zombie infrastructure**:
- ✅ Services "should be running" (installed, configured)
- ❌ Actually running (Docker dead)
- ❌ Configured for access (profiles lack mcp_servers)
- ❌ Being used by agents (zero log entries)
- ✅ Data exists but stale

**Red Flags:**
1. "I think agents should be using memory but I don't see activity"
2. Confidence in "should be working" without verification
3. Long time since last manual touch of infrastructure

**Prevention:**
- Weekly automated health checks
- Session-level MCP tool verification
- Alert when log activity flatlines

## Skill Captured

This session led to creation of:
- `infrastructure-health-auditor` skill (general patterns)
- `hermes-profile-creation` MCP wiring reference (specific fix)

---
**Session ID:** Reference for `infrastructure-health-auditor` diagnostic examples
