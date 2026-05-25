# Phase 5 Runtime Debugging Session Notes
## Session: 2026-05-17
## Context: Agent OS Dashboard Final Validation

### Session Summary

**User:** "Dispatch agents to validate the server is up and running and everything in the app is functional"

**Initial Understanding:** Server health check (localhost:3001)

**Reality:** Deep UI/UX validation required with specific auth patterns

---

### Critical Lesson: Build ≠ Runtime

**Type of Check** | **Phase** | **What "Done" Looks Like**
---|---|---
TypeScript compile | Phase 1-4 | 0 errors
Static HTML generation | Phase 1-4 | .next/server/ populated
Dev server starts | Phase 5 | curl returns 200 OK
**UI renders data** | **Phase 5** | **Browser shows actual content, not spinner**
**Buttons functional** | **Phase 5** | **Click triggers correct API**
**Auth works end-to-end** | **Phase 5** | **401 never in browser console**

---

### Port Confusion

**User Correction:** "it was originally running on 3001 does that matter?"

**Lesson:** Always verify exact port before testing. Server running on 3000 ≠ 3001.

**Implementation:**
```bash
# ❌ Wrong assumption
curl http://localhost:3000

# ✅ Right verification
curl http://localhost:3001  # User-specified port
```

---

### The Infinite Loop Bug

**Symptom Reported:** "stuck on loading system metrics. will show failure and self restart and spin and repeat"

**Root Cause Chain:**

1. **Frontend code** (`src/stores/metrics-store.ts` line 139):
   ```typescript
   const data = await fetchWithRetry("/api/system/metrics", "system-metrics");
   ```

2. **fetchWithRetry function** (lines 34-38):
   ```typescript
   const response = await fetch(url, {
     headers: {
       'Content-Type': 'application/json',  // ← Missing Authorization!
     },
   });
   ```

3. **API route** (`/api/system/metrics/route.ts`):
   - Required header: `Authorization: Bearer {token}`
   - Received: No auth header
   - Response: 401 Unauthorized

4. **Retry logic** (lines 80-85):
   ```typescript
   if (attempt < MAX_RETRIES) {
     const delay = getRetryDelay(attempt);
     await new Promise((resolve) => setTimeout(resolve, delay));
     // Loop repeats with same missing header → infinite 401s
   }
   ```

**Fix:** Add Authorization header to fetchWithRetry

**User Correction:** "validation from agents should have included look and feel and button functionalities"
- First validation only checked "server runs"
- Second validation checked UI but missed the auth header issue
- Third validation finally caught the root cause

---

### User Urgency Signal

**User:** "feels like the final stretch is dragged out last time you would report quickly I guess this final phase is trickier?"

**Interpretation:** Phases 1-4 = parallel implementation (fast, independent)
Phase 5 = integration testing (slower, debugging runtime behavior)

**Orchestrator Response:** Accelerated dispatch, skip diagnostic preambles, go straight to fix

---

### Required Validation Depth for Phase 5

**When dispatching agent for "validate app functionality":**

MUST include:
```
1. Start server with AUTH_API_KEY set
2. Browser/curl test with exact port
3. Verify HTML contains content, not just spinner
4. Check browser console for errors (401, 404)
5. Test button clickability (not just presence)
6. Verify auth headers in network panel
7. Confirm no infinite retry loops
```

NOT sufficient:
```
- Server process running ✅
- curl returns HTML ✅
- APIs work with manual curl ✅
```

---

### Auth Header Pattern

**Next.js 16 + API Routes + Zustand Store:**

```typescript
// stores/metrics-store.ts
async function fetchWithRetry<T>(url: string, cacheKey?: string): Promise<T | null> {
  // MUST include auth header for protected routes
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth if API requires it
  if (url.startsWith('/api/system') || url.startsWith('/api/agents')) {
    headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_API_KEY || 'dev-key-123'}`;
  }
  
  const response = await fetch(url, { headers });
  // ...
}
```

**Critical:** Dev server often uses `AUTH_API_KEY` env var. Frontend must pass matching header.

---

### Port Usage Reference

| Port | Use Case |
|------|----------|
| 3000 | Next.js default |
| 3001 | User-specified (this project) |
| 8080 | Generic fallback |

**Always check with user** before assuming default port.

---

### Retry Loop Prevention

**Before implementing retry logic:**

```typescript
// Check if error is retryable
if (response.status === 401) {
  // DO NOT retry - auth failure won't fix itself
  throw new Error('Authentication failed - check API key');
}

if (response.status >= 500) {
  // Retryable: server error might recover
  await retryWithBackoff();
}
```

**Infinite loop red flags:**
- Spinner that never resolves
- Browser console showing repeated identical errors
- Network tab showing endless fetch requests
- CPU/memory usage climbing

---

### Related Skills

- `autonomous-ai-agents/agent-project-management` - Phase structure
- `autonomous-ai-agents/delegation-troubleshooting` - Agent debug patterns
- `software-development/debugging-hermes-tui-commands` - Debug workflows

---

### Files Referenced

- `src/stores/metrics-store.ts` - fetchWithRetry missing auth header
- `src/app/api/system/metrics/route.ts` - API requiring auth
- `.env.local` - AUTH_API_KEY configuration

---

**Key Takeaway:** "Build passes" and "server runs" are necessary but not sufficient for Phase 5. The UI must actually work for users.
