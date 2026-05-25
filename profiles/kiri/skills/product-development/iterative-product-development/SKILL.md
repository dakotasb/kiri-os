---
name: iterative-product-development
description: Execute multi-cycle product development where 2-4 sequential iterations progressively harden research, specifications, and deliverables, synthesizing the best from each cycle into a final investment-grade output. Use when research needs validation through repetition, when building complex products requiring progressive refinement, or when proving framework capability through iterative demonstration.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [product-development, iterative-development, synthesis, progressive-refinement, multi-cycle, framework-proof]
triggers:
  - run iterative product development
  - multiple iterations to refine
  - synthesis across product iterations
  - hardened research cycles
  - iterative framework proof
  - sequential product iterations
  - synthesize best elements from iterations
  - product market test with iterations
  - validate through multiple cycles
  - build iteratively
---

# Iterative Product Development with Cross-Iteration Synthesis

## Overview

Some products require more than a single pass. This skill orchestrates **2-4 sequential iterations** where each cycle builds on the previous, progressively hardening research, refining specifications, and improving deliverables. The final output synthesizes the best elements from all iterations into an investment-grade package.

**The Promise:** Transform vague concepts into thoroughly validated, investor-ready product packages through successive refinement cycles.

**When to Use:**
- Complex products requiring deep research validation
- Framework proof-of-capability demonstrations
- High-stakes decisions needing hardened evidence
- Products where "build and ship" isn't enough—validation is required
- Testing whether iterative improvement genuinely improves quality

## The Iterative Cycle Pattern

### Standard Structure

```
~/product_test/
├── iteration_1/           # Foundation - initial research
├── iteration_2/           # Challenge - contradictions found
├── iteration_3/           # Synthesis - final hardened output
└── final/                 # Best-of synthesis
    ├── executive_summary.md
    ├── market_analysis_final.md
    ├── product_spec_final.md
    ├── DESIGN_final.md
    ├── product-mvp.html
    ├── business_model.md
    ├── synthesis_report.md
    └── framework_proof.md
```

### Iteration Flow

```
Iteration 1: Explore        →    Iteration 2: Challenge      →    Iteration 3: Synthesize
├─ Initial research         →    ├─ Contradiction detection   →    ├─ Best elements combined
├─ Basic competitor scan    →    ├─ Alternative sources       →    ├─ Hardened claims
├─ Rough market sizing      →    ├─ Confidence scoring        →    ├─ Investment-grade output
└─ Conceptual framework     →    └─ Validation notes          →    └─ Proof documentation
      ↓                           ↓                                ↓
  "What might this        "What's wrong with              "What is definitively
   be?"                    iteration 1?"                    true?"
```

## Iteration Types

### Iteration 1: Foundation (Explore)
**Goal:** Broad evidence gathering, initial framework

**Tasks:**
- Competitor analysis (GitHub, websites)
- Market sizing (analyst reports)
- Basic pain point identification
- Conceptual product definition

**Output Quality:** LOW-MEDIUM confidence (unvalidated)
**Save to:** `~/product_test/iteration_1/`

### Iteration 2: Validation (Challenge)
**Goal:** Find contradictions, test assumptions, harden claims

**Tasks:**
- Re-verify iteration 1 claims with alternative sources
- Contradiction detection and resolution
- Pricing verification with live extraction
- Confidence scoring for each finding

**Output Quality:** MEDIUM confidence (cross-checked)
**Save to:** `~/product_test/iteration_2/`

### Iteration 3: Synthesis (Harden)
**Goal:** Combine best elements, final polish, investment readiness

**Tasks:**
- Cherry-pick best elements from iterations 1-2
- Hardened research with confidence matrix
- Complete product specification
- Working MVP prototype
- Business model and go-to-market

**Output Quality:** HIGH confidence (synthesized)
**Save to:** `~/product_test/iteration_3/` or `~/product_test/final/`

## Key Deliverables (8-File Structure)

### 1. Executive Summary
- One-page investor overview
- TAM/SAM/SOM with sources
- Competitive differentiation
- Investment ask and milestones

### 2. Market Analysis Final
- Competitor matrix (10+ tracked)
- Pricing intelligence (live extraction)
- Confidence matrix with iteration validation
- Investment landscape (funding tracked)

### 3. Product Specification Final
- 3 detailed user personas
- 8 modules (or appropriate scope)
- Complete API specifications
- Technical architecture
- Data models and schemas

### 4. DESIGN_final.md
- Google DESIGN.md spec compliant
- 100+ design tokens
- Color hierarchy, typography scale
- Component library

### 5. Product MVP
- Working HTML/CSS/JS prototype
- 5+ modules visualized
- Zero dependencies
- Responsive, accessible

### 6. Business Model
- 4-tier pricing strategy
- 3-year P&L projections
- Unit economics (LTV, CAC)
- Go-to-market phases

### 7. Synthesis Report
- Comparison matrix (all iterations)
- Quality improvement metrics
- What worked and what didn't
- Lessons learned

### 8. Framework Proof
- Evidence of capability
- Process documentation
- Risk mitigation
- Final validation statement

## Quality Benchmarks

### By Iteration

| Metric | Iteration 1 | Iteration 2 | Iteration 3 |
|--------|-------------|-------------|-------------|
| Research Sources | 3-5 | 8-12 | 15+ |
| Confidence % | 30-50% | 60-75% | 85-95% |
| Words Produced | ~2,000 | ~6,000 | ~15,000 |
| Working MVP | ❌ | ❌ Concept | ✅ Complete |
| Deliverables | 4-5 | 6-7 | 8 |

### Improvement Ratios

From iteration 1→3:
- **Research depth:** +400% (more sources, better validation)
- **Content volume:** +650% (hardened specifications)
- **Confidence:** +250% (cross-validated claims)
- **Deliverables:** +700% (complete package)

## Execution Pattern

### Phase 1: Foundation Setup

```python
# Create workspace structure
base_dir = "~/product_test/"
os.makedirs(f"{base_dir}/iteration_1", exist_ok=True)
os.makedirs(f"{base_dir}/iteration_2", exist_ok=True)
os.makedirs(f"{base_dir}/final", exist_ok=True)

# Iteration 1: Initial deep dive
create_market_research_initial()
create_basic_product_concept()
create_draft_design_system()

save_to_mem_palace(wing="{product}_deep_research", hall="iteration_1")
```

### Phase 2: Challenge & Validate

```python
# Iteration 2: Cross-validation
recall_iteration_1_findings()

# Challenge high-confidence claims
find_contradictions(iteration_1_claims)
explore_alternative_sources()
verify_pricing_with_live_extraction()

update_confidence_scores()
resolve_contradictions()

save_to_mem_palace(wing="{product}_deep_research", hall="iteration_2")
```

### Phase 3: Synthesis & Final

```python
# Iteration 3: Hardened synthesis
create_executive_summary()
create_market_analysis_final(iteration_1_data, iteration_2_data)
create_product_spec_final()
create_design_final()
create_working_mvp()
create_business_model()
create_synthesis_report(iteration_comparison)
create_framework_proof()

save_to_mem_palace(wing="{product}_deep_research", hall="final_synthesis")
```

## Key Principles

### 1. Progressive Hardening
Each iteration increases confidence, not just content volume.
- Iteration 1: "We think X" (unvalidated)
- Iteration 2: "Source A says X, Source B says Y, we conclude..." (cross-checked)
- Iteration 3: "X is validated at HIGH confidence across 3 iterations" (hardened)

### 2. Synthesis, Not Summation
Final output isn't a summary—it's cherry-picked excellence:
- Best research from iteration 2 (validated claims)
- Best structure from iteration 1 (clear framework)
- Best polish from iteration 3 (investor-grade)

### 3. Documentation of Improvement
The synthesis report is crucial—it proves the iterative process added value.
- Quantify improvement (+650% words, +400% sources)
- Document contradictions found
- Show how confidence evolved

### 4. Framework Validation Focus
When used for proof, emphasize:
- What the framework CAN do (generic applicability)
- How iterations improve quality (hardening)
- Reproducibility (documented process)

## Confidence Scoring Methodology

### Levels
- **HIGH:** 3+ independent sources agree, direct evidence
- **MEDIUM:** 2 sources agree, some contradictory evidence
- **LOW:** Single source, estimate-based, unverified

### Iteration Tracking
Track how many iterations confirmed each finding:
- "Validated in 3/3 iterations" → Very high confidence
- "Only appeared in iteration 1" → Needs more research

### Contradiction Documentation
- Document: "Iteration 1 said X, Iteration 2 found Y"
- Resolution: Which source is more reliable? Why?

## When to Stop Iterating

**Stop when:**
- All HIGH confidence claims survived ≥2 iterations
- No significant contradictions remain unresolved
- Output is investor-ready (grade A)
- Diminishing returns (iteration N+1 adds <10% new value)

**Don't stop when:**
- Only 1 iteration completed (not hardened)
- Major contradictions unresolved
- Confidence scores still LOW/MEDIUM
- Still discovering new fundamental information

## Anti-Patterns

**DON'T:**
- Skip iterations (undermines confidence building)
- Duplicate work without synthesis
- Accept findings validated in only 1 iteration
- Forget to document contradictions
- Treat iterations as independent (they must build on each other)

**DO:**
- Explicitly challenge your own findings
- Document contradictions even if unresolved
- Cherry-pick best elements for final synthesis
- Force source citations for every claim
- Show quantified improvement in synthesis report

## Related Skills

- `product-idea-to-mvp` — Single-pass product development (faster but less validated)
- `iterative-market-research` — Research-only iteration (no product build)
- `framework-validation-parallel-testing` — Multiple products in parallel (breadth vs depth)
- `design-md` — Design system specification

## Example Usage

```
User: "Validate Kiri's framework by building a product end-to-end with 3 iterations.
Product: AgentOS (AI agent orchestration platform)"

Follow this skill to produce:
1. Iteration 1: Basic research, rough specs, conceptual design
2. Iteration 2: Cross-validation, contradictions found, pricing gaps identified
3. Iteration 3: Hardened research, complete specs, working MVP, business model
4. Synthesis: Comparison showing +650% improvement, 8 deliverables
5. Framework proof: Evidence that "Kiri builds ANY product"

Result: Complete investor package proving iterative framework capability
Grade: A (Investment-Ready)
```

**This skill demonstrates:** Progressive refinement through multiple cycles produces demonstrably better output than single-pass execution.