# Hermes Agent System Data Sources

Mapping of where real Hermes Agent OS operational data lives for dashboard integration.

## Real-Time Data Locations

| Data Type | Location | Access Method | Format |
|-----------|----------|---------------|--------|
| Agent Status | `~/.hermes/state/status.json` | File read | JSON |
| Background Processes | `~/.hermes/state/processes.json` | File read | JSON |
| Cron Jobs | `~/.hermes/profiles/*/cron/jobs.json` | File read | JSON |
| Session Transcripts | `~/.hermes/profiles/*/sessions/` | Directory scan | JSONL |
| Gateway Logs | `~/.hermes/logs/gateway.log` | Tail/follow | Text |
| Memory Store | `~/.hermes/profiles/*/memory/memory.db` | SQLite | SQLite |
| Kanban Boards | `~/.hermes/profiles/*/kanban/*.sqlite` | SQLite | SQLite |
| Agent Profiles | `~/.hermes/profiles/` | Directory listing | Folders |

## Live Monitoring Commands

```bash
# Active sessions
hermes sessions list --active

# Running agents
hermes status --all

# Cron jobs
hermes cron list

# Gateway log tail
tail -f ~/.hermes/logs/gateway.log
```

## Data Source Categories

### System Health (Use Sparingly)
- CPU/MEM from `/proc/*` - **PC hardware metrics, NOT agent data**
- Disk usage from `df` - **System level, NOT application level**
- Use only for infrastructure context, not primary dashboard metrics

### Agent Operational (Primary Focus)
- Agent count from profiles directory
- Task count from sessions/activity
- Health from gateway logs (errors, warnings)
- Status from state/processes.json

### Business Intelligence
- Success rates from audit chains
- Performance from session durations
- Memory usage from SQLite queries

## Key Lesson

**SystemMetrics should show agent process metrics, NOT PC hardware metrics.**

When user says "real data" in Hermes context, they mean:
- ✅ How many agents running
- ✅ What tasks are active
- ✅ Agent health status
- ❌ NOT CPU temperature
- ❌ NOT disk free space
- ❌ NOT memory usage (unless per-agent)

## Implementation Mapping

Replace mock data constants with:

| Mock Source | Replace With |
|-------------|--------------|
| `INITIAL_AGENTS` array | Scan `~/.hermes/profiles/` |
| `INITIAL_OPERATIONS` | Read `processes.json` + cron jobs |
| `INITIAL_HEALTH` | Parse gateway logs for errors |
| `INITIAL_TASKS` | Query `kanban/*.sqlite` |

Last updated: 2026-05-18
Session: dashboard-v2-phase2
