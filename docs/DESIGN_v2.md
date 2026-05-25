# Command Center v2 - Dual Persona Design Specification

## Core Philosophy

**One UI, Two Experiences:**
- Basic users see "it just works" with smart defaults
- Power users can expand to see "why and how"
- No mode switching, no complex onboarding
- Progressive disclosure through interaction

---

## Persona A: Basic User (Default View)

### What They See:
```
┌─────────────────────────────────────────────────────────┐
│  Command Center                   [Agent Status: 🟢]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "What would you like to delegate?"                     │
│  [Type task or pick from recent...]                    │
│                                                         │
│  Quick Actions:                                         │
│  [📊 Research Market]  [🤖 Spawn Agent] [⚙️ Settings] │
│                                                         │
│  Recent Activity:                                       │
│  ✅ Dashboard built (2 hours ago)                       │
│  ✅ Neo4j fix completed (today)                         │
│  🔄 Revenue analyst running...                          │
│                                                         │
│  [View Full Dashboard] ← Expands to full 8-module     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### What They DON'T See:
- ❌ Tier 1/2/3 classifications
- ❌ Artifact Tracker logs
- ❌ MemPalace palace names
- ❌ KG relationship details
- ❌ Storage metrics
- ❌ "Save to MemPalace" button (automatic implied)

### Default Behaviors:
- Files auto-logged (Artifact Tracker invisibly)
- Complex tasks auto-delegated (Agent spawn suggested)
- Work remembered (MemPalace auto-linked for agents)
- Safety enforced (guardrails automatic)

---

## Persona B: Power User (Expanded Views)

### How They Access Deep Features:
**Hover/Click → "Show Details"** reveals layer underneath

```
Activity: ✅ Dashboard built
          └─[Details]→ Expands to:
            
            File: ~/command_center/command-center.html
            Size: 134KB | Lines: 3,950
            Agent: tech_lead (Job: 8abbbb9f409c)
            ├─ Artifact ID: 119abed10be29146
            ├─ MemPalace: dashboard_fact (linked)
            ├─ Validation: ✅ Passed
            └─ Guardrail: Tier 1 (auto-approved)
            
            [View in Artifact Tracker]
            [Edit MemPalace Entry]
            [Force Re-validate]
```

### Power Features Disclosed:
- **Settings Panel:** Guardrail thresholds, auto/delegation preferences
- **System View:** Full 8-module dashboard with all metrics
- **Memory View:** Artifact Tracker + MemPalace side-by-side
- **Agent View:** Spawn controls, job history, tunnel visualization

---

## Visual Design (Linear.app Style)

### Color System:
```css
--bg-primary: #0D0D0F        /* Main background */
--bg-secondary: #1A1A1C      /* Cards, elevated surfaces */
--bg-tertiary: #2A2A2C       /* Hover states */
--text-primary: #FFFFFF      /* Headings */
--text-secondary: #9CA3AF    /* Body text */
--text-muted: #6B7280        /* Subtle text */
--accent: #6E56CF            /* Primary actions */
--accent-hover: #7C66D8      /* Accent hover */
--success: #10B981           /* Completed tasks */
--warning: #F59E0B           /* Attention needed */
--error: #EF4444             /* Failures */
--info: #3B82F6             /* Information */
```

### Typography:
- **Inter:** Main UI, labels, body text
- **JetBrains Mono:** Code, artifact IDs, timestamps

### Components:
- **Cards:** Rounded corners (8px), subtle shadow
- **Buttons:** Rounded (6px), accent for primary, muted for secondary
- **Inputs:** Subtle borders, glow on focus
- **Icons:** Lucide icons, 16-20px, consistent style

---

## Key UI Patterns

### 1. The "Just Works" Bar
```
Always visible, always helpful:

[🤖 Quick Agent] [💾 Recent] [⚡ Quick Action] [🔍 Search]
           └─ Hover shows: "Delegate to agent for research"
```

### 2. Activity Feed (Smart Defaults)
```
"Build dashboard" → Agent completes → Shows as ✅ (auto-logged)
Click ✅ → Shows basic: "Built in 45 minutes"
Click details → Shows full: Agent logs, validation, file location

NO "Save this" button - automatic for basic users
```

### 3. Progressive Disclosure
```
Card: "Agent Organization"
      └─ Click: Expands to show 6 palaces
          └─ Click palace: Shows agents
              └─ Click agent: Shows config + recent jobs
                  └─ Click job: Shows full artifact trail

One button: [More Details] → [Even More] → [Full System View]
```

### 4. Safety Indicators (Calm, Not Alarmed)
```
🟢 System Healthy (not: "GUARDRAILS ACTIVE")
⚠️ Check Settings (not: "TIER 3 VIOLATION DETECTED")

Click: "How does this work?" → Friendly explanation
Power user: "View Full Guardrail Config" → All thresholds visible
```

---

## Implementation: Command Center v2

### Layout Structure:
```
┌──────────────────────────────────────────────────────────┐
│ Header: Logo | Quick Bar | Status | [Settings ▼]        │
├──────────────────────────────────────────────────────────┤
│ Sidebar |                                              │
│ [Quick] │  Main Content Area                         │
│ [Recent]│                                              │
│ [Agents]│  [Activity Feed] ← Default view            │
│ [Memory]│                                              │
│ [System]│  [8 Module Overview] ← Click to expand     │
│         │                                              │
└─────────┴───────────────────────────────────────────────┘

Sidebar items: Click to expand view
Settings: Power user panel
```

### 8 Modules (Power View):
1. **Agent Fleet Health** - Green/red status, expandable to full
2. **Parallel Execution** - Grid view, task flow
3. **Team Orchestration** - Org chart, tunnel visualization
4. **Memory & Knowledge Graph** - MemPalace UI (basic view)
5. **Intelligence Quality** - Validation results, guardrail logs
6. **Market Intelligence** - Research summaries
7. **Active Operations** - Running agents, progress bars
8. **Performance Analytics** - Token usage, latency, storage

---

## Technical Integration Points

### Artifact Tracker Visibility:
```
Option A: Log file accessible via [Activity ▼ → Details → View in Tracker]
Option B: "System View" shows Artifact Tracker summary
```

### Guardrail Integration:
```
NO visible Tier labels
DO show: "Last backup: 5 min ago" ✅
DO show: "Last validation: Passed" ✅
Power users: [View Guardrail Config] shows Tier 1/2/3
```

### MemPalace Visibility:
```
Basic: "Work remembered" (implied)
Power: "🔗 Linked to: market_research_palace" (clickable)
```

---

## Success Metrics

### Basic User:
- ✅ Can delegate task without understanding architecture
- ✅ Can find previous work without knowing where stored
- ✅ Feels system "remembers" automatically
- ✅ Never sees overwhelming technical details

### Power User:
- ✅ Can access Artifact Tracker
- ✅ Can adjust guardrail thresholds
- ✅ Can see delegation vs direct decision rationale
- ✅ Can curate MemPalace manually when needed
- ✅ Can view full system architecture

### Both:
- ✅ Same UI, different depths
- ✅ No jarring mode switches
- ✅ Safety enforced regardless of persona
- ✅ "Wow" moment on first use

---

## Files to Update

1. **~/command_center/DESIGN.md** - This spec + previous
2. **~/command_center/command-center.html** - Implement v2
3. **Documentation** - Dual-persona user guide

## Next Steps

1. Core build team reviews this spec
2. Design agent collaborates on visual details
3. Implement progressive disclosure patterns
4. Test with both personas
5. Iterate based on "wow" feedback

---

**Philosophy:** Trust users with complexity, but don't force it on them.
