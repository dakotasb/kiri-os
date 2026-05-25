---
name: system-integrity-guardrails
description: Safety checks and guardrails for self-modifying Agent Framework systems
version: 1.0.0
tags: [safety, guardrails, self-modification, integrity]
---

# System Integrity Guardrails

## The Risk

The Agent Framework can modify itself via:
- `skill_manage` - Overwrite/delete skills
- `mempalace_session_summary` - Save bad insights
- `delegate_task` - Spawn agents that loop/degrade
- `cronjob` - Create runaway schedules
- Filesystem writes - Corrupt critical configs

**This is self-modifying code risk** — agents can degrade the system that runs them.

## Current Safeguards (Built-in)

| Mechanism | Protection Level | Notes |
|-----------|-----------------|-------|
| `clarify()` prompts | ✅ Good for major changes | User confirmation required |
| Skill backup on modify | ⚠️ Basic | Creates `.backup_` files |
| Docker isolation | ✅ Strong | Infrastructure protected |
| User confirmation | ✅ Strong | Explicit yes/no for dangerous ops |

## Critical Gaps (Missing)

### Gap 1: No Pre-Flight Validation
**Problem:** Skill can be saved with syntax errors, breaking future loads.
**Manual Check:** Before `skill_manage`, validate SKILL.md structure.

```bash
# Pre-flight validation
grep -E "^name:|^description:|^version:" SKILL.md || echo "INVALID: Missing frontmatter"
```

### Gap 2: No Automatic Rollback
**Problem:** Broken skill stays broken until manual fix.
**Manual Check:** Test skill after modification with `skill_view()`.

```python
# Post-modification test
skill_view("modified-skill")
# If fails → restore from backup
```

### Gap 3: No Audit Trail
**Problem:** Can't trace "what agent changed what and when."
**Workaround:** Manual diary entries.

```python
mempalace_diary_write(
  agent_name="kiri",
  entry="Modified skill X: reason Y",
  session_id="current-session"
)
```

### Gap 4: No Integrity Verification
**Problem:** MemPalace can accumulate contradictions over time.
**Workaround:** Periodic audit.

```python
# Monthly integrity check
mempalace_audit(palace="agent_org")
mempalace_consolidate(palace="market_research")
```

## Manual Safeguard Procedure

### Before Allowing Agent to Self-Modify:

**Step 1: Backup Current State**
```bash
# Skills backup
tar -czf ~/.hermes/skills_backup_$(date +%s).tar.gz ~/.hermes/skills/

# MemPalace KG backup
cd ~/mempalace
docker exec mempalace-neo4j neo4j-admin dump --to=/data/kg_backup_$(date +%s).db
```

**Step 2: Identify Modification Scope**
```
Ask agent:
1. What exactly are you modifying?
2. Is it Tier 1 (userland) or Tier 2/3 (framework)?
3. What's the rollback plan?
4. How will you validate success?
```

**Step 3: Require Validation Tests**
```python
# Agent must provide:
def test_modification():
    # Load modified resource
    # Verify functionality
    # Return True/False
    pass

# Run BEFORE accepting modification
test_modification()
```

**Step 4: Monitor Post-Modification**
```python
# Check for degradation signs:
- Subsequent agent spawns failing?
- MemPalace queries returning errors?
- Skills not loading?
- Cron jobs behaving unexpectedly?
```

## Tier Classification

### Tier 1: USERLAND (Safe to Modify)
- User-created skills in `~/.hermes/skills/[category]/`
- Custom agent definitions (non-core)
- Experimental configurations
- Project-specific code

### Tier 2: FRAMEWORK (Requires Validation)
- Native skills (mempalace, cronjob, terminal)
- Agent spawning protocols
- Core coordination skills
- **Modification requires**: Backup + test + user confirm

### Tier 3: INFRASTRUCTURE (No Agent Access)
- Neo4j/Qdrant schemas
- Docker configurations
- Authentication/authorization
- **Modification**: Human-only via terminal

## Warning Signs of Degradation

| Symptom | Possible Cause | Action |
|---------|---------------|--------|
| Agent spawns failing | Corrupted skill | Rollback skill, check logs |
| MemPalace returning wrong results | Bad knowledge saved | Audit palace, invalidate facts |
| Cron jobs running amok | Bad scheduling | List and remove rogue jobs |
| Skills not loading | Syntax error | Restore from backup |
| Infinite loops | Self-referential agent | Check `process(action="list")`, kill |
| Excessive token usage | Recursion | Monitor session costs |

## Automated Safeguards (Option A - Tiered Automatic)

### Tier Structure

| Tier | Resource Type | Size Threshold | Behavior |
|------|---------------|----------------|----------|
| **Tier 1** | User skills, agent configs | < 1 MB | **Fully automatic** - No prompts, auto-backup, auto-proceed |
| **Tier 2** | Framework skills, configs | 1-50 MB | **Automatic + notification** - Backup created, notify user, proceed |
| **Tier 3** | Infrastructure (Neo4j, Docker) | > 50 MB | **Size-aware approval** - Prompt user with "skip backup" option |
| **Tier 4** | Large operations | > 500 MB | **Mandatory approval** - Warn about constraints before proceeding |

### Why Size Thresholds?

**Evidence from your system:**
- C: Drive: 91% full (11GB remaining) ⚠️
- D: Drive: 100% full (37GB remaining) 🔴
- Cloud VM defaults: Often 20-50GB

**Many users have SOME storage constraint.** Size-aware guardrails prevent filling disks unexpectedly.

### Usage

**Tiered Automatic Validation:**
```python
~/.hermes/skills/system-integrity/system-integrity-guardrails/scripts/tiered_automatic_guardrails.py \
  <resource_type> <resource_name> [action]

Examples:
  tiered_automatic_guardrails.py skill my-agent create     # Tier 1: Auto
  tiered_automatic_guardrails.py neo4j mempalace backup   # Tier 3: Size-aware prompt
```

**Classic Scripts (still available):**
```bash
validate_before_modify.sh    # Manual pre-check
verify_after_modify.sh       # Manual verification  
restore_backup.sh            # Emergency rollback
```

### Decision Logic

```
Operation requested:
├── Size < 1MB and Tier 1?
│   └── ✅ Automatic: Backup + Proceed (no prompt)
├── Size 1-50MB and Tier 2?
│   └── ✅ Automatic: Backup + Notify + Proceed
├── Size > 50MB or Tier 3?
│   └── ⚠️ Prompt user:
│       ├── [Y] Backup + Proceed (recommended)
│       ├── [n] Cancel operation
│       └── [s] Skip backup + Proceed (no storage used)
└── Size > 500MB?
    └── 🔴 Mandatory approval with storage warning
```

### Storage Safety First

Before ANY operation:
- ✅ Check free space on target volume
- ⚠️ Warn if < 10GB remaining
- 🔴 Block if < 1GB remaining (unless explicit override)

---

### Pre-Modification Checklist
- [ ] Is this Tier 1 (safe) or Tier 2/3 (restricted)?
- [ ] Has current version been backed up?
- [ ] Are validation tests defined?
- [ ] Is rollback procedure documented?
- [ ] Has user explicitly approved?

### Post-Modification Verification
- [ ] Resource loads without error
- [ ] Basic functionality test passes
- [ ] No cascade failures observed
- [ ] Diary entry created documenting change

## Emergency Procedures

### Rollback Skill
```bash
# Find backup
ls -la ~/.hermes/skills/<name>/SKILL.md.backup_*

# Restore
cp ~/.hermes/skills/<name>/SKILL.md.backup_<timestamp> \
   ~/.hermes/skills/<name>/SKILL.md
```

### Reset MemPalace Fact
```python
# If bad fact saved
mempalace_kg_invalidate(
  subject="bad_subject",
  predicate="bad_predicate", 
  object="bad_object"
)
```

### Kill Runaway Agent
```bash
# Find process
ps aux | grep hermes

# Kill if necessary
kill -9 <PID>
```

## Best Practices

1. **Never let agents modify Tier 3** (infrastructure)
2. **Always require explicit user approval** for Tier 2 (framework)
3. **Verify after every modification** — trust but verify
4. **Document in diary** — create audit trail
5. **Schedule monthly audits** — catch drift early
6. **Keep backups** — filesystem + MemPalace KG
7. **Test in isolation** — validate before production

## Related Skills

- `system-architecture` — Storage layer mental model
- `mempalace-palace-connections` — Cross-palace intelligence
- `deploy-agent` — Agent spawning procedures

## Version History

v1.0.0 - Initial guardrail documentation
- Identified current gaps
- Documented manual safeguards
- Created tier classification
- Established emergency procedures