---
name: framework-validation-parallel-testing
description: Validate framework adaptability by running parallel product builds across multiple categories simultaneously. Generates comparable MVP packages (market briefs, concepts, UI mockups, viability scores) for 3+ hypothetical products, then synthesizes cross-category insights. Use when testing if a framework works across product types, comparing category difficulty, or gathering data on reusable patterns.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [framework-testing, parallel-validation, product-development, category-comparison, exploratory-research, pattern-extraction]
triggers:
  - test framework with multiple products
  - parallel product exploration
  - exploratory mission with different product types
  - validate framework across categories
  - run multiple product tests simultaneously
  - compare product category difficulty
  - gather framework insights with parallel builds
---

# Framework Validation via Parallel Product Testing

## Overview

Validate framework adaptability and gather reusable patterns by building **3+ different product MVPs simultaneously**. This skill generates complete product packages (market research, product concepts, UI mockups, viability scores) across diverse categories, then synthesizes comparative insights.

**The Promise:** Run the same framework against Health & Wellness, Finance, Content Creation (or any categories) and discover which product types are easiest to build, which UI patterns transfer, and what infrastructure is reusable.

**Key Output:** Not just individual products, but a `comparison_synthesis.md` documenting:
- Research difficulty by category
- Market opportunity vs viability gaps
- UI pattern commonalities
- Infrastructure component reuse potential
- Framework enhancement recommendations

## When to Use

**Use this skill when:**
- Testing if a framework adapts to different product types ("Does this work for X, Y, and Z?")
- Comparing product category difficulty before choosing what to build
- Gathering data on reusable UI components across product verticals
- Validating framework robustness with breadth-over-depth exploration
- Building a "product generator" and need to test category coverage
- Want insights on infrastructure commonalities (what's shared vs unique)
- **Trigger words:** "parallel", "exploratory", "test with multiple", "framework insights"

**Don't use when:**
- Building one specific product (use `product-idea-to-mvp`)
- Deep market research needed (use `iterative-market-research`)
- Strategic decision on one opportunity (use `product-strategy-research`)
- Time for depth over breadth (this is exploratory, not exhaustive)

## The 3-Product Parallel Structure

### Standard Configuration

```
~/product_test/exploratory_parallel/
├── {product_A}/
│   ├── market_brief.md          # Category-specific research
│   ├── product_concept.md       # Features, architecture, monetization
│   ├── ui_mockup.html          # Working prototype with mock data
│   └── viability_score.md      # Scored assessment (1-10 scale)
├── {product_B}/
│   ├── market_brief.md
│   ├── product_concept.md
│   ├── ui_mockup.html
│   └── viability_score.md
├── {product_C}/
│   ├── market_brief.md
│   ├── product_concept.md
│   ├── ui_mockup.html
│   └── viability_score.md
└── comparison_synthesis.md       # Cross-category analysis
```

### Product Category Selection

Choose 3 distinct categories to maximize insight variance:

| Category Type | Examples | What It Tests |
|---------------|----------|---------------|
| **Regulated** | Health, Finance, Legal | Framework's regulatory handling |
| **Creative** | Content, Design, Media | UI adaptability to visual workflows |
| **Infrastructure** | DevTools, APIs, Security | Technical depth handling |
| **Consumer** | Social, Lifestyle, Gaming | Engagement/growth mechanics |
| **B2B SaaS** | CRM, HR, Analytics | Enterprise feature complexity |

**Recommended triads for testing:**
- Health + Finance + Content (regulatory vs creative spectrum)
- DevTools + Marketplace + Consumer App (technical vs commercial)
- B2B + B2C + Infrastructure (audience type variance)

## Execution Pattern

### Phase 1: Parallel Market Briefs (20 min per product)

Spawn delegate_task agents simultaneously for each product:

```python
delegate_task(tasks=[
    {
        "context": "Product: Health Tracker for diabetes...",
        "goal": "Create market brief with TAM/SAM/SOM, competitors, pricing, pain points, regulatory considerations",
        "toolsets": ["web", "terminal", "file"]
    },
    {
        "context": "Product: Personal Finance Tracker...",
        "goal": "Create market brief...",
        "toolsets": ["web", "terminal", "file"]
    },
    {
        "context": "Product: YouTube Content Tool...",
        "goal": "Create market brief...",
        "toolsets": ["web", "terminal", "file"]
    }
])
```

**Market Brief Requirements:**
- Market size (TAM/SAM/SOM with sources)
- 5-7 key competitors with pricing
- User pain points from reviews
- Regulatory considerations (if applicable)
- API/integration requirements
- Growth trends and timing signals

### Phase 2: Parallel Product Concepts (15 min per product)

```python
delegate_task(tasks=[
    {
        "context": "Using market brief created, develop product concept...",
        "goal": "Create product concept with value prop, features, architecture, user journeys, differentiation, monetization",
        "toolsets": ["terminal", "file"]
    }
    # ... for each product
])
```

**Product Concept Requirements:**
- Core value proposition (one sentence)
- MVP features (P0) vs roadmap (P1/P2)
- Technical architecture overview
- 3-4 key user journeys
- Differentiation strategy vs competitors
- Pricing model and unit economics

### Phase 3: Parallel UI Mockups (20 min per product)

Use a single design system (Linear is recommended) adapted per category:

```html
<!-- Shared design tokens across all three -->
:root {
  --bg-primary: #08090a;          /* Linear dark */
  --text-primary: #f7f8f8;
  --font-family: 'Inter', sans-serif;
}

/* Category-specific accents */
--health-accent: #5e6ad2;         /* Indigo - trust */
--finance-accent: #10b981;        /* Emerald - growth */
--content-accent: #ff6b6b;          /* Coral - creative */
```

**UI Requirements:**
- Complete HTML file with inline CSS
- Dashboard-style layout (sidebar + main content)
- 4-6 interactive sections
- Mock data populated
- Responsive breakpoints
- Category-appropriate visual hierarchy

### Phase 4: Viability Scoring (5 min per product)

Score each product on consistent criteria:

```markdown
# Viability Score: {Product Name}

**Overall Score: X.X/10**

| Criteria | Score | Weight | Rationale |
|----------|-------|--------|-----------|
| Market Opportunity | X/10 | 20% | TAM, growth rate |
| Competition | X/10 | 15% | Barrier height |
| Technical Feasibility | X/10 | 20% | API availability, complexity |
| Regulatory Risk | X/10 | 15% | Compliance burden |
| Monetization | X/10 | 15% | Pricing power, LTV |
| Differentiation | X/10 | 15% | Moat, uniqueness |

**Key Strengths:** 3-5 bullets
**Key Risks:** 3-5 bullets
**Go/No-Go:** Recommendation with confidence %
```

### Phase 5: Synthesis Document (15 min)

Create `comparison_synthesis.md` with these sections:

#### 1. Executive Summary
- Total deliverables created
- Viability ranking (which product scored highest)
- Key finding (one sentence framework insight)

#### 2. Research Difficulty Comparison
- Rank products by time/effort to research
- Identify what made categories easy/hard
- **Framework insight:** Research burden by category type

#### 3. Market Opportunity vs Viability
- Which had biggest TAM vs best viability score
- Identify the "accessible opportunity" gap
- **Framework insight:** Market size ≠ viability

#### 4. UI Pattern Commonalities
- Which patterns worked across all three
- Which patterns needed category adaptation
- **Framework insight:** Reusable component library candidates

#### 5. Infrastructure Commonalities
- Shared technical needs (auth, dashboards, APIs)
- Category-specific requirements
- **Framework insight:** Extract common components

#### 6. Framework Recommendations
- What to add based on category gaps
- What patterns to extract for reuse
- **Framework insight:** Next version improvements

## Key Principles

### 1. Breadth Over Depth
- This is EXPLORATORY, not exhaustive
- Single-pass research (no iteration)
- Framework insight is the goal, not product perfection

### 2. Consistent Structure Enables Comparison
- Same document names across products
- Same scoring criteria
- Same design system base
- Comparison becomes automatic

### 3. Category Variance Reveals Framework Gaps
- Health = regulatory complexity test
- Finance = integration/API test
- Content = creative workflow test
- Each category stresses different framework dimensions

### 4. Parallel Execution Maximizes Insight Per Hour
- 3 products × 60 min = 180 min work
- Parallel execution = ~60 min elapsed
- Synthesis happens across all three simultaneously

## Output Validation

### File Completeness Check
```python
products = ['health_tracker', 'finance_tracker', 'content_tool']
expected_files = ['market_brief.md', 'product_concept.md', 'ui_mockup.html', 'viability_score.md']

for product in products:
    for file in expected_files:
        assert exists(f"~/product_test/exploratory_parallel/{product}/{file}")

assert exists("~/product_test/exploratory_parallel/comparison_synthesis.md")
```

### Synthesis Quality Checklist
- [ ] Research difficulty ranked with rationale
- [ ] Market opportunity vs viability gap identified
- [ ] 3+ UI patterns identified as reusable
- [ ] 2+ infrastructure components flagged for extraction
- [ ] Framework enhancement recommendations listed
- [ ] Total execution time documented

## Anti-Patterns

**DON'T:**
- Research one product deeply while others are shallow (breaks comparison)
- Skip the synthesis document (loses the framework insight value)
- Use different design systems per product (breaks pattern comparison)
- Treat this as building real products (it's framework testing)
- Forget to score viability on consistent criteria

**DO:**
- Run all three products in parallel via delegate_task
- Use consistent document structure across all products
- Extract reusable patterns explicitly in synthesis
- Time each phase for difficulty comparison
- Document category-specific framework gaps

## Related Skills

- `product-idea-to-mvp` — Use for single-product deep build (not parallel)
- `iterative-market-research` — Use for hardened research on one opportunity
- `product-strategy-research` — Use for strategic decision frameworks
- `popular-web-designs` — Design system templates for UI mockups
- `design-md` — Formal design system specification

## Example Usage

```
User: "Run exploratory test: build 3 products simultaneously to test framework adaptability
        - Health: diabetes tracker with AI meal suggestions
        - Finance: AI expense tracker with budget optimization  
        - Content: YouTube workflow tool with AI script writing"

Follow this skill to produce:
1. Three complete product packages with consistent structure
2. Viability scores revealing Finance as best opportunity (8.4/10)
3. Synthesis showing Health research takes 30% longer due to regulatory complexity
4. Identification of 5 reusable UI components
5. Framework recommendation: add regulatory risk detector

Result: Framework validated + improvement roadmap + reusable components catalog
```

**This skill demonstrates:** The framework can adapt to diverse product categories while generating actionable insights for framework improvement.