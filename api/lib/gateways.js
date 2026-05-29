'use strict';

const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Platform-aware default: on Windows, access WSL2 filesystem via UNC path
function defaultDataDir() {
  if (process.platform === 'win32') {
    return '\\\\wsl$\\Ubuntu-24.04\\home\\dakotasb\\.hermes';
  }
  return path.join(process.env.HOME ?? '/root', '.hermes');
}

const DATA_DIR     = process.env.HERMES_DATA_DIR ?? defaultDataDir();
const GATEWAYS_DIR = path.join(DATA_DIR, 'gateways');
const PROFILES_DIR = path.join(DATA_DIR, 'profiles');

// Extract WSL2 distro from a UNC DATA_DIR like \\wsl$\Ubuntu-24.04\home\...
// Returns the base /proc UNC path, e.g. \\wsl$\Ubuntu-24.04\proc
function wslProcBase() {
  const m = DATA_DIR.match(/^\\\\wsl\$\\([^\\]+)/i);
  return m ? `\\\\wsl$\\${m[1]}\\proc` : null;
}

// Check if a WSL2 process is alive by stat-ing /proc/{pid} via UNC path.
// Returns false if the UNC path is unavailable or the directory is absent.
function isPidAlive(pid) {
  const procBase = wslProcBase();
  if (!procBase) return false;
  try {
    fs.statSync(`${procBase}\\${pid}`);
    return true;
  } catch {
    return false;
  }
}

// Build profile-name → display-name map from YAML gateway configs (optional enrichment)
function loadGatewayNames() {
  const map = {};
  try {
    const files = fs.readdirSync(GATEWAYS_DIR)
      .filter(f => f.endsWith('.yaml') && !f.endsWith('-resolved.yaml'));
    for (const file of files) {
      const name = path.basename(file, '.yaml').replace(/-gateway$/, '');
      map[name] = `hermes-${name}`;
    }
  } catch { /* gateways dir absent — use default names */ }
  return map;
}

async function checkGateways() {
  const nameMap = loadGatewayNames();

  // Enumerate profile directories
  let profileDirs = [];
  try {
    profileDirs = fs.readdirSync(PROFILES_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch {
    return [];
  }

  const results = [];
  for (const profile of profileDirs) {
    const pidFile = path.join(PROFILES_DIR, profile, 'gateway.pid');
    try {
      const raw  = fs.readFileSync(pidFile, 'utf8');
      const info = JSON.parse(raw);
      if (!info?.pid) continue;          // malformed file
      const alive = isPidAlive(info.pid);
      results.push({
        name:     nameMap[profile] ?? `hermes-${profile}`,
        status:   alive ? 'healthy' : 'offline',
        sessions: 0,
      });
    } catch {
      // No gateway.pid → gateway not running for this profile; skip entirely
    }
  }

  return results;
}

module.exports = { checkGateways };
