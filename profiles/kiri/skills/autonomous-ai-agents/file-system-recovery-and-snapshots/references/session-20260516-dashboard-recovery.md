# Session: Dashboard Recovery 2026-05-16

## The Situation

User said: "those are OLD screenshots" - referring to dashboard with AgentCards.

Current state: Only SystemMetrics showing at localhost:3001/

User requested: "revert to relic snapshot before project began"

## What Git Showed

- Commit `a8c6dd8 [BASELINE]`: Only had SystemMetrics
- All git history: Only SystemMetrics, no AgentCards
- Git-filter-repo had run - history rewritten

## What Actually Happened

The "working" dashboard code was NEVER in git. It was in an external snapshot.

## The Discovery

**Location:** `/home/dakotasb/snapshots/dashboard-pre-color-update/`

**Contents:**
- `source-archive.tar.gz` (233KB) - The actual dashboard code
- Date: May 10, 2024

## The Contents

Extracted and found:
```
src/app/(dashboard)/
├── page.tsx          ← Original AgentCards dashboard
├── activity/
├── dashboard/
├── dashboard-new/
├── metrics/
├── security/
├── settings/
├── teams/
├── terminal/
└── workflows/
```

**Features restored:**
- AgentCards with search/filter
- DashboardStats component
- Sidebar navigation
- Teams, Terminal, Security, Workflows pages
- "Kiri Orchestration System" branding

## The Fix

```python
# Backup current
shutil.copytree(dashboard_path, backup_dir)

# Clear broken files
for item in ['src', 'components', 'data', 'types', 'lib']:
    shutil.rmtree(item)

# Restore from snapshot
for item in ['src', 'components', 'data', 'types', 'lib', 'docs']:
    shutil.copytree(f"{snapshot_path}/{item}", item)

# Restore configs
for config in ['package.json', 'tsconfig.json', ...]:
    shutil.copy(f"{snapshot_path}/{config}", ".")

# Reinstall and restart
npm install
npx next dev -p 3001
```

## The Lesson

**When user says "revert to original":**
1. Check git history first
2. If git doesn't have it, look for EXTERNAL snapshots
3. Check `~/snapshots/`, `~/backups/`, `/tmp/*-backup*/`
4. Search for `.tar.gz` archives
5. The "original" often lives outside version control

## Key Files Found

| File | Location | Purpose |
|------|----------|---------|
| page.tsx | src/app/(dashboard)/page.tsx | Main AgentCards dashboard |
| DashboardStats | src/components/DashboardStats.tsx | Stats bar component |
| AgentCard | src/components/agent-card.tsx | Individual agent card |
| agents data | src/data/agents.ts | Agent definitions |

## Verification Steps

1. Extract tar.gz
2. List src/app/ structure
3. Read page.tsx - confirm AgentCards
4. Restore to dashboard dir
5. npm install
6. Start server
7. curl localhost:3001 - verify AgentCards

## Result

✅ Original dashboard restored and running
✅ Server responding on http://localhost:3001
✅ User can see AgentCards again

---
Session: 2026-05-16
Issue: Git history didn't contain working code
Solution: External snapshot recovery
