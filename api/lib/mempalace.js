'use strict';

/**
 * Thin MemPalace MCP client for server-side fact staging.
 * Uses mempalace_session_summary — auto-routes via semantic matching,
 * no taxonomy knowledge required.
 */

const BASE      = 'http://localhost:3100/mcp';
const BASE_HDRS = {
  'Content-Type': 'application/json',
  'Accept':       'application/json, text/event-stream',
};
const SESSION_TTL = 4 * 60 * 1000; // 4 min — under MCP idle timeout

let _sid = null;
let _at  = 0;
let _id  = 1;

async function _post(sid, method, params = {}) {
  const hdrs = { ...BASE_HDRS };
  if (sid) hdrs['Mcp-Session-Id'] = sid;
  const res  = await fetch(BASE, {
    method:  'POST',
    headers: hdrs,
    body:    JSON.stringify({ jsonrpc: '2.0', id: _id++, method, params }),
  });
  const newSid = res.headers.get('Mcp-Session-Id');
  const data   = await res.json();
  return { sid: newSid || sid, data };
}

async function _session() {
  if (_sid && Date.now() - _at < SESSION_TTL) return _sid;
  const { sid, data } = await _post(null, 'initialize', {
    protocolVersion: '2024-11-05',
    capabilities:   {},
    clientInfo:     { name: 'kiri-dashboard', version: '1.0' },
  });
  if (data.error) throw new Error(`MemPalace init: ${data.error.message}`);
  _sid = sid;
  _at  = Date.now();
  try { await _post(_sid, 'notifications/initialized'); } catch {}
  return _sid;
}

/**
 * Stage a plain-text fact into MemPalace.
 * mempalace_session_summary auto-resolves palace + taxonomy via semantic routing.
 * Fire-and-forget safe — errors are returned, not thrown to caller.
 */
async function stageFact(text) {
  try {
    const sid = await _session();
    const { data } = await _post(sid, 'tools/call', {
      name:      'mempalace_session_summary',
      arguments: { facts: text },
    });
    if (data.error) {
      // Session may have expired — reset and retry once
      _sid = null;
      const sid2 = await _session();
      const { data: data2 } = await _post(sid2, 'tools/call', {
        name:      'mempalace_session_summary',
        arguments: { facts: text },
      });
      if (data2.error) throw new Error(data2.error.message);
      return data2.result;
    }
    return data.result;
  } catch (err) {
    throw new Error(`stageFact failed: ${err.message}`);
  }
}

module.exports = { stageFact };
