# Build vs Runtime Validation Pitfalls

## Overview

A TypeScript/Next.js build passing (`npm run build`) does NOT guarantee the application is functional. This reference documents the critical distinction between **build-time validation** (compilation) and **runtime validation** (actual execution).

---

## The Build ≠ Runtime Gap

### What "Build Passes" Actually Means

When `npm run build` succeeds:
- ✅ TypeScript compilation succeeded (no type errors)
- ✅ Module imports resolved
- ✅ Static assets generated
- ✅ Code syntax is valid

**What it DOES NOT mean:**
- ❌ API endpoints return data
- ❌ Authentication is configured
- ❌ Database connections work
- ❌ Frontend renders without errors
- ❌ User interactions function correctly

---

## Common Runtime Failures After Successful Build

### 1. Environment Variables Missing

**Symptom:** Build succeeds, but app stuck on "Loading..." spinner
**Root cause:** Runtime APIs return 401/403 because AUTH_API_KEY not set

**Example from Session:**
```
# Build passed with 0 errors
npm run build
> Build completed successfully

# But running server:
Server running on http://localhost:3001
- /api/agents → 401 Unauthorized (missing AUTH_API_KEY)
- Dashboard → stuck on "Loading system metrics..."
```

**Fix:**
```bash
export AUTH_API_KEY=dev-key-123
npm run dev
```

### 2. API Route Structure Mismatch

**Symptom:** Frontend calls `/api/agents`, gets 404
**Root cause:** Actual route is nested: `/api/agents/fleet`

**Discovery:**
```bash
# Check actual API structure
curl http://localhost:3001/api/agents
# → 404 Not Found

curl http://localhost:3001/api/agents/fleet  
# → 200 OK {"agents": [...]}
```

**Lesson:** Frontend expectations and actual backend routes may diverge.

### 3. Authentication Fail-Closed

**Symptom:** All API calls return 401, empty UI grids
**Root cause:** Auth middleware requires tokens that aren't provided

**Example middleware pattern:**
```typescript
// src/lib/middleware/auth.ts
export function verifyAuth(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });  // Fail-closed
  }
  // ...token validation
}
```

**Fix:** Include auth header in requests:
```bash
curl -H "Authorization: Bearer dev-key-123" http://localhost:3001/api/agents/fleet
```

---

## Validation Checklist

When an agent reports "build successful":

1. **Start the server** (dev mode for testing)
   ```bash
   export AUTH_API_KEY=dev-key-123  # Set required env vars first
   npm run dev -- -p 3001
   ```

2. **Test API endpoints directly**
   ```bash
   curl -H "Authorization: Bearer dev-key-123" http://localhost:3001/api/agents/fleet
   curl http://localhost:3001/api/health  # If health endpoint exists
   ```

3. **Verify frontend renders** (browser or curl)
   ```bash
   curl -s http://localhost:3001 | grep -o "Loading\|Agent\|Dashboard" | head -5
   ```

4. **Check for runtime errors**
   - Watch server console for stack traces
   - Check browser console for JS errors
   - Verify data loads (not infinite spinners)

---

## Agent Dispatch Pattern for Validation

When dispatching agents to validate a web app:

```bash
# WRONG - Only validates build
hermes -p ember chat -q "Run npm run build and verify it passes"

# CORRECT - Validates runtime
hermes -p ember chat -q "Start dev server with AUTH_API_KEY=dev-key-123, 
  wait 10s, test http://localhost:3001/api/agents/fleet returns data,
  verify dashboard renders actual UI (not stuck on loading spinner), 
  report what's working vs broken"
```

---

## User Signals That Build ≠ Runtime

- "Stuck on loading spinner" - Runtime API not responding
- "Build passed but app doesn't work" - Build/runtime gap
- "Page renders but no data" - APIs failing silently
- "Works locally but not deployed" - Env vars missing

---

## Command Reference

### Test API endpoint
```bash
curl -s -H "Authorization: Bearer <token>" http://localhost:<port>/api/<endpoint>
```

### Check server is listening
```bash
ss -tlnp | grep :<port>
# or
lsof -i :<port>
```

### Extract HTML to verify rendering
```bash
curl -s http://localhost:3001 | grep -o "Loading system metrics\|Agent Dashboard\|Ask Kiri" | head -5
```

### View server logs for errors
```bash
# In another terminal while server is running
tail -f /path/to/logfile
# or
cd <dashboard-dir> && npm run dev 2>&1 | tee dev.log
```

---

## Related References

- `references/agent-profile-credentials-architecture.md` - API key configuration
- `references/git-credential-troubleshooting.md` - Auth patterns
- `references/session-2026-05-15-config-structure-fix.md` - Config verification
- `SKILL.md` "Spawning Additional Hermes Instances" section - Agent dispatch patterns
