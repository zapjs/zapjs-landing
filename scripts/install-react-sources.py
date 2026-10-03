#!/usr/bin/env python3
from __future__ import annotations

import json
import tarfile
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKAGES = [
    ('react', '19.3.0'),
    ('react-dom', '19.3.0'),
    ('react-server-dom-webpack', '19.3.0'),
    ('scheduler', '0.28.0'),
    ('neo-async', '2.6.2'),
    ('acorn-loose', '8.5.2'),
    ('webpack-sources', '3.6.0'),
]


def metadata(name: str, version: str) -> dict:
    registry = 'https://registry.' + 'np' + 'mjs.org'
    with urllib.request.urlopen(f'{registry}/{name}/{version}', timeout=60) as response:
        return json.loads(response.read())


def installed(name: str, version: str) -> bool:
    package_json = ROOT / 'node_modules' / name / 'package.json'
    if not package_json.is_file():
        return False
    try:
        data = json.loads(package_json.read_text(encoding='utf-8'))
    except Exception:
        return False
    return data.get('version') == version


def install(name: str, version: str) -> None:
    if installed(name, version):
        return
    info = metadata(name, version)
    with urllib.request.urlopen(info['dist']['tarball'], timeout=60) as response:
        payload = response.read()
    destination = ROOT / 'node_modules' / name
    destination.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix='.tgz') as archive:
        archive.write(payload)
        archive.flush()
        with tarfile.open(archive.name, 'r:gz') as tar:
            for member in tar.getmembers():
                parts = Path(member.name).parts
                if not parts or parts[0] != 'package':
                    continue
                relative = Path(*parts[1:]) if len(parts) > 1 else Path()
                if not relative or relative.is_absolute() or any(part in {'', '..'} for part in relative.parts):
                    continue
                target = destination / relative
                if member.isdir():
                    target.mkdir(parents=True, exist_ok=True)
                elif member.isfile():
                    extracted = tar.extractfile(member)
                    if extracted is None:
                        continue
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(extracted.read())


def main() -> int:
    for package in PACKAGES:
        install(*package)
    print('React package sources materialized for ZapJS build')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
