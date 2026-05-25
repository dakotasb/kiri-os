---
name: react-dashboard-validation
description: >
  Validate React/Next.js dashboard implementations post-creation. Performs systematic verification including
  file existence checks, TypeScript compilation, design system compliance audits (color/pattern validation),
  build success verification, and navigation integration checks. Use after dashboard scaffolding or component
  creation to ensure code quality and design system adherence before delivery.
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [dashboard, validation, qa, nextjs, react, typescript, build-verification, design-system]
triggers:
  - Validate dashboard page implementation
  - Check TypeScript compilation for errors
  - Audit design system compliance (colors, patterns)
  - Verify build succeeds after changes
  - Check navigation sidebar integration
  - Validate dashboard module structure
  - QA check on new dashboard page
  - Verify no purple/pink colors in dashboard
  - Confirm all 8 modules render correctly
  - Post-creation dashboard validation
---

# React Dashboard Validation

Systematic validation and quality assurance for React/Next.js dashboard implementations after they've been created.

## When To Use

Use this skill when:
- Dashboard scaffolding or component creation is complete and needs verification
- Need to validate TypeScript compilation before delivery
- Must verify design system compliance (colors, patterns, structure)
- Want to confirm build succeeds with new code
- Need to check sidebar navigation integration
- Performing QA on dashboard deliverables
- Validating multi-module dashboard page implementation

## What This Skill Does

Performs comprehensive post-creation validation:
1. **File existence verification** — confirms all expected files exist and are readable
2. **TypeScript compilation check** — runs `tsc --noEmit` to catch type errors
3. **Design system compliance audit** — scans for non-compliant colors (purple/pink) and validates patterns
4. **Build verification** — runs production build and confirms success
5. **Server functionality check** — starts dev server and tests actual running app endpoints
6. **Module structure validation** — verifies all expected modules/components are present
7. **Navigation integration check** — ensures sidebar/app navigation includes new routes

### Port Misconfiguration
**Cause:** Assumed `server.port` in next.config.js would work
**Symptoms:** Server always starts on port 3000 despite config
**Learned:** Next.js 14.2 does NOT recognize `server.port` in config - must use `PORT` env var
**Fix:** 
```bash
# Environment variable (required for Next.js 14.20)
PORT=3001 npm run dev

# NOT this (ignored):
# next.config.js:
# server: { port: 3001 }
```
**Check:** Always verify actual port after startup:
```bash
# Server shows: "Local: http://localhost:3000" (lies!)
# But `PORT=3001` actually binds to 3001
lsof -i:3001  # Verify actual port
```

## Validation Workflow

### Step 0: Port

Check that all expected files exist:
```bash
# Core page
test -f src/app/(dashboard)/{page-name}/page.tsx

# Types
test -f src/types/{name}.ts

# Data
test -f src/data/{name}.ts

# Reusable components
test -f src/components/ui/dashboard-module.tsx
test -f src/components/ui/metrics-card.tsx
test -f src/components/ui/progress-bar.tsx
test -f src/components/ui/operation-item.tsx

# Read files via read_file tool to verify content
```

### Step 2: TypeScript Compilation Check

Run compiler to catch type errors:
```bash
cd {project-path} && npx tsc --noEmit
```

Expected: No output = success (exit code 0)

### Step 3: Design System Compliance Audit

Check for non-compliant colors and patterns:

```python
import re

# Read the main page file
with open(page_path, 'r') as f:
    content = f.read()

# Check for non-compliant colors (NO purple/pink/fuchsia/magenta)
violations = re.findall(r'purple|pink|fuchsia|magenta', content, re.IGNORECASE)

# Check for compliant colors
compliant = ['slate', 'emerald', 'amber', 'blue', 'gray', 'rose', 'cyan']
found_compliant = [c for c in compliant if c in content.lower()]

# Verify card patterns
card_pattern_found = 'rounded-lg border bg-card' in content
shadow_pattern_found = 'shadow-sm' in content

# Verify imports are valid
imports = re.findall(r'from "@/components/ui/([^"]+)"', content)
```

**Design System Compliance Checklist:**
- [ ] No purple/pink/fuchsia/magenta colors
- [ ] Cards use `rounded-lg border bg-card text-card-foreground shadow-sm`
- [ ] Icons from lucide-react only
- [ ] Typography follows `text-sm font-semibold` patterns
- [ ] Uses existing shadcn/ui components (Card, Badge, Button)
- [ ] All imports resolve correctly

### Step 4: Build Verification

Run production build:
```bash
cd {project-path} && npm run build 2>&1
```

Verify:
- No compilation errors
- All expected pages generated
- Static pages prerendered successfully

Build output analysis:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    2.22 kB         101 kB
├ ○ /dashboard-new                       7.52 kB         102 kB  <-- New page appears
```

### Step 5: Server Functionality Check

**⚠️ CRITICAL: Build passing ≠ App working**

After successful build, always verify the running server:

```bash
# Start dev server on expected port
cd {project-path} && npm run dev -- -p {port} &

# Wait 10 seconds for startup
sleep 10

# Test server health
curl -s http://localhost:{port} | head -5

# Test key API endpoints
curl -s http://localhost:{port}/api/health
curl -s http://localhost:{port}/api/agents
curl -s http://localhost:{port}/api/system/metrics

# Verify specific functionality
curl -s http://localhost:{port}/api/plugins  # If plugin system tested
curl -s http://localhost:{port}/api/agents/control  # If agent controls tested
```

**Dispatch agent for comprehensive test:**
```bash
hermes -p ember chat -q "Start dev server on port {port}, wait 10s, then verify: 
1) curl http://localhost:{port} returns 200, 
2) Test /api/health, /api/agents, /api/system/metrics endpoints,
3) Verify AgentCard loads with Start button,
4) Check plugin system loads without errors.
Report: what's working, what's broken, server URL for user validation."
```

**Server Validation Checklist:**
- [ ] Dev server starts without crashes
- [ ] Main page loads (HTTP 200)
- [ ] API endpoints respond
- [ ] No console errors in server logs
- [ ] User-facing features (buttons, forms) render
- [ ] Interactions trigger expected actions

### Step 6: Module Structure Validation

Count modules found in code:
```python
import re

# Count dashboard modules in page.tsx
modules = re.findall(r"Module \d+: ([^\n]+)", content)
print(f"Found {len(modules)} modules: {modules}")

# Verify helper components defined
helper_components = re.findall(r"function ([A-Z][a-zA-Z]+)\(", content)
print(f"Helper components: {helper_components}")

# Check default export exists
has_default_export = 'export default function' in content

# Check 'use client' directive for client components
has_use_client = '"use client"' in content
```

### Step 7: Navigation Integration Check

Verify sidebar navigation includes new routes:
```typescript
// Check src/components/sidebar.tsx contains:
const navItems = [
  { href: "/dashboard-new", label: "Command Center", icon: Cpu },
  // ... other items
];
```

## Validation Report Template

```
# Dashboard Validation Report

## Status: ✅ VALIDATION_PASSED or ❌ VALIDATION_FAILED

### 1. File Verification ({N}/{N} files)
- ✅ src/app/(dashboard)/{page}/page.tsx (Size: {X} characters)
- ✅ src/types/{name}.ts
- ✅ src/data/{name}.ts
- ✅ src/components/ui/dashboard-module.tsx
- ✅ src/components/ui/metrics-card.tsx
- ✅ src/components/ui/progress-bar.tsx
- ✅ src/components/ui/operation-item.tsx

### 2. TypeScript Compilation
- ✅ No type errors (exit code 0)

### 3. Design System Compliance
- ✅ Color violations (purple/pink/fuchsia/magenta): 0
- ✅ Compliant colors found: slate, emerald, amber, blue, gray
- ✅ Card pattern (rounded-lg border bg-card): Present
- ✅ Shadow-sm pattern: Present
- ✅ lucide-react imports only

### 4. Build Verification
- ✅ Production build successful
- ✅ Pages generated: {N} total, {page-name} at {size}
- ✅ Static prerendering: OK

### 5. Server Functionality
- ✅ Dev server starts on port {port}
- ✅ Main page returns HTTP 200
- ✅ API endpoints respond: /api/health, /api/agents
- ✅ AgentCard renders with Start button
- ✅ Plugin system loads without errors
- ✅ No server console errors

### 6. Module Structure
- ✅ {N} dashboard modules found
- ✅ {N} helper components defined
- ✅ Default export present
- ✅ 'use client' directive present

### 6. Navigation Integration
- ✅ Sidebar includes new route: /{page}

## Deliverables Checklist
- [ ] All files created and readable
- [ ] TypeScript compiles without errors
- [ ] Design system compliance verified
- [ ] Build succeeds with new code
- [ ] Navigation updated if needed
```

## Support Resources

- `references/recovery-commands.md` — One-liner commands for port clearing, git recovery, and file restoration
- `scripts/dashboard-recovery.sh` — Automated recovery script template (modify paths as needed)

## Dashboard Recovery and Server Management

### Port 3001 Already in Use
**Cause:** Previous server process still running or improperly terminated
**Symptoms:** 
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Fix:** Clear port before restart:
```bash
# Check what's using the port
lsof -i:3001

# Force kill all processes on port
pkill -9 -f "next.*3001" 2>/dev/null
lsof -i:3001 -t | xargs kill -9 2>/dev/null

# Wait for release
sleep 3
lsof -i:3001  # Should show nothing
```
**Then restart:** `PORT=3001 npm run dev`

### Next.js Port Configuration (Important)
**CAUSE:** Next.js 14.2 does NOT recognize `server.port` in next.config.js
**INVALID:**
```javascript
// This does NOT work in Next.js 14.2
const nextConfig = {
  server: {
    port: 3001,  // Ignored!
  }
}
```

**CORRECT:** Use environment variable:
```bash
PORT=3001 npm run dev
# or
export PORT=3001 && npm run dev
```

**Port precedence:**
1. `PORT` env var (highest priority)
2. `--port` CLI flag
3. `3000` default (if neither set)

### Dashboard Corrupted / Missing Files
**Cause:** Git reset to wrong commit, deleted critical files, or cache corruption
**Symptoms:** 
- package.json missing
- Page files return 404
- Build fails with "Module not found"
- TypeScript compilation errors for missing files

**Recovery Steps:**

1. **Identify working commit:**
```bash
cd ~/dashboard
git log --all --oneline | head -20
# Look for commits like "feat: MVP dashboard" or "[BASELINE]"
```

2. **Check if file exists in history:**
```bash
git show COMMIT_HASH:package.json 2>/dev/null | head -5
```

3. **Find backup:**
```bash
ls ~/ | grep -E "staging|backup|dashboard"
ls ~/staging-dashboard-backup-*/package.json
```

4. **Restore missing files:**
```bash
# From git history
git show COMMIT_HASH:package.json > package.json

# From backup
cp ~/staging-dashboard-backup-*/package.json .
cp ~/staging-dashboard-backup-*/next.config.js .
```

5. **Clear cache and reinstall:**
```bash
rm -rf .next dev dist node_modules/.cache
npm install  # Reinstall dependencies
```

6. **Start server with correct port:**
```bash
PORT=3001 npm run dev
```

### Server Config Warnings
**Warning:** `Unrecognized key(s) in object: 'server', 'turbopack'`
**Cause:** next.config.js contains invalid keys for Next.js 14.2
**Fix:** Server uses env var instead (see Port Configuration above). Turbopack is default in Next 15+; for 14.2 just ignore the warning or remove the key.

## Common Validation Failures

### Build Passes But App Broken
**Cause:** TypeScript compilation succeeds but runtime errors occur (missing data, undefined access)
**Fix:** Always run server functionality check after build verification. Static generation passes ≠ running app works.
**Evidence:** MarketIntelligence page crash during SSR with "Cannot read trafficSources of undefined" despite tsc 0 errors.

### Wrong Port Assumption
**Cause:** User's server runs on non-standard port (e.g., 3001 not 3000)
**Fix:** Ask user for port or check package.json scripts. Dispatch server validation with correct port.
**Pattern:** `npm run dev` often uses 3000; user's custom config may use different port.

### Build Error: Missing build-manifest.json
**Cause:** Corrupted or partial `.next` directory
**Fix:** Clear build cache, rebuild:
```bash
rm -rf .next && npm run build
```

### Type Error: Module not found
**Cause:** Import path typo or missing file
**Fix:** Verify file exists and path matches

### Design Violation: Purple/Pink colors
**Cause:** Copied from reference images with different palette
**Fix:** Replace with compliant colors (slate/emerald/amber/blue/gray)

### Navigation Missing
**Cause:** Sidebar not updated with new route
**Fix:** Add entry to navItems array in sidebar.tsx

## Related Skills

- `react-dashboard-scaffolding` — Create dashboard pages (use BEFORE this skill)
- `dogfood` — Interactive browser QA testing (use AFTER this for UI interaction testing)
- `requesting-code-review` — Security scanning and AI code review
- `ui-iterative-refinement` — Refine UI after validation passes
