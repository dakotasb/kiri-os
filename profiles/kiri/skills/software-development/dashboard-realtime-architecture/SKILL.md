---
name: dashboard-realtime-architecture
description: |
  Design and implement real-time data architecture for React/Next.js dashboards.
  Provides WebSocket connectivity with automatic polling fallback (5-second interval),
  connection health monitoring, reactive hooks for dashboard widgets, click interaction
  handlers with modal systems, and realistic data simulation for development.
version: 1.0.0
author: Hermes Agent
license: MIT
category: software-development
tags: [dashboard, websocket, realtime, polling, react-hooks, simulation, data-architecture, reactive]
triggers:
  - Dashboard needs live data from system commands
  - Build real-time API for metrics from ps/proc/df
  - Live data refresh for dashboard modules
  - Reactive dashboard data architecture
  - Dashboard with live agent status updates
  - Real-time metrics and operations tracking
  - Dashboard polling fallback for WebSocket
  - Live simulation for dashboard development
  - Click interactions for dashboard cards
  - Modal system for agent/operation details
  - Connection status indicator for dashboard
  - Dashboard WebSocket fallback strategy
  - Dashboard data refresh patterns
  - Realtime React dashboard hooks
---

# Dashboard Real-Time Architecture

Design and implement production-ready real-time data architecture for React/Next.js dashboards. Provides WebSocket connectivity with intelligent polling fallback, reactive hooks, connection health monitoring, click interactions with modal systems, and realistic data simulation.

## ## Critical Clarification: "Real Data" Definition

**When building dashboards for Hermes Agent OS, "real data" means OPERATIONAL METRICS, not SYSTEM METRICS.**

The user explicitly expects:
- ✅ **Agent operational data**: Running agent count, active tasks, health status, uptime
- ✅ **Application-level metrics**: Task completion rates, session activity, cron job status
- ✅ **Business intelligence**: Agent effectiveness, task throughput, deployment history

**NOT acceptable (despite being "real"):**
- ❌ CPU usage from `/proc/cpuinfo`
- ❌ Memory usage from `/proc/meminfo`
- ❌ Disk usage from `df -h`
- ❌ Load averages, temperature, hardware stats

**Lesson learned**: User said *"Last version did that and I hated it."*

PC hardware metrics belong in infrastructure monitoring, not the Agent OS dashboard.

**Reference**: See [references/hermes-data-sources.md](./references/hermes-data-sources.md) for exact data locations and access patterns.

---

## When To Use

Use this skill when:
- Dashboard needs **live/real-time updates** from backend
- Want **WebSocket primary** with **HTTP polling fallback**
- Need **reactive hooks** for dashboard widgets that subscribe to data changes
- Want **connection health monitoring** with visual indicators
- Need **click interactions** that open modals/timelines
- Want **realistic simulation** for development/testing without backend
- Building agent dashboards, monitoring dashboards, command centers, or system health UIs

## What This Skill Produces

1. **WebSocket + Polling Hook** (useRealtime.ts) - Core reactive hook with fallback
2. **Data Refresh Hooks** - Widget-specific hooks for agents, operations, metrics
3. **Connection Indicator** - Visual status of connection (connecting/connected/polling/disconnected)
4. **Click Interaction Components** - Timelines, modals, filtered views
5. **Simulation Engine** - Realistic data updates for development
6. **Architecture Documentation** - Complete usage guide with examples

## Implementation Workflow

### Step 1: Install Core Real-Time Hook

Create `src/hooks/useRealtime.ts` with WebSocket + polling fallback:

```typescript
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "polling";

interface UseRealtimeOptions {
  wsUrl?: string;
  fallbackInterval?: number; // ms, default: 5000
  reconnectInterval?: number;  // ms, default: 3000
  maxReconnectAttempts?: number; // default: 5
}

export function useRealtime<T>(
  endpoint: string, // REST endpoint for polling fallback
  initialData: T,
  options: UseRealtimeOptions = {}
) {
  const {
    wsUrl,
    fallbackInterval = 5000,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<Error | null>(null);
  const [connectionHealth, setConnectionHealth] = useState(100);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPingRef = useRef<number>(Date.now());
  const isManualDisconnectRef = useRef(false);

  // Poll function
  const pollData = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const newData = await response.json();
      setData(newData);
      setLastUpdate(new Date());
      setError(null);
      setConnectionHealth((prev) => Math.min(prev + 5, 100));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Poll failed"));
      setConnectionHealth((prev) => Math.max(prev - 10, 0));
    }
  }, [endpoint]);

  // Manual refresh
  const refresh = useCallback(() => pollData(), [pollData]);

  // Start polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;
    setStatus("polling");
    pollingIntervalRef.current = setInterval(pollData, fallbackInterval);
    pollData(); // immediate first poll
  }, [fallbackInterval, pollData]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Initialize
  useEffect(() => {
    // Start WebSocket if URL provided
    if (wsUrl) {
      // ... WebSocket setup
    } else {
      startPolling();
    }

    const healthInterval = setInterval(() => {
      const timeSinceLastPing = Date.now() - lastPingRef.current;
      if (timeSinceLastPing > 30000 && status === "connected") {
        setConnectionHealth((prev) => Math.max(prev - 5, 0));
      }
    }, 5000);

    return () => {
      isManualDisconnectRef.current = true;
      stopPolling();
      clearInterval(healthInterval);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [wsUrl, startPolling, stopPolling, status]);

  return { data, lastUpdate, status, error, refresh, connectionHealth };
}

export default useRealtime;
```

### Step 2: Create Widget-Specific Hooks

**Fleet Health Hook** (`src/hooks/useFleetHealth.ts`):

```typescript
import { useMemo, useCallback } from "react";
import { useRealtime } from "./useRealtime";

interface Agent {
  agentId: string;
  name: string;
  role: string;
  status: "online" | "offline" | "busy" | "idle";
}

export function useFleetHealth(wsUrl?: string) {
  const initialData: Agent[] = [
    { agentId: "agent-1", name: "Codex-Coder", role: "Builder", status: "online" },
    { agentId: "agent-2", name: "Claude-Architect", role: "Architect", status: "busy" },
    // ... more agents
  ];

  const { data, status, lastUpdate, error, refresh, connectionHealth } = 
    useRealtime<Agent[]>("/api/agents/fleet", initialData, {
      wsUrl: wsUrl ? `${wsUrl}/agents` : undefined,
      fallbackInterval: 5000,
    });

  // Compute statistics
  const stats = useMemo(() => {
    const total = data.length;
    const online = data.filter((a) => a.status === "online").length;
    const busy = data.filter((a) => a.status === "busy").length;
    const idle = data.filter((a) => a.status === "idle").length;
    const offline = data.filter((a) => a.status === "offline").length;
    const healthPercentage = total > 0 ? Math.round(((online + busy) / total) * 100) : 0;
    return { total, online, busy, idle, offline, healthPercentage };
  }, [data]);

  return {
    agents: data,
    stats,
    isLoading: status === "connecting",
    isRealtime: status === "connected" || status === "polling",
    connectionStatus: status,
    lastUpdate,
    error,
    refresh,
    connectionHealth,
  };
}
```

**Operations Hook** (`src/hooks/useOperations.ts`):

```typescript
import { useMemo, useCallback } from "react";
import { useRealtime } from "./useRealtime";

interface Operation {
  id: string;
  name: string;
  progress: number;
  status: "pending" | "in_progress" | "completed" | "failed";
  eta: string;
}

export function useOperations(wsUrl?: string) {
  const initialData: Operation[] = [
    { id: "task-1", name: "Code Review", progress: 60, status: "in_progress", eta: "15m" },
  ];

  const { data, status, lastUpdate, error, refresh, connectionHealth } =
    useRealtime<Operation[]>("/api/operations", initialData, {
      wsUrl: wsUrl ? `${wsUrl}/operations` : undefined,
      fallbackInterval: 5000,
    });

  const stats = useMemo(() => ({
    total: data.length,
    pending: data.filter((t) => t.status === "pending").length,
    inProgress: data.filter((t) => t.status === "in_progress").length,
    completed: data.filter((t) => t.status === "completed").length,
  }), [data]);

  return {
    operations: data,
    stats,
    isLoading: status === "connecting",
    connectionStatus: status,
    lastUpdate,
    error,
    refresh,
    connectionHealth,
  };
}
```

### Step 3: Create Connection Indicator

`src/components/dashboard/ConnectionIndicator.tsx`:

```typescript
import { Wifi, WifiOff, RefreshCw, Activity } from "lucide-react";
import { ConnectionStatus } from "@/hooks/useRealtime";

interface ConnectionIndicatorProps {
  status: ConnectionStatus;
  health: number;
  lastUpdate?: Date | null;
}

export function ConnectionIndicator({ status, health, lastUpdate }: ConnectionIndicatorProps) {
  const configs = {
    connecting: { icon: RefreshCw, label: "Connecting", color: "text-amber-500", animate: true },
    connected: { 
      icon: Wifi, 
      label: "Live", 
      color: health >= 80 ? "text-emerald-500" : health >= 50 ? "text-amber-500" : "text-rose-500",
      animate: false 
    },
    disconnected: { icon: WifiOff, label: "Disconnected", color: "text-rose-500", animate: false },
    polling: { icon: Activity, label: "Polling", color: "text-blue-500", animate: true },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-opacity-10`}>
      <Icon className={`h-3.5 w-3.5 ${config.color} ${config.animate ? "animate-spin" : ""}`} />
      <span className={config.color}>{config.label}</span>
      {lastUpdate && (
        <span className="text-muted-foreground">&sdot; Updated {formatDiff(lastUpdate)}</span>
      )}
    </div>
  );
}

function formatDiff(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}
```

### Step 4: Create Click Interaction Components

**Update existing components** to accept onClick props:

```typescript
// AgentStatusCard - add onClick
interface AgentStatusCardProps {
  name: string;
  role: string;
  status: AgentStatusType;
  onClick?: () => void; // NEW
  className?: string;
}

// Usage: onClick opens AgentDetailModal

// OperationItem - add onClick
interface OperationItemProps {
  id: string;
  name: string;
  progress: number;
  status: TaskStatus;
  eta: string;
  onClick?: () => void; // NEW
}

// Usage: onClick opens OperationTimeline

// TeamCommandCard - add onClick
interface TeamCommandCardProps {
  team: TeamData;
  onClick?: (team: TeamData) => void; // NEW
}

// Usage: onClick opens FilteredTeamsView

// MarketWebsiteRow - add externalUrl
interface MarketWebsiteRowProps {
  name: string;
  visits: number;
  trend: TrendDirection;
  change: number;
  externalUrl?: string; // NEW
}

// Usage: externalUrl="https://example.com" opens in new tab
```

### Step 5: Create Simulation Engine

`src/lib/simulation.ts`:

```typescript
export interface SimulationConfig {
  enabled: boolean;
  intervalMs: number;
  volatility: "low" | "medium" | "high";
}

export class DashboardSimulation {
  private config: SimulationConfig;
  private callback: (update: any) => void;
  private intervalId: NodeJS.Timeout | null = null;
  private agents: any[] = [];
  private operations: any[] = [];

  constructor(config: SimulationConfig, callback: (update: any) => void) {
    this.config = config;
    this.callback = callback;
    this.initializeAgents();
    this.initializeOperations();
  }

  start() {
    this.callback({ type: "init", agents: [...this.agents], operations: [...this.operations] });
    
    this.intervalId = setInterval(() => {
      this.simulateUpdate();
    }, this.config.intervalMs);
  }

  private simulateUpdate() {
    // Randomly update agent statuses
    this.agents.forEach((agent) => {
      if (Math.random() < 0.1) {
        const statuses = ["online", "offline", "busy", "idle"];
        agent.status = statuses[Math.floor(Math.random() * statuses.length)];
      }
    });

    // Progress operations
    this.operations.forEach((op) => {
      if (op.status === "in_progress") {
        op.progress = Math.min(op.progress + Math.random() * 5, 100);
        if (op.progress >= 100) op.status = "completed";
      }
    });

    this.callback({ type: "update", agents: this.agents, operations: this.operations });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// React hook wrapper
export function useSimulation(config: SimulationConfig) {
  const [state, setState] = useState<any>(null);
  const simRef = useRef<DashboardSimulation | null>(null);

  useEffect(() => {
    if (config.enabled && typeof window !== "undefined") {
      simRef.current = new DashboardSimulation(config, (update) => {
        setState(update.type === "init" 
          ? { agents: update.agents, operations: update.operations }
          : (prev: any) => ({ ...prev, ...update })
        );
      });
      simRef.current.start();
      return () => simRef.current?.stop();
    }
  }, [config.enabled, config.intervalMs]);

  return { state };
}
```

### Step 6: Usage in Dashboard Page

```typescript
"use client";

import { useState } from "react";
import { useFleetHealth, useOperations } from "@/hooks";
import { useSimulation } from "@/lib/simulation";
import { ConnectionIndicator } from "@/components/dashboard/ConnectionIndicator";
import { OperationTimeline } from "@/components/dashboard/OperationTimeline";
import { AgentDetailModal } from "@/components/modals/AgentDetailModal";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export default function DashboardPage() {
  const fleet = useFleetHealth(WS_URL);
  const ops = useOperations(WS_URL);
  
  // Enable simulation in development
  const simulation = useSimulation({
    enabled: process.env.NODE_ENV === "development",
    intervalMs: 5000,
    volatility: "medium",
  });

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ConnectionIndicator 
          status={fleet.connectionStatus} 
          health={fleet.connectionHealth}
          lastUpdate={fleet.lastUpdate}
        />
      </div>

      {/* Clickable cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DashboardModule title="Agent Fleet Health">
          <div className="grid grid-cols-2 gap-2">
            {fleet.agents.map((agent) => (
              <AgentStatusCard
                key={agent.agentId}
                {...agent}
                onClick={() => setSelectedAgent(agent)}
              />
            ))}
          </div>
        </DashboardModule>

        <DashboardModule title="Operations Center">
          <div className="space-y-2">
            {ops.operations.map((op) => (
              <OperationItem
                key={op.id}
                {...op}
                onClick={() => setSelectedOperation(op)}
              />
            ))}
          </div>
        </DashboardModule>
      </div>

      {/* Modals */}
      <AgentDetailModal
        agent={selectedAgent}
        open={!!selectedAgent}
        onOpenChange={(open) => !open && setSelectedAgent(null)}
      />
      
      <OperationTimeline
        operation={selectedOperation}
        open={!!selectedOperation}
        onOpenChange={(open) => !open && setSelectedOperation(null)}
      />
    </div>
  );
}
```

## Data Source Audit Pattern

Before implementing dashboards, audit existing data sources to identify mock vs real data:

### Audit Steps

1. **Inventory all hooks/components** that display data
2. **Check for hardcoded constants** (INITIAL_*, MOCK_*, test data)
3. **Verify API endpoints** return actual data vs placeholder
4. **Map real data sources** to the Hermes filesystem
5. **Dispatch targeted fixes** per component

### Common Mock Data Patterns to Replace

| Pattern | Location | Replace With |
|---------|----------|--------------|
| `const INITIAL_AGENTS = [...]` | hooks/useFleetHealth.ts | API fetch from `/api/agents/fleet` |
| `Math.random() > 0.1` | hooks/useHealthMonitoring.ts | Real endpoint fetch |
| Static `agents.ts` file | data/agents.ts | Dynamic profile scan |
| `INITIAL_OPERATIONS_DATA` | hooks/useOperations.ts | Real process/task query |

### Workflow

```
Audit (keystone) → Map sources (archivist) → Fix per module (forge/sentry/mason/lens)
```

**Reference**: Session 20260518 showed this pattern successfully identifying 7 modules needing fixes.

---

## Files Created

```
src/
├── hooks/
│   ├── index.ts                 # Export all hooks
│   ├── useRealtime.ts           # Core WebSocket/polling hook
│   ├── useFleetHealth.ts        # Agent fleet subscription
│   ├── useOperations.ts         # Operations progress
│   ├── useMetrics.ts            # Intelligence/performance/memory metrics
│   └── useAgentChat.ts          # Per-agent chat (Phase 3)
├── components/
│   └── dashboard/
│       ├── ConnectionIndicator.tsx   # Connection status UI
│       ├── OperationTimeline.tsx     # Operation timeline modal
│       ├── FilteredTeamsView.tsx     # Teams filter modal
│       └── ChatPanel.tsx             # Chat interface (Phase 3)
├── lib/
│   └── simulation.ts            # DashboardSimulation class
└── docs/
    └── REALTIME_ARCHITECTURE.md # Complete documentation
```

### Reference Files

**Full Phase 3 Chat Interface spec:** see `references/chat-interface-implementation.md`
- Complete `useAgentChat` hook
- ChatPanel component code
- API routes
- Slash commands: `/task`, `/review`, `/status`, `/help`
- Message types and keyboard shortcuts

**Common pitfall:** This feature was initially missed in Phase 3 planning because it's documented in the UX Design Specification (`ux_design_spec.md`) but was overlooked in high-level roadmaps. Always check the full spec when feature planning.

## Multi-Agent Telemetry Integration Pattern

When building real-time dashboards with live system data, use parallel agent deployment:

### Agent Specialization for Telemetry

| Agent | Responsibility | Deliverable |
|-------|---------------|-------------|
| @relic | Audit existing telemetry | Gap analysis report |
| @mason | Design API architecture | API spec v2.0.0 |
| @keystone | Build API routes | REST endpoints |
| @ember | Update dashboard hooks | Reactive hooks |

### Execution Pattern

```bash
# Deploy agents in parallel for telemetry build
OLLAMA_API_KEY=*** hermes -p relic -z "Audit existing dashboard telemetry..."
OLLAMA_API_KEY=*** hermes -p mason -z "Design API architecture for dashboard..."
OLLAMA_API_KEY=*** hermes -p keystone -z "Build API routes..."
OLLAMA_API_KEY=*** hermes -p ember -z "Update dashboard hooks..."
```

### Common Runtime Error: API Response Shape Mismatch

**Symptom:** `TypeError: data.filter is not a function`

**Cause:** API returns `{ processes: [...], count: N }` but hook expects direct array

**Fix:** Update hook to unwrap response:

```typescript
// BEFORE (fails)
const { data } = useRealtime<FleetStatus[]>("/api/agents/fleet", initialData);
const online = data.filter(a => a.status === "online"); // ❌ data is {processes, count}

// AFTER (works)
interface FleetResponse {
  processes: FleetStatus[];
  count: number;
}
const { data: response } = useRealtime<FleetResponse>("/api/agents/fleet", initialData);
const data = useMemo(() => response?.processes ?? initialData, [response]);
const online = data.filter(a => a.status === "online"); // ✅ data is FleetStatus[]
```

### API Routes from System Commands

```typescript
// src/app/api/agents/fleet/route.ts
import { execSync } from "child_process";

export async function GET() {
  const output = execSync("ps aux", { encoding: "utf-8" });
  const processes = output.split("\n")
    .slice(1) // Skip header
    .filter(line => line.includes("hermes") || line.includes("node"))
    .map(line => {
      const cols = line.trim().split(/\s+/);
      return {
        pid: cols[1],
        cpu_percent: cols[2],
        mem_percent: cols[3],
        command: cols.slice(10).join(" "),
        status: "running"
      };
    });
  
  return Response.json({
    timestamp: new Date().toISOString(),
    count: processes.length,
    processes
  });
}
```

## Testing Checklist

- [ ] WebSocket connects and receives data
- [ ] Polling activates when WebSocket fails
- [ ] Connection indicator shows correct status
- [ ] Agent cards show live status updates
- [ ] Clicking agent opens modal with details
- [ ] Operations show live progress updates
- [ ] Clicking operation opens timeline
- [ ] Simulation generates realistic updates
- [ ] Manual refresh button works
- [ ] Connection health degrades/reconnects properly
