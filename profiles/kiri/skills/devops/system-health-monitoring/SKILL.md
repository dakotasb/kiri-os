---
description: Generate automated system health dashboards for infrastructure monitoring. Compiles uptime, performance metrics (CPU/memory/disk), service/container status, active alerts, and backup status into structured reports. Saves to MemPalace or delivers via configured channels.
name: system-health-monitoring
tags: [monitoring, health, dashboard, infrastructure, sre, devops, system-metrics, reporting]
---

# System Health Monitoring Skill

Generates comprehensive system health reports suitable for daily dashboards, incident response, or operational reviews.

## When to Use

Trigger this skill when:
- Generating **daily/weekly system health dashboards** (scheduled cron jobs)
- Investigating infrastructure issues (combine with systematic-debugging)
- Onboarding new infrastructure and establishing baselines
- Creating scheduled health reports for stakeholders
- Validating service status before/after deployments
- Compiling resource utilization trends
- **Querying MemPalace for devops_sre monitoring data** and infrastructure status

## Prerequisites

- Access to system tools: `uptime`, `free`, `df`, `ps`, `docker`
- MemPalace access for historical context and report storage
- Terminal/network access to check service endpoints (optional)

## Procedure

### 1. Query Historical Context (MemPalace)

Search for previous health reports to identify trends and comparison baselines:

```yaml
query: "system health dashboard infrastructure monitoring alerts devops_sre"
limit: 5
filters: wing=agent_org hall=operations room=reports
```

Note any recurring alerts or patterns from previous reports. Also query MemPalace graph stats to track infrastructure growth (palace/room/drawer counts).

### 2. Gather Current System Metrics

Execute these commands to collect live system data:

```bash
# System uptime and load
uptime

# Memory usage
total_mem=$(free -h | awk '/^Mem:/{print $2}')
used_mem=$(free -h | awk '/^Mem:/{print $3}')
avail_mem=$(free -h | awk '/^Mem:/{print $7}')
mem_pct=$(free | awk '/^Mem:/{printf "%.1f", $3/$2*100}')

# Disk usage
df -h /

# Top resource consumers (CPU and Memory)
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# Docker containers (if applicable)
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check for stale lock files
ls -la ~/.hermes/checkpoints/*.lock 2>/dev/null || echo "No lock files"
```

### 3. Check Service Health Endpoints

For containerized services or local APIs:

```bash
# Qdrant health
curl -s http://localhost:6333/health

# Neo4j HTTP (may require auth)
curl -s http://localhost:7474/

# Application-specific endpoints
curl -s http://localhost:8000/health  # Hermes gateway
```

### 4. Compile Structured Report

Format findings into a dashboard with these sections:

**Section Template:**

```markdown
# Daily System Health Dashboard
**Report Date:** [TIMESTAMP]  
**Report ID:** health-dashboard-[YYYY-MM-DD]  

## 1. System Uptime
| Metric | Value |
|--------|-------|
| **System Uptime** | [DAYS] days, [HOURS] hours |
| **Load Average** | [1min], [5min], [15min] |
| **Logged In Users** | [COUNT] |

**Status:** [✅/⚠️/❌] HEALTHY / DEGRADED / CRITICAL

## 2. Performance Metrics

### Memory Usage
| Type | Total | Used | Available | Usage % |
|------|-------|------|-----------|---------|
| RAM | [X] | [X] | [X] | [X]% |
| Swap | [X] | [X] | [X] | - |

**Memory Status:** [Excellent/Good/Warning/Critical]

### Disk Usage
| Filesystem | Size | Used | Available | Usage |
|------------|------|------|-----------|-------|
| /dev/... | [X] | [X] | [X] | [X]% |

### Top Resource Consumers
| Process | CPU % | Memory % | User |
|---------|-------|----------|------|
| ... | ... | ... | ... |

## 3. Active Alerts

| Severity | Alert | Details | Status |
|----------|-------|---------|--------|
| [🔴/🟡/🟢] | [NAME] | [DESC] | [NEW/ACK/RESOLVED] |

### Recent Errors (Last 24h)
- [List any errors from logs or previous reports]

## 4. Resource Utilization

| Service | Status | CPU % | Memory | Notes |
|---------|--------|-------|--------|-------|
| [SERVICE] | [✅/⚠️/❌] | [%] | [XMB] | [NOTE] |

**Container Summary:** (if Docker in use)
```
[NAMES] [STATUS] [PORTS]
```

## 5. Backup Status

| System | Last Backup | Status | Next Scheduled |
|--------|-------------|--------|----------------|
| [SYSTEM] | [TIME] | [✅/⚠️] | [TIME] |

---

## Summary

| Category | Status | Trend |
|----------|--------|-------|
| System Uptime | [✅/⚠️] | [📈/📉/➡️] |
| Performance | [✅/⚠️] | [📈/📉/➡️] |
| Active Alerts | [✅/⚠️] | [📈/📉/➡️] |
| Resources | [✅/⚠️] | [📈/📉/➡️] |
| Backups | [✅/⚠️] | [📈/📉/➡️] |

**Overall System Health:** [✅ HEALTHY / ⚠️ ATTENTION REQUIRED / ❌ CRITICAL]
```

### 5. Save to MemPalace

File the report with appropriate taxonomy:

```yaml
palace: agent_org  # or infrastructure, operations, etc.
wing: agent_org
hall: operations
room: reports
closet: health_dashboard
importance: 4
topic: daily-health-dashboard-[YYYY-MM-DD]
tags: [health, monitoring, infrastructure, daily-report]
```

### 6. Deliver Report (if required)

If the task specifies delivery (e.g., to Discord, email):
- Format appropriately for the channel
- Include only actionable items for non-technical stakeholders
- Highlight critical alerts prominently

## Interpretation Guide

### Load Average Severity
- **< 1.0** (per CPU core): ✅ Healthy
- **1.0-2.0**: ⚠️ Moderate load
- **> 2.0**: 🔴 Investigate

### Memory Usage Severity
- **< 50%**: ✅ Excellent
- **50-70%**: 🟡 Normal
- **70-85%**: ⚠️ Monitor
- **> 85%**: 🔴 Critical (OOM risk)

### Disk Usage Severity
- **< 50%**: ✅ Excellent
- **50-70%**: 🟡 Normal
- **70-85%**: ⚠️ Plan cleanup
- **> 85%**: 🔴 Critical

## Cron/Scheduled Execution Notes

When running as a scheduled job (e.g., daily cron):
- User will NOT be present — make autonomous decisions, never call `clarify`
- Final response auto-delivers — do NOT use `send_message` yourself; just produce output
- If no new alerts/status changes: respond with exactly "[SILENT]" to suppress delivery
- Query MemPalace agent_org namespace for devops_sre monitoring configuration

### MemPalace Infrastructure Checks

When monitoring a MemPalace deployment, additionally check:

```bash
# Qdrant collections (vector DB)
curl -s http://localhost:6333/collections | jq '.result.collections | length'

# Neo4j graph DB (may need credentials)
docker exec mempalace-neo4j cypher-shell -u neo4j -p [PASSWORD] "CALL dbms.components() YIELD name, versions"

# Checkpoint repository count
ls ~/.hermes/checkpoints/ | wc -l
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Git lock files | Previous crash | `rm ~/.hermes/checkpoints/*.lock` |
| Docker container down | OOM or crash | `docker restart [container]` |
| High load | Resource contention | Identify top processes, scale if needed |
| Memory pressure | Memory leak | Restart service or investigate leak |
| Disk full | Logs or temp files | `df -h` then clean `/var/log`, `/tmp` |
| Neo4j auth fails | Password required | Use docker exec with -p flag or check ~/.hermes/.env |

## Related Skills

- **systematic-debugging**: When investigating alert root causes
- **deploy-agent**: When health checks fail and redeployment needed
- **webhook-subscriptions**: For setting up automated alert notifications

## Verification

After completion, verify:
- [ ] All 5 sections populated with current data
- [ ] Trend indicators make sense vs previous report
- [ ] Report saved to MemPalace with correct taxonomy
- [ ] Critical alerts (if any) highlighted for immediate action