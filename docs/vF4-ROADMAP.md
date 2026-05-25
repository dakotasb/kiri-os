# vF.4 Roadmap - Agent System Integration

|**Agent:** Forge (Feature Developer)  
|**Team:** Create Team vF.4  
|**Date:** 2026-05-03  
|**Base:** vF.3 Flexbox Dashboard  
|**Target:** vF.4 Agent-Enabled Command Center  

---

## Create Team Roster

| Agent | Role | Function | Icon | Status |
|:------|:-----|:---------|:----:|:------:|
| **Chronicle** | Version Keeper | Dev | 📜 | Active |
| **Mason** | Code Architect | Dev | 🏗️ | Active |
| **Forge** | Feature Developer | Dev | 🔨 | Active |
| **Prism** | Test Engineer | QA | 🔬 | Active |
| **Relay** | CI/CD Pipeline | Ops | 🚀 | Active |
| **Launchpad** | Release Manager | Ops | 🛰️ | Active |
| **Scope** | Research Engineer | Research | 🔭 | Active |
| **Scale** | Performance Auditor | Research | ⚖️ | Active |

**Total:** 8 agents across 4 functions: Dev (3), Ops (2), QA (1), Research (2)

---

## Feature Priority Queue

| Priority | Feature | Status | Purpose |
|:--------:|---------|:------:|---------|
| **1** | **Agent Event Bus** | 🚧 IN PROGRESS | Core pub/sub for agent ↔ UI communication |
| **2** | **Fleet Health Live Updates** | ⏳ PENDING | Real-time agent status in dashboard |
| **3** | **Module Detail Views** | ⏳ PENDING | Click to expand module information |
| **4** | **Command Palette** | ⏳ PENDING | Cmd+K quick actions |

---

## Feature 1: Agent Event Bus

### Overview
Simple pub/sub event system enabling decoupled communication between agents and UI components.

### Implementation Approach

#### Core Pattern (MVC-style)
```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Publisher   │────>│   AgentBus    │────>│   Subscriber  │
│  (Agent/Task) │     │   (Router)    │     │  (UI Module)  │
└───────────────┘     └───────────────┘     └───────────────┘

Events: task.started, task.progress, task.completed, task.failed
        agent.status_update, agent.deployed, directive.executed
```

#### API Surface

```javascript
// Subscribe to events
const unsubscribe = agentBus.subscribe('agent.status_update', (data) => {
  updateFleetHealthCard(data);
});

// Publish events
agentBus.publish('task.started', {
  agent: 'forge',
  module: 'Market Intelligence',
  task_id: 'vf4-feature-bus',
  timestamp: new Date().toISOString()
});

// Semantic aliases
agentBus.on(event, callback);    // Same as subscribe
agentBus.off(event, callback);   // Same as unsubscribe
agentBus.emit(event, data);       // Same as publish
```

### File Structure
```
~/command_center/
├── src/
│   └── agent-bus.js       # Event bus implementation ✅
├── js/
│   └── (to be refactored from HTML inline scripts)
└── vF4-ROADMAP.md         # This document ✅
```

### Integration Points

#### Fleet Health Module (Card 1)
Current: Static HTML with hardcoded values  
Target: Subscribe to `agent.status_update`, `agent.deployed`, `agent.error`

```javascript
// Fleet Health Integration
agentBus.subscribe('agent.status_update', (data) => {
  const fleetTable = document.querySelector('.fleet-table');
  updateAgentRow(fleetTable, data);
  // Trigger visual pulse animation
  pulseElement(fleetTable.querySelector(`[data-agent="${data.agent_id}"]`));
});
```

#### Active Operations Module (Card 7)
Current: Static operation list  
Target: Real-time updates via `task.*` events

```javascript
// Operations Integration
agentBus.subscribe('task.*', (data) => {
  const opsList = document.querySelector('.active-ops');
  appendOrUpdateOperation(opsList, data);
});
```

#### Ask Kiri Input
Current: Console.log placeholder  
Target: Natural language router dispatching via bus

```javascript
// Ask Kiri Router
const routes = {
  'build.*module': 'forge',
  'review.*structure': 'mason',
  'bug.*test': 'bounty',
  'deploy.*production': 'launchpad',
  'performance.*benchmark': 'scale'
};

askKiriInput.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input').value;
  
  for (const [pattern, agent] of Object.entries(routes)) {
    if (new RegExp(pattern, 'i').test(input)) {
      agentBus.emit(`directive.${agent}`, { input, timestamp: Date.now() });
      return;
    }
  }
  agentBus.emit('directive.default', { input });
});
```

#### Quick Actions Modal
Current: Modal.open() placeholder  
Target: Dispatch actions via bus

```javascript
// Quick Actions Integration
QuickActions.handle = (action) => {
  agentBus.emit('action.triggered', { action, source: 'quick_actions' });
};
```

### Event Schema (vF.4.0)

#### Agent → Command Center
```json
{
  "agent": "forge",
  "event": "task.started",
  "timestamp": "2026-05-03T23:30:00Z",
  "payload": {
    "task_id": "vf4-fleet-integration",
    "module": "Fleet Health",
    "progress": 0,
    "status": "planning",
    "message": "Analyzing current Fleet Health module structure"
  }
}
```

#### Command Center → Agent
```json
{
  "directive": "forge.build_feature",
  "params": {
    "feature": "agent_event_bus",
    "priority": 1,
    "integration_target": "fleet_health_card"
  },
  "priority": "critical",
  "deadline": "2026-05-04T00:00:00Z"
}
```

---

## Feature 2: Fleet Health Live Updates

### Overview
Transform static Fleet Health card into real-time agent monitoring dashboard.

### Requirements
- WebSocket or EventSource connection (EventSource for simpler retry)
- Connection status indicator in header
- Agent row animations on status change
- Last seen timestamps
- Connection error handling with fallback

### Implementation Steps
1. Create EventSource connection in `src/agent-stream.js`
2. Bridge SSE events to AgentBus
3. Update Fleet Health card DOM on `agent.status_update`
4. Add connection status indicator

---

## Feature 3: Module Detail Views

### Overview
Click any dashboard card to expand full module details in a modal.

### UI Pattern
```
┌─────────────────────────────────────────────┐
│ Card (hover shows expand hint)              │
│  ┌─────────────────────────────────────┐    │
│  │  Metric  │  Metric  │  [Expand ↗]  │    │
│  └─────────────────────────────────────┘    │
└────────────────────┬────────────────────────┘
                     │ click
                     ▼
┌─────────────────────────────────────────────────────────┐
│ [X] Module: Fleet Health                          ░░░░░│
│ ─────────────────────────────────────────────────────── │
│ ┌──────────┐ ┌───────────────────────────────────────┐ │
│ │ Sidebar  │ │ Main Content                         │ │
│ │ - Agents │ │ ┌───────┬───────┬───────┬───────────┐│ │
│ │ - Teams  │ │ │Agent 1│Agent 2│Agent 3│ [+ Add]   ││ │
│ │ - Health │ │ └───────┴───────┴───────┴───────────┘│ │
│ │ - Logs   │ │                                        │ │
│ └──────────┘ └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Feature 4: Command Palette

### Overview
Global Cmd+K shortcut for quick actions and agent dispatch.

### Implementation
```javascript
// Command Palette (Cmd+K / Ctrl+K)
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    Modal.open(CommandPalette.render(), { title: 'Command Palette' });
  }
});

const CommandPalette = {
  commands: [
    { label: 'Fleet Health', action: () => showModule('fleet-health'), shortcut: 'F' },
    { label: 'New Operation', action: () => agentBus.emit('directive.forge', { task: 'new_op' }), shortcut: 'N' },
    { label: 'Deploy Latest', action: () => agentBus.emit('directive.launchpad', { task: 'deploy' }), shortcut: 'D' }
  ]
};
```

---

## File Checklist

| File | Status | Description |
|------|:------:|-------------|
| `src/agent-bus.js` | ✅ | Event bus implementation |
| `src/agent-stream.js` | ⏳ | EventSource bridge (F2) |
| `src/store.js` | ⏳ | Reactive state store (F1-F4) |
| `vF4-ROADMAP.md` | ✅ | This document |
| `agents/forge/manifest.json` | 🚧 | Forge agent manifest |

---

## Success Criteria

- [x] Agent Bus exists and is globally available at `window.agentBus`
- [ ] Fleet Health receives and displays live agent updates
- [ ] Module click opens detail modal
- [ ] Cmd+K opens command palette
- [ ] All changes maintain vF.3 visual fidelity
- [ ] No regression in accessibility or performance

---

## Notes

- Keep ES5-compatible for maximum browser support
- Maintain existing CSS custom properties
- All new JS modules follow same namespace pattern as existing code
- Test against `vF.3` baseline before F2 implementation

**Next Agent Task:** Implement `src/agent-stream.js` for Fleet Health live updates
