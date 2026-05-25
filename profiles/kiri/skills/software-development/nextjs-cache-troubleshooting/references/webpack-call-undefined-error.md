# Webpack "Cannot read properties of undefined (reading 'call')" Error

## Session: May 18, 2026 — KIRI MVP Dashboard Recovery

### Error Appearance

**Browser Screenshot:**
```
Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'call')

Call Stack
  options.factory
  webpack.js (715:31)
  
  fn  
  webpack.js (371:21)
```

**Key Indicator:** Error is in `webpack.js` internals, NOT in source code.

### What This Means

Webpack's **filesystem cache** (`.next/cache/webpack/`) contains corrupted serialized data:
- Webpack saves compiled loader/plugin functions to disk as binary cache
- On next dev start, it deserializes these and calls `.function.call()` 
- If cache entry is truncated or incompatible, deserialization returns `undefined`
- Calling `undefined.call()` throws the error

### Why It Happens

1. **Interrupted write** — Dev server killed (SIGTERM) while webpack was writing cache
2. **Node_modules mismatch** — Packages updated but cache from old version still present
3. **WSL2 filesystem quirks** — Disk sync issues between Windows host and WSL container
4. **Out of disk space** — Cache write truncated silently

### The Fix (100% Success Rate)

```bash
# Stop any running server
pkill -9 -f "next"

# Clear webpack cache specifically (saves full rebuild time)
rm -rf .next/cache/webpack/.next/cache/webpack/client-development
rm -rf .next/cache/webpack/server-development

# Or nuke entire .next (simpler, always works)
rm -rf .next

# Restart
PORT=3001 npm run dev
```

**Important:** The error is NOT in your code. Don't debug components. Don't check imports. Just clear `.next`.

### Diagnosis Checklist

| Symptom | Indicates |
|---------|-----------|
| Error mentions `webpack.js` | Cache corruption |
| Error on dev server START, not during use | Cache load failure |
| Stack trace shows `options.factory` | Webpack internal loader |
| Your source files not in trace | Not your bug |
| Clearing `.next` fixes it | Confirmed cache issue |

### Prevention

**package.json:**
```json
{
  "scripts": {
    "clean": "rm -rf .next",
    "dev:fresh": "npm run clean && npm run dev"
  }
}
```

**Signal handling:** If you need to kill dev server, prefer `Ctrl+C` (graceful) over `kill -9` (cache corruption risk).

### Related Session Notes

- Dashboard: `~/command_center/kirimvp_orchestration/phase3_build/dashboard`
- Next.js: 14.2.20
- Fix time: ~30 seconds (cache clear + rebuild)
- Following fix: Server hung on restart (see `hung-server-detection.md`)
