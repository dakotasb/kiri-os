---
name: infrastructure-health-auditor
description: Audit agent infrastructure health by checking if services are actually running, if configurations are wired correctly, and if the system is being used. Detects 'zombie infrastructure' where components exist but aren't functional or connected.
triggers:
  - "audit if agents are using memory"
  - "check if infrastructure is actually working"
  - "why aren't agents writing to mempalace"
  - "verify MCP tools are accessible"
  - "diagnose silent infrastructure failures"
  - "docker containers running but no activity"
  - "agents have zero log entries"
  - "check if system is actually operational"
  - "zombie infrastructure"
  - "services up but no usage"
tags: [infrastructure-audit, health-check, diagnostics, zombie-detection, MCP-verification, docker-health]
version: 1.0.0
---

# Infrastructure Health Auditor

Detect "zombie infrastructure" — components that exist but aren't functional or being used by agents.

## When To Use

- Agents should be using memory but diary entries aren't appearing
- Services "should be" running but no log activity
- Infrastructure deployed but suspiciously quiet
- Suspect configuration mismatch (services up but not wired correctly)
- Need to verify end-to-end functionality from config → service → agent → usage

## The Zombie Infrastructure Pattern

**Definition:** Services/containers/processes that are technically "running" but:
- No agent has ever called them
- No logs of actual usage
- Configuration exists but not wired to consumers
- Deployed but disconnected from the workflow

**Common Symptoms:**
- Docker containers running for days with zero log entries
- MCP server responds to health checks but no tool calls
- Config files exist but profiles don't reference them
- Agents work "fine" but never persist or recall memories

## Audit Procedure

### Phase 1: Service Health (Infrastructure Layer)

```bash
# Docker status
docker ps --filter "name=mempalace" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Expected: 3 containers (qdrant, neo4j, server)
# Zombie signal: Containers "Up 5 days" but "0 tool calls"

# Port accessibility
curl -s http://localhost:3100/mcp | jq '.tools | length'  # Should be >0
curl -s http://localhost:6333/collections | jq '.collections | length'

# Zombie signal: Ports respond but with 0 tools/collections
```

### Phase 2: Configuration Wiring (Integration Layer)

```bash
# Check main config has MCP servers
grep -A2 "mcp_servers:" ~/.hermes/config.yaml

# Check if agents ACTUALLY inherit MCP tools
find ~/.hermes/profiles -name "config.yaml" -exec grep -l "mcp_servers:" {} \; | wc -l
# Zombie signal: 0 profiles with mcp_servers even though main config has it

# Verify tool availability in agent sessions
ls ~/.hermes/profiles/horizon/sessions/session_*.json | head -1 | xargs jq '.tools'
# Zombie signal: Tools list has no "mcp_" prefixed tools
```

### Phase 3: Activity Verification (Usage Layer)

```bash
# Search logs for ANY mempalace calls
grep -r "mempalace" ~/.hermes/logs/ 2>/dev/null | wc -l
# Zombie signal: 0 matches across all logs

# Check Qdrant collections for recent writes
ls -lt ~/.hermes/data/qdrant/collections/*/snapshots/ | head -5
# Zombie signal: Last write was days/weeks ago

# Check Neo4j knowledge graph activity
tail -100 ~/.mempalace/data/neo4j/logs/debug.log
# Zombie signal: Only heartbeat logs, no queries

# Session-level tool call analysis
find ~/.hermes/profiles -name "session_*.json" -exec jq -r '.messages[].tool_calls?[]?.tool.name' {} \; | grep -c "mcp_"
# Zombie signal: 0 MCP tool calls across all sessions
```

## Diagnostic Findings

### Finding 1: Docker Not Running

```bash
docker ps
# Error: Cannot connect to Docker daemon
```
**Fix:** `sudo dockerd &` or `sudo service docker start`

### Finding 2: Containers Not Started

```bash
docker ps | grep mempalace
# Empty (no containers)
```
**Fix:** `cd ~/mempalace && docker compose up -d`

### Finding 3: MCP Tools Not in Profiles

```bash
# Main config has mcp_servers
grep "mcp_servers:" ~/.hermes/config.yaml
# > mcp_servers:
# >   mempalace:
# >     url: http://localhost:3100/mcp

# But profiles don't
grep "mcp_servers:" ~/.hermes/profiles/*/config.yaml | wc -l
# > 0
```
**Problem:** Main config's `mcp_servers` doesn't trickle down to agent profiles.

**Fix:** Add to each profile's config.yaml:
```yaml
mcp_servers:
  mempalace:
    url: http://localhost:3100/mcp
```

### Finding 4: Agents Exist But Never Call Tools

```bash
# Count MCP tool calls in all sessions
find ~/.hermes/profiles -name "session_*.json" | xargs -I{} sh -c '
  jq -r ".tools[]? | select(startswith(\"mcp_\"))" {} | wc -l'
# Sum: 0

# Check if agents even KNOW about MCP tools
jq '.tools | map(select(startswith("mcp_")))' ~/.hermes/profiles/sentinel/sessions/session_*.json | head -1
# > []
```
**Problem:** Agents don't have MCP tools in their tool list at all.

**Root Cause:** `hermes gateway` restart needed after adding mcp_servers to profiles.

**Fix:**
```bash
# Stop gateway
pkill -f "hermes gateway"

# Restart with fresh config
hermes gateway

# Verify: Check new session has mcp tools
```

## Automated Audit Report

Generate comprehensive health report:

```bash
#!/bin/bash
# audit-infrastructure.sh

echo "=== Infrastructure Health Audit ==="
echo ""

# Phase 1: Docker
echo "Phase 1: Docker Infrastructure"
if ! docker ps >/dev/null 2>&1; then
    echo "  ❌ Docker daemon NOT RUNNING"
    echo "  Fix: sudo dockerd &"
else
    echo "  ✅ Docker running"
    CONTAINERS=$(docker ps --filter "name=mempalace" --format "{{.Names}}" | wc -l)
    if [ "$CONTAINERS" -eq 0 ]; then
        echo "  ❌ No mempalace containers"
        echo "  Fix: cd ~/mempalace && docker compose up -d"
    else
        echo "  ✅ $CONTAINERS containers running"
    fi
fi

# Phase 2: Config Wiring
echo ""
echo "Phase 2: Configuration Wiring"
MAIN_MCP=$(grep -c "mcp_servers:" ~/.hermes/config.yaml 2>/dev/null || echo 0)
PROFILE_MCP=$(grep -l "mcp_servers:" ~/.hermes/profiles/*/config.yaml 2>/dev/null | wc -l)
TOTAL_PROFILES=$(ls ~/.hermes/profiles/*/config.yaml 2>/dev/null | wc -l)

if [ "$MAIN_MCP" -gt 0 ] && [ "$PROFILE_MCP" -eq 0 ]; then
    echo "  ⚠️  Main config has MCP but $PROFILE_MCP/$TOTAL_PROFILES profiles have it"
    echo "  Fix: Add mcp_servers to agent profiles"
elif [ "$PROFILE_MCP" -eq "$TOTAL_PROFILES" ]; then
    echo "  ✅ All $TOTAL_PROFILES profiles have MCP config"
else
    echo "  ⚠️  $PROFILE_MCP/$TOTAL_PROFILES profiles have MCP config"
fi

# Phase 3: Activity
echo ""
echo "Phase 3: Usage Activity"
MEMPALACE_LOGS=$(grep -r "mempalace_" ~/.hermes/logs/*.log 2>/dev/null | wc -l)
if [ "$MEMPALACE_LOGS" -eq 0 ]; then
    echo "  ❌ Zero mempalace calls in logs"
    echo "  Fix: Restart gateway after adding MCP config"
elif [ "$MEMPALACE_LOGS" -lt 10 ]; then
    echo "  ⚠️  Only $MEMPALACE_LOGS mempalace calls in logs (low activity)"
else
    echo "  ✅ $MEMPALACE_LOGS mempalace calls logged"
fi

# Phase 4: Tool Availability
echo ""
echo "Phase 4: Tool Availability Check"
LATEST_SESSION=$(ls -t ~/.hermes/profiles/*/sessions/session_*.json 2>/dev/null | head -1)
if [ -n "$LATEST_SESSION" ]; then
    MCP_TOOLS=$(jq -r '.tools[]? | select(startswith("mcp_"))' "$LATEST_SESSION" 2>/dev/null | wc -l)
    if [ "$MCP_TOOLS" -eq 0 ]; then
        echo "  ❌ Latest session ($LATEST_SESSION) has NO MCP tools"
        echo "  Fix: hermes gateway restart required"
    else
        echo "  ✅ Latest session has $MCP_TOOLS MCP tools available"
    fi
else
    echo "  ⚠️  No sessions found"
fi

echo ""
echo "=== Audit Complete ==="
```

## Real-World Example

**Session:** 2026-05-13, user with 35 agents, mempalace "should be working"

**Audit Results:**

| Layer | Finding | Status |
|-------|---------|--------|
| Docker | Daemon not running | ❌ CRITICAL |
| Containers | All 3 stopped | ❌ CRITICAL |
| Main Config | mcp_servers present | ✅ OK |
| Profile Config | 0/36 have mcp_servers | ❌ CRITICAL |
| Tool Availability | No mcp_* tools in sessions | ❌ CRITICAL |
| Log Activity | 0 matches across 16,451 lines | ❌ CRITICAL |
| Data Files | Last write May 13 08:20 | ⚠️ STALE |

**Conclusion:** Full zombie infrastructure — deployed once, never wired to agents, services died, zero usage.

## Remediation Priority

1. **CRITICAL (P0):** Docker/Containers — Nothing works without these
2. **HIGH (P1):** Profile Config — Agents need mcp_servers declared
3. **HIGH (P1):** Gateway Restart — Pick up new config
4. **MEDIUM (P2):** Validation — Confirm tools appear in sessions

## Prevention

Add health checks to startup:

```bash
# Add to ~/.bashrc or crontab
docker ps | grep -q mempalace || echo "⚠️  MemPalace containers not running"
```

Weekly audit:
```bash
# In crontab
0 9 * * 1 ~/kiri/scripts/audit-infrastructure.sh | tee -a ~/infrastructure-health.log
```

## Related Skills

| Skill | Use When |
|-------|----------|
| `hermes-profile-creation` | Adding mcp_servers to profiles |
| `multi-repo-parent-structure` | Managing service dependencies |
| `intelligence-degradation-detection` | Monitoring agent performance |
| `delegation-troubleshooting` | Fixing agent dispatch issues |

---

v1.0.0 — Zombie infrastructure detection and remediation