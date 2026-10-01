'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Layers, ArrowRight, Zap, FileCode, Server, Globe, Database, Cpu } from 'lucide-react';

const architectureLayers = [
  {
    id: 'client',
    label: 'Browser + Static Assets',
    icon: Globe,
    color: 'sky',
    description: 'Client components hydrate; public prerendered pages and assets can be served by the CDN.',
    items: ['Hydration', 'Navigation', 'CDN'],
  },
  {
    id: 'runtime',
    label: 'React Application Runtime',
    icon: Zap,
    color: 'zap',
    description: 'The route graph connects server components, actions and Web Request/Response handlers.',
    items: ['RSC', 'Actions', 'route.ts'],
  },
  {
    id: 'rust',
    label: 'Optional Native Rust',
    icon: Server,
    color: 'rust',
    description: 'Server code imports napi-rs exports through zap:native inside the Node process.',
    items: ['Node-API 8', 'Typed Imports', 'Bounded SDK Tasks'],
  },
  {
    id: 'managed',
    label: 'Managed Node Function',
    icon: Cpu,
    color: 'violet',
    description: 'Vercel Node 22 runs the traced server artifact and matching Linux native addon.',
    items: ['Node 22', 'Lazy Route Chunks', 'Linux GNU'],
  },
];

function ArchitectureLayer({ layer, index, total }: { layer: typeof architectureLayers[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', glow: 'shadow-sky-500/20' },
    zap: { bg: 'bg-zap-500/10', border: 'border-zap-500/30', text: 'text-zap-400', glow: 'shadow-zap-500/20' },
    rust: { bg: 'bg-rust-500/10', border: 'border-rust-500/30', text: 'text-rust-400', glow: 'shadow-rust-500/20' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  };

  const colors = colorClasses[layer.color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      {/* Connector line */}
      {index < total - 1 && (
        <div className="absolute left-1/2 -bottom-8 w-px h-8 bg-gradient-to-b from-carbon-700 to-transparent hidden lg:block" />
      )}

      <div className={`relative p-6 ${colors.bg} ${colors.border} border rounded-2xl backdrop-blur-sm hover:shadow-lg ${colors.glow} transition-shadow duration-300`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center flex-shrink-0`}>
            <layer.icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1">{layer.label}</h3>
            <p className="text-sm text-carbon-400 mb-3">{layer.description}</p>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((item) => (
                <span
                  key={item}
                  className={`px-2 py-1 text-xs font-mono ${colors.bg} ${colors.text} rounded`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Architecture() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="architecture" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-zap-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-rust-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <Layers className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">Architecture</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            How it{' '}
            <span className="text-gradient">works</span>
          </h2>

          <p className="text-lg text-carbon-400 max-w-3xl mx-auto">
            One React application produces browser assets, server rendering and optional native functions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Architecture diagram */}
          <div className="space-y-6">
            {architectureLayers.map((layer, index) => (
              <ArchitectureLayer
                key={layer.id}
                layer={layer}
                index={index}
                total={architectureLayers.length}
              />
            ))}
          </div>

          {/* Right: Feature highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:pl-8"
          >
            <div className="space-y-8">
              {[
                {
                  title: 'Request Flow',
                  description: 'Dynamic pages and route handlers run in the managed function; prerendered pages can be served as static output. Server code can call Rust through Node-API.',
                  icon: ArrowRight,
                },
                {
                  title: 'Type Generation',
                  description: 'Compile napi-rs exports to generate declarations for zap:native. Native modules stay server-side; client imports fail compilation.',
                  icon: FileCode,
                },
                {
                  title: 'Dev Mode',
                  description: 'Vite updates React modules. Rust edits trigger a native rebuild and local runtime restart so the new addon is loaded.',
                  icon: Zap,
                },
                {
                  title: 'Production',
                  description: 'The initial adapter emits Vercel Build Output: static files and one dynamic Node function. Native builds must match the deployment platform.',
                  icon: Database,
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-carbon-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-zap-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-carbon-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-10 p-6 bg-gradient-to-br from-zap-500/10 to-rust-500/10 border border-zap-500/20 rounded-2xl"
            >
              <p className="text-carbon-300 text-sm leading-relaxed">
                <span className="text-white font-semibold">This site</span> is a ZapJS project.
                It uses React components, Web route handlers and an optional Rust addon in the same application.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
