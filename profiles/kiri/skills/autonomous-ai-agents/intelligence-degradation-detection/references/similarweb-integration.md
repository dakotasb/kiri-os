# SimilarWeb Integration for Intelligence Validation

Research notes and setup guide for incorporating SimilarWeb API as an external intelligence validation source in degradation detection systems.

## Why SimilarWeb

SimilarWeb provides market intelligence data useful for:
- Website/app performance monitoring
- Competitive traffic trends
- Pricing page monitoring
- Feature announcement scanning
- Market share validation

## API Overview

**Endpoint:** `api.similarweb.com/v1/...`

**Key Endpoints:**
- `/website/{domain}/overview` - Traffic and engagement metrics
- `/website/{domain}/traffic-sources` - Channel breakdown
- `/keywords/{domain}/overview` - SEO performance
- `/segment/{domain}/overview` - Market segment data

## Integration Pattern

```typescript
// src/lib/validation/similarweb.ts
interface SimilarwebValidation {
  domain: string;
  checkType: 'traffic_trend' | 'pricing_change' | 'feature_detect';
  lastKnown: Record<string, any>;
  threshold: number;
}

export async function validateWithSimilarweb(
  claim: string,
  domain: string,
  apiKey: string
): Promise<ValidationResult> {
  const response = await fetch(
    `https://api.similarweb.com/v1/website/${domain}/overview?api_key=${apiKey}`,
    { headers: { 'Accept': 'application/json' } }
  );
  
  if (!response.ok) {
    return { status: 'error', reason: 'api_failure' };
  }
  
  const data = await response.json();
  
  // Validate traffic claim
  if (claim.includes('traffic')) {
    const currentTraffic = data.visits;
    const claimedTraffic = parseClaim(claim);
    const deviation = Math.abs(currentTraffic - claimedTraffic) / claimedTraffic;
    
    if (deviation > 0.2) { // 20% threshold
      return {
        status: 'contradiction',
        confidence: 1 - deviation,
        externalData: { visits: currentTraffic },
        message: `Traffic claim differs by ${(deviation * 100).toFixed(1)}% from SimilarWeb data`
      };
    }
  }
  
  return { status: 'validated', confidence: 0.9 };
}
```

## Implementation Considerations

### Rate Limits
- Free tier: Limited requests/month
- Paid tier: Higher limits
- Implementation: Add request caching with Redis/memory cache

### Cost vs Value
**When SimilarWeb makes sense:**
- High-frequency validation needs
- Market/competitive intelligence use case
- Need reliable source of truth

**When self-hosted crawler makes sense:**
- Cost-sensitive
- Need specialized metrics not in SimilarWeb
- Privacy requirements prevent 3rd party API calls

### Hybrid Approach (Recommended)
```yaml
validation_sources:
  tier_1:
    similarweb:
      enabled: true
      use_for: [traffic_trends, market_share]
      refresh_interval: 24h
      
  tier_2:
    self_crawler:
      enabled: true
      use_for: [pricing_pages, feature_announcements]
      domains:
        - competitor1.com
        - competitor2.com
      crawl_frequency: 6h
      ```

## Setup Steps

1. **Get API Key:**
   - Sign up at similarweb.com
   - Navigate to API section in dashboard
   - Generate API key (store in env var `SIMILARWEB_API_KEY`)

2. **Test Connection:**
   ```bash
   curl "https://api.similarweb.com/v1/website/google.com/overview?api_key=$SIMILARWEB_API_KEY"
   ```

3. **Implement Validator Agent:**
   ```typescript
   // @/agents/validators/similarweb-validator
   export class SimilarwebValidator {
     constructor(private apiKey: string) {}
     
     async validate(claim: IntelligenceClaim): Promise<ValidationResult> {
       // Implementation
     }
   }
   ```

4. **Add to Degradation Detection Pipeline:**
   ```typescript
   // In intelligence-degradation detection system
   const validators = [
     new SimilarwebValidator(env.SIMILARWEB_API_KEY),
     new InternalValidator(vectorDB),
     // ... others
   ];
   ```

## Alternatives to SimilarWeb

| Service | Strengths | Best For |
|---------|-----------|----------|
| **Semrush** | SEO focus, keyword rankings | Marketing intelligence |
| **Ahrefs** | Backlink data, content gaps | SEO/content validation |
| **BuiltWith** | Technology detection | Stack/competitor tracking |
| **Crunchbase** | Company/funding data | Startup intelligence |
| **Custom** | Full control, no cost | High-volume, niche metrics |

## Session Context

**From conversation:** User requested exploration of "incorporation of similarweb.com or self developed equivalent" for intelligence degradation detection.

**Outcome:** Skill reference created for future implementation. SimilarWeb integration recommended as tier-1 validation source for market intelligence use cases.
