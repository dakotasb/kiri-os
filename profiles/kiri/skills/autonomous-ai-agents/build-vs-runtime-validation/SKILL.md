---
name: build-vs-runtime-validation
description: Distinguish between TypeScript compilation (build phase) and runtime functionality (execution phase) when validating agent work. Prevents the false confidence of "build passed" when runtime errors persist. Defines comprehensive validation layers for Next.js/React applications.
version: 1.0.0
triggers:
  - "build passes but app doesn't work"
  - verification of web application functionality
  - "TypeScript compiled but runtime fails"
  - Next.js dashboard validation
  - SSG (static generation) errors
  - "stuck on loading spinner"
tags: [validation, build, runtime, nextjs, ssg, testing, quality-gates]
---

# Build vs Runtime Validation

## Purpose

Distinguish between **successful compilation** and **successful execution**. TypeScript compilation passing does NOT mean the application works. This skill defines the multi-layer validation required for production-ready deployment.

## The Trap

| Phase | Status | Reality |
|-------|--------|---------|
| `npm run build` | ✅ PASSED | "Build production-ready!" |
| `npm start` + browser visit | ❌ BROKEN | Stuck on loading spinner |
| User test | ❌ FAILED | "Still infinite loop" |

**Lesson:** Build success ≠ Runtime success

---

## Validation Layers (in order)

### Layer 1: TypeScript Compilation

**Command:** `tsc --noEmit` or `npm run build` compile phase

**Validates:**
- Syntax correctness
- Type consistency
- Import resolution

**Does NOT validate:**
- API endpoints respond
- Data fetching works
- Browser rendering
- Error handling paths

### Layer 2: Static Generation (SSG)

**Command:** `next build` (static HTML generation phase)

**Validates:**
- All routes can generate static HTML
- `getStaticProps` / `generateStaticParams` succeed
- No runtime errors during prerender

**Common Failures:**
- Missing data for SSG (undefined.property errors)
- API calls during build (not allowed)
- Window/document access during SSR

### Layer 3: API Endpoint Verification

**Commands:**
```bash
# Health check
curl -H "Authorization: Bearer $AUTH_API_KEY" http://localhost:3001/api/health

# Critical endpoints
curl -H "Authorization: Bearer $AUTH_API_KEY" http://localhost:3001/api/agents/fleet
curl -H "Authorization: Bearer $AUTH_API_KEY" http://localhost:3001/api/system/metrics
```

**Validates:**
- Server responds
- Auth middleware works
- JSON data returned
- Expected fields present

### Layer 4: Browser Rendering Test

**Checklist:**
- [ ] Main dashboard loads (not stuck on loading spinner)
- [ ] Navigation works between routes
- [ ] Interactive elements respond (buttons, forms)
- [ ] Data displays (not empty states)
- [ ] No console errors (red error messages)

**Tools:**
```bash
# Fetch HTML and grep for error indicators
curl -s http://localhost:3001 | grep -o "error\|Error\|failed\|Failed"

# Or use headless browser agent (@ember browser tools)
```

### Layer 5: Functional User Flow

**Verify actual user paths:**
- [ ] AgentCard Start button triggers action
- [ ] AskKiri validates empty input
- [ ] Form submissions work
- [ ] Error states display correctly

---

## Session Example: The Infinite Loop

### What Happened

**@ember reported:** "Build production-ready! All 16 routes generate successfully"

**Reality:** Dashboard stuck in infinite load-fail-restart loop

**Root Cause Analysis:**

| Layer | Status | Finding |
|-------|--------|---------|
| TypeScript | ✅ | Compiled |
| SSG | ✅ | 16 routes generated |
| **API Auth** | ❌ **MISSED** | Frontend missing `Authorization` header |
| **Browser** | ❌ **BROKEN** | Stuck on spinner |
| **User Flow** | ❌ **BROKEN** | Can't interact |

**Real Issue:** `metrics-store.ts` had Auth header but **browser had cached old code** without it.

### The Fix

**Not code change (code was correct)** but **cache invalidation:**
```bash
# Kill old server (with stale JS in browser cache)
pkill -f "next dev"

# Restart server (forces browser to refetch)
export AUTH_API_KEY=dev-key-123
npm run dev -- -p 3001

# User: Hard refresh browser (Ctrl+F5)
```

---

## Agent-Specific Validation

### @ember (Testing/Validation Specialist)

**Correct Role:** Report "works/broken" for each layer
**Incorrect Role:** Try to fix code (that's @forge/@forgemaster)

**@ember Validation Checklist:**
```
✅ Build layer: tsc --noEmit passes
✅ SSG layer: next build generates all routes
⚠️  API layer: /api/agents/fleet returns 401 (missing auth header!)
❌ Browser layer: stuck on loading spinner
→ RECOMMENDATION: Dispatch @forgemaster to fix auth in metrics-store.ts
```

### @forge / @forgemaster (Implementation Agents)

**When dispatched:** Fix code, report file changed + line numbers
**Not dispatched for:** Pure validation (no file changes)

---

## Quick Diagnostic Commands

```bash
# Layer 1: TypeScript
cd dashboard && npx tsc --noEmit

# Layer 2: SSG
cd dashboard && npm run build

# Layer 3: API (with auth)
curl -H "Authorization: Bearer dev-key-123" http://localhost:3001/api/system/metrics

# Layer 4: HTML (grep for errors)
curl -s http://localhost:3001 | grep -i "error"

# Layer 5: Process check
ps aux | grep -E "(next|node)" | grep -v grep
```

---

## Anti-Patterns

### ❌ "Build passed = Done"
**Reality:** Runtime can still fail completely

### ❌ Dispatching @ember to fix code
**Wrong agent for job:** @ember validates, @forge fixes

### ❌ Forgetting browser cache
**Classic:** Code fixed, but browser runs old cached JS

### ❌ Reporting only "success" without verification details
**Bad:** "Build passed"
**Good:** "Build passed (16 routes, tsc 0 errors), but API returns 401"

---

## Reference: Session-Specific Troubles

**Date:** 2026-05-16
**Dashboard:** Phase 5 validation
**Key Lesson:**
1. Build passed ✅
2. Runtime failed ❌ (infinite loop)
3. Root cause: Browser cache had old code
4. Solution: Hard browser refresh + verify each layer

---

v1.0.0 - Validation pattern from dashboard debugging