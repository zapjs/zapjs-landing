/** Public capability copy shared by the page and /api/features. */
export const features = [
  { id: 'react', title: 'React Server Components', description: 'Render on the server, hydrate interactive components, and stream Suspense boundaries in one application.' },
  { id: 'routing', title: 'File-Based Routing', description: 'Pages, nested layouts, route groups and dynamic segments share one route graph. Public pages can opt into prerendering.' },
  { id: 'native', title: 'Typed Native Functions', description: 'Import compiled Rust exports through zap:native in server code. napi-rs generates the TypeScript declarations.' },
  { id: 'deployment', title: 'Managed Deployment', description: 'Build static assets and a traced Node 22 function for Vercel. Optional Rust runs inside that same function.' },
  { id: 'actions', title: 'Server Actions', description: 'Use React forms and async actions with origin checks, body limits and build-scoped references. Authorize operations in your application.' },
  { id: 'streaming', title: 'Web Request & Response', description: 'Route handlers return standard responses, including streams and binary bodies. Backpressure and cancellation reach their producers.' },
  { id: 'development', title: 'One Development Command', description: 'zap dev updates React through Vite. Native edits rebuild the addon and restart the local runtime, with compiler errors surfaced.' },
  { id: 'cache', title: 'Explicit Shared Caching', description: 'Request-local memoization and optional Redis-backed public caches. Tagged invalidation coordinates across function instances.' },
];

export const frameworkArchive = '/downloads/zap-js-client-0.3.0.tgz';
