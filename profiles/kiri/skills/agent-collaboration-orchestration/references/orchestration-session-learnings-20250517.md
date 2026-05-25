# Orchestration Session Learnings - May 17, 2026

## User Communication Patterns

### "Checking In" Signal
**When user says:** "checking in" or similar status request phrases

**Interpretation:** User expects proactive status updates on ALL dispatched agent work. NOT silence. User is requesting a status report on current operations.

**Response:** Immediate status dump with:
- Current state of all dispatched agents
- Elapsed time for each
- Any blockers or issues
- ETA for completion

**Example:**
```
User: "checking in"
Response: "@agent1 running for 5m (compiling), @agent2 complete (port 3002 ready), @agent3 waiting on dependency..."
```

---

### User Dispatch Signals

**Critical phrases that REQUIRE immediate delegation (not direct handling):**

| Signal | User Intent | Correct Response |
|--------|-------------|------------------|
| "dispatch an agent" | Test my orchestration | `terminal(background=True, command="hermes -p AGENT...")` |
| "have [agent] do it" | Delegate, don't execute | Immediate dispatch |
| "preferably [agent]" | Specific agent requested | Use that agent, don't substitute |
| "get [agent] to" | Delegation expected | Dispatch immediately |
| "wait just dispatch an agent" | Stop direct handling | Switch to delegation pattern NOW |

**Anti-pattern:** Continuing with direct terminal commands after user explicitly requested agent dispatch. This triggers user frustration.

---

### Agent Selection Logic

**When user shows frustration with direct handling:**

**Scenario:**
```
User: *asks about snapshot restoration*
Me: *runs terminal commands*
User: "wait just dispatch an agent"
Me: *continues with terminal*
User: "hello????" (escalation)
```

**Correct flow:**
```
User: *asks about snapshot*
Me: "I'll dispatch @relic for this" + immediate dispatch
User: *satisfied*
```

**Rule:** When user signals "dispatch an agent", interpret as capability test. Execute immediately via `terminal(background=True)` with `hermes -p` pattern.

---

### Forensic Investigation Patterns

**When user requests deep analysis:**

**User request:** "figure out why we had such a catastrophic failure... thorough analysis with a report"

**Correct approach:**
1. Dispatch @ember (research agent) for forensic analysis
2. Wait for completion (no interim updates needed for research)
3. Present complete report with findings

**Key:** Research agents can run longer without updates IF user expects comprehensive output at end.

---

### Parallel Execution Management

**When running multiple agents simultaneously:**

**Pattern:** Start agents in parallel, track each process ID, report collectively.

**Example:**
```
"Phase 1 agents dispatched:"
"- @mason (architecture): proc_71b..."
"- @scope (research): proc_f57..."
"- @palette (design): proc_cca..."
"Waiting for all 3 to complete before Phase 2..."
```

**Status updates:** User wants 2-minute updates during parallel execution, even if no change.

---

### Git Destruction Recovery

**When repository has been damaged by reset:**

**Steps:**
1. Identify last working commit from reflog
2. Create working copy (do NOT modify original)
3. Test on alternate port
4. Validate before proceeding

**Example:**
```
"Creating copy for safe iteration on port 3003"
"Original preserved on port 3001"
"Iteration ready on port 3003"
```

---

### User Work Style - New Orchestration Projects

**For investor-ready dashboard projects:**

**User requirements:**
1. Add capabilities, NEVER replace
2. Snapshot before every major change
3. Full git issue management
4. Validation phase for build/visual/functionality
5. World-class UI competing with Codex/Claude Desktop
6. Self-monitoring system
7. Color palette integration from images
8. Sequential AND parallel agent execution as needed
9. Debug as needed, revert when needed
10. Full validation at every change

**User will be asleep:** Agent must self-orchestrate every step, sequential and parallel as needed, with full validation.

**Success criteria:** No destruction, no overrides, clean safe iterations, revert capability, debugging, validation.

---

## Color Palette Integration

**When user provides color palette images:**

**Extract:**
- Primary palette: `#B775BF` `#6CD9BA` `#3F289D` `#1E18D9` `#13121A`
- Secondary palette: `#07D98C` `#4227F2` `#F27EB4` `#A60D61` `#400224`

**Use for:** Secondary button colors, accent themes, dark/light mode variations

---

## Key Learnings

1. **"Dispatch an agent" = immediate delegation**, not discussion
2. **"Checking in" = status report request**, provide full state
3. **"Wait just..." = stop current approach**, switch immediately
4. **Long research tasks** can run without updates if comprehensive output expected
5. **Parallel execution** requires 2-minute status updates
6. **Git destruction** requires working copy + alternate port strategy
7. **Investor-ready** means additive changes, validation, world-class UI
8. **User asleep** = full self-orchestration capability required

---

Session date: 2026-05-17
Duration: Extended multi-hour session
Outcome: Successful forensic analysis + port 3003 setup + new orchestration project planned