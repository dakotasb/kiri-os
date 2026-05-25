# Hermes Fleet Implementation Brief
# Pass this entire file as context to a new Hermes session.

---

## What You Are Doing and Why

You are implementing a set of upgrades to an existing Hermes agent fleet running in WSL2 (Ubuntu-24.04) on this machine. These changes come from a full system audit. Do not redesign, do not add features beyond what is listed. Execute each step, verify it worked, then move to the next.

The machine has an H310M motherboard with a 9700K CPU that has been experiencing MCE (Machine Check Exception) crashes under sustained all-core load — VRM instability. Every change here either directly reduces CPU burst load or makes the orchestration system more reliable. This matters for hardware stability, not just software quality.

The user intentionally uses cold-start CLI dispatch (`hermes -p <agent> --message "..."`) as Kiri's orchestration model. Do not change this to native delegation. The upgrades work within that model.

---

## Environment Facts (verified, do not re-derive)

- WSL distro: Ubuntu-24.04, running as root for most processes
- Hermes profiles: `/home/dakotasb/.hermes/profiles/` — 38 profiles defined
- Active gateways (tmux): `hermes` (default), `kiri`, `forge` — started via `~/.hermes/start-gateways.sh`
- Main config: `/home/dakotasb/.hermes/config.yaml`
- Kiri profile config: `/home/dakotasb/.hermes/profiles/kiri/config.yaml`
- Dashboard: `/root/dashboard/` (Next.js 14, running on port 3003 via `next dev`)
- Dashboard wrong path (used by agents): `/home/dakotasb/dashboard/` — does not exist, causes exit code 2 failures
- MemPalace: Node.js process at `/home/dakotasb/mempalace/src/mcpServer.js`, port 3100
- Docker: running with Qdrant (port 6333) and Neo4j (port 7687) containers for MemPalace backends
- systemd: already enabled (`systemd=true` in `/etc/wsl.conf`), systemd IS running — but user systemd service files have not been created yet
- state.db: `/home/dakotasb/.hermes/state.db` — 381MB (only 46.7MB real content, rest is FTS index bloat), 404 sessions, 27,141 messages
- kanban.db: `/home/dakotasb/.hermes/kanban.db` — schema is live, zero rows (never used)
- kanban dispatcher: already embedded in each gateway, runs every 60 seconds — it just has no tasks to dispatch
- Broken cron job: `592016ab98d1` (`mempalace-mcp-health-v2`) — script works correctly but throws 403 on Discord delivery every 5 minutes, flooding error logs
- git dubious ownership: hermes-agent repo at `/home/dakotasb/hermes-agent/` owned by dakotasb but run as root — blocks git operations

---

## Implementation Steps

Work through these in order. After each step, verify it worked before proceeding.

---

### STEP 1 — Fix the dashboard path confusion

Every agent currently looks for the dashboard at `/home/dakotasb/dashboard/` but it lives at `/root/dashboard/`. This causes exit-code-2 failures on nearly every dashboard dispatch.

```bash
ln -s /root/dashboard /home/dakotasb/dashboard
```

Verify:
```bash
ls /home/dakotasb/dashboard/package.json
# Should show the file, not "No such file or directory"
```

Then update every agent SOUL.md that references the dashboard path. Check which ones have it hardcoded:
```bash
grep -r '/home/dakotasb/dashboard' /home/dakotasb/.hermes/profiles/*/SOUL.md 2>/dev/null
grep -r '/home/dakotasb/dashboard' /home/dakotasb/.hermes/skills/ 2>/dev/null | grep -v '.log' | head -20
```

For each file found, update the path reference to use `/home/dakotasb/dashboard` (the symlink, which works from both root and dakotasb contexts).

---

### STEP 2 — Fix the cron 403 flood

The mempalace watchdog cron script works correctly but cannot deliver its result to Discord (bot lacks channel access), generating 403 errors every 5 minutes in the error log.

```bash
hermes cron edit 592016ab98d1 --deliver none
```

Verify:
```bash
hermes cron list
# Entry for mempalace-mcp-health-v2 should show deliver: none or standalone
```

Also check the tempo-tuesday-briefing job which has the same delivery problem:
```bash
hermes cron list
# Look at entry edd9d238e072 — if it shows last_delivery_error, fix its delivery channel
# or leave it; it only fires Tuesday at 06:00 so it's low noise
```

---

### STEP 3 — Prune and vacuum state.db

The main state.db is 381MB due to FTS index bloat across 404 sessions. Pruning removes sessions AND their FTS entries. Do this while gateways are running (SQLite WAL mode handles concurrent access safely).

```bash
hermes sessions prune --days 30
```

Then vacuum to reclaim the freed space. The gateways must not be actively writing during VACUUM — do this at a quiet moment:

```bash
# Check nothing is actively using the DB right now
# Then vacuum
sqlite3 /home/dakotasb/.hermes/state.db 'VACUUM;'
```

Also prune profile-level databases:
```bash
hermes -p kiri sessions prune --days 30
hermes -p forge sessions prune --days 30
sqlite3 /home/dakotasb/.hermes/profiles/kiri/state.db 'VACUUM;'
sqlite3 /home/dakotasb/.hermes/profiles/forge/state.db 'VACUUM;'
```

Verify size reduction:
```bash
du -sh /home/dakotasb/.hermes/state.db
du -sh /home/dakotasb/.hermes/profiles/kiri/state.db
du -sh /home/dakotasb/.hermes/profiles/forge/state.db
# Should be significantly smaller — target under 80MB for main, under 10MB for profiles
```

---

### STEP 4 — Update main config (pruning, kanban concurrency)

Edit `/home/dakotasb/.hermes/config.yaml`. Make these exact changes:

**sessions section** — enable auto-pruning:
```yaml
sessions:
  auto_prune: true          # change from false
  retention_days: 30        # change from 90
  vacuum_after_prune: true  # already true, keep it
  min_interval_hours: 24    # already set, keep it
```

**kanban section** — add if not present, or update:
```yaml
kanban:
  max_spawn: 2
  dispatch_interval_seconds: 60
  failure_limit: 2
```

`max_spawn: 2` means at most 2 kanban workers running simultaneously across the whole board at any time. This is a safety net for the VRM situation — task_links (Step 6) handle the real serialization.

Verify the config change is valid:
```bash
hermes config validate 2>/dev/null || hermes status 2>/dev/null | head -5
# If validate doesn't exist, just check that hermes starts without error
```

---

### STEP 5 — Create systemd user services for MemPalace

systemd is running. The service files were planned but never written. Create them now.

First, create the directory:
```bash
mkdir -p /home/dakotasb/.config/systemd/user/
```

Create the MCP service file at `/home/dakotasb/.config/systemd/user/mempalace-mcp.service`:

```ini
[Unit]
Description=MemPalace MCP Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/dakotasb/mempalace/src
Environment=MCP_TRANSPORT=http
Environment=MCP_PORT=3100
Environment=QDRANT_URL=http://localhost:6333
Environment=NEO4J_URL=bolt://localhost:7687
Environment=NEO4J_USER=neo4j
Environment=NEO4J_PASSWORD=mempalace
ExecStart=/usr/bin/node src/mcpServer.js
Restart=always
RestartSec=10
StandardOutput=append:/home/dakotasb/.hermes/logs/mempalace-mcp.log
StandardError=append:/home/dakotasb/.hermes/logs/mempalace-mcp.log

[Install]
WantedBy=default.target
```

Enable and start it:
```bash
systemctl --user daemon-reload
systemctl --user enable mempalace-mcp.service
systemctl --user start mempalace-mcp.service
```

Verify:
```bash
systemctl --user status mempalace-mcp.service
curl -s http://localhost:3100/health
ss -tlnp | grep 3100
# Should show the port listening
```

Once the systemd service is confirmed working, the existing cron watchdog (`mempalace-mcp-health-v2`) is redundant. Disable it (systemd's Restart=always handles restarts now):
```bash
hermes cron edit 592016ab98d1 --enabled false
# Or remove entirely: hermes cron remove 592016ab98d1
```

---

### STEP 6 — Update Kiri's system prompt to use kanban dispatch

This is the core orchestration upgrade. Kiri moves from blind terminal dispatches to structured kanban tasks with dependency chains.

Edit `/home/dakotasb/.hermes/profiles/kiri/config.yaml`.

Replace the `system_prompt` value with the following (preserve YAML formatting — use the `|` block scalar style):

```yaml
system_prompt: |
  You are Kiri, the Conductor of the Kiri Agent OS.

  MISSION: Transform user intent into agent execution using structured task dispatch.

  DISPATCH MODEL — USE KANBAN, NOT TERMINAL:

  For all implementation work, use kanban tasks instead of hermes CLI dispatches:

  1. CREATE a task:
     terminal(command="hermes kanban create --assignee <agent> --title '<short title>' --body '<full spec with file paths, success criteria, and what to produce>'")

  2. CHAIN tasks with dependencies (so they run sequentially, not simultaneously):
     terminal(command="hermes kanban link <parent_task_id> <child_task_id>")

  3. CHECK progress:
     terminal(command="hermes kanban show <task_id>")
     terminal(command="hermes kanban list --status running")

  4. ON FAILURE — re-dispatch with corrected spec:
     terminal(command="hermes kanban edit <task_id> --body '<revised spec>'")
     terminal(command="hermes kanban unblock <task_id>")

  AGENT MAPPING:
  - Code/build: forge, mason, keystone
  - Research/analysis: ember, compass, chronicle
  - Design/UI: palette
  - Deploy: launchpad
  - Memory/knowledge: archivist

  DEPENDENCY CHAIN PATTERN (use for all sequential dev work):
  - Build → Review → Test → Deploy
  - Never create Review task until Build task is complete
  - Use hermes kanban link <build_id> <review_id> to enforce order

  FOR ONE-OFF QUERIES AND CHECK-INS (not full tasks):
  Use CLI with session continuation so the agent has context:
  terminal(command="hermes -p <agent> --continue '<workstream-name>' --quiet --message '<question or update>'")

  CRITICAL RULES:
  - NEVER do implementation work yourself
  - ALWAYS use kanban create for substantial work (more than a quick question)
  - ALWAYS link tasks that have dependencies
  - CLARIFY when intent is ambiguous before creating tasks
  - Check MemPalace for institutional knowledge before deciding
  - NO patch, NO write_file, NO execute_code directly

  NEVER create subagents. Always dispatch via kanban or CLI to real agent profiles.
```

Also update the `directives` list in the same file:
```yaml
directives:
  - Use kanban create + link for all implementation tasks
  - Use --continue flag for CLI check-ins to maintain session context
  - Always chain dependent tasks with hermes kanban link
  - Check MemPalace for institutional knowledge before deciding
  - Escalate strategic questions to unscoped coordinator
```

Verify the config is valid YAML:
```bash
python3 -c "import yaml; yaml.safe_load(open('/home/dakotasb/.hermes/profiles/kiri/config.yaml'))" && echo "VALID"
```

---

### STEP 7 — Fix git dubious ownership

Hermes-agent repo is owned by dakotasb but run as root, blocking any git operations agents attempt inside it.

```bash
git config --global --add safe.directory /home/dakotasb/hermes-agent
git config --global --add safe.directory /home/dakotasb/mempalace
```

Verify:
```bash
git -C /home/dakotasb/hermes-agent log --oneline -3
# Should show commits, not "dubious ownership" error
```

---

### STEP 8 — Initialize kanban board and smoke test

Initialize the kanban board explicitly:
```bash
hermes kanban init
hermes kanban boards
```

Run a smoke test — create one test task, link a dependent, verify dispatcher picks it up:
```bash
# Create parent task assigned to forge
hermes kanban create --assignee forge --title "smoke-test-parent" --body "Echo 'kanban works' to a file at /tmp/kanban_test_parent.txt"

# Get the task ID from output, then create a dependent child
hermes kanban create --assignee forge --title "smoke-test-child" --body "Append 'child also ran' to /tmp/kanban_test_parent.txt"

# Link them (replace PARENT_ID and CHILD_ID with actual IDs)
hermes kanban link <PARENT_ID> <CHILD_ID>

# Verify the dependency is set — child should be in 'todo' not 'ready'
hermes kanban list

# Watch the dispatcher pick up the parent task (next 60s tick)
hermes kanban watch  # Ctrl+C after you see events
```

After dispatcher runs, verify:
```bash
hermes kanban show <PARENT_ID>
hermes kanban show <CHILD_ID>
# Parent should complete first, then child becomes ready and runs
```

---

### STEP 9 — Restart gateways to pick up config changes

Kiri's system_prompt and the main config changes require a gateway restart to take effect.

```bash
~/.hermes/stop-gateways.sh
sleep 3
~/.hermes/start-gateways.sh
```

Verify all three gateways came back up:
```bash
tmux list-sessions
# Should show: hermes, kiri, forge
~/.hermes/gateway-status.sh
```

Check Kiri's logs to confirm it loaded the new config:
```bash
tail -20 /home/dakotasb/.hermes/profiles/kiri/logs/gateway.log
# Should show successful startup, mempalace MCP connected
```

---

### STEP 10 — Verify MemPalace is connected to all gateways

After restart, confirm mempalace MCP is no longer showing connection failures:
```bash
grep 'mempalace' /home/dakotasb/.hermes/profiles/kiri/logs/errors.log | tail -10
grep 'mempalace' /home/dakotasb/.hermes/profiles/forge/logs/errors.log | tail -10
# Should be empty or show successful connection, not "All connection attempts failed"
```

If still failing, check the service:
```bash
systemctl --user status mempalace-mcp.service
curl -s http://localhost:3100/health
```

---

## Verification Checklist

Run through this after all steps complete:

```bash
# 1. Dashboard symlink
ls /home/dakotasb/dashboard/package.json

# 2. Cron 403 fixed
hermes cron list | grep mempalace

# 3. state.db smaller
du -sh /home/dakotasb/.hermes/state.db
# Expect under 80MB

# 4. MemPalace service running
systemctl --user is-active mempalace-mcp.service
curl -s http://localhost:3100/health | head -3

# 5. Gateways up
tmux list-sessions

# 6. Kanban initialized
hermes kanban boards

# 7. No mempalace connection errors since restart
grep -c 'Connect call failed.*3100' /home/dakotasb/.hermes/profiles/kiri/logs/errors.log

# 8. Git safe directory
git -C /home/dakotasb/hermes-agent log --oneline -1
```

---

## What Was NOT Changed (intentional)

- Kiri's cold-start CLI dispatch model is preserved — `--continue` augments it, kanban replaces the fire-and-forget pattern, but Kiri still orchestrates by spawning agents externally
- Native delegation remains disabled in Kiri's profile
- No new Discord bot tokens or gateway processes added
- Dashboard code not modified — the path fix (symlink) is the only dashboard change
- The tempo-tuesday-briefing cron job left as-is (fires once/week, low priority)
- Warm gateways for ember/mason/palette not started — revisit after hardware situation stabilizes

---

## Background: Why Each Change Was Made

**Dashboard symlink:** Agents were looking for `/home/dakotasb/dashboard/package.json` which doesn't exist — the real path is `/root/dashboard/`. This was causing every dashboard dispatch from Kiri to exit with code 2.

**Cron 403 fix:** The mempalace watchdog script runs correctly and restarts MCP when needed. But it was trying to post results to a Discord channel the bot doesn't have access to, generating 403 errors every 5 minutes and flooding the error log.

**state.db prune/vacuum:** 381MB database where only 46.7MB is real content. FTS (full-text search) trigram indexes store message content 3-4 times over. Pruning removes sessions AND their FTS entries. Vacuum reclaims freed pages. Result: smaller memory footprint during session loads, less I/O, less SQLite WAL pressure.

**kanban with task_links:** Replaces blind parallel terminal dispatches. Current pattern spawns multiple Python processes simultaneously (all-core CPU burst), each loading state.db from scratch, making API calls concurrently. On an H310M board, this pattern triggers VRM instability. Kanban with dependency links means tasks run sequentially in a controlled queue — build finishes before review starts, review finishes before test starts. Natural serialization without an arbitrary cap.

**`--continue` flag:** Each `hermes -p forge --message` currently creates a new session with zero knowledge of prior work. With `--continue "workstream-name"`, Forge resumes its existing session for that workstream — it remembers what it already built, what failed, what was decided.

**MemPalace systemd:** The MCP server was being started by a cron script that ran every 5 minutes to detect downtime. systemd's `Restart=always` is a proper process supervisor that restarts within 10 seconds of any crash, and survives WSL restarts automatically. The cron watchdog was the right workaround before systemd was configured; it's now redundant.

**auto_prune + retention_days:** Session database was set to never prune (`auto_prune: false`) with 90-day retention. Result: 900+ sessions accumulated. Setting `auto_prune: true` and `retention_days: 30` means Hermes prunes automatically and the database stays manageable.
