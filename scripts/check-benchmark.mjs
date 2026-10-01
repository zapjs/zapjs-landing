#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sources = ['benchmark-safe', 'benchmark-safe-reverse'];
const workloads = ['api-echo', 'api-js-cpu', 'dynamic-rsc-html', 'streamed-rsc-html'];
const sha256 = value => createHash('sha256').update(value).digest('hex');
const harnessSha256 = 'c59592c236ab2cf0dbbe22b3e38cac1ba5415c4d16484a549548c89d6e9ad133';

/** Derive the public projection; assert the assumptions behind its labels. */
export function deriveBenchmark(inputs) {
  assert.equal(inputs.length, 2);
  const first = inputs[0].data;
  let requests = 0, successes = 0, errors = 0, measurementCells = 0, warmupRequests = 0, freshProcessRequests = 0;
  const runs = inputs.map(({ id, bytes, data }, index) => {
    assert.equal(id, sources[index]);
    assert.deepEqual(data.settings, { ...first.settings, order: index === 0 ? ['zap', 'next'] : ['next', 'zap'] });
    assert.deepEqual(data.settings.concurrencyLevels, [1, 16]);
    assert.equal(data.settings.requestsPerWorkload, 200);
    assert.equal(data.settings.warmupRequests, 10);
    assert.equal(data.settings.coldRuns, 3);
    assert.equal(data.settings.acceptEncoding, 'identity');
    assert.equal(data.settings.streamedDelayMs, 60);
    assert.equal(data.settings.cpuIterations, 250000);
    assert.deepEqual(data.versions, first.versions);
    assert.deepEqual(data.git, first.git);
    assert.equal(data.fixtureSha256, first.fixtureSha256);
    for (const key of ['platform', 'release', 'arch', 'cpu', 'logicalCpus', 'totalMemoryBytes']) assert.equal(data.host[key], first.host[key]);
    const frameworks = ['zap', 'next'].map(name => {
      const framework = data.frameworks[name];
      assert.deepEqual(Object.keys(framework.warm).sort(), [...workloads].sort());
      assert.equal(framework.cold.length, data.settings.coldRuns);
      freshProcessRequests += framework.cold.length;
      for (const cells of Object.values(framework.warm)) {
        assert.deepEqual(cells.map(cell => cell.concurrency), data.settings.concurrencyLevels);
        for (const cell of cells) {
          assert.equal(cell.requests, data.settings.requestsPerWorkload);
          assert.equal(cell.requests, cell.successes + cell.errors);
          assert.ok(Number.isInteger(cell.errors) && cell.errors >= 0);
          assert.ok(cell.elapsedMs > 0);
          const throughput = cell.successes / (cell.elapsedMs / 1000);
          assert.ok(Math.abs(cell.requestsPerSecond - throughput) <= Math.max(1, throughput) * 1e-12);
          requests += cell.requests; successes += cell.successes; errors += cell.errors; measurementCells++;
          warmupRequests += data.settings.warmupRequests;
        }
      }
      const cell = framework.warm['dynamic-rsc-html'].find(value => value.concurrency === 16);
      assert.equal(cell.successes, cell.requests, 'Chart percentiles must use all 200 requests');
      for (const value of [cell.totalMs.p50, cell.totalMs.p99]) assert.ok(Number.isFinite(value) && value >= 0);
      assert.ok(cell.totalMs.p50 <= cell.totalMs.p99);
      return { name: name === 'zap' ? 'ZapJS' : 'Next.js', requests: cell.requests, successes: cell.successes, errors: cell.errors,
        requestsPerSecond: cell.requestsPerSecond, p50Ms: cell.totalMs.p50, p99Ms: cell.totalMs.p99 };
    });
    return { id, label: index === 0 ? 'ZapJS first' : 'Next.js first', measuredAt: data.measuredAt,
      loadAverageBefore: data.host.loadAverage, loadAverageAfter: data.host.loadAverageAfter,
      sourceSha256: sha256(bytes), frameworks, sourceUrl: `/benchmarks/${id}.json` };
  });
  const h = first.host;
  const chartRequests = runs.flatMap(run => run.frameworks).reduce((sum, cell) => sum + cell.requests, 0);
  return {
    recordedAt: first.measuredAt.slice(0, 10), sourceUrl: runs[0].sourceUrl, methodologyUrl: '/docs#performance',
    host: `${h.cpu} · ${h.logicalCpus} logical CPUs · ${h.totalMemoryBytes / 1024 ** 3} GiB · ${h.platform}/${h.arch}, kernel ${h.release} · Node ${first.versions.node} · shared, unpinned host`,
    requests, successes, errors, measurementCells, warmupRequests, freshProcessRequests, chartRequests,
    workload: 'Dynamic RSC HTML, concurrency 16, 200 measured requests per framework per order',
    latency: 'Full-response completion observed by the local fetch client; nearest-rank p50 and p99 over 200 successful responses per bar',
    versions: first.versions,
    provenance: { git: first.git, fixtureSha256: first.fixtureSha256,
      fixtureHashScope: 'Concatenated Zap app/page.tsx and app/api/cpu/route.ts only; not the complete application or framework',
      auditedHarness: 'zapjs/benchmarks/compare.mjs', auditedHarnessSha256: harnessSha256,
      limitation: 'Recorded dirty working tree without a full source or build digest. These results cannot be tied uniquely to today’s framework package. Individual request timings were not retained.' },
    caveat: 'Historical synthetic fixture measurements from a heavily contended host. They do not establish a reliable speed advantage and do not measure this website.',
    chartScaleMaxRequestsPerSecond: Math.max(...runs.flatMap(run => run.frameworks.map(framework => framework.requestsPerSecond))),
    runs,
  };
}

async function main() {
  const inputs = await Promise.all(sources.map(async id => {
    const bytes = await readFile(join(root, `public/benchmarks/${id}.json`));
    return { id, bytes, data: JSON.parse(bytes) };
  }));
  const snapshot = deriveBenchmark(inputs);
  const path = join(root, 'src/content/benchmark.json');
  if (process.argv.includes('--write')) await writeFile(path, JSON.stringify(snapshot, null, 2) + '\n');
  else assert.deepEqual(JSON.parse(await readFile(path, 'utf8')), snapshot, 'Benchmark snapshot drifted. Inspect the inputs, then run node scripts/check-benchmark.mjs --write.');
  const sourceOption = process.argv.indexOf('--framework-root');
  if (sourceOption !== -1) {
    assert.ok(process.argv[sourceOption + 1], '--framework-root needs a path');
    const frameworkRoot = resolve(process.argv[sourceOption + 1]);
    for (const input of inputs) assert.deepEqual(input.bytes, await readFile(join(frameworkRoot, `artifacts/verification/${input.id}.json`)), `${input.id}: published file differs from framework artifact`);
    assert.equal(sha256(await readFile(join(frameworkRoot, 'benchmarks/compare.mjs'))), harnessSha256, 'Audited harness changed; review methodology before updating its digest');
  }
  console.log(JSON.stringify({ result: 'pass', requests: snapshot.requests, successes: snapshot.successes, errors: snapshot.errors,
    measurementCells: snapshot.measurementCells, chartRequests: snapshot.chartRequests, excludedWarmups: snapshot.warmupRequests,
    excludedFreshProcessRequests: snapshot.freshProcessRequests, sources: snapshot.runs.map(run => ({ id: run.id, sha256: run.sourceSha256 })) }, null, 2));
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await main();
