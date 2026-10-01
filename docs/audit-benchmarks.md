# Benchmark facts audit

Audited September 30, 2026 against the website’s two public result files, the sibling framework’s `benchmarks/compare.mjs`, `benchmarks/README.md`, `benchmarks/RESULTS.md`, and matching files in `artifacts/verification/`. This audit changes presentation and verification; it does not run a new performance experiment.

## Source lineage

The public files are byte-for-byte identical to the framework verification artifacts:

| Result | Recorded start (UTC) | SHA-256 |
| --- | --- | --- |
| `public/benchmarks/benchmark-safe.json` | 2026-09-30T22:19:45.282Z | `cd70e238a4cf61b5a0165c7d93669c6cd1013c23324bfbb893f19f1087e32b66` |
| `public/benchmarks/benchmark-safe-reverse.json` | 2026-09-30T22:21:53.681Z | `42be205bcbb8fb8c3eb8f68cceaffeb3e14b986d2ea55893d1888bc37662bf46` |

Audited harness SHA-256: `c59592c236ab2cf0dbbe22b3e38cac1ba5415c4d16484a549548c89d6e9ad133`. This is the harness inspected during this audit, not a digest captured by the historical runner. Both result files record revision `c6b249191dd4e23b31abbe0e1cb30d62add35020`, `dirty: true`, and fixture hash `69858984be330ecf96d334950943618ae0ab388c2d21249cfebdf68fcefeaf1e`. The fixture digest hashes only the concatenation of the Zap home page and CPU route source. It does not identify all fixtures, dependencies, framework edits, or emitted build artifacts. There is no recorded complete dirty-source digest or build digest. The exact measured implementation cannot be reconstructed from the recorded Git revision alone.

## Counts

`compare.mjs` defines four workloads: JSON echo, 250,000-iteration JavaScript checksum, dynamic RSC HTML, and RSC HTML with a 60 ms delayed child. Each is measured at concurrency 1 and 16 for each framework in each order.

| Quantity | Derivation | Result |
| --- | --- | ---: |
| Measured cells | 4 workloads × 2 concurrency levels × 2 frameworks × 2 orders | 32 |
| Measured attempts | 32 × 200 | 6,400 |
| Successful measured responses | Sum of `warm.*[].successes` | 6,400 |
| Recorded measured errors | Sum of `warm.*[].errors` | 0 |
| Excluded warm-ups | 10 before every measured cell | 320 |
| Excluded fresh-process page requests | 3 trials × 2 frameworks × 2 orders | 12 |
| Chart requests | 1 workload × concurrency 16 × 2 frameworks × 2 orders × 200 | 800 |

There are 6,732 requests across these three harness phases, but only 6,400 belong to the measured warm batches. The published zero-error count describes those measured batches; it is not an application reliability estimate or the count of all website traffic. Warm-up or fresh-process failures would abort the harness, but their counts are not represented by the measured error fields.

## Exact chart values

Values are selected from `frameworks.<name>.warm["dynamic-rsc-html"]` where `concurrency === 16`:

| Order / framework | Successful responses/s | Completion p50 ms | Completion p99 ms |
| --- | ---: | ---: | ---: |
| Zap first / Zap | 62.53536587951579 | 246.64279199999874 | 588.8974579999995 |
| Zap first / Next | 20.04712067495328 | 653.3866660000058 | 1954.2384999999922 |
| Next first / Zap | 1175.9103015622084 | 12.188874999999825 | 30.448207999994338 |
| Next first / Next | 130.92878971206767 | 100.80362500000047 | 300.0711249999986 |

The UI rounds throughput to one decimal and durations to two. Both tabs share a linear bar scale from 0 to 1175.9103015622084 responses/s; changing tabs does not rescale the chart. That maximum is derived from the four displayed rows. No speedup ratio or winner is reported.

The harness uses closed-loop concurrency: each worker issues a new request when its preceding request finishes. Throughput is successful responses divided by batch wall-clock seconds. The client and server share the machine. Completion starts before `fetch` and ends after consuming the complete response and checking status and an expected substring. It includes loopback transport, client work, scheduling, and server work. First-byte values are measured at the first readable body chunk, not at header receipt; the chart uses completion values instead.

`percentile` selects sorted element `ceil(n × fraction) - 1`. For 200 successes, p50 is the 100th sorted duration and p99 is the 198th, the third highest. Calling this p50 the arithmetic median was imprecise: an even-sample median commonly averages the 100th and 101st. The UI now says p50. Only summary percentiles were retained; no individual timings are available to recompute the distributions independently or estimate confidence intervals. The consistency check verifies throughput arithmetic and projection, not missing raw timing data.

## Equivalence, versions, and host

`fixtures()` writes the same component and route-handler source to both applications. Zap uses its compiled handler through its Node preview adapter; Next uses production `next start`. Both use `NODE_ENV=production`, loopback HTTP, and `Accept-Encoding: identity`. Execution paths and framework behavior are not identical. Expected response status and marker substrings are checked; this is not complete output equivalence or a browser behavior test.

Recorded labels: Zap `0.3.0-working-tree`, Next `16.3.8`, React `19.3.0`, Node `v22.15.1`, V8 `12.4.254.21-node.24`. The harness asserts the installed Next version. React is a configured fixture version, not independently asserted in this harness. The host reports Apple M3 Pro, 11 logical CPUs, 19,327,352,832 bytes (18 GiB) RAM, `darwin`, kernel `24.3.0`, and `arm64`.

One-minute host load averages:

- Zap-first: 28.10107421875 before → 34.0498046875 after.
- Next-first: 33.24462890625 before → 23.7822265625 after.

The framework run notes report concurrent Rust and TypeScript jobs. The raw load samples support substantial contention but do not isolate which job caused which delay. Zap ran last during the quieter end of the second run; these data cannot quantify that benefit or establish causation. CPU affinity, memory, thermals, and filesystem caches were not isolated. Both orders are useful observations, not sufficient randomized repeated trials.

Native acceleration, browser hydration/navigation, CDN/static-cache hits, database latency, distributed-cache behavior, and managed cold starts were not measured. These results do not measure the present website or establish full Next.js feature parity.

## Other reported statistics

The framework `RESULTS.md` final table matches the selected raw values after its stated rounding. Fresh-process startup-plus-first-page medians are calculated from `startupMs + totalMs` per trial, then sorted; first-order Zap is 2119.234792 ms, first-order Next 3189.660250000001 ms, reverse Zap 202.39016699999775 ms, and reverse Next 1736.8033749999995 ms. Each uses only three local process trials. They are not managed cold starts.

Build wall times are Zap 9505.022667000001 ms and Next 84086.86099999999 ms. These are one fresh-output build observation per framework, repeated as metadata in both run files, not two independent measurements. Dependency installation and deployment tracing are excluded. Raw emitted client JavaScript is Zap 251,650 bytes in 3 files and Next 566,679 bytes in 10 files across the entire fixture output. This is neither compressed transfer size nor the initial browser bundle. Resource sampling records process CPU deltas and a post-cell RSS point, not peak RSS.

The separate route-matching scalability test constructs 10,000 static routes plus a dynamic fallback, then checks 500 selected warm lookups with at most 500 route metadata reads. It has correctness assertions, not a timing threshold. It does not establish 10,000-route HTTP throughput. The performance docs now state that boundary precisely.

## Changes and verification

- `src/content/benchmark.json` is derived by `scripts/check-benchmark.mjs`, preserving exact plotted values while adding counts, latency semantics, host load, source digests, and provenance limits.
- `src/components/Performance.tsx` distinguishes chart samples from all measured cells, labels p50 correctly, explains a shared graph scale, and avoids claiming source-level matching means identical execution.
- Only the Performance section of `src/content/docs.ts` was changed in this audit; it now documents definitions, reproduction, and limits.
- `scripts/check-benchmark.test.mjs` verifies count separation and rejection of inconsistent throughput, counts, and sampling assumptions.

Repeat these checks from the website checkout:

```sh
node scripts/check-benchmark.mjs
node scripts/check-benchmark.mjs --framework-root ../zapjs
node --test scripts/check-benchmark.test.mjs
npm run typecheck
```

To intentionally regenerate the projection after reviewing raw-data changes, run `node scripts/check-benchmark.mjs --write`. Changing the audited harness digest requires a fresh methodology review. The snapshot API at `/api/benchmarks` exposes this machine-readable source lineage. No benchmark rerun, rebuild, deployment, or commit was performed by this audit.
