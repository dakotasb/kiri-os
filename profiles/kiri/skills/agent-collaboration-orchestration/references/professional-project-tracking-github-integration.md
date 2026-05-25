# Professional Project Tracking with GitHub Integration

**Session-Tested Pattern:** May 16, 2026  
**Context:** 36-issue dashboard fix for investor demo

---

## Overview

This pattern binds agent fixes to GitHub issues with automated lifecycle management: creation → assignment → closure tracking.

---

## Part 1: GitHub Issue Creation (@archivist)

### Structure

```yaml
Total Issues: 36
Phases:
  Phase 1 (Security): 6 issues [C1-C3, H1-H3]
  Phase 2 (Core): 7 issues [C4-C8, H8-H9]
  Phase 3 (Arch): 8 issues [H4-H7, C9, M10-M18]
  Phase 4 (Perf): 6 issues [M13-M18, C9 duplicates]

Labels:
  - priority/critical (9)
  - priority/high (9)
  - priority/medium (18)
  - category/security, category/functionality, category/architecture, category/performance
```

### Creation Command

```bash
gh issue create \
  --repo dakotasb/Kiri \
  --title "${ID}: ${title}" \
  --body "${description}" \
  --label "priority/${level},category/${cat}"
```

### Duplicate Prevention

**Problem:** Multiple runs created 62 issues (26 duplicates)  
**Solution:** Check before creation: `gh issue list --state open | grep "${ID}:"`

---

## Part 2: Automated Issue Closure (@ledger + @archivist)

### Ledger's Discord Bot Enhancement

The Discord status bot should EXTRACT issue numbers from commits and auto-close:

```python
def extract_issues_from_commits(commits):
    issues = []
    for commit in commits:
        # Pattern: "closes Issue #N", "Closes #N", "fixes #N"
        import re
        matches = re.findall(r'(?:closes|fixes|resolves)[\s#]*(\d+)', commit['message'], re.I)
        issues.extend(matches)
    return issues

def close_github_issues(issues, agent_name, commit_hash):
    for issue_id in issues:
        subprocess.run([
            'gh', 'issue', 'close', issue_id,
            '--repo', 'dakotasb/Kiri',
            '--comment', f'Fixed by {agent_name} in commit {commit_hash}'
        ])
```

### Chronicle's Git Tracking

```bash
# In docs/git_monitor_tracker.sh
git log --format="%H %s %b" --since="${last_check}" --oneline

grep -oE '(closes|fixes|resolves) #?[0-9]+' | while read match; do
    issue="$(echo $match | grep -oE '[0-9]+')"
    agent="$(echo $commit | grep -oE '@[a-z]+')"
    
    # Close via gh CLI
    gh issue close "$issue" --comment "Resolved by agent ${agent}"
done
```

---

## Part 3: Commit Convention Enforcement

### Format Template

```
[category] Issue-ID: Concise description

- Detailed change bullet
- Detailed change bullet

Closes #<issue-number>
Testing: What was verified
Author: @<agent-name>
```

### Examples from Session

```
[security] C1: Fix shell injection in agent control API

- Parameterized all agentId inputs using PreparedStatement
- Added express-validator middleware for query sanitization

Closes #1
Testing: Verified blocks ;rm -rf / payloads
Author: @bastion
```

```
[fix] C8: Theme toggle - implement state + persistence

- ThemeContext.tsx with localStorage
- Wrapped layout with ThemeProvider

Closes #8
Testing: Manual toggle dark/light, refresh persistence
Author: @forgemaster
```

---

## Part 4: Phase Tracking File

**PROJECT_STATUS.md** format used by @ledger:

```markdown
# Agent OS Dashboard - Fix Progress Tracker

## Overall Progress: X/Y resolved (Z%)

## Phase 1: Security (6 issues)
| ID | Issue | Status | Priority | Agent | Notes |
|----|-------|--------|----------|-------|-------|
| C1 | Shell injection | ✅ RESOLVED | Critical | @bastion | Attempt 1/3 |
| C2 | Global auth | ✅ RESOLVED | Critical | @temper | Attempt 1/3 |
...

## Phase 2: Core Functionality (7 issues)
...

## Critical Alerts
- None
```

---

## Part 5: Automated Workflow Summary

```
┌────────────────────────────────────────────────────────────┐
│           PROFESSIONAL PROJECT TRACKING FLOW              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  @kiri          @archivist      @chronicle      @ledger    │
│  (Orchestrator) (Issues)       (Git)           (Status)    │
│      │              │               │               │      │
│      │── Dispatch ─>│               │               │      │
│      │             │── Create ─────>│               │      │
│      │              │   issues on   │               │      │
│      │              │   GitHub      │               │      │
│      │              │               │               │      │
│      │              │               │               │      │
│      │<── Report ───│               │               │      │
│      │              │               │               │      │
│      │              │               │<── Commit ────│      │
│      │              │               │   monitoring  │      │
│      │              │               │               │      │
│      │              │<── Close ─────│               │      │
│      │              │   resolved    │               │      │
│      │              │   issues      │               │      │
│      │              │               │               │      │
│      │<── Discord ───────────────────               │      │
│      │    update                               │      │
│      │              │               │               │      │
│      │── Next ────────────────────────────────────────>│
│      │    dispatch                                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Lesson Learned: Duplicate Issues

**What went wrong:** @archivist created 36 issues → ran again → 62 total

**Root cause:** No check if issues already exist

**Fix to apply:**

```bash
# Before creating, check if any exist
existing=$(gh issue list --state open --json title | jq '[.[] | select(.title | startswith("C1:") or startswith("C2:") ...)] | length')

if [ "$existing" -gt 0 ]; then
  echo "Found $existing existing issues. Skipping creation."
  exit 0
fi
```

---

## Related Skills

- `github-issues` — Managing issues via gh CLI
- `agent-project-management` — Broad project orchestration patterns

---

*Generated from: Agent OS Dashboard fix session, Phase 1 Security complete*