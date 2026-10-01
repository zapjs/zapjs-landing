# Website native module

`sumNumbers(values)` is an asynchronous napi-rs export in `src/lib.rs`. It validates finite unsigned 32-bit integer values and rejects a sum that overflows that range. The HTTP handler separately limits each request to 1–4096 values; the Rust export itself does not impose an array-length limit.

The installed `@zap-js/client` package contains the `zap-native` SDK. `zap_native::compute` runs CPU work through Tokio’s blocking pool, with process-local admission limited to the available CPU count, capped at 32. Excess work rejects immediately with `ZAP_NATIVE_OVERLOADED`; there is no unbounded admission queue. Node-API performs value conversion, so this is not a zero-copy guarantee.

Cancellation is cooperative. The default `compute` token has no deadline, and an HTTP abort or an abandoned JavaScript promise does not automatically cancel it. Use an explicit `ComputePool` and `Cancellation` token for a deadline or cancellation scope, checking the token at bounded intervals. Dropping the Rust `run` future signals its token; admitted work retains its permit until it actually stops. Native code shares the Node process, so an addon crash can terminate the application instance.

The scaffold selects Node-API 8 and pins Rust 1.92.0. Commit `native/Cargo.lock` and `package-lock.json`; native release builds use Cargo’s `--locked` mode. The included install/build scripts provision the pinned Rust toolchain on the managed builder. Build on the deployment OS and architecture: macOS x64/arm64 and Linux GNU x64/arm64 are accepted native build targets, with no cross-compilation, Windows, Linux musl, or Edge/WASM support. This website’s managed target is Vercel Node 22 with a matching Linux GNU addon.
