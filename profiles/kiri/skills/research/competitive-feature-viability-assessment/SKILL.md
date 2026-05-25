---
name: competitive-feature-viability-assessment
description: Systematically assess whether a specific technical feature should be treated as a market differentiator. Use when evaluating if a feature was properly weighted in viability assessments, conducting competitive gap analysis, modeling revenue impact with/without a feature, or making Lead/Include/Deprioritize strategic recommendations.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [competitive-analysis, feature-viability, strategic-positioning, revenue-modeling, market-differentiation, lead-include-deprioritize]
---

# Competitive Feature Viability Assessment

## Overview

Evaluate whether a specific technical feature deserves to be a **market differentiator** or should be treated as **table stakes**. This skill provides structured analysis for the critical product strategy question: *"Should we lead with this feature, include it but don't emphasize it, or deprioritize it?"*

**Key Differentiator:** Goes beyond "do we have this feature?" to "should this feature drive our positioning and pricing?" Includes revenue impact modeling with/without the feature.

## When to Use

**Use this skill when:**
- **User asks:** "Did we factor in [feature X] in our market viability assessment?"
- **Evaluating:** Whether a technical capability should be a primary differentiator
- **Deciding:** Lead vs Include vs Deprioritize for a specific feature
- **Modeling:** Revenue impact scenarios (with vs without the feature)
- **Assessing:** Competitive gaps in feature capabilities
- **Validating:** Whether architectural decisions have market viability implications

**Trigger Phrases:**
- "Did we consider [feature] in our assessment?"
- "Should we lead with [capability]?"
- "Is [feature] a differentiator or table stakes?"
- "Model revenue with and without [capability]"
- "Who else has [feature]?"

**Don't use when:**
- General competitive intelligence (use `competitive-intelligence-analysis`)
- Multi-topic strategic synthesis (use `product-strategy-research`)
- Market sizing/TAM research (use `iterative-market-research`)
- Technical implementation planning (use `writing-plans`)

---

## Analysis Framework

### Step 1: Feature Definition & Technical Specification

**Clarify what the feature actually is:**

```markdown
## Feature Specification

**Feature Name:** [Clear name]

**Technical Definition:**
- What it does: [One sentence]
- How it works: [Brief technical description]
- Architecture: [System-level vs workflow-level vs agent-level]

**Example Configuration:**
```json
{
  "primary": "model-X",
  "fallback": ["model-Y", "model-Z"],
  "task_mapping": { ... }
}
```

**Key Capabilities:**
1. [Capability 1]
2. [Capability 2]
3. [Capability 3]
```

**Critical Distinction:** Define at the **class level** — e.g., "multi-model per agent" not "Kiri's specific implementation."

---

### Step 2: Competitive Gap Analysis

**Research: Who has this feature natively vs via workarounds**

| Competitor | Feature Present | Implementation | User Experience |
|------------|-----------------|----------------|-------------------|
| **Competitor A** | ✅ YES / ❌ NO | Native / Workflow-level / Code-level | Automatic / Manual |
| **Competitor B** | ✅ YES / ❌ NO | Native / Workflow-level / Code-level | Automatic / Manual |
| **Competitor C** | ✅ YES / ❌ NO | Native / Workflow-level / Code-level | Automatic / Manual |

**Critical Questions:**
1. Do competitors have this **natively** or only via workarounds?
2. Is it **system-level** (built-in) or **user-implemented** (code/config)?
3. What's the **UX friction** — automatic or manual?

**Competitive Position Matrix:**

```
                    HIGH UX FRICTION
                           │
    User Implemented ──────┼───────── User Implemented
    (Workarounds)          │          (Workarounds)
                           │
    ───────────────────────┼────────────────────────
                           │
    Native/System-Level ───┼───────── Native/System-Level
    (Competitor Weakness)    │          (Competitor Strength)
                           │
                    LOW UX FRICTION
```

**Key Insight:** Features in the top-left (user-implemented, high friction) represent the biggest opportunity. Features in the bottom-right (native, low friction) may already be table stakes.

---

### Step 3: Customer Value Assessment

**Identify who cares and how much they'll pay:**

| Customer Segment | Size | Pain Point | Willingness to Pay | Use Case Example |
|----------------|------|------------|-------------------|------------------|
| **Segment A** | Small/Medium/Large | [Specific pain] | HIGH/MEDIUM/LOW | [Concrete example] |
| **Segment B** | Small/Medium/Large | [Specific pain] | HIGH/MEDIUM/LOW | [Concrete example] |

**Value Proposition Mapping:**

```markdown
## Customer Value Summary

✅ **Cost savings** — How this feature reduces customer spend
✅ **Compliance** — Regulatory/enterprise requirements addressed
✅ **Resilience** — Risk reduction, uptime improvement
✅ **Quality** — Output quality enhancement
✅ **Time savings** — Workflow efficiency gains
```

**Willingness-to-Pay Evidence:**
- Do competitors charge extra for this? (e.g., gated behind Pro tier)
- Do customers complain about lack of this feature? (Reddit/GitHub issues)
- Is this feature requested in enterprise RFPs?

---

### Step 4: Revenue Impact Modeling

**Quantify the business impact of having vs not having this feature:**

#### Baseline: WITHOUT the Feature

| Metric | Value |
|--------|-------|
| Competitive Position | [e.g., "Commodity player"] |
| Comparable to | [Competitors without this] |
| Sustainable Pricing | $[X]-$[Y]/mo (commodity range) |
| Enterprise Appeal | LOW/MEDIUM/HIGH |
| Year 3 ARR Projection | $[Amount] |

#### With the Feature

| Metric | Conservative | Aggressive |
|--------|--------------|------------|
| **Monthly Pricing** | $[X]-$[Y]/mo | $[A]-$[B]/mo |
| **Pricing Premium** | +[X]% over baseline | +[Y]% over baseline |
| **Enterprise Appeal** | MEDIUM/HIGH | HIGH/VERY HIGH |
| **Year 3 ARR** | $[Amount] | $[Amount] |
| **Switching Costs** | LOW/MEDIUM/HIGH | MEDIUM/HIGH/VERY HIGH |

**Pricing Power Evidence:**
- Competitor pricing that validates willingness to pay
- Enterprise contract requirements
- Industry reports on customer priorities

**Cost Structure Impact:**

| Factor | Impact |
|--------|--------|
| Development Cost | [Minimal/Medium/High] — One-time |
| Ongoing Maintenance | [Minimal/Medium/High] — Recurring |
| Support Burden | [Increase/Decrease/Neutral] — Why? |
| Net Margin Impact | [Positive/Negative/Neutral] |

---

### Step 5: Strategic Recommendation (Lead/Include/Deprioritize)

**The critical decision:**

```
┌─────────────────────────────────────────────────────────┐
│                    POSITIONING DECISION                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   LEAD              INCLUDE              DEPRIORITIZE   │
│   (Primary          (Ship it,          (Nice-to-have,  │
│    positioning)      don't sell)       other signals   │
│                        stronger)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**LEAD when:**
- No competitor has this natively (wide gap)
- Customer willingness to pay is HIGH
- Feature is easily understood by non-technical buyers
- Timing is optimal (emerging demand, not yet saturated)

**INCLUDE when:**
- Some competitors have it, some don't
- Enables premium pricing but isn't the only story
- Technical buyers understand value, others need education
- Supports overall positioning without being the headline

**DEPRIORITIZE when:**
- All competitors have it (table stakes)
- Low willingness to pay
- Confuses non-technical buyers
- Engineering cost outweighs benefit

**Positioning Strategy Template:**

```markdown
## Recommendation: [LEAD / INCLUDE / DEPRIORITIZE]

**Rationale:** [2-3 sentences]

**Messaging Hierarchy:**
1. **Lead Message:** [Primary positioning — what we lead with]
2. **Secondary Message:** [How this feature supports]
3. **Tertiary Message:** [Additional context]

**Do NOT say:** [Phrases/concepts that confuse or mislead]
**DO say:** [Clear value proposition]
```

---

### Step 6: Market Timing Analysis

**Why now vs later:**

| Factor | Status | Implication |
|--------|--------|-------------|
| **Industry Maturity** | Emerging/Mature/Saturated | [Timing implication] |
| **Customer Awareness** | Low/Medium/High | [Urgency implication] |
| **Competitive Window** | Wide/Narrowing/Closed | [Strategy implication] |
| **Technical Enablers** | Ready/Emerging/Not ready | [Feasibility] |

**Risk of Waiting:**
- First-mover advantage eroding?
- Commoditization accelerating?
- Switching costs decreasing?

---

## Output Format

```markdown
# [FEATURE NAME]: COMPETITIVE VIABILITY ASSESSMENT

## Executive Finding
**RECOMMENDATION:** [LEAD / INCLUDE / DEPRIORITIZE]
**Confidence:** [X]/10

[Brief statement of what this feature enables and why]

## Answer to Core Question
[Direct answer to user's "did we factor this in" question]

## Competitive Analysis

### Capability Comparison
| Competitor | Feature Present | Implementation | UX |

### Key Insight
[What the competitive landscape reveals about this feature's rarity]

## Customer Impact

### Who Cares
| Segment | Willingness to Pay | Use Case |

### Value Summary
[Top 3-5 value propositions]

## Revenue Impact

### Without (Baseline)
| Metric | Value |

### With (Scenarios)
| Metric | Conservative | Aggressive |

## Market Timing

[Why now vs later analysis]

## Strategic Recommendation

**Why [LEAD/INCLUDE/DEPRIORITIZE]:**
- [Rationale 1]
- [Rationale 2]
- [Rationale 3]

**Messaging:**
- Lead with: [Message]
- Not: [What to avoid]

## Implementation Priority

| Component | Priority | Rationale |
|-----------|----------|-----------|
| [Component 1] | P0 | [Why] |
| [Component 2] | P1 | [Why] |

## Conclusion

[Summary and next actions]
```

---

## Example: Multi-Model Per Agent Assessment

**Feature:** Each agent has multiple models with task-specific routing and automatic failover

**Competitive Analysis:**
| Tool | Multi-Model Per Agent? | Implementation |
|------|------------------------|----------------|
| n8n | ❌ No | Workflow-level only |
| Dify | ❌ No | Single model per app |
| Relevance AI | ❌ No | Single model per agent |
| Langflow | ❌ No | Node-based |
| Kiri | ✅ YES | Built-in, automatic |

**Key Finding:** NO competitor offers true multi-model per agent natively.

**Recommendation:** **INCLUDE with STRATEGIC EMPHASIS**
- NOT "LEAD" because it's a feature, not a category
- NOT "DEPRIORITIZE" because it enables 2-3x pricing premium
- Enables $49-199/mo vs commodity $20-59/mo

---

## Anti-Patterns

**DON'T:**
- Assume technical differentiation = market differentiation
- Skip revenue modeling
- Overclaim uniqueness without checking competitors
- Recommend "LEAD" for infrastructure features non-technical buyers won't understand
- Ignore timing — features have market windows

**DO:**
- Distinguish between native capabilities and workarounds
- Model revenue impact with AND without the feature
- Position based on customer value, not technical elegance
- Be willing to recommend "DEPRIORITIZE" if it's table stakes

---

## Tools to Deploy

- `mcp_mempalace_search` — Check for prior research on this feature
- `mcp_mempalace_recall` — Pull existing competitive intelligence
- `web_search` / `browser_navigate` — Extract current competitor pricing/features
- `delegate_task` — Parallel competitor research (if many competitors)
- `mcp_mempalace_save` — File findings with taxonomy

---

## Related Skills

- `competitive-intelligence-analysis` — Rapid response to industry news (not feature assessment)
- `product-strategy-research` — Multi-topic strategic synthesis
- `market-intelligence-action-item-validation` — Validating stale research
- `iterative-market-research` — Multi-iteration market research

**Key Distinction:** This skill is for *specific feature viability* questions. Use other skills for general competitive intelligence or multi-topic strategy.

---

## Decision Tree

```
User asks: "Should we lead with [feature]?"
                    │
                    ▼
    ┌───────────────────────────────┐
    │ Is this about a SPECIFIC      │
    │ FEATURE's strategic value?    │
    └───────────────────────────────┘
         │                   │
        YES                 NO
         │                   │
         ▼                   ▼
    Use THIS skill      Use competitive-       
                        intelligence-analysis
                        (news response) or
                        product-strategy-
                        research (multi-topic)
```
