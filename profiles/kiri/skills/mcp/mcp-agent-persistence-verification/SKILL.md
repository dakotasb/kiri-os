---
name: mcp-agent-persistence-verification
description: Verify which agent types support MCP tool persistence (MemPalace, etc.) and document persistence patterns. Distinguishes profile agents vs delegate_task subagents vs cron agents.
version: 1.0.0
author: Kiri
---

# MCP Agent Persistence Verification

This skill addresses a critical but historically under-documented capability: **profile agents can use MCP tools with full persistence**, same as cron agents.

## When to Use

Use this skill when:
- You're unsure which agent types support MCP tool persistence
- You need to verify if a specific agent (profile/cron/ephemeral) can call MCP tools
- You're documenting persistence patterns for a new MCP server
- Previous documentation incorrectly categorized profile agents alongside ephemeral subagents
- You need to test MCP tool access before building persistent workflows

## The Core Insight

There are three agent types with different persistence capabilities:

| Agent Type | Init Method | Session Hooks | MCP Persistence |
|------------|-------------|---------------|-----------------|
| **Profile Agent** | `hermes -p <name>` | ✅ Present | ✅ **FULL PERSISTENCE** |
| **Cron Agent** | `cronjob --agent <name>` | ✅ Present | ✅ Full persistence |
| **delegate_task** | `delegate_task(calls=[...])` | ❌ Absent | ❌ Session only, ephemeral |

**Key distinction:** Session hooks (`session_start` + `session_end`) enable MCP persistence. Profile agents have these hooks; `delegate_task` subagents do not.

## Quick Verification Test

### Step 1: Ensure MCP Server is Running

```bash
# Check if your MCP server is healthy
curl http://localhost:3100/health
# Expected: {"status":"ok"}

# If using stdio transport, check for process:
ps aux | grep "your-mcp-server" | grep -v grep
```

### Step 2: Test Profile Agent MCP Access

```bash
# Dispatch a profile agent to use MCP tools
hermes -p <agent_name> chat -q "Use <mcp_tool_name> to <query>"

# Example with MemPalace:
hermes -p keystone chat -q "Use mempalace_search to find tasks from last week"
```

**Expected behavior:**
- Agent initializes and sees MCP tools in tool list
- Agent calls MCP tool (e.g., `mcp_mempalace_search`)
- Tool executes successfully
- Session hooks fire, enabling persistence

**Warning signs of no persistence:**
- "Tool not found" errors
- Agent acts as if it has no memory between queries
- No evidence of MCP tool calls in output

### Step 3: Confirm Persistence Architecture

Verify the agent has proper lifecycle hooks:

1. **Profile/cron agents:** Long-lived session with `initialize()` → `session_end()`
2. **delegate_task:** Stateless execution, no hooks, memory lost on return

```
Profile Agent Lifecycle (PERSISTENT):
├── session_start hook   ← Loads context
├── MCP tool execution   ← Can call mempalace_search, etc.
└── session_end hook     ← Persists facts to Qdrant/Neo4j

delegate_task Lifecycle (EPHEMERAL):
├── Function call        ← Stateless
├── Tool execution       ← No MCP access
└── Function returns     ← Memory lost
```

## Documentation Template

When documenting persistence patterns for MCP servers:

```markdown
## [ServerName] Persistence Patterns

### Agent Type Matrix

| Agent Type | Can Use [ServerName]? | Persistence Level |
|------------|----------------------|-------------------|
| Profile (`hermes -p`) | ✅ Yes | Full (SQLite + [ServerName]) |
| Cron (`cronjob --agent`) | ✅ Yes | Full (SQLite + [ServerName]) |
| delegate_task | ❌ No | None (ephemeral) |

### Verification Command

```bash
# Test profile agent access
hermes -p <agent> chat -q "List available MCP tools and use [server_tool] to query [data]"
```

### Key Insight

[ServerName] works with profile agents because they have `session_start` and 
`session_end` hooks, not because they are cron agents. The presence of session 
lifecycle hooks is what enables MCP persistence, not the initialization method.
```

## Common Misconceptions

### Myth: "Only cron agents can use MemPalace/MCP tools"

**Reality:** Profile agents (`hermes -p`) have the same session hooks as cron agents. They support full MCP persistence. The confusion arose from conflating profile agents with ephemeral `delegate_task` subagents.

### Myth: "MCP tools require scheduled jobs to persist"

**Reality:** MCP tools persist based on session lifecycle, not scheduling. Both immediate (`hermes -p`) and scheduled (cron) agents have proper session hooks.

### Myth: "delegate_task returns don't support MCP because of architecture"

**Actually true:** `delegate_task` creates ephemeral subagents with no session hooks. They cannot use MCP tools for persistence — only for one-shot queries.

## Troubleshooting

### Agent Can't Find MCP Tools

1. **Verify MCP server is running BEFORE Hermes starts**
   ```bash
   # HTTP transport
   curl http://localhost:3100/health
   
   # Stdio transport
   ps aux | grep "your-mcp-server"
   ```

2. **Check Hermes config has `mcp_servers:` at ROOT level**
   ```yaml
   # ~/.hermes/config.yaml
   mcp_servers:
     servername:
       url: http://localhost:3100/mcp
   
   # NOT under memory: or profiles:
   ```

3. **Restart gateway if it started before MCP server**
   ```bash
   # If gateway was running before MCP server:
   pkill -f "hermes gateway"
   hermes gateway &
   ```

### Agent Times Out on MCP Calls

- Verify underlying databases (Qdrant/Neo4j for MemPalace) are running
- Check for credential errors in MCP server logs
- Test MCP server directly via curl to isolate Hermes vs server issue

### "No MCP servers configured"

- Verify `mcp_servers:` is at top level of config.yaml
- Check YAML indentation (no tabs, 2 spaces)
- Restart Hermes after adding config

## Best Practices

### For Persistent Workflows

**Use profile agents:**
```bash
# Complex multi-turn task
hermes -p keystone chat -q "Check MemPalace for project status, then update dashboard"

# Session maintains context across tool calls
hermes -p keystone chat -q "Now search for related tasks from last month"
```

### For Ephemeral Tasks

**Use delegate_task only when persistence doesn't matter:**
```python
# One-shot, no persistence needed
delegate_task(tasks=[{"goal": "Generate ASCII art"}])
```

### Documentation

Always document the persistence matrix when adding new MCP servers:

1. Which agent types work
2. Verification test command
3. Architecture explanation (session hooks vs ephemeral)

## Related Skills

- `native-mcp`: Technical MCP server configuration and connection
- `mcp-agent-persistence-verification`: This skill — verification patterns and agent-type distinctions
