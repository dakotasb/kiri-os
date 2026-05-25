# Multi-Agent Issue Management

**Context:** Managing GitHub issues across 36 agents in parallel with automated tracking, push, and cleanup workflows.

## Session-Specific Configuration

**Repository:** `github.com/dakotasb/Kiri`  
**Branch Pattern:** `fix/{category}-{priority}-issues`  
**Total Issues:** 36 (C1-C9, H1-H9, M1-M18)  
**Auto-Push:** Every 15 minutes via @launchpad

## Automated Issue Lifecycle

### 1. Bulk Issue Creation
```bash
# 36 issues created from registry
gh issue create --title "C1: Shell injection vulnerability" \
  --label "priority/critical,category/security" \
  --body "**Issue**: ..." \
  --assignee dakotasb
```

**Pitfall:** Multiple runs create duplicates. Always check count before re-running.

### 2. Auto-Close from Commits
The Discord bot (`discord_status_reporter.py`) auto-detects fixes:

```python
# Extract issue from commit message
extract_issue_from_message("[security] C1 Fix: Shell injection - closes Issue #1")
# Returns: 1

# Close with attribution
gh issue close 1 --comment "Fixed by @bastion in commit ed6f7c4c"
```

**Tracking:** Uses `.last_processed_commit` to prevent duplicate closing.

### 3. Duplicate Detection Script
```bash
# Find duplicates by title
gh issue list --limit 100 --json number,title | jq -r '.[] | "\(.number): \(.title)"' | sort | uniq -d

# Close duplicates keeping first
for dup_issue in $DUPLICATES; do
  gh issue close "$dup_issue" --comment "Duplicate - closing in favor of original"
done
```

## Issue Registry Structure

Issues categorized by severity:
- **C1-C9:** Critical (shell injection, auth bypasses, XSS)
- **H1-H9:** High (security headers, hardcoded keys, broken UI)
- **M1-M18:** Medium (UX, performance, polish)

**Registry File:** `agent_os_critical_issues_registry.md`

## Git Branch Strategy

```
main
├── fix/security-critical-issues      (Phase 1: 6 agents)
├── fix/core-functionality-issues     (Phase 2: 7 agents)
├── fix/architecture-data-issues      (Phase 3: 8 agents)
└── fix/performance-deploy-issues     (Phase 4: 6 agents)
```

## Agent Assignments

| Issue | Agent | Branch |
|-------|-------|--------|
| C1 | @bastion | fix/security-critical-issues |
| C2 | @temper | fix/security-critical-issues |
| C3 | @temper | fix/security-critical-issues |
| H1 | @sentry | fix/security-critical-issues |
| ... | ... | ... |

## Pre/Post Change Snapshots

**@relic** manages snapshots:
```bash
# Pre-change
reldash-YYYYMMDD-{phase}-{issue}-attempt{N}.tar.gz

# Post-change validated
reldash-YYYYMMDD-{phase}-{issue}-validated.tar.gz
```

## Error Recovery

**If 62 issues exist instead of 36:**
1. Identify duplicates: `gh issue list --limit 100 | sort | uniq -d`
2. Close extras: @archivist dispatches cleanup
3. Verify: Should have exactly C1-C9, H1-H9, M1-M18

## Lessons

1. **GitHub auto-push** must be on same branch as fixes
2. **Auto-close** extracts issue numbers from commit messages
3. **Discord updates** every 15 min with status + auto-closed issues
4. **Phase markers** (`.phase1_complete`) enable conditional workflows
5. **Multiple runs** of issue creation = duplicates; guard with checks

## Cross-References

- `PROJECT_STATUS.md` — Live tracking (36 issues, phases)
- `GIT_PUSH_LOG.md` — Auto-push history
- `GIT_HISTORY_PHASE1.md` — Commit chronicle
- `SYSTEM_OVERVIEW.md` — Full project dashboard