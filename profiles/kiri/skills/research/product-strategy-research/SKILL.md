---
name: product-strategy-research
description: Conduct strategic product research by analyzing competitors, synthesizing decision frameworks, and delivering actionable recommendations with confidence scoring. Use when researching pricing strategies, OOB vs extensibility decisions, validating founder-as-power-user narratives, or any multi-topic strategic planning requiring hardened evidence.
version: 1.1.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [product-strategy, competitive-analysis, strategic-research, decision-frameworks, confidence-scoring, contradictions-analysis, overnight-research]
---

# Product Strategy Research

## Overview

This skill guides strategic product research for startup decision-making. It provides structured methodologies for:
- Deep-dive case study analysis across competitors
- Synthesizing best practices into reusable frameworks
- Building decision matrices for strategic prioritization
- Delivering actionable recommendations with confidence scores and contradiction analysis
- Multi-topic research synthesis (pricing, features, go-to-market, etc.)

**Key Differentiator:** Products research with confidence scoring and explicit contradiction tracking—not just information gathering.

## When to Use

**Use this skill when:**
- **Multiple strategic decisions need research** (pricing, features, validation, positioning)
- Analyzing how successful products balance simplicity and power (OOB vs extensibility)
- **Researching pricing strategies** (BYOM, managed vs BYO, markup models)
- Validating founder-as-power-user narratives for investor pitches
- Building decision frameworks for strategic prioritization
- Researching best practices for specific product patterns (progressive disclosure, time-to-value, etc.)
- You need **confidence scores and contradiction analysis** on findings
- **Overnight/deep research cycles** requiring hardened evidence

**Don't use when:**
- Quick single-answer lookup needed
- Pure market sizing or TAM research (use iterative-market-research)
- Validating revenue opportunities without product context (use revenue-opportunity-validation)
- Technical implementation questions
- **Single topic only** — this skill is optimized for multi-topic strategic synthesis

## Research Methodology

### Step 0: Multi-Topic Planning

For overnight/deep research cycles with multiple related topics:

**Research Structure:**

```
market_research_palace/
├── {project}_deep_research/
│   ├── 0_research_manifest.json         # Track topics, queries, status
│   ├── 0_OVERALL_RESEARCH_REPORT.md    # Cross-topic synthesis
│   ├── 1_{topic_A}/
│   │   ├── 1_executive_summary.md
│   │   ├── 2_case_studies.md
│   │   ├── 3_decision_matrix.md
│   │   ├── 4_contradictions_analysis.md
│   │   └── RESEARCH_COMPLETE.md
│   ├── 2_{topic_B}/
│   └── 3_{topic_C}/
```

**Parallel Research Execution:**

Use `delegate_task` with multiple subagents for maximum efficiency:

```python
# Example: 3-topic parallel research
# Save files to shared path for later synthesis

delegate_task(
    goal="Research Topic A: [specific questions]...",
    context="Use product-strategy-research methodology...",
    toolsets=["web", "browser", "file"]
)

delegate_task(
    goal="Research Topic B: [specific questions]...",
    context="Same methodology as Topic A...",
    toolsets=["web", "browser", "file"]
)

delegate_task(
    goal="Research Topic C: [specific questions]...",
    context="Same methodology...",
    toolsets=["web", "browser", "file"]
)
```

**Research Manifest Template:**

```json
{
  "research_iteration": "iteration_N",
  "research_date": "YYYY-MM-DD",
  "project": "{project_name}",
  "total_research_files": 0,
  "total_research_lines": 0,
  "topics": [
    {
      "id": "1_topic_name",
      "title": "Topic Name",
      "status": "in_progress",
      "confidence": 0.0,
      "key_questions": ["Q1", "Q2"],
      "target_path": "market_research_palace/...",
      "recommendation": "Summary",
      "contradictions_resolved": 0
    }
  ],
  "research_methodology": "parallel_multi_topic_delegation",
  "confidence_target": 4.0,
  "overall_confidence_achieved": 0.0,
  "contradictions_required": true,
  "contradictions_identified": 0
}
```

### Step 1: Case Study Selection

**For each strategic topic, analyze across these patterns:**

| Pattern | Questions to Research |
|---------|----------------------|
| **Competitive Analysis** | How do competitors handle this? What are their pricing/implementation models? |
| **Cost/Benefit Tradeoffs** | What are the business implications of each approach? |
| **User Experience** | How does the decision impact user adoption and satisfaction? |
| **Industry Standards** | What is becoming "table stakes" vs differentiation? |

### Step 2+: Confidence Scoring & Contradictions

**Critical addition: Every finding gets a confidence score.**

| Score | Meaning | Usage |
|-------|---------|-------|
| 5/5 | Direct evidence, multiple sources, product documentation | Build strategy on this |
| 4/5 | Strong evidence, expert consensus, observable patterns | Standard confidence |
| 3/5 | Observable patterns, some inference | Note alternatives |
| ≤2/5 | Limited data — do not rely on | Needs validation |

**Contradictions Must Be Documented:**

```markdown
## Contradictions Analysis

| Finding | Source A | Source B | Resolution | Confidence Impact |
|---------|----------|----------|------------|-------------------|
| X is true | [source] | [source] says X is false | [which wins, why] | Reduced to 3/5 |
| Y pricing | Public page says $X | Blog says $Y | [investigation] | Pending validation |
```

**Rules:**
1. Actively seek contradictory evidence (don't wait for it)
2. Document even unresolved contradictions
3. Adjust confidence based on contradiction resolution
4. Never hide contradictions — they indicate where more research is needed

### Step 3: Framework Synthesis

After analyzing individual products, synthesize:

1. **Common Patterns:** What do all successful products do?
2. **Anti-Patterns:** What do unsuccessful products do?
3. **Decision Matrix:** Weighted criteria for OOB vs extension decisions
4. **Best Practices:** Actionable principles for implementation

### Step 4: Confidence Scoring

Assign confidence scores to all findings:

| Score | Meaning | Usage |
|-------|---------|-------|
| 5/5 | Direct evidence, multiple sources, product documentation | Build strategy on this |
| 4/5 | Strong evidence, expert consensus, observable patterns | Standard confidence |
| 3/5 | Observable patterns, some inference | Note alternatives |
| 2/5 | Limited data, educated guess | Needs validation |
| 1/5 | Speculation | Do not rely on |

## Output Format

### Executive Summary Template
```markdown
## Executive Summary

**Key Finding:** One-sentence strategic recommendation.

**OOB Strategy:** {Heavy OOB | Balanced | Extension-heavy}

**Recommended Ratio:** {X% OOB / Y% extensions for MVP}

**Core Insight:** 
- What works: [Pattern]
- What doesn't: [Anti-pattern]
```

### Case Study Template
```markdown
## Case Study: {Product Name}

**Confidence Score:** {1-5}/5

### What Ships OOB (OOB Score: {1-10})
- Feature 1: [Description]
- Feature 2: [Description]
- Philosophy: [One sentence]

### Extensibility Layer
- Mechanism: [Plugins, extensions, APIs]
- Discovery: [How users find extensions]
- Maintenance: [Who maintains extensions]

### Key Insights
- Time to Value: [Minutes]
- Time to Power: [Weeks/Months]
- Pattern: [What they do well]
- Lesson: [Takeaway for your product]
```

### Decision Matrix Template
```markdown
## Decision Matrix: OOB vs Extension

**Ship OOB When:**
1. {Criteria 1}: {Threshold}
2. {Criteria 2}: {Threshold}

**Build as Extension When:**
1. {Criteria 1}: {Threshold}
2. {Criteria 2}: {Threshold}

**Scoring:**
| Criteria | Weight | Threshold |
|----------|--------|-----------|
```

## Example: OOB vs Extensibility Research

**Task:** Research how successful SaaS products balance OOB features with extensibility

**Products Analyzed:**
1. Cursor IDE (AI development)
2. Notion (collaboration/docs)
3. Figma (design)
4. VS Code (editor)

**Key Findings:**
| Product | OOB Ratio | Strategy | Time to Value |
|---------|-----------|----------|---------------|
| Cursor | 90% | AI works immediately | 0 seconds |
| Notion | 70% | "Blank page with superpowers" | 2 minutes |
| Figma | 85% | Complete tool; plugins enhance | 5 minutes |
| VS Code | 40% | Editor complete; extensions add | 2 minutes |

**Recommendation:** Target 75% OOB for MVP (Cursor/Figma model), shift to 60% as ecosystem matures.

**Confidence:** Most findings rated 4-5/5 based on direct product analysis.

## Tools to Deploy

### For Multi-Topic Research
- `delegate_task`: Parallel research across multiple agents
- Structure: `/market_research_palace/{project}_deep_research/iteration_N/{topic}/`

### For Research Methods
- `mcp_mempalace_search` / `mcp_mempalace_recall`: Check for existing research
- `skill_view`: Load relevant case study skills
- `web_extract`: Gather current product documentation
- `mcp_mempalace_save`: File findings with taxonomy (importance: 5 for strategic)
- `terminal`: Create structured reports
- `patch` / `write_file`: Generate deliverables

## Cross-Topic Synthesis

After parallel research completes, synthesize unified recommendations:

```markdown
# {Project} Strategic Synthesis

## Cross-Topic Insights
Identify patterns across topics. Example:
- Topic 1 (BYOM pricing) → Make power users happy
- Topic 2 (OOB features) → Work immediately for all users  
- Topic 3 (Founder POC) → Leverage personal use as proof
- **Unified Strategy:** Target power users with flexibility, ensure 75% OOB

## Unified Recommendations
| Dimension | Finding | Recommendation |
|-----------|---------|----------------|
| Pricing | Hybrid model works best | BYOM primary, managed credits optional |
| Features | 80% never customize | 75% OOB for MVP |
| Pitch | Founder-as-power-user valid | Three-frame narrative |

## Confidence Matrix
| Finding | Score | Source | Validated |
|---------|-------|--------|-----------|
| [Key finding] | 5/5 | [source] | ✓ |
```

## Synthesizing from Accumulated Research Iterations

When the user asks for "final synthesis" or "investment-grade synthesis" based on prior research scattered across MemPalace:

### Workflow

**Step 1: Query for Prior Iterations**
```python
# Search for relevant research across iterations
mcp_mempalace_search(query="Kiri V6 investment confidence strategic recommendations", limit=25)
mcp_mempalace_search(query="BYOM pricing n8n Dify iteration 4", limit=20)
mcp_mempalace_recall(wing="{project}_deep_research")
```

**Step 2: Map Iteration Depth**
| Finding | Iteration 1 | Iteration 2 | Iteration 3 | Iteration 4 | Confidence |
|---------|-------------|-------------|-------------|-------------|------------|
| BYOM table stakes | Found | Validated | Cross-ref | Confirmed | HIGH (4/5) |
| Pricing gap $X | Estimation | Verified | Adjusted | Final | MEDIUM (3/5) |

**Step 3: Build Confidence Attribution**
- HIGH (3+ iterations + external validation): Findings confirmed across multiple research cycles
- MEDIUM (2 iterations, some gaps): Partial validation
- LOW (single-source, needs verification): One iteration only

**Step 4: Create Investment Matrix**
Deliverables for investment-grade synthesis:
1. Executive Summary with investment thesis
2. Trend Analysis Matrix (Trend | TAM | Confidence | Timing | Revenue)
3. Competitive Position Map
4. Confidence Attribution Matrix
5. Strategic Recommendations (Immediate/Medium/Long-term)
6. Investment Round Readiness Analysis
7. Research Gaps

### Key Pattern
This is **synthesis of synthesis** — the research has already been done iteratively; your job is to retrieve from MemPalace, cross-validate across iterations, assign confidence based on iteration depth, and package for investor consumption.

---

## Cross-Topic Contradictions Analysis

When researching multiple strategic topics simultaneously, the same fundamental tensions often appear across all of them. Document these patterns:

### Common Strategic Tensions

| Tension | Topic A Example | Topic B Example | Topic C Example |
|---------|-----------------|-----------------|-----------------|
| **Flexibility vs Simplicity** | BYOM curated vs open | Power user features vs beginner UX | Founder vision vs market demand |
| **Opinionated vs Flexible** | Managed vs self-hosted models | Defaults vs customization | Dogfooding vs external validation |
| **Transparency vs Revenue** | Passthrough vs marked-up pricing | Free tier vs paid features | Authenticity vs scalability storytelling |

### Meta-Analysis Template

```markdown
## Meta-Analysis: Cross-Topic Contradictions

### Tension 1: [Name]
- **Manifestation in Topic A**: [specific contradiction]
- **Manifestation in Topic B**: [specific contradiction]  
- **Manifestation in Topic C**: [specific contradiction]
- **Underlying Pattern**: [what's really happening]
- **Resolution Strategy**: [how to thread the needle]

### Tension 2: [Name]
...

### Unified Resolution
Position in the middle on all axes:
- Curated defaults with BYOM escape hatches
- Opinionated starters with visible customization paths
- Personal use authenticity with external validation
```

### Synthesis Diagram

```
┌─────────────────────────────────────────────────────┐
│         STRATEGIC TENSIONS ACROSS TOPICS            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────Curated────────────┐                 │
│  │                                  │                 │
│  │     ┌───────Product─────┐      │                 │
│  │     │                     │      │                 │
│  │     │  Simple Default    │      │                 │
│  │     │  Power Accessible  │      │                 │
│  │     │                     │      │                 │
│  │     └─────────────────────┘      │                 │
│  │                                  │                 │
│  │           vs                   │                 │
│  │                                  │                 │
│  └────────────Open BYOM───────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

This reveals that seemingly different strategic decisions often reduce to the same core tension: **how to serve power users without overwhelming beginners**.

## Anti-Patterns to Avoid

**DON'T:**
- Skip confidence scoring (makes findings non-actionable)
- Analyze only one product (no pattern validation)
- Deliver findings without decision frameworks
- Save to memory instead of MemPalace (loses taxonomy)
- Mix this with market sizing research (separate concerns)

**DO:**
- Analyze 3+ products for pattern recognition
- Assign confidence scores to every major finding
- Create decision matrices, not just descriptions
- File in MemPalace with product/topic taxonomy
- Separate product strategy from market opportunity research

## Related Skills

- `iterative-market-research`: For multi-iteration market validation with agent teams
- `revenue-opportunity-validation`: For validating business opportunities
- `writing-plans`: For implementation planning after strategy is set

---

## Usage Example

```
User: "Research how Notion, Coda, and Airtable handle database features. 
        What ships OOB vs requires configuration?"

1. Load this skill
2. Analyze each product across analysis dimensions
3. Synthesize common patterns and decision criteria
4. Build decision matrix for database feature strategy
5. Deliver findings with confidence scores
6. File in MemPalace under Product_Strategy → Database_Research
```