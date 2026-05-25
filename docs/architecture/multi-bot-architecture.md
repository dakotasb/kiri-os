# Kiri Multi-Bot Gateway Architecture

## Overview
Each agent gets its own Discord bot account, gateway process, and identity.

## Discord Bot Requirements
Create these applications at https://discord.com/developers/applications:

| Bot Name | Purpose | Token Env Var |
|----------|---------|---------------|
| Kiri | The Conductor / Orchestrator | `DISCORD_TOKEN_KIRI` |
| Forge | Senior Software Engineer | `DISCORD_TOKEN_FORGE` |
| Ember | Research Intelligence | `DISCORD_TOKEN_EMBER` |
| Mason | Code Architect | `DISCORD_TOKEN_MASON` |
| Launchpad | Release Manager | `DISCORD_TOKEN_LAUNCHPAD` |

## Port Allocation
Each gateway needs unique ports for internal communication:

| Agent | Gateway Port | API Port | Log Directory |
|-------|--------------|----------|---------------|
| kiri | 8080 | 8090 | ~/.hermes/logs/kiri/ |
| forge | 8081 | 8091 | ~/.hermes/logs/forge/ |
| ember | 8082 | 8092 | ~/.hermes/logs/ember/ |
| mason | 8083 | 8093 | ~/.hermes/logs/mason/ |
| launchpad | 8084 | 8094 | ~/.hermes/logs/launchpad/ |

## Directory Structure
```
~/.hermes/
├── gateways/
│   ├── kiri-gateway.yaml
│   ├── forge-gateway.yaml
│   ├── ember-gateway.yaml
│   ├── mason-gateway.yaml
│   └── launchpad-gateway.yaml
├── logs/
│   ├── kiri/
│   ├── forge/
│   ├── ember/
│   ├── mason/
│   └── launchpad/
└── multi-bot/
    └── start-all-gateways.sh
```

## Startup Sequence
1. Set all DISCORD_TOKEN_* environment variables
2. Run: ./start-all-gateways.sh
3. Each bot joins your home Discord server via invite link
4. They all respond to @mentions in their respective channels

## Interaction Model
User in Discord: "@Forge build a login system"
  ↓
Forge Gateway receives message
  ↓
Forge processes (may delegate to mason, keystone via terminal)
  ↓
Forge responds in Discord thread

User: "@Kiri orchestrate this project"
  ↓
Kiri receives → Dispatches to forge, ember, mason via terminal
  ↓
Kiri coordinates results
  ↓
Kiri reports back to Discord

## Coordination
Agents communicate via:
1. Terminal commands to spawn each other (`hermes -p <agent>`)
2. MemPalace shared memory
3. Delegation when subagents needed

All agents share the same MemPalace instance (localhost:3100).

## Bot Permissions Needed
When creating Discord bot applications, enable:
- ✅ Bot (create bot user)
- ✅ Message Content Intent (under Privileged Gateway Intents)
- Standard permissions: Send Messages, Read Message History, View Channels

## Next Steps
1. Create 5 Discord applications with bot users
2. Copy tokens to environment variables
3. Deploy gateway configs
4. Run startup script
5. Invite bots to your home Discord server
