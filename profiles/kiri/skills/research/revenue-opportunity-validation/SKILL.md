---
name: revenue-opportunity-validation
description: Validate business opportunities by auditing them against external market evidence while checking for self-selection bias. Use when users identify revenue opportunities, especially after building infrastructure, to determine if they represent genuine market demand or reverse-engineered thinking.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [revenue, opportunity, validation, bias-audit, market-research, monetization, business-analysis]
---

# Revenue Opportunity Validation with Bias Auditing

## Overview

The most dangerous opportunities are the ones that map perfectly to what you just built. This skill validates whether identified revenue opportunities represent genuine external market demand or self-referential thinking.

## When to Use

**CRITICAL - Use this skill when:**
- User asks about "revenue opportunities" or "monetization" after building something
- User says "we could sell X" and X maps to existing infrastructure
- The timeline suggests recency bias (built April 22, identified opportunities April 28)
- User requests "market research" on opportunities based on current capabilities

**Self-selection bias is extremely common and dangerous.** If the top opportunities match your recent builds exactly, you haven't found opportunities - you've found ways to monetize sunk costs.

## The Bias Audit Process

### Phase 1: Inventory What's Actually Built

**Before ANY market analysis, document existing infrastructure:**

1. **Search MemPalace for recent builds:**
   ```python
   # Find agent configs, infrastructure, recent deployments
   mcp_mempalace_mempalace_search("agent deployment recent")
   mcp_mempalace_mempalace_recall(wing="agent_org")
   ```

2. **Document the full inventory:**
   - How many agents/configured systems?
   - What reporting/cron jobs exist?
   - What infrastructure was recently deployed?
   - When were these built vs when opportunities were identified?

3. **Identify the temporal pattern:**
   ```
   Date X: Built infrastructure
   Date X+1: Identified opportunities
   
   If opportunities match build list → HIGH BIAS RISK
   ```

### Phase 2: External Market Validation

**Research real market data, NOT MemPalace:**

1. **Competitor Analysis (GitHub for OSS, websites for commercial):**
   ```bash
   # Get real traction numbers
   curl -s https://api.github.com/repos/owner/repo
   ```
   
   Key metrics:
   - GitHub stars (developer interest)
   - Forks (customization pain indicator - high % = pain)
   - Open issues (maturity level)
   - Creation date (market timing)

2. **Pricing Research (Live websites):**
   ```bash
   # Extract actual pricing from competitor sites
   curl -sL https://competitor.com/pricing | grep -o '\$[0-9]\+.*'
   ```
   
   Document:
   - Price points found
   - Tier structures
   - Pricing gaps (missing price ranges)

3. **Market Research Sources:**
   - Gartner/IDC reports (if accessible)
   - Industry publications
   - Hacker News discussions (sentiment analysis)
   - Reddit/forum complaints (pain point validation)

### Phase 3: The Alignment Check

**Compare opportunity to inventory:**

| Opportunity | Built Infrastructure | Match Level | Bias Risk |
|-------------|---------------------|-------------|-----------|
| AI Orchestration | 11 agents deployed | Exact | HIGH |
| SMB Reporting | 6 cron job reports | Exact | HIGH |
| Knowledge Graph | MemPalace Qdrant+Neo4j | Exact | HIGH |

**Red flag: Perfect alignment across all opportunities**

### Phase 4: External Validation Scoring

**Rate each opportunity independently:**

| Criterion | Source | Weight |
|-----------|--------|--------|
| Developer Interest | GitHub stars/forks | High |
| Competitor Pricing | Live site scraping | High |
| Customer Complaints | Reddit/HN/community | Medium |
| Market Size Claims | Analyst reports | Medium |
| Timing | GitHub creation dates | Medium |

**Validation Levels:**
- **STRONG**: 50K+ GitHub stars, multiple commercial competitors, clear pricing
- **MODERATE**: Some traction, competitors exist but unclear monetization
- **WEAK**: Novel concept, no direct competitors, unclear market demand

### Phase 5: Honest Assessment

**Produce three outputs:**

1. **Bias Audit Results**
   - Self-referential score (how closely opportunities match built infrastructure)
   - Timeline correlation (opportunities emerged immediately post-build?)
   - Alternative opportunities missed (internal capabilities repurposed as products)

2. **External Validation Rankings**
   - Each opportunity rated: STRONG/MODERATE/WEAK based on external evidence
   - Competitor pricing landscape
   - Market gap analysis

3. **Recommended Actions**
   - VALIDATED: Proceed with confidence
   - NEEDS DISCOVERY: Interview customers before building
   - ABANDON: No external validation, feature not product

## Decision Framework

```
HIGH Bias + STRONG Validation = Build, but check you're not anchored
HIGH Bias + WEAK Validation = Abandon - sunk cost fallacy
LOW Bias + STRONG Validation = Build - genuine opportunity
LOW Bias + WEAK Validation = Needs customer discovery
```

## Red Flags During Analysis

**STOP and flag bias when:**
- Every opportunity maps 1:1 to recent builds
- No customer interview transcripts exist
- Market size claims lack sources
- Timeline: built X, then "discovered" opportunity to sell X
- Competitor research consists of "they exist" not actual pricing/features

**The user may be experiencing:**
- **Availability bias**: Only considering what they've built
- **Sunk cost fallacy**: Needing to monetize existing infrastructure
- **Confirmation bias**: Seeing validation where none exists

## Example Output Structure

```markdown
## Bias Audit Results

**Self-Referential Score: HIGH**
- All 3 opportunities map directly to April 22-27 builds
- Zero customer interviews found
- Zero pre-sales commitments

## External Validation

### #1: AI Agent Orchestration
- GitHub Stars: CrewAI 50K, AutoGPT 184K, LangChain 135K
- Competitor Pricing: $50/mo (Relevance AI) → $3,990/mo (Beam AI)
- Gap: $200-500/mo underserved
- **Validation: STRONG**

### #2: SMB Reporting
- Competitors: Databox $72-288/mo, Geckoboard $49-599/mo
- Gap: AI-powered insights undersold as "AI feature" not core product
- **Validation: MODERATE** (market exists, AI angle unproven)

### #3: Knowledge Graph Platform
- Competitors: Neo4j $65-800/mo, Pinecone $70-1,000/mo
- Gap: None selling "knowledge graphs" - selling databases
- **Validation: WEAK** (cool tech, unclear market)

## Recommendations

1. #1 (Agent Orchestration): VALIDATED - proceed with customer interviews
2. #2 (SMB Reporting): NEEDS DISCOVERY - interview 5 SMB owners
3. #3 (MemPalace): ABANDON as standalone - integrate as feature of #1
```

## Tools to Use

- `mcp_mempalace_mempalace_search` - Inventory existing infrastructure
- `mcp_mempalace_mempalace_recall` - Get specific wing/hall data
- `curl` with GitHub API - Real competitor metrics
- `curl` to pricing pages - Live pricing extraction
- `delegate_task` - Parallelize research across multiple competitors

## Anti-Patterns to Avoid

**DON'T:**
- Skip bias checking because "I'm sure these are real opportunities"
- Use MemPalace data as evidence of market demand
- Assume high GitHub stars = willingness to pay
- Treat internal infrastructure usage as product validation
- Skip Phase 1 (inventory) even when user seems confident

**DO:**
- Always check the temporal relationship (build date vs opportunity date)
- Look for external evidence (GitHub stars ≠ sales, but indicate interest)
- Quote actual prices from live sites, not estimates
- Suggest customer discovery for anything that's not STRONG validation
- Be honest when bias is detected - it's a feature, not a bug

## Key Insight

**Users who just built something are the most likely to see monetization opportunities that don't exist.**

Your job is not to validate their enthusiasm - it's to protect them from wasting months on products no one asked for.

If bias is detected, say so clearly: "These opportunities map to what you built last week. That doesn't mean they're invalid, but it means we need external validation before proceeding."
