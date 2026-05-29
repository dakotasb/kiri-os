'use strict';

const express  = require('express');
const { loadProfiles }           = require('../lib/profiles');
const { activeRunsByAgent, tasksCompletedTodayByAgent } = require('../lib/db');
const { checkGateways }          = require('../lib/gateways');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [profiles, activeRuns, todayCounts, gateways] = await Promise.all([
      Promise.resolve(loadProfiles()),
      activeRunsByAgent(),
      tasksCompletedTodayByAgent(),
      checkGateways(),
    ]);

    const agents = profiles.map(p => {
      const running = activeRuns[p.id] ?? [];
      return {
        id:           p.id,
        model:        p.model,
        role:         p.role,
        description:  p.description,
        status:       running.length > 0 ? 'active' : 'idle',
        sessions:     running.length,
        tasksToday:   todayCounts[p.id] ?? 0,
        runningTask:  running[0] ?? null,
      };
    });

    const active  = agents.filter(a => a.status === 'active').length;
    const idle    = agents.filter(a => a.status === 'idle').length;

    res.json({
      timestamp: new Date().toISOString(),
      agents,
      gateways,
      counts: { active, idle, offline: 0 },
    });
  } catch (err) {
    console.error('fleet error', err);
    res.status(500).json({ error: err.message, agents: [], gateways: [], counts: { active: 0, idle: 0, offline: 0 } });
  }
});

module.exports = router;
