export const runtime = 'edge';

const GATEWAY = process.env.HERMES_GATEWAY_URL;
const API_KEY  = process.env.HERMES_API_KEY ?? '';

export async function POST(req: Request) {
  if (!GATEWAY) {
    return new Response('HERMES_GATEWAY_URL is not set', { status: 503 });
  }
  try {
    const { message, sessionId } = await req.json();
    if (!sessionId) return new Response('No session', { status: 400 });
    if (!message?.trim()) return new Response('No message', { status: 400 });

    const upstream = await fetch(
      `${GATEWAY}/api/sessions/${sessionId}/chat/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
        },
        body: JSON.stringify({ message: message.trim() }),
      }
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text, { status: upstream.status });
    }

    // Proxy the SSE stream — Edge runtime passes ReadableStream natively
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    return new Response(`Gateway error: ${err instanceof Error ? err.message : 'unknown'}`, { status: 503 });
  }
}
