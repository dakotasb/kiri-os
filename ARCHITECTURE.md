# Kiri OS — Architecture Reference

> **Purpose:** Briefing doc for the next development session.  
> The UI is complete and running. This file maps the component tree, data contracts,
> and everything a new session needs to wire real agent data into the UI.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Icons | Lucide React |
| Fonts | Inter (sans) + JetBrains Mono (mono) via `next/font` |
| State | React local state only — no global store yet |
| Data | Hybrid — `lib/mock-data.ts` for agents/tasks/projects; live Hermes API for chat, goals, and fleet health |
| Repo | `https://github.com/dakotasb/kiri-os` · branch: `design-v2` |
| Local | `D:\Project Alpha\dashboard-v2` |

---

## Route Map

```
app/
├── page.tsx              → / (Home — Companion + AgentRail + Chat)
├── dashboard/page.tsx    → /dashboard (Fleet Dashboard)
├── catalog/page.tsx      → /catalog (Agent Catalog)
├── projects/page.tsx     → /projects (Kanban Board)
├── mempalace/page.tsx    → /mempalace (Knowledge / MemPalace)
└── settings/page.tsx     → /settings
```

All routes share a single persistent `<Sidebar>` via `app/layout.tsx`.

---

## Component Tree

```
app/layout.tsx
├── Sidebar                       components/layout/Sidebar.tsx
│   ├── AgentIcon (xs)            components/ui/AgentIcon.tsx
│   └── ThemeToggle               components/ui/ThemeToggle.tsx

app/page.tsx  (Home)
├── AgentRail                     components/companion/AgentRail.tsx
│   └── AgentIcon (xl, orb=true)
├── OutcomeCard (×n)              components/companion/OutcomeCard.tsx
└── ChatInput                     components/companion/ChatInput.tsx

app/dashboard/page.tsx  (Fleet)
├── FleetHealth                   components/dashboard/FleetHealth.tsx
├── AgentStatusCard (×n)          components/dashboard/AgentStatusCard.tsx
│   └── AgentIcon (md)
├── ActiveWorkItem (×n)           components/dashboard/ActiveWorkItem.tsx
│   └── AgentIcon (sm)
└── OutcomeCard (×n)

app/catalog/page.tsx  (Catalog)
└── CatalogCard (×n)              components/catalog/CatalogCard.tsx
    └── AgentIcon (md or lg)

app/projects/page.tsx  (Projects)
└── KanbanBoard                   components/kanban/KanbanBoard.tsx
    └── KanbanCard (×n)           components/kanban/KanbanCard.tsx
        └── AgentIcon (xs)
```

---

## Data Contracts

> **All of these come from `lib/mock-data.ts` today.**  
> Replace each export with a real fetch/subscription to wire up live data.

### `Agent`
```ts
interface Agent {
  id: string;           // unique slug, e.g. 'kiri', 'compass'
  name: string;
  role: string;         // display label, e.g. 'Orchestrator'
  description: string;  // short (catalog card)
  longDescription: string;
  accent: string;       // hex — drives ALL color for this agent across the UI
  status: 'active' | 'idle' | 'offline';
  sessions: number;     // active session count
  model: string;        // model name string, e.g. 'deepseek-v4-pro'
  tasksToday: number;
  memoryEntries: number;
  worksWell: string[];  // array of agent IDs
  categories: string[]; // used for catalog filtering
  icon: string;         // Lucide icon name — must match ICON_MAP in AgentIcon.tsx
  capabilities: string[];
}
```

### `Task`
```ts
interface Task {
  id: string;
  title: string;
  agentId: string | null;   // null = unassigned / human-owned
  status: 'todo' | 'in-progress' | 'review' | 'done';
  progress?: number;        // 0–100, shown as progress bar
  startedAt?: string;       // human-readable string, e.g. '8m ago'
  completedAt?: string;
  isHumanReview?: boolean;  // triggers pink "Needs your review" card style
  projectId: string;        // foreign key → Project.id
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}
```

### `Outcome`
```ts
interface Outcome {
  id: string;
  title: string;
  agentId: string;
  time: string;             // human-readable relative time
  summary: string;          // 1–3 sentence plain-text summary
  type: 'finance' | 'research' | 'build' | 'analysis' | 'review';
}
```

### `Project`
```ts
interface Project {
  id: string;
  name: string;
  description: string;
  agentIds: string[];       // agents assigned to this project
  taskCount: number;
  activeCount: number;      // agents currently active on this project
  color: string;            // hex — project accent in sidebar + tabs
}
```

### `fleetStats`
```ts
{
  activeAgents: number;
  idleAgents: number;
  offlineAgents: number;
  totalErrors: number;
  tasksPerHour: number;
  memoriesStored: number;
  uptimePercent: number;
  gateways: Array<{
    name: string;           // e.g. 'hermes-kiri'
    status: 'healthy' | 'degraded' | 'offline';
    sessions: number;
  }>;
}
```

### `currentHandoff`
```ts
{
  fromAgentId: string;
  toAgentId: string;
  task: string;             // short description shown in the rail pill
  active: boolean;          // drives the glow sweep animation on the connector
}
```

---

## Integration Priority Order

When replacing mock data with real Hermes data, tackle in this order:

1. **`agents[]` + `fleetStats`** — powers the sidebar, AgentRail, Fleet Dashboard,
   and Catalog. Most visible, highest demo impact. Poll or subscribe per agent.

2. **`tasks[]`** — drives the Kanban board and Active Work panel.
   Status changes (`todo → in-progress → review → done`) + `progress` updates
   are the main real-time events.

3. **`outcomes[]`** — the Recent Outcomes feed on Home and Fleet.
   Append-only log; new entries pushed when an agent completes a task.

4. **`currentHandoff`** — the animated connector between agents on Home.
   Reflects real orchestration handoff events from Hermes.

5. **`projects[]`** — mostly static config; update `activeCount` from live agent state.

---

## Design System (CSS Variables)

Theme switching is handled via `data-theme="light"` on `<html>`.  
All Tailwind color tokens resolve through CSS custom properties:

```
Dark (default)         Light (ivory)
──────────────────     ──────────────────
--bg      #0B0B0E      #FAF8F4
--surface #121216      #FFFFFF
--s1      #18181E      #F4F0E8
--border  #262630      #E4DDD0
--tx      #EAEAF2      #1A1828
--tx2     #828294      #5C5775
--tx3     #444452      #9994A8
--kiri    #6CD9BA      #18B893  (teal — hero accent)
--warm    #F27EB4      #D45E8F  (pink — warmth/review)
```

Theme toggle: `hooks/useTheme.ts` + `components/ui/ThemeToggle.tsx`  
Flash prevention: blocking `<script>` in `app/layout.tsx` `<head>`.

### Agent Accent Colors
Each agent has a hardcoded `accent` hex that drives icon color, glow,
pulse rings, card borders, and progress bars across all views:

| Agent | Accent | Role |
|---|---|---|
| Kiri | `#6CD9BA` | Orchestrator |
| Compass | `#4227F2` | Research |
| Forge | `#F97316` | Builder |
| Atlas | `#07D98C` | Finance |
| Mira | `#F27EB4` | Life & Calendar |
| Sage | `#B775BF` | SME Advisor |
| Coach | `#A60D61` | Fitness & Habits |
| Beacon | `#1E18D9` | Alerts & Monitoring |

---

## Key Files to Know

```
lib/mock-data.ts          — ALL data lives here. Replace exports one by one.
lib/utils.ts              — hexToRgba() helper used everywhere for agent accent colors
components/ui/AgentIcon.tsx — single icon component used on every screen;
                              supports sizes xs/sm/md/lg/xl and orb mode (home rail)
app/globals.css           — CSS variable definitions for both themes + all keyframes
tailwind.config.ts        — all color tokens point to CSS vars for theme support
hooks/useTheme.ts         — theme toggle logic + localStorage persistence
```

---

## Environment Variables

Two `.env` files must be configured before the live API features work.

**`D:\Project Alpha\dashboard-v2\.env.local`** — Next.js server-side only (never sent to browser):

| Variable | Example | Purpose |
|---|---|---|
| `HERMES_GATEWAY_URL` | `http://localhost:8642` | Base URL for the Hermes API server; required — routes return 503 if unset |
| `HERMES_API_KEY` | `localdev` | Bearer token sent as `Authorization: Bearer …` on every Hermes request; must match `API_SERVER_KEY` in the profile `.env` |
| `NEXT_PUBLIC_HERMES_GATEWAY_URL` | `http://localhost:8642` | Same URL exposed to client-side code (Settings page health-check display) |

**`~/.hermes/profiles/kiri/.env`** — Hermes profile, consumed at gateway launch:

| Variable | Example | Purpose |
|---|---|---|
| `API_SERVER_ENABLED` | `true` | Activates the `api_server` platform block in `config.yaml` |
| `API_SERVER_HOST` | `0.0.0.0` | Bind address — use `0.0.0.0` when the Next.js server runs on the Windows host; `127.0.0.1` for WSL2-only access |
| `API_SERVER_PORT` | `8642` | Port the API server listens on; must match the port in `HERMES_GATEWAY_URL` |
| `API_SERVER_KEY` | `localdev` | Bearer token required by the API server; must match `HERMES_API_KEY` in `.env.local` |

---

*Last updated: 2026-05-28 · Chat + Goals wired to live Hermes API · Mock data retained for agents/tasks/projects*
