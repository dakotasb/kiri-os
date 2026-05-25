# Session Continuity & Context Recovery Patterns

## Problem: Gateway Interruption

When the Hermes gateway restarts:
- In-memory session context is lost
- User keeps external message dumps (message.txt files)
- Need to quickly reconstruct "what we were doing"

## Recovery Protocol

### Step 1: Session Search (Primary)
```python
session_search(limit=5)
# Gets recent sessions with titles/preview
```

### Step 2: Deep Session Recall
```python
session_search(query="Phase 3 roadmap command chat", limit=3)
# Searches for specific topics
```

### Step 3: User-Provided Message Dumps

**User may provide `message.txt` files** containing:
- Discord conversation history
- Terminal output dumps
- Partial session transcripts

**Action:** Read and extract key information:
- Current task status
- Dispatched agents and their progress
- Blockers or issues encountered
- Phase completion state

### Step 4: Cross-Reference with Session History

**Example from session 20260520:**
```
User: "[The user sent a text document: 'message.txt']"
Content: Discord conversation showing Phase 2 status, 
         agent dispatches, hydration fixes, UI discrepancies

Kiri Action:
1. Read message.txt → Extract work-in-progress state
2. Search session history → Find "Phase 3 dashboard restoration"
3. Cross-reference → Determine actual current state
4. Resume from where we left off
```

## Critical Information to Extract

| From Message Dumps | Action |
|-------------------|--------|
| Agent dispatches | Note which agents dispatched, their progress |
| Port numbers | Which port is dashboard on? (3001, 3003, etc.) |
| Phase information | Which phase of multi-phase project? |
| UI issues | "0 Agents Online" vs reported counts |
| Completed work | Commits, snapshots, merges |

## Anti-Pattern: Starting Fresh

**WRONG:** "Hi there! How can I help you?" (context lost)

**RIGHT:** "Looking at your message dump — we were in Phase 2 of the dashboard project, @mason fixed the hydration issue. Current status: [summary from dump]"

## User Signals for Context Recovery

| Message Pattern | Interpretation |
|-----------------|----------------|
| "do a session search" | User wants continuity reconstruction |
| Provides `.txt` file | External context that needs integration |
| "what were we doing" | Acknowledge session interruption |
| "prior to gateway restart" | Explicit context loss situation |

## When User Provides Message Dumps

1. **Read immediately** — Don't ask what it's for
2. **Extract status** — What's done, what's pending
3. **Resume work** — Pick up where we left off
4. **Confirm understanding** — "Based on your dump, we were at [X], [Y] was dispatched"
