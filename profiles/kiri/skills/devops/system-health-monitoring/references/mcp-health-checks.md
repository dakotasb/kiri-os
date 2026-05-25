# MCP Server Health Checks & Recovery

Session-specific reference for diagnosing and recovering MCP (Model Context Protocol) server connectivity issues, specifically for MemPalace.

## Architecture

```
Agent Request → MCP Server (port 3100) → Qdrant (port 6333) + Neo4j (port 7474)
```

## Common Failure: Environment Variable Mismatch

**Root Cause:** docker-compose.yml uses `MCP_HTTP: "true"` but code checks `process.env.MCP_TRANSPORT === 'http'`

**Symptoms:**
- MCP server starts but listens on stdin (stdio mode) instead of HTTP port 3100
- Gateway shows: `[Errno 111] Connect call failed ('127.0.0.1', 3100)`
- No "registered 30 tool(s)" message in logs

**Fix:**
```yaml
# In docker-compose.yml, change line 47:
- MCP_HTTP: "true"       # ❌ Wrong
+ MCP_TRANSPORT: "http"  # ✅ Correct
```

## Recovery Procedure

### Step 1: Verify Docker Daemon
```bash
docker ps  # Should list containers, not error
```

### Step 2: Check Container Status
```bash
cd ~/mempalace
docker-compose ps
# Should show: mempalace-qdrant (Up), mempalace-neo4j (Up), mempalace (Up)
```

### Step 3: Verify MCP Server HTTP Mode
```bash
# Check what's actually running
ss -tlnp | grep 3100

# Test health endpoint
curl http://localhost:3100/health
# Expected: {"status":"ok"}
```

### Step 4: Manual Start (if Docker build fails)
```bash
cd ~/mempalace/src
export MCP_TRANSPORT=http
export MCP_PORT=3100
export QDRANT_URL=http://localhost:6333
export NEO4J_URL=bolt://localhost:7687
export NEO4J_USER=neo4j
export NEO4J_PASSWORD=mempalace
node src/mcpServer.js
```

### Step 5: Restart Gateway
```bash
pkill -f "hermes gateway" && sleep 2
hermes gateway restart
# Watch for: "MCP server 'mempalace' (HTTP): registered 26 tool(s)"
```

## Verification Commands

```bash
# Full stack check
echo "=== MemPalace Stack ==="
curl -s http://localhost:3100/health | jq -r .status
curl -s http://localhost:6333/healthz | jq -r .status
docker-compose ps | grep -E "qdrant|neo4j|mempalace"

# Git gateway logs for MCP confirmation
grep "mcp_mempalace" ~/.hermes/logs/agent.log | tail -3
```

## Agent Delegation Pattern

When agents fail to use MemPalace:
1. Assign to `@archivist` or `@system-health-auditor` (has permission to diagnose infrastructure)
2. If infrastructure issue: diagnose with terminal commands above
3. If configuration issue: escalate to Keystone for arch decisions
4. Document fix in MemPalace diary for pattern learning

## Key Lesson

**Environment variable naming matters.** Even when Docker sets `MCP_HTTP=true`, if the code checks `MCP_TRANSPORT === 'http'`, the server defaults to stdio mode. This creates a silent failure where the container starts but doesn't listen on the expected HTTP port.

Always verify with:
```bash
ps aux | grep mcpServer   # Check process
ss -tlnp | grep 3100      # Check port binding
curl localhost:3100/health # Test connectivity
```

## References

- Session: 2026-05-14, dakotasb/Kiri restoration
- Fixed in: ~/mempalace/docker-compose.yml line 47
- Related docs: ~/kiri/docs/mempalace-mcp-fix.md
