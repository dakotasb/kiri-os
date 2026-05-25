# Communication Cadence Signals - Reference Guide

**Session Date:** 2026-05-18  
**Context:** User explicitly defined communication preferences during long-running orchestration

## Signal Vocabulary

### Urgency Signals (Immediate Dispatch)

| Signal | Meaning | Action |
|--------|---------|--------|
| "Go!" / "Go" | Execute now | Skip confirmation, dispatch immediately |
| "Do it now" | No delays | Parallel dispatch, status after |
| "Proceed!!" / "Proceed!" | Continue without pause | No pre-execution questions |
| "Run it" | Execute command | No additional validation |

**Critical:** These signals mean the user is testing orchestration capability, NOT seeking discussion. Skip all "should I..." questions.

### Status Request Signals (Immediate Response)

| Signal | Meaning | Response Time |
|--------|---------|---------------|
| "well?" | Waiting for status | Immediate (< 5s) |
| "hello?" | Checking if alive | Immediate acknowledgment |
| "hello????" / "hello???" | Escalating frustration | URGENT - full status dump |
| "and?" | Waiting for next step | Immediate update |
| "checking in" / "checking in???" | Requesting status update | Comprehensive status report |

### Update Cadence Requirements

**"i need X minute poll updates"** = Non-negotiable requirement
- Set timer for exact cadence requested
- Report even if no change: "⏱️ T+Xm - still running..."
- Never skip requested updates
- User becomes stressed with silence

**Example Implementation:**
```python
def status_update_loop(agent_name, process_id, cadence_minutes=2):
    """
    Maintain communication cadence during long operations.
    cadence_minutes: How often user wants updates (default 2)
    """
    minute = 0
    while process_running(process_id):
        time.sleep(cadence_minutes * 60)
        minute += cadence_minutes
        
        status = get_process_status(process_id)
        report(f"⏱️ T+{minute}m: {status}")
        
        if status == "completed":
            report("✅ Complete")
            break
```

### Punctuation as Stress Indicator

| Pattern | Severity | Response |
|---------|----------|----------|
| "?" | Standard question | Normal priority |
| "??" | Impatience | Accelerate update |
| "???" / "????" | High frustration | Immediate attention |
| "!!!" | Urgency | Treat as critical |
| "???/!!!" mixed | Maximum escalation | Drop everything, status NOW |

## Anti-Patterns to Avoid

❌ Going silent for >2 minutes during agent work  
❌ Waiting for user to ask for status  
❌ Changing update frequency without permission  
❌ Providing status only at completion  
❌ Ignoring "hello???" or "well?" signals  
✅ Proactive, frequent, predictable communication

## The Principle

**Professional orchestration means user never has to ask for status.**
- Pre-empt their questions
- More updates = less anxiety
- Silence = stress
- Predictable cadence = trust

---

**Related:** agent-collaboration-orchestration/SKILL.md - Communication cadence rules
