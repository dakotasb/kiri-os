# Multi-Bot Gateway Manual Setup Guide

## Current Situation

You've created a Discord app for @kiri with:
- **Bot Token:** `<YOUR_DISCORD_BOT_TOKEN>`
- **App ID:** `1504975434096574659`
- **Profile:** @kiri exists at `~/.hermes/profiles/kiri/`

## The Challenge

Hermes doesn't natively support multiple simultaneous Discord gateways from one installation. The CLI tool expects a single gateway per config.

## PROPOSED SOLUTION: Docker Multi-Instance

Run @kiri in a separate Docker container with isolated config:

### Step 1: Create Docker Compose

```yaml
# docker-compose.kiri.yml
version: '3.8'
services:
  kiri-gateway:
    image: nikolaik/python-nodejs:python3.11-nodejs20
    environment:
      - DISCORD_TOKEN=<YOUR_DISCORD_BOT_TOKEN>
      - HERMES_PROFILE=kiri
    volumes:
      - ./kiri-config:/root/.hermes
      - ./hermes-agent:/opt/hermes-agent
    command: |
      bash -c "cd /opt/hermes-agent && 
      source venv/bin/activate && 
      hermes -p kiri gateway run"
```

### Step 2: Alternative - Simple Wrapper Script

```bash
#!/bin/bash
# kiri-gateway-wrapper.sh
# Run this to start @kiri separately

# Set profile-specific environment
export HERMES_PROFILE=kiri
export DISCORD_TOKEN="${DISCORD_TOKEN_KIRI}"

# Clear conflicting env vars
unset HERMES_GATEWAY_PID
unset HERMES_GATEWAY_SOCKET

# Copy config to temp location
KIRI_CONFIG="/tmp/hermes-kiri-$$"
mkdir -p "$KIRI_CONFIG/.hermes/profiles"
cp ~/.hermes/config.yaml "$KIRI_CONFIG/.hermes/"
cp -r ~/.hermes/profiles/kiri "$KIRI_CONFIG/.hermes/profiles/"

# Create profile override
export HERMES_CONFIG_DIR="$KIRI_CONFIG/.hermes"

# Run gateway
cd ~/hermes-agent
source venv/bin/activate
exec hermes gateway run
```

### Step 3: Systemd Service (Recommended for Production)

```ini
# /etc/systemd/system/kiri-gateway.service
[Unit]
Description=Kiri Discord Bot Gateway
After=network.target

[Service]
Type=simple
User=dakotasb
Environment="DISCORD_TOKEN=<YOUR_DISCORD_BOT_TOKEN>"
Environment="HERMES_PROFILE=kiri"
Environment="HERMES_CONFIG_DIR=/home/dakotasb/.hermes-multi/kiri/.hermes"
WorkingDirectory=/home/dakotasb/hermes-agent
ExecStart=/bin/bash -c "source venv/bin/activate && hermes gateway run"
Restart=always

[Install]
WantedBy=multi-user.target
```

## Immediate Test

Try running this command (without nohup issues):

```bash
cd ~/hermes-agent
source venv/bin/activate

# In one terminal:
DISCORD_TOKEN=<YOUR_DISCORD_BOT_TOKEN> HERMES_PROFILE=kiri hermes -p kiri

# Then inside that session:
hermes gateway run
```

## Recommendation

**Given the complexity, I recommend Option A:**
- Keep the current single-bot setup
- Make @kiri your primary agent (it's already designed for this)
- This is clean, simple, and matches the architecture

Multi-bot is technically possible but requires infrastructure work (Docker, custom wrappers, or systemd services).

**Your call:** Single bot (simple) or multi-bot (complex infrastructure)?