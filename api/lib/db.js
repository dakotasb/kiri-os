'use strict';

const path    = require('path');
const Database = require('better-sqlite3');

const DATA_DIR = process.env.HERMES_DATA_DIR ?? path.join(process.env.HOME ?? '/root', '.hermes');
const DB_PATH  = path.join(DATA_DIR, 'kanban.db');

let _db = null;

function db() {
  if (!_db) {
    _db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    _db.pragma('journal_mode = WAL');
  }
  return _db;
}

// Tasks ──────────────────────────────────────────────────────────

function listTasks({ status, assignee, limit = 100, offset = 0 } = {}) {
  let sql = `
    SELECT id, title, assignee, status, priority,
           created_at, started_at, completed_at,
           consecutive_failures, current_run_id, last_failure_error
    FROM tasks
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    const vals = status.split(',').map(s => s.trim()).filter(Boolean);
    sql += ` AND status IN (${vals.map(() => '?').join(',')})`;
    params.push(...vals);
  }
  if (assignee) {
    const vals = assignee.split(',').map(s => s.trim()).filter(Boolean);
    sql += ` AND assignee IN (${vals.map(() => '?').join(',')})`;
    params.push(...vals);
  }

  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return db().prepare(sql).all(...params);
}

function getTask(id) {
  return db().prepare(`
    SELECT id, title, body, assignee, status, priority,
           created_at, started_at, completed_at,
           consecutive_failures, current_run_id, last_failure_error
    FROM tasks WHERE id = ?
  `).get(id);
}

// Agent workload ─────────────────────────────────────────────────

function activeRunsByAgent() {
  const rows = db().prepare(`
    SELECT t.assignee, t.id, t.title
    FROM tasks t
    WHERE t.status IN ('running','ready')
      AND t.assignee IS NOT NULL
  `).all();

  const map = {};
  for (const r of rows) {
    if (!map[r.assignee]) map[r.assignee] = [];
    map[r.assignee].push({ id: r.id, title: r.title });
  }
  return map;
}

function tasksCompletedTodayByAgent() {
  const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const rows = db().prepare(`
    SELECT assignee, COUNT(*) as count
    FROM tasks
    WHERE status = 'done'
      AND completed_at >= ?
      AND assignee IS NOT NULL
    GROUP BY assignee
  `).all(startOfDay);

  return Object.fromEntries(rows.map(r => [r.assignee, r.count]));
}

// Aggregate stats ────────────────────────────────────────────────

function kanbanStats() {
  const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const startOfHour = Math.floor(Date.now() / 1000) - 3600;

  const byStatus = db().prepare(`
    SELECT status, COUNT(*) as count FROM tasks GROUP BY status
  `).all();

  const completedToday = db().prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE status = 'done' AND completed_at >= ?
  `).get(startOfDay).count;

  const completedLastHour = db().prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE status = 'done' AND completed_at >= ?
  `).get(startOfHour).count;

  const errors = db().prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE consecutive_failures > 0 AND status NOT IN ('done','archived')
  `).get().count;

  return { byStatus, completedToday, completedLastHour, errors };
}

module.exports = { listTasks, getTask, activeRunsByAgent, tasksCompletedTodayByAgent, kanbanStats };
