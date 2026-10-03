'use server';

const featureRows = [
  { title: 'Rust-owned graph', detail: 'Routes, layouts, handlers, actions, browser chunks and static assets are emitted from one manifest.' },
  { title: 'React authoring', detail: 'Pages and components stay in React while build, admission and serving are owned by Rust.' },
  { title: 'Splice boundary', detail: 'Internal worker isolation is bounded with deadlines, cancellation and typed remote errors.' },
];

const posts = [
  { id: 'post_001', slug: 'production-baseline', title: 'Production baseline', tag: 'release' },
  { id: 'post_002', slug: 'splice-boundary', title: 'Splice boundary', tag: 'runtime' },
  { id: 'post_003', slug: 'measured-performance', title: 'Measured performance', tag: 'evidence' },
];

export async function runExample(input) {
  const request = input || {};
  const id = String(request.id || 'stats');
  const payload = request.payload || {};

  let body;
  if (id === 'stats') {
    body = {
      route: '/_zap/action',
      action: 'stats',
      framework: 'ZapJS',
      runtimeOwner: 'Rust',
      routes: 5,
      serverActions: 1,
      clientReferences: 2,
      status: 'verified',
    };
  } else if (id === 'features') {
    body = {
      route: '/_zap/action',
      action: 'features',
      count: featureRows.length,
      features: featureRows,
    };
  } else if (id === 'benchmarks') {
    body = {
      route: '/_zap/action',
      action: 'benchmarks',
      policy: 'public performance claims stay tied to checked-in evidence',
      evidence: [
        'Aegis browser matrices',
        'Fozzy deterministic traces',
        'Zap CLI build and check output',
      ],
    };
  } else if (id === 'users') {
    body = {
      route: '/_zap/action',
      action: 'users',
      total: 3,
      users: [
        { id: 'usr_001', name: 'Ada Lovelace', role: 'builder' },
        { id: 'usr_002', name: 'Grace Hopper', role: 'systems' },
        { id: 'usr_003', name: 'Ferris Crab', role: 'mascot' },
      ],
    };
  } else if (id === 'posts') {
    body = {
      route: '/_zap/action',
      action: 'posts',
      page: Number(payload.page || 1),
      limit: Number(payload.limit || 3),
      posts,
    };
  } else if (id === 'subscribe') {
    const email = String(payload.email || 'reader@example.com');
    body = {
      route: '/_zap/action',
      action: 'subscribe',
      ok: email.includes('@'),
      email,
      message: email.includes('@') ? 'Accepted by the ZapJS server action demo.' : 'Email must contain @.',
    };
  } else if (id === 'echo') {
    body = {
      route: '/_zap/action',
      action: 'echo',
      method: 'ACTION',
      received: payload,
    };
  } else {
    body = {
      route: '/_zap/action',
      action: id,
      ok: false,
      error: 'Unknown example',
    };
  }

  return new Response(JSON.stringify(body, null, 2), {
    status: body.ok === false && body.error ? 404 : 200,
    headers: {
      'content-type': 'application/json',
      'x-zap-action': 'runExample',
    },
  });
}
