'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Rocket, Copy, Check, Terminal, ArrowRight, Folder, FileCode, Server } from 'lucide-react';

const commands = [
  {
    command: 'cargo +1.96.0 test --workspace',
    description: 'Run the Rust workspace tests for routing, Splice, rendering and TSX bundling.',
  },
  {
    command: 'fozzy test --det --strict artifacts/verification/rust-only-crates.fozzy.json --json',
    description: 'Run deterministic scenario coverage against the Rust-owned crate boundary.',
  },
  {
    command: 'fozzy trace verify artifacts/verification/rust-only-crates-host.trace.fozzy --strict --json',
    description: 'Verify a recorded host-backed trace before treating runtime behavior as production evidence.',
  },
];

const projectStructure = [
  { type: 'folder', name: 'crates/runtime/', indent: 0, description: 'Routes, path safety and request contracts' },
  { type: 'folder', name: 'crates/splice/', indent: 0, description: 'Bounded internal worker transport' },
  { type: 'folder', name: 'crates/render/', indent: 0, description: 'Rust-owned JavaScript host for React execution' },
  { type: 'folder', name: 'crates/build/', indent: 0, description: 'TSX graph compilation through Rust libraries' },
  { type: 'folder', name: 'docs/', indent: 0, description: 'Current architecture and implementation notes' },
  { type: 'file', name: 'Cargo.toml', indent: 0, description: 'Single Rust workspace definition' },
];

function CopyButton({ text }: { text: string }) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  };

  return (
    <div className="flex-shrink-0 text-right">
      <button
        aria-label="Copy validation command"
        onClick={handleCopy}
        className="p-2 hover:bg-carbon-700 rounded-lg transition-colors"
      >
        {copyStatus === 'copied' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-carbon-400" />}
      </button>
      <span role="status" className="block text-xs text-carbon-400">
        {copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Copy failed' : ''}
      </span>
    </div>
  );
}

export default function GetStarted() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="get-started" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zap-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-zap-500/10 border border-zap-500/20 rounded-full">
            <Rocket className="w-4 h-4 text-zap-400" />
            <span className="text-sm font-medium text-zap-400">Implementation Status</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white mb-6">
            Built around the <span className="text-gradient">Rust workspace</span>
          </h2>

          <p className="text-lg text-carbon-400 max-w-2xl mx-auto">
            The implementation surface is the Rust core: runtime, Splice, renderer and build graph. Application scaffolding returns after those crates are connected into the production React pipeline.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-zap-500/20 to-rust-500/20 rounded-2xl blur-xl opacity-50" />

              <div className="relative bg-carbon-900/90 backdrop-blur-xl border border-carbon-800 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-carbon-900/50 border-b border-carbon-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-sm text-carbon-500 font-mono">validation</span>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  {commands.map((step, i) => (
                    <motion.div
                      key={step.command}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                    >
                      <div className="flex items-center justify-between gap-3 p-3 bg-carbon-800/50 rounded-lg group">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-emerald-400 font-mono">$</span>
                          <code className="font-mono text-sm text-white whitespace-pre-wrap break-all">{step.command}</code>
                        </div>
                        <CopyButton text={step.command} />
                      </div>
                      <p className="mt-2 text-sm text-carbon-500 pl-6">{step.description}</p>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="pt-4 border-t border-carbon-800"
                  >
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-5 h-5" />
                      <span className="font-mono text-sm">Ship claims only after executable evidence exists.</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="https://github.com/saint0x/zapjs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-carbon-800 hover:bg-carbon-700 border border-carbon-700 text-white font-medium rounded-full transition-colors"
              >
                Source code
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/docs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zap-500 hover:bg-zap-600 text-white font-medium rounded-full transition-colors"
              >
                Read docs
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-rust-500/20 to-sky-500/20 rounded-2xl blur-xl opacity-50" />

            <div className="relative bg-carbon-900/90 backdrop-blur-xl border border-carbon-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <Folder className="w-6 h-6 text-zap-400" />
                <h3 className="font-display font-bold text-2xl text-white">Core layout</h3>
              </div>

              <div className="space-y-2 font-mono text-sm">
                {projectStructure.map((item, i) => {
                  const Icon = item.type === 'folder' ? Folder : item.name.endsWith('.rs') || item.name.endsWith('.tsx') ? FileCode : Server;
                  return (
                    <motion.div
                      key={`${item.name}-${i}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-carbon-800/50 transition-colors"
                      style={{ paddingLeft: `${item.indent * 1.5 + 0.5}rem` }}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${item.type === 'folder' ? 'text-zap-400' : 'text-carbon-500'}`} />
                      <span className={`${item.type === 'folder' ? 'text-white' : 'text-carbon-300'}`}>{item.name}</span>
                      <span className="text-carbon-600 group-hover:text-carbon-500 transition-colors">— {item.description}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-carbon-800/50 rounded-xl border border-carbon-700/50">
                <p className="text-sm text-carbon-400">
                  The public app surface will return once the Rust pipeline owns SSR, Flight, hydration, actions, routes, cache metadata and deployment packaging from one graph.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
