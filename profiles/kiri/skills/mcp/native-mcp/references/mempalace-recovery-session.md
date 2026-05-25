# MemPalace Recovery Session: What Went Wrong and How We Fixed It

**Session Date:** 2026-05-14  
**Problem:** MCP server stopped working; 35 agents lost memory access  
**Root Cause Chain:** Docker stopped → MCP container failed to restart → Environment variable mismatch

## Failure Timeline

| Time | Event | Evidence |
|------|-------|----------|
| May 3-11 | ✅ MCP working | "registered 30 tool(s)" in logs |
| May 13 22:47 | ❌ Connection failed | "Connect call failed ('127.0.0.1', 3100)" |
| May 13 23:16 | ❌ Docker dead | "failed to connect to the docker API" |
| May 14 07:10 | ✅ Reconnected | "registered 26 tool(s)" after manual fix |

## The Critical Bug

**Environment Variable Mismatch:**

Hermes configuration expected one variable, but server needed another:

```yaml
# docker-compose.yml (WRONG)
environment:
  MCP_HTTP: "true"        # Hermes wrote this
  
# But mcpServer.js checks (CORRECT)
if (process.env.MCP_TRANSPORT === 'http')  # Server reads this
```

**Result:** Server always started in STDIO mode, ignored MCP_PORT, gateway couldn't connect.

## Recovery Steps Performed

### Step 1: Start Docker
```bash
sudo dockerd        # Or: sudo service docker start
docker ps           # Verify qdrant, neo4j are running
```

### Step 2: Fix Environment Variable Bug

In `~/mempalace/docker-compose.yml` line 47:
```diff
- MCP_HTTP: "true"
+ MCP_TRANSPORT: "http"
```

**Why:** The server code branch:
```javascript
if (process.env.MCP_TRANSPORT === 'http') {
    await startHTTP();     // Port 3100 mode
} else {
    await startStdio();    // stdin/stdout mode (default)
}
```

### Step 3: Manual Startup (Workaround Until Docker Rebuild)

Since Docker build times out on large model files, ran directly:

```bash
cd ~/mempalace/src
export MCP_TRANSPORT=http      # Critical variable
export MCP_PORT=3100
export QDRANT_URL=http://localhost:6333
export NEO4J_URL=bolt://localhost:7687
export NEO4J_USER=neo4j
export NEO4J_PASSWORD=mempalace

node src/mcpServer.js  # Leaves running in foreground
```

**Verification:**
```bash
curl http://localhost:3100/health   # Should return {"status":"ok"}
```

### Step 4: Restart Hermes Gateway

**Critical Timing:** MCP server MUST be running BEFORE gateway restart.

```bash
# Terminal 1: MCP running (from Step 3)
# Terminal 2: Restart gateway
pkill -f "hermes gateway"
sleep 2
hermes gateway restart
```

**Verify in logs:**
```bash
grep "mcp.*registered.*tool" ~/.hermes/logs/agent.log
# Should see: "MCP server 'mempalace' (HTTP): registered 26 tool(s)"
```

## Testing the Fix

### Diary Write Test
```bash
# Using MCP tool directly
mcp_mempalace_mempalace_diary_write {
    "agent_name": "Kiri0001",
    "entry": "MCP restored successfully...",
    "session_id": "20260514_071000",
    "topic": "mempalace-restoration"
}
```

**Result:** ✅ Success
```json
{
  "success": true,
  "entry_id": "diary_wing_kiri0001_20260514121229._ee2813e7",
  "timestamp": "2026-05-14T12:12:29.122Z"
}
```

### Diary Read Test
```bash
mcp_mempalace_mempalace_diary_read {
    "agent_name": "Kiri0001",
    "last_n": 1
}
```

**Result:** ✅ Returned the entry just written.

## Lessons Learned

### For Future Docker Outages

1. **Always check env vars match** between docker-compose.yml and server code
2. **Start MCP before gateway** — gateway gives up after 3 connection attempts
3. **Use manual Node.js startup** as workaround when Docker builds timeout
4. **Monitor logs for "registered" message** — that's the confirmation

### Common Restart Failures to Avoid

| Issue | Symptom | Fix |
|-------|---------|-----|
| Port not free | "EADDRINUSE" | `pkill -f "mcpServer"` before restart |
| Wrong transport mode | "MemPalace MCP Server (stdio)" | Export `MCP_TRANSPORT=http` |
| Gateway started first | "failed initial connection after 3 attempts" | Restart gateway AFTER MCP |
| Zombie processes | Multiple node processes, port conflict | `lsof -i :3100`, then kill |

## Related Files

- `~/mempalace/docker-compose.yml` — Fixed line 47
- `~/mempalace/src/src/mcpServer.js` — Transport logic at line 1936
- `~/.hermes/config.yaml` — mcp_servers config (correct)
- Saved documentation: `~/kiri/docs/mempalace-mcp-fix.md`
