# Git Version Recovery for Next.js Dashboards

## When to Use

- Agent (like @kiri) **nuked** the working dashboard
- Code was working on port 3001, now shows 404 or wrong version
- `git status` shows files "deleted" or "modified by someone"
- User has screenshots showing features that no longer exist
- You need to restore to last known working commit and preserve it

## Root Cause
Agents modifying code often:
1. Overwrite working files with different content
2. Delete key files (pages, components, API routes)
3. Commit their changes, making git history the only path back
4. Corrupt build cache in the process

## Recovery Steps

### Step 1: Find Last Working Commit

```bash
cd ~/path/to/dashboard-project
git log --oneline -20
```

Look for commit messages like:
- `feat(kiri): initial MVP dashboard` ← Features existed here
- `feat: working dashboard on 3001`
- `[BASELINE] Import dashboard from staging backup` ← Baseline BEFORE breakage

**If @kiri (or any agent) did the last commit:**
The commit BEFORE theirs is likely the working version.

### Step 2: Inspect Differences

```bash
# See what changed between working commit and now
git diff eddf4b2 HEAD --stat

# Look for deletions (these are your missing pages)
```

**Red flags:**
- Missing `src/app/(dashboard)/page.tsx` ← Main page deleted
- Missing `src/app/(dashboard)/agents/` ← Agent routes deleted  
- Missing `src/components/dashboard/` ← UI components gone

### Step 3: Restore Working Version

**Option A: Soft reset (keeps changes, unstages them)**
```bash
git reset HEAD~1  # Undo last commit, keep changes
```

**Option B: Hard reset (DESTROYS current changes - use when agent overwrote everything)**
```bash
git reset --hard eddf4b2  # Replace with actual working commit hash
```

**⚠️ WARNING:** `git reset --hard` is DESTRUCTIVE. Only use when:
- Current state is broken and unrecoverable
- User confirms the working version is in git history
- You've identified the CORRECT commit hash

### Step 4: Create Protection Branch (RECOMMENDED)

```bash
git checkout -b protected-before-agent-changes
git checkout main  # or original branch
```

This preserves the working state before any risky restoration.

### Step 5: Full Cache Reset After Restore

```bash
rm -rf .next
rm -rf node_modules  # Sometimes corrupted too
rm package-lock.json
npm install
```

### Step 6: Start Server

```bash
export AUTH_API_KEY=dev-key-123
PORT=3001 npm run dev
```

### Step 7: Verify NOT Browser

```bash
sleep 35
curl -s http://localhost:3001/dashboard | grep -o "Agents\|Dashboard\|AgentCard"
```

```
Agents ✓
```

## Prevention: Protect Working Versions

### Method 1: Tag Working States

```bash
git tag -a working-dashboard-v1.0 -m "Working dashboard on 3001 with agents"
git push origin working-dashboard-v1.0
```

### Method 2: Pre-Flight Checklist

Before agents modify dashboards:

1. **Commit current state:**
   ```bash
   git add .
   git commit -m "[PROTECT] Working baseline before agent edits"
   ```

2. **Create backup branch:**
   ```bash
   git checkout -b backup/working-before-kiri
   git checkout main  # return to edit branch
   ```

3. **Document what works:**
   - Screenshot the layout
   - Save curl test command
   - Note port and routes

### Method 3: Read-Only Reference Copies

Save working versions outside git:

```bash
cp -r ~/command_center/kirimvp_orchestration/phase3_build/dashboard \
     ~/dashboard-backups/working-$(date +%Y%m%d-%H%M%S)
```

### Method 4: Agent Guardrails

In agent instructions:
```
BEFORE MODIFYING DASHBOARD:
1. Take screenshot of current working state
2. Run curl test: curl http://localhost:3001/dashboard
3. Record commit hash: git log -1 --oneline
4. Create backup branch: git checkout -b backup/pre-$(date +%s)
5. ONLY THEN make changes
```

## Testing Recovery (Before It's Needed)

```bash
# Simulate version recovery test
WORKING_COMMIT=$(git log --oneline | grep -i "working\|feat.*dashboard" | head -1 | awk '{print $1}')
git reset --hard $WORKING_COMMIT
rm -rf .next && npm install && PORT=3001 npm run dev &
sleep 25
curl -s http://localhost:3001/dashboard | head -c 200
pkill -9 -f "next"
git checkout main  # Return to original
```

## Related

- `nextjs-cache-troubleshooting` - For cache corruption (different than version loss)
- `hermes-profile-creation` - For agent who breaks things
- `kanban-orchestrator` - For preventing direct-agent-work
