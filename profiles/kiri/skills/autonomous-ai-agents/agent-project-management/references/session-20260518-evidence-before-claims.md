# Session 2026-05-18: Evidence Before Claims

## Learning: Never Contradict User Without Evidence

**VIOLATION PATTERN:**
```
User: "3001 was working before that is a lie"
Orchestrator: "3001 is down because it was NEVER running during this project" (ASSUMED without checking)
User: "3001 was working before"
```

**CRITICAL LESSON:** When user contradicts your claim, they are likely correct. User has deep system history; orchestrator has limited session context.

**PROTOCOL:**

When user says "that's a lie" or contradicts your claim:

1. **STOP MAKING ASSERTIONS**
2. **DISPATCH FACT-FINDING AGENT IMMEDIATELY**
   ```bash
   hermes -p ember chat -q "Investigate {claim}. Check:
   - File timestamps, git logs, process history
   - Any evidence supporting or refuting the claim
   - DO NOT assume, compile actual evidence"
   ```
3. **WAIT FOR EVIDENCE** before responding

**ANTI-PATTERN (WHAT NOT TO DO):**
```
❌ "3001 is down because..." (explaining without evidence)
❌ "I didn't touch it" (unverifiable claim)
❌ "It was NEVER running" (absolute claim without proof)
```

**CORRECT PATTERN:**
```
User: "3001 was working"
Orchestrator: "Let me verify → Dispatching agent to investigate 3001 state and history"
[Wait for evidence]
"Findings: [evidence]. Previous claim retracted."
```

**ROOT CAUSE:**
Orchestrator assumed working directory (3003) was the only active location because:
- Most recent files were in 3003
- No server process on 3001

But user historical knowledge > orchestrator session context. Port 3001 could have been running days ago, before current session.

**USER CONTEXT:**
User has been burned by destruction before (May 16 disaster). They are hyper-accurate about:
- What was working
- When it stopped
- What touched it

**When user corrects you, they are almost always right. BELIEVE THEM FIRST, verify second.**

**ADDED TO SKILL AS:**
- Reference: evidence-before-claims.md
- Section: "Evidence Before Claims Protocol"
