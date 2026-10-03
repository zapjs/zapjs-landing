# ZapJS Landing

This repository is now a ZapJS project. Public routes live in `app/` and are built by the ZapJS Rust CLI, not by a separate web bundler.

The landing copy is scoped to the implemented React-plus-Rust framework surface proven in the core repository at `/Users/deepsaint/Desktop/zapjs`.

## Verify locally

```bash
python3 scripts/verify-zap.py
```

The verifier materializes React 19.3.0 package sources for the ZapJS Rust bundler, then runs:

```bash
cargo +1.96.0 run --quiet -p zap-cli -- build --root /Users/deepsaint/Desktop/zapjs-landing --no-minify
cargo +1.96.0 run --quiet -p zap-cli -- check --root /Users/deepsaint/Desktop/zapjs-landing
```

Public claims must stay within the evidence boundary recorded by the core repo: Rust workspace tests, Aegis browser profiles, Fozzy traces and deployment artifacts.
