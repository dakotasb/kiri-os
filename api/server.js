'use strict';

const express = require('express');

const fleet  = require('./routes/fleet');
const tasks  = require('./routes/tasks');
const stats  = require('./routes/stats');
const health = require('./routes/health');

const PORT = parseInt(process.env.PORT ?? '4000', 10);

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/fleet',  fleet);
app.use('/tasks',  tasks);
app.use('/stats',  stats);
app.use('/health', health);

app.get('/', (_req, res) => res.json({ service: 'kiri-api', version: '1.0.0' }));

app.listen(PORT, () => {
  const dataDir = process.env.HERMES_DATA_DIR ?? '~/.hermes';
  console.log(`kiri-api :${PORT}  data=${dataDir}`);
});
