---
name: expanded-market-opportunity-scan
description: Conduct cross-category market research to identify NEW revenue opportunities beyond existing theses. Analyzes 5-8 pre-defined market categories, synthesizes from existing research sources (MemPalace, competitive intel), and outputs 3-7 novel opportunity recommendations with confidence scoring. Use when instructed to "expand research" or discover new opportunities "beyond recursive patterns" across multiple market segments.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [market-research, opportunity-identification, cross-category-synthesis, strategic-research, revenue-opportunities, expanded-research]
---

# Expanded Market Opportunity Scan

## Overview

This skill conducts **cross-category market research** to identify NEW revenue opportunities that are NOT duplicates of or subsumed by existing theses. It synthesizes from existing research across multiple MemPalace sources and competitive intelligence to surface gaps and whitespace opportunities.

**Key Differentiator:** Finds *new* opportunities across *multiple* categories simultaneously — not validation of existing hypotheses.

**Typical Scope:** 5-8 market categories → 3-7 novel opportunity recommendations

## When to Use

**Use this skill when:**
- User explicitly requests "expanded research" or "discover new trends beyond recursive patterns"
- Task includes analyzing "N categories" of market trends simultaneously
- Goal is to identify **NEW** opportunities (not validate existing ones)
- Research requires synthesis across existing MemPalace research + competitive intelligence
- Output should include: market sizing, buyer personas, revenue potential, competitive gaps
- Confidence scoring is required for each opportunity

**Typical Trigger Language:**
- "Expand research to X categories"
- "Discover opportunities beyond [existing thesis]"
- "NEW trends beyond recursive patterns"
- "Iterative expansion research"
- Cross-category market intelligence requests

**Don't use when:**
- Validating specific existing opportunity (use `revenue-opportunity-validation`)
- Single-topic deep research (use `product-strategy-research`)
- Multi-iteration research with agent teams (use `iterative-market-research`)
- Quick answer needed without comprehensive scanning

## Research Architecture

### Pre-Defined Category Structure

Research spans **5-8 standardized market categories** (typical set shown below — adjust per task):

| Category | Focus | Key Questions |
|----------|-------|---------------|
| **A)** Infrastructure Evolution | Orchestration patterns, multi-agent architectures | What's changing in how agents are built/deployed? |
| **B)** Enterprise Adoption | Buying patterns, security/compliance requirements | How do enterprises buy? What blocks purchases? |
| **C)** Model Landscape | Open weights maturity, BYOM trends, cost shifts | How is model economics changing? |
| **D)** Developer Tooling | IDE-native agents, low-code convergence | Where is developer experience heading? |
| **E)** Adjacent Markets | Agent marketplaces, A2A commerce, KG infrastructure | What new markets are spawning? |
| **F)** Regulatory Trends | EU AI Act, liability frameworks | What compliance requirements are emerging? |

### Data Sources

**Primary Sources:**
- `mcp_mempalace_search` across multiple palaces (market_research, competitive_intel, kiri_strategic)
- `mcp_mempalace_recall` for specific rooms/topics
- `mcp_mempalace_get_taxonomy` to understand existing structure
- Historical research from previous iterations

**Secondary Sources:**
- Competitive landscape reports in MemPalace
- Pricing research from BYOM strategy
- Funding/competitive intelligence
- Existing agent organization research

**Sources NOT typically used in this skill:**
- Fresh web search (relies on synthesized existing research)
- Live competitor pricing (historical data sufficient)
- Primary customer interviews (opportunity identification, not validation)

## Execution Workflow

### Step 1: Context Collection

**Pull existing research:**
```python
# Illuminate to select appropriate palace
mcp_mempalace_illuminate(context="[task context keywords]")

# Search across relevant palaces
mcp_mempalace_search(query="[category keywords]", limit=10)
mcp_mempalace_recall(wing="[wing_name]", room="[room_name]")

# Get taxonomy to understand structure
mcp_mempalace_get_taxonomy(palace="market_research_palace")
```

**Goal:** Map existing research coverage, identify knowledge gaps per category

### Step 2: Category Analysis (Parallel or Sequential)

For each of the 5-8 categories:

**Analysis Template:**
```markdown
## CATEGORY [X]: [Name]

### Summary
[2-3 sentence trend summary]

### Key Findings from MemPalace
- Finding 1: [Source + confidence]
- Finding 2: [Source + confidence]
- Finding N: [Source + confidence]

### Market Dynamics
- **Market Size:** $X-XB (source)
- **Growth Rate:** X% CAGR
- **Key Players:** [List]
- **Pricing Trends:** [Summary]

### Strategic Implications
- What's changing?
- What's underserved?
- Competitive gaps?

### NEW INSIGHT: [Opportunity Name]
[Gap identified + market context]
```

### Step 3: Cross-Category Synthesis

**Pattern Recognition:**
- Look for themes across multiple categories
- Identify convergence points
- Map category intersections (e.g., Regulatory + Enterprise = Compliance opportunity)

**Synthesis Questions:**
1. Which gaps appear in multiple categories?
2. Where is market whitespace most pronounced?
3. What opportunities are NOT covered by existing research?
4. Which buyer personas span multiple categories?

### Step 4: Opportunity Identification

**Generate 3-7 NEW opportunities** using this framework:

```markdown
### OPPORTUNITY #[N]: [Name]
**Category:** [Primary category]  
**Confidence:** [1-5]/5  
**Market Size:** $X-XB (TAM), $X-XB obtainable (SOM)  

**Gap Identified:**
[What specific market need is unmet?]

**Market Context:**
- [Supporting evidence from category analysis]
- [Competitive landscape gap]

**Buyer Persona:**
[Who pays? Role, company size, pain point]

**Revenue Potential:**
- Pricing: $X-$Y/mo or transaction-based
- Market penetration: X% of TAM
- Revenue estimate: $X-XM obtainable

**Kiri Position:**
[Why Kiri/other organization is well-positioned]
```

### Step 5: Confidence Scoring

**Confidence Methodology:**

| Score | Meaning | Evidence Required |
|-------|---------|-------------------|
| 5/5 | Certain | Direct market data, validated demand, clear competitive gap |
| 4/5 | High | Strong pattern recognition, comparable data, clear reasoning |
| 3.5/5 | Medium | Trend analysis, indirect evidence, plausible reasoning |
| 3/5 | Moderate | Hypothesis-driven, requires validation |
| ≤2/5 | Low | Insufficient evidence — exclude or flag |

**Overall Research Confidence:**
Calculate based on: number of corroborating sources, cross-category validation, historical accuracy of sources

### Step 6: Strategic Recommendations

**Priority Matrix:**

| Opportunity | Risk/Reward | Timeline | Kiri Advantage |
|-------------|-------------|----------|----------------|
| [Name] | Low/Med/High | Immediate/Medium/Long | Strong/Competitive/Opportunity |

**Immediate (0-6 months):** Low-risk, implementable now  
**Medium-term (6-12 months):** Requires development/build  
**Long-term (12-24+ months):** Market creation plays

## Output Format

```markdown
# [PROJECT] EXPANDED RESEARCH — ITERATION [N]
## [Scope Description]

**Research Date:** [Date]  
**Categories Analyzed:** N (list them)  
**Sources:** MemPalace existing research, competitive intelligence  

---

## EXECUTIVE SUMMARY

[2-3 paragraph high-level summary]

**Key Discovery:** [N] NEW opportunities identified beyond existing thesis
**Overall Confidence:** [X]/5

---

## CATEGORY FINDINGS

### A) [Category Name]
[Findings...]

### B) [Category Name]
[Findings...]

[Continue for all categories...]

---

## [N] NEW REVENUE OPPORTUNITIES

### OPPORTUNITY #1: [Name]
**Category:** [Name]  
**Confidence:** [X]/5  
**Market Size:** $X-XB  
**SOM:** $X-XM obtainable  

**Gap Identified:** [Description]

**Buyer:** [Persona]
**Pricing:** [Model]
**Kiri Advantage:** [Why well-positioned]

### OPPORTUNITY #2: [Name]
[Same structure...]

---

## STRATEGIC RECOMMENDATIONS

### Immediate (0-6 months)
- [Opportunities to pursue now]

### Medium-term (6-12 months)
- [Development required]

### Long-term (12-24 months)
- [Market creation plays]

---

## RESEARCH METRICS
- **Categories covered:** N
- **Sources synthesized:** N
- **Opportunities identified:** N
- **Average confidence:** X/5
- **Saved to:** [MemPalace location]
```

## Save Locations

**Primary Save:**
```
market_research_palace/
└── {project_name}/
    └── expanded_research/
        └── iteration_{N}/
            └── executive_summary  [Drawer with full report]
```

**Alternative Structure:**
```
kiri_strategic_research/
└── expanded_research/
    └── iteration_{N}/
```

## Tools to Deploy

**Essential Tools:**
- `mcp_mempalace_search` — Find existing research across palaces
- `mcp_mempalace_recall` — Get specific room/topic data
- `mcp_mempalace_illuminate` — Select appropriate palace based on context
- `mcp_mempalace_get_taxonomy` — Understand palace structure
- `mcp_mempalace_save` — File final report with importance: 5 (strategic)

**Supporting Tools:**
- `todo` — Track category completion
- `session_search` — Check for previous similar research

## Anti-Patterns

**DON'T:**
- Treat this as validation of existing opportunities (wrong skill)
- Use fresh web search instead of existing MemPalace synthesis
- Generate <3 or >8 opportunities (quality degrades)
- Skip confidence scoring (makes output non-actionable)
- Duplicate opportunities covered in existing research
- Skip category structure — ad-hoc research yields gaps

**DO:**
- Define categories BEFORE starting research
- Synthesize existing research before stating "new" findings
- Document sources for every major claim
- Score confidence on every opportunity
- Map how findings relate to existing research
- Save to structured MemPalace location

## Comparison with Related Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **expanded-market-opportunity-scan** | Identify NEW opportunities across categories | "Expand research to X categories", discover new trends |
| iterative-market-research | Harden evidence via multi-iteration validation | "Let agents work overnight", cross-validate findings |
| product-strategy-research | Product-level strategic decisions | Pricing, OOB, feature strategy |
| revenue-opportunity-validation | Validate specific opportunity | "Is this opportunity real?" |

## Example Usage

```
User: "KIRI V6 EXPANDED RESEARCH — ITERATION 1

Goal: Discover NEW trends beyond recursive patterns using revenue-focused expertise.

EXPANDED CATEGORIES:
A) Agent Infrastructure Evolution
B) Enterprise AI Adoption
C) Model Landscape Shifts
D) Developer Tooling Convergence
E) Emerging Adjacent Markets
F) Regulatory & Ethical Trends

Tasks:
1. Pull context from market_research_palace
2. Conduct market trend discovery across all 6 categories
3. Identify 3-5 NEW opportunities not covered in previous cycles
4. Document with sources + confidence scoring

Focus on: Market sizing, buyer personas, revenue potential, competitive gaps

Save to: market_research_palace/kiriv6/expanded_research/iteration_1"

===

Your execution:
1. Load this skill
2. Illuminate MemPalace for context
3. Search across 6 pre-defined categories
4. Synthesize findings per category
5. Identify 5 NEW opportunities
6. Confidence score each
7. Recommend priority/timeline
8. Save to specified location
```

---

## Key Success Indicators

**Quality Markers:**
- [ ] All N categories addressed with substantive findings
- [ ] 3-7 NEW opportunities identified (not duplicates)
- [ ] Each opportunity has: market size, buyer persona, pricing model, Kiri advantage
- [ ] Confidence scoring applied systematically
- [ ] Sources cited from MemPalace
- [ ] Strategic priority/timeline recommendations included

**Completion Checklist:**
- [ ] Research synthesized across all categories
- [ ] Opportunities distinct from existing research
- [ ] Confidence scores justified
- [ ] Saved to structured MemPalace location
- [ ] Executive summary captures key findings