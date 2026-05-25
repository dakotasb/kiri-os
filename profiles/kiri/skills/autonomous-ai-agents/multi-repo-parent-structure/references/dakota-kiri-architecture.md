# Dakota's Kiri Architecture — Session Reference

**Date:** May 13, 2026  
**User:** Dakota / dakotasb  
**Project:** Kiri 35-Agent Distribution System

## The Three-Script Pattern (Dakota's Spec)

Dakota explicitly requested these three scripts for git↔runtime synchronization:

| Script | Mode | Direction | Dakota's Use Case |
|--------|------|-----------|-------------------|
| `install.sh` | Production | Git → Runtime (COPY) | Deployment, stable environments |
| `dev-mode.sh` | Development | Git ↔ Runtime (SYMLINK) | Daily development, live editing |
| `sync-from-runtime.sh` | Rescue | Runtime → Git (COPY) | Recover forgotten changes |

**Critical Distinction:**
- install.sh = "safe copies, no back-flow"
- dev-mode.sh = "live symlinks, bidirectional, DANGEROUS"
- sync-from-runtime.sh = "emergency rescue only"

Dakota prefers this three-script segregation over unified sync tools.

## Parent Repo Structure (~
/kiri/)

```
~/kiri/                              # Parent repo (git init here)
├── .git/                           # Parent git metadata
├── .gitmodules                     # 4 submodules
├── docs/
│   └── mempalace-architecture-advantages.md  # Fork analysis
├── install.sh                      # Production deploy
├── dev-mode.sh                     # Development symlinks
├── sync-from-runtime.sh            # Rescue sync
├── README.md
│
├── hermes-agent/  → submodule     # NousResearch framework
├── command_center/ → submodule    # Dashboard
├── kiri-agents/   → submodule     # 35 agent profiles
└── mempalace/     → submodule     # Qdrant+Neo4j fork
```

## .gitmodules Configuration

```ini
[submodule "hermes-agent"]
    path = hermes-agent
    url = https://github.com/NousResearch/hermes-agent.git

[submodule "command_center"]
    path = command_center
    url = /home/dakotasb/command_center

[submodule "kiri-agents"]
    path = kiri-agents
    url = /home/dakotasb/kiri-agents

[submodule "mempalace"]
    path = mempalace
    url = /home/dakotasb/mempalace
```

**Note:** Local paths (`/home/dakotasb/...`) used for private repos.
For team sharing, push to GitHub and use HTTPS/SSH URLs.

## MemPalace Fork Discovery

**Original fork:** mehmetkirkoca/MemPalace (Node.js, Qdrant+Neo4j)  
**Official:** MemPalace/mempalace (Python, ChromaDB only)

### Why Dakota's Fork is Superior for Multi-Agent

| Feature | Official | Dakota's Fork |
|---------|----------|---------------|
| Knowledge Graph | ❌ None | ✅ Full Neo4j |
| Hierarchy | 3 levels | 5 levels (Wing→Hall→Room→Closet→Drawer) |
| Language | Python | Node.js |
| MCP Support | Add-on | First-class |

**Key advantage:** Neo4j enables agent relationship queries:
- "Which agents depend on Forge?"
- "What's the critical path from palette to production?"

## Implementation Notes

### install.sh
- Copies from `kiri-agents/*` to `~/.hermes/profiles/`
- Safe for production — no back-flow risk
- Changes in runtime don't affect git

### dev-mode.sh
- Creates symlinks: `~/.hermes/profiles/agent` → `~/kiri/kiri-agents/agent`
- Dakota uses this for daily development
- **DANGER:** Deleting in runtime deletes from git
- Dakota understands this tradeoff and prefers it

### sync-from-runtime.sh
- Compares `~/.hermes/profiles/` with `~/kiri/kiri-agents/`
- Reports differences
- Copies runtime → git
- Use when changes made in hermes session

## Safety Protocols Dakota Requires

1. **Sequential execution:** Do steps in order, verify each
2. **Backup discipline:** Always backup before modifying
3. **Explicit confirmation:** Never auto-fallback on failures
4. **Tool selection:** `hermes -p agent` first, ask if it fails

## Session-Specific Issues Encountered

### MemPalace Offline
- **Docker daemon:** Not running initially
- **Containers:** mempalace-qdrant and mempalace-neo4j recovered from previous state
- **MCP Server:** Node.js stdio mode (not HTTP on 3100)
- **Resolution:** Run directly with `npm run start:mcp` (stdio mode)

### Hermes Config Gap
- **Issue:** MCP tools not wired to agents
- **Status:** main config.yaml has `mcp_servers.memlpalace.url`, but agents don't receive tools
- **Root cause:** Session dumps show ZERO `mcp_mempalace_*` tools available
- **Solution:** Need to update agent profile configs explicitly

## 35 Agents in kiri-agents/

List includes: adjunct, alloy, archivist, bastion, chronicle, codex, compass, drift, ember, forge, forgemaster, harbor, haven, hoard, horizon, keystone, launchpad, ledger, mason, mediator, palette, prism, quill, relay, relic, scale, scope, scribe, sentinel, sentry, surge, temper, vantage, vault, watcher

All use role-scoped skills, custom Ollama endpoints.

## Documentation Created

1. `~/kiri/docs/mempalace-architecture-advantages.md` — Fork analysis
2. `~/kiri/README.md` — Parent repo overview
3. `~/kiri/install.sh` — Production script
4. `~/kiri/dev-mode.sh` — Development script
5. `~/kiri/sync-from-runtime.sh` — Rescue script
6. This file — Session reference

--
Created May 13, 2026 for Dakota's Kiri system migration
