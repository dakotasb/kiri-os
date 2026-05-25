# MemPalace Systemd Service Setup — Session Notes

**Date:** 2026-05-18  
**Status:** Configured, awaiting WSL restart to activate  

## Files Created

### 1. `/etc/wsl.conf`
```ini
[boot]
systemd=true
```
*Note: Requires WSL restart (`wsl --shutdown` or Windows reboot)*

### 2. Backend Service: `~/.config/systemd/user/mempalace.service`
Handles Docker containers (Qdrant + Neo4j)

### 3. MCP Service: `~/.config/systemd/user/mempalace-mcp.service`
Handles native Node.js MCP server on port 3100

## Dependency Chain

```
mempalace.service (Docker backend)
    ↓
mempalace-mcp.service (Node.js MCP)
```

The MCP service uses `Requires=mempalace.service` to ensure backend is up first.

## Post-Restart Commands

After next WSL restart, run:
```bash
systemctl --user enable mempalace.service
systemctl --user enable mempalace-mcp.service
systemctl --user start mempalace.service
systemctl --user start mempalace-mcp.service
```

## Pre-Restart Fallback

Until systemd is active, a Hermes cron job (`mempalace-mcp-health-v2`) checks every 5 minutes and restarts the MCP server if dead.

## Lessons Learned

1. **MCP server is native Node.js**, not Docker — requires separate service
2. **Docker containers auto-restart** with Docker's restart policies
3. **Environment variables matter**: `MCP_TRANSPORT=http` required for HTTP transport
4. **Wait for readiness**: Startup script polls health endpoint before reporting success

## Validation Commands

```bash
# Check port 3100
ss -tlnp | grep 3100

# Health check
curl -s http://localhost:3100/health

# Create diary entry (MCP protocol)
curl -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"initialize",...}'
```