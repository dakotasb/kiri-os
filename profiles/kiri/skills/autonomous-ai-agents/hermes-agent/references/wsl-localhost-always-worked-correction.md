# User Correction Pattern: "It ALWAYS worked on localhost"

## The Correction

**What user said:** "what? don't do that it ALWAYS worked on localhost"

**What I was doing:** Changing Next.js dev server binding from localhost to WSL IP address

**What I should have done:** Respected user's knowledge of system history and investigated what actually broke

## The Lesson

When a user says "it ALWAYS worked" or similar phrasing, this is a **critical signal** about their mental model of the system.

**Interpretation:**
- User has historical knowledge that contradicts your diagnosis
- The architecture/configuration they describe was functional
- Something changed/broke — don't assume the architecture was wrong

**Correct Response Sequence:**
1. **Acknowledge** — "You're right, if it worked before, the networking was fine"
2. **Pivot** — "Let me check what actually changed: build cache, stuck process, port conflict"
3. **Verify with minimal changes** — Clear cache, restart, verify before changing fundamentals

## Anti-Pattern to Avoid

```bash
# WRONG: Assuming networking architecture is broken
curl http://localhost:3001  # works from WSL
# Diagnoses: "WSL networking issue - need to bind to different IP"
# Action: Changes Next.js to bind to 0.0.0.0 or WSL IP

# User: "what? don't do that it ALWAYS worked on localhost"
```

## The Real Issues to Check First

When localhost:PORT "suddenly" stops working (but user says it always worked):

### 1. Build Cache Corruption
```bash
cd ~/project && rm -rf .next && npm run dev
```

### 2. Stuck Process
```bash
pkill -9 -f "next dev"
pkill -9 -f "next-server"
ss -tlnp | grep 3001  # Verify cleared
```

### 3. Port Conflict
```bash
ss -tlnp | grep 3001  # Something else using port?
```

### 4. Server Start Order
```bash
# Wrong order: Start server in WSL, expect Windows to connect
# Right order: Clear → Restart → Test from WSL first → Then Windows
```

## When to Actually Change Networking

Only escalate to WSL IP binding if:
- User EXPLICITLY says "my WSL localhost never worked" or
- Multiple restart/cache-clear attempts fail AND
- User confirms "yes try the IP address"

## Reference

**Session:** 2026-05-17
**Scenario:** Restored dashboard from snapshot, server appeared running, curl worked, but Firefox couldn't connect
**Wrong fix:** Changed binding to WSL IP (172.26.210.95)
**User correction:** "localhost ALWAYS worked" 
**Root cause (likely):** Build cache corruption or stuck process from multiple restart attempts
**Lesson:** Trust user's system knowledge over your networking assumptions
