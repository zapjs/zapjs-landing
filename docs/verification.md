# Website migration verification

Verified September 30, 2026 against local production output and the deployed website. The website uses the bundled, unpublished ZapJS 0.3.0 package, React 19.3.0, Node 22 and the real napi-rs addon built with Rust 1.92.0.

## Requested outcome

The existing landing-page layout, typography, colors, animated sections and component styling remain. The implementation now uses actual ZapJS app routes, server rendering/Flight, client navigation, prerendering, server actions and native Rust calls. The former browser-only router, generated RPC clients, separate Rust HTTP server, Splice/platform binaries, fake endpoints, Docker/Fly configuration and unsupported performance claims were removed.

Capabilities and API examples describe the running implementation. Runtime statistics are scoped to the current instance. Articles are actual authored content. Benchmark charts use dated source measurements, link their raw records, and disclose host contention. The public framework download is byte-identical to the package running this site and includes a generated checksum.

## Verification evidence

- `npm run verify` passed the production build, TypeScript and all ten HTTP groups: HTML/Flight for seven pages, missing/retired endpoints, real request statistics, capabilities/benchmark records, articles/pagination, JSON echo/errors, concurrent Rust computation/input validation, NDJSON delivery/cancellation, progressive actions/cookies/origin protection, and downloadable archive integrity.
- Aegis CLI passed all twelve browser checks on the final build: home controls; navigation without document reload; documentation hashes/history/search/keyboard; editable Rust inputs; HTTP error display; JSON echo; incremental streaming/cancellation; hydrated action with immediate spacing change and persisted private cookie; article navigation; mobile home/menu; mobile examples/docs/search; and no observed uncaught errors during acceptance. Width checks ran at 390 pixels.
- `node tests/download.mjs` passed from a clean temporary directory outside the repository. It fetched the public archive, ran the documented scaffold and repository-local vendor install, typechecked, built, and served the generated app's HTML and actual health route. The published package instructions do not rely on an unavailable npm release.
- The final Fozzy host scenario passed with seed 42, run `bea94fe5-f923-43ae-be1e-1b69f469c765`. Its real trace `.verification/site-complete.fozzy` passed strict trace verification, replay and all CI gates. The scenario executes the HTTP tests against an actual production preview process and native addon.
- The source includes a Linux CI workflow for installation, production verification and managed output compilation. That workflow was added locally; a remote CI run is not claimed.

The reproducible scripts are in `tests/` and `scripts/`. Raw build, browser, package and Fozzy evidence is retained under ignored `.verification/`; engine reports are under ignored `.fozzy/`.

## Limits and deployment status

The actual website is deployed at https://zapjs-website-check-20260930.vercel.app in a new, isolated Vercel project. Deployment `dpl_9jCByjdrdJ2Y2DPY36MhhCws4mxJ` built the addon on Linux x64 with Rust 1.92.0 and serves requests on Node 22.23.2. Vercel automatically assigned this project's first deployment to its production target; no existing application or custom domain was changed. This is website deployment evidence, separate from the framework's earlier validation applications.

The ten HTTP verification groups passed against that URL, additionally asserting Linux/Node 22, Secure cookies and incremental streamed delivery. The public hosted archive also passed clean scaffold/install/typecheck/build/home/health verification. Fozzy recorded these real hosted HTTP checks in `.verification/site-vercel.fozzy`, run `547b122e-37ca-4a9c-9ed2-05d7d66f205f`, seed 42. Strict trace verification, replay and CI passed. Reproduce with `tests/scenarios/site.vercel.fozzy.json` or `node tests/http.mjs https://zapjs-website-check-20260930.vercel.app`.

Direct hosted Aegis CLI checks passed for the homepage, hydrated Native Rust/Caching deep links, dynamic examples page and article. The complete twelve-control interaction suite passed locally on production output; the direct hosted check makes the narrower rendering/hydration claim. The old shared Aegis profile returned repeated control-plane resource errors; an isolated fresh profile completed the hosted checks. No application change was needed. Reproduce with `node tests/browser-hosted.mjs https://zapjs-website-check-20260930.vercel.app` and the documented Aegis profile/address variables.

The deployment used the Vercel CLI. Vercel could not connect the GitHub repository, so automatic Git deployments are not configured. At the time of this deployment, source changes were local and uncommitted; the repositories were subsequently prepared for separate GitHub pushes. The framework archive remains unpublished to npm; website hosting does not publish that package.

The actual Fozzy engine used here is `/Users/deepsaint/.cargo/bin/fozzy`. The different PATH executable exposes the FozzyLang surface. Strict doctor/scripted tests were attempted first and rejected undeclared real subprocess execution. An explicit host-backed strict `test` passed; host `run` supplied the recorded application evidence. Doctor and fuzz still reject that subprocess in their preflight path, and distributed exploration does not accept this single-process steps scenario. These limitations are recorded as failures/unsupported coverage, not passing deterministic application fuzzing. No canned process success was substituted. Trace replay does not prove deterministic scheduling inside Node.

This website migration does not establish production-scale capacity, every Next.js feature, Edge support, or a universal performance advantage. The public copy states those boundaries.

## Subsequent strict facts audit

The website was subsequently audited and corrected across all page copy, measurements, examples and documentation. See [facts audit](fact-audit.md) for deployment `dpl_58WTabx6eCbLb2Zwc1TcCmXtcNNC`, expanded checks and exact coverage. The earlier deployment and twelve-group results above describe the initial migration; the audit adds a thirteenth browser group covering every documentation section.
