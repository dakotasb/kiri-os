# Git Credential Troubleshooting

**Session:** 2026-05-16  
**Context:** Git push failed with HTTPS auth error despite `gh` CLI being authenticated

## The Problem

`gh auth status` shows authenticated, but `git push` fails with:
```
fatal: could not read Username for 'https://github.com': No such device or address
```

## Root Cause Discovery

**`gh` authentication ≠ Git authentication**

- `gh` (GitHub CLI) stores its own OAuth tokens
- Git requires separate credential configuration
- The two don't automatically share credentials

## Diagnostic Commands

```bash
# Check gh auth state (works even if git doesn't)
gh auth status

# Check git credential helper
git config credential.helper

# Check for stored credentials
cat ~/.netrc
cat ~/.git-credentials
ls ~/.config/git/credentials 2>/dev/null || echo "No stored credentials"

# Check GitHub token in environment
env | grep GITHUB_TOKEN

# Check SSH keys (SSH alternative to HTTPS)
ls ~/.ssh/
cat ~/.ssh/config 2>/dev/null | grep -A2 "Host github.com"
```

## Solutions

### Option A: Use `gh` as Git credential helper

```bash
# Configure git to use gh for authentication
git config --global credential.helper gh

# Test the configuration
git push origin <branch>
```

**Note:** This only works if `gh` has a valid token.

### Option B: Set GITHUB_TOKEN environment variable

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
git push origin <branch>
```

### Option C: Use credential store

```bash
# Store credentials in plain text file (less secure, but works)
git config credential.helper store

# First push will prompt for credentials and store them
git push origin <branch>
```

### Option D: Switch to SSH

```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "your@email.com"

# Add public key to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy to: github.com > Settings > SSH Keys > New

# Change remote from HTTPS to SSH
git remote set-url origin git@github.com:USERNAME/REPO.git

# Test
ssh -T git@github.com
git push origin <branch>
```

## Agent Privilege vs Reality

**Documented capability vs tested reality:**

Agent personas (e.g., `@launchpad`) may document "git push privilege" in their SOUL.md. However:
- Privileges are declared, not guaranteed
- Token may expire between sessions
- Environment credentials take precedence over persona documentation

**Always verify before claiming capability:**
```bash
# Pre-flight check
git config credential.helper || echo "No credential helper configured"
gh auth status 2>&1 | grep -q "Logged in" || echo "gh not authenticated"
```

## Key Takeaways

1. **Agent personas describe capabilities**, not current state
2. **Credential validity must be tested**, not assumed from documentation
3. **Multiple auth methods exist** — pick one and configure it explicitly
4. **HTTP 401 = token expired or invalid** — generate new credentials
5. **Prefer SSH for automation** — more reliable than OAuth tokens
