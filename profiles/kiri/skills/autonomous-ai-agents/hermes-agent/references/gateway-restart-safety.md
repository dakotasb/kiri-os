# Session-Specific Learning: Gateway Restart from Active Connection

## Issue

Gateway restart attempted while running via the same gateway connection causes conversation interruption.

## Specific Context

- User was connected via Discord gateway
- Attempted to restart gateway to reconnect MCP server
- Would have severed own connection
- User caught this before execution

## Pattern: Safe Gateway Restart

**Option A: Two-Terminal Approach**
```
Terminal 1: (keep gateway running)
# User stays connected

Terminal 2: (independent SSH/terminal)
pkill -f "hermes gateway"
sleep 3
hermes gateway restart
```

**Option B: Schedule for Later**
```bash
# Schedule restart when no active conversations
at now + 5 minutes <<< 'hermes gateway restart'
```

**Option C: Accept Disruption**
```bash
# If conversation can be sacrificed
pkill -f "hermes gateway"
# Manually restart from new session
hermes gateway restart
```

## The Specific Mistake Pattern

When an agent (via gateway) tries to:
```bash
pkill -f "hermes gateway"  # ← Kills its own parent's connection
hermes gateway restart     # ← Can never execute
```

The process terminates before the restart command.

## Prevention

Always ask:
1. "How are we connected?" (Discord/Slack/gateway vs direct terminal)
2. "If I restart the gateway, will this conversation survive?"
3. "Should I provide commands for the user to run separately?"

The user in this session caught this with: "if you restart the gateway you'll lose track of your current job bc you're on the gateway shouldn't I restart it separately?"

## Recovery If Interrupted

If gateway dies mid-conversation:
1. Wait 10-30 seconds for auto-reconnect
2. Re-enter conversation context if needed
3. Gateway preserves conversation state in `~/.hermes/sessions/`

## Related Patterns

- Docker daemon restart while containers running
- SSH session termination during remote operations
- Tmux session detachment vs termination
