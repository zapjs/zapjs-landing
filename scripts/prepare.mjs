import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const archive = 'zap-js-client-0.3.0.tgz';
const bytes = await readFile(new URL(`vendor/${archive}`, root));
await mkdir(new URL('public/downloads/', root), {recursive:true});
await copyFile(new URL(`vendor/${archive}`, root), new URL(`public/downloads/${archive}`, root));
await writeFile(new URL(`public/downloads/${archive}.sha256`,root), `${createHash('sha256').update(bytes).digest('hex')}  ${archive}\n`);
