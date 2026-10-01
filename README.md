# ZapJS Landing

This repository holds the ZapJS landing-page and documentation source for the final Rust-owned React architecture.

The copy must describe the implementation ZapJS is building now: React application authoring, Rust-owned routing and request admission, an embedded React renderer, Rust TSX build orchestration, Splice as an internal worker boundary, and one managed deployment artifact model.

Do not describe retired distribution paths, public add-on surfaces, separate server runtimes, or unsupported performance claims that are not backed by the final Rust pipeline.


This repo intentionally keeps the public site as React content source for the Rust-owned ZapJS pipeline. Do not add a separate server runtime, package-manager deployment path, or framework-specific wrapper unless the core ZapJS implementation actually supports that path.

The source of truth for runtime behavior is the core Rust workspace in `/Users/deepsaint/Desktop/zapjs`:

```bash
cargo +1.96.0 test --workspace
fozzy test --det --strict-verify artifacts/verification/rust-only-crates.fozzy.json --json
```

Landing content should stay conservative until the core pipeline can prove the full React vertical slice with deterministic and host-backed traces.
