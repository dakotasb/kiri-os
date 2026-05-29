import { NextResponse } from 'next/server';

const GATEWAY = process.env.HERMES_GATEWAY_URL ?? 'http://localhost:8642';
const API_KEY  = process.env.HERMES_API_KEY ?? '';

export async function POST() {
  try {
    const res = await fetch(`${GATEWAY}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) return NextResponse.json({ error: 'Hermes unavailable' }, { status: 503 });
    const data = await res.json();
    return NextResponse.json({ id: data.session?.id ?? data.id });
  } catch {
    return NextResponse.json({ error: 'Hermes unreachable' }, { status: 503 });
  }
}
