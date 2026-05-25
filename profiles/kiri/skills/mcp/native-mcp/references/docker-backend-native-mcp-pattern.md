# MCP Server Deployment Pattern: Docker Backend + Native Node.js MCP

**Pattern:** Separate infrastructure (Docker) from MCP server (native Node.js)

## When to Use This Pattern

- Backend services need persistent storage (databases, vector stores)
- MCP server needs direct access to embedding models, file systems, or complex dependencies
- You want Docker's reliability for data services but Node.js flexibility for MCP logic
- MemPalace-style architecture: Qdrant + Neo4j in Docker, MCP server as native process

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Network              │
│  ┌─────────┐     ┌──────────┐      │
│  │ Qdrant  │────▶│  Neo4j   │      │
│  │ (6333)  │     │ (7687)   │      │
│  └─────────┘     └──────────┘      │
└─────────────────────────────────────┘
              ▲
              │ connects via internal Docker network
┌─────────────────────────────────────┐
│    Native Node.js Process           │
│  ┌─────────────────────────────┐     │
│  │  MCP Server (port 3100)   │     │
│  │  - Uses @huggingface/     │     │
│  │    transformers           │     │
│  │  - Calls Docker services  │     │
│  └─────────────────────────────┘     │
└─────────────────────────────────────┘
```

## Docker Backend Service

```ini
# ~/.config/systemd/user/backend.service
[Unit]
Description=Docker Backend Services
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=%h/project
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down

[Install]
WantedBy=default.target
```

## Native MCP Service (Depends on Backend)

```ini
# ~/.config/systemd/user/mcp-server.service
[Unit]
Description=MCP Server
After=network-online.target backend.service
Wants=network-online.target
Requires=backend.service  # Don't start until backend is up

[Service]
Type=simple
WorkingDirectory=%h/project/src
Environment="MCP_TRANSPORT=http"
Environment="MCP_PORT=3100"
ExecStart=/usr/bin/node %h/project/src/mcpServer.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

## Startup Sequence

1. `docker.service` starts
2. `backend.service` starts → `docker-compose up -d`
3. Waits for containers to be healthy
4. `mcp-server.service` starts → connects to backends
5. Port 3100 becomes available

## Environment Variables

**Critical:** MCP server needs connection details:

```bash
# Used by MCP server to reach Docker services
QDRANT_URL=http://localhost:6333
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=secret

# MCP transport configuration
MCP_TRANSPORT=http
MCP_PORT=3100
```

## Why Not Both in Docker?

| Approach | Pros | Cons |
|----------|------|------|
| **Both Docker** | Single orchestration, networking | Restart loop if MCP tries to connect before backend ready; HuggingFace cache conflicts |
| **Backend Docker + Native MCP** | MCP can access host filesystem, user cache, easier debugging | Two service managers needed |
| **Both Native** | Fastest startup, no Docker overhead | Manual dependency management |

## Pre-Systemd Solution: Cron Health Check

If systemd isn't available (WSL pre-restart):

```bash
#!/bin/bash
# ~/.hermes/scripts/mcp-health.sh

PORT=3100
if ! curl -s "http://localhost:$PORT/health" > /dev/null; then
    pkill -f mcpServer.js
    cd ~/mempalace/src
    MCP_TRANSPORT=http node src/mcpServer.js &
fi
```

Schedule: `*/5 * * * *` in Hermes cron.

## Validation

```bash
# 1. Backend containers
$ docker ps
mempalace-qdrant   Up 30 minutes
mempalace-neo4j    Up 30 minutes (healthy)

# 2. MCP process
$ pgrep -f mcpServer
22345

# 3. Port listening
$ ss -tlnp | grep 3100
LISTEN 0 511 *:3100 *:* users:(("node",pid=22345))

# 4. Health endpoint
$ curl -s http://localhost:3100/health
{"status":"ok"}

# 5. Create diary entry (MCP protocol)
$ curl -X POST http://localhost:3100/mcp \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
      "jsonrpc":"2.0",
      "method":"tools/call",
      "params": {
        "name": "mempalace_diary_write",
        "arguments": {
          "agent_name": "test",
          "entry": "MCP is working",
          "topic": "test"
        }
      },
      "id": 1
    }'
```

## Troubleshooting

### MCP starts but can't connect to Qdrant/Neo4j
- Check Docker containers are actually running: `docker ps`
- Verify connection URLs in MCP environment
- Add `ExecStartPre=/bin/sleep 10` to MCP service to wait for backend

### Port already in use
- Some MCP server didn't shut down: `pkill -f mcpServer`
- Or systemd is managing it: `systemctl --user stop mcp-server`

### MCP_TRANSPORT=http is set but server starts in stdio mode
- The server checks this variable on startup
- If already running, won't switch modes until restart
- Verify: `cat /proc/PID/environ | tr '\0' '\n' | grep MCP`