# Dashboard Recovery Reference Commands

## Port 3001 Conflict Resolution

### Find and kill processes
```bash
# Find what's using port 3001
lsof -i:3001

# Get PIDs only
lsof -i:3001 -t

# Kill all processes on port
pkill -9 -f "next.*3001" 2>/dev/null
lsof -i:3001 -t | xargs kill -9 2>/dev/null
```

### Python one-liner
```python
import subprocess, time
pids = subprocess.run(["lsof", "-i", ":3001", "-t"], capture_output=True, text=True).stdout.strip().split('\n')
for pid in pids:
    if pid:
        subprocess.run(["kill", "-9", pid])
print("Port cleared")
```

## Git Recovery Commands

### Find commit with package.json
```bash
# Show commits that touched package.json
git log --all --format="%h %s" --oneline -- '*package.json' | head -10

# Check if file exists in specific commit
git show COMMIT_HASH:package.json 2>/dev/null | head -5
```

### List files at commit
```bash
git show COMMIT_HASH:package.json 2>/dev/null | head -20
git show HEAD --name-only | head -25
```

## Backup Locations

Common backup paths to check:
- `~/staging-dashboard-backup-{timestamp}/`
- `~/staging-dashboard/`
- `~/mvp-dashboard-staging/`

## Server Start with Port

```bash
# Correct way to set port for Next.js 14.2
cd ~/dashboard && export AUTH_API_KEY=dev-key-123 && PORT=3001 npm run dev

# Environment variable approach (required)
export PORT=3001
npm run dev
```

## Cache Clearing

```bash
# Clear all Next.js caches
rm -rf .next dev dist .turbo node_modules/.cache

# Then reinstall and restart
npm install
PORT=3001 npm run dev
```

## Verification Commands

```bash
# Wait for server startup
sleep 30

# Check if running
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/dashboard

# Check content
curl -s http://localhost:3001/dashboard | head -c 300
curl -s http://localhost:3001/agents | head -c 200
```

## File Integrity Check

```python
# Check if critical files exist
import os

critical_files = [
    "package.json",
    "next.config.js",
    "src/app/(dashboard)/page.tsx",
    "src/data/agents.ts",
    "src/components/agent-card.tsx"
]

for f in critical_files:
    if os.path.exists(f):
        print(f"✓ {f}")
    else:
        print(f"✗ MISSING: {f}")
```
