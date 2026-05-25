# Git Large File Handling

## Problem

Next.js binaries (`@next/swc-*`) exceed GitHub's 100MB file size limit, causing push failures even when code is ready.

**Error signature:**
```
remote: error: File node_modules/@next/swc-linux-x64-gnu/next-swc.linux-x64-gnu.node is 124.23 MB
remote: error: this exceeds GitHub's file size limit of 100.00 MB
remote: error: GH001: Large files detected
```

## Root Cause

- Next.js ships platform-specific SWC binaries (~100-150MB each)
- These get committed when `node_modules` isn't properly excluded
- GitHub rejects pushes with files >100MB

## Prevention

### 1. Pre-commit Check

```bash
# Check for large files BEFORE committing
cd REPO_ROOT
find . -path ./node_modules -prune -o -size +50M -print 2>/dev/null

# If any files >50MB found, STOP and investigate
```

### 2. Proper .gitignore

```gitignore
# Node modules - NEVER commit
**/node_modules/

# Next.js build artifacts
**/.next/
**/dist/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### 3. .gitattributes (Optional but recommended)

```
# Treat node_modules as generated (optional speedup)
**/node_modules/* linguist-generated=true
```

## Recovery (When Already Committed)

### Option A: Filter Branch (Recommended for active branches)

```bash
cd ~/command_center
git checkout fix/security-critical-issues

# Backup first
git branch backup-$(date +%Y%m%d)-pre-purge

# Remove node_modules from entire history
git filter-branch --force --index-filter '
  git rm -rf --cached --ignore-unmatch */node_modules/* 2>/dev/null || true
' HEAD

# Force push (coordinate with team!)
git push origin fix/security-critical-issues --force-with-lease
```

**⚠️ WARNING:** Rewrites git history. All agents must re-clone or force-reset.

### Option B: Git LFS (For files you MUST track)

```bash
# Install LFS
git lfs install

# Track large files intentionally (if needed)
git lfs track "*.traineddata"
git lfs track "*.model"

# Already-committed large files need migration
git lfs migrate import --include="*.traineddata"
```

### Option C: BFG Repo-Cleaner (Fastest for large repos)

```bash
# Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Run on mirror clone
cd ~/command_center.git  # bare clone
java -jar bfg-1.14.0.jar --strip-blobs-bigger-than 50M

# Garbage collect
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Agent Dispatch Pattern

**When blocked on push, dispatch:**
```python
terminal(
    background=True,
    command="cd ~/command_center && hermes -p launchpad chat "
            "-q 'EMERGENCY: GitHub push blocked by large files in node_modules. "
            "Purge from history using git filter-branch, backup branch first, "
            "then force push. Report when complete.' -Q"
)
```

## Verification Checklist

Before marking "push complete":
- [ ] `git log --oneline` shows commits without node_modules
- [ ] GitHub push succeeds (no GH001 error)
- [ ] Backup branch exists (`backup-YYYYMMDD-pre-purge`)
- [ ] All code commits preserved (only node_modules removed)

## Reference

- GitHub docs: https://docs.github.com/en/repositories/working-with-files/managing-large-files
- BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
