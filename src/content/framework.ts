/** Public capability copy shared by the landing page. */
export const features = [
  { id: 'react', title: 'React on a Rust Runtime', description: 'React stays real React while Rust owns request admission, routing, limits and host capabilities.' },
  { id: 'routing', title: 'One Application Graph', description: 'Routes, layouts, client references, actions, assets and cache policy come from one build graph.' },
  { id: 'renderer', title: 'Embedded Rendering Host', description: 'Server bundles run inside a Rust-owned JavaScript engine with explicit Web primitives and host calls.' },
  { id: 'build', title: 'Rust TSX Build Path', description: 'TypeScript and TSX are bundled through Rust libraries for server and browser targets.' },
  { id: 'splice', title: 'Internal Splice Boundary', description: 'Splice is a bounded Rust worker transport for isolation and replacement, not a public service.' },
  { id: 'deployment', title: 'Rust-Managed Artifacts', description: 'The target deployment is one project output with static assets and Rust-managed function artifacts.' },
  { id: 'actions', title: 'Server Actions & Routes', description: 'Route handlers and actions pass through Rust admission; app-specific authorization hooks remain a production gate.' },
  { id: 'cache', title: 'Explicit Cache Policy', description: 'Cache metadata, cache-control decisions and public/private admission are part of the verified graph contract.' },
];
