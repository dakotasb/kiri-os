---
name: startup-investment-landscape-research
description: Research investment landscapes for startup fundraising and strategic planning. Maps active VCs and their deployment patterns, analyzes funding round trends (SAFE vs priced), tracks valuation multiples over time, and builds risk matrices. Use when preparing to fundraise, evaluating market timing for a raise, or analyzing competitive funding activity.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [investment-research, fundraising, venture-capital, valuation-analysis, risk-matrix, market-timing, investor-mapping]
---

# Startup Investment Landscape Research

## Overview

Research the funding ecosystem for a specific sector or stage to inform fundraising strategy and market timing decisions. This skill produces structured analysis of:
- **Active investors** and their deployment patterns
- **Funding round trends** (SAFE vs priced rounds, stage sizes)
- **Valuation multiples** and how they're trending
- **Risk matrices** for investment in your sector
- **Market timing signals** (hot vs cooling markets)

**Key Value:** Get data-driven answers to "Is now a good time to fundraise?" and "Which VCs should we target?"

## When to Use

**Use this skill when:**
- Preparing for a fundraising round and need to understand the current market
- Evaluating whether to fundraise now vs wait 6-12 months
- Analyzing which investors are actively deploying in your sector
- Understanding valuation benchmarks for your stage
- Building a risk matrix for investor presentations
- Tracking how 2024 favorites are performing in 2025-2026

**Don't use when:**
- You need product strategy research (use product-strategy-research)
- You need general market sizing/TAM research (use iterative-market-research)
- You're already in active conversations with investors (too late for landscape research)
- You need company-specific due diligence (this is market-level analysis)

## Pre-Research: Context Gathering

**Before conducting new research, always:**

1. **Search existing research in the target palace:**
   - Use `mcp_mempalace_search` with keywords like "VC funding [year]", "investor activity", "valuation trends"
   - Look for previous iterations (e.g., iteration_1, iteration_2) in your project namespace
   - Review saved investor lists, funding round analyses, prior risk matrices

2. **Identify gaps from previous research:**
   - What time periods are already covered? (avoid redundant 2024 research when focusing on 2025)
   - Which investors were flagged as "watching" vs "active"?
   - What risk factors have materialized since last update?

3. **Determine what needs fresh data:**
   - Investor activity changes rapidly—update every 3-6 months for active fundraise prep
   - Valuation multiples shift with macro conditions—prioritize current data
   - Competitive acquisitions (e.g., Meta/Manus $2B+, Google/Windsurf $2.4B) signal market consolidation

**Critical Requirement:** Only use 2025-2026 funding data. 2024 data is stale for 2025-2026 fundraising decisions.

---

## Research Methodology

### Phase 1: Investor Mapping

**Identify Active Investors in Your Sector:**

| Data Point | Sources | Output |
|------------|---------|--------|
| Recent investments | Crunchbase, TechCrunch, company blogs | List of VCs who deployed in last 6-12 months |
| Check sizes | Funding announcements, pitch deck databases | Stage-by-stage check size ranges |
| Investment thesis | VC websites, partner blogs, podcast appearances | Thematic focus areas |
| Lead vs follow-on | Cap table analysis, announcement language | Identify potential leads vs followers |

**Key Questions:**
- Who are the top 10 most active investors in [sector] over the last 12 months?
- Which investors have done Series A/B in [sector] recently?
- Are there sector-specific funds or emerging managers?

**Save to:** `market_research_palace/{project}/investor_landscape/`

---

### Phase 2: Funding Round Analysis

**Map Recent Funding Activity:**

| Metric | 2024 Trend | 2025 Trend | Implication |
|--------|-----------|-----------|-------------|
| SAFE vs Priced | ~60% SAFE at seed | ~75% SAFE at seed | Faster closes, less negotiation |
| Bridge rounds | Rare | Common | Gap between seed and A widening |
| Pre-seed median | $2-3M | $1.5-2.5M | Slight compression |
| Series A median | $8-12M | $6-10M | More disciplined |

**Key Questions:**
- What percentage of seed rounds are SAFE vs priced in 2025?
- How much have valuations compressed from 2024 peaks?
- Are bridge rounds becoming more common?

**Focus on:** Jan 2025 - current date data only. Discard older data as it's less relevant in fast-moving markets.

**Save to:** `market_research_palace/{project}/funding_trends/`

---

### Phase 3: Valuation Multiple Analysis

**Track Valuation Trends:**

| Stage | 2024 Multiple | 2025 Multiple | Change |
|-------|--------------|---------------|---------|
| Pre-seed | $5-10M pre | $3-8M pre | -20-30% |
| Seed | $10-20M pre | $5-15M pre | -30-40% |
| Series A | $40-100M pre | $25-60M pre | -35-45% |
| Series B+ | 20-40x ARR | 15-25x ARR | -30-40% |

**Comparable Company Analysis:**
- Identify 5-10 comparable companies that raised in last 12 months
- Extract: Stage, amount, valuation (if public), ARR (if known), growth rate
- Calculate implied multiples: Revenue multiple, user multiple, growth-adjusted

**Key Questions:**
- What multiples are investors paying for [sector] companies?
- How does this compare to general SaaS/marketplace/[your category]?
- Are strategic acquirers active? What's their typical multiple?

**Save to:** `market_research_palace/{project}/valuation_benchmarks/`

---

### Phase 4: Risk Matrix Construction

**Build Sector-Specific Risk Matrix:**

| Risk Factor | Severity (1-5) | Likelihood (1-5) | Mitigation Strategy |
|-------------|---------------|------------------|---------------------|
| Mega-cap entrant | [1-5] | [1-5] | Last-mile positioning |
| Talent costs | [1-5] | [1-5] | Remote engineering |
| Regulatory uncertainty | [1-5] | [1-5] | Compliance-first architecture |
| Pricing model obsolescence | [1-5] | [1-5] | BYOM-first positioning |
| Market saturation | [1-5] | [1-5] | Vertical differentiation |

**Risk Categories to Consider:**
1. **Technology Risks:** Core tech becomes obsolete, reliability issues
2. **Market Risks:** Incumbent response, timing (too early/late), saturation
3. **Competitive Risks:** Open source alternatives, well-funded competitors
4. **Macro Risks:** Interest rates, recession impacts on venture funding
5. **Execution Risks:** Team gaps, burn rate, retention

**Key Questions:**
- What risks are top of mind for investors in this sector?
- How are comparable companies mitigating these risks?
- What risk factors are specific to [sector] vs general startup risks?

**Save to:** `market_research_palace/{project}/risk_analysis/`

---

### Phase 5: Market Status Check

**Track 2024 Favorites:**

| Company | 2024 Status | 2025 Update | Signal |
|---------|-------------|-------------|--------|
| [Competitor A] | Hot Series A | Still active/slowing | Market validation |
| [Competitor B] | Emerging | Acquired/failed/struggling | Sector risk |
| [Competitor C] | Well-funded | Hiring/expanding | Strong sector |

**Major Acquisitions as Market Signals:**
- Track acquisitions by Big Tech (Meta, Google, Microsoft, OpenAI) as validation signals
- Large acquisitions (> $1B) indicate strategic value and may remove competitive threats
- Small acquisitions (< $100M) may indicate acqui-hire or talent grabs, not market validation

**2025 Sentiment Analysis:**
- Are investors still actively deploying in this sector?
- Have any major funds announced they are "pausing" [sector] investments?
- Are LP dollars flowing into venture or pulling back?

**Key Questions:**
- Is this sector "hot" or "cooling" in 2025?
- Are investors writing smaller checks or taking longer to decide?
- Are follow-on rounds getting done or are companies struggling to raise?

---

## Deliverable Structure

### Executive Summary Template
```markdown
# Investment Landscape Summary: {Sector}

**Research Period:** {Start Date} - {End Date}

## Key Findings
- **Market Temperature:** Hot/Warm/Cool (evidence-based)
- **Valuation Environment:** Expanding/Stable/Compressing
- **Funding Velocity:** Increasing/Stable/Decreasing
- **Investor Appetite:** High/Moderate/Low for this sector

## Recommendation
- ** fundraise now:** [Yes/No/Maybe] with rationale
- **Target stage:** [Seed/Series A] 
- **Time to close:** [Fast 2-4 weeks / Normal 6-8 weeks / Slow 3+ months]
```

### Investor Target List Template
```markdown
## Tier 1 (Ideal Leads)
| Investor | Check Size | Recent Deals | Fit Score |
|----------|-----------|--------------|-----------|
| [Name] | $X-YM | [Company A, B] | High |

## Tier 2 (Potential Leads)
...

## Tier 3 (Follow-on Participants)
...
```

### Valuation Benchmarks Template
```markdown
## Comparable Funding Rounds (Last 12 Months)
| Company | Stage | Amount | Valuation | Revenue (est) | Multiple | Signal |
|---------|-------|--------|-------------|---------------|----------|--------|
| [Comp] | Series A | $XM | $YM | $ZM | 15x | Positive |

## Recommended Valuation Range
- **Conservative:** $X-YM pre
- **Market:** $Y-ZM pre
- **Stretch:** $Z-WM pre (requires exceptional traction)
```

### Risk Matrix Template
```markdown
## Risk Assessment ({Sector})
| Risk | Severity | Likelihood | Overall Risk | Mitigation |
|------|----------|------------|--------------|------------|
| [Risk 1] | H/M/L | H/M/L | [Calc] | [Strategy] |

**Overall Risk Rating:** Moderate/High/Low
**Key Risks to Address in Pitch:** [Top 3]
```

---

## Data Sources

### Primary Sources (High Confidence)
- **Crunchbase:** Funding rounds, investor activity, valuations
- **TechCrunch:** Funding announcements, market analysis
- **VC firm blogs/websites:** Investment thesis, partner insights
- **Company blog posts:** Funding announcements, traction metrics
- **GitHub:** Star counts, activity as proxy for traction

### Secondary Sources (Medium Confidence)
- **Pitch deck databases:** DocSend, SaaStr (anonymized data)
- **Industry newsletters:** Term Sheet, PitchBook, CB Insights
- **Founder forums:** IndieHackers, Hacker News funding threads
- **Podcast appearances:** Investor commentary on market

### Tertiary Sources (Lower Confidence - Use for Signal Only)
- **Twitter/X commentary:** Investor sentiment
- **LinkedIn activity:** Hiring patterns, expansion signals
- **Job postings:** Growth indicators

**Critical Note:** Always cite sources. Distinguish between "confirmed by public announcement" vs "market rumor."

---

## Confidence Scoring

| Score | Meaning | Usage |
|-------|---------|-------|
| **5/5** | Publicly announced funding, exact figures, confirmed by multiple sources | Build strategy on this |
| **4/5** | Strong industry consensus, reported by credible outlets, some data points | Standard confidence |
| **3/5** | Estimates based on patterns, extrapolated from partial data | Note uncertainty |
| **2/5** | Limited data, educated guesses, rumors | Needs validation |
| **1/5** | Speculation, outdated data | Do not rely on |

---

## Tools to Deploy

### For Data Gathering
- `mcp_mempalace_search`: Check for existing research
- `web_search` / `web_extract`: Gather current funding data
- `browser_navigate`: Scrape pricing pages, investor websites
- `curl`: Query APIs (GitHub, Crunchbase if available)

### For Analysis
- `terminal`: Create structured comparison tables
- `write_file`: Generate deliverables
- `delegate_task` (optional): Parallel research across sub-topics

### For Storage
- `mcp_mempalace_save`: File findings with taxonomy
  - **wing:** `{project}_funding_strategy`
  - **hall:** `investor_landscape`, `valuation_benchmarks`, `risk_analysis`
  - **room:** `2025_research`
  - **importance:** 4-5 (strategic fundraising data)

---

## Anti-Patterns

**DON'T:**
- Rely on 2023 or earlier data for 2025 decisions (market moves fast)
- Confuse product-market fit with funding-market fit (different things)
- Assume investors from 2024 are still active in 2025 (check recent deals)
- Ignore bridge rounds and down rounds (they're signals)
- Present data without confidence scores
- Build strategy on unverified rumors

**DO:**
- Focus on last 6-12 months of data
- Cross-reference multiple sources
- Distinguish between announced and rumored rounds
- Update research quarterly for active fundraise prep
- Document contradictions between sources
- Be honest about data limitations

---

## Related Skills

- `iterative-market-research`: For broader market sizing and multi-iteration validation
- `product-strategy-research`: For product/packaging decisions
- `revenue-opportunity-validation`: For validating business model before fundraising
- `founder-power-user-pitch`: For leveraging personal usage in pitch materials

---

## Usage Example

```
User: "We're a Series A AI agent company. Is now a good time to fundraise? 
        Which VCs should we target? What's our valuation range?"

1. Load startup-investment-landscape-research
2. Map active VCs in AI agent space (Q1-Q2 2025)
3. Analyze recent Series A valuations and multiples
4. Check SAFE vs priced trends
5. Build risk matrix for AI agent sector
6. Deliver: Investor target list, valuation benchmarks, timing recommendation

Output: "Recommendation: Proceed with Series A now. Target Bessemer, 
          Index, NFX. Conservative valuation: $25M pre (based on comps). 
          Market cooling but not frozen."
```