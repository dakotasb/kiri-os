'use strict';

const express = require('express');
const { listTasks, getTask } = require('../lib/db');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { status, assignee, limit, offset } = req.query;
    const tasks = listTasks({
      status:   status ?? undefined,
      assignee: assignee ?? undefined,
      limit:    Math.min(parseInt(limit ?? '100', 10), 500),
      offset:   parseInt(offset ?? '0', 10),
    });

    const mapped = tasks.map(t => ({
      id:          t.id,
      title:       t.title,
      assignee:    t.assignee,
      status:      normalizeStatus(t.status),
      priority:    t.priority,
      startedAt:   t.started_at   ? relativeTime(t.started_at)   : null,
      completedAt: t.completed_at ? relativeTime(t.completed_at) : null,
      createdAt:   t.created_at,
      progress:    estimateProgress(t),
      isHumanReview: false,
    }));

    res.json({ timestamp: new Date().toISOString(), tasks: mapped });
  } catch (err) {
    console.error('tasks error', err);
    res.status(500).json({ error: err.message, tasks: [] });
  }
});

router.get('/:id', (req, res) => {
  try {
    const task = getTask(req.params.id);
    if (!task) return res.status(404).json({ error: `Task not found: ${req.params.id}` });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hermes statuses → dashboard statuses
function normalizeStatus(s) {
  if (s === 'running')  return 'in-progress';
  if (s === 'ready')    return 'todo';
  if (s === 'done')     return 'done';
  if (s === 'blocked')  return 'review';
  if (s === 'triage')   return 'todo';
  return 'todo';
}

function estimateProgress(task) {
  if (task.status === 'done')    return 100;
  if (task.status === 'running' && task.started_at) {
    const elapsed = Date.now() / 1000 - task.started_at;
    return Math.min(90, Math.round(elapsed / 36));
  }
  return 0;
}

function relativeTime(unixSec) {
  const diff = Math.floor(Date.now() / 1000 - unixSec);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

module.exports = router;
