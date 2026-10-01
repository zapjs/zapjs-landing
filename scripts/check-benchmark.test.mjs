import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { deriveBenchmark } from './check-benchmark.mjs';

const originals = await Promise.all(['benchmark-safe', 'benchmark-safe-reverse'].map(async id => {
  const bytes = await readFile(new URL(`../public/benchmarks/${id}.json`, import.meta.url));
  return { id, bytes, data: JSON.parse(bytes) };
}));
const inputs = () => originals.map(value => ({ ...value, data: structuredClone(value.data) }));
test('separates measured attempts, successful responses, warm-ups, and fresh-process trials', () => {
  const value = deriveBenchmark(inputs());
  assert.deepEqual([value.requests, value.successes, value.errors, value.measurementCells, value.chartRequests, value.warmupRequests, value.freshProcessRequests], [6400, 6400, 0, 32, 800, 320, 12]);
  assert.equal(value.runs[0].frameworks[0].p50Ms, originals[0].data.frameworks.zap.warm['dynamic-rsc-html'][1].totalMs.p50);
});
test('rejects altered throughput instead of propagating an inconsistent raw summary', () => {
  const value = inputs();
  value[0].data.frameworks.zap.warm['api-echo'][0].requestsPerSecond *= 2;
  assert.throws(() => deriveBenchmark(value));
});
test('rejects unreported failures and assumptions that would mislabel sample size', () => {
  const value = inputs();
  value[0].data.frameworks.zap.warm['api-echo'][0].errors++;
  assert.throws(() => deriveBenchmark(value));
  const changed = inputs();
  changed[1].data.settings.requestsPerWorkload = 300;
  assert.throws(() => deriveBenchmark(changed));
});
