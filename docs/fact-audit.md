# Website facts audit — September 30, 2026

This audit covers the public website and its documentation, not a new claim of production-scale performance. The reviewed site is https://zapjs-website-check-20260930.vercel.app. The implementation authority is the actual installed/downloadable `@zap-js/client` 0.3.0 archive, website source, recorded measurements, and deployed behavior. A design document alone was not treated as implementation evidence.

## Coverage and corrections

| Surface | Evidence and result |
| --- | --- |
| Hero, feature cards, architecture, setup, navigation/footer, page metadata | Matched claims to the shipped compiler/runtime/adapters, scaffold and native SDK. Changed “source snapshot” to “package snapshot”: the download contains compiled JavaScript/declarations and the Rust SDK, not a complete TypeScript source checkout. Clarified dynamic execution versus prerendered static delivery and SDK task admission. Node setup wording now states the tested Node 22 release line. |
| Performance chart and snapshot API | All four plotted rows match the raw files exactly. The 6,400 measured requests and zero recorded errors are correct across 32 cells; only 800 requests contribute to the chart. Separated 320 warm-ups and 12 fresh-process requests. Renamed “median” to nearest-rank p50, documented complete-response timing, identical chart scales, host contention and incomplete historical build identity. |
| All 17 documentation sections | Reviewed route conventions, props, navigation, prerendering, HTTP/actions, isolation/security, caching, limits, native execution and deployment against shipped code. Qualified adapter body limits, direct Flight versus hydration limits, custom cache responsibilities, namespace ownership and non-canceling invalidation. |
| Native documentation and homepage code | Corrected instructions that removed the scaffold's still-required export. Documented the compute admission cap, immediate saturation rejection, memory limits owned by callers, cooperative/application-owned cancellation and non-cryptographic checksum. Distinguished accepted target platforms from those actually exercised end to end. |
| Seven interactive examples and eight HTTP handlers | Checked actual request/response behavior. Fixed the displayed streaming example's undefined `signal`. Runtime statistics explicitly identify process RSS and process uptime, rather than per-request memory or total website uptime. The Rust HTTP input limit is distinguished from direct native numeric validation. |
| Three articles, list/detail pages and article APIs | Matched article text to implementation and raw measurements, clarified cancellation and benchmark scope, corrected the visible example name, and added reference links. Removed fixed “2 min read” values: shared metadata derives an explicitly labeled estimate from word count at 200 words/minute. |
| Download and publication state | Public archive bytes/checksum match the vendored package. Existing clean-download scaffold/install/build checks remain applicable because the archive did not change. A fresh registry check confirms latest `@zap-js/client` is 0.2.3 and 0.3.0 is absent; documentation uses the local package. At audit time, public repository HEAD was `c6b249191dd4e23b31abbe0e1cb30d62add35020`. The integrated framework was subsequently pushed as `dac6c1b`; the package download remains the exact version used by this website. |
| Internal and external destinations | Twenty-one unique internal destinations, including documentation hashes, article references and downloads, resolve. GitHub repository/issues/commits links return HTTP 200 and redirect to the canonical `zapjs/zapjs` repository. |

Detailed source maps and findings: [framework documentation](audit-framework.md), [native behavior and snippets](audit-native.md), [benchmark derivations and provenance](audit-benchmarks.md).

## Executable verification

`npm run verify` now checks the benchmark projection and three mutation/regression cases, compiles and executes actual displayed Rust snippets, compiles 22 documentation/homepage TypeScript examples plus seven API examples, builds the website, typechecks the project, validates published content/link contracts, and runs the full HTTP suite. Native declarations come from the actual compiled examples; missing declarations fail rather than skip.

The aggregate suite passed in real Fozzy host run `a3398ca6-d433-4be4-9aa2-8df71cf53a8d`, seed 42, trace `.verification/site-audit.fozzy`. Strict trace verification, replay and CI passed. A subsequent wording-only clarification distinguished accepted native target platforms from tested platforms; the final production build and complete local browser suite passed afterward.

Aegis CLI passed thirteen local browser groups, including all 17 sections' exact prose and code rendering, navigation/history/search, edited Rust and JSON requests, visible validation errors, incremental streaming/cancellation, hydrated actions with cookie persistence, articles, and mobile behavior. This is real DOM interaction against production output, not screenshot-only verification.

The corrected website was built on Linux and deployed as `dpl_58WTabx6eCbLb2Zwc1TcCmXtcNNC`. Hosted content checks passed for all seven pages, article metadata, internal destinations, actual runtime/version fields, and exact benchmark API projection. Hosted HTTP checks passed in Fozzy run `ba24764f-7290-44cd-b1b1-f277ab02f2be`, seed 42, trace `.verification/site-audit-vercel.fozzy`; strict trace verification, replay and CI also passed. Direct Aegis checks confirmed every one of the 17 hosted documentation sections hydrates with the reviewed prose, alongside the homepage, examples and article. Full control-interaction coverage remains the thirteen-group local production suite.

Evidence is retained in `.verification/audit-*` and `.fozzy/runs/`; reproducible scripts and audit reports are retained in the working tree. The reports describe the verification performed before the repositories were committed and pushed. The deployment updates the existing isolated website project; no custom domain was changed.

## Evidence limits

The historical benchmark keeps summary percentiles, not individual request timings or a complete dirty-source/build digest. Exact reported values and arithmetic are verified; the original timing distributions cannot be independently reconstructed. These measurements do not establish a universal speed advantage, production capacity, browser performance or managed cold-start superiority.

Documentation examples are typechecked against public APIs; native examples are actually executed; six request-context contract probes execute against the shipped runtime. This audit does not claim every illustrative application has undergone a separate full deployment or that a new Redis integration test was run. The existing website's full local and hosted paths supply their stated end-to-end coverage.

Strict Fozzy doctor/scripted tests were attempted first and rejected the undeclared real Node subprocess. Real host execution supplies the application evidence. No canned successful subprocess result was substituted. Trace replay validates recorded outcomes, not deterministic scheduling inside Node or Vercel; distributed exploration is not applicable to this single-process steps scenario.

External platform facts were checked against [Vercel's supported Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), which lists Node 22 and explains package engines overrides. The actual deployed runtime is verified separately through `/api/stats`. Package publication state was checked directly against the npm registry; dated checks are not promises about future releases.
