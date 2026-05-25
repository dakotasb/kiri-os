---
name: staging-dev-server-copy
description: Create a staging copy of a running dev server for safe iteration. Copies the entire project, starts a parallel instance on a different port, and verifies both servers remain accessible. Preserves the original production instance while enabling experimentation.
version: 1.0.0
tags: [dev-server, staging, nextjs, parallel, iteration, port-management, safe-experimentation]
---

# Staging Dev Server Copy

## The Pattern

You have a working dev server (e.g., Next.js on port 3000). You want to experiment with changes without risking the working version. Create a staging copy on a different port.

## When To Use

- Experimenting with new features on a "working" dashboard/app
- Testing configuration changes
- Preparing a demo while keeping dev running
- A/B comparison of versions
- Any situation: "I want to iterate but keep what works"

## Prerequisites: Verify Active Directory

**CRITICAL:** Before any file operations, confirm you're in the correct working directory. Multiple project copies may exist (e.g., `phase3_build/dashboard/` vs `dashboard-iteration-v1/`).

```bash
# Verify which directory is "active" for this work
pwd
git log --oneline -1  # Check commit matches expected
ls src/ | head -5     # Verify expected file structure

# If multiple locations exist, confirm with user or prior context which is canonical
```

**Never assume** — always verify. Changing the wrong directory wastes time and corrupts working state.

## Prerequisites: Verify Source is Clean

**CRITICAL:** Before creating staging, ensure the original isn't corrupted by stale cache.

```bash
# Check if source has stale Next.js cache causing display issues
if [ -d ".next" ]; then
    echo "Warning: .next cache exists. Clear it first?"
    rm -rf .next
    npm run dev &
    sleep 10
    curl -s http://localhost:3000 | grep -q "Expected Content" || echo "Source may be corrupted"
fi
```

## The Procedure

### Step 1: Copy Project Directory

```bash
cd /parent/directory

# Create timestamped copy
cp -r original-project project-name-staging

# Or use specific name
cp -r mvp-dashboard mvp-dashboard-staging
```

**Important:** Copy includes:
- Source code
- Config files (next.config.js, package.json, etc.)
- **Do NOT copy**: node_modules/, .next/ (will regenerate)

### Step 2: Start Staging Server on New Port

```bash
cd project-name-staging

# If PORT env var supported:
PORT=3001 npm run dev

# Or modify package.json script temporarily:
# "dev:staging": "next dev -p 3001"
npm run dev:staging
```

### Step 3: Verify Both Running

```bash
# Check ports are listening
ss -tlnp | grep -E "300[01]"

# Or using lsof
lsof -i :3000
lsof -i :3001

# Test both respond
curl -s http://localhost:3000/ | head -5
curl -s http://localhost:3001/ | head -5
```

## Complete Example

```bash
# Original running on :3000 — DON'T TOUCH
cd ~/projects/

# Staging copy
cp -r dashboard dashboard-staging

# Clean and start staging (optional but recommended)
cd dashboard-staging
rm -rf node_modules .next  # Fresh install
npm install
PORT=3001 npm run dev

# Verify
sleep 10
curl http://localhost:3001 | grep -o "<title>.*</title>"

echo "Staging ready on http://localhost:3001"
echo "Production still on http://localhost:3000"
```

## Port Management Guidelines

| Service | Port | Use |
|---------|------|-----|
| Production dev | 3000 | Stable, working version |
| Staging dev | 3001 | Iteration/experimentation |
| Second staging | 3002 | Additional experiments |
| API server | 3005 | Related services |
| Preview | 3008 | Build previews |

**Check ports before using:**
```bash
lsof -i :3001  # If empty, port is free
```

## Troubleshooting

### "Port already in use"
```bash
# Find what's using it
lsof -i :3001

# Kill it or use different port
PORT=3002 npm run dev
```

### Staging shows old version
Clear the staging copy's cache:
```bash
cd dashboard-staging
rm -rf .next
npm run dev
```

### Changes in staging affect original
You accidentally edited original instead of staging. Use separate terminal windows with different working directories to avoid confusion.

## Safety Rules

1. **Never edit original** when iterating on staging
2. **Always verify** which port you're hitting (bookmark http://localhost:3001 in browser)
3. **Clean staging node_modules** if weird behavior (corruption can copy)
4. **Kill staging** when done, keep original running
5. **Promote staging** → original by replacing original directory (if successful)

## Comparison to Other Patterns

| Pattern | Use When | Risk |
|---------|----------|------|
| Staging copy | Need parallel instances | Low (isolated) |
| Git branch | Need version control | Low (reversible) |
| Direct edit | Quick fix, confident | Medium |
| Live reload | Normal iteration | Low |

This skill is **staging copy** — the nuclear option when you absolutely must not break what works.

## Related Skills

- `nextjs-cache-troubleshooting` — If staging behaves weird (clear .next)
- `build-artifact-recovery` — Recover if staging breaks original
- `subagent-driven-development` — Dispatch agents to work on staging copy