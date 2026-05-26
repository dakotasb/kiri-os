# Agent Dispatch Validation Methodology (Session 2026-05-16)

## 4-Layer Validation Approach

This methodology emerged from validating 36 Agent OS Dashboard fixes across 4 phases.

### Layer 1: Git Repository Verification
Verify commits are actually on remote, not just claimed locally.

**Commands:**
```bash
git log --oneline origin/<branch> -10
git log --oneline --all --since="10 minutes ago"
git status --short
```

**Pitfall to Avoid:** Don't trust "committed" claims - always verify remote.

### Layer 2: File Existence Audit
Dispatch agent to verify critical files exist before declaring success.

**Dispatch pattern:**
```python
terminal(
    command='hermes -p keystone chat -q "Verify these files exist: <list>. Report: present/missing" -Q',
    background=True,
    notify_on_complete=True
)
```

**Session Learning:** AskKiri component was in staging directory, not main - location mismatch not caught until Layer 2.

### Layer 3: Security Audit
Dedicated security agent validates XSS prevention, sanitization, no hardcoded secrets.

**Key files to check:**
- use-sanitized-input.tsx (XSS prevention hooks)
- AskKiri.tsx (input validation guards)
- AgentCard.tsx (Start button uses proper API calls, not eval())
- .env.example (no secrets, proper documentation)

**Session Learning:** @warden profile didn't exist - had to use @bastion as fallback.

### Layer 4: Build Verification
Run npm run build to catch TypeScript errors.

**Session Learning:** Build kept failing due to large node_modules in git history (917MB) - needed git filter-repo cleanup before build would work.

## Critical Dispatch Syntax Fix

**Session Error:** Used `--message` repeatedly (WRONG) instead of `-q` (CORRECT)

**Before (INCORRECT - causes immediate failure):**
```python
terminal(
    command='hermes -p forge --message "Fix C4: Add validation"',
    background=True,
    notify_on_complete=True
)
```

**After (CORRECT):**
```python
terminal(
    command='hermes -p forge chat -q "Fix C4: Add validation" -Q',
    background=True,
    notify_on_complete=True
)
```

**Flags:**
- `-q "..."` — Single query mode (required for background)
- `-Q` — Quiet mode (prevents tty issues)
- `chat` subcommand — Required for -q to work
- NO `--message` — This flag does NOT exist

## Staging/Mover Agent Pattern

**Problem:** Agent @prism dispatched to fix H9, but found staging directory instead of real source.

**Solution:** Stage a "mover agent" that waits then relocates work:

```python
# 1. Original dispatch (may land wrong place)
task = terminal(
    command='hermes -p prism chat -q "Fix H9: Wire Start button..." -Q',
    background=True,
    notify_on_complete=True
)  # Returns proc_17ac3b22affe

# 2. IMMEDIATELY stage mover agent
terminal(
    command='hermes -p chronicle chat -q "After proc_17ac3b22affe completes, move fix from staging → real location, commit with attribution [Agent]: @prism" -Q',
    background=True,
    notify_on_complete=True
)
```

**Result:** Fix automatically relocated when ready. Attribution shows original agent in commit message.

## Force Push Command Approval Bottleneck

**Issue:** Git force push requiring authentication approval causes agent timeouts.

**Solution Options:**
1. Manual push after agent preparation completes
2. Pre-approve safe commands
3. Use `--force-with-lease` (safer than --force)

**Session Learning:** Agent push kept timing out after 60s. Manual `git push --force-with-lease origin <branch>` worked immediately.

## Git History Cleanup Before Push

**Blocker:** Large node_modules files (>100MB) exceed GitHub's limit, blocking all pushes.

**Solution:** Git filter-repo to remove from entire history:
```bash
# Before: 917 MB, After: 73 MB
git filter-repo --path-glob 'node_modules' --invert-paths
```

**Verification:**
```bash
git log --oneline --all | head -5  # Verify history rewritten
```

**Note:** After history rewrite, commit SHAs change - must force push.
