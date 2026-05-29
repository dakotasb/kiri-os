'use strict';

const fs   = require('fs');
const path = require('path');

// Platform-aware default: on Windows, read kanban.db from WSL2 via UNC path
function defaultDataDir() {
  if (process.platform === 'win32') {
    return '\\\\wsl$\\Ubuntu-24.04\\home\\dakotasb\\.hermes';
  }
  const home = process.env.HOME ?? '/root';
  return path.join(home, '.hermes');
}

const DATA_DIR = process.env.HERMES_DATA_DIR ?? defaultDataDir();
const DB_PATH  = path.join(DATA_DIR, 'kanban.db');

let _sql   = null;
let _db    = null;
let _dbAt  = 0;
const DB_RELOAD_MS = 15_000; // reload every 15s so edits are picked up

async function getSql() {
  if (!_sql) {
    const initSqlJs = require('sql.js');
    _sql = await initSqlJs();
  }
  return _sql;
}

async function getDb() {
  const now = Date.now();
  if (_db && now - _dbAt < DB_RELOAD_MS) return _db;

  const SQL    = await getSql();
  const buffer = fs.readFileSync(DB_PATH);
  _db  = new SQL.Database(buffer);
  _dbAt = now;
  return _db;
}

// sql.js returns [{columns:[...], values:[[...],[...]]}]
function toRows(results) {
  if (!results.length) return [];
  const { columns, values } = results[0];
  return values.map(row =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

// Tasks ──────────────────────────────────────────────────────────

async function listTasks({ status, assignee, limit = 100, offset = 0 } = {}) {
  const db = await getDb();
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

  return toRows(db.exec(sql, params));
}

async function getTask(id) {
  const db  = await getDb();
  const rows = toRows(db.exec(
    `SELECT id, title, body, assignee, status, priority,
            created_at, started_at, completed_at,
            consecutive_failures, current_run_id, last_failure_error
     FROM tasks WHERE id = ?`, [id]
  ));
  return rows[0] ?? null;
}

// Agent workload ─────────────────────────────────────────────────

async function activeRunsByAgent() {
  const db   = await getDb();
  const rows = toRows(db.exec(
    `SELECT assignee, id, title FROM tasks
     WHERE status IN ('running','ready') AND assignee IS NOT NULL`
  ));
  const map = {};
  for (const r of rows) {
    if (!map[r.assignee]) map[r.assignee] = [];
    map[r.assignee].push({ id: r.id, title: r.title });
  }
  return map;
}

async function tasksCompletedTodayByAgent() {
  const db        = await getDb();
  const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const rows = toRows(db.exec(
    `SELECT assignee, COUNT(*) as count FROM tasks
     WHERE status = 'done' AND completed_at >= ? AND assignee IS NOT NULL
     GROUP BY assignee`, [startOfDay]
  ));
  return Object.fromEntries(rows.map(r => [r.assignee, r.count]));
}

// Aggregate stats ────────────────────────────────────────────────

async function kanbanStats() {
  const db = await getDb();
  const startOfDay  = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const startOfHour = Math.floor(Date.now() / 1000) - 3600;

  const byStatus = toRows(db.exec(
    'SELECT status, COUNT(*) as count FROM tasks GROUP BY status'
  ));
  const completedToday = toRows(db.exec(
    'SELECT COUNT(*) as count FROM tasks WHERE status = ? AND completed_at >= ?',
    ['done', startOfDay]
  ))[0]?.count ?? 0;

  const completedLastHour = toRows(db.exec(
    'SELECT COUNT(*) as count FROM tasks WHERE status = ? AND completed_at >= ?',
    ['done', startOfHour]
  ))[0]?.count ?? 0;

  const errors = toRows(db.exec(
    `SELECT COUNT(*) as count FROM tasks
     WHERE consecutive_failures > 0 AND status NOT IN ('done','archived')`
  ))[0]?.count ?? 0;

  return { byStatus, completedToday, completedLastHour, errors };
}

// Mutations ──────────────────────────────────────────────────────

async function writeDb() {
  const db = await getDb();
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
  _dbAt = Date.now(); // cache is fresh — skip reload for next DB_RELOAD_MS
}

async function createTask({ title, assignee = null, priority = 0, body = '' } = {}) {
  const db = await getDb();
  const id  = `t_${Math.random().toString(36).slice(2, 10)}`;
  const now = Math.floor(Date.now() / 1000);
  db.run(
    `INSERT INTO tasks (id, title, assignee, status, priority, body, created_at)
     VALUES (?, ?, ?, 'ready', ?, ?, ?)`,
    [id, title, assignee, priority, body, now]
  );
  await writeDb();
  return getTask(id);
}

async function patchTaskStatus(id, dashStatus) {
  const hermesMap = { todo: 'ready', 'in-progress': 'running', review: 'blocked', done: 'done' };
  const hermesStatus = hermesMap[dashStatus] ?? 'ready';
  const db  = await getDb();
  const now = Math.floor(Date.now() / 1000);
  if (dashStatus === 'done') {
    db.run(`UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?`, [hermesStatus, now, id]);
  } else if (dashStatus === 'in-progress') {
    db.run(`UPDATE tasks SET status = ?, started_at = coalesce(started_at, ?) WHERE id = ?`, [hermesStatus, now, id]);
  } else {
    db.run(`UPDATE tasks SET status = ? WHERE id = ?`, [hermesStatus, id]);
  }
  await writeDb();
  return getTask(id);
}

module.exports = { listTasks, getTask, activeRunsByAgent, tasksCompletedTodayByAgent, kanbanStats, createTask, patchTaskStatus };
