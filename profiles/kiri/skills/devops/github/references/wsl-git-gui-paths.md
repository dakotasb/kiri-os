# WSL Path Translation for Git GUI Tools

Reference for handling path translation between WSL (Unix) and Windows Git GUI tools.

## The Problem

GitHub Desktop (Windows app) cannot directly access WSL filesystem paths:
- ❌ `~/kiri/` - Tilde expansion failure
- ❌ `/home/dakotasb/kiri/` - Windows apps don't understand WSL mount
- ❌ `C:\Users\...\kiri` - Wrong location (WSL files aren't accessible here)

## Solutions

### Option 1: UNC Path (Recommended for GitHub Desktop)

Windows can access WSL via network share:
```
\\\\wsl$\\Ubuntu\\home\\dakotasb\\kiri\\
```

Or in GitHub Desktop's "Local path" field:
```
\\wsl$\Ubuntu\home\dakotasb\kiri\
```

**Note:** Works but path handling can be wonky with git operations.

### Option 2: Clone From Remote (Most Reliable)

Instead of "Add local repository", use "Clone from Internet":
1. Select `dakotasb/Kiri` from your GitHub repos
2. Clone to Windows path: `C:\Users\dakotasb\Documents\kiri`
3. **Result:** Two separate copies (manage independently)

### Option 3: Use VS Code with WSL Extension (Recommended)

Best of both worlds:
```bash
# In WSL
cd ~/kiri
code .  # Opens VS Code connected to WSL
```

VS Code's Git UI works seamlessly with WSL paths.

### Option 4: Terminal Git Only (Simplest)

Skip GUI entirely:
```bash
cd ~/kiri
git status
git commit
git push
```

## Key Insight

**WSL and Windows have separate filesystem namespaces.** When a Windows app shows:
> "This directory does not appear to be a Git repository"

It usually means the path is inaccessible, not that git isn't initialized.

## Authentication Note

When pushing from WSL to GitHub, credentials may need separate configuration:
```bash
# Option A: Use git credential helper
git config --global credential.helper cache

# Option B: SSH keys (preferred)
cat ~/.ssh/id_rsa.pub  # Add to GitHub
```

## Workflow Recommendation

For WSL users with complex repos:
1. **Primary work:** Terminal in WSL (`~/kiri/`)
2. **Review changes:** VS Code with WSL extension
3. **Push to GitHub:** Terminal (`git push`)
4. **Web management:** GitHub.com (not Desktop for WSL paths)

## References

- Session: 2026-05-14, dakotasb/Kiri setup
- User environment: WSL2 (Windows Subsystem for Linux)
- Failed attempts: GitHub Desktop couldn't access `/home/dakotasb/kiri/`
