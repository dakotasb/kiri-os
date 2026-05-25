# Next.js Dashboard "Stuck Loading" Debugging Pattern

**Session:** 2026-05-17  
**Symptom:** Dashboard shows "stuck loading" with server process running  
**Root Cause:** Corrupted `.next` build cache causing infinite loop (106% CPU, 51% memory)

## Diagnosis Pattern

1. **Process appears running but unresponsive:**
   ```bash
   ss -tlnp | grep 3001
   # Shows: LISTEN *:3001 users:(("next-server",pid=12033,...))
   ```

2. **Curl times out despite server listening:**
   ```bash
   curl -s http://localhost:3001
   # Times out after 15s
   ```

3. **Check CPU/memory usage:**
   ```bash
   ps aux | grep next-server
   # Shows: 106% CPU, 51% memory consumption (infinite loop indicators)
   ```

## Fix Procedure

### Step 1: Kill stuck server
```bash
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
```

### Step 2: Clear corrupted build cache
```bash
rm -rf .next
```

### Step 3: Restart with clean cache
```bash
# For specific port:
npx next dev -p 3001

# Or with env var:
env PORT=3001 npm run dev
```

### Step 4: Verify actual response
```bash
curl -s --max-time 10 http://localhost:3001 | head -20
# Should return HTML immediately, not timeout
```

## Critical Distinction: Port 3000 vs Port 3001

After the fix, @relic started server on **port 3000** (default). User explicitly required **port 3001**.

**When user requires specific port:**
```bash
# Check what's actually running:
ss -tlnp | grep -E '3000|3001'

# If running on wrong port, restart with explicit port:
pkill -9 -f "next-server"
rm -rf .next
cd <project-dir> && npx next dev -p 3001

# Verify:
curl -s http://localhost:3001 | grep -o "Command Center"
# Should output: Command Center
```

## Port Conflict Resolution

**Find what's using port 3001:**
```bash
ss -tlnp | grep 3001 | grep -o 'pid=[0-9]*' | cut -d= -f2
# Returns: 12345

# Kill specific PID:
kill -9 12345
```

**Kill all next processes (nuclear option):**
```bash
pkill -9 -f "next"
```

## Prevention

When restoring from snapshot with `npm run dev`:
1. Always clear `.next/` first if previous attempt failed
2. Check curl returns HTML (not timeout) before declaring success
3. Verify correct port is being used
4. Check for multiple `next dev` processes that might conflict

## Agent Dispatch Pattern

When dispatching @relic for dashboard fixes:

```bash
# Correct working directory and explicit port instruction:
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard && \
hermes -p relic chat -q \"Clear .next cache and start dev server on EXACTLY port 3001, not default port 3000. Verify http://localhost:3001 responds with HTML.\" -Q
```

The `cd` BEFORE `hermes` ensures agent starts in correct directory. The explicit port instruction prevents the default port fallback.
