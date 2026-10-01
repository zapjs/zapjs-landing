
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Layers, Globe, Cpu, Database, Package, ArrowDown } from 'lucide-react';

const layers = [
  {
    icon: Globe,
    label: 'Browser + Static Assets',
    description: 'Hydration inputs, client references, static files and browser chunks are tracked by the same application graph.',
    items: ['Hydration Inputs', 'Client References', 'Static Assets'],
  },
  {
    icon: Package,
    label: 'Rust Build Graph',
    description: 'TSX modules are compiled into server bundles, browser modules, action IDs, route metadata and cache policy.',
    items: ['Rolldown/Oxc', 'Route Manifest', 'Action IDs'],
  },
  {
    icon: Cpu,
    label: 'Rust Request Runtime',
    description: 'Requests enter Rust-owned routing and admission before any dynamic handler, action or renderer work is dispatched.',
    items: ['Routing', 'Admission', 'Limits'],
  },
  {
    icon: Layers,
    label: 'Embedded React Host',
    description: 'Server React bundles execute inside a Rust-controlled JavaScript host with explicit Web primitives and bounded host operations.',
    items: ['SSR Gate', 'Flight Gate', 'Host Calls'],
  },
  {
    icon: Database,
    label: 'Splice Worker Boundary',
    description: 'Splice is an internal Rust worker boundary for isolated execution, deadlines, frame limits and crash cleanup.',
    items: ['Deadlines', 'Frame Limits', 'Crash Cleanup'],
  },
];

const flows = [
  {
    title: 'Development',
    description: 'The target developer workflow will reuse the Rust graph for React and runtime inputs so rebuild and restart behavior follows the same manifest semantics as production.',
  },
  {
    title: 'Production request',
    description: 'The target request path is Rust routing and admission first, then admitted handler/action or embedded React renderer work with explicit cancellation and limits.',
  },
  {
    title: 'Deployment output',
    description: 'The release target is one project output: assets, browser chunks, server bundles, route metadata, cache metadata and Rust-managed dynamic artifacts.',
  },
  {
    title: 'Native work',
    description: 'Native work belongs behind Rust-owned admission or named host operations. It is framework-owned infrastructure, not a public add-on API.',
  },
];

export default function Architecture() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-carbon-900/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-rust-500/10 border border-rust-500/20 rounded-full">
            <Layers className="w-4 h-4 text-rust-400" />
            <span className="text-sm font-medium text-rust-400">Architecture</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            One React app, <span className="text-gradient">owned by Rust</span>
          </h2>

          <p className="text-lg text-carbon-400 max-w-3xl mx-auto">
            ZapJS keeps the integrated deployment shape developers expect from a React framework while moving routing, build orchestration, runtime limits, rendering ownership and worker isolation into Rust.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto mb-20">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="relative"
            >
              <div className="bg-carbon-900/80 backdrop-blur-xl border border-carbon-800 rounded-2xl p-6 sm:p-8 mb-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-zap-500/20 to-rust-500/20 rounded-2xl flex items-center justify-center border border-zap-500/20">
                      <layer.icon className="w-8 h-8 text-zap-400" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-2xl text-white mb-3">{layer.label}</h3>
                    <p className="text-carbon-400 mb-4 leading-relaxed">{layer.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <span key={item} className="px-3 py-1 bg-carbon-800/50 border border-carbon-700 rounded-full text-sm text-carbon-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {index < layers.length - 1 && (
                <div className="flex justify-center -mt-4 mb-4">
                  <ArrowDown className="w-6 h-6 text-carbon-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {flows.map((flow, index) => (
            <motion.div
              key={flow.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
              className="p-6 bg-carbon-900/50 border border-carbon-800 rounded-2xl"
            >
              <h3 className="font-semibold text-white mb-3">{flow.title}</h3>
              <p className="text-sm text-carbon-400 leading-relaxed">{flow.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
