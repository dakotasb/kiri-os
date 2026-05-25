---
name: react-dashboard-scaffolding
description: >
  Scaffold complete React/Next.js dashboard module architecture following an existing design system.
  Creates TypeScript types, mock data, reusable UI components, and main page structure with 
  proper imports. Uses shadcn/ui patterns (Card, Badge, Button), follows project conventions 
  (colors, shadows, typography), and produces consistent module layouts. Use when adding new 
  dashboard pages to Next.js projects with established component libraries.
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [dashboard, nextjs, react, typescript, scaffolding, shadcn-ui, module-architecture]
triggers:
  - Create dashboard page for Next.js
  - Scaffold dashboard modules with types and data
  - Build dashboard architecture following existing design system
  - Create reusable dashboard components
  - Dashboard module structure with mock data
  - Add new dashboard page to existing project
  - Create metrics cards and progress bars
  - Dashboard with agent cards and operations list
---

# React Dashboard Scaffolding

Scaffold complete React/Next.js dashboard module architecture following an existing design system.

## When To Use

Use this skill when:
- Adding new dashboard pages to an existing Next.js project
- Project has established design system (colors, cards, shadows)
- Need consistent module architecture across dashboard pages
- Building agent dashboards, command centers, monitoring UIs
- Project uses shadcn/ui or similar component library

## What This Skill Does

Creates the complete foundation for a dashboard page:
1. **TypeScript types** — Interfaces for all data structures
2. **Mock data** — Realistic sample data for each module
3. **Reusable components** — DashboardModule, MetricsCard, ProgressBar, OperationItem
4. **Main page** — Structured page with all modules, proper imports, helper components

## Key Principles

### Design System Compliance
- Colors: slate/emerald/amber/blue/gray (NO purple/pink)
- Cards: `rounded-lg border bg-card text-card-foreground shadow-sm`
- Icons: lucide-react only
- Typography: `text-sm font-semibold` patterns

### Component Patterns
```tsx
// Dashboard Module wrapper
<DashboardModule title="Module Name" icon={IconComponent}>
  {/* Module content */}
</DashboardModule>

// Metrics Card
<MetricsCard 
  label="Metric Name" 
  value="123" 
  trend="up" 
  trendValue="+12%" 
/>

// Progress Bar
<ProgressBar 
  label="Progress Name" 
  value={75} 
  max={100} 
  showPercentage 
/>
```

## Workflow

### Step 1: Survey Existing Design System

Before creating new components:
```bash
# Read existing UI components to understand patterns
cat src/components/ui/card.tsx
cat src/components/ui/badge.tsx

# Check existing types
cat src/types/*.ts

# Review existing data patterns
cat src/data/*.ts

# Understand tailwind config
cat tailwind.config.ts
```

### Step 2: Create Type Definitions

Create `src/types/dashboard.ts`:
```typescript
export type AgentStatus = "online" | "idle" | "busy" | "offline";

export interface AgentHealth {
  id: string;
  name: string;
  status: AgentStatus;
  role: string;
  lastHeartbeat: string;
  tasksCompleted: number;
  currentTask?: string;
}

export interface ExecutionTask {
  id: string;
  name: string;
  startTime: string;
  duration: number;
  status: "running" | "completed" | "pending" | "failed";
  agentId: string;
}

export interface IntelligenceMetric {
  id: string;
  name: string;
  percentage: number;
  target: number;
}

// ... additional interfaces for each module
```

### Step 3: Create Mock Data

Create `src/data/dashboard.ts`:
```typescript
import { AgentHealth, ExecutionTask, ... } from "@/types/dashboard";

export const agentFleet: AgentHealth[] = [
  {
    id: "agent-1",
    name: "Codex-Coder",
    status: "online",
    role: "builder",
    lastHeartbeat: "2s ago",
    tasksCompleted: 147,
    currentTask: "Implementing auth flow",
  },
  // ... more agents
];

export const executionTasks: ExecutionTask[] = [
  { id: "task-1", name: "Code Review", startTime: "09:00", duration: 45, status: "completed", agentId: "agent-1" },
  // ... more tasks
];

// ... additional data exports for each module
```

### Step 4: Create Reusable Components

**DashboardModule** (`src/components/ui/dashboard-module.tsx`):
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardModuleProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export function DashboardModule({
  title,
  icon: Icon,
  children,
  className,
  headerActions,
}: DashboardModuleProps) {
  return (
    <Card
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <CardTitle className="text-sm font-semibold tracking-tight">
            {title}
          </CardTitle>
        </div>
        {headerActions && (
          <div className="flex items-center gap-2">{headerActions}</div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}
```

**MetricsCard** (`src/components/ui/metrics-card.tsx`):
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardProps {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MetricsCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  className,
  size = "md",
}: MetricsCardProps) {
  const sizeClasses = { sm: "p-3", md: "p-4", lg: "p-5" };
  
  const trendConfig = {
    up: { color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    down: { color: "text-rose-500", bgColor: "bg-rose-500/10" },
    stable: { color: "text-slate-500", bgColor: "bg-slate-500/10" },
  };

  return (
    <Card className={cn("rounded-lg border bg-card shadow-sm", className)}>
      <CardContent className={cn("p-0", sizeClasses[size])}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-bold tracking-tight">{value}</p>
            {trend && trendValue && (
              <p className={cn("text-xs mt-1", trendConfig[trend].color)}>
                {trendValue}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-lg p-2", trend ? trendConfig[trend].bgColor : "bg-slate-500/10")}>
              <Icon className={cn("h-5 w-5", trend ? trendConfig[trend].color : "text-slate-500")} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

**ProgressBar** (`src/components/ui/progress-bar.tsx`):
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  subLabel?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  subLabel,
  size = "md",
  variant = "default",
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = { sm: "h-1.5", md: "h-2", lg: "h-3" };
  const variantClasses = {
    default: "bg-slate-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  const getVariant = () => {
    if (variant !== "default") return variant;
    if (percentage < 50) return "danger";
    if (percentage < 80) return "warning";
    return "success";
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{label}</span>
              {subLabel && <span className="text-xs text-muted-foreground">{subLabel}</span>}
            </div>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-foreground">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-slate-200 dark:bg-slate-700", sizeClasses[size])}>
        <div
          className={cn("rounded-full transition-all duration-500 ease-out", variantClasses[getVariant()], sizeClasses[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

**OperationItem** (`src/components/ui/operation-item.tsx`):
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "./progress-bar";
import { Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface OperationItemProps {
  id: string;
  name: string;
  type: "research" | "build" | "deploy" | "audit" | "analyze";
  status: "in_progress" | "completed" | "queued" | "failed";
  progress: number;
  startedAt: string;
  eta?: string;
  assignedTo: string;
  className?: string;
}

const typeConfig = {
  research: { label: "Research" },
  build: { label: "Build" },
  deploy: { label: "Deploy" },
  audit: { label: "Audit" },
  analyze: { label: "Analyze" },
};

const statusConfig = {
  in_progress: { icon: Loader2, color: "text-blue-500", bgColor: "bg-blue-500/10", animate: true },
  completed: { icon: CheckCircle2, color: "text-emerald-500", bgColor: "bg-emerald-500/10", animate: false },
  queued: { icon: Clock, color: "text-slate-500", bgColor: "bg-slate-500/10", animate: false },
  failed: { icon: AlertCircle, color: "text-rose-500", bgColor: "bg-rose-500/10", animate: false },
};

export function OperationItem({ name, type, status, progress, startedAt, eta, assignedTo, className }: OperationItemProps) {
  const StatusIcon = statusConfig[status].icon;
  return (
    <div className={cn("flex flex-col gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", statusConfig[status].bgColor)}>
            <StatusIcon className={cn("h-4 w-4", statusConfig[status].color, statusConfig[status].animate && "animate-spin")} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Assigned to {assignedTo}</span>
              <span>•</span>
              <span>Started {startedAt}</span>
              {eta && status === "in_progress" && <><span>•</span><span>ETA {eta}</span></>}
            </div>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0">{typeConfig[type].label}</Badge>
      </div>
      {(status === "in_progress" || status === "failed") && (
        <ProgressBar value={progress} size="sm" variant={status === "failed" ? "danger" : "default"} showPercentage={false} />
      )}
    </div>
  );
}
```

### Step 5: Create Main Dashboard Page

Create `src/app/(dashboard)/dashboard-new/page.tsx`:
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardModule } from "@/components/ui/dashboard-module";
import { MetricsCard } from "@/components/ui/metrics-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { OperationItem } from "@/components/ui/operation-item";

// Import data
import {
  agentFleet,
  executionTasks,
  intelligenceMetrics,
  memoryMetrics,
  marketSources,
  performanceMetrics,
  teamMembers,
  activeOperations,
} from "@/data/dashboard";

// Import icons
import {
  Activity,
  Brain,
  Cpu,
  Globe,
  Layers,
  Server,
  Users,
  Settings,
  RefreshCw,
} from "lucide-react";

// Helper components (define inline or import)
function AgentStatusCard({ name, status, role, lastHeartbeat, tasksCompleted, currentTask }: {...}) {
  // Inline component implementation
}

function GanttBar({ name, startTime, duration, status }: {...}) {
  // Inline component implementation
}

export default function DashboardNewPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-sm text-muted-foreground">Dashboard description</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-1" /> Configure
          </Button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module 1: Agent Fleet Health */}
        <DashboardModule title="Agent Fleet Health" icon={Cpu}>
          {/* Module content */}
        </DashboardModule>

        {/* Module 2: Parallel Execution */}
        <DashboardModule title="Parallel Execution Timeline" icon={Activity}>
          {/* Module content */}
        </DashboardModule>

        {/* Modules 3-8... */}
      </div>
    </div>
  );
}
```

## File Structure Created

```
src/
├── types/
│   └── dashboard.ts          # All TypeScript interfaces
├── data/
│   └── dashboard.ts          # Mock data exports
├── components/
│   └── ui/
│       ├── dashboard-module.tsx    # Reusable card wrapper
│       ├── metrics-card.tsx        # Metric display
│       ├── progress-bar.tsx        # Progress indicator
│       └── operation-item.tsx      # Operation list item
└── app/
    └── (dashboard)/
        └── dashboard-new/
            └── page.tsx        # Main dashboard page
```

## Design System Compliance Checklist

Before confirming complete:
- [ ] Using existing colors (slate/emerald/amber/blue/gray)
- [ ] NO purple/pink colors introduced
- [ ] Cards use `rounded-lg border bg-card text-card-foreground shadow-sm`
- [ ] Icons from lucide-react only
- [ ] Typography follows `text-sm font-semibold` patterns
- [ ] Using existing shadcn/ui components (Card, Badge, Button)
- [ ] Mock data has realistic values
- [ ] Types are properly exported and imported
- [ ] Page has proper "use client" directive
- [ ] All imports use `@/` path alias

## Verification

After creation:
```bash
# Verify TypeScript compilation
cd ~/project && npx tsc --noEmit

# Check file structure
ls -la src/types/dashboard.ts src/data/dashboard.ts src/components/ui/dashboard-*.tsx src/app/\(dashboard\)/dashboard-new/page.tsx

# Verify no encoding issues
grep -c "<" src/app/\(dashboard\)/dashboard-new/page.tsx  # Should be > 0
grep -c ">" src/app/\(dashboard\)/dashboard-new/page.tsx  # Should be > 0
```

## Common Module Patterns

### 1. Agent Fleet Health (2×3 grid)
```tsx
<DashboardModule title="Agent Fleet Health" icon={Cpu}>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {agentFleet.map((agent) => (
      <AgentStatusCard key={agent.id} {...agent} />
    ))}
  </div>
</DashboardModule>
```

### 2. Parallel Execution (Gantt-like)
```tsx
<DashboardModule title="Parallel Execution" icon={Activity}>
  <div className="space-y-1">
    {executionTasks.map((task) => (
      <GanttBar key={task.id} {...task} />
    ))}
  </div>
</DashboardModule>
```

### 3. Intelligence Quality (Progress bars)
```tsx
<DashboardModule title="Intelligence Quality" icon={Brain}>
  <div className="space-y-3">
    {intelligenceMetrics.map((metric) => (
      <ProgressBar key={metric.id} label={metric.name} value={metric.percentage} showPercentage />
    ))}
  </div>
</DashboardModule>
```

### 4. Memory & KG (Metrics grid)
```tsx
<DashboardModule title="Memory & Knowledge Graph" icon={Layers}>
  <div className="grid grid-cols-2 gap-2">
    {memoryMetrics.map((metric) => (
      <MetricsCard key={metric.id} {...metric} />
    ))}
  </div>
</DashboardModule>
```

## Alternative: Multi-Agent Pipeline Mode

For complex dashboards requiring role-based validation, use this 4-agent sequential pipeline instead of single-pass scaffolding:

### Pipeline Architecture

| Phase | Agent | Role | Output |
|-------|-------|------|--------|
| 1 | @mason | Architect | Types, data mocks, component interfaces |
| 2 | @forge | Builder | Complete page.tsx with all modules |
| 3 | @keystone | Reviewer | Design system compliance audit |
| 4 | @ember | Validator | Build verification & visual QA |

### Dispatch Pattern

```python
# Phase 1: Architecture
cronjob_create(
    name="mason-dashboard-arch",
    prompt="Design dashboard architecture: types, data structures, component interfaces...",
    schedule="1m"
)

# Phase 2: Build (depends on Phase 1)
cronjob_create(
    name="forge-dashboard-build", 
    prompt="Build complete dashboard page using @mason's architecture...",
    context_from=["mason-job-id"],
    schedule="5m"
)

# Phase 3: Review (depends on Phase 2)
cronjob_create(
    name="keystone-dashboard-review",
    prompt="Review for design system compliance: NO purple/pink, proper grid layout...",
    context_from=["forge-job-id"],
    schedule="10m"
)

# Phase 4: Validate (depends on Phase 3)
cronjob_create(
    name="ember-dashboard-validate",
    prompt="Run build, verify all modules render, check sidebar integration...",
    context_from=["keystone-job-id"],
    schedule="15m"
)
```

### Design Constraints (Enforced by Reviewer)

- **Colors:** ONLY slate/emerald/amber/blue/gray (NO purple/pink)
- **Components:** shadcn Card, Badge, Button, Progress
- **Icons:** lucide-react only
- **Layout:** grid-cols-3 for rows 1-2, grid-cols-2 for row 3
- **Spacing:** gap-4, p-4 consistently

### Staging Setup

```bash
# Always work on staging
mkdir -p ~/project-mvp-staging
cd ~/project-mvp-staging

# Run pipeline with staging PORT
PORT=3001 npm run dev
```

### When to Use Pipeline Mode

Use multi-agent pipeline when:
- Dashboard has 6-8+ complex modules
- Strict design system compliance required
- User needs visualization review before finalization
- Quality gates needed between architecture/build/validation
- Working with Next.js + shadcn/ui in staging environment

Use single-pass scaffolding when:
- Quick proof-of-concept needed
- 2-4 simple modules
- No strict color/design constraints
- Immediate iteration with user feedback loop

## Related Skills

- `interactive-dashboard-builder` — For standalone HTML/JS SPA dashboards
- `dashboard-architecture-documentation` — For merging multiple UI versions
- `design-system-extraction` — For documenting existing design systems
- `ui-iterative-refinement` — For refining after initial build
- `writing-plans` — For complex multi-step implementation plans
- `iterative-agent-pipeline` — For research/analysis iterations
- `staging-dev-server-copy` — For staging environment setup
