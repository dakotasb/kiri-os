# Command Center Architecture Documentation
## vF.3 Audit & vF.4 Planning

**Agent:** Mason (Architecture Lead)  
**Audit Date:** 2026-05-03  
**Version:** vF.3 (Flexbox-Based Dashboard)

---

## 1. Component Hierarchy

### 1.1 Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Body (flexbox container)                                    │
│  ├── Sidebar (240px fixed)                                 │
│  │   ├── Logo Section                                      │
│  │   ├── Nav Sections (Overview, Intelligence, Ops)        │
│  │   └── Navigation Items (data-section attributes)        │
│  └── Main Content (flex-1)                                 │
│      ├── Header (sticky, z-index: 100)                     │
│      ├── Ask Kiri Input                                    │
│      └── Dashboard Grid                                    │
│          └── Cards (1-8 modules)                           │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Card Module Inventory

| Position | Module Name | Purpose | Card Size |
|----------|-------------|---------|-----------|
| 1 | Fleet Health | Agent status, team visibility | 1/3 width |
| 2 | Parallel Execution | Concurrent ops, queue status | 1/3 width |
| 3 | Team Orchestration | Active teams summary | 1/3 width |
| 4 | Memory & Graph | Knowledge graph metrics | 1/4 width |
| 5 | Intelligence Quality | Quality scores | 1/4 width |
| 6 | Market Intelligence | Insights processed | 1/2 width |
| 7 | Active Operations | Running tasks | 1/3 width |
| 8 | Performance Analytics | Latency, success rates | 2/3 width |

### 1.3 Component Tree
```
Page
├── Sidebar
│   ├── Logo (icon + text)
│   ├── NavSection (x3)
│   │   └── NavItem (data-section attribute routing)
├── Header
│   ├── StatusIndicator (online dot + text)
│   ├── StatsDisplay
│   └── ActionButtons (Quick Action, New Operation)
├── AskKiri
│   ├── InputLabel
│   ├── TextInput
│   └── SubmitButton
└── Dashboard
    └── Card (x8)
        ├── CardHeader (title + actions)
        └── CardContent
            ├── Metric (value + change)
            ├── VisualComponent
            │   ├── ExecutionGrid
            │   ├── TeamGrid
            │   ├── GraphPreview
            │   ├── Sparkline
            │   ├── List
            │   └── OperationList
            └── StatRows
```

---

## 2. CSS Methodology

### 2.1 Architecture Pattern
**Custom Properties (Design Tokens) + BEM-lite Class Naming**

Uses CSS custom properties for theming with semantic class naming rather than strict BEM.

### 2.2 Design Token System

#### Core Tokens
```css
:root {
  /* Background Scale */
  --bg-primary: #0A0A0C
  --bg-secondary: #0F1011
  --bg-tertiary: #141416
  
  /* Surface Elevation (100-500) */
  --surface-100: #19191B
  --surface-200: #1E1E20
  --surface-300: #232326
  --surface-400: #2A2A2D
  --surface-500: #333336
  
  /* Text Hierarchy */
  --text-primary: #F7F8F8
  --text-secondary: #D0D6E0
  --text-tertiary: #8A8F98
  --text-quaternary: #62666D
  
  /* Brand Accents */
  --accent-violet: #6E56CF
  --accent-violet-hover: #7C66D9
  
  /* Functional Accents */
  --success: #27A644
  --info: #59A5F1
  --warning: #F1B859
  --error: #F15959
  
  /* Typography */
  --font-ui: 'Inter', system-ui, sans-serif
  --font-mono: 'JetBrains Mono', monospace
}
```

### 2.3 Layout System

#### Flexbox Grid Pattern
```css
.dashboard {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 380px;
  min-width: 280px;
  max-width: 600px;
}
```

#### nth-child Card Sizing
- Row 1: `nth-child(1-3)` → 33.33% width
- Row 2: `nth-child(4-5)` → 25% width, `nth-child(6)` → 50%
- Row 3: `nth-child(7)` → 33.33%, `nth-child(8)` → 66.66%

### 2.4 Container Queries
```css
@container card (min-width: 450px) {
  .content-verbose { display: block; }
  .content-compact { display: none; }
}

@container card (min-width: 500px) {
  .op-verbose { display: flex; }
  .op-compact { display: none; }
}
```

### 2.5 Animation Strategy
- **Card Entry:** `translateY(8px) → 0`, opacity fade, staggered delays (50ms increments)
- **Status Dots:** CSS pulse animation
- **Progress Bars:** width transition 300ms
- **Reduced Motion:** Respects `prefers-reduced-motion`

---

## 3. JavaScript Module Structure

### 3.1 Pattern: Namespace Objects

Uses pattern libraries instead of ES6 modules:

```javascript
const Modal = { open(), close() }
const QuickActions = { show(), handle(action) }
```

### 3.2 Module Breakdown

#### Modal System
```javascript
const Modal = {
  current: null,
  open(html, options = {}) {
    // Creates overlay, backdrop, container
    // Handles close on backdrop/close button click
  },
  close() { removes current modal from DOM }
}
```

#### Quick Actions System
```javascript
const QuickActions = {
  actions: Array<{icon, label, action}>,
  show() { renders buttons in Modal },
  handle(action) { console logs for extension }
}
```

#### Initialization Pattern
```javascript
(function() {
  'use strict';
  function init() { /* DOM ready handlers */ }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
```

### 3.3 Event Binding
- **Card Actions:** Keyboard accessibility (`Enter`/`Space`)
- **Buttons:** Direct click handlers with optional chaining (`?.`)
- **Forms:** Event delegation for dynamically created forms

---

## 4. API/Event Bus Patterns

### 4.1 Current State
**No event bus implementation in vF.3.** JavaScript is purely UI-interaction focused.

### 4.2 vF.4 Event Bus Architecture (Proposed)

Based on the Agent OS Integration Design, vF.4 should implement:

```javascript
// Event Bus Pattern (Pub/Sub)
const AgentBus = {
  events: {},
  
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => this.off(event, callback);
  },
  
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  },
  
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(data));
  }
};

// Agent Event Structure
{
  "agent": "forge",
  "event": "task.started|task.progress|task.completed|task.failed",
  "timestamp": "2026-05-03T23:00:00Z",
  "payload": {
    "task_id": "vf4-module-market-intel",
    "module": "Market Intelligence",
    "progress": 45,
    "status": "coding",
    "message": "Implementing WebSocket feed connector"
  }
}
```

### 4.3 Ask Kiri Integration Point
```javascript
// Natural language router for agent dispatch
class AskKiriRouter {
  routes = {
    'build.*module': 'forge',
    'review.*structure': 'mason',
    'bug.*test': 'bounty',
    'deploy.*production': 'launchpad',
    'performance.*benchmark': 'scale'
  };
  
  route(input) {
    for (const [pattern, agent] of Object.entries(this.routes)) {
      if (new RegExp(pattern, 'i').test(input)) {
        return AgentBus.emit(`directive.${agent}`, { input });
      }
    }
    return AgentBus.emit('directive.default', { input });
  }
}
```

---

## 5. State Management

### 5.1 Current Approach
**Server-rendered HTML with minimal client state.**

- No client-side state store
- Data hardcoded in HTML for demo
- Form data captured via FormData API

### 5.2 vF.4 State Management (Recommended)

#### Option A: Module Pattern Store
```javascript
const Store = {
  state: {
    agents: [],
    operations: [],
    metrics: {}
  },
  
  subscribers: [],
  
  set(key, value) {
    this.state[key] = value;
    this.notify(key);
  },
  
  get(key) { return this.state[key]; },
  
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  },
  
  notify(changedKey) {
    this.subscribers.forEach(cb => cb(changedKey, this.state));
  }
};
```

#### Option B: Map-based Reactive Store
```javascript
class ReactiveStore {
  constructor() {
    this.state = new Map();
    this.subscribers = new Map();
  }
  
  set(key, value) {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    this.publish(key, value, oldValue);
  }
  
  get(key) { return this.state.get(key); }
  
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) this.subscribers.set(key, []);
    this.subscribers.get(key).push(callback);
    return () => this.unsubscribe(key, callback);
  }
  
  publish(key, newValue, oldValue) {
    if (!this.subscribers.has(key)) return;
    this.subscribers.get(key).forEach(cb => cb(newValue, oldValue));
  }
}
```

---

## 6. vF.4 Architecture Improvements

### 6.1 Structural Recommendations

| Area | Current | vF.4 Recommendation |
|------|---------|---------------------|
| **CSS** | Single-file, ~1,400 lines | Split into modules: `tokens.css`, `layout.css`, `components.css` |
| **JS** | Global namespace objects | ES6 modules with explicit exports |
| **Templates** | Static HTML | Template literals → Web Components or framework |
| **State** | None | Reactive store with subscriptions |
| **Events** | Direct DOM binding | Event bus for agent communication |

### 6.2 File Structure (Proposed)
```
command_center/
├── css/
│   ├── tokens.css          # CSS custom properties
│   ├── reset.css           # Base styles
│   ├── layout.css          # Grid/flexbox patterns
│   ├── components/         # Component styles
│   │   ├── card.css
│   │   ├── modal.css
│   │   ├── metrics.css
│   │   └── operations.css
│   └── animations.css      # Keyframes
├── js/
│   ├── main.js             # App entry
│   ├── store.js            # State management
│   ├── bus.js              # Event bus
│   ├── api.js              # MemPalace/API client
│   └── components/         # Component classes
│       ├── Card.js
│       ├── Modal.js
│       ├── AgentStatus.js
│       └── OperationList.js
├── modules/                # Dashboard modules
│   ├── FleetHealth.js
│   ├── ParallelExecution.js
│   ├── TeamOrchestration.js
│   └── ... (8 modules)
└── index.html              # Minimal shell
```

### 6.3 Agent System Integration Points

#### Fleet Health Module
**Current:** Static HTML with hardcoded values  
**vF.4:** WebSocket/EventSource consumer receiving:
```json
{
  "agent": "ops_monitor",
  "event": "agent.status_update",
  "payload": {
    "agent_id": "alpha",
    "team": "research",
    "status": "active|processing|idle|error",
    "health_score": 98.5
  }
}
```

#### Active Operations Module
**Current:** Static operation list  
**vF.4:** Real-time operation feed with SSE:
```javascript
const eventSource = new EventSource('/api/v1/operations/stream');
eventSource.addEventListener('operation_update', (e) => {
  const update = JSON.parse(e.data);
  Store.set(`operations.${update.id}`, update);
});
```

#### Ask Kiri Input
**Current:** Console.log placeholder  
**vF.4:** Natural language router dispatching to agents via `AgentBus`

---

## 7. Security Considerations

### 7.1 Current
- No user input sanitization (placeholder console.log only)
- No XSS protection on dynamic content

### 7.2 vF.4 Requirements
- Sanitize all dynamic content before DOM insertion
- CSP headers for script/style sources
- Validate all agent payloads before processing
- Rate limiting on Ask Kiri endpoint

---

## 8. Accessibility Audit

### ✅ Strengths
- Skip to main content link
- `prefers-reduced-motion` media query support
- Focus indicators on card containers
- Keyboard navigation for card actions
- Semantic HTML (aside, main, header, nav)

### ⚠️ vF.4 Improvements
- Live region updates for active operations
- ARIA labels for dynamic content updates
- Focus management in modals
- Color contrast verification
- Screen reader announcements for agent status changes

---

## 9. Performance Notes

### 9.1 Current
- Single HTML file (~80KB) - efficient for demo
- No external JS dependencies
- CSS animations use GPU-accelerated properties
- Container queries enable responsive without JS

### 9.2 vF.4 Considerations
- Implement virtual scrolling for operation lists > 50 items
- Lazy load module content on scroll
- Debounce store updates for rapid events
- Use Intersection Observer for viewport-based loading

---

## Appendix: Component API Quick Reference

### Modal
```javascript
Modal.open(htmlString, { title: string });
Modal.close();
```

### Card Structure (CSS)
```css
.card → container with container-type: inline-size
.card-header → title + actions flex
.metric → large value + change indicator
.list → vertical flex list with hover states
```

### Ask Kiri
```javascript
// Input: .ask-kiri-input
// Submit: .ask-kiri-submit
// Captures Enter key and click
// TODO: Route to appropriate agent
```

---

*Document authored by Mason*  
*Part of vF.4 Architecture Planning*
