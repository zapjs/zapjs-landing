# ZapJS website

This website runs on the included ZapJS 0.3.0 snapshot. It preserves the original React, Tailwind and Framer Motion design while using the framework's actual server components, client navigation, route handlers, server actions, prerendering and native Rust integration.

Hosted validation: [ZapJS website](https://zapjs-website-check-20260930.vercel.app). This is a separate validation project; no existing custom domain was changed.

## Run locally

Use Node 22.15+ within the Node 22 release line, npm, and Rust 1.92.0 (pinned in `rust-toolchain.toml`). This website uses Rust for its interactive native example; applications without native functions do not need Rust.

```sh
npm ci
npm run dev
```

For a production build and local preview:

```sh
npm run build:local
npm run preview
```

Follow the address printed by the CLI. One command runs the application. No separate backend, Splice binary, Docker container or Fly.io service is needed.

## Application structure

- `app/`: server pages, layouts, error boundaries, Web Request/Response handlers and the preference action.
- `src/components/`: existing visual components wired to current framework APIs.
- `src/content/`: documentation, authored articles, capabilities and measured benchmark metadata.
- `native/`: checked arithmetic exported with napi-rs and executed inside Node through `zap:native`.
- `vendor/`: the unpublished framework package used both by this app and its public download.
- `public/benchmarks/`: original measurement records linked from the performance section.

Home, documentation and the three authored articles are prerendered. `/examples` reads an HTTP-only cookie on the server. Saving the preference validates the action, changes card spacing and persists the selection. The example cards send real requests, expose errors, accept editable JSON and allow stream cancellation.

`/api/stats` reports this function instance's runtime statistics, not global traffic. `/api/native` executes Rust with bounded inputs and checked overflow. `/api/echo` reflects the submitted JSON. `/api/stream` sends three NDJSON chunks over time. `/api/posts` reads the actual articles with filtering/pagination; `/api/features` serves the documented capability list. `/api/benchmarks` explicitly serves recorded measurements, not a live benchmark.

Former fake subscriptions, users and WebSocket endpoints have been removed. There are no simulated successful mutations or fabricated performance claims.

## Framework snapshot and public quick start

Version 0.3.0 is not published to npm. A clean installation uses the checked-in `vendor/zap-js-client-0.3.0.tgz` and `package-lock.json`. The preparation script copies this exact archive into `/downloads/` and generates its SHA-256 checksum. Website instructions use this downloadable snapshot rather than an unavailable registry version.

To update it from the sibling framework checkout:

```sh
npm run framework:pack
npm install ./vendor/zap-js-client-0.3.0.tgz
npm run verify
```

Pass another framework directory after `--` if needed. A framework version change also requires updating the dependency, download paths and public instructions. Review the archive and lockfile together.

## Managed deployment

The supported managed target is Vercel Node 22. Deploy the **source** with `vercel.json`: its install script obtains the pinned Rust toolchain and runs `npm ci`; its build script produces static assets and a traced Node function. Rust is compiled on the deployment host and runs inside that function. Do not upload a macOS native addon as Linux prebuilt output.

`npm run build` generates Vercel Build Output on a matching Linux GNU build host. On macOS, use `npm run build:local`; the managed native build correctly rejects cross-compilation. The source is linked locally to the isolated `zapjs-website-check-20260930` validation project. A custom domain still requires a deliberate choice. GitHub auto-deployment is not connected; the verified deployment used the CLI. Other hosting adapters and Edge/WASM support are not claimed.

## Verification

```sh
npm run verify
```

This validates the benchmark projection, compiles the actual documentation/API TypeScript and Rust examples, checks published content and link targets, builds production output, checks TypeScript and exercises rendered HTML/Flight, real APIs and native calls, malformed requests, streaming/cancellation, progressive server actions, cookie persistence, origin protection, missing routes and the downloadable package checksum. `node tests/http.mjs https://your-deployment.example` runs the same HTTP checks against a deployment.

Direct hosted rendering/hydration checks: `node tests/browser-hosted.mjs https://zapjs-website-check-20260930.vercel.app`.

Browser acceptance uses **Aegis CLI only**. Start Aegis at the configured address, then run these in separate terminals after a local production build:

```sh
node tests/browser-server.mjs
node tests/browser.mjs
```

The test server wraps the real preview handler with a test-only iframe fixture. Its DOM probe exercises actual app controls; Aegis navigates and inspects the results. The wrapper/probe are not production routes or build inputs. `ZAP_AEGIS_PROFILE` and `ZAP_AEGIS_ADDRESS` override defaults `zapjs-check` and `127.0.0.1:7897`.

The download-to-application check can be run with `node tests/download.mjs http://127.0.0.1:4330` while the preview is running. It downloads the served archive into a clean temporary directory, executes the documented scaffold/vendor/install commands, typechecks and builds the generated app, then verifies its rendered home and health route.

The system scenario is `tests/scenarios/site.host.fozzy.json`. Use the actual Fozzy determinism engine, not the similarly named FozzyLang compiler:

```sh
fozzy doctor --deep --scenario tests/scenarios/site.host.fozzy.json --runs 5 --seed 42 --json
fozzy test --det --strict tests/scenarios/site.host.fozzy.json --json
fozzy run tests/scenarios/site.host.fozzy.json --det --seed 42 --proc-backend host --fs-backend host --http-backend host --record .verification/site.fozzy --json
fozzy trace verify .verification/site.fozzy --strict --json
fozzy replay .verification/site.fozzy --json
fozzy ci .verification/site.fozzy --json
```

Strict scripted checks may reject the undeclared real Node subprocess. Record that limitation; do not substitute canned process success for actual application execution. A host trace verifies its recorded outcome, not deterministic scheduling inside Node or a managed platform.

Benchmarks are limited, dated measurements from a contended host. They do not establish production capacity, a universal speed advantage or feature parity with Next.js.

See [migration verification](docs/verification.md) for the final evidence and its limits.

See the [strict website facts audit](docs/fact-audit.md) for corrected statistics, documentation contracts, source evidence and validation limits.
