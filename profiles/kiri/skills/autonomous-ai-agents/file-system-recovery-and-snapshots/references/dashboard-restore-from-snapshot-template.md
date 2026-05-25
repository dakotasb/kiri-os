# Dashboard Restore from Snapshot - Template

Template for restoring Next.js/React dashboard from snapshot/backup when git history doesn't contain target state.

## Quick Checklist

- [ ] Stop running dev server on target port
- [ ] Backup current (even if broken): `cp -r dashboard/ dashboard-broken-backup-$(date +%s)/`
- [ ] Verify snapshot has expected components
- [ ] Selective restore or full overwrite
- [ ] Reinstall dependencies
- [ ] Restart server and verify

## Restore Commands

### 1. Kill existing server
```bash
fuser -k 3001/tcp 2>/dev/null || kill -9 $(lsof -t -i:3001) 2>/dev/null || true
```

### 2. Backup current state
```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/
cp -r dashboard/ dashboard-pre-restore-$(date +%s)/
```

### 3. Full restore from snapshot
```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard

# Clear current (keep .git, node_modules for speed)
rm -rf src app components *.json *.ts *.js *.mjs *.css public

# Restore from snapshot
cp -r /path/to/snapshot/* .
```

### 4. Restore from tar.gz archive
```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/
rm -rf dashboard/
mkdir dashboard
cd dashboard
tar -xzf /path/to/snapshot/source-archive.tar.gz
```

### 5. Reinstall and restart
```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard
rm -rf .next node_modules/.cache
npm install --legacy-peer-deps
PORT=3001 npm run dev
```

## Verification Steps

### Check critical files exist
```bash
ls src/app/(dashboard)/page.tsx
ls src/components/agent-card.tsx  # or AgentCard equivalent
ls src/data/agents.ts
cat package.json | grep '"next"'
```

### Check content has expected features
```bash
# Should see AgentCard, Dashboard, etc.
grep -l "AgentCard\|agent.*card\|Dashboard" src/app/(dashboard)/page.tsx

# Should see sidebar navigation
grep -l "Sidebar\|sidebar" src/components/sidebar.tsx
```

### Test server response
```bash
curl -s http://localhost:3001/ | grep -o 'Kiri\|Dashboard\|Agents' | head -3
# Expected: Shows Kiri, Dashboard, Agents
```

## Common Issues

### Missing CSS file error
**Symptom:** `Can't resolve './styles/tokens.css'`
**Fix:** Remove invalid import from globals.css, or create empty file

### Port already in use
**Symptom:** `EADDRINUSE: address already in use :::3001`
**Fix:** `fuser -k 3001/tcp` or `kill -9 $(lsof -t -i:3001)`

### Next.js version mismatch
**Symptom:** Build errors, cache issues
**Fix:** Clear `.next/` directory, reinstall dependencies

## Session Reference: 2026-05-17

**Source:** `/home/dakotasb/snapshots/dashboard-pre-color-update/`
**Target:** `~/command_center/kirimvp_orchestration/phase3_build/dashboard/`
**Result:** Successfully restored 29-agent dashboard with purple theme
