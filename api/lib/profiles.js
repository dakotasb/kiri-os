'use strict';

const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_DIR      = process.env.HERMES_DATA_DIR ?? path.join(process.env.HOME ?? '/root', '.hermes');
const PROFILES_DIR  = path.join(DATA_DIR, 'profiles');

let _cache = null;
let _cacheAt = 0;
const CACHE_TTL_MS = 60_000;

function loadProfiles() {
  const now = Date.now();
  if (_cache && now - _cacheAt < CACHE_TTL_MS) return _cache;

  const profiles = [];

  let entries;
  try {
    entries = fs.readdirSync(PROFILES_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    if (id === 'default') continue;

    const cfgPath = path.join(PROFILES_DIR, id, 'config.yaml');
    let model = 'unknown';
    try {
      const cfg = yaml.load(fs.readFileSync(cfgPath, 'utf8')) ?? {};
      model = cfg.model?.model ?? cfg.model?.default ?? 'unknown';
    } catch {}

    let role = '';
    let description = '';
    const soulPath = path.join(PROFILES_DIR, id, 'SOUL.md');
    try {
      const soul = fs.readFileSync(soulPath, 'utf8');
      // first heading after "You are X, the <role>" pattern
      const roleMatch = soul.match(/You are \w+,?\s+the\s+([\w\s&]+)\./i);
      if (roleMatch) role = roleMatch[1].trim();
      // first non-heading paragraph
      const paraMatch = soul.match(/##[^\n]*\n+([\s\S]+?)(?:\n##|\n\n##|$)/);
      if (paraMatch) description = paraMatch[1].replace(/\n/g, ' ').trim().slice(0, 120);
    } catch {}

    profiles.push({ id, model, role, description });
  }

  _cache = profiles;
  _cacheAt = now;
  return profiles;
}

module.exports = { loadProfiles };
