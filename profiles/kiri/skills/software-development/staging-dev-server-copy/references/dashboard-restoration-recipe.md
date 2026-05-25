# Dashboard Restoration Recipe
## When a working dashboard gets corrupted by modifications

This procedure recovers a working Next.js dashboard after a subagent or manual changes corrupted it.

### The Problem

Your working dashboard on port 3001 was functioning (showing agent cards, stats, search functionality). After a subagent attempted modifications, it became non-functional with errors like:
- `package.json: no such file or directory`
- Cache corruption (`node_modules/.cache` issues)
- `next-flight-client-entry-loader` not found

### The Recovery Steps

**Step 1: Identify working commit or backup**
```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard
git log --oneline -10
# Look for commits labeled [BASELINE] or staging imports
# Or check for external backup: ls ~/staging-dashboard-backup-*/
```

**Step 2: Restore critical files from backup**
```bash
# If git commit has working code but package.json missing:
git show COMMIT_HASH:package.json > package.json
git checkout COMMIT_HASH -- .

# OR from external backup:
cp ~/staging-dashboard-backup-*/package.json ./
cp ~/staging-dashboard-backup-*/next.config.js ./
```

**Step 3: Clear ALL caches**
```bash
rm -rf .next dev dist .turbo
# Don't remove node_modules unless necessary
```

**Step 4: Verify source files exist**
```bash
ls src/data/agents.ts       # Should have agent definitions
ls src/app/\(dashboard\)/   # Should have page.tsx
cat package.json | head -5  # Should show valid name/scripts
```

**Step 5: Start server**
```bash
export AUTH_API_KEY=dev-key-123
npm run dev  # Server starts on port from next.config.js
```

**Step 6: Verify**
```bash
sleep 30
curl -s http://localhost:3001/dashboard | head -c 100
curl -s http://localhost:3001/dashboard -w "%{http_code}"
```

### Key Differences from Normal Staging

| Normal Staging | Restoration |
|----------------|-------------|
| Start from working state | Start from broken state |
| Copy works immediately | May need selective file restore |
| Clean node_modules recommended | Preserve if possible |
| Cache clear optional | Cache clear **mandatory** |

### Prevention: Check Before Any Changes

**CRITICAL:** Before a subagent modifies a working dashboard:
```bash
# 1. Verify current state
lsof -i :3001                          # Server running?
curl http://localhost:3001/dashboard   # Responds 200?

# 2. Create timestamped backup
BACKUP_DIR=~/dashboard-backup-$(date +%s)
cp -r ~/command_center/.../dashboard $BACKUP_DIR

# 3. Pin the subagent to ONLY that backup copy
# 4. Never let subagent modify original if original is production
```

### Related

- If dashboard still 404: Check next.config.js redirects config
- If 500 errors: Check TypeScript compilation (`npx tsc --noEmit`)
- If cache errors persist: `rm -rf node_modules && npm install --legacy-peer-deps`