'use strict';

const express = require('express');
const http    = require('http');
const { checkGateways } = require('../lib/gateways');

const MEMPALACE_URL = process.env.MEMPALACE_URL ?? 'http://localhost:3100';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [mempalace, gateways] = await Promise.all([
      pingMemPalace(),
      checkGateways(),
    ]);

    const allHealthy = mempalace.status === 'ok' &&
      gateways.every(g => g.status !== 'offline');

    res.status(allHealthy ? 200 : 207).json({
      status:    allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      mempalace,
      gateways,
    });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

function pingMemPalace() {
  return new Promise(resolve => {
    const url = new URL('/health', MEMPALACE_URL);
    const mod = url.protocol === 'https:' ? require('https') : http;
    const req = mod.get(url.toString(), res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: json.status ?? 'ok', responseMs: 0 });
        } catch {
          resolve({ status: 'error', responseMs: 0 });
        }
      });
    });
    req.on('error', () => resolve({ status: 'offline' }));
    req.setTimeout(2000, () => { req.destroy(); resolve({ status: 'timeout' }); });
  });
}

module.exports = router;
