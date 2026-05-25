---
name: competitive-intelligence-analysis
description: Rapid analysis of industry news, competitor announcements, and market signals to extract validation, identify differentiation opportunities, and generate positioning narratives. Use when a user shares an article about a competitor or industry development that intersects with their product strategy.
version: 1.0.0
metadata:
  hermes:
    tags: [competitive-intelligence, positioning, differentiation, market-validation, rapid-response]
---

# Competitive Intelligence Analysis

## Overview

Rapid competitive positioning analysis when industry news validates or challenges your product thesis. Extracts validation signals, identifies differentiation opportunities, and generates narrative ammunition for investor pitches and strategic positioning.

**Key Differentiator:** Transforms external industry signals into internal strategic clarity — fast.

## When to Use

**Trigger:** User shares industry article, competitor announcement, or market signal that intersects with their product.

**Use when:**
- Major competitor publishes approach similar to yours
- Industry validation signals emerge (problem space confirmation)
- Need to position against existing player quickly
- Investor asks "how are you different from X?"
- Market category definition is shifting

**Output:** Positioning narrative + competitive comparison + strategic implications.

## Analysis Framework

### Step 1: Extract Core Thesis
Read the article/source and identify:
- What problem are they solving?
- What is their claimed approach?
- What patterns/technologies are they using?
- What validation does this provide?

### Step 2: Validation Assessment
How does this validate your thesis?
- ✅ Problem space confirmed (market exists)
- ✅ Approach partially valid (you're on right track)
- ⚠️ Different angle (opportunity to differentiate)
- ❌ Contradicts your approach (reevaluate or clarify)

### Step 3: Differentiation Mapping
Build direct comparison:

| Competitor | You | Implication |
|------------|-----|-------------|
| What they do | What you do | Why yours wins |

Focus on:
- Scope (what's included/excluded)
- Architecture (how it works)
- Philosophy (why it matters)

### Step 4: Positioning Narrative
Generate 3 key talking points:
1. **Validation:** "Even [credible player] discovered [problem]..."
2. **Differentiation:** "While they [X], we [Y]..."
3. **Evolution:** "They built [point solution], we built [platform/system]..."

### Step 5: Strategic Implications
- **Immediate:** Update investor pitch talking points?
- **Short-term:** Adjust messaging on website/deck?
- **Long-term:** Feature prioritization impact?

## Output Format

```markdown
## Competitive Analysis: [Competitor/Product]

### Article Summary
- **Source:** [Publication, date]
- **Key Thesis:** [One sentence]
- **Core Technology:** [What they're using]

### Validation Assessment
- ✅ Problem space confirmed: [Evidence]
- ✅ Approach validation: [What they got right]
- ⚠️ Differentiation opportunity: [Where you diverge]

### Competitive Comparison

| Dimension | Them | You | Advantage |
|-----------|------|-----|-----------|
| Scope | [Limited/System X] | [Broader/System Y] | [Why it matters] |
| Architecture | [How it works] | [How yours works] | [Technical moat] |
| Philosophy | [Their belief] | [Your belief] | [Strategic clarity] |

### Positioning Narrative

**For Investors:**
> "While [Competitor] recently discovered the importance of [X], Kiri was built from day one to address [Y]. They [point solution], we [platform approach]."

**Three Key Messages:**
1. [Validation message]
2. [Differentiation message]
3. [Evolution message]

### Strategic Implications
- **Now:** [Immediate action]
- **Next:** [Short-term adjustment]
- **Later:** [Long-term consideration]

### Moat Clarification
What validates yours vs theirs:
- [Your unique advantage 1]
- [Your unique advantage 2]
```

## Example: Slack Agent Context Management

**Article:** InfoQ — "How Slack Manages Context in Long-Running Multi-agent Systems"

**Their Approach:**
- Problem: Chat logs overflow context windows
- Solution: Structured memory, validation layers, distilled truth

**Validation for Kiri:**
- ✅ Context management is a real problem (Slack engineering credibility)
- ✅ Structured memory beats raw logs (MemPalace validated)
- ✅ Validation layers matter (3-iteration pipeline validated)

**Differentiation:**
| Slack | Kiri |
|-------|------|
| Single conversation context | Cross-agent, cross-team organizational context |
| Reactive consolidation | Proactive parallel validation |
| Within-thread coordination | Cross-palace, cross-domain orchestration |

**Positioning Narrative:**
> "Slack just validated that agent context management is critical. While they're solving it for chat threads, Kiri solves it for agent organizations. They manage context within conversations; we orchestrate context across agent teams."

## Tools

- `web_extract` or `browser_navigate` — Read article content
- `web_search` — Validate claims, find additional sources
- `mcp_mempalace_search` — Check for existing competitive analysis
- `mcp_mempalace_save` — File analysis with taxonomy (competitive_intelligence → [competitor])

## Anti-Patterns

**DON'T:**
- Dismiss competitors without understanding their approach
- Overclaim differentiation without evidence
- Ignore validation signals (even from competitors)
- Generate analysis without specific article/source reference

**DO:**
- Give credit where competitors are right (builds credibility)
- Focus on architectural/philosophical differences (not just features)
- Connect to investor/customer narrative immediately
- File for future reference (competitive landscape tracking)

## Related Skills

- `product-strategy-research` — Deep strategic research (not rapid response)
- `iterative-market-research` — Multi-iteration market validation
- `founder-power-user-pitch` — Positioning for investor narratives
