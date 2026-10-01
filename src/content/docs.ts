export type DocumentationBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; code: string; language: 'typescript' | 'rust' | 'shell' | 'text'; filename?: string }
  | { type: 'callout'; text: string }
  | { type: 'download'; text: string; href: string };
export interface DocumentationSection { id: string; title: string; summary: string; blocks: DocumentationBlock[] }
const p = (text: string): DocumentationBlock => ({ type: 'paragraph', text });
const h = (text: string): DocumentationBlock => ({ type: 'heading', text });
const list = (...items: string[]): DocumentationBlock => ({ type: 'list', items });
const code = (code: string, language: 'typescript' | 'rust' | 'shell' | 'text' = 'typescript', filename?: string): DocumentationBlock => ({ type: 'code', code, language, filename });
const note = (text: string): DocumentationBlock => ({ type: 'callout', text });

export const documentation: DocumentationSection[] = [
  { id: 'introduction', title: 'Introduction', summary: 'One React application, with optional native Rust functions.', blocks: [
    p('ZapJS 0.3 is an integrated React framework. Server components, streaming HTML, browser hydration, navigation, server actions, and HTTP routes share one app directory and one build. Optional Rust functions execute inside the managed Node process through Node-API.'),
    note('These docs describe the downloadable 0.3.0 package. This version is not yet published to npm. Use the downloadable package archive in Quick Start. Older npm releases use a different architecture. When building from source, use a checkout containing the 0.3.0 implementation.'),
    list('React Server Components and streaming server rendering use the official Vite RSC integration.', 'Client components opt in with use client; server actions use use server.', 'The compiler builds one route graph for development and production.', 'The managed deployment target is Vercel Node 22. JavaScript-only applications need no Rust toolchain.'),
    h('Supported boundary'),
    p('This is not a drop-in implementation of every Next.js API. Edge execution, image optimization, middleware conventions, parallel/intercepting routes, additional managed adapters, nonce-based strict CSP, and SRI are not implemented. Native calls share the Node process failure boundary.'),
  ] },
  { id: 'quick-start', title: 'Quick Start', summary: 'Install the framework package archive and start an application.', blocks: [
    p('Use Node 22.15 or newer in the Node 22 line and npm. Download the 0.3.0 package archive below, then run these commands from the directory containing it. JavaScript applications need no Rust toolchain.'),
    { type: 'download', text: 'Download @zap-js/client 0.3.0 (.tgz)', href: '/downloads/zap-js-client-0.3.0.tgz' },
    code(`npm exec --package ./zap-js-client-0.3.0.tgz -- zap new my-app --no-install
cd my-app
mkdir vendor
cp ../zap-js-client-0.3.0.tgz vendor/
npm install ./vendor/zap-js-client-0.3.0.tgz
npm run dev`, 'shell'),
    p('Open http://127.0.0.1:3000. The scaffold includes an HTML layout, a server-rendered page, an interactive counter, and a health route. Installing the local archive replaces the scaffold’s unpublished framework dependency. Keep vendor/zap-js-client-0.3.0.tgz and package-lock.json in version control so remote builds can install the same package.'),
    h('Useful commands'),
    code(`npm run routes
npx zap routes --json
npx zap dev --port 3001
npx zap build --adapter node
npm run preview`, 'shell'),
    p('zap dev runs the development server. zap build compiles an artifact; its default adapter is vercel. zap preview serves the existing .zap/output build locally. zap routes inspects the same graph used by the compiler.'),
    h('Build the framework from source'),
    p('Framework contributors can create the same package archive from a checkout containing the 0.3.0 sources. This source-build path also requires Bun.'),
    code(`cd zapjs
bun install --frozen-lockfile
bun run build
npm pack ./packages/client --pack-destination .`, 'shell'),
  ] },
  { id: 'project-structure', title: 'Project Structure', summary: 'Application conventions, generated output, and optional native code.', blocks: [
    code(`app/
  layout.tsx             # HTML document, required for pages
  page.tsx               # /
  counter.tsx            # interactive client component
  loading.tsx            # Suspense fallback
  error.tsx              # client error boundary
  not-found.tsx          # root not-found page
  products/[id]/page.tsx # /products/42
  api/health/route.ts    # HTTP endpoint
public/                  # copied static assets
zap.runtime.ts           # optional server runtime configuration
native/                  # optional napi-rs crate
  Cargo.toml
  Cargo.lock
  src/lib.rs
.zap/output/             # generated portable build
.vercel/output/          # generated managed deployment`, 'text'),
    p('Ordinary components and application helpers can live beside routes or in a lib directory. Only convention files such as page.tsx and route.ts create endpoints. Keep action modules inside the application root so their references can be scoped to a deployment.'),
    p('Do not edit generated output. Commit application source and dependency lockfiles. Native release builds also require native/Cargo.lock.'),
  ] },
  { id: 'architecture', title: 'Architecture', summary: 'React rendering stays in JavaScript; native code handles selected computation.', blocks: [
    list('The compiler discovers app routes, nested layouts, boundaries, and explicit prerender settings.', 'The RSC environment runs server components, actions, and route handlers.', 'The SSR environment turns the React stream into HTML and embeds the matching Flight payload.', 'The browser hydrates client components and requests Flight for navigation.', 'The Node HTTP bridge translates host requests and streamed responses. The Vercel adapter packages the managed function and static assets.'),
    p('The optional native boundary is a typed Node-API call. There is no separately operated Rust HTTP server, socket RPC process, or embedded Splice daemon in this architecture. Keep small orchestration work in JavaScript; move substantial CPU work to native code when the application benefits.'),
    p('The current managed output contains one dynamic function with lazy route chunks. Automatic partitioning into a function per route is not implemented.'),
  ] },
  { id: 'routing', title: 'Routes & Layouts', summary: 'File-based pages, dynamic parameters, route groups, and shared layouts.', blocks: [
    code(`import type { LayoutProps } from '@zap-js/client';
import './styles.css';

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head><title>My application</title></head>
      <body>{children}</body>
    </html>
  );
}`, 'typescript', 'app/layout.tsx'),
    code(`import type { PageProps } from '@zap-js/client';

export default function Product({ params, searchParams }: PageProps) {
  return <main><h1>Product {params.id}</h1><p>{searchParams.view}</p></main>;
}`, 'typescript', 'app/products/[id]/page.tsx'),
    list('page.tsx defines a page; layout.tsx wraps its descendants.', '[id] captures one segment as a string.', '[...path] captures one or more segments as a string array.', '[[...path]] also matches an empty remainder.', '(shop) groups files without adding a URL segment.', 'Static segments win over dynamic segments, then catch-all routes. Catch-all segments must be last.'),
    p('Page params and searchParams are plain objects, not promises. Repeated query keys become string arrays. Layout params contain dynamic parameters from that layout’s path. Directories beginning with an underscore or dot are skipped by route discovery.'),
    p('Shared ancestor layouts retain client state during navigation. Changing a dynamic segment resets that segment and its descendants. Conflicting route patterns, page/handler collisions, and public files shadowing an exact route fail compilation.'),
    note('Parallel routes and intercepting route syntax are rejected. There is no implicit middleware.ts convention.'),
  ] },
  { id: 'client-router', title: 'Client Navigation', summary: 'Links, router hooks, pending transitions, and browser-safe components.', blocks: [
    code(`'use client';
import { Link, useRouter, usePathname, useSearchParams } from '@zap-js/client';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  return (
    <nav>
      <Link href="/products/42">View product</Link>
      <button onClick={() => router.push('/products/43')}>Next product</button>
      <button onClick={() => router.replace('/products?view=list')}>List view</button>
      <button onClick={() => router.refresh()}>Refresh server data</button>
      <button onClick={() => router.back()}>Back</button>
      <span>{router.pending ? 'Loading…' : pathname}</span>
      <span>{query.get('view')}</span>
    </nav>
  );
}`, 'typescript', 'app/navigation.tsx'),
    p('Link uses the standard href prop. Same-origin navigation fetches Flight and updates the React tree; normal external links, modified clicks, downloads, and links marked data-zap-reload retain browser behavior. push and replace accept HTTP(S) destinations and reject executable URL schemes.'),
    p('Client components still render on the server for initial HTML. Read window, document, localStorage, and navigator inside effects or event handlers, never during module initialization or a state initializer. Browser back/forward is supported.'),
  ] },
  { id: 'ssg', title: 'Public Prerendering', summary: 'Explicit public HTML and Flight generated from one render.', blocks: [
    code(`import type { PageProps } from '@zap-js/client';

export const prerender = true;

export function generateStaticParams() {
  return [{ slug: 'getting-started' }, { slug: 'deployment' }];
}

export default function Guide({ params }: PageProps) {
  return <article><h1>Guide: {params.slug}</h1></article>;
}`, 'typescript', 'app/guides/[slug]/page.tsx'),
    p('Only a literal export const prerender = true opts a page in. Dynamic pages also provide generateStaticParams; catch-all values are string arrays. Each generated path must resolve to the page that requested it. The build captures HTML and Flight from the same render and emits content-negotiation metadata for the host.'),
    list('Request metadata, cookie writes, private responses, and rendering errors reject the build.', 'Errors after the first streamed shell also reject prerendering.', 'The compiler limits enumeration to 10,000 paths and captured Flight to 8 MiB.', 'Pages without this explicit opt-in render dynamically with private, no-store responses.'),
    p('Generated files are selected by pathname, without varying on query parameters. Query-dependent server content must stay dynamic. Dynamic paths omitted from generateStaticParams still fall back to request-time rendering; they do not automatically become 404s.'),
    note('Prerender output is public deployment content. Use a dynamic page for per-user data. There is no automatic ISR or background regeneration service.'),
  ] },
  { id: 'api-routes', title: 'HTTP Route Handlers', summary: 'Export HTTP methods using the platform Request and Response APIs.', blocks: [
    code(`import type { RouteContext } from '@zap-js/client';

export async function GET(request: Request, { params }: RouteContext) {
  const view = new URL(request.url).searchParams.get('view');
  return Response.json({ id: params.id, view });
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (body === null || typeof body !== 'object' || !('name' in body) || typeof body.name !== 'string') {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }
  return Response.json({ name: body.name }, { status: 201 });
}`, 'typescript', 'app/api/products/[id]/route.ts'),
    p('Exports such as GET, POST, PUT, PATCH, DELETE, OPTIONS, and HEAD receive a Web Request and route parameters. They must return a Response. HEAD falls back to GET when no HEAD export exists; unsupported methods return 405.'),
    p('Binary bodies, readable streams, repeated Set-Cookie headers, and request cancellation pass through the Node adapter. The managed Node adapter defaults to a 1 MiB request-body limit: Content-Length is checked up front and streamed bytes are counted as the handler consumes them. A custom Node integration can configure this adapter limit. Authenticate and authorize inside your handler; the server-action authorization hook does not automatically protect API routes.'),
    p('Route handlers control their own response cache headers. Set Cache-Control: private, no-store for personalized responses; the private page-rendering default does not automatically apply to arbitrary route responses.'),
    code(`export function GET(request: Request) {
  const bytes = new TextEncoder().encode('ready\\n');
  return new Response(bytes, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}`, 'typescript', 'app/api/status/route.ts'),
  ] },
  { id: 'server-functions', title: 'Server Actions', summary: 'Typed server functions, progressive forms, and explicit authorization.', blocks: [
    code(`'use server';
import { cookies } from '@zap-js/client/server';

export async function savePreference(_previous: { error: string | null; saved: boolean }, form: FormData) {
  const theme = form.get('theme');
  if (theme !== 'light' && theme !== 'dark') {
    return { error: 'Choose light or dark.', saved: false };
  }
  cookies().set('theme', theme, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  return { error: null, saved: true };
}`, 'typescript', 'app/actions.ts'),
    code(`'use client';
import { useActionState } from 'react';
import { savePreference } from './actions';

export default function Preferences() {
  const [state, action, pending] = useActionState(savePreference, { error: null, saved: false });
  return (
    <form action={action}>
      <select name="theme"><option>light</option><option>dark</option></select>
      <button type="submit" disabled={pending}>Save preference</button>
      <p role="status">{state.error ?? (state.saved ? 'Preference saved.' : '')}</p>
    </form>
  );
}`, 'typescript', 'app/preferences.tsx'),
    code(`import Preferences from './preferences';
export default function Page() { return <Preferences />; }`, 'typescript', 'app/page.tsx'),
    p('A use server module exports async functions. Forms work before hydration, and client components can import and call actions. Authorize sensitive operations inside each action. For user-visible validation, return a result value and consume it with React useActionState rather than relying on exception messages.'),
    p('Action requests require the same origin and have a 1 MiB body limit. Unexpected failures expose a generic message and opaque digest; details stay in server logs. Build-scoped references prevent an old progressive form from invoking a new deployment’s action. Mutations are never automatically retried.'),
  ] },
  { id: 'native', title: 'Native Rust', summary: 'Optional napi-rs modules called directly from server code.', blocks: [
    p('With the downloaded package archive in your current directory, create a native scaffold and generate its Rust lockfile. Install Rust through rustup first. The scaffold pins its Rust toolchain and includes managed-build scripts.'),
    code(`npm exec --package ./zap-js-client-0.3.0.tgz -- zap new native-app --native --no-install
cd native-app
mkdir vendor
cp ../zap-js-client-0.3.0.tgz vendor/
npm install ./vendor/zap-js-client-0.3.0.tgz
cargo generate-lockfile --manifest-path native/Cargo.toml
npm run dev`, 'shell'),
    p('Keep the scaffold’s sum_numbers export: its generated /api/native route imports that function. Append the following export below it, reusing the existing use napi_derive::napi import.'),
    code(`#[napi(strict)]
pub fn greeting(name: String) -> String {
    format!("Hello, {name}")
}`, 'rust', 'native/src/lib.rs (append below scaffold exports)'),
    code(`import { greeting } from 'zap:native';

export function GET() {
  return Response.json({ message: greeting('Ada') });
}`, 'typescript', 'app/api/greeting/route.ts'),
    p('The build generates TypeScript declarations from compiled napi-rs exports. zap:native is server-only. Direct calls use Node-API value conversion, not serialized cross-process RPC. Keep synchronous exports short; use zap_native::compute for heavy CPU work.'),
    code(`#[napi(strict)]
pub async fn checksum(values: Vec<f64>) -> napi::Result<u32> {
    if values.iter().any(|v| !v.is_finite() || v.fract() != 0.0 || *v < 0.0 || *v > 255.0) {
        return Err(napi::Error::from_reason("Values must be bytes (0–255)"));
    }
    zap_native::compute(move |token| {
        let mut total = 0u32;
        for value in values {
            token.check()?;
            total = total.wrapping_add(value as u32);
        }
        Ok(total)
    }).await.map_err(|error| napi::Error::from_reason(error.to_string()))
}`, 'rust', 'native/src/lib.rs (append below greeting)'),
    p('This checksum is a wrapping 32-bit additive sum, not a cryptographic hash. The default compute pool admits up to the available CPU count, capped at 32 tasks per process, and rejects excess work immediately with ZAP_NATIVE_OVERLOADED. This bounds admitted tasks, not input size or memory: validate payload limits at the application boundary.'),
    p('Cancellation is cooperative: check the token at bounded intervals. compute supplies a token without a deadline; request aborts and abandoned JavaScript promises do not automatically cancel that work. To apply a deadline or explicit cancellation, use your own ComputePool with Cancellation::with_timeout or a shared Cancellation token. Dropping its Rust run future signals cancellation; the task keeps its capacity permit until it actually stops.'),
    p('Native code shares the Node process: an addon crash can terminate that process. The compute pool translates worker panics into errors, but cannot safely interrupt arbitrary native instructions. Development Rust edits rebuild the addon and restart the local runtime.'),
    note('Node-API 8 is the baseline. The builder accepts macOS x64/arm64 and Linux GNU x64/arm64. This website’s end-to-end checks cover macOS arm64 and Linux GNU x64; the other accepted targets were not exercised in this audit. Managed native artifacts must match Linux GNU and the deployed architecture. Cross-compilation and native Edge/WASM are not advertised as supported targets.'),
  ] },
  { id: 'security', title: 'Request Data & Security', summary: 'Request isolation, cookie mutation rules, and application authorization.', blocks: [
    code(`import { headers, cookies, request } from '@zap-js/client/server';

export default function Account() {
  const language = headers().get('accept-language');
  const theme = cookies().get('theme') ?? 'light';
  const pathname = new URL(request().url).pathname;
  return <main data-theme={theme}>{pathname}: {language}</main>;
}`, 'typescript', 'app/account/page.tsx'),
    p('Request state is isolated with AsyncLocalStorage. headers() returns a copy. cookies().get(name) returns a string or undefined, and getAll() returns name/value pairs. Cookie writes are allowed only inside actions or route handlers before streaming starts; writes force private, no-store responses.'),
    code(`import type { RuntimeConfig } from '@zap-js/client/server';

export default {
  authorizeAction(request) {
    // Example request-wide deployment policy, not user authentication.
    if (process.env.MAINTENANCE_MODE === '1') {
      throw new Response('Temporarily read-only', { status: 503 });
    }
  },
} satisfies RuntimeConfig;`, 'typescript', 'zap.runtime.ts'),
    p('The optional hook applies to every server-action mutation before invocation. It does not replace action-specific authorization or API-route authentication. Never treat an incoming user-id header as authenticated identity.'),
    p('Server APIs, Node builtins, and native imports are rejected in the browser graph. Keep credentials in server-only configuration. Request metadata is forbidden during public prerendering and inside shared-cache loaders.'),
  ] },
  { id: 'observability', title: 'Logs & Diagnostics', summary: 'Inspect routes and correlate failures with server-side errors.', blocks: [
    code(`npx zap routes --json
npx zap build --adapter node
npx zap preview --port 3001`, 'shell'),
    p('Use the route graph to inspect discovered paths and boundaries, then reproduce against the compiled artifact. Unexpected rendering and action failures receive opaque error identifiers, while the original exception is logged on the server. Managed runtime logs remain the source of detailed diagnostics.'),
    p('Application logging and tracing belong in server components, route handlers, actions, or the managed host’s observability integration. Zap does not automatically provide a distributed-tracing collector, metrics dashboard, or a Rust RPC trace propagation service.'),
  ] },
  { id: 'error-handling', title: 'Loading & Errors', summary: 'Suspense fallbacks, client error boundaries, and a root not-found page.', blocks: [
    code(`export default function Loading() {
  return <p role="status">Loading this page…</p>;
}`, 'typescript', 'app/products/loading.tsx'),
    code(`'use client';

export default function ErrorView({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <main role="alert">
    <h1>Unable to load this page</h1>
    {error.digest && <p>Reference: {error.digest}</p>}
    <button onClick={reset}>Try again</button>
  </main>;
}`, 'typescript', 'app/products/error.tsx'),
    code(`export default function NotFound() {
  return <main><h1>Page not found</h1><a href="/">Return home</a></main>;
}`, 'typescript', 'app/not-found.tsx'),
    p('loading.tsx supplies a Suspense fallback for its segment. error.tsx must declare use client and receives error/reset. An ancestor handles errors in a layout outside its own child boundary. Route boundaries reset as route parameters or query parameters change; reset requests fresh server content.'),
    p('An unmatched URL uses the root not-found page and a 404 response. Late streamed errors may occur after headers have already been sent; they cannot retroactively change the HTTP status. Public prerender builds still reject those failures.'),
  ] },
  { id: 'caching', title: 'Caching', summary: 'Request-local deduplication and explicit shared public-data caching.', blocks: [
    code(`import { memoize, headers } from '@zap-js/client/server';

export const requestLanguage = memoize(async () => {
  return headers().get('accept-language') ?? 'en';
});`, 'typescript', 'lib/request-data.ts'),
    p('memoize(loader) deduplicates within one request by argument identity. Object identities, null, undefined, and signed zero remain distinct. An optional second key function can define an application-specific equality rule. Request-local results never become shared cache entries.'),
    code(`import { createRedisRestCache } from '@zap-js/client/cache';
import type { RuntimeConfig } from '@zap-js/client/server';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error('Missing environment variable: ' + name);
  return value;
}

export default {
  cache: createRedisRestCache({
    url: required('REDIS_REST_URL'),
    token: required('REDIS_REST_TOKEN'),
  }),
  cacheNamespace: required('DEPLOYMENT_VERSION'),
} satisfies RuntimeConfig;`, 'typescript', 'zap.runtime.ts'),
    code(`import { cache } from '@zap-js/client/server';

export const publicGreeting = cache(
  async (language: string) => ({ text: language === 'fr' ? 'Bonjour' : 'Hello' }),
  { key: language => 'greeting:' + language, ttl: 300, tags: () => ['greetings'] },
);`, 'typescript', 'lib/public-data.ts'),
    code(`import { revalidateTag } from '@zap-js/client/server';

export async function POST(request: Request) {
  const token = process.env.CACHE_INVALIDATION_TOKEN;
  if (!token || request.headers.get('authorization') !== 'Bearer ' + token) {
    return new Response('Forbidden', { status: 403 });
  }
  await revalidateTag('greetings');
  return new Response(null, { status: 204 });
}`, 'typescript', 'app/api/cache/invalidate/route.ts'),
    p('Shared caching requires a configured CacheStore and a nonempty namespace. Include your deployment version in that namespace; Zap does not derive it automatically. There is no implicit in-memory fallback. ttl is measured in seconds. The Redis adapters use atomic tag generations to reject stale cache writes, including fills already in flight. Invalidation does not cancel a running loader or replace the value already being returned to its caller. createRedisCache(executeCommand) also supports an existing Redis client through its command callback.'),
    note('Shared loaders are public-data functions. They must not read request APIs or capture private request values in a closure. Use request-local memoization for personalized data. The CacheStore contract uses JSON values. The supplied Redis adapters reject Date, undefined, nonfinite numbers, and cycles; custom stores must uphold the serialization and atomic-invalidation contract themselves.'),
  ] },
  { id: 'reliability', title: 'Runtime Limits', summary: 'Backpressure, cancellation, body limits, and deployment changes.', blocks: [
    list('The managed Node adapter defaults to a 1 MiB request-body limit; server actions independently enforce a fixed 1 MiB limit before decoding.', 'HTML hydration limits Flight to 8 MiB before its stream branches; prerender capture independently applies the same limit. This is not a universal limit on direct Flight navigation responses.', 'The HTML injector limits pending HTML to 8 MiB and respects downstream demand.', 'Request abort signals propagate through rendering and the Node HTTP adapter.', 'Native compute admission is bounded; running work must cooperate with cancellation.'),
    p('A deployment change reloads navigation when the client and server build identifiers disagree. Hydrated action requests from an old build are rejected without retry. References in progressive forms are also build-scoped, so an old form cannot invoke a new build’s action.'),
    p('Do not automatically replay mutations after a network error. A disconnected client does not prove that an application operation failed to commit. Use application-level idempotency when your domain needs safe retry behavior.'),
  ] },
  { id: 'performance', title: 'Performance', summary: 'Read the recorded fixture measurements with their limits and source lineage.', blocks: [
    h('What the published chart measures'),
    p('The September 30, 2026 snapshot comes from two local runs starting at 22:19:45.282 UTC and 22:21:53.681 UTC. One measures ZapJS before Next.js; the other reverses that order. Both use matching generated application source: a dynamic React page with an interactive counter, a Suspense page with a deliberately delayed 60 ms child, a JSON echo handler, and a 250,000-iteration JavaScript checksum handler.'),
    p('Zap runs its compiled handler through the Node preview adapter; Next runs next start. Servers run sequentially in separate processes with NODE_ENV=production. The load generator runs on the same host and requests Accept-Encoding: identity. This is a comparison of those execution paths, not full feature parity, native Rust acceleration, browser hydration/navigation, database performance, CDN hits, distributed caching, or managed-platform cold starts.'),
    h('Counts and latency definitions'),
    p('Each of 4 workloads is measured at concurrency 1 and 16 for each of 2 frameworks in each of 2 orders: 32 measurement cells × 200 attempts = 6,400 measured requests, all recorded as successful. The harness makes 10 warm-up requests before every cell, including each concurrency level: 320 additional requests excluded from those totals. Its 3 fresh-process page trials per framework per order add 12 more requests, also excluded. The chart displays only dynamic HTML at concurrency 16: 800 measured requests across both tabs.'),
    p('Each worker issues its next request after the previous response completes. Throughput is successful responses divided by elapsed batch wall time. Completion latency is measured by the local fetch client from before fetch until the entire body is consumed and the status/content marker is checked. It includes client scheduling and loopback transport; it is not server execution time or first-byte latency. The raw files separately report time to the first readable body chunk.'),
    p('Percentiles use the nearest-rank rule: sort successful durations and select ceil(n × fraction). With 200 successes, p50 is the 100th duration, not the average of the two middle durations; p99 is the 198th duration, the third highest. Individual timings were not retained, so the published percentile summaries cannot be independently recomputed. The two chart tabs share one linear scale from zero to the largest plotted throughput, 1,175.9103015622084 responses/s. Tail estimates from 200 requests are preliminary.'),
    h('Host, versions, and uncertainty'),
    p('The recorded host was Apple M3 Pro, 11 logical CPUs, 18 GiB total memory, darwin/arm64 with kernel 24.3.0, Node v22.15.1 and V8 12.4.254.21-node.24. Raw version labels are Zap 0.3.0-working-tree, Next 16.3.8, and React 19.3.0. The harness verifies the installed Next version; the React version is the configured fixture version. CPU cores, memory, thermals, and filesystem caches were not isolated.'),
    p('One-minute load averages changed from 28.1011 to 34.0498 during the Zap-first run and 33.2446 to 23.7822 during the Next-first run. The run notes report competing Rust and TypeScript work. Large order-to-order changes and a changing shared host prevent a reliable speedup or winner claim. The chart is historical evidence about the recorded fixtures, not a load test of this website or a certification of the current framework package.'),
    p('Both files record Git revision c6b249191dd4e23b31abbe0e1cb30d62add35020 with dirty=true. Their matching fixture hash covers only the concatenated Zap app/page.tsx and app/api/cpu/route.ts, not all source or built artifacts. No complete dirty-source or build digest was captured, so the exact measured implementation cannot be reconstructed from the revision alone.'),
    h('Other fields in the raw runs'),
    p('Fresh-process records split startup readiness from the first page request; add startupMs and totalMs per trial to measure that local start plus page completion. These are 3 trials per framework per order, not managed cold starts. Build times are one observation per framework, reused in the second run; they exclude dependency installation and deployment tracing and do not represent repeated independent builds. Emitted client JavaScript bytes cover every .js file in the fixture output, not initial browser transfer or compressed payload size. Process RSS is a point sample after each cell, not peak memory; CPU time is a before/after process delta.'),
    h('Source data and verification'),
    code(`curl "$ORIGIN/benchmarks/benchmark-safe.json"
curl "$ORIGIN/benchmarks/benchmark-safe-reverse.json"
curl "$ORIGIN/api/benchmarks"
# In the website checkout:
node scripts/check-benchmark.mjs
# Also check against the sibling framework artifacts and audited harness:
node scripts/check-benchmark.mjs --framework-root ../zapjs`, 'shell'),
    p('The snapshot API includes each raw file’s SHA-256, the recorded Git state, the limited fixture hash, and the audited harness digest. The check script derives counts and chart values, verifies throughput arithmetic and labeling assumptions, and rejects snapshot drift. It cannot recover missing individual timings or prove that today’s package is identical to the measured dirty build. Framework methodology is in benchmarks/README.md and historical run notes in benchmarks/RESULTS.md.'),
    h('Apply measurements to your application'),
    list('Keep noninteractive UI in server components to avoid shipping unnecessary browser code.', 'Use shared layouts to preserve client state across navigation.', 'Prerender public pages and use an explicit shared backend for reusable public data.', 'Use request-local memoization to avoid duplicate work in one render.', 'Measure native dispatch and conversion costs before moving CPU work to Rust.'),
    p('The cached segment-trie matcher has a separate test that constructs 10,000 static routes plus a dynamic fallback and checks 500 selected lookups with at most 500 metadata reads. This is a correctness and metadata-reuse check, not a latency measurement or evidence of a 10,000-route HTTP throughput result.'),
    note('Repeat on dedicated hardware and equivalent deployed runtimes before setting latency budgets or making comparative performance claims. Network calls, data stores, rendering work, and platform startup remain part of the request budget.'),
  ] },
  { id: 'deployment', title: 'Deployment', summary: 'Build a Vercel Node function artifact or inspect a portable local build.', blocks: [
    code(`npm run build
npx vercel deploy --prebuilt`, 'shell'),
    p('The default build emits .vercel/output using Vercel’s Build Output API. Deploy the generated artifact with the Vercel CLI after linking your project and configuring its environment. The function targets Node 22 and supports streaming responses; static assets and prerendered HTML/Flight are emitted alongside it.'),
    code(`npx zap build --adapter node
npm run preview`, 'shell'),
    p('The node adapter produces .zap/output for local verification or a custom Node integration. zap preview serves that build for inspection. It is not a separate production backend that must be managed beside the Vercel function.'),
    h('Native deployments'),
    p('A macOS addon cannot run in a Linux managed function. Build native releases on matching Linux GNU x64 or arm64 infrastructure. The native scaffold includes install/build scripts that provision Rust 1.92.0 on the managed builder. Keep the default x64 function architecture unless the addon is built for arm64.'),
    code(`# From a native scaffold with the local package archive committed:
# commit package-lock.json and native/Cargo.lock first
npx vercel deploy`, 'shell'),
    p('For native source deployments, use the included vercel.json and scripts rather than uploading a macOS prebuilt artifact. The published package dependency is not yet available: make the 0.3.0 archive available through a repository-relative file dependency in the source deployment.'),
    note('Supported managed target: Vercel Node 22. Edge execution, native WASM, automatic function partitioning, strict nonce-based CSP, SRI, and additional managed adapters are outside this implementation. Inline React/Flight scripts require a compatible content-security policy.'),
  ] },
];
