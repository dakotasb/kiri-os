---
title: Intelligence Degradation Detection
name: intelligence-degradation-detection
description: Build validation layers that prevent compounding degradation in AI agent systems by proactively detecting stale knowledge, poor inputs, and data quality issues before they propagate, plus reactive scanning for logic faults and database drift.
version: 1.0
category: autonomous-ai-agents
tags: [agent-health, data-validation, quality-assurance, staleness-detection, monitoring]
author: Kiri System
---

# Intelligence Degradation Detection

Build validation layers that prevent compounding degradation in AI agent systems by proactively detecting stale knowledge, poor inputs, and data quality issues before they propagate, plus reactive scanning for logic faults and database drift.

## Trigger

Use when:
- User describes "agent degradation," "knowledge staleness," or "compounding errors" in AI systems
- Need to validate agent outputs against ground truth or external data sources
- Building proactive systems to detect poor prompts/data before they damage agent performance
- Designing reactive scans for faulty logic or database quality issues
- Integrating external intelligence (Similarweb, APIs, crawlers) for validation
- Creating "self-monitoring intelligence" that avoids "bad code on bad code" patterns
- System needs to detect when training data, context, or external knowledge is becoming stale

## Overview

| Layer | Detection Type | Action |
|-------|---------------|--------|
| **Proactive** | Input validation | Block/cleanse before processing |
| **Proactive** | Prompt quality | Score and reroute low-quality requests |
| **Proactive** | External freshness | Compare against live sources (Similarweb, APIs) |
| **Reactive** | Output validation | Detect contradictions with known ground truth |
| **Reactive** | Logic scanning | Find faulty reasoning chains |
| **Reactive** | Database drift | Monitor embedding/vector quality degradation |

## Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│              INTELLIGENCE DEGRADATION DETECTION                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────┐          │
│  │  PROACTIVE LAYERS     │    │  REACTIVE LAYERS      │          │
│  │  (Prevent bad input)  │    │  (Detect bad output)  │          │
│  ├───────────────────────┤    ├───────────────────────┤          │
│  │ • Input sanitization  │    │ • Contradiction check   │          │
│  │ • Prompt quality      │    │ • Logic validation      │          │
│  │ • External freshness  │    │ • Confidence scoring    │          │
│  │ • Schema validation   │    │ • Human-in-loop flag    │          │
│  └───────────┬───────────┘    └───────────┬───────────┘          │
│              │                            │                      │
│              ▼                            ▼                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │           EXTERNAL VALIDATION SOURCES                      ││
│  │  ┌──────────┬──────────┬──────────────┬─────────────────┐   ││
│  │  │Similarweb│ APIs     │ Self-hosted  │ Vector DB stats │   ││
│  │  │(market)  │(domain)  │ crawlers     │(embedding drift)│   ││
│  │  └──────────┴──────────┴──────────────┴─────────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐
│  │              ACTION / ESCALATION                             │
│  │  • Block low-quality inputs                                  │
│  │  • Flag outputs for review                                   │
│  │  • Trigger knowledge refresh jobs                            │
│  │  • Alert on compounding error patterns                       │
│  └─────────────────────────────────────────────────────────────┘
```

## Implementation Approaches

### Option 1: External API Validation (Similarweb)

**When to use:** Need reliable market/competitive data with minimal dev time

```yaml
intelligence_sources:
  similarweb:
    enabled: true
    api_key: ${SIMILARWEB_API_KEY}
    checks:
      - competitor_traffic_trends    # Detect market shifts
      - pricing_page_monitoring      # Catch pricing changes
      - feature_announcement_scan    # New features = knowledge staleness
    staleness_threshold: 24h         # Refresh knowledge if older than
```

### Option 2: Self-Hosted Equivalent

**When to use:** Custom domains, high volume, or need specialized metrics

```yaml
self_hosted:
  crawler: trafilatura + playwright
  extraction: custom NER for industry terms
  embeddings: local sentence-transformer
  trend_detection: statistical process control
  checks:
    - content_freshness           # Last update date
    - semantic_drift             # Embedding distance from baseline
    - authority_score_change     # Backlink patterns
```

### Option 3: Hybrid Architecture (Recommended)

```yaml
validation_pipeline:
  tier_1_apis:      # Fast, reliable for known sources
    - similarweb
    - clearbit
    - open_corporate
    
  tier_2_crawlers:  # Custom, high-frequency domains
    - competitor_blog_monitor
    - documentation_scraper
    - pricing_page_watcher
    
  tier_3_signals:   # Internal database health
    - vector_db_drift_detection
    - query_response_time_anomalies
    - user_feedback_sentiment_drop
```

## Integration with Agent Systems

### Step 1: Pre-Processing Validation

```python
def validate_input_before_agent(prompt, context):
    """Proactive: Score and potentially block inputs"""
    
    # Check prompt quality
    quality_score = score_prompt_complexity(prompt)
    if quality_score < 0.3:
        return {"action": "reroute", "to": "simple_handler"}
    
    # Check context freshness
    context_age = get_oldest_fact_age(context)
    if context_age > FRESHNESS_THRESHOLD:
        return {"action": "refresh", "sources": ["knowledge_base", "web_search"]}
    
    # Check for banned patterns
    if contains_jailbreak_patterns(prompt):
        return {"action": "block", "reason": "policy_violation"}
    
    return {"action": "proceed"}
```

### Step 2: Post-Processing Validation

```python
def validate_output_after_agent(output, ground_truth_sources):
    """Reactive: Check agent output against validation sources"""
    
    # External validation
    contradictions = []
    for source in ground_truth_sources:
        if contradicts(output, source):
            contradictions.append({"source": source, "diff": diff(output, source)})
    
    if contradictions:
        return {
            "action": "flag_for_review",
            "confidence": "low",
            "contradictions": contradictions
        }
    
    # Logic chain validation
    if not validate_reasoning_chain(output.chain_of_thought):
        return {"action": "regenerate", "reason": "faulty_logic"}
    
    return {"action": "deliver"}
```

### Step 3: Continuous Monitoring

```python
def scheduled_health_check():
    """Reactive: Periodic scans for degradation"""
    
    # Vector DB health
    embedding_drift = calculate_embedding_centroid_drift()
    if embedding_drift > DRIFT_THRESHOLD:
        alert("Knowledge base drift detected", severity="warning")
    
    # Knowledge staleness
    stale_facts = query_stale_facts(older_than="30d")
    if len(stale_facts) > STALE_THRESHOLD:
        trigger_refresh_job(stale_facts)
    
    # Compounding error detection
    recent_errors = get_error_patterns(days=7)
    if is_compounding_pattern(recent_errors):
        alert("Compounding error pattern detected", severity="critical")
```

## Key Metrics to Track

| Metric | Description | Warning Threshold | Critical Threshold |
|--------|-------------|-------------------|-------------------|
| Knowledge Age | Oldest fact in context | > 24 hours | > 7 days |
| Contradiction Rate | % outputs contradicting sources | > 5% | > 15% |
| Confidence Score | Agent self-reported confidence | < 0.7 | < 0.5 |
| Vector Drift | Cosine distance from baseline | > 0.15 | > 0.30 |
| Query Latency | Time to knowledge retrieval | > 2s | > 5s |
| User Feedback | Negative sentiment rate | > 10% | > 25% |

## Preventing Compounding Errors

The core principle: **Bad data in → Bad output out → Bad training data → Worse performance**

### Detection Patterns

1. **Cascading Confidence Drop**
   ```
   Pattern: confidence[t] < confidence[t-1] for 3+ consecutive queries
   Action: Trigger knowledge refresh, audit recent inputs
   ```

2. **Contradiction Clustering**
   ```
   Pattern: Multiple contradictions on same topic within time window
   Action: Flag topic as potentially stale, trigger external validation
   ```

3. **Input Quality Degradation**
   ```
   Pattern: Avg prompt quality score declining over sessions
   Action: Review prompt engineering, consider input filtering
   ```

## Tools and Techniques

### External Validation Sources
- **Similarweb**: Market intelligence, traffic trends, competitive data
- **Clearbit**: Company intelligence, firmographic data
- **Crunchbase**: Funding/startup data freshness
- **Custom crawlers**: trafilatura, playwright, scrapy
- **RSS feeds**: blogwatcher for real-time updates
- **API health checks**: Automated endpoint validation

### Internal Quality Metrics
- **Embedding drift**: Track centroid shifts in vector DB
- **Query performance**: Response time anomalies
- **Error rate trending**: Increasing failure patterns
- **User satisfaction**: Feedback loop degradation

## Example Workflow

```bash
# 1. Set up external validation sources
hermes -p scout chat -q "Research Similarweb API vs alternatives for intelligence validation"

# 2. Implement proactive input validation  
hermes -p architect chat -q "Design input sanitization layer for agent system with prompt quality scoring"

# 3. Build reactive output validation
hermes -p builder chat -q "Implement contradiction detection that compares agent outputs against Similarweb data"

# 4. Create monitoring dashboard
hermes -p sentinel chat -q "Build health dashboard showing knowledge freshness, contradiction rates, and confidence scores"

# 5. Schedule periodic scans
hermes cron create --name "intelligence-health" --agent keystone \
  --schedule "0 */6 * * *" \
  --prompt "Run intelligence degradation scan: check vector drift, stale facts, compounding errors"
```

## Pitfalls

| Pitfall | Why It Happens | Mitigation |
|---------|---------------|------------|
| False positives | Over-sensitive thresholds | Calibrate against baseline, tune per domain |
| Alert fatigue | Too many low-priority alerts | Severity tiers, intelligent grouping |
| Validation lag | External sources slower than agent | Async validation, cache with TTL |
| Circular validation | Agents validating each other | External ground truth only |
| Privacy leaks | Sending sensitive data to 3rd party APIs | Sanitize before API calls, use self-hosted |

## Related Skills

- `system-health-monitoring` — Infrastructure-level health, complements this intelligence-level health
- `competitive-intelligence-analysis` — Business intelligence gathering (can feed this validation system)
- `market-intelligence-action-item-validation` — Research freshness validation
- `blogwatcher` — Real-time external source monitoring

## Verification Checklist

After implementing degradation detection:
- [ ] Proactive input validation rejects low-quality prompts
- [ ] External sources (Similarweb/custom) are queried for freshness checks  
- [ ] Reactive scans detect contradictions with > 80% accuracy
- [ ] Compounding error patterns trigger alerts within 3 occurrences
- [ ] Knowledge staleness metrics exposed on dashboard
- [ ] Automated refresh jobs trigger on threshold breaches
- [ ] Human-in-loop escalation for critical contradictions
