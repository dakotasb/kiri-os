# Git Authentication Blocker Patterns

## Pattern: GitHub Push Blocked Despite Commits Ready

## When This Occurs

- Git history cleanup completed (e.g., `git-filter-repo` removing 917MB node_modules)
- Commits prepared locally (ready to push to origin/main)
- User requests push via agent (@launchpad)
- Agent attempts push but fails on authentication

## Common Blockers Detected

```
✗ gh CLI installed but not authenticated (gh auth status = unauthenticated)
✗ No GITHUB_TOKEN env var found
✗ No ~/.git-credentials stored
✗ No ~/.ssh/ directory — no SSH keys
✗ Git credential helper = cache only
```

## User Options

### Path A — Provide a PAT (Fastest for Agent)

User provides GitHub Personal Access Token with `repo` scope.
Agent configures `git credential.helper store` and pushes immediately.

```bash
git config credential.helper store
# Then push with token embedded in remote URL or via helper
```

### Path B — Authenticate gh CLI

User runs `gh auth login` in terminal (browser/CLI flow).
Once authenticated, agent can push normally via `gh`.

### Path C — Manual Push

User handles push from Windows GitHub Desktop or another authenticated machine:
1. Pull dakotasb/Kiri.git branch main
2. Push to origin.main
3. Commit 30abb0b (or current) is already ready locally

## Orchestrator Response Pattern

When agent reports auth blocker:

1. **Present options clearly** — A, B, C with trade-offs
2. **Show what's ready** — Commit hash, files changed, "ready to push"
3. **Recommend fastest path** — Based on user's context
4. **DO NOT attempt workarounds** — No credential file creation, no token guessing

## Example Blocker Report

```
Build verification complete ✅
Commits ready locally ✅
Push to origin/main BLOCKED 🚫

Blockers:
- gh CLI not authenticated
- No stored git credentials
- No SSH keys found

Ready to push: commit 30abb0b
Local branch: main (ahead of origin/main by N commits)

Paths forward:
A) Provide PAT → Agent configures and pushes (fastest)
B) Authenticate gh → Run `gh auth login` yourself
C) Manual push → Use GitHub Desktop or other authenticated environment
```

## Resolution Tracking

| Path | Speed | Requires User Action | Agent Can Complete After |
|------|-------|-------------------|-------------------------|
| A | Fastest | Provide PAT | Yes, immediately |
| B | Fast | Browser auth | Yes, after user completes |
| C | Medium | Full manual push | No, user handles entirely |

## Session Context: 2026-05-16

**Situation:** Phase 5 build verification complete, 8 fixes applied, production-ready build achieved. @launchpad dispatched for final push, encountered auth blocker.

**Commit ready:** 30abb0b "[fix] PHASE 5: Complete - Build passes, MarketIntelligence guards added"

**Blocker:** All auth methods missing in WSL environment after git-filter-repo history rewrite.

**User decision:** Dispatched @ember for server functionality validation BEFORE handling push (test first, deploy second).

**Lesson:** Build success ≠ deploy ready. Always verify server functionality separately from build verification.