---
name: wsl-service-management
description: Manage persistent services in WSL (Windows Subsystem for Linux) including enabling systemd, creating user services, and handling service dependencies between Docker containers and native processes.
triggers:
  - wsl systemd
  - service persistence
  - windows subsystem linux service
  - wsl autostart
  - wsl restart service
  - systemd user service wsl
---

# WSL Service Management

WSL2 does **not** use systemd by default — it uses `init`. This breaks standard Linux service management patterns.

## Quick Check

```bash
# Is systemd running?
systemctl --version  # Fails if not

# What init system?
ps -p 1  # Shows 'init' not 'systemd'
```

If you see "System has not been booted with systemd as init system (PID 1)", systemd is not active.

## Enabling Systemd

1. Create `/etc/wsl.conf`:
```ini
[boot]
systemd=true
```

2. Restart WSL (kills all running WSL processes):
```powershell
wsl --shutdown
# Or reboot Windows
```

3. Verify on next start:
```bash
systemctl --version
```

## User Service Pattern

After systemd is enabled, place services in `~/.config/systemd/user/`:

```ini
[Unit]
Description=My Service
After=network-online.target other-service.service
Wants=network-online.target
Requires=other-service.service  # This service needs that service

[Service]
Type=simple
WorkingDirectory=%h/project-dir
Environment="VAR=value"
ExecStart=/usr/bin/node %h/project/src/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Enable and start:
```bash
systemctl --user enable my-service
systemctl --user start my-service
systemctl --user status my-service
```

## Docker + Native Process Pattern

Common in MemPalace-style setups:
1. Docker containers for backends (Qdrant, Neo4j, DBs)
2. Native Node.js/Python process for MCP/API server

**The dependency chain:**
```ini
# docker-backend.service
[Unit]
After=docker.service
Requires=docker.service
[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down

# mcp-server.service  
[Unit]
After=docker-backend.service
Requires=docker-backend.service
[Service]
Type=simple
ExecStart=/usr/bin/node server.js
```

This ensures Docker backend is **up** before MCP tries to connect.

## Pitfalls

### Port 3100 already in use
If a process was started manually before systemd takes over:
```bash
pkill -f my-server
systemctl --user restart my-service
```

### Service starts but can't connect to Docker backend
Add `ExecStartPre=/bin/sleep 5` or proper `After/Requires` dependency.

### Systemd not available until restart
Changes to `wsl.conf` only take effect after WSL restart. Plan for process interruption.

### Protected credential files (.bashrc)
If `.bashrc` contains credentials (e.g., `DISCORD_TOKEN`), it may be write-protected. Use user's external agent or manual edit:
```bash
# Append auto-enable snippet for services
cat >> ~/.bashrc << 'BASHRC'
# Auto-enable systemd services on first login after WSL restart
if command -v systemctl &>/dev/null && [ -f ~/.config/systemd/user/my-service.service ]; then
    if ! systemctl --user is-enabled my-service &>/dev/null; then
        systemctl --user daemon-reload
        systemctl --user enable my-service
        systemctl --user start my-service
    fi
fi
BASHRC
```

## Health Check Script Timing

When using cron fallback (pre-systemd), the script must **wait** for the service to be ready after starting:

```bash
start_service() {
    nohup node server.js &
    
    # Wait for it to be ready
    local retries=0
    while [ $retries -lt 30 ]; do
        sleep 1
        if curl -s -o /dev/null "http://localhost:$PORT/health"; then
            echo "Service ready"
            return 0
        fi
        retries=$((retries + 1))
    done
    echo "WARNING: Started but not responding after 30s"
}
```

**Without this wait**, subsequent checks in the same script may fail even though the service will be ready shortly.

## Cron Fallback (Pre-Systemd)

Until systemd is enabled, use Hermes cron:

```json
{
  "name": "service-health-check",
  "schedule": "*/5 * * * *",
  "script": "health-check.sh"
}
```

Script checks port + health endpoint, restarts if dead.

## References

- `templates/systemd-user-service.ini` — Boilerplate service file