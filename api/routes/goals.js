'use strict';

const express  = require('express');
const router   = express.Router();
const { getGoalsDb, persistGoalsDb } = require('../lib/goals-db');
const { stageFact }                  = require('../lib/mempalace');

function rowsToGoals(result) {
  if (!result[0]) return [];
  const [{ columns, values }] = result;
  return values.map(row =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

router.get('/', async (_req, res) => {
  try {
    const db     = await getGoalsDb();
    const result = db.exec('SELECT * FROM goals ORDER BY created_at DESC');
    res.json(rowsToGoals(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, agentId, category, metric, targetDate } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'title required' });
  const id = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  try {
    const db = await getGoalsDb();
    db.run(
      'INSERT INTO goals (id, title, agent_id, category, metric, target_date, progress, created_at) VALUES (?,?,?,?,?,?,0,?)',
      [id, title.trim(), agentId ?? null, category ?? null, metric ?? null, targetDate ?? null, Date.now()]
    );
    persistGoalsDb();

    // Sync to MemPalace so suggest_goal skill can find it in future sessions
    const fact = [
      `User goal created: "${title.trim()}"`,
      category  ? `category: ${category}`           : null,
      agentId   ? `assigned to agent: ${agentId}`   : null,
      metric    ? `metric: ${metric}`                : null,
      targetDate? `target date: ${targetDate}`       : null,
      `dashboard goal ID: ${id}`,
    ].filter(Boolean).join(', ') + '.';
    stageFact(fact).catch(err => console.warn('[mempalace] goal sync:', err.message));

    res.status(201).json({ id, title: title.trim(), agentId, category, metric, targetDate, progress: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { progress, note } = req.body;
  try {
    const db = await getGoalsDb();
    db.run('UPDATE goals SET progress=? WHERE id=?', [progress ?? 0, req.params.id]);
    persistGoalsDb();
    // Sync progress update to MemPalace (best-effort)
    if (note) {
      stageFact(`Goal progress update (ID: ${req.params.id}): ${note}. New progress: ${progress}%.`)
        .catch(err => console.warn('[mempalace] progress sync:', err.message));
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await getGoalsDb();
    db.run('DELETE FROM goals WHERE id=?', [req.params.id]);
    persistGoalsDb();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
