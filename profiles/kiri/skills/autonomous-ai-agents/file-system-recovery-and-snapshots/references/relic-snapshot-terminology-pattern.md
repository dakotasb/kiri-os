# "Relic Snapshot" Terminology Pattern

## User Terminology

When user says **"relic snapshot"** or asks about **"the relic"**:

**They mean:** Snapshot created by **@relic agent**, not just "old" or "ancient" backup.

## Discovery Pattern

```bash
# "Relic" refers to @relic agent profile
ls ~/.hermes/profiles/relic/

# Check if backup was created by @relic vs other agents
# Compare with other agent backups:
ls ~/.hermes/profiles/*/backups/
ls ~/.hermes/backups/agent-merge-*/
ls /tmp/dashboard-backup-*
```

## Session Examples

### 2026-05-17 Dashboard Recovery
**User:** "Can you check to see the relic snapshot that was taken before the orchestration project started?"

**Initial Misinterpretation:** Looked for "old" snapshots by timestamp only
**Correction:** User meant specifically @relic agent's snapshot
**Location Found:** `~/snapshots/dashboard-pre-color-update/source-archive.tar.gz`
**Note:** The word "relic" was the agent name, not an adjective

## Key Checklist

When user mentions "relic":
- [ ] Search `~/.hermes/profiles/relic/` for agent-specific work
- [ ] Check if @relic was dispatched in session history
- [ ] Don't assume "relic" = "old" — verify agent context
- [ ] If unsure: "Do you mean @relic agent's backup or an old snapshot?"

## Related Patterns

- `@scope` snapshots: `~/.hermes/profiles/scope/`
- `@forge` snapshots: `~/.hermes/profiles/forge/`
- Manual snapshots: `~/snapshots/`