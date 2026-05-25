# User Urgency Signals - Immediate Execution Pattern

## Classification: FIRST-CLASS SKILL SIGNAL

**When user signals urgency, YOU MUST execute immediately. NO questions. NO confirmation.**

## Urgency Phrases (Non-Exhaustive)

The following phrases indicate user wants **immediate execution without discussion**:

- "Go!"
- "Go now"
- "Proceed!!" (with emphasis)
- "Do it now"
- "Execute immediately"
- "Dispatch them"
- "Do it"
- "Make it happen"
- "Get it done"
- Similar imperative urgency signals

## Correct Response Pattern

**✅ ACCEPTABLE:**
```
## ✅ DISPATCHED — {Summary}

**{N} Agents Running:**
- @{agent1} → {task}
- @{agent2} → {task}
...

**Status:** {ETA or "Running now"}
```

**❌ NEVER:**
- "Should I...?"
- "Are you sure...?"
- "Before we proceed..."
- "Let me verify..." (verify AFTER executing)
- "Wait, are we...?"
- Any question or hesitation

## Context

User explicitly stated (Session 2026-05-16):
> "when i say go i don't need you to ask questions i need you to do"

**User is testing orchestration capability, not seeking discussion.**

## Session Examples

### Example 1: "Proceed!!"

**User:** "Yes dispatch agents to run these fixes"

**Wrong Response:**
"Should I wait for...? Which agents...?"

**Correct Response:**
"DISPATCHING IMMEDIATELY ⚡" → dispatch all agents in parallel → report status

### Example 2: "Go!"

**User:** "Go fix the build errors"

**Wrong Response:**
"Which build errors specifically...?"

**Correct Response:**
"DISPATCHED @forge → build fixes" → execute → report

### Example 3: "Do it now"

**User:** "Do it now"

**Wrong Response:**
"Let me confirm the plan first..."

**Correct Response:**
Immediate parallel dispatch of all planned agents

## Anti-Patterns to Avoid

| Signal Received | Wrong Response | Correct Response |
|-----------------|---------------|------------------|
| "Go!" | "Are you sure we should...?" | Execute immediately |
| "Proceed!!" | "Before I proceed..." | Execute immediately |
| "Do it now" | "Let me verify..." | Execute immediately |
| "Dispatch them" | "Which agents specifically?" | Execute immediately |

## When User Wants Discussion

**User will ask questions:**
- "Should we...?"
- "What do you think about...?"
- "Can you explain...?"
- "Why...?"

**These are DISCUSSION signals, not urgency signals.**

## Summary Rule

**Urgency Signal → Immediate Execution → Report After**

**Discussion Signal → Clarify → Plan → Execute → Report**

Learn the difference. Trust the user's signal.
