export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Send application/json' }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  return Response.json(
    { requestId: crypto.randomUUID(), method: request.method, path: new URL(request.url).pathname, body, receivedAt: new Date().toISOString() },
    { headers: { 'cache-control': 'private, no-store' } },
  );
}
