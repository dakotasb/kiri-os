# Kiri OS — Product Design Specification
**Version 1.0 | May 2026**

---

## 0. The Core Insight

Two doors. One house.

The **warm door** is for anyone. You meet Kiri, pick an agent or two, watch them go to work. No configuration. No vocabulary to learn. Just outcomes arriving in your hands. This door is emotional, animated, alive.

The **cold door** is for builders, operators, and enterprises. Fleet health, kanban pipelines, MemPalace depth, agent orchestration graphs, team composition. Beautiful and precise. This door earns trust through information density done right.

Same Hermes backend. Same MemPalace institutional memory. Same Kiri orchestrating everything. The UI is the only thing that changes.

---

## 1. Brand Language

### 1.1 Visual Identity Philosophy

**Not AI-flavored. Not a dashboard. Not a chat toy.**

The reference stack: Linear's information hierarchy + Notion's spatial flexibility + Duolingo's emotional investment + a system that happens to have agents behind it. The agents are invisible infrastructure. Users see their stuff — tasks, insights, summaries, alerts, team status.

Every design decision should pass this test: *does this feel like the most well-funded startup in the world shipped it?*

### 1.2 Color System

**Primary Palette — Cold (Power/Enterprise Layer)**
```
Background:    #0A0A0F  (near-black, slight blue tint)
Surface:       #111118  (card backgrounds)
Surface+1:     #1A1A24  (elevated surfaces)
Border:        #2A2A3A  (subtle, cool)
Text Primary:  #F0F0FA  (near-white, cool)
Text Secondary:#7A7A9A  (muted lavender-grey)

Accent Blue:   #4F6EF7  (primary action, links)
Accent Purple: #8B5CF6  (Kiri's identity color)
Accent Cyan:   #06B6D4  (active/live states)
Success:       #10B981
Warning:       #F59E0B
Error:         #EF4444
```

**Warm Palette — Companion Layer (Consumer)**
```
Background:    #0D0D14  (same base — seamless transition to cold layer)
Kiri Gradient: #8B5CF6 → #6366F1 → #4F6EF7  (her signature)
Pulse Glow:    rgba(139, 92, 246, 0.15)  (when agent is active)
Warm Surface:  #1A1525  (slightly purple-tinted cards in companion view)
```

The companion layer doesn't feel "different" — it's the same dark app with more warmth injected through Kiri's purple and the agent glows. The transition from companion to power view is a zoom-out, not a mode switch.

### 1.3 Typography

```
Display/Hero:    Inter Display — 600 weight, tight tracking (-0.02em)
UI Labels:       Inter — 500 weight, standard tracking
Body/Prose:      Inter — 400 weight
Mono (logs/IDs): JetBrains Mono — 400 weight
```

Type scale follows a 4px base grid. No decorative fonts. No gradients on text except Kiri's display name (her purple gradient, used sparingly).

### 1.4 Motion Principles

**Three motion registers:**

1. **Micro-motion** — State changes. Buttons, toggles, status updates. 100-150ms ease-out. Nothing jumps.
2. **Agent motion** — The pulse, the glow, the handoff animation. 600-1200ms. Breathing rhythms. This is the emotional core of the product.
3. **View transitions** — Navigating between companion and power views. 250-350ms ease-in-out. Feels like zooming out/in, not a page load.

**The handoff animation** (critical to ship correctly):
When Agent A completes work and passes to Agent B:
- A's icon dims slightly, pulse slows
- A small particle trail moves from A → B (300ms arc)
- B's icon brightens, pulse quickens briefly, then settles
- A status chip reads "Compass → Forge" with a subtle trail

This is the magic moment. Non-technical users read it instantly: *my agents are talking to each other.*

### 1.5 Agent Icon System

Each catalog agent gets a distinct icon — not emoji, not generic robot. Think: a small, abstract geometric mark with character. Designed as a set, they read as a *team*.

**Icon principles:**
- 40x40px base size, scales to 24px (compact) and 64px (featured)
- Dark background: icon uses white line art with a colored inner glow matching the agent's accent color
- Active state: outer ring pulses with a soft colored glow (agent's accent)
- Idle state: icon is visible but static, slightly dimmed
- Error state: icon has a subtle red border, no pulse
- Offline: greyscale, no glow

**Suggested agent accent colors:**
```
Kiri (orchestrator):   #8B5CF6  (purple — always distinct)
Compass (research):    #06B6D4  (cyan — knowledge, clarity)
Forge (builder/dev):   #F97316  (orange — creation, energy)
Atlas (finance):       #10B981  (green — money, growth)
Mira (calendar/life):  #EC4899  (pink — personal, warm)
Beacon (alerts):       #F59E0B  (amber — attention)
Sage (SME/knowledge):  #6366F1  (indigo — depth, expertise)
Coach (fitness/habit): #EF4444  (red — energy, action)
```

---

## 2. User Tiers & Personas

### Tier 0 — Companion (Free)
**Who:** Anyone. Non-technical. The person who would never set up n8n.
**Entry:** Kiri introduces herself, 3 questions, suggests 1-3 agents.
**What they see:** Companion view — Kiri + 1 catalog agent. Chat input. Outcome cards.
**MemPalace:** ChromaDB + SQLite. Installs in seconds. Zero Docker.
**Value prop:** "Your AI that learns you and does things for you."

### Tier 1 — Power User ($X/month)
**Who:** Tech-comfortable individual. Freelancer. Side-project builder.
**What they see:** Up to 3 agents, 1 team. Collaboration rail visible. Basic project board.
**MemPalace:** Qdrant + Neo4j. Same palace structure, production-grade backend.
**Value prop:** "A small team working for you 24/7."

### Tier 2 — SMB/Startup (Team plan, per seat)
**Who:** Small team. Ops-heavy startup. 2-50 people.
**What they see:** Multiple agents, multiple teams, cross-team handoffs, pipeline view, human review checkpoints.
**Key differentiator:** The 100x model — agents replace and amplify routine work at the team level. Humans stay in the decision loop, agents handle execution.
**Value prop:** "Your entire ops layer, automated. Humans run strategy."

### Tier 3 — Enterprise (Custom)
**Who:** Large organizations. Full fleet deployment.
**What they see:** Fleet management, org-level MemPalace, custom agent profiles, audit trails, SSO, multi-tenant isolation.
**Value prop:** "Agent infrastructure at the scale of your organization."

---

## 3. Information Architecture

```
Kiri OS
├── Companion View (Tier 0 default entry point)
│   ├── Kiri Chat
│   ├── My Agents (1-3 icons, live status)
│   ├── Recent Outcomes
│   └── Agent Catalog (modal)
│
├── Dashboard (Tier 1+ default)
│   ├── Fleet Overview (agent health summary)
│   ├── Active Work (in-flight tasks across agents)
│   ├── Recent Outcomes
│   └── Quick Actions
│
├── Projects (Tier 1+)
│   ├── Project Board (kanban, timeline, list views)
│   ├── Team Roster (agents assigned to project)
│   └── Pipeline View (cross-agent workflow visualization)
│
├── Teams (Tier 2+)
│   ├── Team Composition
│   ├── Cross-team Handoffs
│   └── Team MemPalace
│
├── Fleet (Tier 2+, power view)
│   ├── All Agents (health, load, session count)
│   ├── Gateway Status (hermes-kiri, hermes-forge, hermes-default)
│   ├── MemPalace Depth
│   └── Logs & Audit
│
├── MemPalace (Tier 1+)
│   ├── Knowledge Graph Viewer
│   ├── Memory Rooms (Wings, Drawers)
│   ├── What Agents Know
│   └── Import / Export
│
├── Agent Catalog
│   ├── Browse by Category
│   ├── Featured / Trending
│   ├── Community Contributed
│   └── My Agents (cloned/custom)
│
└── Settings
    ├── Profile
    ├── Agent Configs (post-clone only)
    ├── MemPalace Settings
    ├── Billing & Tier
    └── Developer / API
```

---

## 4. Core Screens

### 4.1 First Run — Onboarding

**Goal:** Kiri introduces herself, asks 3 questions, spins up the right agents. No YAML, no profile setup, no explaining what a kanban dispatcher is. Time to first value: under 90 seconds.

**Screen flow:**
```
[Full-screen dark canvas]

  Kiri's icon pulses gently in center — large, animated, purple glow

  "Hi, I'm Kiri."
  [subtitle] "Your AI that learns what you need and gets it done."

  [Continue →]

--- Screen 2 ---

  Kiri icon (smaller, top-left — now in her permanent position)

  "To get started, I have three quick questions."

  Question 1: "What's your main focus right now?"
  [Cards to select, visual icons:]
  - Work & Career
  - Personal & Health  
  - Business / Team
  - Just exploring

  Question 2: "Which of these sounds most useful right away?"
  [Agent preview cards — shows icon, name, one-line description]
  (options change based on Q1 answer)

  Question 3: "How do you prefer updates?"
  - Kiri tells me when things are done
  - I want to see what's happening
  - Both

--- Screen 3 ---

  "Your team is ready."

  [3 agent icons appear one by one with a pop-in animation]
  [Each shows name + "setting up..." → "ready" status]

  "Kiri is coordinating. Compass is ready to research. Atlas is watching your finances."

  [Enter your workspace →]
```

### 4.2 Companion View (Tier 0 — Warm Door)

This is the primary canvas for free users. Everything lives here.

```
┌─────────────────────────────────────────────────┐
│  [Kiri OS wordmark — small, top-left]           │
│                            [@profile] [⚙ settings]│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  MY TEAM                                │   │
│  │                                         │   │
│  │  [Kiri ●]  [Compass ●]  [Atlas ●]      │   │
│  │   purple    cyan pulse   green pulse    │   │
│  │                                         │   │
│  │  "Compass → Atlas"  [handoff indicator] │   │
│  │  "Summarizing your portfolio..."        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  RECENT OUTCOMES                                │
│  ┌─────────────────────────────────────────┐   │
│  │  📊 Weekly Finance Summary              │   │
│  │  Atlas · 2 min ago                      │   │
│  │  "Portfolio up 2.3%. 3 bills due..."   │   │
│  │                                  [View] │   │
│  ├─────────────────────────────────────────┤   │
│  │  🔍 Research: AI in healthcare Q2 2026  │   │
│  │  Compass · 14 min ago          [View]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Ask Kiri anything...              [→]  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [+ Add an Agent]  [View Catalog]               │
└─────────────────────────────────────────────────┘
```

**Agent status states (visible in this view):**
- **Active / Working:** icon glows with accent color, subtle pulse animation (1.5s cycle)
- **Handing off:** brief particle arc between icons (300ms), brief status text "Compass → Forge"
- **Idle / Ready:** icon visible, no pulse, dimmed 70%
- **Offline:** greyscale icon, no label badge

**The agent row** is the emotional anchor of the companion view. Even a non-technical person understands "my little helpers are working right now." This is the Tamagotchi moment.

The **Upgrade nudge** appears naturally when the user tries to add a 2nd agent (Tier 0 only has Kiri + 1). Not a pop-up interrupt — a slide-up sheet that says "Add your 2nd agent with Tier 1 — see them collaborate." with a preview animation of what collaboration looks like.

### 4.3 Agent Catalog

Full-screen modal or dedicated route. Browsable, filterable, character-forward.

```
┌─────────────────────────────────────────────────┐
│  ← Back   AGENT CATALOG              [🔍 Search] │
├─────────────────────────────────────────────────┤
│  [All] [Personal] [Research] [Business] [Dev]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  FEATURED                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │[Compass] │ │[Atlas]   │ │[Forge]   │        │
│  │ Research │ │ Finance  │ │ Builder  │        │
│  │          │ │          │ │          │        │
│  │Researches│ │Tracks &  │ │Writes &  │        │
│  │anything  │ │reports on│ │deploys   │        │
│  │on demand │ │your money│ │code      │        │
│  │          │ │          │ │          │        │
│  │[+ Add]   │ │[+ Add]   │ │[+ Add]   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  PERSONAL                                       │
│  ┌──────────┐ ┌──────────┐                     │
│  │[Mira]    │ │[Coach]   │                     │
│  │Calendar  │ │Fitness   │                     │
│  │& Life    │ │& Habits  │                     │
│  │[+ Add]   │ │[+ Add]   │                     │
│  └──────────┘ └──────────┘                     │
│                                                 │
│  COMMUNITY ↗                                   │
└─────────────────────────────────────────────────┘
```

Each catalog card on expand shows:
- Agent icon (large, with glow)
- Name + one-line description
- What they're great at (3 bullet points, plain English — not technical)
- Works well with: [Kiri] [Compass] (showing collaboration icons)
- Example outcomes: "Weekly finance summary," "Research brief in 10 min"
- [Add to my team] or [Clone & customize] (post-clone = user owns it)

### 4.4 Fleet Dashboard (Tier 1+ — Cold Door)

The power user's home. Same dark canvas, colder palette, information-dense. This is Linear energy.

```
┌───────────────────────────────────────────────────────────┐
│  [≡ Kiri OS]   Dashboard   Projects   Fleet   MemPalace   │
│                                              [+] [🔔] [@] │
├──────────────┬────────────────────────────────────────────┤
│              │  FLEET HEALTH                              │
│  KIRI        │  3 active  ·  0 errors  ·  12 tasks/hr    │
│  [purple ●]  │                                           │
│              │  ┌──────────┬──────────┬──────────┐       │
│  Dispatching │  │Compass   │Forge     │Atlas     │       │
│  12 tasks    │  │● Active  │● Active  │○ Idle    │       │
│  today       │  │4 sessions│2 sessions│0 sessions│       │
│              │  │[deepseek]│[kimi-k2] │[deepseek]│       │
│  [Chat Kiri] │  └──────────┴──────────┴──────────┘       │
│              │                                           │
│  MY AGENTS   │  ACTIVE WORK                              │
│  Compass ●   │  ┌─────────────────────────────────────┐  │
│  Forge   ●   │  │  🔍 Research: Q2 market brief       │  │
│  Atlas   ○   │  │  Compass · Started 8m ago · 60%     │  │
│              │  │  ▓▓▓▓▓▓░░░░                         │  │
│  [+ Agent]   │  ├─────────────────────────────────────┤  │
│              │  │  ⚙ Build: API integration           │  │
│  TEAMS       │  │  Forge · Started 23m ago · 40%      │  │
│  Research ●  │  │  ▓▓▓▓░░░░░░                         │  │
│  Dev Squad ○ │  └─────────────────────────────────────┘  │
│              │                                           │
│  [+ Team]    │  RECENT OUTCOMES                          │
│              │  ┌─────────────────────────────────────┐  │
│              │  │  ✓ Finance report — Atlas · 12m     │  │
│              │  │  ✓ PR review — Forge · 1hr ago      │  │
│              │  │  ✓ Competitor brief — Compass · 2hr │  │
│              │  └─────────────────────────────────────┘  │
└──────────────┴────────────────────────────────────────────┘
```

### 4.5 Project / Team View (Tier 2 — SMB)

Built for the 100x model: humans run strategy, agents run execution.

**Three sub-views (tabs, Linear-style):**
- **Board** — Kanban columns (Todo / In Progress / In Review / Done). Cards show which agent owns each task. Human review cards are visually distinct (person icon, not agent icon).
- **Pipeline** — Visual flow of how work moves between agents. Boxes connected by animated arrows. Shows bottlenecks at a glance.
- **Timeline** — Gantt-style. Agent workload over time. When were humans needed? Where did things block?

**The human review checkpoint** is a first-class UI element. When an agent completes something that requires human sign-off, the card escalates visually — glows amber, surfaces to top of board, sends notification. The human approves or redirects in one click. This is the "healthy human-agent manager review" experience from the spec.

```
┌───────────────────────────────────────────────────────┐
│  Project Alpha  ·  Research Team              [Board] [Pipeline] [Timeline]
├───────────────────────────────────────────────────────┤
│                                                       │
│  [Todo]          [In Progress]     [Review ⚠]   [Done]│
│  ┌────────────┐  ┌────────────┐   ┌──────────┐       │
│  │Competitor  │  │Market brief│   │Q2 Report │       │
│  │analysis    │  │[Compass ●] │   │[🧑 You]  │       │
│  │[Compass]   │  │60% · 8m    │   │Awaiting  │       │
│  └────────────┘  └────────────┘   │approval  │       │
│  ┌────────────┐  ┌────────────┐   └──────────┘       │
│  │API docs    │  │Build route │                       │
│  │[Forge]     │  │[Forge ●]   │                       │
│  └────────────┘  │40% · 23m   │                       │
│                  └────────────┘                       │
│                                                       │
│  [+ Add Task]  [Ask Kiri to plan this project]        │
└───────────────────────────────────────────────────────┘
```

### 4.6 MemPalace Viewer (Tier 1+)

This is a differentiated view — nothing else in the market shows this. Institutional memory made visible.

**What it shows:**
- A graph visualization (Neo4j data, rendered with d3-force or Cytoscape.js) of what your agents know
- Nodes: concepts, entities, people, projects
- Edges: relationships between them
- Color-coded by which agent contributed the knowledge
- Timeline scrubber: "What did your agents know 30 days ago vs today?"

**Plain-language summary above the graph:**
```
Your agents have learned 2,847 things since you started.
Most active knowledge area: Finance (Atlas, 743 entries)
Newest memory: "Q2 market brief — completed" (2 min ago)
Oldest memory still active: "Preferred communication style" (47 days ago)
```

This view is the moat made visible. A user who has been running Kiri for 3 months, seeing the depth of what their agents know, feels the switching cost viscerally. That graph is theirs.

### 4.7 Settings & Agent Configuration

**Three-panel layout (same as Linear's settings):**
- Left: Settings categories (Profile, My Agents, Teams, MemPalace, Billing, Developer)
- Center: Settings for selected category
- Right: Preview / help context (optional, collapsible)

**Agent configuration** is only available post-clone. Catalog agents have a read-only config view with a "Clone to customize" CTA. Once cloned:
- System prompt editor (with markdown preview)
- Skills / tool assignments
- Memory scope (what can this agent read/write to MemPalace)
- Team assignments
- Schedule & triggers

**The clone moment** should feel like a real ownership transfer — a short animation, a confirmation modal that says "You're taking ownership of Compass. Future updates to the catalog version won't apply. You're in control." This is the "explicit ownership transfer moment" from the product design spec.

---

## 5. Component Library

### 5.1 Agent Card (three sizes)

**Compact (24px):** Icon + status dot. Used in sidebar lists, task cards.
**Standard (40px):** Icon + name + status indicator. Used in team rows, catalog grid.
**Featured (64px):** Icon + name + description + status + actions. Used in companion view, catalog featured.

### 5.2 Status Indicators

```
● Active (cyan/accent glow pulse)
● Idle (dim white dot)
○ Offline (greyscale)
⚠ Error (amber border flash)
⏳ Starting (spinner)
```

Never show raw technical status (process ID, port number, exit code) in user-facing views. Translate everything:
- `gateway unhealthy` → "Compass is resting, back soon"
- `session timeout` → "Compass is getting a fresh start"
- `model unavailable` → "Your team is momentarily offline"

### 5.3 Outcome Card

The primary deliverable surface. Kiri surfaces outputs here.

```
┌────────────────────────────────────────┐
│  [Agent icon]  Agent Name · Time ago   │
│  ─────────────────────────────────     │
│  Title of outcome                      │
│                                        │
│  2-3 sentence summary of the output.  │
│  Key numbers or findings surface here. │
│                                        │
│  [Open full result]  [Share]  [...]    │
└────────────────────────────────────────┘
```

### 5.4 Collaboration Rail

Visible in team views and companion view. Shows agents in a horizontal strip with handoff arrows between them when collaboration is active.

```
[Kiri] ──→── [Compass] ──→── [Forge]
 dispatching   researching    building
```

The arrows animate (traveling dot, 600ms loop) when a handoff is in progress. Static when idle. The rail is always visible — even when all agents are idle, users see their team is *there*.

### 5.5 Human Review Badge

Appears on any card awaiting human input. Visually distinct from agent-owned cards.

```
┌──────────────────────────────────────┐
│  ⚠  NEEDS YOUR REVIEW               │ ← amber top border
│  Q2 Financial Report                 │
│  Atlas completed · Awaiting approval │
│                                      │
│  [Approve]  [Give feedback]          │
└──────────────────────────────────────┘
```

---

## 6. Mobile Strategy

Mobile is a first-class surface, not a responsive afterthought.

**Mobile navigation:** Bottom tab bar (4 tabs max)
- Home (companion view / dashboard)
- Chat (Kiri directly)
- Projects (if Tier 1+)
- Notifications

**Mobile companion view** is the same as desktop but optimized for one-thumb use:
- Agent row at top, horizontal scroll if >3 agents
- Outcome cards stack vertically, swipe to dismiss
- Chat input is sticky at bottom
- Full-screen Kiri chat on tap of chat tab

**Push notifications** (critical for async agent work):
- "Atlas finished your finance summary" → tap → opens outcome card
- "Forge is waiting — needs your review" → tap → opens review view
- Notifications are outcome-first, never technical. Never "hermes session expired."

**Progressive Web App (PWA):** Ship as PWA first. Home screen install, offline shell, push notifications. Native iOS/Android wrappers can follow, but the PWA gets you on every device immediately.

---

## 7. Tier Upgrade Flow

The upgrade upsell should sell itself visually — not be a paywall.

**The staged reveal pattern:**
1. Free user sees their 1 agent working. They love it.
2. They click "+ Add Agent." Instead of a paywall modal, they see a preview: *ghosted* second and third agent icons in their companion view, with a "Start collaborating — upgrade to see them work" message.
3. The preview shows a short looping animation of what collaboration looks like (two agents, handoff arc, baton animation).
4. Upgrade button is prominent but the preview does the selling.

**What changes with each tier — make it visual:**

| | Free | Tier 1 | Tier 2 (SMB) | Enterprise |
|---|---|---|---|---|
| Agents | 1 | 3 | Unlimited | Custom fleet |
| Teams | — | 1 | Unlimited | Multi-org |
| MemPalace | ChromaDB/SQLite | Qdrant/Neo4j | Shared cluster | Isolated per-org |
| Projects | — | 1 | Unlimited | — |
| Human review | — | — | ✓ | ✓ |
| Fleet view | — | — | ✓ | ✓ |
| Custom agents | Clone only | Clone + build | Full | API access |

Show this table in pricing, but also show it as *life on screen* — more agents visible, more collaboration happening, more outcomes arriving. The visual progression is the value proposition.

---

## 8. Technical Integration Map

### 8.1 Live Data Sources (Hermes API → UI)

The current dashboard uses static mock data. The following Hermes APIs need to be wired:

| UI Component | Hermes Data Source |
|---|---|
| Agent status indicators | Gateway health endpoints (hermes-kiri, hermes-forge, hermes-default) |
| Active work cards | `hermes kanban list --status in-progress` |
| Completed outcomes | `hermes kanban list --status done` |
| Agent pulse animation | Session activity (active sessions = pulse on, no sessions = idle) |
| Fleet health summary | Gateway process status + session counts |
| Collaboration rail arrows | Kanban dependency chains (`--parent` relationships) |
| MemPalace graph | Qdrant collections + Neo4j graph traversal via MemPalace MCP tools |

### 8.2 Real-Time Updates

Use **Server-Sent Events (SSE)** for dashboard live updates — simpler than WebSocket for one-directional status streams. The Next.js 14 app can handle SSE routes natively via Route Handlers.

Event types to stream:
- `agent.status_change` — triggers icon state update
- `kanban.card_updated` — refreshes active work
- `kanban.card_completed` — fires outcome card
- `kanban.review_needed` — triggers human review badge
- `mempalace.entry_added` — updates palace depth counter

### 8.3 Kiri Chat Interface

The Kiri chat input (visible in companion view and full-screen chat) connects directly to the `hermes-kiri` gateway. Kiri dispatches to agents via kanban internally — the user just talks to Kiri.

Chat design:
- Streaming response (SSE from Kiri gateway)
- Kiri's messages render with her purple accent on the message bubble border
- Agent dispatch confirmations render inline: "I've asked Compass to research this. You'll see results shortly." with a mini Compass icon
- Full history, searchable, paginated

### 8.4 MemPalace Visualization Stack

- **Graph renderer:** Cytoscape.js (battle-tested, performant for large graphs)
- **Data source:** Neo4j Bolt protocol (port 7687, via MemPalace MCP server at port 3100)
- **Clustering:** Group nodes by agent (namespace) and by topic (auto-clustering)
- **Search:** Full-text search via Qdrant (port 6333)

---

## 9. Competitive Positioning

### vs. Claude Desktop
Claude Desktop is a single-agent chat interface. Kiri OS is an orchestrated fleet with persistent institutional memory. The gap is fleet management, memory depth, and outcome surfacing.

### vs. Linear
Linear is project management for engineering teams. Kiri OS is project execution — agents do the work, not just track it. The kanban view will feel familiar to Linear users, which is intentional.

### vs. Notion
Notion is a writing/database tool. Kiri OS surfaces outcomes, not documents. MemPalace is the knowledge layer where Notion would be a workspace — internal to agents, not user-managed.

### vs. Monday.com / ClickUp
Enterprise project management, human-labor tracked. Kiri OS flips the model: agents are the workers, humans are the reviewers. The 100x model (ClickUp CEO's framing) — AI doing the execution layer — is the core differentiator. Less configuration, more delegation.

### vs. Hyperagent
Hyperagent is developer-first, technical interface. Kiri OS has the warm door (anyone can use it) and the same cold capabilities for power users. The agent catalog, MemPalace, and companion view are the UX moat.

### The actual moat
Not the tech stack. The institutional memory. A user who has been running Kiri for 6 months has an agent fleet that knows their preferences, their history, their recurring tasks, their relationships. That context is in MemPalace and it belongs to them. Starting over with a competitor means starting from zero. The switching cost is not artificial — it's real accumulated value.

---

## 10. Phase Recommendation

**Phase 1 (Now → Ship):** Cold door, production-quality.
Wire live Hermes data to the Next.js dashboard. Fleet health, kanban, active work, SSE updates. This is the foundation and the power user product. Get it right.

**Phase 2:** Companion view + agent catalog.
The warm door. Kiri chat with streaming, 1-3 agent companion view, handoff animations, outcome cards. This is your viral moment and your consumer acquisition surface.

**Phase 3:** MemPalace viewer + project/team view.
Knowledge graph visualization. SMB kanban with human review checkpoints. This unlocks the business tier.

**Phase 4:** Mobile PWA + upgrade flow.
Polish the companion view for mobile. Wire the tier gates. Launch publicly.

The cold stunning dashboard you're building now is Phase 1. Don't dilute it for the companion layer — they're different surfaces. Build Phase 1 to completion, then design Phase 2 as an almost-separate entry point that shares the same API.

---

*This document covers the design specification for Kiri OS v1. Technical implementation details for specific components (SSE route handlers, Cytoscape config, PWA manifest) should be worked out per-component as implementation begins.*
