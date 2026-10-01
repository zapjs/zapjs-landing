/** Public capability copy shared by the page and /api/features. */
export const features = [
  { id: 'react', title: 'React on a Rust Runtime', description: 'React stays real React while Rust owns request admission, routing, limits, streaming and host capabilities.' },
  { id: 'routing', title: 'One Application Graph', description: 'Routes, layouts, client references, actions, assets and cache policy come from one build graph.' },
  { id: 'renderer', title: 'Embedded Rendering Host', description: 'Server bundles run inside a Rust-owned JavaScript engine with explicit Web primitives and host calls.' },
  { id: 'build', title: 'Rust TSX Build Path', description: 'TypeScript and TSX are bundled through Rust libraries for server and browser targets.' },
  { id: 'splice', title: 'Internal Splice Boundary', description: 'Splice is a bounded Rust worker transport for isolation and replacement, not a public service.' },
  { id: 'deployment', title: 'Managed Native Artifacts', description: 'The target deployment is one project output with static assets and Rust-managed function artifacts.' },
  { id: 'actions', title: 'Server Actions & Routes', description: 'Mutations and route handlers are admitted by Rust with explicit body, context and authorization boundaries.' },
  { id: 'cache', title: 'Explicit Cache Policy', description: 'Public prerendering, request-local memoization and shared cache metadata are part of the graph contract.' },
];
