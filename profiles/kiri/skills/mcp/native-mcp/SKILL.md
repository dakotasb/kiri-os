---
name: native-mcp
description: Built-in MCP (Model Context Protocol) client that connects to external MCP servers, discovers their tools, and registers them as native Hermes Agent tools. Supports stdio and HTTP transports with automatic reconnection, security filtering, and zero-config tool injection.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [MCP, Tools, Integrations]
    related_skills: [mcporter]
---

# Native MCP Client

Hermes Agent has a built-in MCP client that connects to MCP servers at startup, discovers their tools, and makes them available as first-class tools the agent can call directly. No bridge CLI needed -- tools from MCP servers appear alongside built-in tools like `terminal`, `read_file`, etc.

## When to Use

Use this whenever you want to:
- Connect to MCP servers and use their tools from within Hermes Agent
- Add external capabilities (filesystem access, GitHub, databases, APIs) via MCP
- Run local stdio-based MCP servers (npx, uvx, or any command)
- Connect to remote HTTP/StreamableHTTP MCP servers
- Have MCP tools auto-discovered and available in every conversation

For ad-hoc, one-off MCP tool calls from the terminal without configuring anything, see the `mcporter` skill instead.

## Prerequisites

- **mcp Python package** -- optional dependency; install with `pip install mcp`. If not installed, MCP support is silently disabled.
- **Node.js** -- required for `npx`-based MCP servers (most community servers)
- **uv** -- required for `uvx`-based MCP servers (Python-based servers)

Install the MCP SDK:

```bash
pip install mcp
# or, if using uv:
uv pip install mcp
```

## Quick Start

Add MCP servers to `~/.hermes/config.yaml` under the `mcp_servers` key:

```yaml
mcp_servers:
  time:
    command: "uvx"
    args: ["mcp-server-time"]
```

Restart Hermes Agent. On startup it will:
1. Connect to the server
2. Discover available tools
3. Register them with the prefix `mcp_time_*`
4. Inject them into all platform toolsets

You can then use the tools naturally -- just ask the agent to get the current time.

## Configuration Reference

Each entry under `mcp_servers` is a server name mapped to its config. There are two transport types: **stdio** (command-based) and **HTTP** (url-based).

### Stdio Transport (command + args)

```yaml
mcp_servers:
  server_name:
    command: "npx"             # (required) executable to run
    args: ["-y", "pkg-name"]   # (optional) command arguments, default: []
    env:                       # (optional) environment variables for the subprocess
      SOME_API_KEY: "value"
    timeout: 120               # (optional) per-tool-call timeout in seconds, default: 120
    connect_timeout: 60        # (optional) initial connection timeout in seconds, default: 60
```

### HTTP Transport (url)

```yaml
mcp_servers:
  server_name:
    url: "https://my-server.example.com/mcp"   # (required) server URL
    headers:                                     # (optional) HTTP headers
      Authorization: "Bearer sk-..."
    timeout: 180               # (optional) per-tool-call timeout in seconds, default: 120
    connect_timeout: 60        # (optional) initial connection timeout in seconds, default: 60
```

### All Config Options

| Option            | Type   | Default | Description                                       |
|-------------------|--------|---------|---------------------------------------------------|
| `command`         | string | --      | Executable to run (stdio transport, required)     |
| `args`            | list   | `[]`    | Arguments passed to the command                   |
| `env`             | dict   | `{}`    | Extra environment variables for the subprocess    |
| `url`             | string | --      | Server URL (HTTP transport, required)             |
| `headers`         | dict   | `{}`    | HTTP headers sent with every request              |
| `timeout`         | int    | `120`   | Per-tool-call timeout in seconds                  |
| `connect_timeout` | int    | `60`    | Timeout for initial connection and discovery      |

Note: A server config must have either `command` (stdio) or `url` (HTTP), not both.

## How It Works

### Startup Discovery

When Hermes Agent starts, `discover_mcp_tools()` is called during tool initialization:

1. Reads `mcp_servers` from `~/.hermes/config.yaml`
2. For each server, spawns a connection in a dedicated background event loop
3. Initializes the MCP session and calls `list_tools()` to discover available tools
4. Registers each tool in the Hermes tool registry

### Tool Naming Convention

MCP tools are registered with the naming pattern:

```
mcp_{server_name}_{tool_name}
```

Hyphens and dots in names are replaced with underscores for LLM API compatibility.

Examples:
- Server `filesystem`, tool `read_file` → `mcp_filesystem_read_file`
- Server `github`, tool `list-issues` → `mcp_github_list_issues`
- Server `my-api`, tool `fetch.data` → `mcp_my_api_fetch_data`

### Auto-Injection

After discovery, MCP tools are automatically injected into all `hermes-*` platform toolsets (CLI, Discord, Telegram, etc.). This means MCP tools are available in every conversation without any additional configuration.

### Custom Servers (Manual/Local)

For MCP servers that are **not** published to npm/pyx (custom projects, local code, development):

**Pattern: Direct Node Execution with HTTP Transport**

1. **Start the server manually** with required env vars for HTTP transport:
   ```bash
   cd /path/to/mcp-server
   MCP_TRANSPORT=http MCP_PORT=3100 \
     DATABASE_URL=postgres://localhost:5432/db \
     API_KEY=secret \
     node src/mcpServer.js
   ```

2. **Configure in ~/.hermes/config.yaml** using HTTP transport:
   ```yaml
   mcp_servers:
     myserver:
       url: "http://localhost:3100/mcp"
       connect_timeout: 30
   ```

3. **Verify the server is running** before starting Hermes:
   ```bash
   curl -s http://localhost:3100/health  # or /mcp
   ```

4. **Restart Hermes** (`/exit` then resume) to discover tools

**Advantages of manual management:**
- Full control over environment variables
- Can modify server code on the fly (no reinstall)
- Easier to debug with direct stdout/stderr
- Works with complex dependencies (embedding models, databases)

**Key differences from stdio servers:**
- You manage the process lifecycle (start/stop/restart)
- Server must be running BEFORE Hermes starts
- Connection check: `lsof -i :3100` (HTTP) vs `ps aux | grep mcp`

### Connection Lifecycle

- Each server runs as a long-lived asyncio Task in a background daemon thread
- Connections persist for the lifetime of the agent process
- If a connection drops, automatic reconnection with exponential backoff kicks in (up to 5 retries, max 60s backoff)
- On agent shutdown, all connections are gracefully closed

### Idempotency

`discover_mcp_tools()` is idempotent -- calling it multiple times only connects to servers that aren't already connected. Failed servers are retried on subsequent calls.

## Transport Types

### Stdio Transport

The most common transport. Hermes launches the MCP server as a subprocess and communicates over stdin/stdout.

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
```

The subprocess inherits a **filtered** environment (see Security section below) plus any variables you specify in `env`.

### HTTP / StreamableHTTP Transport

For remote or shared MCP servers. Requires the `mcp` package to include HTTP client support (`mcp.client.streamable_http`).

```yaml
mcp_servers:
  remote_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer sk-..."
```

If HTTP support is not available in your installed `mcp` version, the server will fail with an ImportError and other servers will continue normally.

## Security

### Environment Variable Filtering

For stdio servers, Hermes does NOT pass your full shell environment to MCP subprocesses. Only safe baseline variables are inherited:

- `PATH`, `HOME`, `USER`, `LANG`, `LC_ALL`, `TERM`, `SHELL`, `TMPDIR`
- Any `XDG_*` variables

All other environment variables (API keys, tokens, secrets) are excluded unless you explicitly add them via the `env` config key. This prevents accidental credential leakage to untrusted MCP servers.

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      # Only this token is passed to the subprocess
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_..."
```

### Credential Stripping in Error Messages

If an MCP tool call fails, any credential-like patterns in the error message are automatically redacted before being shown to the LLM. This covers:

- GitHub PATs (`ghp_...`)
- OpenAI-style keys (`sk-...`)
- Bearer tokens
- Generic `token=`, `key=`, `API_KEY=`, `password=`, `secret=` patterns

## Troubleshooting

### "MCP SDK not available -- skipping MCP tool discovery"

The `mcp` Python package is not installed. Install it:

```bash
pip install mcp
```

### "No MCP servers configured"

No `mcp_servers` key in `~/.hermes/config.yaml`, or it's empty. Add at least one server.

### "Failed to connect to MCP server 'X'"

Common causes:
- **Command not found**: The `command` binary isn't on PATH. Ensure `npx`, `uvx`, or the relevant command is installed.
- **Package not found**: For npx servers, the npm package may not exist or may need `-y` in args to auto-install.
- **Timeout**: The server took too long to start. Increase `connect_timeout`.
- **Port conflict**: For HTTP servers, the URL may be unreachable.

### "Not Acceptable: Client must accept both application/json and text/event-stream"

**HTTP transport header negotiation failure.** The MCP server requires proper Accept headers for JSON-RPC over HTTP.

**Quick diagnostic with curl:**
```bash
# Test with proper Accept headers (should return server capabilities)
curl -s -X POST http://localhost:3100/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json,text/event-stream" \
  -H "MCP-Session-Id: test-$(date +%s)" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}},"id":1}'
```

**If curl works but Hermes fails:** The MCP client may not be sending correct Accept headers. Check:
1. Hermes config has correct `url` with `/mcp` endpoint
2. Restart Hermes to reinitialize MCP connections
3. Verify no proxy/firewall is stripping headers

**If curl also fails:** The server requires SSE (text/event-stream) transport. Upgrade `mcp` package:

Your `mcp` package version doesn't include HTTP client support. Upgrade:

```bash
pip install --upgrade mcp
```

### Tools not appearing

- Check that the server is listed under `mcp_servers` (not `mcp` or `servers`)
- Ensure the YAML indentation is correct
- Look at Hermes Agent startup logs for connection messages
- Tool names are prefixed with `mcp_{server}_{tool}` -- look for that pattern
- **CRITICAL**: `mcp_servers` must be at the **top level** of config.yaml, NOT nested under `memory:`. Hermes has a separate `memory.mcp_servers` section for memory service MCP integration — do not confuse the two

### MCP server appears to start but responds with "Connection refused" or timeout

**Classic symptom:** Process shows in `ps aux`, port shows in `lsof -i :3100`, but curl or Hermes requests fail.

**Check for HTTP vs STDIO mode mismatch:**

Some MCP servers support both transports but default to stdio:
```javascript
if (process.env.MCP_TRANSPORT === 'http') {
    await startHTTP();        // Port 3100
} else {
    await startStdio();       // stdin/stdout
}
```

**Pitfall:** Setting `MCP_HTTP=true` or `MCP_PORT=3100` alone isn't enough — the **transport type** environment variable must be set:

```bash
# WRONG (will start in stdio mode, ignoring MCP_PORT):
MCP_PORT=3100 node src/mcpServer.js

# CORRECT (starts HTTP server on port 3100):
MCP_TRANSPORT=http MCP_PORT=3100 node src/mcpServer.js
```

**Verification:**
```bash
# Check startup log — should say "http", not "stdio":
MemPalace MCP Server (http) listening on port 3100
#                 ^^^ NOT "stdio"

# Test endpoint responds, even without valid session:
curl -s http://localhost:3100/mcp
# Returns: {"error":"Missing or invalid session"}
```

### Docker build timeouts with MCP servers

Workaround: Run directly with Node.js instead of Docker build. See Pitfalls section above for direct execution pattern.

### Multi-Session Server Status Verification

**When Hermes shows "connection failed" errors:**

The MCP client (in Hermes) and server (separate process) operate independently. Verify BOTH:

```bash
# 1. Check if Hermes has the MCP tools loaded
grep "mcp_servers" ~/.hermes/config.yaml

# 2. Check if the SERVER process is actually running
ps aux | grep -E "mcp|mempalace" | grep -v grep
lsof -i :3100  # if HTTP transport

# 3. Check what the Hermes process sees
lsof -p $(pgrep -f "hermes --resume") | grep "localhost:3100"

# 4. Check recent connection attempts in logs
tail -50 ~/.hermes/logs/agent.log | grep -E "mcp.*(connected|failed|reconnect)"
```

**Common pattern:** Hermes was connected → server crashed → Hermes logged "reconnecting" → server restarted → connection restored. Look for this cycle in agent.log.

**If Hermes has 2+ sessions (e.g., Discord gateway + CLI):**
- The gateway session loads MCP at startup; won't see new servers without restart
- The CLI session can dynamically connect if `--resume` loads fresh config
- Use CLI session to debug, then restart gateway to make tools available everywhere

### Server-side errors (ML/NLP embedding models)

**Note:** These errors occur in the MCP SERVER process (not Hermes), requiring server-side fixes.

For MCP servers using HuggingFace transformers, ONNX Runtime, or embedding models:

**"Protobuf parsing failed" on model load:**
- The HuggingFace cache has a corrupted model file (PyTorch pickle downloaded instead of ONNX protobuf)
- Fix: Clear the cache and re-download with correct dtype:
  ```bash
  sudo rm -rf /path/to/node_modules/@huggingface/transformers/.cache/Xenova/MODEL_NAME/
  ```
- Restart Hermes to trigger fresh download

**Dtype mismatch errors:**
- Server code requests `dtype: 'fp32'` but cache has quantized model (`q8`)
- OR server requests `dtype: 'q8'` but cache has full-precision model
- **HuggingFace transformers downloads different formats based on dtype** - `fp32` may download PyTorch pickle (~470MB) instead of ONNX protobuf (~112MB)
- Fix: Edit the server's embedder/embedding code to match available model:
  ```javascript
  // Change from 'fp32' to 'q8' if quantized model is in cache
  dtype: 'q8',  // or 'fp32' depending on what downloaded
  ```

**"The 'path' argument must be of type string. Received undefined"**
- Server code manipulates `env.cacheDir` incorrectly (setting to `undefined`)
- Common in custom MCP servers using `@huggingface/transformers`
- Fix: Remove `env.cacheDir = undefined` or similar environment resets in server code
- Example patch for embedder.js:
  ```javascript
  // BEFORE (broken):
  import { env } from '@huggingface/transformers';
  env.cacheDir = undefined;  // Causes path errors
  
  // AFTER (fixed):
  import { env } from '@huggingface/transformers';
  // Let library use default cacheDir
  ```

**Root-owned cache files:**
- If the MCP server runs as root (Docker, systemd), cache files may be root-owned
- Fix with sudo before restart:
  ```bash
  sudo rm -rf ~/.cache/TRANSFORMERS_CACHE_PATH/
  # or within node_modules:
  sudo rm -rf /path/to/node_modules/@huggingface/transformers/.cache/
  ```

**Verify model format before restart:**
```bash
# Should start with '0806' (protobuf) NOT 'pytorch'
head -c 50 /path/to/model.onnx | xxd | head -1

# Or check if it's actually ONNX protobuf (112MB) vs PyTorch pickle (470MB)
ls -lh /path/to/model*.onnx
```

**Port Conflict Resolution (Restart Failures):**

When restarting HTTP MCP servers, always check for zombie processes blocking the port:

```bash
# 1. Check what's using the port
lsof -i :3100

# 2. Kill any leftover MCP server processes
pkill -f "mcpServer" 2>/dev/null || true

# 3. Verify port is free before restart
lsof -i :3100 || echo "Port is free"

# 4. Start server with HTTP transport env vars
MCP_TRANSPORT=http MCP_PORT=3100 node src/mcpServer.js
```

**Session-Server Mismatch Diagnosis:**

When you see multiple processes but Hermes times out on MCP calls:

```bash
# Check all relevant processes
ps aux | grep -E "node|mcpServer|mempalace|hermes" | grep -v grep

# Check what Hermes sees (connection status)
lsof -p $(pgrep -f "hermes") | grep "localhost:3100"

# Verify server is actually responding
curl -s http://localhost:3100/mcp \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'
```

**Common Failure Loop:** Server killed → Port not released immediately → New server crashes on "EADDRINUSE" → Hermes times out → User has zombie process on port. Always verify port is free before restart.

### "Load model ... failed:Protobuf parsing failed"

This specifically means the ONNX file is not valid protobuf. Common causes:
1. **Wrong URL redirect:** HuggingFace served PyTorch pickle instead of ONNX
2. **Incomplete download:** File truncated during download
3. **Wrong dtype specification:** Requesting fp32 but cache has quantized model (different protobuf structure)

**Resolution:**
1. Check actual file header: `head -c 100 model.onnx | od -c | head -1`
2. If it starts with "pytorch", the cache is corrupted - clear and restart
3. If file is correct but error persists, check dtype mismatch in server code
4. For mempalace and similar servers, patch `embedder.js` dtype field

### Connection keeps dropping

The client retries up to 5 times with exponential backoff (1s, 2s, 4s, 8s, 16s, capped at 60s). If the server is fundamentally unreachable, it gives up after 5 attempts. Check the server process and network connectivity.

## Examples

### Time Server (uvx)

```yaml
mcp_servers:
  time:
    command: "uvx"
    args: ["mcp-server-time"]
```

Registers tools like `mcp_time_get_current_time`.

### Filesystem Server (npx)

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/documents"]
    timeout: 30
```

Registers tools like `mcp_filesystem_read_file`, `mcp_filesystem_write_file`, `mcp_filesystem_list_directory`.

### GitHub Server with Authentication

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxxxxxxxxxxxxxxxxxxx"
    timeout: 60
```

Registers tools like `mcp_github_list_issues`, `mcp_github_create_pull_request`, etc.

### Remote HTTP Server

```yaml
mcp_servers:
  company_api:
    url: "https://mcp.mycompany.com/v1/mcp"
    headers:
      Authorization: "Bearer sk-xxxxxxxxxxxxxxxxxxxx"
      X-Team-Id: "engineering"
    timeout: 180
    connect_timeout: 30
```

### Multiple Servers

```yaml
mcp_servers:
  time:
    command: "uvx"
    args: ["mcp-server-time"]

  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]

  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxxxxxxxxxxxxxxxxxxx"

  company_api:
    url: "https://mcp.internal.company.com/mcp"
    headers:
      Authorization: "Bearer sk-xxxxxxxxxxxxxxxxxxxx"
    timeout: 300
```

All tools from all servers are registered and available simultaneously. Each server's tools are prefixed with its name to avoid collisions.

## Sampling (Server-Initiated LLM Requests)

Hermes supports MCP's `sampling/createMessage` capability — MCP servers can request LLM completions through the agent during tool execution. This enables agent-in-the-loop workflows (data analysis, content generation, decision-making).

Sampling is **enabled by default**. Configure per server:

```yaml
mcp_servers:
  my_server:
    command: "npx"
    args: ["-y", "my-mcp-server"]
    sampling:
      enabled: true           # default: true
      model: "gemini-3-flash" # model override (optional)
      max_tokens_cap: 4096    # max tokens per request
      timeout: 30             # LLM call timeout (seconds)
      max_rpm: 10             # max requests per minute
      allowed_models: []      # model whitelist (empty = all)
      max_tool_rounds: 5      # tool loop limit (0 = disable)
      log_level: "info"       # audit verbosity
```

Servers can also include `tools` in sampling requests for multi-turn tool-augmented workflows. The `max_tool_rounds` config prevents infinite tool loops. Per-server audit metrics (requests, errors, tokens, tool use count) are tracked via `get_mcp_status()`.

Disable sampling for untrusted servers with `sampling: { enabled: false }`.

## Notes

- MCP tools are called synchronously from the agent's perspective but run asynchronously on a dedicated background event loop
- Tool results are returned as JSON with either `{"result": "..."}` or `{"error": "..."}`
- The native MCP client is independent of `mcporter` -- you can use both simultaneously
- Server connections are persistent and shared across all conversations in the same agent process
- Adding or removing servers requires restarting the agent (no hot-reload currently)
