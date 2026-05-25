---
name: build-artifact-recovery
description: Automatic capture of build artifacts with validation checkpoints and recovery metadata. Ensures built artifacts (files, dashboards, code) are trackable, validatable, and recoverable without relying on manual memory prompts or lost session context.
version: 1.1.0
tags: [build-recovery, artifact-tracking, validation-checkpoints, automatic-capture, session-bridging]
---

# Build Artifact Recovery

## The Problem

**Scenario:** Agent or human builds something (dashboard, code, config). An iteration breaks it. Session ends or context lost. The file exists but:
- ❌ No record of what "working" looked like
- ❌ No way to validate if restoration succeeded  
- ❌ No trace of build attempts or failures
- ❌ Manual "save to mempalace" forgotten or never prompted

**Result:** Working version lost. Users face degraded or unrecoverable work.

## The Solution: Artifact Tracker System

**Implementation Location:** `~/.hermes/artifact_tracker/`

### File Structure

```
~/.hermes/artifact_tracker/
├── SCHEMA.json                    # Data schema documentation
├── artifact_tracker.py            # Core Python module
├── sessions/                      # Session metadata (auto-created)
├── artifacts/                     # Artifact records (auto-created)
├── index/                         # Searchable index (auto-created)
└── hooks/                         # Integration triggers (optional)
```

### Core Module: artifact_tracker.py

```python
from artifact_tracker import ArtifactTracker

# Initialize tracker
tracker = ArtifactTracker()

# Start tracking a session
session_id = tracker.start_session()

# Log file creation
tracker.log_file_created(session_id, "~/dashboard.html", "8-module dashboard")

# Log agent spawn
tracker.log_agent_spawned(session_id, "ui-designer", "create dashboard", job_id)

# Log validation checkpoint
tracker.log_validation(session_id, artifact_id, "ui_tests", passed=True)

# End session
tracker.end_session(session_id)
```

### CLI Usage

```bash
# Start new session
~/.hermes/artifact_tracker/artifact_tracker.py start_session
# Returns: session_20260502_120536_abc123

# Log files
~/.hermes/artifact_tracker/artifact_tracker.py log_file \
    session_20260502_120536_abc123 \
    ~/command_center/command-center.html \
    "Agent Framework dashboard"

# Log agents
~/.hermes/artifact_tracker/artifact_tracker.py log_agent \
    session_20260502_120536_abc123 \
    ui-designer \
    "Build dashboard" \
    job_8abbbb9f409c

# Search history
~/.hermes/artifact_tracker/artifact_tracker.py search "dashboard"

# Get session summary
~/.hermes/artifact_tracker/artifact_tracker.py summary session_20260502_120536_abc123

# List artifacts
~/.hermes/artifact_tracker/artifact_tracker.py artifacts session_20260502_120536_abc123

# End session
~/.hermes/artifact_tracker/artifact_tracker.py end_session session_20260502_120536_abc123
```

### Integration Hooks

```bash
# ~/.hermes/hooks/post_file_write.sh
# Automatically called after write_file operations
python3 ~/.hermes/artifact_tracker/artifact_tracker.py \
    log_file "$SESSION_ID" "$FILE_PATH" "auto"

# ~/.hermes/hooks/post_agent_spawn.sh
# Automatically called after delegate_task spawns agent
python3 ~/.hermes/artifact_tracker/artifact_tracker.py \
    log_agent "$SESSION_ID" "$AGENT_NAME" "$TASK" "$JOB_ID"
```

## What Gets Captured

| Capture Type | Trigger | Stored | Size |
|--------------|---------|--------|------|
| **File creation** | `write_file()` | Metadata (path, size, checksum) | ~500 bytes |
| **Agent spawn** | `delegate_task()` | Job ID, task, status | ~300 bytes |
| **Validation** | Manual/user call | Pass/fail, details | ~200 bytes |
| **Session** | Start/end | Links to all artifacts | ~1KB |

**Total per session:** ~2KB (negligible vs MemPalace)

## Session Bridging Architecture

```
Three-Tier System (Connected):

┌─────────────────────────────────────────────────────────────┐
│  TIER 1: Session Transcript                                  │
│  ~/.hermes/sessions/session_*.json                          │
│  Contains: Chat history, tool calls                         │
│  Use for: "What did we discuss?"                            │
├─────────────────────────────────────────────────────────────┤
│  TIER 2: Artifact Tracker (BRIDGE) ← NEW                    │
│  ~/.hermes/artifact_tracker/                                │
│  Contains: File metadata, agent records, validation states  │
│  Use for: "What files were created?" "Can I recover?"       │
├─────────────────────────────────────────────────────────────┤
│  TIER 3: MemPalace (Strategic Knowledge)                    │
│  palace=<various>                                           │
│  Contains: "Why did we build this?" design decisions        │
│  Use for: "What's the strategy?" "Why this approach?"      │
└─────────────────────────────────────────────────────────────┘

Connections:
  Session → Artifact: "Created during this chat"
  Artifact → MemPalace: "Saved as important fact [link]"
  MemPalace → File: "File at ~/path.txt"
```

## Recovery Procedures

### File Recovery Workflow

```
1. "Dashboard broke, help!"
   └── artifact_tracker.py search "dashboard"
   
2. Results:
   ├── Session: 2026-05-01 (command-center.html created)
   ├── Validation: WORKING checkpoint at 10:47 PM
   └── Validation: FAILED at 11:30 PM (current)

3. Options:
   ├── [Y] Restore to 10:47 PM checkpoint
   ├── [d] Show diff between versions
   └── [n] Keep broken for manual fix

4. Restore: cp backup_file current_file

5. Verify: Run validation tests

6. Confirm: "Restored to working checkpoint 10:47 PM"
```

### Session Recovery Workflow

```
1. "What did we build last Tuesday?"
   └── artifact_tracker.py search --date 2026-04-29

2. Results:
   ├── Session: 2026-04-29 (2 hours)
   ├── Artifacts:
   │   ├── dashboard.html (134KB)
   │   ├── api_client.py (4KB)
   │   └── tests/ (12 files)
   └── MemPalace links: 3 facts

3. Navigate:
   ├── View files: ls ~/command_center/
   ├── Read context: cat ~/.hermes/artifact_tracker/sessions/*.json
   └── Strategic why: mempalace_search "why dashboard built"
```

## Comparison: Before vs After

### Before Artifact Tracker (Option C - Sparse Memory)

```
Build dashboard:
├── File created: ~/command_center/command-center.html ✅
├── Chat happened: sessions/*.json ✅ (temporary)
└── MemPalace save: ❌ (forgot to prompt)

Two days later:
"What did we build?"
├── Search sessions: "dashboard..." → Found chat ✅
├── File exists: ls → Yes ✅
└── Context: "Why? Validation status?" → ❌ LOST
```

### After Artifact Tracker (Option B - Hybrid)

```
Build dashboard:
├── File created: ~/command_center/command-center.html ✅
├── Artifact tracked: metadata auto-saved ✅
├── Chat happened: sessions/*.json ✅
└── MemPalace save: "This is important" ✅ (your prompt)

Two days later:
"What did we build?"
├── artifact_tracker search "dashboard"
│   ├── File: command-center.html
│   ├── Status: WORKING (validated)
│   └── Validation: 10:47 PM checkpoint
├── MemPalace link: "Why we built Linear aesthetic"
└── Recovery: Possible if needed ✅
```

## Integration with Existing Skills

| Skill | Role with Artifact Tracker |
|-------|---------------------------|
| `system-architecture` | Explains three-tier storage (filesystem ↔ tracker ↔ MemPalace) |
| `system-integrity-guardrails` | Prevents bad modifications; tracker captures what got through |
| `mempalace-palace-connections` | Tracker links to MemPalace facts via references |

## Implementation Example

### Test the Tracker

```bash
# Start tracking
SESSION_ID=$(~/.hermes/artifact_tracker/artifact_tracker.py start_session)
echo "Session: $SESSION_ID"

# Simulate file creation
~/.hermes/artifact_tracker/artifact_tracker.py log_file \
    "$SESSION_ID" \
    ~/test_file.txt \
    "Test artifact"

# Simulate agent spawn
~/.hermes/artifact_tracker/artifact_tracker.py log_agent \
    "$SESSION_ID" \
    "test-agent" \
    "Run test" \
    "job_test_001"

# End session
~/.hermes/artifact_tracker/artifact_tracker.py end_session "$SESSION_ID"

# Query
~/.hermes/artifact_tracker/artifact_tracker.py summary "$SESSION_ID"
```

## Version History

v1.1.0 - Actual implementation with artifact_tracker.py (2026-05-02)  
v1.0.0 - Theoretical specification of build artifact recovery

## Automatic Capture Mechanism

### Tier 1: Automatic (No Prompt)

```python
# Triggers automatic capture:
write_file(path=..., content=...)  # if >100 lines
skill_manage(action='create', ...)  # always
delegate_task returns successfully  # artifact + result

Capture metadata:
- file_path, size, checksum
- builder (user or agent name)
- timestamp
- purpose (inferred from context)
- validation status (pending)
```

### Tier 2: Validation Checkpoint (User Confirms)

```python
# After explicit validation:
validation_result = test_dashboard()  # returns True/False

if validation_result:
    mempalace_save(
        palace='build_recovery',
        wing='artifacts',
        hall='validation',
        room='checkpoints',
        closet=f"{file_name}_v{version}",
        content=f"""
            VALIDATION CHECKPOINT
            File: {file_path}
            Status: WORKING
            Time: {timestamp}
            Tests: {test_results}
            Signature: {checksum}
            
            To restore: {recovery_command}
        """,
        importance=4  # High - recovery critical
    )
```

### Tier 3: Emergency Recovery (Automatic Rollback)

```python
# Check if current version broken
if validation_fails:
    # Find last valid checkpoint
    last_valid = mempalace_search(
        query=f"{file_name} WORKING checkpoint",
        palace='build_recovery',
        limit=1
    )
    
    # Auto-restore option
    if user_approves or auto_recovery_enabled:
        restore_from_checkpoint(last_valid)
        verify_restored_version()
```

## Recovery Procedures

### File-Level Recovery

```
Something broke:
  ├── Query build_recovery palace for file history
  ├── Find last "WORKING" checkpoint
  ├── Show user: "Last valid: [timestamp], [reason]"
  ├── Restore options:
  │   ├── [Y] Restore to checkpoint
  │   ├── [n] Keep broken, manual fix
  │   └── [d] Show diff between broken and valid
  └── Verify after restore
```

### Session-Level Recovery

```
Session ended, work unknown:
  ├── Query: "What was built in last session?"
  ├── Build_recovery palace returns:
  │   ├── Files created
  │   ├── Validation states
  │   └── Recovery procedures
  └── User can navigate: "Show me the dashboard"
```

## Integration with Existing Systems

### Works With (Doesn't Replace):

| System | Role | How They Combine |
|--------|------|------------------|
| **Filesystem** | Stores actual files | build_recovery stores metadata pointing to files |
| **MemPalace** | Knowledge repository | build_recovery is just another palace |
| **Tiered Guardrails** | Prevents bad saves | build_recovery captures what got THROUGH guardrails |
| **System Integrity** | Monitors health | build_recovery provides audit trail |
| **Manual Prompts** | Strategic saves | build_recovery handles tactical saves automatically |

### Not Design Violation, Extension

```
Hermes/MemPalace design:
  ┌─────────────────────────────┐
  │  Intentional curation >       │
  │  automatic capture            │
  │  (only importance >= 3)       │
  └─────────────────────────────┘

build_recovery extension:
  ┌─────────────────────────────┐
  │  Automatic safety capture     │
  │  for production reliability   │
  │  (importance 3-4)             │
  │  + intentional strategic      │
  │  saves (importance 5)         │
  └─────────────────────────────┘
```

## Usage Examples

### Dashboard Build Scenario

```
User: "Build me a dashboard"
  ↓
Hermes: Creates 134KB HTML file
  ↓
Auto-capture to build_recovery:
  ├── "Created command-center.html (134KB)"
  ├── "Builder: hermes-agent"  
  ├── "Purpose: 8-module Agent Framework dashboard"
  └── Validation: pending
  ↓
Later: "Add interactivity"
  ↓
Hermes: Patches file
  ↓
Auto-capture: "Modified +1,127 lines"
  ↓
User: "Test it"
  ↓
Validation: ❌ Broken
  ↓
Query build_recovery: "Last working version?"
  ↓
Result: "Working at 10:47 PM (before patch)"
  ↓
Restore: ✅ Dashboard recovered
```

### Agent Delegation Scenario

```
User: "Delegate to agent to build API"
  ↓
Agent: works, creates files
  ↓
Auto-capture per file:
  ├── api.py created
  ├── tests.py created
  └── validation: pending
  ↓
Agent: Returns success
  ↓
Auto-capture completion:
  └── "Agent job completed, 3 files"
  ↓
User: "Test it"
  ↓
If broken → Query build_recovery for agent artifacts
  └── Restore to pre-agent state if needed
```

## Implementation

### Automatic Capture Trigger

```python
# Wrapper around write_file
def write_file_with_recovery(path, content, purpose=None):
    # Original write
    write_file(path=path, content=content)
    
    # Auto-capture if significant
    if len(content) > 100:  # Threshold
        mempalace_save(
            palace='build_recovery',
            wing='artifacts',
            hall='files',
            room=Path(path).stem,
            closet='auto_capture',
            content=f"""
                FILE CAPTURE
                Path: {path}
                Size: {len(content)} chars
                Purpose: {purpose or 'inferred'}
                Timestamp: {datetime.now()}
            """,
            importance=3  # Auto-captured
        )
```

### Validation Checkpoint

```python
def validate_and_checkpoint(file_path, test_func):
    result = test_func()
    
    mempalace_save(
        palace='build_recovery',
        wing='artifacts',
        hall='validation',
        room=Path(file_path).stem,
        closet=f'checkpoint_{datetime.now().isoformat()}',
        content=f"""
            VALIDATION: {'PASS' if result else 'FAIL'}
            File: {file_path}
            Time: {datetime.now()}
            
            {'To restore this working version:' if result else 'Previous checkpoint recommended'}
            - File: {file_path}
            - Last known good: [see previous checkpoint]
        """,
        importance=4 if result else 2
    )
    
    return result
```

## Emergency Recovery

### Full Recovery Workflow

```
DISASTER: Dashboard broken, user "what do I do?"
  │
  ├── 1. Query: "What was the last working dashboard?"
  │     └── build_recovery returns checkpoint
  │
  ├── 2. Show options:
  │     ├── [Restore] to checkpoint (safe)
  │     ├── [Diff] Show changes (investigate)
  │     └── [History] All attempts (audit)
  │
  ├── 3. User selects restore
  │     └── Copy checkpoint file over broken
  │
  ├── 4. Verify restoration
  │     └── Run validation tests
  │
  └── 5. Confirm recovery
        └── "Restored to working checkpoint [timestamp]"
```

## Best Practices

1. **Always validate** — Nothing in build_recovery without validation test
2. **Working = validated** — "Working" means tests pass, not "looks okay"
3. **Metadata minimal** — Just what's needed for recovery (not full content)
4. **Filesystem canonical** — MemPalace points to files, doesn't store them
5. **Tier importance** — Auto-capture = 3, Validated = 4, Strategic = 5

## Comparison to Manual Approach

| Approach | Recovery Knowledge | Risk |
|----------|-------------------|------|
| **Manual only** | "Hope I remember to ask" | High (forgotten) |
| **Hybrid (recommended)** | Auto-capture + manual strategic | Low |
| **Full auto** | Everything captured | Medium (noise) |

This skill enables **hybrid** — automatic safety net + intentional curation.

## Related Skills

- `system-integrity-guardrails` — Prevents bad modifications
- `systematic-debugging` — Fixes discovered problems  
- `system-architecture` — Explains storage model
- `mempalace-palace-connections` — Cross-palace intelligence

## Version History

v1.0.0 - Automatic build artifact recovery with validation checkpoints