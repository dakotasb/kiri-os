## MemPalace MCP Server Validation via HTTP

**Pattern derived from real session:** Validating MemPalace MCP server (mehmetkirkoca/MemPalace) running on port 3100 with diary entry creation.

### Architecture

MemPalace MCP server exposes:
- **HTTP endpoint:** `http://localhost:3100/mcp`
- **Transport:** Streamable HTTP with JSON-RPC 2.0
- **Required headers:** `Content-Type: application/json`, `Accept: application/json, text/event-stream`
- **Session management:** MCP-session-id header after initialization

### Full Validation Flow

```bash
# Step 1: Initialize and capture session ID
SESSION=$(curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -D - \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {"name": "validator", "version": "1.0"}
    },
    "id": 1
  }' | grep -i mcp-session-id | head -1 | sed 's/.*: //;s/\r//')

echo "Session ID: $SESSION"

# Step 2: Call tool with session
curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: $SESSION" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "mempalace_diary_write",
      "arguments": {
        "agent_name": "kiri",
        "entry": "Validation entry: Dashboard and MemPalace MCP both operational",
        "topic": "system-validation"
      }
    },
    "id": 2
  }'
```

### Expected Response

```json
{
  "result": {
    "content": [{
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"entry_id\": \"diary_wing_kiri_20260519005515.xxx\",\n  \"agent\": \"kiri\",\n  \"topic\": \"system-validation\",\n  \"timestamp\": \"2026-05-19T00:55:15.686Z\"\n}"
    }]
  },
  "jsonrpc": "2.0",
  "id": 2
}
```

### Quick Health Check

```bash
# Simple health endpoint (no session needed)
curl -s http://localhost:3100/health
# {"status":"ok"}
```

### Service Dependencies

| Service | Port | Purpose |
|---------|------|---------|
| MemPalace MCP | 3100 | Main MCP interface |
| Qdrant | 6333 | Vector store backend |
| Neo4j | 7474/7687 | Knowledge graph |

All three must be running for full functionality.

### Common Errors

**"No valid session":**
- Missing initialize call
- Wrong session ID header
- Session expired (idle timeout)

**"Parse error: Invalid JSON-RPC message":**
- Missing Accept header with `text/event-stream`
- Content-Type not set to `application/json`

**Connection refused:**
- Server not started
- Wrong port
- Docker container not running

### Docker Compose Setup

```yaml
version: "3"
services:
  mempalace:
    build:
      context: /home/dakotasb/mempalace/src
    ports:
      - "3100:3100"
    depends_on:
      - qdrant
      - neo4j
    environment:
      MCP_PORT: "3100"
      MCP_TRANSPORT: "http"
      QDRANT_URL: "http://mempalace-qdrant:6333"
      NEO4J_URL: "bolt://mempalace-neo4j:7687"
```

### Verification Summary

| Check | Command | Expected |
|-------|---------|----------|
| Health | `curl http://localhost:3100/health` | `{"status":"ok"}` |
| Session | `curl -H "Accept:..." ... initialize` | Session ID in header |
| Diary | `curl -H "mcp-session-id:..." ... tools/call` | JSON with entry_id |
