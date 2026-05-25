# MemPalace Fork: MCP_TRANSPORT Environment Variable Mismatch

## Problem

The `mehmetkirkoca/MemPalace` fork uses `MCP_TRANSPORT=http` to enable HTTP mode, but the `docker-compose.yml` sets `MCP_HTTP: "true"` — which the code ignores.

## Code Evidence

File: `src/mcpServer.js` (line 1936)
```javascript
export async function main() {
  if (process.env.MCP_TRANSPORT === 'http') {
    await startHTTP();        // Port 3100
  } else {
    await startStdio();       // stdin/stdout
  }
}
```

## The Mismatch

| docker-compose.yml | Code Expects | Result |
|-------------------|--------------|--------|
| `MCP_HTTP: "true"` | `MCP_TRANSPORT` | Ignored, defaults to stdio |
| `MCP_PORT: "3100"` | (same) | Works if transport is http |

## Symptoms

- MCP container starts
- No port 3100 listening
- Gateway shows: `Connection refused ('127.0.0.1', 3100)`
- Log shows: `MemPalace MCP Server (stdio) starting...` instead of `(http)`

## Fix

Edit `docker-compose.yml`:

```yaml
# BEFORE (broken)
environment:
  MCP_HTTP: "true"
  MCP_PORT: "3100"

# AFTER (fixed)
environment:
  MCP_TRANSPORT: "http"
  MCP_PORT: "3100"
```

## Manual Workaround

When Docker build fails or for debugging:

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

## Verification

```bash
# Should return: {"status":"ok"}
curl http://localhost:3100/health

# Should show: (http) not (stdio)
grep "MCP Server" /tmp/mcp.log
```

## Related

- Skill: `native-mcp` - General MCP troubleshooting
- Fork: https://github.com/mehmetkirkoca/MemPalace (Neo4j+Qdrant enabled MCP server)
