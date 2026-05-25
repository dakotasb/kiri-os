# Session-Specific Learning: Agent Dispatch Syntax Failure

## Issue
Wrong command-line syntax when dispatching agents via Hermes CLI.

## Specific Context
- Date: 2026-05-16
- Attempted to dispatch `@launchpad` and `@keystone` to fix GitHub push issues and verify missing commits
- Used incorrect syntax: `hermes -p launchpad chat --message "..."`
- Should have used: `hermes -p launchpad chat -q "..." -Q`

## Root Cause
- `--message` is not a valid subcommand or flag for `hermes chat`
- Hermes interpreted the entire message as a command name
- Error: `error: argument command: invalid choice: "URGENT: GitHub push failed..."`

## Correct Syntax Pattern

```python
# WRONG - causes immediate failure
delegate_task(
    command='hermes -p launchpad chat --message "fix this"'
)

# CORRECT - validated working
delegate_task(
    command='hermes -p launchpad chat -q "fix this" -Q'
)
```

**Required flags:**
- `-q "..."` — Single query mode (non-interactive, required for background processes)
- `-Q` — Quiet mode (suppresses banner/spinner, prevents tty issues)

## Verification Pattern

Always check exit code and session_id:
```python
result = terminal(
    command="hermes -p agent chat -q 'task' -Q",
    background=True,
    notify_on_complete=True
)
# Success: {"exit_code": 0, "session_id": "proc_..."}
# Failure: {"exit_code": 2, ...}
```

## Prevention

Before dispatching any agent work:
1. Verify exact command structure
2. Don't assume flags match other CLI tools
3. Use `hermes --help` to confirm available subcommands

## Related Skills
- `agent-dispatch` — Multi-model agent dispatch patterns
- `hermes-agent` — Comprehensive CLI reference