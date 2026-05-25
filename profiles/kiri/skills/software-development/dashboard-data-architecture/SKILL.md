---
name: dashboard-data-architecture
description: Dashboard data source architecture - distinguishing between system metrics, application data, and service-specific orchestration data. Critical for Phase 2 validation of dashboard projects.
version: 1.0.0
tags: [dashboard, data-architecture, validation, phase-2, real-data]
---

# Dashboard Data Architecture

## The Three Data Types

When building dashboards, distinguish between three fundamentally different data sources:

| Type | Source | Example | Use Case |
|------|--------|---------|----------|
| **System Metrics** | OS/hardware | CPU %, memory usage, disk space, uptime | Infrastructure monitoring |
| **Application Data** | App database | User count, transaction volume, active sessions | Business metrics |
| **Orchestration Data** | Control system | Agent fleet status, job queue, dispatch history | Operational control |

## Critical Failure Pattern

**The Phase 2 Trap:** User asks for "real data powering the dashboard modules." Developer removes `Math.random()` and wires APIs, but the APIs return **wrong data type**:

```typescript
// ❌ WRONG: System process data powering agent dashboard
/api/agents/fleet => returns system PIDs (hermes, node, docker)
// Shows: "PID 1234: node" instead of "Kiri: online"

// ❌ WRONG: Static mock data with no API
const agents = [
  { name: "Codex-Coder", role: "Builder" },  // Fake data
  { name: "Claude-Architect", role: "Architect" }  // Doesn't exist
];

// ✅ CORRECT: Actual orchestration system data
/api/hermes/fleet => reads ~/.hermes/profiles/
// Shows: "kiri: online, palette: busy, sentry: idle"
```

## Validation Checklist for Phase 2

Before declaring "real data integration" complete:

- [ ] **Identify the source of truth** for each module
  - Agent status → Where are agents defined? (profiles, db, config...)
  - Task progress → Where is work tracked? (cron, queue, sessions...)
  - Metrics → Where do numbers come from? (API, logs, calculations...)
  
- [ ] **Verify data matches actual system state**
  - Run CLI command: `hermes sessions list`
  - Compare to dashboard display
  - Should match (not "similar" - exact match)
  
- [ ] **Check for mock data constants**
  - Search for `INITIAL_`, `MOCK_`, `DEFAULT_` prefixes
  - Replace with API calls or document as static reference
  
- [ ] **Ensure client-side hydration works**
  - SSR may show "0" initially
  - Client fetch should populate real data
  - Check DevTools Network tab for API calls

## Common Pitfalls

### Pitfall: "Real" = "Not Random"

User: *"Phase 2 should use real data, not Math.random()"*

Developer interprets: *"Replace random with static values or system metrics"*

**Correct interpretation:** *"Query the actual system the dashboard controls"*

### Pitfall: API Exists but Returns Wrong Shape

```typescript
// API returns this:
{ pid: "1234", command: "node", cpu: "0.5%" }

// Dashboard needs this:
{ agentId: "kiri", name: "Kiri", role: "Orchestrator", status: "online" }

// Result: Empty agent cards or "0 Agents Online"
```

**Fix:** Transform data at the API layer or update hooks to consume the right format.

### Pitfall: Silent Fallback to Mock Data

```typescript
const { data } = useRealtime("/api/agents/fleet", { 
  processes: INITIAL_FLEET_DATA  // ← Mock data fallback
});

// If API returns [] or errors, dashboard shows fake agents
```

**Fix:** Remove fallback or make it fail visibly:
```typescript
const { data } = useRealtime("/api/agents/fleet", { processes: [] });
// Empty = clearly wrong, not "Codex-Coder"
```

## Implementation Pattern

### 1. Discover the Source

Ask: *"Where does this information live in the actual system?"*

| Module | Likely Source | Verification Command |
|--------|---------------|---------------------|
| Agent Fleet | Config files, service registry | `ls ~/.hermes/profiles/` |
| Active Tasks | Job queue, cron list | `hermes cron list` |
| Session History | Session store | `hermes sessions list` |
| User Analytics | Database | Query actual DB |

### 2. Create API Layer

```typescript
// app/api/agents/fleet/route.ts
export async function GET() {
  // Read from actual source
  const agents = await readFromSourceOfTruth();
  
  // Transform to dashboard format
  return NextResponse.json({ 
    processes: agents.map(a => ({
      agentId: a.name,
      name: a.name,
      role: determineRole(a),
      status: determineStatus(a)
    }))
  });
}
```

### 3. Update Hooks

```typescript
// Remove mock data
// const INITIAL_DATA = [...]  // DELETE THIS

export function useFleetHealth() {
  // Start empty, fill from API
  const { data } = useRealtime("/api/hermes/fleet", { 
    processes: []  // Empty, not mock
  });
  
  return {
    agents: data?.processes ?? [],
    stats: data?.stats ?? { online: 0, total: 0 }
  };
}
```

### 4. Verify End-to-End

```bash
# Terminal 1: Check source
hermes sessions list | head -5

# Terminal 2: Check API
curl -s localhost:3003/api/hermes/sessions | jq '.sessions[:5]'

# Browser: Check dashboard displays same data
# DevTools → Network → XHR → Refresh → Compare
```

## Phase 2 Acceptance Criteria

A Phase 2 dashboard with "real data" should:

1. **Backend APIs query actual system sources** (not hardcoded JSON)
2. **Frontend hooks consume those APIs** (not INITIAL_DATA constants)
3. **Displayed data matches CLI/system state** (verified by spot-check)
4. **No Math.random()** in data generation
5. **No synthetic agent names** (Codex-Coder, Claude-Architect...) unless they exist

## Related Skills

- `hermes-agent` - For Hermes-specific data integration
- `react-dashboard-validation` - For dashboard implementation verification
---

## Session Log

**2026-05-19: KIRI MVP Phase 2 Correction**

User corrected: *"Yeah this is a failure the real data was supposed to power the dashboard modules not the actual windows system"*

Lesson: System metrics (CPU, memory, processes) were returned by the API, but the dashboard needed **Hermes agent data** (profiles, sessions, cron jobs). 

The fix required:
1. Reading `~/.hermes/profiles/` (directories, not JSON files)
2. Running `hermes sessions list` to get real sessions
3. Replacing `INITIAL_FLEET_DATA` with API-fetched data
4. Making the dashboard display "kiri, palette, sentry..." instead of "Codex-Coder, Claude-Architect..."
