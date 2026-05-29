import { NextRequest, NextResponse } from 'next/server';

const HERMES_API_URL = process.env.HERMES_API_URL ?? 'http://localhost:4000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return NextResponse.json({ error: 'message must be a non-empty string' }, { status: 400 });
    }

    const upstream = await fetch(`${HERMES_API_URL}/kiri/message`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: body.message.trim(), channel: body.channel ?? 'kiri-ops' }),
    });

    const data = await upstream.json().catch(() => ({ ok: upstream.ok }));
    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/kiri/message]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
