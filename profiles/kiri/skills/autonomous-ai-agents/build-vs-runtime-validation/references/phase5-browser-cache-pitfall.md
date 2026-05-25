# Phase 5 Session: Browser Cache Invalidation Pitfall

**Date:** 2026-05-16
**Context:** Dashboard infinite loop debugging
**Duration:** ~45 minutes of confusion

---

## The Mystery

### What Was Reported
```
User: "still spinning and will show failure and self restart and spin and repeat"
Status: "infinite load-fail-restart loop"
```

### What @ember Found
```
✅ Build passes (TypeScript 0 errors)
✅ SSG completes (16 routes generate)
✅ API responds (curl returns data with auth header)
✅ Code has auth header (line 36: 'Authorization': 'Bearer dev-key-123')
❌ Browser still shows infinite loop
```

**Root Cause:** Browser had cached OLD JavaScript without auth header!

### The "Fix"

**NOT a code change** - code was already correct:
```
src/stores/metrics-store.ts line 36:
  'Authorization': 'Bearer dev-key-123',  // ✅ Correct!
```

**ACTUAL fix:** Hard browser refresh
```
User: Ctrl+F5 or Cmd+Shift+R
Result: Browser fetches fresh JavaScript with auth header
        → Loop stops, dashboard renders
```

---

## Why This Happens

### Next.js Dev Server Caching

```
Build process:
1. TypeScript compiles → .next/ cache created
2. Dev server serves from .next/
3. Browser caches aggressively (for performance)
4. Code fix → Server restarts → Browser still has OLD cached JS
```

### The Auth Header Specifically

```
File state:       ✅ Has auth header
Server state:     ✅ Serves auth header
Browser cache:    ❌ OLD code (cached before fix)
User sees:        ❌ Infinite loop (old code without auth)
```

---

## Validation Commands

### Check Server Has Correct Code
```bash
# API returns data (proves server is correct)
curl -H "Authorization: Bearer dev-key-123" http://localhost:3001/api/system/metrics
# → Returns: {"timestamp": "...", "cpu": {...}}  ✅ Server correct
```

### Check Browser State
```bash
# HTML contains current build hash
curl -s http://localhost:3001 | grep -o "__NEXT_DATA__" | head -1
# → Shows static markup from current build
```

**The disconnect:**
- Server HTML is current ✓
- Browser JS bundle is OLD (cached) ✗
- User interacts with OLD JS that fails

---

## Prevention Pattern

### For Users

**After any Next.js code fix:**

1. Wait for server restart (watch terminal)
2. Hard refresh browser: **Ctrl+F5** (Windows/Linux) or **Cmd+Shift+R** (Mac)
3. Verify in DevTools → Network → check JS files have current timestamps
4. If still failing → Clear browser cache entirely (DevTools → Application → Clear site data)

### For Orchestrators

**When reporting "fix complete":**

```
WRONG:
"Fix complete, dashboard working"

CORRECT:
"Fix committed: [change]
 Server restarted: ✅
 Build verified: ✅
 IMPORTANT: Hard refresh browser (Ctrl+F5) to clear cached JS
 Test URL: http://localhost:3001"
```

---

## Session Timeline

| Time | Event | Cache State |
|------|-------|-------------|
| T+0 | User reports infinite loop | Browser: OLD code |
| T+5 | @ember dispatched | Browser: OLD code |
| T+15 | Code verified correct | Browser: OLD code |
| T+20 | Server restarted | Browser: OLD code |
| T+25 | API verified working | Browser: OLD code |
| T+30 | **Confusion** "Why still broken?" | Browser: **STILL OLD** |
| T+45 | **Realization:** Browser cache! | Browser: OLD code |
| T+50 | Hard refresh instruction given | Browser: **CLEARED** ✓ |
| T+55 | Dashboard works! | Browser: FRESH code ✓ |

**The 45-minute gap was entirely browser cache confusion.**

---

## Related Patterns

**This is Layer 5 (Browser Render) in build-vs-runtime-validation:**

```
Layer 1: TypeScript ✅  (npx tsc --noEmit)
Layer 2: Build ✅        (npm run build)
Layer 3: Server Start ✅ (curl returns HTML)
Layer 4: API Test ✅    (curl returns JSON)
Layer 5: Browser Render ⚠️  **Hard refresh required!**
Layer 6: Interaction ✅   (User clicking works)
```

**Most overlooked:** Layer 5
**Second most:** Layer 6

---

## Prevention Checklist

For Next.js/React dashboard fixes:

- [ ] Code fixed and committed
- [ ] Server restarted (verify port listening)
- [ ] Build passes (verify 0 errors)
- [ ] **Browser cache cleared / hard refresh** ← CRITICAL
- [ ] User can interact (click buttons, no console errors)
- [ ] User confirms "works now"

---

**Related:**
- Skill: build-vs-runtime-validation (Layer 5)
- Skill: real-time-orchestration-communication (Proactive cache warning)