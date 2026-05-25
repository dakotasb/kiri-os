# MemPalace Fork Session Notes

Repository: mehmetkirkoca/MemPalace (Node.js fork)
Official: MemPalace/mempalace (Python)

## Key Difference: Transport Mode Environment Variable

The fork requires `MCP_TRANSPORT=http` NOT `MCP_HTTP=true`:

```javascript
// From src/mcpServer.js line 1936:
if (process.env.MCP_TRANSPORT === 'http') {
    await startHTTP();  // Creates HTTP server on port 3100
} else {
    await startStdio(); // Uses stdin/stdout
}
```

**Pitfall:** Setting `MCP_PORT=3100` without `MCP_TRANSPORT=http` silently falls back to stdio mode.

## Correct Startup Command

```bash
cd ~/mempalace/src
MCP_TRANSPORT=http \
MCP_PORT=3100 \
QDRANT_URL=http://localhost:6333 \
NEO4J_URL=bolt://localhost:7687 \
NEO4J_USER=neo4j \
NEO4J_PASSWORD=mempalace \
node src/mcpServer.js
```

## Verification Steps

```bash
# 1. Check process is running
ps aux | grep mcpServer

# 2. Check port is listening  
ss -tlnp | grep 3100

# 3. Test HTTP endpoint (should return error about session, NOT connection refused)
curl -s http://localhost:3100/mcp
# Expected: {"error":"Missing or invalid session"}
```

## Architecture Note

This fork differs from official MemPalace:
- **Language:** JavaScript/Node vs Python
- **Vector DB:** Qdrant vs ChromaDB (official)
- **Knowledge Graph:** Neo4j (official MemPalace has NONE)
- **Hierarchy:** Wing → Hall → Room → Closet → Drawer (5 levels vs 3)

The Neo4j KG makes this fork superior for multi-agent systems.

## Troubleshooting Checklist

If MCP calls fail:
1. ✓ Docker daemon running
2. ✓ Qdrant container on 6333
3. ✓ Neo4j container on 7474
4. ✓ MCP process running with MCP_TRANSPORT=http (NOT stdio)
5. ✓ Port 3100 actually listening on HTTP
6. ⟐ Agent profiles configured with mcp_servers
