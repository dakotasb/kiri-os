---
name: product-idea-to-mvp
description: Execute the complete product development pipeline from any customer idea to production-ready MVP. Conducts market research with real GitHub/pricing data, creates product specs with user stories, generates DESIGN.md design systems, and builds working HTML prototypes with mock data. Use when a customer has "an idea" and needs the full discovery-to-prototype journey executed autonomously.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [product-development, mvp, prototype, market-research, design-system, customer-validation]
triggers:
  - build me an mvp
  - turn this idea into a product
  - i have an idea for an app
  - create a prototype for
  - full product development
  - end to end product
  - build my startup idea
  - product market validation
  - customer wants to build a product
  - generic product framework
---

# Product Idea to MVP Pipeline

Transform any customer concept into a production-ready MVP prototype. This skill executes the complete product development lifecycle automatically—from simulated customer input through market validation, product specification, design system creation, and working interactive prototype.

## Overview

**The Promise:** Take "I want to build X" and deliver market research, product specs, DESIGN.md, and working HTML prototype in ~90 minutes.

**Why It Works:**
- Combines research (`curl` GitHub API, pricing extraction) + analysis + design + implementation
- Generic framework works for ANY product category (not hardcoded to specific verticals)
- Delivers 6 production artifacts suitable for investor/user demos
- No human intervention required once triggered

## When to Use

**Use this skill when:**
- User says "I want to build..." anything (app, tool, platform, marketplace)
- Request is "build me an MVP" or "turn this into a product"
- Need full market validation before deciding to invest
- Customer has idea but no technical team (simulated scenario)
- Testing framework's ability to serve ANY product category
- Deadline-driven ("need this in 72 hours")

**Don't use when:**
- User wants to skip straight to coding (use writing-plans or coding directly)
- Market is already well-understood (use design-md directly)
- Building on existing product (extend instead of greenfield)
- Only design needed (use design-delegation)
- Only research needed (use product-strategy-research)

## The 6-Deliverable Pipeline

### Phase 1: Customer Input → Simulated Persona (5 min)

**Creates:** `customer_input.md`

Transform vague customer input into detailed persona:
- Customer type description (tier, budget, constraints)
- Pain points with emotional resonance
- Vision statement
- Must-have vs nice-to-have features
- Competitors they mentioned
- Timeline and budget constraints

**Key elements:**
- Named personas ("Overwhelmed Alex", "Startup Founder")
- Specific demographic + psychographic details
- Concrete pain quotes
- Measurable constraints (72 hours, $5K budget)

### Phase 2: Market Research with Real Data (15 min)

**Creates:** `market_research.md`

Research methodology:

```bash
# GitHub API for open source competitors
curl -s https://api.github.com/repos/owner/repo
curl -s 'https://api.github.com/search/repositories?q=topic+language:javascript&sort=stars'

# Extract stars, forks, issues, creation date for market timing
```

**Analysis framework:**
1. **Competitor Landscape** - Tier 1/2/3 categorization
2. **GitHub Metrics** - Stars (interest), forks (customization pain), issues (maturity)
3. **Pricing Extraction** - Live website scraping for gap analysis
4. **Market Maturity** - Growth phase assessment
5. **Gap Analysis** - Pricing gap, feature gap, accountability gap

**Deliverable structure:**
- Market size with sources cited
- Competitor matrix (pricing, features, threats)
- Validation confidence table (HIGH/MEDIUM/LOW)
- Recommended positioning strategy

### Phase 3: Product Specification (15 min)

**Creates:** `product_spec.md`

**Components:**

1. **Product Vision** - One-sentence promise + positioning
2. **User Personas** - Primary + secondary with full psychographics
3. **User Stories** - As X, I want Y so that Z (12-15 scenarios)
4. **Feature Scope:**
   - P0: MVP features (must-have)
   - P1: Post-MVP enhancements
   - P2: Future iterations
   - Never: Explicitly out of scope
5. **Technical Architecture** - Stack + data model
6. **Success Metrics** - Week 1, 4, 12 benchmarks

**Key:** Features map to user pain points identified in research

### Phase 4: Design System Specification (15 min)

**Creates:** `DESIGN.md` (Google format)

**Token system:**
```yaml
colors:
  primary: "#0F172A"
  tertiary: "#F97316"
typography:
  h1:
    fontFamily: "Inter"
    fontSize: "2.5rem"
    # ...
components:
  habit-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
```

**Design philosophy documentation:**
- Color psychology rationale
- Typography hierarchy
- Spacing system (8px base)
- Component taxonomy
- Accessibility commitments

**Output:** Valid DESIGN.md file that can be linted/exported

### Phase 5: Working MVP Prototype (30 min)

**Creates:** `mvp-iter1.html`

**Requirements:**
- Single HTML file (no build step)
- CSS Custom Properties matching DESIGN.md tokens
- Interactive elements with JavaScript
- Responsive design (mobile-first, tablet/desktop breakpoints)
- Mock data populated for demo
- Animations (150-300ms, purposeful only)

**Architecture:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>[Product Name]</title>
  <link href="https://fonts.googleapis.com/...">
  <style>
    :root { /* DESIGN.md tokens */ }
    /* Component styles */
  </style>
</head>
<body>
  <!-- Header -->
  <!-- Progress/Stats Section -->
  <!-- Main Content (cards, lists, etc.) -->
  <!-- Navigation -->
  <script>
    // State management
    // Interactions
    // Toast notifications
  </script>
</body>
</html>
```

**Quality standards:**
- [ ] All DESIGN.md colors implemented
- [ ] Typography hierarchy matches spec
- [ ] All buttons/interactive elements work
- [ ] Responsive breakpoints functional
- [ ] No console errors
- [ ] Smooth animations

### Phase 6: Documentation (10 min)

**Creates:** `README.md`

**Content:**
- Executive summary of the pipeline
- Design decisions and rationale
- Validation checklist
- File structure overview
- Next iteration roadmap

## Execution Pattern

```python
# Phase 1: Setup
create_directory("~/product_test/iteration_1/")

# Phase 2: Sequential creation
create_customer_input(persona_data)
create_market_research(github_api, web_scrape)
create_product_spec(user_stories)
create_design_md(tokens)
create_mvp_html(prototype)
create_readme(documentation)
```

## Key Principles

### 1. Generic Framework, Specific Execution
- The **class** is generic (product development)
- Each **instance** adapts to the specific product category
- Works for wellness apps, developer tools, B2B SaaS, consumer marketplaces

### 2. Research-Backed, Not Guesswork
- Every claim cites real data (GitHub stars, pricing pages, dates)
- Confidence scoring on findings
- Contradictions acknowledged, not hidden

### 3. Design System First
- DESIGN.md before HTML ensures consistency
- Tokens enable theming and future iteration
- Validates accessibility from start

### 4. Working Prototype, Not Mockups
- Interactive HTML, not Figma files
- Clickable, not static
- Real enough for user testing

### 5. Self-Documenting
- README explains why decisions were made
- Enables future developers to understand rationale
- Provides roadmap for next iterations

## Example Deliverables Structure

```
~/product_test/iteration_1/
├── customer_input.md       # 2-3KB, simulated persona
├── market_research.md        # 7-8KB, competitive analysis
├── product_spec.md          # 9-10KB, features + architecture
├── DESIGN.md                # 6-7KB, design system tokens
├── mvp-iter1.html          # 20-25KB, working prototype
└── README.md                # 6-8KB, rationale + next steps

Total: ~50KB of production deliverables
```

## Validation Checklist

Before marking complete:
- [ ] customer_input.md has specific persona with pain points
- [ ] market_research.md includes GitHub/pricing data
- [ ] product_spec.md has ≥10 user stories
- [ ] DESIGN.md passes lint (`npx @google/design.md lint`)
- [ ] mvp-iter1.html is a single working file
- [ ] All 5 interactive elements are functional
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] README.md explains design decisions
- [ ] Total execution time < 2 hours

## Anti-Patterns

**DON'T:**
- Skip the market research phase
- Use placeholder colors instead of DESIGN.md tokens
- Deliver static mockups instead of interactive HTML
- Forget to populate with mock data
- Leave contradictions unacknowledged

**DO:**
- Execute all 6 phases even when pressure to rush
- Validate competitor data via GitHub API (not estimates)
- Create named personas with full psychographics
- Document why design decisions were made
- Provide clear next steps for iterations

## Related Skills

- `product-strategy-research` - Parallel research for deep dives
- `design-md` - Technical spec for design system format
- `popular-web-designs` - Reference design templates
- `interactive-dashboard-builder` - For admin/control panels specifically
- `iterative-market-research` - Multi-agent validation overnight

---

## Example Usage

```
User: "I want to build a personal finance tracker with AI insights for millennials"

Follow this skill to produce:
1. "Young Professional Yara" persona - 27, freelance designer, hates budgeting apps
2. Market research - Mint (RIP), YNAB, Monarch, Copilot pricing/features
3. Product spec - Transaction sync, AI spending insights, budget automation
4. DESIGN.md - Clean fintech aesthetic (Notion + Stripe hybrid)
5. mvp-iter1.html - Dashboard with mock transactions, spending charts
6. README.md - Why "AI insights" differentiates from YNAB

Result: Investor-ready pitch deck + working demo for user testing
```

**This skill demonstrates:** Kiri can execute complete product development workflows—from customer discovery through working prototype—for ANY product category, not just infrastructure tools.