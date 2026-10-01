import { randomUUID } from 'node:crypto';
export function GET() {
 return Response.json({ framework: 'ZapJS', version: '0.3.0', requestId: randomUUID(), serverTime: new Date().toISOString(), runtime: process.release.name, nodeVersion: process.versions.node, platform: process.platform, architecture: process.arch, uptimeSeconds: process.uptime(), memoryBytes: process.memoryUsage().rss, scope: 'Current Node process; not global traffic statistics', memoryMetric: 'Process resident set size (RSS), including native memory; not per-request usage', uptimeScope: 'Node process uptime; not total website uptime' }, { headers: { 'cache-control': 'private, no-store' } });
}
