#!/usr/bin/env python3
from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT.parent / 'zapjs'


def run(cmd: list[str], cwd: Path) -> None:
    subprocess.run(cmd, cwd=cwd, check=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--build-only', action='store_true')
    args = parser.parse_args()
    run(['python3', 'scripts/install-react-sources.py'], ROOT)
    run(['cargo', '+1.96.0', 'run', '--quiet', '-p', 'zap-cli', '--', 'build', '--root', str(ROOT), '--no-minify'], CORE)
    if not args.build_only:
        run(['cargo', '+1.96.0', 'run', '--quiet', '-p', 'zap-cli', '--', 'check', '--root', str(ROOT)], CORE)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
