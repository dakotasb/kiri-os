---
name: market-intelligence-action-item-validation
description: Execute stale market research action items with fresh competitive intelligence. Validates previously-identified opportunities, pricing strategies, and investment timing against current market conditions with strict data freshness requirements. Use when refreshing quarterly strategic plans, validating opportunities before entry, or updating fundraising strategy based on stale prior research.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [market-intelligence, action-items, competitive-validation, data-freshness, opportunity-validation, quarterly-refresh, fundraising-timing]
---

# Market Intelligence Action Item Validation

## Overview

Execute previously-identified strategic action items with **strict data freshness requirements**. Validates that opportunities identified in prior research are still open, pricing strategies are still competitive, and investment timing is still favorable before committing resources.

**Key Differentiator:** Unlike general market research, this skill starts with **existing action items** from prior cycles and validates them against current conditions, flagging any data from previous periods as outdated.

## When to Use

**Use this skill when:**
- **Quarterly strategic planning** - refreshing Q1 opportunities for Q2 execution
- **Pre-market entry validation** - checking if identified opportunities still exist 3-6 months later
- **Fundraise timing validation** - confirming VC appetite/market conditions before launching raise
- **Pricing strategy refresh** - updating competitive pricing intelligence before launch
- **Stale research audit** - any research >90 days old needs validation before acting on it

**Critical Trigger:** User provides action items from prior research and asks you to "validate", "refresh", "check if still open", or "execute" with emphasis on recent data only.

**Don't use when:**
- Open-ended market exploration (use `iterative-market-research`)
- Single-topic deep-dive (use `product-strategy-research`)
- First-time fundraising prep (use `startup-investment-landscape-research`)
- Technical implementation questions

---

## Methodology

### Phase 0: Data Freshness Audit

**First step: Identify what data is stale**

```markdown
## Data Freshness Audit

| Source Type | Last Updated | Status | Action |
|-------------|--------------|--------|--------|
| Competitor pricing | 2024-12 | ⚠️ STALE | Pull 2025 pricing pages |
| Funding landscape | 2025-01 | ⚠️ AGED | Verify Q1-Q2 2025 activity |
| Market size data | 2024-08 | ❌ OUTDATED | Find 2025 projections |
| VC check sizes | 2024-11 | ⚠️ STALE | Refresh with Carta/Crunchbase |
```

**Hard Rule:** Any source from prior calendar year is flagged as OUTDATED. Current quarter sources preferred.

---

### Phase 1: Opportunity Validation

For each previously-identified opportunity:

| Validation Check | Sources | Pass Criteria |
|------------------|---------|---------------|
| **Still open?** | Recent funding announcements, acquisition news | No major competitor acquired, no market saturation |
| **Window closing?** | Gartner cycle position, consolidation signals | Not yet at "Trough of Disillusionment" |
| **New threats?** | YC/tech press, Product Hunt launches | No direct YC competitor in last batch |
| **Pricing still valid?** | Competitor pricing pages (current) | Target price point still underserves market |

**Key Questions:**
- Have any major acquisitions/consolidations occurred in this space?
- Is the market moving from "Peak of Inflated Expectations" to "Trough"?
- Are new VC-backed competitors emerging?
- Has pricing moved against us (competitor dropped prices)?

**Flag with confidence:**
- **GREEN:** Opportunity still open, no major changes
- **YELLOW:** Proceed with caution, monitor closely
- **RED:** Opportunity closed or saturated, pivot

---

### Phase 2: Competitive Pricing Refresh

**Extract current pricing from all key competitors:**

| Competitor | Prior Price (Date) | Current Price (Date) | Change | Impact |
|------------|-------------------|---------------------|--------|--------|
| n8n | $20-50 (2024) | €20-50 (~$22-55) | Currency shift | Neutral |
| Dify | $29 (2024) | $59 (2025) | +103% | ⬆️ Opportunity |
| Langflow | Freemium (2024) | Free/Enterprise (2025) | IBM acquired | ⚠️ Changed |

**Key Validation:**
- Are competitors raising prices (opportunity to undercut)?
- Are competitors removing pricing tiers (consolidation signal)?
- Is BYOM still differentiator or now table stakes?

**Calculation:** What can we charge NOW vs what customers currently pay?

---

### Phase 3: Investment Timing Validation

**Refresh VC landscape for your sector:**

| Check | Prior Finding | Current Status | Verification Source |
|-------|--------------|--------------|---------------------|
| Active VCs | List from prior | Still deploying? | Recent deals (6 months) |
| Check sizes | $X-YM | Still valid? | Crunchbase, Carta reports |
| SAFE caps | $10-15M | Still market? | Carta State of Seed |
| Valuation multiples | 20-40x ARR | Still valid? | Recent comparables |

**Key Questions:**
- Are the same VCs from prior research still actively deploying?
- Have check sizes/valuations shifted significantly?
- Have any VCs publicly announced "pausing" this sector?

**Timing Signal:**
- **PROCEED:** Market still active, no major shifts
- **DELAY:** Cooling market, consider waiting 3-6 months
- **PIVOT:** Different sector/approach needed

---

### Phase 4: Synthesis & Updated Recommendations

**Produce validated action plan:**

```markdown
## Validated Action Items

### Data Freshness Summary
- Sources from 2025-2026: [N]
- Sources flagged outdated: [N]
- Confidence (all 2025-2026 data): [4.0-5.0 average]

### Updated Opportunity Assessment
| Opportunity | Prior Status | Current Status | Confidence |
|-------------|--------------|----------------|------------|
| #1 | Open | ✅ Still open, 9-12mo window | 4.5/5 |
| #2 | Open | ⚠️ YELLOW - monitor vs enter | 3.5/5 |
| #3 | Open | ❌ CLOSED - saturated | 3.0/5 |

### Updated Pricing
| Tier | Prior Target | Updated Target | Rationale |
|------|--------------|----------------|-----------|
| Starter | $25 | $29 | Undercut Dify's new $59 price |

### Updated Fundraise Strategy
| Element | Prior Plan | Updated Plan | Rationale |
|---------|-----------|--------------|-----------|
| Raise size | $350K | $350K | Consistent |
| Valuation cap | $2M | $10-15M | Market moved up |
| Target VCs | [List] | [Updated list] | Some inactive |
```

---

## VC Slowdown Tracking Template

Use this table to assess 2024 favorites vs 2025 activity:

```markdown
### 2024 Favorites — 2025 Slowdown Assessment

| Firm | 2024 Activity | 2025 Deals Found | Assessment | Strategy |
|------|---------------|------------------|------------|----------|
| [Tiger Global] | Heavy AI deployment | [None / Few] | ⚠️ **SLOWDOWN** | Avoid/Deprioritize |
| [a16z] | AI-native | [Cursor, etc.] | ✅ **SUSTAINED** | Tier 1 Target |
| [Thrive] | Mega-deals | [OpenAI $110B] | ✅ **SUSTAINED** | Tier 1 Target |
| ... | ... | ... | ... | ... |

**Key Insight:** Mega-funds (Tiger, Coatue, Insight) often pull back first in cooling markets while focused funds (a16z, NFX, Thrive) remain active.
```

## Risk Matrix: Acquisitions as Risk Signal

Track major acquisitions as both validation AND competitive pressure:

```markdown
| Acquisition | Value | Acquirer | Signal | Risk Score |
|-------------|-------|----------|--------|------------|
| [Adept AI → Amazon] | $1B | Big Tech | Acquihire vs product buy | 4/5 |
| [Manus AI → Meta] | $2B+ | Big Tech | Competitive removal | 5/5 |
| [Windsurf → Google] | $2.4B | Big Tech | Market validation + pressure | 5/5 |

**Interpretation:** Large acquisitions validate the space but remove independent competitors, narrowing the window for new entrants.
```

## Output Format

### Executive Summary Template
```markdown
# ACTION ITEMS EXECUTION REPORT

## Data Freshness Audit
- Sources from [CURRENT_YEAR]: [N]
- Sources flagged outdated: [N]
- VC Slowdown Analysis: [Table completed]
- Acquisition Risk Signals: [Table completed]

## Action Item 1: [Prior Title]
[Updated assessment with fresh data]
**Verdict:** ✅ Proceed / ⚠️ Proceed with caution / ❌ Do not proceed

## Action Item 2: [Prior Title]
...

## Confidence Scores
[All based on CURRENT_YEAR data only]

## Immediate Recommendations
- Next 7 days: [Critical actions]
- Next 30 days: [Follow-up actions]
- ⚠️ Warnings: [Critical market shifts]
- ⏰ Fundraise Window: [Urgent/Opening/Narrowing based on 2024 favorites assessment]
```

---

## Data Sources by Category

### Pricing Intelligence
- **Direct:** Competitor pricing pages (browser_navigate/curl)
- **Verification:** Product Hunt launches, Twitter announcements
- **Confidence:** 4.5/5 for extracted pricing

### Funding Intelligence
- **VC Activity:** Crunchbase, TechCrunch funding announcements
- **Valuation Data:** Carta Data Desk reports, PitchBook
- **Market Trends:** CB Insights, venture capital newsletters
- **Confidence:** 4.0/5 for public deals, 3.5/5 for rumored

### Market Saturation
- **GitHub:** Star growth rates (deceleration = saturation)
- **Product Hunt:** Launch frequency in category
- **Gartner Cycle:** Peak vs Trough positioning
- **Confidence:** 3.5-4.0/5

### Competitive Activity
- **YC Batches:** Direct competitor identification
- **Acquisitions:** TechCrunch, company blogs
- **Hiring:** LinkedIn job postings (growth signal)
- **Confidence:** 4.0/5 for public announcements

---

## Confidence Scoring

| Score | Meaning | Usage |
|-------|---------|-------|
| **5/5** | Directly extracted pricing, announced funding, validated by multiple sources | Make decisions on this |
| **4/5** | Strong evidence, expert consensus, direct page extraction | Standard confidence |
| **3/5** | Pattern-based inference, limited fresh data | Note uncertainty |
| **2/5** | Aged data, educated guess | Needs validation |
| **1/5** | Speculation, outdated, unreliable | Do not use |

**All findings must be based on CURRENT_YEAR data to receive confidence ≥4/5.**

---

## Anti-Patterns

**DON'T:**
- Skip the data freshness audit (hidden stale data undermines entire report)
- Assume prior findings are still valid (market moves fast)
- Use 2024 data to make 2026 decisions without flagging
- Skip validation of identified competitors (they may have been acquired)
- Ignore market cycle positioning (entering at trough vs peak matters)

**DO:**
- Flag ALL data from prior calendar year as outdated
- Seek fresh sources even if it means higher effort
- Validate each prior opportunity independently
- Update pricing strategy based on CURRENT competitor prices
- Provide clear go/no-go verdicts, not "maybe"

---

## Related Skills

- `startup-investment-landscape-research`: For first-time fundraising research (not refreshes)
- `product-strategy-research`: For deep-dive on specific strategic questions
- `iterative-market-research`: For multi-iteration market validation
- `competitive-intelligence-analysis`: For rapid analysis of single news events

---

## Usage Example

```
User: "Three months ago we identified AI Agent Orchestration as our 
        market entry opportunity. Execute the action items:
        1. Validate if opportunity still open
        2. Refresh pricing strategy vs competitors
        3. Update fundraising prep for Q2 2025
        
        Data freshness requirement: 2025-2026 only"

Workflow:
1. Audit data freshness from prior research
2. Validate Opportunity #1: AI Agent Orchestration
   - Check for 2025 acquisitions
   - Check YC W25 for competitors
   - Verify market not at trough yet
3. Refresh competitor pricing
   - n8n: Extract current pricing
   - Dify: Extract current pricing
   - Calculate new Kiri pricing
4. Validate investment timing
   - Check VC activity Q1-Q2 2025
   - Verify SAFE caps still valid
   - Update target investor list
5. Produce validated action report
6. Save to MemPalace with execution recommendations

Output: "Opportunity still open but window narrowed to 9-12 months. 
          Dify raised prices 103% - opportunity to undercut. 
          SAFE caps moved up to $10-15M. Proceed with urgency."
```