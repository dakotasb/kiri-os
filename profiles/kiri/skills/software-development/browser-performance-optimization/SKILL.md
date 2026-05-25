---
name: browser-performance-optimization
description: Diagnose and fix browser-specific performance issues where one browser (especially Firefox) is significantly slower than another (Chrome). Targets GPU acceleration, CSS containment, Observer APIs, and backdrop-filter bottlenecks.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [browser, performance, firefox, chrome, css, gpu, debugging, optimization]
    related_skills: [systematic-debugging, react-dashboard-scaffolding, design-system-collaboration]
    platforms: [web, react, nextjs]
---

# Browser Performance Optimization

## When to Use

Use when:
- **Same code, different performance** — Chrome is fast but Firefox (or Safari, Edge) is slow
- **Animations are choppy** in one browser but smooth in another
- **Page takes seconds to become interactive** on Firefox but loads instantly on Chrome
- **Scrolling or typing feels laggy** in specific browsers
- **GPU memory spikes** or high CPU usage in one browser

**Common scenarios:**
- React/Next.js dashboards with glassmorphism effects
- Apps using IntersectionObserver or ResizeObserver
- Complex grid layouts with many cards/modules
- Real-time data updates causing frequent re-renders
- CSS-heavy UIs with transforms, filters, or animations

## Browser Performance Differences

| Feature | Chrome | Firefox | Safari | Impact |
|---------|--------|---------|--------|--------|
| `backdrop-filter` | Excellent | **Poor** | Moderate | Major — disable for Firefox |
| `contain: layout` | Good | **Critical** | Good | Essential for Firefox isolation |
| IntersectionObserver | Fast | Moderate | Fast | Debounce thresholds for Firefox |
| ResizeObserver | Fast | Moderate | Fast | Debounce callbacks for Firefox |
| CSS Grid | Excellent | Good | Good | Usually fine |
| CSS Animations | Excellent | Moderate | Good | Use `transform`, not `top`/`left` |
| will-change | Helpful | Can hurt | Helpful | Use sparingly |

## Diagnostic Process

### Step 1: Automated Server-Side Verification

**Rule out server/network issues first:**

```bash
# Test server response time
curl -s -o /dev/null -w "%{time_total}s" http://localhost:3000/
# If <50ms, issue is client-side browser rendering
```

**Automated detection of Firefox bottlenecks:**

```python
import subprocess

print("=== Automated Firefox Diagnosis ===\n")

# Count Observer API usages (Firefox is slower with these)
result = subprocess.run(
    ['grep', '-r', 'ResizeObserver|IntersectionObserver', 'src/'],
    capture_output=True, text=True
)
lines = [l for l in result.stdout.split('\n') if l.strip()]
print(f"Observer API usages: {len(lines)} (Firefox handles these more slowly)")

# Check for CSS containment (absence = Firefox performance issue)
result = subprocess.run(
    ['grep', '-r', 'contain:', 'src/'],
    capture_output=True, text=True
)
if not result.stdout.strip():
    print("⚠️  No CSS containment rules found — major Firefox performance issue")

# Check for backdrop-filter (known Firefox performance killer)
result = subprocess.run(
    ['grep', '-r', 'backdrop-filter', 'src/'],
    capture_output=True, text=True
)
if result.stdout.strip():
    print("⚠️  backdrop-filter found — disable for Firefox")

# Check for will-change (can hurt Firefox if overused)
result = subprocess.run(
    ['grep', '-r', 'will-change', 'src/'],
    capture_output=True, text=True
)
if result.stdout.strip():
    print("⚠️  will-change found — ensure sparing use in Firefox")
```

### Step 2: Confirm Browser-Specific Issue

**Manual verification in browser DevTools:**
- Open Firefox DevTools → Performance tab → Record 5 seconds during page load
- Look for long yellow blocks (JavaScript execution)
- Look for long purple blocks (Style/Layout/Paint)
- Compare Chrome vs Firefox performance profiles

**Server response time check:**

```bash
# Server fast + Firefox slow = client-side rendering issue
curl -s -o /dev/null -w "%{time_total}s" http://localhost:3000/

### Step 2: Identify Firefox Bottlenecks

**Common Firefox culprits:**

```bash
# Check for problematic CSS properties
grep -r "backdrop-filter" src/
grep -r "will-change" src/
grep -r "IntersectionObserver\|ResizeObserver" src/
grep -r "contain:" src/  # Should find nothing = problem
```

**Red flags in code:**
- No `contain: layout` on card/module containers
- `backdrop-filter: blur()` without Firefox fallback
- Rapid-fire Observer callbacks without debouncing
- `will-change` on many elements (forces layers)

## Optimization Patterns

### Pattern 1: Disable backdrop-filter for Firefox

**Problem:** Firefox's `backdrop-filter` implementation is slow

**Solution:** Feature-detect and fallback:

```tsx
// ChatBar.tsx — conditional backdrop-filter
<div
  className={cn(
    "bg-card/95",
    // Firefox fallback: disable backdrop-filter
    typeof window !== "undefined" && navigator.userAgent.includes("Firefox")
      ? "bg-card/95"
      : "backdrop-blur-md bg-card/95"
  )}
>
```

### Pattern 2: Add CSS Containment

**Problem:** Firefox re-layouts entire page on small component changes

**Solution:** Isolate components:

```tsx
// card.tsx — layout containment
<div
  className="rounded-lg border bg-card"
  style={{ contain: "layout" }}  // ← Firefox performance fix
>
```

```tsx
// DashboardModule.tsx — layout containment
<div
  className="rounded-lg border bg-card overflow-hidden"
  style={{ contain: "layout" }}  // ← Firefox performance fix
>
```

### Pattern 3: Debounce Observer Callbacks

**Problem:** Firefox fires Observer callbacks more frequently, causing jank

**Solution:** Debounce with lodash or native:

```tsx
import { debounce } from "lodash-es";

// Before: Direct callback (slow in Firefox)
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => { /* update immediately */ },
    { threshold: 0.1 }
  );
  observer.observe(el);
}, []);

// After: Debounced callback (smooth in Firefox)
useEffect(() => {
  const debouncedUpdate = debounce((entries) => {
    /* batch updates */
  }, 100);
  
  const observer = new IntersectionObserver(
    debouncedUpdate,
    { threshold: 0.1 }
  );
  observer.observe(el);
  
  return () => {
    debouncedUpdate.cancel();
    observer.disconnect();
  };
}, []);
```

### Pattern 4: Use requestAnimationFrame for Scrolling

**Problem:** Smooth scroll causes jank in Firefox

**Solution:** Use `requestAnimationFrame`:

```tsx
// Before: Smooth scroll (janky in Firefox)
useEffect(() => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
}, [deps]);

// After: requestAnimationFrame (smooth in Firefox)
useEffect(() => {
  const scroll = () => {
    ref.current?.scrollIntoView({ behavior: "auto" });
  };
  requestAnimationFrame(scroll);
}, [deps]);
```

## Application Strategy

### When adding to existing codebase:

1. **Profile first** — Use Firefox DevTools Performance tab to confirm bottlenecks
2. **Target high-impact components** — Cards, modules, frequently updated areas
3. **Test after each change** — Verify Chrome still performs well
4. **Progressive enhancement** — Feature-detect, don't UA-sniff unless necessary

### Priority order for fixes:

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| P0 | Remove/disable `backdrop-filter` | Major | Low |
| P1 | Add `contain: layout` | Significant | Low |
| P2 | Debounce Observer callbacks | Moderate | Medium |
| P3 | Optimize animations | Moderate | Medium |
| P4 | Use `will-change` sparingly | Minor | Low |

## Files to Update

Typical dashboard components needing optimization:
- `src/components/ui/card.tsx` — Add containment
- `src/components/dashboard/DashboardModule.tsx` — Add containment
- `src/components/chat-bar/ChatBar.tsx` — Backdrop-filter fallback, debounce
- Any component using `backdrop-blur-*` — Add Firefox fallback
- Any component with IntersectionObserver — Add debounce

## Testing Checklist

After applying fixes:

- [ ] Firefox loads and feels responsive
- [ ] Animations are 60fps in Firefox
- [ ] Scrolling is smooth in Firefox
- [ ] Chrome still performs excellently
- [ ] Safari (if applicable) still works
- [ ] No console errors or warnings
- [ ] Visual appearance acceptable (fallbacks don't look broken)

## Common Mistakes

| Mistake | Why It Hurts | Fix |
|---------|--------------|-----|
| `*{will-change: transform}` | Forces GPU layers on everything | Only use on animating elements |
| `backdrop-filter` without testing Firefox | Major perf hit in Firefox | Conditional disable for Firefox |
| No containment on grid items | Firefox re-layouts entire grid | Add `contain: layout` to cards |
| Synchronous Observer callbacks | Blocks main thread | Debounce all callbacks |
| UA sniffing only | Misses Edge, Safari | Feature-detect or detect multiple browsers |

## Tools for Verification

**Firefox Performance Tools:**
- DevTools → Performance → Record
- Look for long "Reflow" or "Paint" bars
- Check "Frames" rate (should be 60fps)

**Chrome Performance Tools:**
- DevTools → Performance → Record
- Compare frame rates with Firefox
- Chrome should remain fast after fixes

## Integration with Hermes

When to dispatch this skill:

```python
# User reports: "Firefox is slow but Chrome is fast"
delegate_task(
    goal="diagnose browser-specific performance issue",
    context="Firefox is significantly slower than Chrome on same page. Likely causes: backdrop-filter, Observer APIs, missing containment.",
    skill="browser-performance-optimization",
    toolsets=['terminal', 'file']
)
```

## Example Fix Summary

From previous session (Firefox dashboard slowness):

| Component | Issue | Fix |
|-----------|-------|-----|
| `ui/card.tsx` | No containment | Added `style={{ contain: "layout" }}` |
| `DashboardModule.tsx` | No containment | Added `style={{ contain: "layout" }}` |
| `ChatBar.tsx` | backdrop-filter slow | Conditional disable for Firefox |
| `ChatBar.tsx` | Rapid textarea resize | Debounced with lodash |
| `ChatBar.tsx` | Smooth scroll jank | Use `requestAnimationFrame` |

**Result:** Firefox went from choppy/unusable to smooth 60fps.

## Session Learning: 2026-05-17 (Firefox Hanging on localhost - curl Works)

**Problem:** curl returns HTML immediately but Firefox hangs indefinitely on `Waiting for localhost...`

**This is NOT a CSS performance issue** — this is a WSL2 + Node.js server networking issue.

**Root Causes Found:**

1. **Zombie Next.js process** bound to WSL virtual IP (`172.26.210.95:3001`)
   - WSL virtual IPs do NOT forward to Windows localhost
   - Server appears running but is unreachable from Firefox

2. **Wrong server binding** - Server started from snapshot directory, not target directory
   - Process: `~/snapshots/dashboard-pre-color-update/` instead of `~/command_center/`
   - Server looks correct but runs from wrong location

**Diagnostic Pattern:**

```bash
# Check where server is actually running FROM
ps aux | grep next-server
# Should show: ~/command_center/...
# NOT: ~/snapshots/...

# Check WHAT port is bound
ss -tlnp | grep 3001
# Should show: *:3001 or 127.0.0.1:3001
# NOT: 172.26.210.95:3001

# curl test
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
# Returns 200 = server responding

# But Firefox hangs = network path issue
```

**Fix Pattern:**

```bash
# Step 1: Kill ALL Next.js processes
pkill -9 -f "next-server"
pkill -9 -f "next dev"

# Step 2: Clear caches
rm -rf .next

# Step 3: Start from CORRECT directory
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard
npx next dev -p 3001

# Step 4: Verify binding
ss -tlnp | grep 3001  # Should show *:3001

# Step 5: Test
curl http://localhost:3001 | head -1  # Works
# Then Firefox: http://localhost:3001  # Should now work
```

**Key Lesson:**
When Firefox hangs but curl works, the issue is SERVER BINDING (what IP/port it's on), not browser rendering. The server may be running but bound to a non-forwarded interface.
