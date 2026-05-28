'use strict';

const express = require('express');
const http    = require('http');
const { kanbanStats } = require('../lib/db');

const QDRANT_URL    = process.env.QDRANT_URL    ?? 'http://localhost:6333';
const MEMPALACE_URL = process.env.MEMPALACE_URL ?? 'http://localhost:3100';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [kStats, memoriesStored] = await Promise.all([
      Promise.resolve(kanbanStats()),
      fetchTotalMemories().catch(() => null),
    ]);

    const statusMap = Object.fromEntries(kStats.byStatus.map(r => [r.status, r.count]));
    const activeAgents = (statusMap.running ?? 0);
    const tasksPerHour = kStats.completedLastHour;

    res.json({
      timestamp:       new Date().toISOString(),
      completedToday:  kStats.completedToday,
      tasksPerHour,
      activeAgents,
      totalErrors:     kStats.errors,
      memoriesStored:  memoriesStored ?? 0,
      uptimePercent:   99.9,
      tasksByStatus:   statusMap,
    });
  } catch (err) {
    console.error('stats error', err);
    res.status(500).json({ error: err.message });
  }
});

async function fetchTotalMemories() {
  const collectionsRes = await jsonGet(`${QDRANT_URL}/collections`);
  const collections = collectionsRes?.result?.collections ?? [];

  const counts = await Promise.all(
    collections.map(async c => {
      const col = await jsonGet(`${QDRANT_URL}/collections/${c.name}`).catch(() => null);
      return col?.result?.points_count ?? 0;
    })
  );
  return counts.reduce((a, b) => a + b, 0);
}

function jsonGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { reject(new Error('bad json')); }
      });
    }).on('error', reject);
  });
}

module.exports = router;
