# Agent OS Integration Architecture
## Create Team ↔ Command Center ↔ MemPalace

### Core Principle
Agents are persistent processes with state, reporting to the Command Center UI via a simple event bus pattern.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     COMMAND CENTER UI                        │
│  ┌─────────────┐ ┌─────────────┐ ┌────────────────────────┐   │
│  │Fleet Health │ │Active Ops   │ │ Ask Kiri             │   │
│  │(agent stat) │ │(task stat)  │ │ (input endpoint)     │   │
│  └─────────────┘ └─────────────┘ └────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/SSE Events
┌──────────────────────▼──────────────────────────────────────┐
│                    AGENT BUS                                 │
│  (Simple JSON event stream: agent_id, status, payload)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │Chronicle│   │  Forge  │   │  Mason  │   │  Prism  │
   │ Version │   │ Feature │   │Architect│   │  Test   │
   │ Keeper  │   │    Dev  │   │         │   │ Engineer│
   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    MEMPALACE                                │
│  (Knowledge Graph + Memory Palace + Agent Config Storage)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Agent Registry

### Phase 1: Foundation (Deploy First → Last)

| Priority | Agent | Role | First Task | Reports To |
|----------|-------|------|------------|------------|
| 1 | **Chronicle** | Version Keeper | Initialize git hooks, validate repo health | Fleet Health |
| 2 | **Mason** | Code Architect | Audit vF.3 structure, document patterns | Fleet Health |
| 3 | **Prism** | Test Engineer | Create test suite for UI components | Quality Monitor |
| 4 | **Lens** | UAT Coordinator | Validate vF.3 against user requirements | Quality Monitor |
| 5 | **Forge** | Feature Developer | Begin vF.4 feature set | Active Operations |
| 6 | **Scale** | Performance Auditor | Benchmark dashboard performance | Performance Analytics |

### Phase 2: Operations
| Priority | Agent | Role | First Task |
|----------|-------|------|------------|
| 7 | **Bastion** | Security Sentinel | Audit dependencies, scan for vulns |
| 8 | **Bounty** | Bug Hunter | Search existing code for issues |
| 9 | **Temper** | QA Analyst | Establish QA gates |
| 10 | **Launchpad** | Release Manager | Create release checklist |

---

## 3. Communication Protocol

### Agent → Command Center (Events)
```json
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

### Command Center → Agent (Directive via Ask Kiri)
```json
{
  "directive": "forge.build_module",
  "params": {
    "module": "Market Intelligence",
    "features": ["websocket_feeds", "alert_thresholds"]
  },
  "priority": "high",
  "deadline": "2026-05-04T12:00:00Z"
}
```

---

## 4. MemPalace Taxonomy

```
palace: personality_memory_palace
├── wing: agent_org
│   ├── hall: create_team
│   │   ├── room: chronicle (version, git, releases)
│   │   ├── room: forge (features, builds)
│   │   ├── room: mason (architecture, patterns)
│   │   ├── room: prism (tests, coverage)
│   │   ├── room: lens (uat, validation)
│   │   ├── room: scale (perf, benchmarks)
│   │   └── room: bastion (security, audit)
│   ├── hall: operations
│   │   ├── room: deployments
│   │   ├── room: events
│   │   └── room: issues
│   └── hall: directives
│       └── room: active_directives
└── wing: create_learn
    └── (shared learnings across iterations)
```

---

## 5. Deployment Order (Critical Path)

```
Chronicle (foundation)
    │
    ▼
Mason (structure audit) ───────┐
    │                            │
    ▼                            │
Prism + Lens (validation)        │
    │                            │
    ▼                            │
Forge (development) ◀────────────┘
    │
    ▼
Scale (performance verification)
    │
    ▼
Bastion (security scan)
    │
    ▼
Launchpad (release)
```

---

## 6. Ask Kiri Integration

The "Ask Kiri" input box in Command Center becomes the **natural language router**:

| User Input | Routed To | Action |
|------------|-----------|--------|
| "Build a Market Intelligence module" | Forge | Create module with specs |
| "Review the code structure" | Mason | Audit and document |
| "Are there any bugs?" | Bounty | Scan and report |
| "Deploy to production" | Launchpad | Execute release pipeline |
| "How's performance?" | Scale | Run benchmarks, report |

---

## 7. State Machine

Each agent maintains:
- **IDLE** → Waiting for directive
- **PLANNING** → Analyzing requirements
- **EXECUTING** → Doing work
- **REVIEWING** → Self-check / peer review
- **COMPLETE** → Done, awaiting next
- **BLOCKED** → Needs input/escalation

State changes push events to Command Center.
