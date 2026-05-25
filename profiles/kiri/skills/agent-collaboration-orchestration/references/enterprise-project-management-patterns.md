# Enterprise Project Management Patterns
## Multi-Agent Orchestration at Scale

**Use when:** Managing production releases, investor demos, or enterprise deployments involving 15+ agents and 30+ tracked issues.

---

## Coordination Team Structure

### Required Roles

| Agent | Role | Responsibilities | When to Dispatch |
|-------|------|------------------|------------------|
| @kiri | Project Manager | Overall orchestration, status reporting, strategic decisions | Always - coordinates all phases |
| @archivist | Issue Manager | Create/update GitHub issues, documentation, changelogs | Issue creation, status updates, releases |
| @chronicle | Git Curator | Branch management, commit conventions, merge coordination | Branch creation, merge commits, history cleanup |
| @relic | Snapshot Manager | Pre/post change backups, disaster recovery | Before every implementation, after validation |
| @ledger | Status Tracker | Real-time progress dashboard, attempt tracking, burn-down | Continuous - updates every 30 min |
| @watcher | Monitoring | Detect failures, trigger rollbacks, alert on regressions | Continuous - monitors all agent activity |

### Optional Specialists

| Agent | Role | Responsibilities |
|-------|------|------------------|
| @keystone | Code Review Lead | Final approval on all merges to main |
| @forgemaster | Integration Manager | Resolves merge conflicts, coordinates integration |
| @harbor | Security Validation | Post-fix security scans, penetration testing |

---

## GitHub Issue Lifecycle

### Issue Creation Template (@archivist)

```markdown
**Agent Finding:** @<agent-name> review
**Criticality:** Demo-blocker / Legal liability / Medium polish
**Root Cause:** <technical description>
**Fix Strategy:** <approach description>
**Fix Time:** N hours estimated
**Attempts:** 0/3 max
**Snapshot:** reldash-<date>-<phase>-<issue>-attempt0-pre
**Branch:** fix/<phase>-<category>-issues
**Assignee:** @<agent-name>

## Success Criteria
- [ ] <Specific criterion 1>
- [ ] <Specific criterion 2>
- [ ] @keystone code review approved
- [ ] Security scan passes (if applicable)
```

### Issue States & Labels

```
Status Labels:
- status/todo → Not started, agent assigned
- status/in-progress → Agent actively working
- status/pending-review → Implementation complete, awaiting review
- status/failed-attempt-N → Failed on attempt N, awaiting retry
- status/resolved → Merged to main, validated
- status/wont-fix → Acknowledged, scoped out

Priority Labels:
- priority/critical → Demo killer, fix immediately
- priority/high → Investor confidence hit, fix before demo
- priority/medium → Polish items, fix if time permits
- priority/low → Nice to have, backlog

Category Labels:
- category/security → Vulnerabilities, auth, injection
- category/functionality → Broken features, navigation
- category/architecture → State management, patterns
- category/performance → Loading speed, bundle size
- category/ux → User experience, content, design
- category/deployment → Docker, CI/CD, environment
```

### Attempt Tracking (@ledger)

| Attempt | Status | Snapshot | Notes |
|---------|--------|----------|-------|
| 0 | PRE-IMPLEMENTATION | reldash-20260516-phase1-C1-attempt0-pre | Baseline before change |
| 1 | FAILED | reldash-20260516-phase1-C1-attempt1-failed | Build error: [excerpt] |
| 2 | IN-PROGRESS | n/a | Revised approach: parameterized queries |
| 3 | VALIDATED | reldash-20260516-phase1-C1-attempt3-validated | All tests pass |

**Max 3 attempts per issue.** If attempt 3 fails, escalate to @kiri for strategic decision.

---

## Branch Strategy Templates

### Phase-Based Branch Hierarchy

```
main (protected - requires @keystone approval)
├── fix/phase1-security-critical
│   ├── @bastion-C1-shell-injection
│   ├── @bastion-C2-auth-middleware
│   ├── @temper-C3-input-sanitization
│   ├── @sentry-H1-security-headers
│   └── MERGE → main when all #1-6 resolved
├── fix/phase2-core-functionality
│   ├── @prism-C4-input-validation
│   ├── @adjunct-C5-command-center
│   ├── @forge-C6-agent-navigation
│   └── MERGE → main when all #7-13 resolved
├── fix/phase3-architecture-data
│   ├── @mason-H6-state-management
│   ├── @archivist-H5-mock-data (depends: H6)
│   ├── @keystone-H4-hydration (depends: H5)
│   └── MERGE → main when all #14-25 resolved
└── fix/phase4-performance-deploy
    ├── @launchpad-C9-hardcoded-path
    └── MERGE → main when all #26-31 resolved
```

### Branch Naming Convention

```
Format: fix/phase{N}-{category}-{optional-agent-specific}

Examples:
- fix/phase1-security-critical                  (phase branch)
- fix/phase2-core-functionality                (phase branch)
- fix/phase3-architecture-data                 (phase branch)

Agent-specific branches (created from phase branch):
- @bastion/shell-injection-C1                 (from fix/phase1-security-critical)
- @forge/agent-navigation-C6                  (from fix/phase2-core-functionality)
- @mason/state-management-H6                  (from fix/phase3-architecture-data)
```

---

## Snapshot Protocol Templates

### Pre-Change Snapshot (@relic)

**Trigger:** Before any agent modifies production code
**Naming:** `reldash-{YYYYMMDD}-{phase}-{issue}-attempt{N}-pre`
**Contents:**
- Full codebase state
- Git commit hash (for reference)
- Node modules state (package-lock.json)
- Database schema (if applicable)
- Environment configuration (.env)

**Command:**
```bash
relic-snapshot create \
  --name "reldash-$(date +%Y%m%d)-${phase}-${issue}-attempt${N}-pre" \
  --source ~/command_center/kirimvp_orchestration/phase3_build/dashboard/ \
  --include-git-state \
  --include-node-modules \
  --compress \
  --store ~/command_center/infrastructure/snapshots/
```

### Post-Validation Snapshot (@relic)

**Trigger:** After @watcher confirms all tests pass
**Naming:** `reldash-{YYYYMMDD}-{phase}-{issue}-attempt{N}-validated`
**Lifecycle:** Keep for 30 days, then archive or delete

**Command:**
```bash
relic-snapshot create \
  --name "reldash-$(date +%Y%m%d)-${phase}-${issue}-attempt${N}-validated" \
  --source ~/command_center/kirimvp_orchestration/phase3_build/dashboard/ \
  --tag "ready-for-merge" \
  --tag "phase-${phase}-complete" \
  --store ~/command_center/infrastructure/snapshots/
```

### Rollback Execution (@relic + @chronicle)

**Trigger:** @watcher detects failure
**Execution:**
```bash
# Step 1: Restore codebase
tar -xzf ~/command_center/infrastructure/snapshots/reldash-YYYYMMDD-phase-issue-attemptN-pre.tar.gz \
  -C ~/command_center/kirimvp_orchestration/phase3_build/dashboard/

# Step 2: Restore git state (via @chronicle)
git reset --hard $(cat .snapshot-git-hash)
git clean -fd

# Step 3: Verify restoration (via @watcher)
smoke-test --url http://localhost:3001
build-test --command "npm run build"

# Step 4: Update records (via @archivist + @ledger)
# GitHub issue comment: "FAILED: [reason]. Reverted to attemptN snapshot."
# Status: FAILED-ATTEMPT-N, increment attempt counter
```

**Time Budget:** Must complete rollback in <5 minutes

---

## Phase Execution Templates

### Phase 1: Security Lockdown (Template)

```yaml
Phase: 1
Duration: 4 hours
Branch: fix/phase1-security-critical
Parallel: true  # Security issues are orthogonal
Agents:
  - @bastion:
      issues: [C1, C2, H2]
      order: sequential  # C1 must complete before C2
  - @temper:
      issues: [C3]
      order: independent
  - @sentry:
      issues: [H1, H3, H4]
      order: parallel

Entry Criteria:
  - All security issues created in GitHub
  - @relic snapshots ready
  - @watcher monitoring active

Exit Criteria:
  - All issues marked "Resolved"
  - OWASP security scan passes
  - No high/critical vulnerabilities
  - @keystone merge approval
```

### Phase 2: Core Functionality (Template)

```yaml
Phase: 2
Duration: 6 hours
Branch: fix/phase2-core-functionality
Parallel: true
Agents:
  - @forge:
      issues: [C6, H8]
      order: C6 first (navigation), then H8 (search)
  - @forgemaster:
      issues: [C7, C8, H9]
      order: C7 first (Task modal), then C8 (Theme), then H9 (Start button)
  - @prism:
      issues: [C4]
      order: independent
  - @adjunct:
      issues: [C5]
      order: independent

Dependencies:
  - Can start when Phase 1 merged
  - No dependencies between parallel agents

Success Criteria:
  - Agent cards clickable
  - New Task modal functional
  - Ask Kiri validates input
  - Command Center loads
```

### Phase 3: Architecture & Content (Template)

```yaml
Phase: 3
Duration: 8 hours
Branch: fix/phase3-architecture-content
Sequential: true  # DEPENDENT - must complete in order
Order:
  1. @mason:
       issues: [H6, H7]
       output: State management API, plugin integration complete
       
  2. @archivist:
       issues: [H5, M4, M5, M6, M7, M8]
       depends_on: @mason (needs state API)
       output: Real data replaces mocks, onboarding flow added
       
  3. @keystone:
       issues: [M1, H4]
       depends_on: @archivist (needs stable content)
       output: React keys fixed, hydration synced
       
  4. @palette:
       issues: [M9, M10, M11, M12]
       depends_on: @keystone (needs stable rendering)
       output: Design polish complete

Critical Path: @mason → @archivist → @keystone → @palette = 8 hours
```

---

## Rollback Decision Tree

```
@watcher detects failure
    ↓
Is it a FAST FIX? (<30 min)
    ↓ YES
Attempt immediate fix, no rollback
    ↓
@watcher validates: FIXED?
    ↓ YES
Continue
    ↓ NO
ROLLBACK
    ↓
Is it ATTEMPT 3/3?
    ↓ YES
Escalate to @kiri (Project Manager)
    ↓
@kiri decides: SKIP / REDESIGN / ACCEPT FAILURE
    ↓ NO (attempts 1-2)
ROLLBACK
    ↓
@relic restores snapshot
@archivist updates issue with failure notes
@ledger increments attempt counter
    ↓
Agent re-approaches with new strategy
    ↓
REPEAT
```

---

## Communication Patterns

### Status Update (@ledger to @kiri)

```
PHASE 1: Security Lockdown
├─ Attempt: 2/3 on C1, 1/3 on C2
├─ Resolved: 2/6 issues (#4 Headers, #6 Metrics)
├─ Blocked: C1 (shell injection - build failing)
└─ ETA: +2 hours (was 4h, now 6h projected)

PHASE 2: Waiting on Phase 1 merge
PHASE 3: Waiting
PHASE 4: Waiting

Overall: 17% complete, 2 issues resolved, 34 remaining
Demo Readiness: HIGH RISK (C1-critical still open)
```

### Blocker Escalation (@any agent → @kiri)

```
AGENT: @bastion
ISSUE: #1 C1 Shell injection
BLOCKED BY: Cannot reproduce exploit locally
ATTEMPTS: 2/3
NEXT ATTEMPT: Need access to staging environment
RECOMMENDATION: Either grant staging access OR mark C1 as "requires manual verification"

ACCEPTABLE RISKS:
1. Deploy with C1 unverified (risk: demo exploit)
2. Delay demo 48h to verify properly (risk: miss deadline)
3. Accept C1 as "known limitation" documented (risk: investor question)

@kiri decision needed in 30 minutes.
```

---

## Validation Scripts

### Smoke Test (@watcher)

```bash
#!/bin/bash
# run-smoke-test.sh

npm run build || exit 1
npm run start &
sleep 5

curl -s http://localhost:3001 | grep "Agent OS" || exit 2
curl -s http://localhost:3001/agents | grep "agent-card" || exit 3
curl -s http://localhost:3001/api/health | grep "ok" || exit 4

# Critical user flows
curl -X POST http://localhost:3001/api/task \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}' || exit 5

echo "✅ All smoke tests pass"
```

### Security Scan (@harbor)

```bash
#!/bin/bash
# run-security-scan.sh

npm audit --audit-level=high || exit 1

# OWASP ZAP baseline scan
zap-baseline.py \
  -t http://localhost:3001 \
  -r security-report.html || exit 2

# Check for hardcoded secrets
gitleaks detect --source . || exit 3

echo "✅ Security scan passes"
```

---

## Success Metrics

### Pre-Demo Gate

| Metric | Target | Measure | Owner |
|--------|--------|---------|-------|
| Issues resolved | 36/36 | GitHub API | @ledger |
| Security scan | 0 critical | npm audit + ZAP | @harbor |
| Lighthouse perf | ≥80 | Chrome CLI | @keystone |
| Console errors | 0 | Browser log | @watcher |
| Build time | <60s | Stopwatch | @keystone |
| Rollback test | <5min | Stopwatch | @relic |
| Smoke tests | 5/5 pass | Script | @watcher |
| Code review | 100% | GitHub | @keystone |

### Post-Demo Metrics

| Metric | Target | Measure |
|--------|--------|---------|
| Investor questions about security | 0 | Meeting notes |
| Navigation confusion | 0 | Observation |
| Demo flow interruptions | 0 | Event log |
| Feature requests captured | N | Notes |

---

## Recovery from Cascading Failure

**Scenario:** Phase 1 security fixes cause Phase 3 state management to break.

**Recovery Protocol:**
1. @watcher detects Phase 3 regression
2. @relic identifies: Phase 1 change broke API contract
3. @kiri convenes: @bastion (Phase 1) + @mason (Phase 3)
4. Decision: Either
   - Fix forward: @bastion patches Phase 1 fix to maintain compatibility
   - Rollback Phase 3, fix Phase 1, re-apply Phase 3
5. @chronicle handles git surgery as needed
6. @ledger updates all affected issue timelines

**Time Recovery Budget:** +4 hours maximum, else escalate to scope reduction.

---

*Pattern reference for agent-collaboration-orchestration skill*
*Version: 1.0*