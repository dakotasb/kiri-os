# Gateway Interruption Recovery Protocol

**Session Date:** 2026-05-18  
**Incident:** Gateway restarted, all background processes terminated

## The Problem

When gateway/system restarts occur:
- All background processes die (agents, servers, builds)
- No state preserved automatically
- User returns to find work lost
- Cannot assume continuity

## Recovery Protocol (MANDATORY)

### Step 1: Immediate Acknowledgment
```
"⚠️ Gateway interruption detected - all processes terminated. Verifying state..."
```

### Step 2: Server Port Check
```bash
ss -tlnp | grep -E "3001|3003|PORT_LIST"
```
If no output → servers DOWN

### Step 3: Process Verification
```bash
ps aux | grep "hermes\|next\|node" | grep -v grep
```
If empty → all agents terminated

### Step 4: Checkpoint Status
- Check latest snapshot: `ls ~/snapshots/* | tail -5`
- Identify last known good state
- Report: "Last checkpoint: [timestamp] - [status]"

### Step 5: Recovery Decision Tree

| Scenario | Action |
|----------|--------|
| Servers down + agents dead + checkpoint exists | Restart from checkpoint |
| Servers down + agents dead + no checkpoint | Restart fresh, warn user |
| Servers up + agents dead | Only restart agents |
| Everything running | ✅ Continue normally |

### Step 6: State Report to User
```
"After interruption:
- Port 3001: [up/down]
- Port 3003: [up/down]  
- Agents: [running/terminated]
- Last checkpoint: [timestamp]
- Recovery: [Action taken]"
```

## Critical: Never Assume

❌ **WRONG:** Continuing without verification  
❌ **WRONG:** "Everything should be fine..."  
❌ **WRONG:** Waiting for user to notice

✅ **CORRECT:** Always verify after ANY interruption  
✅ **CORRECT:** Report status before continuing  
✅ **CORRECT:** Restart from known good state

## Prevention

- Create checkpoints before long operations
- Document running processes in session context
- User should know to expect full restart protocol on return

---

**Related:** Professional PM standards require proactive status updates after ANY system event.
