---
description: GitHub workflow skills for managing repositories, pull requests, code reviews, issues, and CI/CD pipelines using the gh CLI and git via terminal.
name: github
category: devops
tags: [github, git, version-control, collaboration, ci-cd, workflows]
---

# GitHub Workflow Skill

Manage GitHub repositories, pull requests, code reviews, issues, and workflows from the terminal.

## When to Use This Skill

- Repository management (clone, create, fork, configure)
- Pull request lifecycle (create, review, merge)
- Issue tracking (create, label, assign, close)
- Code reviews (inline comments, approvals)
- CI/CD pipeline monitoring
- Setting up GitHub authentication (HTTPS tokens, SSH keys)

## Quick Commands

### Repository Operations
```bash
# Clone a repository
git clone https://github.com/owner/repo.git

# Create a new repository on GitHub
gh repo create repo-name --public --source=.

# Fork a repository
gh repo fork owner/repo --clone=true

# View repository info
gh repo view --web
```

### Pull Request Workflow
```bash
# Create a PR from current branch
gh pr create --title "Feature: X" --body "Description..."

# Review PRs
gh pr list
gh pr checkout 123
gh pr review --approve

# Merge a PR
gh pr merge 123 --squash --delete-branch
```

### Issue Management
```bash
# Create an issue
gh issue create --title "Bug: X" --body "Description..." --label bug

# List and filter issues
gh issue list --label "help wanted" --assignee "@me"

# Close an issue
gh issue close 123
```

## Authentication Setup

### Option 1: SSH Keys (Recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "you@example.com"

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy output to GitHub → Settings → SSH Keys

# Test connection
ssh -T git@github.com
```

### Option 2: GitHub CLI Auth
```bash
# Login via browser
gh auth login

# Or token-based (for scripts)
gh auth login --with-token < <<EOF
ghp_xxxxxxxxxxxxxxxxxxxx
EOF
```

### Option 3: Personal Access Token
```bash
# Store token securely
git config --global credential.helper cache
echo "https://username:token@github.com" | git credential approve
```

## Multi-Agent Issue Management

When managing GitHub issues across multiple agents:

### Auto-Close from Commit Messages
Configure automatic issue closing when agents commit fixes:
```bash
# Extract issue number from commit message
extract_issue_from_message() {
  local msg="$1"
  # Patterns: "Fix #123", "Closes #456", "resolves #789"
  echo "$msg" | grep -oE '#[0-9]+' | sed 's/#//'
}

# Close with attribution
gh issue close $ISSUE_NUM --comment "Fixed by @AGENT_NAME in commit $COMMIT_SHA"
```

### Bulk Issue Operations
```bash
# Create multiple issues from JSON definition
jq -c '.issues[]' issues.json | while read issue; do
  title=$(echo "$issue" | jq -r '.title')
  body=$(echo "$issue" | jq -r '.body')
  labels=$(echo "$issue" | jq -r '.labels | join(",")')
  gh issue create --title "$title" --body "$body" --label "$labels"
done

# Close resolved issues with labels matching
gh issue list --label "priority/critical" --state open | \
  grep "RESOLVED" | awk '{print $1}' | \
  xargs -I {} gh issue close {} --comment "Batch close - resolved"
```

### Duplicate Detection & Cleanup
**Warning:** Multiple agent runs can create duplicate issues.

```bash
# Find duplicate titles
grep "^## " issue_registry.md | sort | uniq -d

# Close duplicates keeping first instance
for dup in $(gh issue list --search "duplicate" --json number,title | jq -r '.[] | "\(.number):\(.title)"'); do
  num=$(echo "$dup" | cut -d: -f1)
  gh issue close "$num" --comment "Duplicate - closing in favor of original"
done
```

## Multi-Repo Verification with Submodules

When orchestration spans multiple repositories:

**The Submodule Initialization Trap:**
- `.gitmodules` defines submodules but they're NOT automatically initialized
- Commits in submodule appear "missing" from parent repo perspective
- Always check: `git submodule status` (empty = not initialized)

**Verification Protocol:**
```bash
# Check if submodules are actually initialized
cd parent-repo && git submodule status
# Should show: hash path (branch)
# If empty: git submodule update --init --recursive

# Verify commits exist across submodule boundary
cd parent-repo && git log --oneline  # only shows parent commits
cd submodule-path && git log --oneline  # shows actual commits

# After init, parent sees submodule as a single gitlink commit
# The full history is in the submodule directory
```

**Cross-Repo Commit Archaeology:**
1. Check `.gitmodules` for defined submodules
2. Verify initialization status
3. If commits "missing" from parent repo, check standalone submodule repo
4. Working directory state vs. committed state are separate per-repo

## Credential Helper Configuration

When `gh auth status` shows logged in but `git push` fails:

```bash
# Git doesn't automatically use gh credentials
git config credential.helper gh
git config --global credential.helper gh  # system-wide

# Or use gh's credential helper directly
git config credential.helper '!/usr/bin/gh auth git-credential'
```

### Troubleshooting "could not read Username"

When HTTPS push fails with "No such device or address":

**Root cause:** Git credential helper not configured
**Fix:** `git config credential.helper gh` (uses gh's auth)
**Alternative:** Store PAT in environment: `export GITHUB_TOKEN=ghp_xxx`

## Scripts

### `scripts/auto_close_from_commits.py`
Automatically close GitHub issues from agent commit messages.

```bash
# Dry run to preview
python scripts/auto_close_from_commits.py --since "2026-05-15" --repo owner/repo

# Actually close issues
python scripts/auto_close_from_commits.py --since "2026-05-15" --repo owner/repo --dry-run

# With state tracking (prevents duplicate closes)
python scripts/auto_close_from_commits.py --since "$(cat .last_processed_commit)" --repo owner/repo
```

**Integration:** Add to cron or Discord bot for automatic issue lifecycle management.

## References

- `references/wsl-git-gui-paths.md` - Handling WSL/Windows path translation
- `references/multi-agent-issue-management.md` - Automated issue lifecycle with agents
