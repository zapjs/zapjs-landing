export const evidence = {
  commit: 'e8856b0',
  trace: 'artifacts/verification/traces/rust-only-crates-host-20261001081833.fozzy',
  reports: [
    ['Smoke browser matrix', '3 navigation/action cycles', 'artifacts/verification/aegis-matrix-latest.json'],
    ['Soak browser matrix', '50 repeated navigation/action cycles', 'artifacts/verification/aegis-soak-latest.json'],
    ['Commerce app-shape matrix', 'route groups, nested layouts, dynamic and optional catch-all routes', 'artifacts/verification/aegis-commerce-latest.json'],
    ['Real React package matrix', 'React 19.3.0, React DOM 19.3.0 and React Server DOM Webpack 19.3.0', 'artifacts/verification/aegis-real-react-latest.json'],
  ],
};

export const capabilities = [
  ['React, owned by Rust', 'React authoring stays familiar. Rust owns routing, request admission, resource limits, bundling, execution and deployment artifacts.'],
  ['One application graph', 'Pages, layouts, route handlers, server actions, client references, browser chunks, static assets and cache metadata are produced from one manifest.'],
  ['Real React evidence', 'The browser path has executable evidence with React 19.3.0, React DOM 19.3.0 and React Server DOM Webpack 19.3.0 package sources.'],
  ['Server actions and route handlers', 'Mutation paths pass through Rust admission before application bundles execute. The browser action proxy targets the Rust-owned action endpoint.'],
  ['Splice inside the framework', 'Splice is an internal Rust worker boundary with bounded unary calls, cancellation, deadlines, typed remote errors and credit-based streaming coverage.'],
  ['Managed deployment shape', 'The Rust CLI builds, packages, deploys and serves local-package, managed-native and provider filesystem artifact roots.'],
];

export const codeExample = `export default function Page({ params, searchParams }) {
  return <main>Zap route {params.slug} from Rust-owned props</main>;
}

'use server';
export async function save(input) {
  return new Response(JSON.stringify({ ok: true, input }));
}`;

export const docs = [
  {
    id: 'start',
    title: 'What ZapJS is',
    summary: 'A React framework surface implemented through Rust-owned build, runtime and deployment control.',
    paragraphs: [
      'ZapJS is a React-plus-Rust framework. React remains real React JavaScript, while Rust owns the application graph, routing, request admission, execution limits, build orchestration and deployment artifacts.',
      'The implemented surface now has executable evidence for page HTML SSR, page Flight, generated hydration, server actions, route handlers, static assets, client navigation, pending and error navigation state, package-root deployment and provider filesystem upload.',
      'The production claim is scoped to the behavior verified in the core repo. New public claims must land with matching tests, Aegis reports, Fozzy traces or deployment artifacts before this site describes them as implemented.',
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    summary: 'One graph feeds server bundles, browser chunks, actions, routes and deployment manifests.',
    paragraphs: [
      'The Rust build graph discovers file-based routes, nested layouts, client references, server actions, route handlers, assets and cache policy. It emits the runtime manifest plus server and browser artifacts from the same model.',
      'Requests enter Rust first. Rust resolves the route, enforces path, method, body, cache, origin and execution-context policy, then dispatches to an embedded JavaScript renderer only after admission succeeds.',
      'Browser hydration uses generated metadata from the manifest. The bootstrap imports browser chunks, hydrates page bundles, handles same-origin navigation, aborts superseded navigations and exposes navigation state.',
    ],
  },
  {
    id: 'verification',
    title: 'Verification',
    summary: 'Production status is evidence-backed, not a marketing assertion.',
    paragraphs: [
      'The core workspace passes Rust workspace tests, strict Fozzy deterministic validation, host-backed trace verification, replay and CI checks.',
      'Aegis browser validation covers smoke, soak, broader app-shape and real React package profiles. Those reports prove browser-visible hydration, navigation, route handlers, actions and static assets through ZapJS serve output.',
      'The runtime-reference scan is clean except the known harmless TrieNode match in the Rust router implementation. The public site should describe only the Rust-owned framework boundary and its executable evidence.',
    ],
  },
  {
    id: 'deploy',
    title: 'Deployment',
    summary: 'ZapJS keeps the integrated application deployment shape while Rust owns the artifact boundary.',
    paragraphs: [
      'The CLI provides native zap check, zap build, zap dev, zap package, zap deploy and zap serve commands over the Rust graph, build, package and execution path.',
      'Deployment evidence covers local-package, managed-native and provider filesystem outputs, static asset serving, manifest-owned browser assets, cache headers, 404 and 405 admission, server action success and denial paths and bounded public error responses.',
      'This website is now shaped as a ZapJS app: its pages live under app/, and verification builds it with the ZapJS CLI rather than a separate web bundler.',
    ],
  },
];

export const posts = [
  {
    slug: 'production-baseline',
    title: 'ZapJS reaches the implemented production baseline',
    date: 'October 2, 2026',
    excerpt: 'The core React-plus-Rust surface now has executable evidence across Rust tests, Aegis browser profiles and Fozzy traces.',
    paragraphs: [
      'The production baseline is intentionally scoped. It covers the implemented framework surface: build, serve, deployment artifact generation, runtime admission, React SSR and Flight, hydration, route handlers, server actions, browser navigation and Splice transport behavior.',
      'The evidence is executable. Smoke, soak, commerce app-shape and real React package Aegis reports are checked into the core repository. Fozzy records host-backed deterministic trace evidence for the Rust workspace.',
      'The website now follows the same rule as the framework: public claims stay inside verified behavior.',
    ],
  },
  {
    slug: 'splice-boundary',
    title: 'Splice stays inside the Rust framework boundary',
    date: 'October 2, 2026',
    excerpt: 'Splice is an internal worker transport for isolation and replacement, not a public service layer.',
    paragraphs: [
      'ZapJS uses Splice for framework-owned worker boundaries when isolation or replacement is needed. Ordinary application deployment remains one integrated project output.',
      'The current Splice implementation has bounded unary calls, negotiated frame limits, deadlines, cancellation, typed remote errors, subprocess coverage and credit-based streaming tests.',
      'That keeps the architecture aligned with the goal: React application authoring, Rust-owned runtime and no separate application server requirement.',
    ],
  },
  {
    slug: 'measured-performance',
    title: 'Performance claims follow measured artifacts',
    date: 'October 2, 2026',
    excerpt: 'ZapJS optimizes by removing request-time work first, then measuring the remaining path.',
    paragraphs: [
      'ZapJS starts with the application graph: emit the right server bundles, browser chunks, cache metadata and deployment artifacts once, then do less work at request time.',
      'Rust is useful where ownership matters: routing, admission, resource limits, artifact generation, process boundaries and tightly bounded execution. Speed claims remain tied to pinned workloads and recorded evidence.',
      'The current site does not invent throughput numbers. It points to the verification reports that exist and leaves future benchmarks to dedicated evidence.',
    ],
  },
];
