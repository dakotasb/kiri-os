# Next.js Route Override Debugging

Common routing issue where the wrong page loads at root URL.

## Symptoms
- `/` shows completely different component than expected
- User: "this is nothing like what it was before"
- Route groups `(foldername)` not working as expected
- 404 errors on seemingly valid routes

## Root Causes

### 1. Route Override by page.tsx at Root

```
src/app/
├── page.tsx          ← This OVERRIDES (dashboard)/page.tsx at /
└── (dashboard)/
    └── page.tsx      ← Should serve / but gets shadowed
```

**Next.js routing priority:** `src/app/page.tsx` > `src/app/(group)/page.tsx`

**Fix:** Remove or rename conflicting root page.tsx

### 2. Parallel Route Groups Confusion

Route groups `(foldername)` create URLs WITHOUT the group name:
- `(dashboard)/page.tsx` → serves `/` NOT `/dashboard`
- `dashboard/page.tsx` → serves `/dashboard`

**Common error:** User navigates to `/dashboard` expecting group route

#### Diagnosis Commands

```bash
# Check what's at root route:
curl -s http://localhost:3000 | grep -o "<title>.*</title>"

# Check actual routing structure:
find src/app -name "page.tsx" | sort

# Check for conflicting routes:
ls -la src/app/page.tsx
ls -la "src/app/(dashboard)/page.tsx"
```

### 3. Browser Cache vs Server State

Server may have correct code but browser cached old JS.

**Check:**
```bash
# Server returns correct HTML:
curl http://localhost:3000 | head -50

# Browser still shows old UI = cache issue
# Fix: Ctrl+F5 or Cmd+Shift+R hard refresh
```

## Prevention

Add to project onboarding:
- Document which routes are served by which files
- Clarify route group behavior `(group)` vs `group`
- Include routing diagram in README

## Related Issues

- Different dev/prod routing behavior
- SSG vs SSR route differences
- Middleware intercepting routes unexpectedly