# Native claims audit — 2026-09-30

Scope: the Native Rust documentation section, the homepage code-demo tabs, and `native/README.md`. Evidence is the installed, shipped `@zap-js/client` 0.3.0 implementation, not a proposed architecture or upstream npm release.

## Corrections

- The documentation originally showed replacing `native/src/lib.rs` with only `greeting`. This removed the scaffold’s `sumNumbers` export while its generated `/api/native` route still imported it. The instructions now append `greeting` and `checksum` after the existing scaffold export, reusing the `napi` import.
- Explicitly describe the checksum as a wrapping additive 32-bit sum; it is not cryptographic.
- Clarify that the default compute pool caps admitted tasks at `min(available CPUs, 32)`, rejects saturation immediately, and does not bound input memory.
- Clarify cancellation ownership: `compute` uses a default token with no deadline. HTTP aborts and discarded JavaScript promises are not wired to this token. Explicit cancellation/deadlines require a `ComputePool` and application-owned `Cancellation`; dropping the Rust `run` future signals cancellation, while capacity remains held until work stops.
- Distinguish the website HTTP handler’s 1–4096-element limit from the Rust function’s numeric validation. The Rust function itself accepts an empty or larger array when invoked directly.
- Document that native code shares process failure risk, Node-API involves value conversion, and native artifacts must match the runtime platform/architecture.

## Evidence map

Paths below are repository relative; implementation line numbers refer to the shipped package inspected for this audit.

| Claim | Authoritative evidence |
|---|---|
| macOS x64/arm64 and Linux GNU x64/arm64 are accepted native targets | `node_modules/@zap-js/client/dist/native/build.js:8` target map |
| Cross-compilation and non-glibc Linux builds are rejected | `dist/native/build.js:44` host match and `:49` glibc checks |
| Release builds require a Cargo lockfile and use `--locked` | `dist/native/build.js:66` and `:93` |
| Node-API 8 baseline and Tokio runtime features | `dist/native/build.js:70`; generated loader checks at `:130` |
| Type declarations come from compiled napi-rs exports | `dist/native/build.js:78`–`:94`, emitted ambient declarations at `:143`–`:150` |
| Native modules are rejected in client graph | `dist/compiler/config.js:44` |
| Semaphore admission rejects immediately | `dist/native/rust/src/lib.rs:95`–`:107` |
| Worker retains permit; cancellation is cooperative; panics become errors | `dist/native/rust/src/lib.rs:107`–`:126`; `Cancellation::check` at `:61` |
| CPU count capped at 32 and default token has no deadline | `dist/native/rust/src/lib.rs:132`–`:145`; default token at `:40` |
| Scaffold pins Rust 1.92.0 and retains a route importing `sumNumbers` | `dist/cli/commands/new.js:42`–`:46` |
| Native source changes restart the development runtime | `dist/cli/commands/dev.js:50`–`:60` |
| Website HTTP array length limit and overload response | `app/api/native/route.ts:8` and `:14` |

For abbreviated `dist/` paths, the prefix is `node_modules/@zap-js/client/`.

## Executed verification

The five implementation/scaffold files cited above (`native/build.js`, the Rust SDK, scaffold command, development command, and compiler configuration) match the downloadable vendor archive byte-for-byte. Hash evidence: `.verification/native-source-integrity.json`.

The audit script `tests/native-docs.mjs` extracted the actual Rust strings from `src/content/docs.ts` and `src/components/CodeDemo.tsx`, compiled them together in an isolated fixture using the shipped native builder in release mode, and loaded the resulting addon. Rust 1.92.0, the committed Cargo lockfile, and target `aarch64-apple-darwin` were used.

All checks passed:

- `greeting('Ada')` returns `Hello, Ada` synchronously; a numeric argument is rejected.
- `checksum([0, 1, 255])` resolves to 256; empty input resolves to zero. Negative values, fractions, values above 255, `NaN`, infinity, and string elements are rejected.
- `sumNumbers([20, 22])` resolves to 42; the largest u32 is accepted and empty input resolves to zero. Negative values, fractions, values above u32, `NaN`, infinity, string elements, and overflowing addition are rejected.
- Generated declarations are exactly compatible with the documented signatures: synchronous `greeting(name: string): string`, asynchronous `checksum(values: Array<number>): Promise<number>`, and asynchronous `sumNumbers(values: Array<number>): Promise<number>`.

Result: `.verification/native-facts.json`. Build log: `.verification/native-fact-build.log`. Real generated declarations: `.verification/native-fact-fixture/.zap/types/native.d.ts`; these are also available to the documentation TypeScript verifier.

The first audit build failed because a temporary regex extractor crossed code-block boundaries. The committed checker uses the TypeScript syntax tree to extract literal examples, and the exact snippets compiled and executed successfully. This was a harness error, not a Rust sample failure.

This is local native-snippet verification, not evidence that every supported target was rebuilt during this audit. The platform matrix is established by the shipped builder’s explicit checks; hosted Linux behavior is covered separately by the site’s end-to-end verification.
