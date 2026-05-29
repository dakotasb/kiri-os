'use strict';

const initSqlJs = require('sql.js');
const fs   = require('fs');
const path = require('path');

const DB_PATH = process.env.GOALS_DB_PATH ?? path.join(__dirname, '../data/goals.db');

let _db = null;

async function getGoalsDb() {
  if (_db) return _db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(fileBuffer);
  } else {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    _db = new SQL.Database();
  }
  _db.run(`CREATE TABLE IF NOT EXISTS goals (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    agent_id   TEXT,
    category   TEXT,
    metric     TEXT,
    target_date TEXT,
    progress   INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
  )`);
  return _db;
}

function persistGoalsDb() {
  if (!_db) return;
  const data = _db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getGoalsDb, persistGoalsDb };
