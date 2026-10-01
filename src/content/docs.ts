export type DocumentationBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; code: string; language: 'typescript' | 'rust' | 'shell' | 'text'; filename?: string }
  | { type: 'callout'; text: string };

export interface DocumentationSection { id: string; title: string; summary: string; blocks: DocumentationBlock[] }

const p = (text: string): DocumentationBlock => ({ type: 'paragraph', text });
const h = (text: string): DocumentationBlock => ({ type: 'heading', text });
const list = (...items: string[]): DocumentationBlock => ({ type: 'list', items });
const code = (code: string, language: 'typescript' | 'rust' | 'shell' | 'text' = 'typescript', filename?: string): DocumentationBlock => ({ type: 'code', code, language, filename });
const note = (text: string): DocumentationBlock => ({ type: 'callout', text });

export const documentation: DocumentationSection[] = [
  { id: 'introduction', title: 'Introduction', summary: 'React framework semantics with Rust-owned runtime and tooling.', blocks: [
    p('ZapJS is a Rust-owned React framework. The final implementation keeps the integrated application model developers expect from Next.js: file-based routes, nested layouts, server rendering, React Server Components, hydration, server actions, route handlers, static assets and managed deployment output from one project.'),
    p('React remains real React JavaScript. Server bundles execute inside a Rust-controlled JavaScript engine with explicit Web primitives and named host operations. Rust owns request admission, routing, resource limits, cancellation, explicit host operations, build orchestration and deployment packaging.'),
    list('One application graph owns routes, assets, client references, actions and cache metadata.', 'Rust compiles TypeScript and TSX through Rust libraries for server and browser targets.', 'The embedded renderer exposes only the host capabilities ZapJS installs.', 'Splice is internal worker infrastructure, not a public service.'),
  ] },
  { id: 'status', title: 'Implementation Status', summary: 'What exists today and what still needs a vertical slice.', blocks: [
    p('The current core repository contains verified foundation crates. They prove important contracts at the crate boundary; they do not yet constitute a production-complete framework.'),
    list('zap-runtime: route parsing, safe path decoding, compiled lookup and manifest source identity validation.', 'zap-splice: bounded Rust worker transport with cancellation, deadlines, frame limits, crash cleanup and subprocess coverage.', 'zap-render: Rust-owned JavaScript execution with route/action Response status and header validation, Web Stream consumption, explicit host calls, absence of ambient platform APIs, output limits and CPU interruption.', 'zap-build: Rust-only TSX bundling through Rolldown/Oxc for server IIFE and browser module outputs, with callable action and route-handler export discovery plus named export-list cache metadata discovery, re-export list exclusion until explicit graph resolution exists, Node builtin rejection, ambient platform-global rejection across direct, optional, literal and statically computed bracketed, probe and destructured references, static template module-specifier scanning, non-static dynamic-import rejection and regex-literal/non-reference identifier false-positive protection.'),
    code('CARGO_TARGET_DIR=artifacts/verification/rust-target cargo +1.96.0 test --workspace', 'shell'),
    note('The next production gate is connecting these crates into real React SSR, Flight, hydration, navigation, actions, route handlers, cache metadata and Rust-managed deployment artifacts.'),
  ] },
  { id: 'architecture', title: 'Architecture', summary: 'The request path and build graph ZapJS is targeting.', blocks: [
    h('Build graph'),
    p('The Rust build graph owns route hierarchy, layouts, server/client boundaries, action references, assets, dependency resolution, cache policy and deployment capabilities. Development and production must use the same graph semantics.'),
    h('Request runtime'),
    p('A managed invocation enters a Rust request runtime. The target runtime dispatches through the compiled route graph, applies Rust-owned admission, invokes explicit host operations and runs the embedded React renderer when needed. Response streaming stays a verification gate until the full pipeline proves backpressure and abort behavior.'),
    h('Renderer'),
    p('Server React bundles run inside an isolated JavaScript context controlled by Rust. The renderer has no filesystem, process, network, browser storage, DOM, socket or package-loader API by default. Host calls are explicit and bounded.'),
    code(`Source app
  -> Rust build graph
  -> static assets + browser chunks + server bundles + manifest
  -> Rust-managed artifact
  -> Rust request runtime
  -> embedded React renderer or explicit Rust host operation
  -> response bytes`, 'text'),
  ] },
  { id: 'splice', title: 'Splice', summary: 'Internal process isolation without turning into a public backend.', blocks: [
    p('Splice connects trusted Rust peers where the framework needs process isolation or worker replacement. It is not a public RPC API and it is not a user-operated backend service.'),
    list('Versioned handshake and negotiated frame limits.', 'Bounded in-flight admission.', 'Typed success and remote error replies.', 'Client-side cancellation and server-side deadlines.', 'Connection failure cleanup for pending calls.', 'Subprocess fixture coverage.'),
    p('Streaming is deliberately not claimed yet. It needs credit-based backpressure and cancellation tests before it becomes part of the public contract.'),
  ] },
  { id: 'runtime', title: 'Runtime Boundaries', summary: 'What application code can rely on.', blocks: [
    p('Application work crosses explicit Rust admission or named React-host operations. Browser bundles cannot import server runtime APIs. Server bundles receive only the Web primitives and host operations ZapJS provides.'),
    p('Route handlers and actions need explicit admission before application code mutates state. The verified foundation covers body, request-context, deadline and public/private cache policy checks; app-specific authorization hooks remain a production gate.'),
    p('Public prerendering and shared cache metadata belong to the graph. Request-local memoization is scoped to one request; cross-instance invalidation requires a host-managed store or Rust-owned persistence boundary with deployment-specific namespace and versioning.'),
  ] },
  { id: 'deployment', title: 'Deployment', summary: 'One managed project output with Rust-managed artifacts.', blocks: [
    p('The target deployment is one project output lowered into the host artifact format: static assets, browser chunks, server bundles, route manifest, cache metadata and Rust-managed dynamic function artifacts.'),
    p('ZapJS owns the normal application deployment boundary and any worker lifecycle it needs.'),
    p('Managed deployment evidence must prove the actual artifact, process runtime, request aborts, static assets and instance reuse on the target platform. Streaming requires separate backpressure evidence before it is advertised as a production contract.'),
  ] },
  { id: 'performance', title: 'Performance', summary: 'Measure the full path before claiming speed.', blocks: [
    p('ZapJS optimizes by avoiding work first: prerender public output, cache explicit public data, reduce browser JavaScript and remove waterfalls. Streaming is not counted as a public performance feature until the Rust pipeline proves backpressure and abort behavior end to end.'),
    p('Rust is valuable for lifecycle control, artifact packaging, CPU-heavy work and tightly bounded runtime infrastructure. It is not a license to claim a universal speedup without matching evidence.'),
    list('Measure cold and warm latency.', 'Report p50, p95 and p99.', 'Track memory, CPU, throughput and errors.', 'Measure client JavaScript transfer and browser-visible rendering.', 'Compare against pinned framework versions under equivalent behavior and load.'),
  ] },
  { id: 'verification', title: 'Verification Gates', summary: 'What must be proven before production claims.', blocks: [
    list('React HTML SSR and Flight run through the Rust-owned renderer.', 'The graph emits matching server bundles, browser chunks, client references and action IDs.', 'Hydration, navigation, pending states, error boundaries and actions pass browser automation.', 'Route handlers and server actions complete full Rust invocation with application-specific authorization hooks.', 'Rust-managed deployment artifacts are produced and verified.', 'The landing site only advertises behavior backed by executable evidence.'),
    note('Crate tests and Fozzy traces are evidence for the foundation. They are not substitutes for the full framework vertical slice.'),
  ] },
];
