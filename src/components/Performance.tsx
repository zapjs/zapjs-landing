'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Gauge, TrendingUp, Zap, Server } from 'lucide-react';
import snapshot from '../content/benchmark.json';

type Benchmark = typeof snapshot.runs[number]['frameworks'][number];
const maxRequests = snapshot.chartScaleMaxRequestsPerSecond;

function BenchmarkBar({ benchmark, index }: { benchmark: Benchmark; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const percentage = benchmark.requestsPerSecond / maxRequests * 100;
  const isZap = benchmark.name === 'ZapJS';
  const colors = isZap
    ? { bg: 'bg-gradient-to-r from-zap-500 to-zap-400', border: 'border-zap-500/30', text: 'text-zap-400' }
    : { bg: 'bg-gradient-to-r from-sky-500 to-sky-400', border: 'border-sky-500/30', text: 'text-sky-400' };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-4 sm:p-5 rounded-xl border ${colors.border} ${isZap ? 'bg-zap-500/5' : 'bg-carbon-900/30'}`}
    >
      <div className="flex items-center justify-between mb-3 gap-3">
        <span className={`font-semibold ${isZap ? 'text-white' : 'text-carbon-300'}`}>{benchmark.name}</span>
        <div className="text-right">
          <span className={`font-mono font-bold ${colors.text}`}>{benchmark.requestsPerSecond.toFixed(1)}</span>
          <span className="text-carbon-500 text-sm ml-1">req/s</span>
        </div>
      </div>
      <div className="relative h-3 bg-carbon-800 rounded-full overflow-hidden" aria-hidden="true">
        <motion.div
          className={`absolute inset-y-0 left-0 ${colors.bg} rounded-full`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
        />
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-carbon-500">
        <span>Completion p50: <span className={colors.text}>{benchmark.p50Ms.toFixed(2)} ms</span></span>
        <span>p99: <span className={colors.text}>{benchmark.p99Ms.toFixed(2)} ms</span></span>
      </div>
    </motion.div>
  );
}

export default function Performance() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });
  const [selectedRun, setSelectedRun] = useState(0);
  const run = snapshot.runs[selectedRun];

  return (
    <section id="performance" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-rust-500/10 border border-rust-500/20 rounded-full">
              <Gauge className="w-4 h-4 text-rust-400" />
              <span className="text-sm font-medium text-rust-400">Recorded performance</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
              Measured,{' '}<span className="text-gradient">with context</span>
            </h2>
            <p className="text-lg text-carbon-400 mb-8 leading-relaxed">
              Matching application source, four React and API workloads, and two framework orders.
              Different production entrypoints ran on the same heavily contended machine. These samples cannot establish a reliable speed advantage.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: Zap, label: 'Measured requests', value: snapshot.requests.toLocaleString('en-US'), color: 'text-zap-400' },
                { icon: TrendingUp, label: 'Recorded request errors', value: String(snapshot.errors), color: 'text-emerald-400' },
                { icon: Server, label: 'Framework orders tested', value: 'Both', color: 'text-sky-400' },
                { icon: Gauge, label: 'Recorded snapshot', value: snapshot.recordedAt, color: 'text-violet-400' },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="p-4 bg-carbon-900/50 border border-carbon-800 rounded-xl"
                >
                  <metric.icon className={`w-5 h-5 ${metric.color} mb-2`} />
                  <div className="font-display font-bold text-2xl text-white">{metric.value}</div>
                  <div className="text-sm text-carbon-500">{metric.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-xs text-carbon-500">Totals cover {snapshot.measurementCells} measured workload/concurrency/framework/order cells. They exclude {snapshot.warmupRequests} warm-up requests and {snapshot.freshProcessRequests} fresh-process requests.</p>
          </motion.div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Benchmark framework order">
              {snapshot.runs.map((item, index) => (
                <button key={item.id} onClick={() => setSelectedRun(index)} aria-pressed={selectedRun === index}
                  className={`px-4 py-2 text-sm rounded-full border transition-colors ${selectedRun === index ? 'bg-zap-500/10 border-zap-500/30 text-zap-400' : 'bg-carbon-900/30 border-carbon-800 text-carbon-400 hover:text-white'}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-carbon-400">{snapshot.workload}. The two chart tabs cover {snapshot.chartRequests} of the {snapshot.requests.toLocaleString('en-US')} measured requests.</p>
            <p className="text-xs text-carbon-500">Both tabs use one linear scale: 0–{maxRequests.toFixed(1)} successful responses/s. Latency includes reading the complete response; p99 is the 198th sorted duration out of 200.</p>
            <div className="space-y-4" aria-live="polite">
              {run.frameworks.map((benchmark, index) => <BenchmarkBar key={benchmark.name} benchmark={benchmark} index={index} />)}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={isHeaderInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="text-sm text-carbon-500 pt-3 space-y-3">
              <p>{snapshot.host}</p>
              <p>ZapJS {snapshot.versions.zap} · Next.js {snapshot.versions.next} · React {snapshot.versions.react}</p>
              <p>{snapshot.caveat} No Rust acceleration, browser hydration, CDN, or managed cold start was measured.</p>
              <p>One-minute host load: {run.loadAverageBefore[0].toFixed(1)} before, {run.loadAverageAfter[0].toFixed(1)} after. This dirty working-tree snapshot is not a benchmark of the current release.</p>
              <div className="flex flex-wrap gap-4">
                <a href={run.sourceUrl} className="text-zap-400 hover:underline">View this run’s raw data</a>
                <a href={snapshot.methodologyUrl} className="text-zap-400 hover:underline">Read the methodology</a>
                <a href="/api/benchmarks" className="text-zap-400 hover:underline">Snapshot API</a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
