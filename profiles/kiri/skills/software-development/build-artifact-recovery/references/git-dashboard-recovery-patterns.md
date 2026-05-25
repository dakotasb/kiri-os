# Git-Based Dashboard Recovery

## The Problem Pattern

**Scenario:** Agent overwrites working dashboard with broken version. No explicit backup exists.

**Session Example:**
- Dashboard WAS working (30 agents, stunning UI)
- Agent pushed broken changes
- Backup restored but was WRONG version

## Common Failures

### Error: `path 'src/app/(dashboard)/page.tsx' does not exist in commit`

**Meaning:** File location was different in that commit.

**Fix:**
```bash
git log --all --name-only | grep "page.tsx" | sort -u
```

### Error: `EADDRINUSE: address already in use :::3001`

```bash
# Kill by pattern
pkill -9 -f "next.*3001"
# Or nuclear option
fuser -k 3001/tcp
```

### Error: Missing `package.json` after reset

```bash
git log --all -- '*package.json'
```

## Key Lesson

Git history is NOT a backup. Recovery requires verification.
