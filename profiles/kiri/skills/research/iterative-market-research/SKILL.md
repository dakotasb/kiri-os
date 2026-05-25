---
name: iterative-market-research
description: Orchestrate autonomous multi-iteration market research with agent teams that cross-validate findings, detect contradictions, and progressively build confidence scores. Use when you need hardened research that goes beyond single-pass validation, especially for strategic business decisions or when the user wants to "let agents work overnight" to iteratively improve research quality.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [market-research, iterative-research, autonomous-agents, cross-validation, confidence-scoring, overnight-research, multi-agent]
---

# Iterative Market Research with Autonomous Agent Teams

## Overview

Single-pass market research often misses contradictions, lacks confidence scoring, and can't self-correct. This skill orchestrates **3-4 autonomous research iterations** where agent teams:
1. **Explore** → Gather initial evidence
2. **Challenge** → Cross-validate and find contradictions  
3. **Synthesize** → Investment/trend analysis
4. **Harden** → Final synthesis with confidence matrix

Ideal for strategic decisions, overnight deep dives, and when the user explicitly wants agents to "keep researching until confidence is high."

## When to Use

**Use this skill when:**
- User says "keep researching" or "work overnight" or "run iterations"
- Strategic decisions requiring hardened evidence (entering markets, major pivots)
- User suspects bias and wants contradictory evidence actively sought
- Multiple data sources need reconciliation
- User wants to see if "self-learning engine" actually works
- **Data freshness requirement:** "2025-2026 data only", "flag outdated sources"
- **Expanded scope:** "beyond recursive patterns", "discover new trends"
- **Action execution:** "execute recommendations from Section X"

**Don't use when:**
- Quick single-pass answer needed
- Low-stakes decision
- Time constraints (this takes hours, not minutes)

---

## Data Freshness Enforcement (2025-2026 Pattern)

When user specifies data freshness (e.g., "2025-2026 data only", "exclude 2024 sources"):

### Hard Requirements
- **Only use sources from 2025-2026** — Flag anything earlier as "outdated"
- If 2024 or earlier source found, mark: "⚠️ OUTDATED — seeking 2025-2026 equivalent"
- TAM/CAGR: Use current 2025-2026 projections, not historical
- Pricing: Extract current 2025-2026 tiers
- Funding: Crunchbase 2025 rounds only

### Data Freshness Audit Trail
```markdown
## Data Freshness Audit
| Source | Date | Status | Replaced With |
| old    | 2024 | ⚠️ OUTDATED | 2025 equivalent |
| new    | 2025 | ✅ CURRENT  | —               |
```

**If insufficient 2025-2026 data exists:** Document the gap, note confidence reduction.

---

## Expanded Research: Beyond Recursive Patterns

When user says "expand research beyond existing patterns" or "discover NEW trends":

### Pre-Defined Category Structure
Span 5-8 standardized market categories to avoid tunnel vision:

| Category | Focus | Example Discoveries |
|----------|-------|---------------------|
| **A)** Infrastructure Evolution | Multi-agent architectures, orchestration patterns | A2A protocols, dynamic agent selection |
| **B)** Enterprise AI Adoption | Buying patterns, security/compliance | SOC 2 requirements, BYOM as table stakes |
| **C)** Model Landscape | Open weights, cost-per-inference | 30% yearly cost drops, model proliferation |
| **D)** Developer Tooling | IDE-native agents, low-code | 60-70% code export rates, OOB expectations |
| **E)** Adjacent Markets | Agent marketplaces, A2A commerce | $2-5B whitespace, no dominant players |
| **F)** Regulatory Trends | EU AI Act, liability frameworks | Compliance tooling gaps |

**Goal:** Identify **3-7 NEW opportunities** NOT duplicates of existing theses.

---

## Action Item Execution Chaining

When user asks to "execute action items" or "execute Section X recommendations":

### Chained Job Pattern
```python
# Job 1: Research + identify action items
cronjob(
    action="create",
    name="research-iteration-4",
    skills=["revenue_strategist", ...],
    prompt="Final synthesis. Include Section 10: Recommended Action Items."
)

# Job 2: Execute first 3 recommendations from Job 1 output
cronjob(
    action="create",
    name="execute-action-items",
    skills=["revenue_strategist", ...],
    context_from=["research-iteration-4"],  # Prior output injected
    prompt="Execute the FIRST 3 RECOMMENDED ACTION ITEMS from Section 10 of the previous report."
)
```

**Key:** `context_from` automatically injects previous job's full output including Section 10.

---

### Iteration 1: Initial Deep Dive (Explore)

**Goal:** Broad evidence gathering across multiple sources

**Agent Assignments:**
- **research_engineer:** Lead market analysis, competitor landscape
- **market_analyst:** Pricing extraction, market sizing
- **portfolio_manager:** Investment flow identification

**Tasks:**
1. **Competitor Analysis:**
   - Scrape GitHub stars/forks/Issues for OSS projects
   - Extract live pricing from competitor websites
   - Document feature matrices
   - Pain point analysis (Reddit/HN/GitHub issues)

2. **Market Sizing:**
   - Find analyst reports (Gartner, IDC, Grand View Research)
   - Calculate TAM/SAM/SOM with sources
   - Growth projections with CAGR

3. **Trend Analysis:**
   - What's changed in last 12-24 months?
   - YC companies in this space
   - Recent acquisitions/funding

**Deliverable:** Structured analysis with sources cited, confidence level: LOW (unvalidated)

**Save to:** `market_research_palace` → `wing: {project}_deep_research` → `hall: iteration_1`

---

### Iteration 2: Cross-Validation (Challenge)

**Goal:** Challenge findings, find contradictions, explore alternative angles

**Agent Assignments:**
- **research_engineer:** New source exploration (different angle)
- **market_analyst:** Contradiction detection and resolution
- **qa_manager:** Data quality verification

**Tasks:**
1. **Challenge High-Confidence Claims:**
   - For each HIGH/MEDIUM confidence claim from Iteration 1, find evidence AGAINST it
   - Test: "We think X is worth $Y, but source Z suggests otherwise"
   - **Bear Case Requirement:** For every optimistic claim (>4.0 confidence), find at least one contradicting source
   - **Market Sizing Check:** Verify TAM claims using conservative estimates (often 3-5x lower in emerging tech)

2. **Explore Alternative Sources:**
   - Different data sets not used in Iteration 1
   - IndieHackers vs Hacker News vs Product Hunt
   - Regional variations (US vs EU vs Asia)
   - **Analyst Revision Tracking:** Look for downward revisions (e.g., Gartner trough predictions, VC multiple compressions)

3. **Research Gap Protocol:**
   - If Iteration 1 detailed report cannot be found, document: "RESEARCH GAP: Iteration 1 detailed findings not retrievable"
   - Attempt reconstruction from diary entries, summaries, or cross-palace search
   - Note all gaps in final report with confidence penalty

4. **Pricing Verification:**
   - Is the "pricing gap" real or sampling artifact?
   - Re-scrape same competitors to verify
   - Check for seasonal pricing changes
   - **Look for margin pressure signals:** (e.g., Dify 103% price hike = desperation, not growth)

5. **Hype Cycle Positioning:**
   - Check for "Peak of Inflated Expectations" positioning
   - Verify trough timing predictions (e.g., Q3 2025-Q1 2026)
   - Adjust market window estimates based on cycle position

6. **Contradiction Resolution:**
   - Document: "Source A says X, Source B says Y"
   - Assign confidence based on source reliability
   - Flag for Iteration 3 if unresolved

**Deliverable:** Contractions found, confidence updates (with deltas), new sources, validation of Iteration 1, research gaps documented

**Save to:** `market_research_palace` → `wing: {project}_deep_research` → `hall: iteration_2`

---

### Iteration 3: Synthesis & Risk Analysis (Harden)

**Goal:** Investment landscape, risk assessment, positioning hypothesis

**Agent Assignments:**
- **portfolio_manager:** Investment/funding analysis
- **revenue_strategist:** Market entry strategy
- **market_analyst:** Risk matrix construction

**Tasks:**
1. **Funding Landscape:**
   - Who raised what? (Crunchbase, TechCrunch, VentureBeat)
   - Investor sentiment signals
   - Recent M&A activity

2. **Customer Validation:**
   - Are people actually PAYING?
   - Case studies, testimonials
   - Open source vs commercial adoption rates

3. **Risk Assessment:**
   - Build scenarios: Best/Realistic/Worst case
   - What could kill this opportunity?
   - Technical risks (reliability, hallucination)
   - Market risks (too early/too late, incumbent response)

4. **Positioning Hypothesis:**
   - If entering, what's the exact niche?
   - Pricing hypothesis with rationale

**Deliverable:** Investment landscape, risk matrix, scenarios, positioning recommendation

**Save to:** `market_research_palace` → `wing: {project}_deep_research` → `hall: iteration_3`

---

### Iteration 4: Final Synthesis (Deliver)

**Goal:** Comprehensive report ready for executive decision-making

**Agent Assignments:**
- **revenue_strategist:** Lead synthesis
- **research_engineer:** Fact-checking
- **market_analyst:** Final validation

**Deliverable Structure:**

```markdown
# Market Analysis Report: {Project Name}
## Iterative Research Summary (3-4 cycles)

### 1. Executive Summary
- **Viability Verdict:** YES/NO/MAYBE (X% confidence)
- **Key Supporting Evidence:** (3-5 bullets)
- **Key Risks/Doubts:** (3-5 bullets)
- **Recommendation:** Proceed/Research More/Abandon

### 2. Market Validation
| Competitor | Traction | Pricing | Features | Gaps Identified |
| GitHub Stars | Live Pricing | Key Differentiators | Opportunities |

### 3. Investment Landscape
- Funding rounds identified
- Investor thesis
- Market timing signals

### 4. Positioning Recommendation
- Exact niche recommended
- Pricing hypothesis ($X-$Y/mo)
- Differentiation strategy

### 5. Confidence Matrix
| Finding | Confidence | Primary Source | Contradictions | Iterations Validated |
|---------|-----------|----------------|----------------|---------------------|
| Claim A | HIGH | GitHub API | None | 3/3 |
| Claim B | MEDIUM | Blog posts | Some found | 2/3 |
| Claim C | LOW | Estimates only | High | 1/3 |

### 6. Research Gaps
- What still needs investigation?
- Recommended next steps

### 7. Appendix: Source Citations
- Complete list of URLs and extractions
```

**Save to:** `market_research_palace` → `wing: {project}_deep_research` → `hall: final_synthesis`

---

## Deployment Patterns

### Pattern A: Real-Time Iteration (Active collaboration)
```
You run iteration 1 → User reviews → You run iteration 2 → ...
Total time: 4-6 hours with user checkpoints
```

### Pattern B: Overnight Autonomous (Set-and-forget)
```python
# Schedule via cronjob with deliver=origin
# Agents work while user sleeps
# Results delivered in morning

cronjob(action='create', 
        name='research-iteration-1',
        schedule='0 8 * * *',  # 8 AM
        prompt=ITERATION_1_PROMPT,
        deliver='origin')

cronjob(action='create',
        name='research-iteration-2', 
        schedule='0 10 * * *', # 10 AM
        prompt=ITERATION_2_PROMPT,
        deliver='origin')

# etc...
```

### Pattern C: Parallel Sweeps (Speed)
```
All iterations run simultaneously on different agents
Higher risk of duplication, faster results
```

---

## Confidence Scoring Methodology

**Confidence Levels:**
- **HIGH:** 3+ independent sources agree, direct evidence accessible
- **MEDIUM:** 2 sources agree, some contradictory evidence
- **LOW:** Single source, estimate-based, unverified

**Validation Count:**
Track how many iterations confirmed each finding:
- "Validated in 3/3 iterations" → Very high confidence
- "Only appeared in iteration 1" → Needs more research

**Contradiction Tracking:**
- Document: "Iteration 1 said X, Iteration 2 found Y which contradicts"
- Resolution: Which source is more reliable?

---

## System Safety & Resource Management

**Critical: Prevent agent crashes during long-running research**

### Resource Monitoring (via devops_sre agent)
```python
# Check every 20-30 minutes during iteration
- CPU usage < 80%
- Memory usage < 80%
- Disk space available
- API rate limits not exceeded
```

### Throttling Rules
```
IF resources > 80%:
  - Pause current iteration
  - Wait 10 minutes
  - Resume or hand off with checkpoint
  - Notify user if unable to continue
```

### Checkpoint Strategy
```
After each iteration:
- Save all findings to MemPalace
- Create digest summary
- Next iteration reads from checkpoint
- System can resume after interruption
```

---

## Tools to Deploy

**For Iteration 1 (Explore):**
- curl + GitHub API for OSS metrics
- curl to pricing pages for live extraction
- delegate_task with web search for broad research
- mcp_mempalace_save for structured storage

**For Iteration 2 (Challenge):**
- mcp_mempalace_recall to read Iteration 1 findings
- New web searches from different angles
- Data comparison logic

**For Iteration 3 (Synthesize):**
- Crunchbase/api for funding data (if available)
- Industry publication scraping
- Risk matrix construction

**For Iteration 4 (Synthesize):**
- All previous iterations as context
- Structured report generation
- Confidence matrix tables

---

## Example: Running the Full Cycle

```python
# User says: "Work overnight, have agents research AI agent market"

# You deploy:
1. Schedule 4 cron jobs 2 hours apart (8am, 10am, 12pm, 2pm)
2. Each job triggered with specific agent assignments
3. All save to market_research_palace → kiri_deep_research
4. Final synthesis delivered to user at 2pm

# User wakes up to:
- 4 iterations of hardened research
- Confidence matrix showing validated vs unvalidated claims
- Contradictions identified and resolved
- Positioning recommendation ready
```

---

## Key Differences from Single-Pass Research

| Aspect | Single-Pass | Iterative |
|--------|-------------|-----------|
| Time | Minutes | Hours (or overnight) |
| Validation | None | 3-4x cross-checking |
| Contradictions | Missed | Actively sought |
| Confidence | Subjective | Scored with evidence |
| Agent Usage | 1 researcher | 3-4 agent team |
| Output | Initial findings | Hardened recommendations |

---

## Anti-Patterns

**DON'T:**
- Skip iterations (undermines confidence building)
- Let agents duplicate work without coordination
- Ignore resource constraints (will crash overnight)
- Accept findings validated in only 1 iteration
- Forget to save checkpoints (lose progress on crash)

**DO:**
- Have agents explicitly challenge their own findings
- Document contradictions even if unresolved
- Monitor resources during long-running research
- Force source citations for every claim
- Build confidence progressively, not assume it

---

## When This Proves Value

This skill demonstrates the "self-learning engine" concept:
- Evidence quality improves with each iteration
- Agents learn from contradictions
- Confidence becomes quantified, not assumed
- Research becomes reproducible and auditable

If the user wants to see if "agents can iteratively improve" - this is the demonstration.