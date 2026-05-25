# Dashboard Restore from Snapshot Workflow

Reference for restoring a dashboard to a previous point-in-time state using preserved snapshots, git commits, or backup directories.

## User Request Patterns

| What User Says | What They Usually Mean |
|---------------|------------------------|
| "Restore to version from May 11 at 2:58 PM" | Preserved snapshot from that timestamp |
| "Revert to previous version between X and Y" | Snapshot in `~/snapshots/`, not git commit |
| "Go back to the version we had" | Most recent working snapshot |
| "The version with purple colors" | Named snapshot like `dashboard-pre-color-update/` |

## Common Snapshot Locations

Check these locations in order of recency:

1. **`~/snapshots/dashboard-*`** - Named snapshots (e.g., `dashboard-pre-color-update`)
2. **`~/.hermes/backups/agent-merge-*/`** - Pre-merge agent state backups  
3. **`~/.hermes/profiles/*/home/...`** - Profile-specific workspace copies
4. **`~/mvp-dashboard-staging/`** - Original broken project files
5. **Git commits** via `git reflog | head -20` - Only if no snapshot exists

## Restore Procedure

### Step 1: Locate the Snapshot

```bash
# List available snapshots
ls -la ~/snapshots/ 2>/dev/null || echo "No snapshots directory"

# Check agent-merge backups
ls ~/.hermes/backups/agent-merge-*/

# Check profile homes for preserved dashboards
find ~/.hermes/profiles -name "page.tsx" -path "*/dashboard/*" 2>/dev/null | head -5
```

### Step 2: Stop Running Server

```bash
pkill -9 -f "next dev" 2>/dev/null || true
fuser -k 3001/tcp 2>/dev/null || true
sleep 2
lsof -i:3001 2>/dev/null || echo "Port free"
```

### Step 3: Clear and Restore

```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard

# Clear current
cp -r * /tmp/dashboard-current-backup/ 2>/dev/null || true
rm -rf * .[!.]* 2>/dev/null

# Copy from snapshot
cp -r ~/snapshots/dashboard-{SNAPSHOT-NAME}/* . 2>&1 | head -20

# Verify key files
ls -la package.json src/app/'(dashboard)'/page.tsx 2>/dev/null
```

### Step 4: Clean Node Modules (CRITICAL)

Backup snapshots often contain `node_modules/` with stale binary paths.

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps  # Or --force if needed
```

**Failure Mode:** Reusing backup node_modules causes cryptic module errors.

### Step 5: Fix Common Post-Restore Errors

#### Error: `Can't resolve '@/lib/sanitize'`
**Solution:** Create the missing utility file:

```typescript
// src/lib/sanitize.ts
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeUrl(url: string): string {
  return url.trim().toLowerCase().startsWith('javascript:') ? '' : url;
}
```

#### Error: `Unknown font 'Geist'`
**Solution:** Replace in `src/app/layout.tsx`:
```typescript
// Replace:
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({...});

// With:
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
```

#### Error: `Can't resolve './styles/tokens.css'`
**Solution:** Replace complex globals.css with basic Tailwind CSS:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... standard tokens */
}
```

### Step 6: Start Server and Verify

```bash
rm -rf .next
PORT=3001 npm run dev

# Wait for compilation
sleep 10
curl -s http://localhost:3001/ | grep -E "Dashboard|Agents|Kiri" | head -3
```

## Git vs Snapshot: When to Use Which

| Scenario | Use This |
|----------|----------|
| Working directory corrupted, need exact prior state | Snapshot (faster, guaranteed state) |
| Need to see what changed between versions | Git diff |
| Want to cherry-pick specific files | Git checkout |
| System-wide change affected multiple components | Snapshot |
| Need to collaborate/share the state | Git commit/branch |

## Session Recovery from `~/.hermes/sessions/`

Session files are `jsonl` format with timestamp in filename:
```
20260511_145839_7118cb.jsonl  # May 11 14:58 UTC
# → CT: May 11 09:58 AM (UTC-5:00)
```

To extract what was accomplished:
```bash
head -100 ~/.hermes/sessions/20260511_145839_7118cb.jsonl | \
  grep -E "commit|created|deployed|finished"
```

## Verification Checklist

- [ ] Server starts without `Module not found` errors
- [ ] Page loads in browser (not 500 error)
- [ ] Agent cards display (29-30 expected)
- [ ] Sidebar navigation renders
- [ ] Status badges show (Online/Idle/Busy/Offline)
- [ ] No duplicate API route warnings (remove `.js` duplicates)
- [ ] Port 3001 shows LISTEN in `lsof -i:3001`
