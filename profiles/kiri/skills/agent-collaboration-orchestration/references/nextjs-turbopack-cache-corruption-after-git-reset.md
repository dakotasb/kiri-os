# Next.js Turbopack Cache Corruption After Git Reset

## Problem

After `git reset --hard <commit>` to revert code to earlier state, Next.js dev server fails with:

```
thread 'tokio-runtime-worker' panicked at turbopack/crates/turbo-tasks-backend/src/backend/mod.rs:248:14:
Failed to get task id: Unable to read next free task id from database

Caused by:
    0: Unable to open static sorted file referenced from 00000035.meta
    1: Unable to open static sorted file 00000033.sst
    2: Failed to open SST file /path/to/.next/dev/cache/turbopack/.../00000033.sst
    3: No such file or directory (os error 2)
```

## Root Cause

Git reset changes file contents but leaves stale Turbopack cache entries pointing to old file references (cache metadata references .sst files that no longer exist post-reset).

## Fix

**Clear cache completely before restart:**

```bash
cd /path/to/nextjs-project

# Remove all Next.js and Turbopack caches
rm -rf .next dev dist node_modules/.cache

# Restart with AUTH_API_KEY if required
export AUTH_API_KEY=dev-key-123
npm run dev -- -p 3001
```

## Prevention

When reverting code, always clear cache:

```bash
# Combined reset + clear + restart
git reset --hard a8c6dd8
rm -rf .next dev dist
export AUTH_API_KEY=dev-key-123  # if your app requires auth
npm run dev -- -p 3001
```

## Related Issues

- Does NOT happen with `git checkout` (files compatible with existing cache)
- DOES happen with `git reset --hard` to distant commit (cache out of sync)
- DOES happen with git-filter-repo history rewrite (commit SHAs change, cache invalid)

## Session Reference

- Date: 2026-05-16
- Context: Reverting dashboard to baseline commit a8c6dd8 broke Turbopack
- Fix verified: Cache clear + restart resolved
