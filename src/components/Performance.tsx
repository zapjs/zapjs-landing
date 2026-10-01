'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity, BarChart3, Gauge, ShieldCheck } from 'lucide-react';

const policies = [
  {
    icon: ShieldCheck,
    title: 'No synthetic speed claims',
    body: 'ZapJS does not publish framework-versus-framework throughput numbers until the final Rust pipeline runs equivalent production workloads end to end.',
  },
  {
    icon: Gauge,
    title: 'Optimize the hot path first',
    body: 'Routing, request admission, cancellation and host calls stay in Rust-owned code where limits are explicit. Streaming remains a separate gate until backpressure is proven end to end.',
  },
  {
    icon: BarChart3,
    title: 'Measure cold and warm behavior',
    body: 'Production evidence must include cold start, warm latency, p95 and p99 latency, memory, binary size, request abort behavior and failure cleanup.',
  },
  {
    icon: Activity,
    title: 'Replayable traces',
    body: 'Scenario evidence must include deterministic Fozzy runs and host-backed traces that can be verified, replayed and checked in CI.',
  },
];

export default function Performance() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="performance" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-carbon-950 via-carbon-900/20 to-carbon-950 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Performance Discipline</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            Fast by architecture, <span className="text-gradient">proven by traces</span>
          </h2>

          <p className="text-lg text-carbon-400 max-w-3xl mx-auto">
            The performance model is Rust-owned routing, bounded worker transport, explicit rendering limits and one deployment graph. Public numbers require production-equivalent evidence from the final pipeline.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="p-6 bg-carbon-900/60 border border-carbon-800 rounded-2xl"
            >
              <div className="w-12 h-12 mb-5 rounded-xl bg-zap-500/10 border border-zap-500/20 flex items-center justify-center">
                <policy.icon className="w-6 h-6 text-zap-400" />
              </div>
              <h3 className="font-semibold text-white mb-3">{policy.title}</h3>
              <p className="text-sm text-carbon-400 leading-relaxed">{policy.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
