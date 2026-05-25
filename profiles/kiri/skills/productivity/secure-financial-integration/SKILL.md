---
name: secure-financial-integration
description: Set up secure, read-only financial API integrations for agents using Plaid as a tokenized intermediary. Covers sandbox testing, read-only scope enforcement, credential security, and phased deployment (manual CSV → sandbox → production). Prioritizes preventing unauthorized access and impersonation.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [Financial-APIs, Plaid, Security, Read-Only, Banking, Investment, Credit-Cards, Tokenized-Auth]
    related_skills: [github-auth, polymarket]
---

# Secure Financial Integration

Set up secure, read-only financial API integrations for autonomous agents. This skill prioritizes **security over convenience** using a tokenized intermediary architecture.

## When to Use

- User wants agents to analyze bank account data
- User wants investment portfolio tracking
- User wants credit card spending analysis
- User mentions "secure" financial access
- User is concerned about impersonation or unauthorized transactions
- Setting up Plaid for any financial data integration

## Core Security Principle

**The agent is only as dangerous as the API permissions you give it.**

```
Your Real Bank ←── Your real login ──→ Plaid ←── Token ──→ Agent
                     (never stored)            (read-only)
```

## Security Guarantees (What This Prevents)

| Risk | Protection |
|------|-----------|
| **Real bank credential exposure** | ❌ Never entered, never stored by agent |
| **Unauthorized money movement** | ❌ Impossible with read-only scope |
| **Agent impersonation for transactions** | ❌ Token physically cannot trade/transfer |
| **Credential theft from storage** | ✅ Tokens stored in `.env`, not skills/memory |
| **Broad API access** | ✅ Scope limited to `balance` + `transactions` only |

## Phased Deployment Strategy

| Phase | Approach | Risk Level | When |
|-------|----------|------------|------|
| **1. Manual** | CSV exports, local files | Zero | Week 1-4 (testing) |
| **2. Sandbox** | Plaid sandbox (fake data) | Near-zero | Week 4+ (testing) |
| **3. Read-Only** | Plaid production, limited scopes | Low | Month 2+ (if trust established) |
| **❌ NEVER** | Trading APIs, transfer APIs, write scopes | - | - |

## Setup: Phase 1 (Manual CSV)

No APIs, zero credentials stored.

```bash
# Create secure directory
mkdir -p ~/.hermes/financial_data/{bank_exports,cc_exports,investment_data}
chmod 700 ~/.hermes/financial_data

# User manually exports CSVs from banks/CCs
# Agent reads local files only
```

**Security:** Agent has file access only. No network access to financial institutions.

## Setup: Phase 2 (Plaid Sandbox) - Safe Testing

### Step 1: Get Plaid Credentials

1. Go to: https://dashboard.plaid.com/signup
2. Sign up (free developer account)
3. Team → Keys → Copy:
   - `client_id`
   - **Sandbox** secret (NOT development or production)

### Step 2: Install and Configure

```bash
# Create sandbox project
mkdir -p ~/.hermes/plaid-sandbox && cd ~/.hermes/plaid-sandbox
npm init -y
npm install plaid

# Create config
cat > .env << 'EOF'
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=sandbox_secret_here
PLAID_ENV=sandbox
REVENUE_AGENT_ENABLED=false
EOF

chmod 600 .env
```

### Step 3: Test Connection

```javascript
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const config = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const client = new PlaidApi(config);

// Test with fake data
const response = await client.linkTokenCreate({
    user: { client_user_id: 'test-user' },
    client_name: 'Agent Test',
    products: ['transactions', 'balance'],  // READ-ONLY scopes
    country_codes: ['US'],
    language: 'en',
});

console.log('Sandbox connection OK');
```

### What's Fake?

Plaid Sandbox provides fictional data:
- "First Platypus Bank"
- Balances: $1,234.56
- Transactions: Mock coffee shops, grocery stores
- **Zero connection to real accounts**

## Setup: Phase 3 (Production Read-Only)

**⚠️  Only after 2-4 weeks of successful sandbox testing.**

### Scope Configuration (CRITICAL)

```javascript
// CORRECT: Read-only only
const products = ['transactions', 'balance', 'identity'];

// WRONG: NEVER include these
const dangerousProducts = ['assets', 'investments', 'payment_initiation'];
```

### Production Setup

```bash
# Update .env for production
PLAID_ENV=development  # Test with real credentials first
# PLAID_ENV=production  # Only after verification

# Token rotation every 30 days
# Stored only in ~/.hermes/.env (git-ignored)
```

## What the Agent Can/Cannot Do

With read-only scope:

| Action | Possible? |
|--------|-----------|
| View account balances | ✅ Yes |
| View transaction history | ✅ Yes |
| Analyze spending patterns | ✅ Yes |
| Export data to reports | ✅ Yes |
| Transfer money | ❌ **No (scope prevents)** |
| Trade stocks | ❌ **No (no trading APIs)** |
| Pay bills | ❌ **No (scope prevents)** |
| Open accounts | ❌ **No** |
| Change account settings | ❌ **No** |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Unauthorized" error | Check token hasn't expired (rotate monthly) |
| "Product not enabled" | Your Plaid account needs higher tier for real data |
| "Sandbox only" | Production requires approval from Plaid |
| Can't access investment data | Plaid Investment product requires separate approval |
| Worried about impersonation | Verify scopes are read-only only in Plaid Dashboard |

## Verification Checklist

Before trusting financial integration:

- [ ] Using Plaid, never direct bank APIs
- [ ] Scopes limited to `balance` + `transactions` only
- [ ] Credentials stored in `~/.hermes/.env`, never skills/memory
- [ ] Token rotation schedule set (monthly)
- [ ] Read-only verified (attempted transaction fails)
- [ ] Audit logs reviewed (Plaid Dashboard → Logs)
- [ ] Sandbox tested for 2+ weeks before production

## Related

- `github-auth` — Similar tokenized auth patterns (but for GitHub)
- `polymarket` — Financial data access (public APIs, no auth needed)
- Plaid Docs: https://plaid.com/docs/
- Plaid Security: https://plaid.com/security/
