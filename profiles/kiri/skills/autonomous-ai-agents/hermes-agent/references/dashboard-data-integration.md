# Dashboard Data Integration with Hermes

## Overview

When building dashboards that display Hermes agent information, integrate directly with Hermes data sources rather than using mock data or system process data.

## Data Sources

### 1. Agent Profiles (`~/.hermes/profiles/`)

Each agent profile is a **directory** (not a JSON file):
```
~/.hermes/profiles/
├── kiri/
│   ├── config.yaml      # Agent configuration
│   ├── SOUL.md          # Agent identity
│   └── ...
├── palette/
├── sentry/
└── mason/
```

**API Implementation:**
```typescript
// app/api/hermes/agents/route.ts
export async function GET() {
  const profilesDir = process.env.HOME + "/.hermes/profiles";
  const agents = [];
  
  for (const entry of readdirSync(profilesDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const agentName = entry.name;
      const configPath = join(profilesDir, agentName, "config.yaml");
      
      // Parse YAML for agent metadata
      const yaml = parseYAML(readFileSync(configPath, "utf-8"));
      agents.push({
        agentId: agentName,
        name: yaml.name || agentName,
        role: yaml.role || "Agent",
        model: yaml.model,
        status: "online"
      });
    }
  }
  
  return NextResponse.json({ agents, count: agents.length });
}
```

### 2. Active Sessions (`hermes sessions list`)

Use CLI command to get real session data:
```typescript
import { execSync } from "child_process";

export async function GET() {
  const output = execSync("hermes sessions list", { encoding: "utf-8" });
  
  // Parse the table output
  const lines = output.split("\n").filter(l => l.trim());
  const sessions = lines.slice(2).map(line => {
    const parts = line.split(/\s{2,}/);
    return {
      id: parts[parts.length - 1]?.trim(),
      title: parts[0]?.trim() || "Untitled",
      lastActive: parts.find(p => p.includes("ago")) || "unknown"
    };
  });
  
  return NextResponse.json({ sessions });
}
```

### 3. Cron Jobs (`hermes cron list`)

Real scheduled jobs from Hermes:
```typescript
export async function GET() {
  const output = execSync("hermes cron list", { encoding: "utf-8" });
  
  const jobs = [];
  const lines = output.split("\n").filter(l => l.includes("•"));
  
  for (const line of lines) {
    const match = line.match(/•\s*(.+?)\s*:\s*(.+)/);
    if (match) {
      jobs.push({
        id: `cron-${match[1].toLowerCase().replace(/\s+/g, "-")}`,
        name: match[1].trim(),
        schedule: match[2].trim(),
        status: "pending"
      });
    }
  }
  
  return NextResponse.json({ jobs });
}
```

## Client-Side Hooks

Replace INITIAL_xxx_DATA constants with real API calls:

**Before (Mock):**
```typescript
const INITIAL_FLEET_DATA = [
  { agentId: "agent-1", name: "Codex-Coder", role: "Builder", status: "online" },
  { agentId: "agent-2", name: "Claude-Architect", role: "Architect", status: "busy" },
  // ... fake data
];
```

**After (Real):**
```typescript
export function useFleetHealth() {
  const { data: response } = useRealtime<{
    processes: FleetStatus[];
    count: number;
  }>("/api/hermes/fleet", { processes: [], count: 0 });

  const data = useMemo(() => response?.processes ?? [], [response]);
  // No initial mock data - starts empty, fills from API
}
```

## Common Pitfalls

### Pitfall: Profiles are Directories, Not Files

**Wrong assumption:**
```typescript
// This will fail - profiles are directories
const files = readdirSync(profilesDir); // Returns directories
const profile = JSON.parse(readFileSync(join(profilesDir, file)));
```

**Correct approach:**
```typescript
const entries = readdirSync(profilesDir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.isDirectory()) {
    // Read config.yaml INSIDE the directory
    const configPath = join(profilesDir, entry.name, "config.yaml");
  }
}
```

### Pitfall: Server-Side Rendering Shows "0"

Next.js renders server-side before hooks fetch client-side. The HTML shows "0" initially, then hydrates with real data.

**This is expected behavior** - the dashboard will show:
1. "0 Agents Online" (SSR)
2. Real count after hydration (CSR)

If you need SSR data, use `getServerSideProps` or `generateStaticParams`.

### Pitfall: Hardcoded Static Data in page.tsx

Even with real APIs, page.tsx may have hardcoded values:
```typescript
// Still shows static data despite APIs
const teamsData = [ /* static teams */ ];
const performanceMetricsData = [ /* static metrics */ ];
```

**Fix:** Either:
1. Replace with API calls
2. Document as "static reference data"
3. Move to config/backend

## Verification Checklist

Before declaring Phase 2 complete for Hermes dashboards:

- [ ] `/api/hermes/agents` returns actual agent names from `~/.hermes/profiles/`
- [ ] `/api/hermes/sessions` returns real session IDs from `hermes sessions list`
- [ ] `/api/hermes/cron` returns scheduled jobs from `hermes cron list`
- [ ] Hooks don't use INITIAL_xxx_DATA constants
- [ ] Dashboard displays agent names (not Codex-Coder, Claude-Architect...)
- [ ] Session timestamps match `hermes sessions list` output

## Example: Complete Integration

```typescript
// app/api/hermes/fleet/route.ts
import { NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

function parseYAML(content: string) {
  const result: any = {};
  for (const line of content.split("\n")) {
    const match = line.match(/^([a-zA-Z_]+):\s*(.+)$/);
    if (match) result[match[1]] = match[2].trim();
  }
  return result;
}

export async function GET() {
  const profilesDir = process.env.HOME + "/.hermes/profiles";
  const agents = [];
  
  const entries = readdirSync(profilesDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const yamlPath = join(profilesDir, entry.name, "config.yaml");
      const yaml = parseYAML(readFileSync(yamlPath, "utf-8"));
      
      agents.push({
        agentId: entry.name,
        name: yaml.name || entry.name,
        role: yaml.role || "Agent",
        status: "online",
        model: yaml.model
      });
    }
  }
  
  return NextResponse.json({ 
    processes: agents, 
    count: agents.length,
    stats: { online: agents.length, total: agents.length }
  });
}
```

## Related

- Session 2026-05-19: Phase 2 proper fix for KIRI MVP dashboard
- See `templates/fix-profile-configs.py` for bulk config fixes
