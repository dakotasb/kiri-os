## Agent Verification Failure Mode: "Claimed Success But Server Hung"

**Critical bug pattern from live session:**

### The Failure
Agent was dispatched to fix webpack error → cleared cache → started server → reported SUCCESS:
```
✓ Process: next-server (v1) — PID 16673
✓ HTTP Status: 200 OK  
✓ Title: Command Center — Kiri Orchestration Dashboard
```

**BUT when user tried to access localhost:3001/dashboard:**
- Browser stuck on "loading"
- curl timeout (no response)
- Server was **LISTENING but HUNG** — not actually serving requests

### Root Cause
Agent reported success based on:
1. Process started (PID existed)
2. Port bound (`ss -tlnp` showed LISTEN)
3. Terminal showed "Compiled /dashboard in 4.7s"

But **NEVER verified actual HTTP response** — terminal "Ready" ≠ working server.

The webpack recompilation had triggered an SSR infinite loop or module deadlock that:
- Didn't crash the process (still "running")
- Kept port bound (`ss` showed it listening)
- Prevented HTTP responses (curl timeout)

### Correct Agent Verification Protocol

**MANDATORY for any "fix and restart server" task:**

```bash
# 1. Start server
PORT=3001 npm run dev &

# 2. Wait for compilation (NOT just "Ready" message)
sleep 20-30

# 3. VERIFY with HTTP request — this is the ONLY valid test
curl -s --max-time 10 -w "%{http_code}" http://localhost:3001/dashboard

# MUST return "200" — not empty, not timeout, not 000
# If timeout → server hung, KILL and RETRY

# 4. Verify content, not just status
curl -s http://localhost:3001/dashboard | grep -i "expected-title"
```

### Key Insight

**Process existence + port binding ≠ working server**

A "hung" server passes naive checks:
- ✅ `ps aux | grep next` — process exists
- ✅ `ss -tlnp | grep 3001` — port listening
- ❌ `curl localhost:3001` — **TIMEOUT** (the real test)

### Dispatch Template

When instructing agents to fix Next.js servers, ALWAYS include:

```
CRITICAL: Do NOT report success until HTTP 200 confirmed.

Steps:
1. Clear cache: rm -rf .next
2. Start: PORT=3001 npm run dev
3. WAIT 25 seconds
4. VERIFY: curl -s --max-time 10 http://localhost:3001/dashboard
5. MUST return HTTP 200 with content
6. If timeout → kill process, retry once, escalate if still failing

Report: "HTTP 200 confirmed" NOT "server started"
```

### Detection Commands

```bash
# Check if server is REALLY working (not just listening)
curl -s -o /dev/null -w "%{http_code} | Time: %{time_total}s\n" \
     --max-time 10 http://localhost:3001/dashboard

# Expected: "200 | Time: 2-8s"
# Hung:     "000 | Time: 10.01s" (timeout)
```

---

## Hung Server Detection and Recovery

## Problem: Server Claims "Running" But Is Unresponsive

A common failure mode in Next.js dev environments: the Node.js process is still alive, the port is still bound, but the server is **hung** and won't respond to HTTP requests.

### Symptoms
- `ss -tlnp` shows port 3001 as LISTEN with PID
- `lsof -i:3001` shows next-server process
- **BUT** `curl http://localhost:3001/dashboard` **times out**
- Browser shows "loading" spinner indefinitely
- No error messages in terminal output

### Root Causes
1. **SSR infinite loop** — React component with useEffect dependency cycle
2. **Blocking API call** — Synchronous fetch/call during SSR that never resolves
3. **Webpack module loading deadlock** — Circular dependencies or corrupted hot reload state
4. **Memory pressure / GC thrashing** — Server overwhelmed, can't respond

### Detection Pattern

**NEVER trust just port listening — always verify HTTP response:**

```bash
# BAD: Only checks port binding
ss -tlnp | grep 3001

# GOOD: Verifies HTTP responds within timeout
curl -s -o /dev/null -w "%{http_code} | Time: %{time_total}s" \
     --max-time 10 http://localhost:3001/dashboard

# EXPECTED: "200 | Time: 2.5s" or similar
# FAILURE SIGN: Times out, returns 000, or >30s
```

### Verification Commands

```bash
# Check 1: Port binding
ss -tlnp | grep 3001

# Check 2: Process status
ps aux | grep "next" | grep -v grep

# Check 3: HTTP response with timeout
curl -s --max-time 5 http://localhost:3001/ > /dev/null && echo "OK" || echo "FAILED"

# Check 4: Full response with timing
curl -s -w "\nHTTP: %{http_code}\nTime: %{time_total}s\n" \
     --max-time 10 http://localhost:3001/dashboard
```

### Agent Verification Best Practice

**When dispatching an agent to "fix and verify server":**

```
AGENT INSTRUCTIONS:
1. Start the dev server: PORT=3001 npm run dev
2. WAIT 30 seconds for compilation
3. VERIFY with curl (not just "Ready in Xs"):
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/dashboard
4. MUST return "200" before reporting success
5. If curl times out → server is hung, kill process and retry
```

### Recovery Steps

If detection shows hung server:

**Step 1: Kill the hung process**
```bash
# Find PID from ss output or lsof
PID=$(ss -tlnp | grep 3001 | grep -oP 'pid=\K[0-9]+')
kill -9 $PID 2>/dev/null

# Or brute force
pkill -9 -f "next-server"
pkill -9 -f "next dev"
```

**Step 2: Clear caches**
```bash
rm -rf .next
# Optional: rm -rf node_modules && npm install
```

**Step 3: Restart and verify**
```bash
PORT=3001 npm run dev &
sleep 25
curl -s --max-time 10 http://localhost:3001/dashboard | head -c 100
```

### Prevention

**In Next.js projects prone to hung servers:**

1. **Add healthcheck script to package.json:**
```json
{
  "scripts": {
    "health": "curl -s --max-time 5 http://localhost:3001/api/health || echo 'UNHEALTHY'",
    "dev:safe": "npm run dev & sleep 30 && npm run health"
  }
}
```

2. **Implement API health endpoint** in your app:
```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: Date.now() });
}
```

3. **Monitor during dev:**
```bash
# In a separate terminal
while true; do
  curl -s --max-time 3 http://localhost:3001/api/health > /dev/null \
    && echo "✓ $(date +%H:%M:%S)" \
    || echo "✗ $(date +%H:%M:%S) HUNG?"
  sleep 30
done
```

### WSL2 Specific Notes

In WSL2, hung servers may still appear "healthy" to Windows while being unresponsive:
- Windows browser times out
- curl from WSL times out  
- `ss` still shows listening

**Fix:** Always restart from within WSL, verify with WSL curl first.

### When to Suspect Hung Server

- "It was working, then stopped responding"
- Page loads partially then hangs
- Hot reload stopped working
- Terminal shows "Ready" but no requests complete
- Previous fix attempt claimed success but browser still broken

### Related Skills

- `systematic-debugging` — For tracing root cause of hangs
- `nextjs-cache-troubleshooting` — Full reset patterns
