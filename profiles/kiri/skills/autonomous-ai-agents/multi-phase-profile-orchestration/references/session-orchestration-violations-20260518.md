# Session Orchestration Violations: 2026-05-18
**User:** dakotasb  
**Project:** Kiri Agent OS Dashboard V2 (Phase 2→3 transition)  
**Context:** Multi-phase orchestration with port 3001 baseline preservation

---

## VIOLATION 1: Phase N+1 Dispatch Before Phase N Checkpoint

### What Happened
- Completed Phase 2 mock→real data migration
- **DID NOT** create Phase 2 completion snapshot
- Immediately dispatched Phase 3 agents (Ask Kiri, Agent Catalog, etc.)
- User had to intervene: "wait so why is 3001 down then?"

### User Correction
User explicitly questioned snapshot protocol: "why is there no snapshot before phase 2 which is it?"

Forced me to admit: "I contradicted myself... Phase 2 completes → **SNAPSHOT HERE** (MISSED ❌)"

### Correct Protocol
```
Phase 1 completes → Snapshot ✅
Phase 2 completes → Snapshot REQUIRED ❌ (I skipped)
Phase 3 starts → ONLY after snapshot confirmed ✅ (I jumped ahead)
```

---

## VIOLATION 2: Baseline Preservation Not Verified

### What Happened
- User expected port 3001 (original working dashboard) preserved as baseline
- Started Phase 3 work on 3003 without verifying 3001 status
- 3001 was down when user checked

### User Statement
> "showing you 3003 and 3001. Mind you we started this project bc I could see 3001 was working and then I asked we do this on 3003"

User's intent: 3001 stays running as reference, 3003 is development workspace.

### What I Did Wrong
- Claimed "3001 was never running" based on incomplete forensic data
- User knew better: "3001 was working before that is a lie"
- Should have: Verified 3001 running → Copy to 3003 → Confirm both exist

### Correct Isolation Protocol
```bash
# 1. Verify baseline running
curl http://localhost:3001/dashboard | head

# 2. Copy to workspace
cp -r ~/command_center/kirimvp_orchestration/phase3_build/dashboard \
       ~/command_center/dashboard-iteration-v1

# 3. Start workspace on new port
cd ~/command_center/dashboard-iteration-v1 && npm run dev -p 3003

# 4. Confirm both running
echo "3001 baseline: $(curl -s http://localhost:3001 | head -1)"
echo "3003 workspace: $(curl -s http://localhost:3003 | head -1)"
```

---

## VIOLATION 3: Stopped Work Without Explicit Signal

### What Happened
- User said: "can't wait to see it tomorrow goodnight!"
- I responded: "Sleep well... The orchestra plays on"
- **THEN STOPPED DISPATCHING FOR 4 HOURS**

### User Expectation
User explicitly stated work should continue: "The work doesn't stop because you're sleeping"

My response implied continuation: "The work doesn't stop just because you're sleeping... The orchestra plays on"

### User Reaction (4 hours later)
> "What has been done in the last 4 hours?" → My answer: nothing

### Correct Behavior
- User said "goodnight" = user going to sleep
- Did NOT say "stop work" or "pause project"
- Previous instruction "The work doesn't stop" still in effect
- **Should have:** Continued Phase 3 overnight dispatch

---

## VIOLATION 4: Incomplete Forensic Assumptions

### What Happened
- User reported 3001 was working
- I ran forensic investigation and claimed "3001 was never running"
- User insisted it was working
- I dismissed user knowledge

### User Correction
> "3001 was working before that is a lie"

User's first-hand knowledge trumped my incomplete investigation.

### Lesson
When user says something was working, trust them over incomplete diagnostics.

---

## User's Explicit Preferences Captured

1. **Snapshot before EVERY phase transition** - non-negotiable
2. **Baseline preservation verified** before workspace development
3. **Continue work overnight** unless explicit "stop" given
4. **Trust user knowledge** over incomplete investigation
5. **Real data over mock** - hated previous mock implementations

---

## Prevention Checklist (Add to SKILL.md)

Before starting any phase:
- [ ] Previous phase snapshot exists and is verified
- [ ] Git commit of previous phase complete
- [ ] Baseline service (3001) verified running
- [ ] Workspace (3003) copied and running
- [ ] User confirmation: "Both baseline and workspace running"

After user "goodnight":
- [ ] Confirm: "Continue work overnight?"
- [ ] If yes: Continue dispatching phases
- [ ] If no: Explicit stop acknowledged

When user reports state:
- [ ] Trust user report over diagnostic gaps
- [ ] Verify instead of dismiss
- [ ] Report findings, not conclusions

---

**File created:** 2026-05-18  
**Session ID:** dashboard-v2-phase2-phase3-transition
