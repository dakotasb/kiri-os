'use strict';

const express = require('express');
const { listTasks, getTask, createTask, patchTaskStatus } = require('../lib/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, assignee, limit, offset } = req.query;
    const tasks = await listTasks({
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
      priority:    normalizePriority(t.priority),
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

router.post('/', async (req, res) => {
  try {
    const { title, assignee, priority = 'medium', body = '' } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'title is required' });
    const priorityNum = priority === 'high' ? 10 : priority === 'medium' ? 5 : 0;
    const task = await createTask({ title: title.trim(), assignee: assignee || null, priority: priorityNum, body });
    const mapped = {
      id:       task.id,
      title:    task.title,
      assignee: task.assignee,
      status:   'todo',
      priority: normalizePriority(task.priority),
      progress: 0,
      startedAt:   null,
      completedAt: null,
      isHumanReview: false,
    };
    res.status(201).json({ task: mapped });
  } catch (err) {
    console.error('create task error', err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['todo', 'in-progress', 'review', 'done'];
    if (!valid.includes(status)) return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
    const task = await patchTaskStatus(req.params.id, status);
    if (!task) return res.status(404).json({ error: `Task not found: ${req.params.id}` });
    res.json({ task: { ...task, status, priority: normalizePriority(task.priority) } });
  } catch (err) {
    console.error('patch status error', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await getTask(req.params.id);
    if (!task) return res.status(404).json({ error: `Task not found: ${req.params.id}` });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// numeric priority → label
function normalizePriority(p) {
  if (p >= 10) return 'high';
  if (p >= 5)  return 'medium';
  return 'low';
}

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
