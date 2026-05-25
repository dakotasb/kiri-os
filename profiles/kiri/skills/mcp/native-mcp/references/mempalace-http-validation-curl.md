## MemPalace MCP HTTP Validation via curl

**Real session validation pattern:** Testing MemPalace MCP server (from mehmetkirkoca/MemPalace fork) running on port 3100, creating a diary entry to confirm full functionality.

### Prerequisites

```bash
# Server must be running with HTTP transport
MCP_TRANSPORT=http MCP_PORT=3100 node src/mcpServer.js

# Dependencies must be healthy
# - Qdrant on port 6333
# - Neo4j on ports 7474/7687
```

### Two-Step Validation Flow

#### Step 1: Initialize MCP Session

Captures the `mcp-session-id` header needed for subsequent calls.

```bash
RESPONSE=$(curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -D - \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {"name": "kiri-validator", "version": "1.0"}
    },
    "id": 1
  }')

# Extract session ID from response headers
SESSION_ID=$(echo "$RESPONSE" | grep -i mcp-session-id | head -1 | sed 's/.*: //;s/\r//')
echo "Session: $SESSION_ID"

# Response body includes server info
echo "$RESPONSE" | tail -1 | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
```

**Key Response Fields:**
- `result.serverInfo.name`: "mempalace"
- `result.serverInfo.version`: "3.0.0"
- `result.instructions`: Full protocol rules
- Header: `mcp-session-id: {uuid}`

#### Step 2: Call Tool with Session

Use the session ID from Step 1:

```bash
OUTPUT=$(curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: $SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "mempalace_diary_write",
      "arguments": {
        "agent_name": "kiri",
        "entry": "Validation entry: Dashboard (localhost:3001) and MemPalace MCP (localhost:3100) both operational",
        "topic": "system-validation"
      }
    },
    "id": 2
  }')

echo "$OUTPUT" | python3 -m json.tool 2>/dev/null || echo "$OUTPUT"
```

**Expected Success Response:**

```json
{
  "result": {
    "content": [{
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"entry_id\": \"diary_wing_kiri_20260519005515.c63b05b6\",\n  \"agent\": \"kiri\",\n  \"topic\": \"system-validation\",\n  \"timestamp\": \"2026-05-19T00:55:15.686Z\"\n}"
    }]
  },
  "jsonrpc": "2.0",
  "id": 2
}
```

### One-Liner Complete Validation

```bash
# Initialize + Call diary_write in sequence
SESSION=$(curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json,text/event-stream" \
  -D - -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"validator","version":"1.0"}},"id":1}' 2>/dev/null | grep -i mcp-session-id | sed 's/.*: //;s/\r//' | tr -d '\n') && \
curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: $SESSION" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"mempalace_diary_write","arguments":{"agent_name":"kiri","entry":"Validation: full stack operational","topic":"validation"}},"id":2}' | \
python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(json.loads(d['result']['content'][0]['text']), indent=2))" 2>/dev/null || echo "FAILED"
```

### Common Errors

**"No valid session":**
```json
{"jsonrpc":"2.0","error":{"code":-32000,"message":"Bad Request: No valid session. Send initialize first."},"id":null}
```
- **Cause:** Missing or invalid `mcp-session-id` header
- **Fix:** Run initialize first, capture header, use in subsequent calls

**"Not Acceptable":**
```json
{"jsonrpc":"2.0","error":{"code":-32000,"message":"Not Acceptable: Client must accept both application/json and text/event-stream"},"id":null}
```
- **Cause:** Missing `Accept: application/json, text/event-stream` header
- **Fix:** Add both Accept header values

**"Parse error":**
```json
{"jsonrpc":"2.0","error":{"code":-32700,"message":"Parse error: Invalid JSON-RPC message"},"id":null}
```
- **Cause:** Malformed JSON or missing Content-Type
- **Fix:** Verify `Content-Type: application/json` header present

**Connection refused:**
```bash
curl: (7) Failed to connect to localhost port 3100: Connection refused
```
- **Cause:** Server not running, wrong port, or HTTP transport not enabled
- **Fix:** Start with `MCP_TRANSPORT=http MCP_PORT=3100 node src/mcpServer.js`

### Backend Health Checks

Before validating MCP, ensure backends are healthy:

```bash
# Qdrant health
curl -s http://localhost:6333/healthz
# Expected: "ok"

# Neo4j HTTP (if enabled)
curl -s http://localhost:7474
# Returns Neo4j browser interface HTML

# Neo4j Bolt (graph database)
# Cannot test via curl; verify in server logs instead
grep "Bolt enabled" ~/mempalace/src/logs/neo4j.log 2>/dev/null || echo "Check container logs: docker logs mempalace-neo4j"
```

### Alternative: Direct Tool Call List

Get available tools without calling:

```bash
SESSION=$(curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json,text/event-stream" \
  -D - -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"validator","version":"1.0"}},"id":1}' 2>/dev/null | grep -i mcp-session-id | sed 's/.*: //;s/\r//' | tr -d '\n')

curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: $SESSION" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":3}' | \
python3 -m json.tool 2>/dev/null | head -50
```

**Expected Tools:**
- `mempalace_illuminate` — L0 + L1 memory load
- `mempalace_search` — Semantic search
- `mempalace_save` — Store memory with auto-routing
- `mempalace_diary_write` — Agent diary entry
- `mempalace_kg_query` — Knowledge graph query
- `mempalace_recall` — Room-based recall
- `mempalace_list_wings` — Palace structure
- `mempalace_status` — Palace overview

### Session Lifecycle Notes

- Sessions persist for the lifetime of the HTTP connection
- Idle sessions may timeout (server-dependent, typically 30min)
- Each initialize call creates a new session
- Re-use session ID for related calls within same logical operation
- No need to clean up sessions; server garbage collects automatically
