# WSL Path Handling for Multi-Repo Structure
**Session: 2026-05-14, dakotasb/Kiri setup**

## Issue: Git GUI Can't Access WSL Paths

When using GitHub Desktop with WSL-hosted repositories:
- ❌ `~/kiri/` - fails (tilde not expanded by Windows)
- ❌ `/home/dakotasb/kiri/` - fails (Windows doesn't understand WSL mount)
- ✅ UNC `\\wsl$\Ubuntu\home\dakotasb\kiri\` - works but clumsy

## User Decision Pattern

Dakota chose to **skip GitHub Desktop** and use:
1. **Terminal git** (primary) - works perfectly in WSL
2. **GitHub.com web interface** - for review
3. **NOT GitHub Desktop** - path issues too complex

## Key Learning

**For WSL users with multi-repo parent structures:**

The "parent repo with local-path submodules" pattern works great for:
- ✅ Personal workspace management
- ✅ Terminal-based git operations  
- ✅ VS Code with WSL extension

But **breaks** with:
- ❌ GitHub Desktop (can't resolve WSL paths)
- ❌ Any Windows-native Git GUI tool

**Recommendation:** Document this limitation in parent repo README.

## Absolute Path Submodules Note

Using absolute paths (like `/home/dakotasb/kiri/`) in `.gitmodules`:
- ✅ Works for single-user personal repos
- ✅ Keeps repos in place (don't have to move into parent)
- ✅ Makes sense for large projects (hermes-agent is huge)
- ❌ Not portable to other machines
- ❌ Team members need same username and paths

**Trade-off accepted** for dakotasb/Kiri personal management repo.
