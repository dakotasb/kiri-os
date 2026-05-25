# Agent Work Verification Pattern

## Problem

Agents report "fix complete" but work is NOT committed to git. Discovered when:
- Agent outputs show "DONE"
- Phase completion percentages claimed high
- Git log shows NO commits for claimed fixes
- Audit reveals work exists only in agent output, not repository

## Detection

### Red Flags

```
✗ Agent says "DONE" (generic)
✗ Agent says "completed" but no commit hash in output
✗ Agent mentions issues/PRs without git references
✗ Phase percentages exceed actual git commits
```

### Verification Command

```bash
cd ~/command_center/kirimvp_orchestration/phase3_build/dashboard

# 1. List commits with issue references
git log --all --oneline --grep="C6\|C7\|C8\|H8\|H9" | head -20

# 2. Count commits per phase
echo "Phase 1 Security:" && git log --oneline --grep="C1\|C2\|C3\|C4\|H1\|H2\|H3" | wc -l
echo "Phase 2 Core:" && git log --oneline --grep="C5\|C6\|C7\|C8\|C9\|H4\|H5\|H6\|H7\|H8\|H9" | wc -l

# 3. Check for uncommitted work
git status --short

# 4. Verify specific issue
git log --all --oneline --grep="C7" | head -5
```

## Recovery Process

### Step 1: Audit Agent Session Logs

```bash
# Search agent session outputs for claimed work
grep -r "C7" ~/.hermes/profiles/*/logs/ 2>/dev/null | grep -i "done\|complete\|created"
```

### Step 2: Force Commit Recovery

**If work exists in working directory but not committed:**

```python
# Dispatch recovery agent
terminal(
    background=True,
    command="cd ~/command_center && hermes -p chronicle chat "
            "-q 'EMERGENCY: Audit uncommitted work. "
            "1. git status to find uncommitted changes. "
            "2. For each claim (C7, H9, etc.), verify files exist. "
            "3. Add and commit with proper message. "
            "4. Report which claims were recovered vs missing.' -Q"
)
```

### Step 3: Mark Issues Partial/Reassign

**If work truly missing:**

1. Update issue status: "Agent claimed complete, but no commit found"
2. Redispatch to different agent
3. Include in commit instructions: "MUST commit with `closes #N` in message"

## Prevention

### Commit Enforcement in Dispatch

**ALWAYS include in agent instructions:**

```python
# BAD - No commit enforcement
"Fix C7: Implement New Task modal"

# GOOD - Explicit commit requirement
"Fix C7: Implement New Task modal. "
"AFTER IMPLEMENTATION: "
"1. git add -A"
"2. git commit -m '[fix] C7: New Task modal - implement modal component, closes Issue #7'"
"3. Verify with git log --oneline -1"
"4. Only then report COMPLETE."
```

### Verification Before Phase Advance

**Before declaring phase complete:**

```bash
# Check claimed vs actual
for issue in C1 C2 C3 C4 C5 C6 C7 H1 H2 H3 H8 H9; do
    echo "=== $issue ==="
    git log --all --oneline --grep="$issue" | head -1 || echo "❌ NOT FOUND"
done
```

## Documentation in Skills

When creating agent skills, add this validation step:

```markdown
## Execution Protocol

### After Implementation

**CRITICAL - Verify commit exists:**
```bash
# Check git log
git log --oneline -3

# If no commit with issue reference, DO NOT report complete
# Instead: git add -A && git commit -m "[category] Issue-N: Description, closes #N"
```

### Completion Verification

Before reporting "DONE":
- [ ] Code changes implemented
- [ ] Tests pass (if applicable)
- [ ] **git commit executed with closes #N**
- [ ] Commit visible in git log
```

## Session Recovery Example

**From actual session (May 15-16, 2026):**

**Claimed Complete:**
- C7: New Task modal (@forgemaster)
- H9: Orphaned Start button (@prism)
- C4: Ask Kiri form (@prism)

**Git Audit Revealed:**
- ❌ C7: NO COMMIT FOUND
- ❌ H9: NO COMMIT FOUND  
- ❌ C4: NO COMMIT FOUND

**Recovery:**
- Dispatched @chronicle to recover audit commit
- Found work in `c19822c6 [audit] H9 + uncommitted Phase 2 work`
- Verified partial implementation
- Marked as partial completion

**Lesson:** Always verify commits exist before trusting "DONE" status.

---

## Verification Protocol for "What About X?" Queries

**Scenario:** User asks about prior work ("What about the orchestration project last night?")

### Critical Mistake: Reporting from Memory vs Git

**❌ WRONG - Reporting last known state without checking:**
```
User: "What about the orchestration project last night?"
Agent: "Let me check session memory..."
# Agent reports from SESSION memory, not git state
# Result: May report "21+ issues resolved" based on agent claims
# BUT git shows only 4 commits
```

**✅ CORRECT - Verify git before any status report:**
```python
# 1. Check current git state FIRST
git log --oneline -10
git status --short
git branch --show-current

# 2. Count actual commits by issue
git log --oneline --all --grep="C7\|H9\|C4" | wc -l

# 3. Report THE TRUTH from git, not agent claims
```

### Verification Command Stack

**When user references prior work, run in this order:**

```bash
# 1. Current branch and state
git branch --show-current
git status --short

# 2. Recent commits with context
git log --pretty=format:"%h [%aN] %s" --all -10

# 3. Issue-specific audit (if applicable)
git log --oneline --all --grep="ISSUE-REF" -20

# 4. Push status check
git cherry -v origin/main  # Shows unpushed commits
```

### Pattern: Session Continuation Verification

**When user resumes work after sleep/away time:**

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `git log --oneline -5 --date=local --format="%h %ad %s"` | Check last activity timestamp |
| 2 | `git log --oneline --since="yesterday"` | All commits since user left |
| 3 | `ls -la <project-path>/` | Check for new files/directories |
| 4 | `cat docs/*.md 2>/dev/null` | Read any status/update files |

**Only after verification:** Compare against user's last known state

### Pitfall: Agent Output ≠ Commit

**The dangerous assumption:** Agent says "DONE" → Work is in git

**Reality:** Agent output =/= git commit. Work may exist in:
- Agent session transcript only
- Working directory, uncommitted
- Local branch not pushed
- Actually committed (what we want)

**Verification chain:**
1. Agent reports "DONE" → Suspicious
2. Working directory shows changes → Incomplete
3. Local commit exists → Better
4. Commit pushed to origin → ✅ Verified

---

## Morning After Recovery Pattern

**When user returns after sleep:**

### 1. Immediate Git State Check
```bash
cd /path/to/repo
git log --oneline -5 --date=short --format="%h %ad %s"
git status --short
git branch -a | grep "^\*"
```

### 2. Issue Cross-Reference
```bash
# Check for claimed-but-missing work
curl -s https://api.github.com/repos/<owner>/<repo>/issues \
  | jq -r '.[] | select(.state == "open") | "\(.number): \(.title)"' 2>/dev/null \
  || echo "GitHub CLI: gh issue list --limit 50"
```

### 3. External State Discovery
```bash
# Check auxiliary state files
ls -la ~/kirimvp_orchestration/ 2>/dev/null
ls -la docs/GIT_PUSH_LOG.md 2>/dev/null
cat docs/GIT_PUSH_LOG.md 2>/dev/null
```

### 4. Report Truth
```
"Morning sync on <project>:
- Branch: <branch>
- Last commit: <hash> '<msg>'
- Claimed complete: X issues
- Actually committed: Y issues
- Delta: Z issues (agent reported done but no commits found)"
```

## Session Recovery Example v2

**May 16, 2026 Morning Session:**

**User:** "What about the orchestration project last night?"

**Agent Memory (2:18 AM update):**
- "21+/36 issues resolved (~70% verified)"
- "Phases 1-2 complete, 3-4 in progress"
- "Production-ready container"

**Git Reality Check:**
```bash
git log --oneline -5
# 21e496f [performance] H4: Dockerfile + healthcheck  ✅
# db8ad9f chore: initialize fix/security-critical-issues branch
# 8f5ef27 feat: Kiri distribution structure with submodules  
# Initial commit

git log --oneline --all --grep="C7\|H9\|C4" 
# (no output - issues claimed but not committed)

cat docs/GIT_PUSH_LOG.md
# "2026-05-16 00:45 UTC | 1 | FAILED | HTTPS auth missing"
```

**Reality:** H4 committed, push failed, C7/H9/C4/M13-M15 NOT in git

**Lesson:** Memory ≠ Truth. Always verify git before reporting status.

## Reference Commands

```bash
# Full audit of all claimed issues
git log --all --oneline --grep="C[1-9]\|H[1-9]\|M[1-9]" | sort | uniq

# Find orphaned work
git status --short

# Search for specific patterns
git log --all --oneline | grep -E "C7|New Task"
```
