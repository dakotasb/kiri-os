#!/usr/bin/env node

/**
 * Plaid Sandbox Test Script
 * Tests connection using sandbox credentials (fake data only)
 *
 * Usage: node test-plaid-sandbox.js
 * Requires: ~/.hermes/plaid-sandbox/.env with PLAID_CLIENT_ID and PLAID_SECRET
 */

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.join(process.env.HOME, '.hermes', 'plaid-sandbox', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match && !match[1].startsWith('#')) {
            process.env[match[1]] = match[2];
        }
    });
}

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

if (!PLAID_CLIENT_ID || PLAID_CLIENT_ID === 'your_client_id_here') {
    console.error('❌ Error: PLAID_CLIENT_ID not configured');
    console.log('\n1. Get credentials: https://dashboard.plaid.com/team/keys');
    console.log('2. Create ~/.hermes/plaid-sandbox/.env');
    console.log('3. Add: PLAID_CLIENT_ID=your_actual_id');
    console.log('4. Add: PLAID_SECRET=sandbox_secret');
    process.exit(1);
}

if (!PLAID_SECRET || PLAID_SECRET === 'sandbox_secret_here') {
    console.error('❌ Error: PLAID_SECRET not configured');
    process.exit(1);
}

console.log(`🔐 Testing Plaid ${PLAID_ENV} Connection...\n`);

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(configuration);

async function testConnection() {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: `agent-test-${Date.now()}` },
            client_name: 'Secure Financial Agent Test',
            products: ['transactions', 'balance'],
            country_codes: ['US'],
            language: 'en',
        });

        console.log('✅ SUCCESS! Plaid connection working');
        console.log(`Environment: ${PLAID_ENV}`);
        console.log(`Token expires: 30 minutes\n`);
        
        if (PLAID_ENV === 'sandbox') {
            console.log('⚠️  SANDBOX MODE: All data is fictional ("First Platypus Bank")');
            console.log('   No real accounts accessed. Safe to test.\n');
        }

        console.log('Next steps:');
        console.log('- Enable REVENUE_AGENT_ENABLED=true in .env');
        console.log('- Agent can now query balances/transactions (read-only)');
        console.log('- Verify scopes in Plaid Dashboard\n');
        
        return true;
    } catch (error) {
        console.error('❌ Connection failed:', error.response?.data || error.message);
        console.log('\nTroubleshooting:');
        console.log('- Verify credentials at https://dashboard.plaid.com/team/keys');
        console.log('- Ensure you are using SANDBOX secret (not development/production)');
        return false;
    }
}

testConnection().then(success => process.exit(success ? 0 : 1));
