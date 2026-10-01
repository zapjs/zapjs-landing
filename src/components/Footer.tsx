'use client';
import { motion } from 'framer-motion';
import { Zap, Github, BookOpen, Code2, Heart } from 'lucide-react';

const footerLinks = [
  { title: 'Framework', links: [
    { label: 'Features', href: '/#features' },
    { label: 'Performance discipline', href: '/#performance' },
    { label: 'Architecture', href: '/#architecture' },
    { label: 'Implementation status', href: '/#get-started' },
  ] },
  { title: 'Developers', links: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Examples', href: '/examples' },
    { label: 'Runtime', href: '/docs#runtime' },
    { label: 'Deployment', href: '/docs#deployment' },
  ] },
  { title: 'Resources', links: [
    { label: 'Articles', href: '/blog' },
    { label: 'Source code', href: 'https://github.com/saint0x/zapjs' },
    { label: 'Issues', href: 'https://github.com/saint0x/zapjs/issues' },
    { label: 'Changes', href: 'https://github.com/saint0x/zapjs/commits' },
  ] },
  { title: 'Explore', links: [
    { label: 'Route handlers', href: '/examples' },
    { label: 'Server actions', href: '/#code' },
    { label: 'Splice boundary', href: '/docs#splice' },
    { label: 'Streaming', href: '/examples' },
  ] },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-carbon-800/50">
      <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2">
            <motion.a href="/" className="inline-flex items-center gap-2 group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-zap-500/20 blur-xl rounded-full group-hover:bg-zap-500/30 transition-colors" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-zap-400 to-zap-600 rounded-xl flex items-center justify-center shadow-lg shadow-zap-500/20">
                  <Zap className="w-6 h-6 text-white" fill="currentColor" />
                </div>
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Zap<span className="text-zap-400">JS</span>
              </span>
            </motion.a>

            <p className="mt-4 text-carbon-400 text-sm leading-relaxed max-w-xs">
              React authoring on a Rust-owned runtime, build graph, renderer and deployment artifact model.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a href="https://github.com/saint0x/zapjs" aria-label="ZapJS on GitHub" target="_blank" rel="noopener noreferrer" className="p-2 bg-carbon-800 hover:bg-carbon-700 rounded-lg transition-colors">
                <Github className="w-5 h-5 text-carbon-400 hover:text-white" />
              </a>
              <a href="/docs" aria-label="Documentation" className="p-2 bg-carbon-800 hover:bg-carbon-700 rounded-lg transition-colors">
                <BookOpen className="w-5 h-5 text-carbon-400 hover:text-white" />
              </a>
              <a href="/examples" aria-label="Examples" className="p-2 bg-carbon-800 hover:bg-carbon-700 rounded-lg transition-colors">
                <Code2 className="w-5 h-5 text-carbon-400 hover:text-white" />
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-white text-sm mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-carbon-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-carbon-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-carbon-500">&copy; {new Date().getFullYear()} ZapJS. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm text-carbon-500">
            Made with <Heart className="w-4 h-4 text-rust-400 mx-1" fill="currentColor" /> using <span className="text-zap-400 font-medium ml-1">ZapJS</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/docs" className="text-carbon-500 hover:text-white transition-colors">Documentation</a>
            <a href="https://github.com/saint0x/zapjs" className="text-carbon-500 hover:text-white transition-colors">Source code</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
