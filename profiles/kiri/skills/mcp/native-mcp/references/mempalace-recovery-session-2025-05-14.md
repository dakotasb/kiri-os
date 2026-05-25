# MemPalace Recovery Session - 2025-05-14

## Incident Summary

**Duration:** Multi-day outage (May 10-14, 2025)  
**Root Cause:** Docker daemon stopped + environment variable mismatch prevented MCP auto-recovery  
**Resolution:** Manual MCP server start with correct env vars + gateway restart

## Timeline of Failure

| Date/Time | Event | Evidence |
|-----------|-------|----------|
| May 10 23:02 | Last successful MCP registration | `~/.hermes/config.yaml` modification time |
| May 13 22:47 | Docker died, MCP containers stopped | Errors: "Connect call failed ('127.0.0.1', 3100)" |
| May 13 22:51 | Auto-restart failed | Docker recovered but MCP container didn't start (env var bug) |
| May 14 07:10 | Manual recovery initiated | Started MCP with `MCP_TRANSPORT=http` |
| May 14 07:10:44 | Gateway reconnected | "registered 26 tool(s)" in logs |

## Symptoms

### User Reports
- "No diary entries being written"
- "Haven't seen mempalace accessed in some time"
- "Agents used to use mempalace before"

### Log Evidence
```
WARNING tools.mcp_tool: MCP server 'mempalace' initial connection failed (attempt 3/3)
WARNING tools.mcp_tool: Failed to connect: [Errno 111] Connect call failed ('127.0.0.1', 3100)
```

## Recovery Procedure

### Step 1: Verify Services
```bash
# Check if Docker is running
docker ps

# Check if MemPalace containers exist
docker-compose ps
# Expected: mempalace-qdrant (Up), mempalace-neo4j (Up), mempalace-server (missing/failed)
```

### Step 2: Fix Environment Variable Bug

**Problem:** `docker-compose.yml` sets `MCP_HTTP: "true"` but code checks `process.env.MCP_TRANSPORT === 'http'`

**Fix (in mempalace/docker-compose.yml):**
```yaml
# BEFORE (broken):
environment:
  MCP_HTTP: "true"

# AFTER (fixed):
environment:
  MCP_TRANSPORT: "http"
```

### Step 3: Manual Start (Workaround for Docker Build Issues)

When `docker-compose up -d --build` times out (embedding model downloads are huge):

```bash
cd ~/mempalace/src
export MCP_TRANSPORT=http
export MCP_PORT=3100
export QDRANT_URL=http://localhost:6333
export NEO4J_URL=bolt://localhost:7687
export NEO4J_USER=neo4j
export NEO4J_PASSWORD=mempalace
export LOG_LEVEL=info

node src/mcpServer.js
# Output: "MemPalace MCP Server (http) listening on port 3100"
```

**Critical:** Must set `MCP_TRANSPORT=http`, not just `MCP_PORT=3100`

### Step 4: Verify MCP is Responding
```bash
curl -s http://localhost:3100/health
# Expected: {"status":"ok"}

# Also verify stdio vs http mode
curl -s http://localhost:3100/mcp
# Expected: {"error":"Missing or invalid session"} (proves HTTP mode working)
```

### Step 5: Restart Hermes Gateway

**IMPORTANT:** Must restart WHILE MCP is running. If restarted when MCP is down, gateway retries 3 times then gives up.

```bash
# Terminal 1: Keep MCP running (from Step 3)
# Terminal 2: Restart gateway

pkill -f "hermes gateway"
sleep 2
hermes gateway restart
```

### Step 6: Verify Reconnection

Check logs for successful registration:
```bash
grep "mcp_tool" ~/.hermes/logs/gateway.log | tail -3
# Expected: "INFO tools.mcp_tool: MCP server 'mempalace' (HTTP): registered 26 tool(s)"
```

### Step 7: Functional Test

Write a diary entry to verify end-to-end:
```
Use tool: mcp_mempalace_mempalace_diary_write
Parameters:
  agent_name: "Kiri0001"
  entry: "MCP recovery test"
  session_id: "2025-05-14_test"
  topic: "recovery-verification"

Expected result: {"success": true, "entry_id": "..."}
```

## Prevention Checklist

- [ ] Add Docker daemon to system startup
- [ ] Fix docker-compose.yml env var (MCP_HTTP → MCP_TRANSPORT)
- [ ] Consider systemd service for MCP server
- [ ] Monitor diary entry frequency (alerts if no entries for 24h)

## Key Configuration Locations

| File | Purpose |
|------|---------|
| `~/.hermes/config.yaml` | Gateway MCP client configuration |
| `~/mempalace/docker-compose.yml` | Container environment variables |
| `~/mempalace/src/src/mcpServer.js` | Server code with transport logic (line 1936) |

## Related Session Notes

- Architecture comparison: `mempalace-architecture-advantages.md`
- Environment variable fix: `mempalace-env-mismatch.md`
- Fork investigation: `mempalace-fork-notes.md`
