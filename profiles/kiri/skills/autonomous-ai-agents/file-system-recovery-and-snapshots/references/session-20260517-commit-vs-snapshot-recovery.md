# Session 2026-05-17: Commit vs Snapshot Recovery Pattern

## Situation

User requested restoration to "May 11 2:58 PM CT" (commit 4ef0f7d). Git indicated the commit existed, but after `git reset --hard`:
- No `package.json` at root
- Code existed in nested subdirectory `kirimvp_orchestration/`
- Server couldn't start
- Dependencies couldn't be installed

## Discovery Process

1. **Git reset appeared to work:**
   ```bash
   git reset --hard 4ef0f7d
   # Output: "HEAD is now at 4ef0f7d"
   ```

2. **Structure was broken:**
   ```bash
   ls package.json              # MISSING
   ls src/app/page.tsx          # MISSING
   ls kirimvp_orchestration/    # EXISTS (unexpected)
   ```

3. **Git tree was submodule-style:**
   The commit tracked `kirimvp_orchestration` as a tree, not as flat project files

4. **External snapshot was correct source:**
   ```bash
   ~/snapshots/dashboard-pre-color-update/
   # Had package.json, src/, proper Next.js structure
   ```

## Recovery Pattern

```bash
# 1. Check git structure
ls *.json                    # package.json?
ls src/app/page.tsx         # entry point?

# 2. If broken, clear and use snapshot
rm -rf *
cp -r ~/snapshots/dashboard-pre-color-update/* .

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Fix any errors (font, css, etc.)
# See nextjs-cache-troubleshooting for font/css fixes

# 5. Start server
PORT=3001 npm run dev
```

## Lesson

**Commit exists ≠ Commit is usable**

Git commits may represent:
- Complete working project (typical)
- Partial submodule state  (the case here)
- Metadata-only changes    (CI files only)
- Broken intermediate work (WIP commits)

**Always verify** after git reset:
- Does `package.json` exist at root?
- Do source files exist where expected?
- Can `npm install` succeed?

If any check fails → **abandon git, use snapshot**.

## Related Session

See also: `session-20260516-dashboard-recovery.md`
