'use strict';

const express = require('express');
const https   = require('https');

const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    const { message, channel = 'kiri-ops' } = req.body ?? {};
    if (!message?.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn(`[kiri] DISCORD_WEBHOOK_URL not set — simulating Discord post (channel: ${channel})`);
      console.info(`[kiri] message: ${message.trim()}`);
      return res.json({ ok: true, simulated: true });
    }

    await postToDiscord(webhookUrl, message.trim());
    res.json({ ok: true });
  } catch (err) {
    console.error('[kiri] message error', err);
    res.status(500).json({ error: err.message });
  }
});

function postToDiscord(webhookUrl, content) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ content });
    const url     = new URL(webhookUrl);

    const options = {
      hostname: url.hostname,
      port:     url.port || 443,
      path:     url.pathname + url.search,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        // Discord returns 204 No Content on success
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true });
        } else {
          reject(new Error(`Discord webhook ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

module.exports = router;
