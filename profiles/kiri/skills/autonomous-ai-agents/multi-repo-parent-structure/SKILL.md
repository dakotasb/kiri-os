---
name: multi-repo-parent-structure
description: Manage multi-repo agent systems using git submodules with parent/child repo structure. Covers local-path submodules, install scripts (copy vs symlink modes), and bidirectional sync workflows for agent fleets distributed across multiple repositories.
triggers:
  - "bundle repos into parent"
  - "parent repo with submodules"
  - "git submodules for agent distribution"
  - "symlink vs copy for agent development"
  - "sync runtime changes back to git"
  - "install.sh dev-mode.sh sync-from-runtime.sh"
  - "agent fleet distribution"
  - "multiple git repos one install"
  - "hermes profiles in git submodules"
tags: [git-submodules, agent-distribution, multi-repo, parent-repo, symlink-pattern, dev-mode]
version: 1.0.0
---

# Multi-Repo Parent Structure for Agent Fleets

Manage agent systems distributed across multiple git repositories using a parent repo with submodules and bidirectional sync scripts.

## When To Use

- Agent profiles live in separate repo from framework code
- Multiple components (hermes-agent, mempalace, dashboard) need coordinated versioning
- Need both "safe copy" (production) and "live edit" (development) workflows
- Runtime state (`~/.hermes/`) must sync bidirectionally with git repositories

## Architecture

```
~/kiri/ (parent repo)
├── .gitmodules                   # Submodule definitions
├── .git/                        # Parent git state
├── install.sh                   # Production: copy to ~/.hermes/
├── dev-mode.sh                  # Development: symlinks to ~/.hermes/
├── sync-from-runtime.sh         # Rescue: ~/.hermes/ → git
├── README.md                    # Setup instructions
│
├── hermes-agent/ → submodule    # Framework source
├── command_center/ → submodule # Dashboard project
├── kiri-agents/ → submodule     # 35 agent profiles
└── mempalace/ → submodule       # Memory system
```

## Submodules Configuration

### .gitmodules with Local Paths

```ini
[submodule "hermes-agent"]
    path = hermes-agent
    url = https://github.com/NousResearch/hermes-agent.git

[submodule "command_center"]
    path = command_center
    url = /home/user/command_center

[submodule "kiri-agents"]
    path = kiri-agents
    url = /home/user/kiri-agents

[submodule "mempalace"]
    path = mempalace
    url = /home/user/mempalace
```

**Note:** Local paths (`/home/user/...`) work for purely local development. For team sharing, push to GitHub and use HTTPS/SSH URLs.

## Dakota's Three-Script Pattern

**User Preference Note:** Dakota (dakotasb) requires these three scripts by name and behavior. The pattern is: install for production (copies), dev-mode for daily development (symlinks), sync-from-runtime for rescue operations. Sequential verification preferred over parallel changes.

### 1. install.sh (Production Mode)

**Purpose:** Safe deployment — copies from git to runtime, no risk of git corruption.

**Behavior:**
- Copies `kiri-agents/*` to `~/.hermes/profiles/`
- Framework remains at submodule path
- Runtime edits don't affect git

**Workflow:**
```bash
cd ~/kiri
./install.sh        # Deploy to ~/.hermes/
# Edit ~/.hermes/profiles/horizon/SOUL.md
hermes -p horizon   # Test changes
# Changes stay local
```

**Implementation:**
```bash
#!/bin/bash
# install.sh - Copy mode (safe)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HUMANS_DIR="$HOME/.hermes"

echo "Deploying agents from kiri-agents..."
cp -r "$SCRIPT_DIR/kiri-agents/"* "$HUMANS_DIR/profiles/"

echo "Done. Runtime is independent from git."
echo "Edit ~/.hermes/profiles/ for changes."
```

### 2. dev-mode.sh (Development Mode)

**Purpose:** Live editing — changes in either location reflect immediately.

**Behavior:**
- Creates **symlinks** from `~/.hermes/profiles/agent` → `~/kiri/kiri-agents/agent`
- Edit in `~/.hermes/profiles/horizon/SOUL.md` → Updates git repo
- `git commit` in `~/kiri/kiri-agents/` → Updates running agent

**⚠️ DANGER:** Deleting `~/.hermes/profiles/horizon/` deletes from git too!

**Workflow:**
```bash
cd ~/kiri
./dev-mode.sh                     # Setup symlinks
# Edit ~/.hermes/profiles/horizon/SOUL.md
# Same edit happens in ~/kiri/kiri-agents/horizon/SOUL.md
git add -A && git commit -m "fix: horizon role"
git push                          # Backup immediately
```

**Implementation:**
```bash
#!/bin/bash
# dev-mode.sh - Symlink mode (dangerous but convenient)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HUMANS_DIR="$HOME/.hermes"

# Backup existing profiles
BACKUP_DIR="$HUMANS_DIR/profiles-backup-$(date +%Y%m%d_%H%M%S)"
if [ -d "$HUMANS_DIR/profiles" ]; then
    mv "$HUMANS_DIR/profiles" "$BACKUP_DIR"
    echo "Backed up to: $BACKUP_DIR"
fi

# Create parent directory
mkdir -p "$HUMANS_DIR/profiles"

# Symlink each agent from git to runtime
cd "$SCRIPT_DIR/kiri-agents"
for agent in */; do
    agent="${agent%/}"
    ln -s "$SCRIPT_DIR/kiri-agents/$agent" "$HUMANS_DIR/profiles/$agent"
done

echo "Dev mode active!"
echo "Changes sync in both directions."
echo "⚠️  Don't delete ~/.hermes/profiles/ entries!"
```

### 3. sync-from-runtime.sh (Rescue Mode)

**Purpose:** Recover changes made in runtime (forgot to use git).

**When to use:**
- Edited agents during `hermes` session
- Realized changes aren't in git
- Need to commit those changes

**Behavior:**
- Compares `~/.hermes/profiles/` with `~/kiri/kiri-agents/`
- Copies differing files back to git
- Reports which agents changed

**Workflow:**
```bash
# After editing in hermes session...
cd ~/kiri
./sync-from-runtime.sh              # Copy changes to git
cd kiri-agents
git add -A
git commit -m "feat: recovered from runtime"
git push
```

**Implementation:**
```bash
#!/bin/bash
# sync-from-runtime.sh - Rescue mode

HUMANS_DIR="$HOME/.hermes"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Comparing ~/.hermes/profiles/ with git..."

CHANGED=0
for agent_path in "$HUMANS_DIR/profiles"/*/; do
    agent=$(basename "$agent_path")
    
    # Skip if not in git
    if [ ! -d "$SCRIPT_DIR/kiri-agents/$agent" ]; then
        mkdir -p "$SCRIPT_DIR/kiri-agents/$agent"
        cp -r "$agent_path/"* "$SCRIPT_DIR/kiri-agents/$agent/"
        echo "NEW: $agent"
        CHANGED=$((CHANGED + 1))
        continue
    fi
    
    # Check for differences
    if ! diff -q "$agent_path/SOUL.md" "$SCRIPT_DIR/kiri-agents/$agent/SOUL.md" >/dev/null 2>&1; then
        cp "$agent_path/SOUL.md" "$SCRIPT_DIR/kiri-agents/$agent/SOUL.md"
        echo "CHANGED: $agent/SOUL.md"
        CHANGED=$((CHANGED + 1))
    fi
done

if [ $CHANGED -eq 0 ]; then
    echo "No changes detected."
else
    echo "Synced $CHANGED agent(s). Next: git commit && git push"
fi
```

## Script Selection Guide

| Mode | Command | Changes in Runtime | Changes in Git | When to Use |
|------|---------|-------------------|----------------|-------------|
| **Production** | `./install.sh` | Don't affect git | Don't affect runtime | Stable deployments, testing |
| **Development** | `./dev-mode.sh` | Update git immediately | Update runtime immediately | Daily development |
| **Rescue** | `./sync-from-runtime.sh` | Copied to git | - | Forgot to commit, emergency recovery |

## Setup Procedure

### 1. Initialize Parent Repo

```bash
mkdir ~/kiri && cd ~/kiri
git init

# Create .gitmodules
cat > .gitmodules << 'EOF'
[submodule "hermes-agent"]
    path = hermes-agent
    url = https://github.com/NousResearch/hermes-agent.git
[submodule "kiri-agents"]
    path = kiri-agents
    url = /home/user/kiri-agents
EOF

# Initialize submodules
git submodule update --init --recursive
```

### 2. Create Scripts

See Implementation sections above. Make executable:
```bash
chmod +x install.sh dev-mode.sh sync-from-runtime.sh
```

### 3. First-Time Setup

```bash
cd ~/kiri
./install.sh           # Deploy agents
hermes profile list    # Verify 35 agents available
```

### 4. Daily Development

```bash
# Option A: Dev mode (recommended for active development)
./dev-mode.sh

# Edit files → Changes sync both ways
git commit -m "updates"
git push

# Option B: Production mode (for stable systems)
./install.sh

# Edit in ~/.hermes/profiles/
# Periodically sync back:
./sync-from-runtime.sh
cd kiri-agents && git commit -m "sync"
```

## Troubleshooting

### Submodule Shows "Not a git repository"

```bash
# Re-initialize
git submodule update --init --force
```

---

### Commits "Missing" in Parent Repo (Submodules Not Initialized)

**The Silent Failure:** Submodules defined in `.gitmodules` but **never initialized** via `git submodule update --init`.

**Symptoms:**
- Child repo (`~/command_center/`) has 20+ commits with actual work
- Parent repo (`~/kiri/`) shows only 2-3 commits, missing all child work
- `git log --oneline` in parent doesn't show child repo commits
- Claims like "21/36 issues resolved" appear false when checked against parent git log
- `git submodule status` returns **nothing** (empty output)

**Root Cause:**
`.gitmodules` exists and defines the submodule path, but git never cloned/populated it:
```ini
[submodule "command_center"]
    path = command_center
    url = /home/user/command_center
```
The child repo exists at `/home/user/command_center/` with real commits, but `~/kiri/command_center` directory is empty or non-existent.

**Verification:**
```bash
cd ~/kiri

# Check if submodules are actually initialized
git submodule status
# ❌ Empty or shows commit hashes?
# Empty = Not initialized
# Shows hashes (e.g., "d67087d2... command_center") = Initialized

# Check if submodule directory exists and has content
ls -la command_center/
# ❌ Directory missing or empty = Not initialized
```

**The Fix:**
```bash
cd ~/kiri

# Initialize all submodules
git submodule update --init --recursive

# Or initialize specific submodule
git submodule update --init command_center

# Verify: Should now show commit hashes
git submodule status
# command_center d67087d2e169cc90747fd5ea8dcb1c814d11e33a (heads/fix/polish-remaining)
```

**After Initialization:**
- Parent repo `git log` still shows only parent commits (normal)
- But `command_center/` directory now exists with all child repo commits
- `git submodule status` shows the tracked commit
- Child repo work is now accessible and linked

**Push Implications:**
After initializing locally, you must push the parent repo so the submodule reference is recorded:
```bash
cd ~/kiri
git add command_center/  # Records the submodule at current commit
git commit -m "[submodule] Initialize command_center with all fixes"
git push origin main
```

**Prevention:**
Always initialize submodules after cloning a parent repo:
```bash
git clone --recursive https://github.com/user/kiri.git  # Includes --recursive
cd kiri
# OR if already cloned:
git submodule update --init --recursive
```

**Real-World Impact:**
- False "progress reports" claiming 21/36 fixes when only 2-3 parent commits exist
- Wasted hours debugging "missing" commits that were in child repo all along
- Git push failures because parent doesn't know about child repo commits
- Orchestration confusion: agents committed to child repo, parent repo appeared empty

**Memory Hook:** 
> "I see commits in the child repo but git log in parent shows them missing" → Check `git submodule status`, likely not initialized.

### Symlinks Broken After Move

```bash
# If you moved ~/kiri/, symlinks break
# Fix: Re-run dev-mode.sh
rm -rf ~/.hermes/profiles
./dev-mode.sh
```

### Permission Denied on Scripts

```bash
chmod +x ~/kiri/*.sh
```

### Changes Not Syncing (Dev Mode)

Check if symlink exists:
```bash
ls -la ~/.hermes/profiles/horizon
# Should show: -> /home/user/kiri/kiri-agents/horizon

# If not, re-run dev-mode.sh
```

## Patterns to Avoid

### ❌ Don't: Mix Copy and Symlink Mode

```bash
./install.sh         # Copies files
./dev-mode.sh        # Now creates symlinks over copies
# → Confusion: Which mode are you in?
```

**Fix:** Pick one mode per workflow. If switching, clear profiles first:
```bash
rm -rf ~/.hermes/profiles
./dev-mode.sh
```

### ❌ Don't: Delete Symlinks Without Understanding

```bash
rm -rf ~/.hermes/profiles/horizon  # If in dev-mode, DELETES FROM GIT!
```

**Fix:** Check first:
```bash
ls -la ~/.hermes/profiles/horizon  # If shows "->", it's a symlink
```

### ❌ Don't: Forget to Commit in Dev Mode

In dev-mode, changes appear in git immediately, but you still must:
```bash
git add -A && git commit -m "fix: updates"
git push  # Critical for backup!
```

## Migration from Single Repo

If you have agents in `~/.hermes/profiles/` but no git repo:

```bash
# Create kiri-agents repo
mkdir ~/kiri-agents && cd ~/kiri-agents
git init

# Copy existing agents
cp -r ~/.hermes/profiles/*/ ./
git add -A && git commit -m "Initial commit"

# Now set up parent repo as above
```

## Team Workflow

### Individual Developer
```bash
git clone --recursive https://github.com/user/kiri.git ~/kiri
cd ~/kiri
./dev-mode.sh  # Daily development
```

### CI/CD Deployment
```bash
git clone --recursive https://github.com/user/kiri.git ~/kiri
cd ~/kiri
./install.sh   # Production: Safe copy mode
hermes gateway  # Start production gateway
```

## Related Skills

| Skill | Use When |
|-------|----------|
| `hermes-profile-creation` | Creating individual agent profiles |
| `hermes-profile-execution` | Bulk update agent configs |
| `deploy-agent` | Spawning agents from MemPalace |
| `github-pr-workflow` | Git operations on submodules |

## Session References

- `references/submodule-initialization-failure-2026-05-16.md` — Real-world case where uninitialized submodules caused false "missing commits" reports during overnight agent orchestration sprint

---

v1.0.0 — Multi-repo parent structure with bidirectional sync