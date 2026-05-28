'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_DIR     = process.env.HERMES_DATA_DIR ?? path.join(process.env.HOME ?? '/root', '.hermes');
const GATEWAYS_DIR = path.join(DATA_DIR, 'gateways');

function loadGatewayConfigs() {
  const configs = [];
  let files;
  try {
    files = fs.readdirSync(GATEWAYS_DIR).filter(f => f.endsWith('.yaml') && !f.endsWith('-resolved.yaml'));
  } catch {
    return [];
  }

  for (const file of files) {
    try {
      const raw  = fs.readFileSync(path.join(GATEWAYS_DIR, file), 'utf8');
      const cfg  = yaml.load(raw)?.gateway ?? {};
      const name = path.basename(file, '.yaml').replace('-gateway', '');
      const host = cfg.host ?? 'localhost';
      const port = cfg.api_port;
      if (port) configs.push({ name: `hermes-${name}`, host, port });
    } catch {}
  }
  return configs;
}

function pingPort(host, port, timeoutMs = 800) {
  return new Promise(resolve => {
    const req = http.request(
      { host, port, path: '/', method: 'GET', timeout: timeoutMs },
      res => { res.resume(); resolve(res.statusCode < 500 ? 'healthy' : 'degraded'); }
    );
    req.on('error', () => resolve('offline'));
    req.on('timeout', () => { req.destroy(); resolve('offline'); });
    req.end();
  });
}

async function checkGateways() {
  const configs = loadGatewayConfigs();
  return Promise.all(
    configs.map(async gw => ({
      name: gw.name,
      status: await pingPort(gw.host, gw.port),
      sessions: 0,
    }))
  );
}

module.exports = { checkGateways };
