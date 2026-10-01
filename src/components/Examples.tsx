'use client';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Code2, Zap, Activity, FileText, Radio, Copy, Check, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { highlightCode, tokensToHtml } from '../lib/utils';

interface ApiExample {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST';
  description: string;
  category: 'simple' | 'complex' | 'advanced';
  icon: typeof Zap;
  sampleBody?: unknown;
  streaming?: boolean;
  curl: string;
  codeSnippet: string;
}

const examples: ApiExample[] = [
  { id: 'stats', name: 'Runtime Stats', endpoint: '/api/stats', method: 'GET', category: 'simple', icon: Activity,
    description: 'Inspect Node process uptime, process RSS memory, and fresh request metadata.',
    curl: 'curl "$ORIGIN/api/stats"',
    codeSnippet: `const response = await fetch('/api/stats');
if (!response.ok) throw new Error('HTTP ' + response.status);
console.log(await response.json());` },
  { id: 'features', name: 'Supported Features', endpoint: '/api/features', method: 'GET', category: 'simple', icon: Zap,
    description: 'Read the capabilities supported by this framework build.',
    curl: 'curl "$ORIGIN/api/features"',
    codeSnippet: `const response = await fetch('/api/features');
if (!response.ok) throw new Error('HTTP ' + response.status);
console.log(await response.json());` },
  { id: 'benchmarks', name: 'Measured Benchmarks', endpoint: '/api/benchmarks', method: 'GET', category: 'simple', icon: Activity,
    description: 'Read the recorded workload, measurements, and their limits.',
    curl: 'curl "$ORIGIN/api/benchmarks"',
    codeSnippet: `const response = await fetch('/api/benchmarks');
if (!response.ok) throw new Error('HTTP ' + response.status);
// A recorded measurement snapshot, not a live load test.
console.log(await response.json());` },
  { id: 'posts', name: 'Article Pagination', endpoint: '/api/posts?page=1&limit=5', method: 'GET', category: 'complex', icon: FileText,
    description: 'Browse documented articles with pagination and optional tag filtering.',
    curl: 'curl "$ORIGIN/api/posts?page=1&limit=5"',
    codeSnippet: `const query = new URLSearchParams({
  page: '1', limit: '5', tag: 'rust'
});
const response = await fetch('/api/posts?' + query);
if (!response.ok) throw new Error('HTTP ' + response.status);
console.log(await response.json());` },
  { id: 'echo', name: 'JSON Request', endpoint: '/api/echo', method: 'POST', category: 'complex', icon: Radio,
    description: 'Send your own JSON and inspect the actual body and request ID.', sampleBody: { message: 'Hello from ZapJS', count: 2 },
    curl: `curl -X POST "$ORIGIN/api/echo" -H 'Content-Type: application/json' -d '{"message":"Hello from ZapJS"}'`,
    codeSnippet: `const response = await fetch('/api/echo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello from ZapJS' })
});
if (!response.ok) throw new Error('HTTP ' + response.status);
console.log(await response.json());` },
  { id: 'native', name: 'Rust Computation', endpoint: '/api/native', method: 'POST', category: 'advanced', icon: Zap,
    description: 'Run a real Rust function inside this Node process through Node-API.', sampleBody: { values: [20, 22] },
    curl: `curl -X POST "$ORIGIN/api/native" -H 'Content-Type: application/json' -d '{"values":[20,22]}'`,
    codeSnippet: `// Server-only application code
import { sumNumbers } from 'zap:native';

const sum = await sumNumbers([20, 22]);
// 42. TypeScript declarations come from Rust exports.
// Browser components call an HTTP route or server action.` },
  { id: 'stream', name: 'Streaming Response', endpoint: '/api/stream', method: 'GET', category: 'advanced', icon: Radio, streaming: true,
    description: 'Watch newline-delimited JSON arrive in separate chunks. Cancel any time.',
    curl: 'curl -N "$ORIGIN/api/stream"',
    codeSnippet: `const controller = new AbortController();
const response = await fetch('/api/stream', { signal: controller.signal });
if (!response.ok || !response.body) throw new Error('Stream unavailable');
const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  console.log(value); // Buffer partial lines when parsing NDJSON.
}
// Call controller.abort() from your cancel handler.` },
];

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  POST: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
};

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const handleCopy = async () => {
    setError('');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); setError('Copy failed. Select and copy the code manually.'); }
  };
  return <div className="flex items-center gap-2">
    {error && <span role="alert" className="text-xs text-rose-400">{error}</span>}
    <button type="button" aria-label={copied ? 'Copied' : 'Copy code'} onClick={handleCopy} className={`p-2 hover:bg-carbon-700 rounded-lg transition-colors ${className}`}>
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-carbon-400" />}
    </button>
  </div>;
}

function LiveResponse({ example }: { example: ApiExample }) {
  const [response, setResponse] = useState<string | null>(null);
  const [body, setBody] = useState(JSON.stringify(example.sampleBody, null, 2) ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => { const controller = active.current; active.current = null; controller?.abort(); }, []);
  const fetchData = async () => {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    const timeout = setTimeout(() => controller.abort(new Error('Request timed out after 20 seconds.')), 20000);
    setLoading(true); setError(null); setResponse(null); setStatus(null);
    try {
      const payload = example.method === 'POST' ? JSON.stringify(JSON.parse(body)) : undefined;
      const res = await fetch(example.endpoint, { method: example.method, signal: controller.signal,
        headers: payload === undefined ? undefined : { 'Content-Type': 'application/json' }, body: payload });
      if (active.current !== controller) return;
      setStatus(res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 1000)}`);
      if (example.streaming) {
        if (!res.body) throw new Error('This response has no readable stream.');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        const lines: string[] = [];
        let pending = '';
        const accept = (line: string) => { if (line.trim()) lines.push(JSON.stringify(JSON.parse(line))); };
        try {
          while (true) {
            const { value, done } = await reader.read();
            pending += decoder.decode(value, { stream: !done });
            const parts = pending.split('\n'); pending = parts.pop() ?? '';
            for (const part of parts) accept(part);
            if (done) { accept(pending); pending = ''; }
            if (active.current !== controller) return;
            setResponse(lines.join('\n'));
            if (done) break;
          }
        } finally { reader.releaseLock(); }
      } else {
        const value = await res.json();
        if (active.current === controller) setResponse(JSON.stringify(value, null, 2));
      }
    } catch (cause) {
      if (active.current === controller) setError(controller.signal.aborted
        ? (controller.signal.reason instanceof Error ? controller.signal.reason.message : 'Request cancelled.')
        : cause instanceof Error ? cause.message : 'Request failed.');
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) { active.current = null; setLoading(false); }
    }
  };
  return <div className="mt-4">
    {example.method === 'POST' && <label className="block text-xs text-carbon-400 mb-3">Request JSON
      <textarea aria-label={`Request body for ${example.name}`} value={body} onChange={event => setBody(event.target.value)} disabled={loading}
        className="block w-full mt-2 p-3 bg-carbon-950 border border-carbon-700 rounded-lg font-mono text-xs text-carbon-200" rows={5} spellCheck={false} />
    </label>}
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-carbon-500 uppercase tracking-wider">Live Response {status !== null && `· HTTP ${status}`}</span>
      <div className="flex gap-2">
        {loading && <button type="button" onClick={() => active.current?.abort(new Error('Request cancelled.'))} className="text-xs text-carbon-300 hover:text-white">Cancel</button>}
        <button type="button" onClick={fetchData} disabled={loading} className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-zap-500/20 text-zap-400 rounded-full hover:bg-zap-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Play className="w-3 h-3" />{loading ? 'Loading...' : 'Try It'}
        </button>
      </div>
    </div>
    <div aria-live="polite" className="bg-carbon-950 rounded-lg p-3 font-mono text-xs overflow-auto max-h-64">
      {error && <p role="alert" className="text-rose-400 mb-2">{error}</p>}
      {response !== null ? <pre className="text-carbon-300">{response}</pre> : !error && <span className="text-carbon-500">{loading ? 'Waiting for the server...' : 'Click "Try It" to send a live request'}</span>}
    </div>
  </div>;
}

function ExampleCard({ example, index }: { example: ApiExample; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const colors = methodColors[example.method];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-carbon-900/50 border border-carbon-800 rounded-xl overflow-hidden hover:border-carbon-700 transition-colors"
    >
      {/* Header - fixed height for consistent card sizing */}
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`example-details-${example.id}`}
        className="p-5 cursor-pointer min-h-[140px] flex flex-col w-full text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-carbon-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <example.icon className="w-5 h-5 text-zap-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{example.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded ${colors.bg} ${colors.text}`}>
                  {example.method}
                </span>
                <code className="text-xs text-carbon-400 font-mono">{example.endpoint}</code>
              </div>
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-carbon-500 transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
        <p className="text-sm text-carbon-400 mt-auto">{example.description}</p>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key={`expanded-${example.id}`}
            id={`example-details-${example.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-carbon-800 overflow-hidden"
          >
            {/* Set ORIGIN to the deployment URL, for example http://localhost:3000. */}
            <div className="p-4 border-b border-carbon-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-carbon-500 uppercase tracking-wider">cURL · set ORIGIN to this site’s URL</span>
                <CopyButton text={example.curl} />
              </div>
              <code className="block bg-carbon-950 rounded-lg p-3 text-xs text-emerald-400 font-mono overflow-x-auto max-h-16">
                {example.curl}
              </code>
            </div>

            {/* Code snippet */}
            <div className="p-4 border-b border-carbon-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-carbon-500 uppercase tracking-wider">TypeScript Usage</span>
                <CopyButton text={example.codeSnippet} />
              </div>
              <pre className="bg-carbon-950 rounded-lg p-3 text-xs font-mono overflow-auto h-48">
                <code
                  className="text-carbon-300"
                  dangerouslySetInnerHTML={{
                    __html: tokensToHtml(highlightCode(example.codeSnippet, 'typescript'))
                  }}
                />
              </pre>
            </div>

            {/* Live response */}
            <div className="p-4">
              <LiveResponse example={example} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Examples({density='comfortable'}:{density?:'compact'|'comfortable'}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  const simpleExamples = examples.filter(e => e.category === 'simple');
  const complexExamples = examples.filter(e => e.category === 'complex');
  const advancedExamples = examples.filter(e => e.category === 'advanced');

  return (
    <section id="examples" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-sky-500/10 border border-sky-500/20 rounded-full">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-medium text-sky-400">API Examples</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white mb-6">
            See it in{' '}
            <span className="text-gradient">action</span>
          </h2>

          <p className="text-lg text-carbon-400 max-w-2xl mx-auto">
            Every endpoint below is live. Click "Try It" to fetch real data from this server.
          </p>
        </motion.div>

        {/* Simple Examples */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Simple Endpoints
            <span className="text-sm font-normal text-carbon-500">Runtime and recorded data</span>
          </h3>
          <div data-example-density={density} className={`grid md:grid-cols-2 lg:grid-cols-3 items-start ${density==='compact'?'gap-2':'gap-4'}`}>
            {simpleExamples.map((example, index) => (
              <ExampleCard key={example.id} example={example} index={index} />
            ))}
          </div>
        </div>

        {/* Complex Examples */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
            Application Endpoints
            <span className="text-sm font-normal text-carbon-500">JSON requests and pagination</span>
          </h3>
          <div data-example-density={density} className={`grid md:grid-cols-2 items-start ${density==='compact'?'gap-2':'gap-4'}`}>
            {complexExamples.map((example, index) => (
              <ExampleCard key={example.id} example={example} index={index} />
            ))}
          </div>
        </div>

        {/* Advanced Examples */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-zap-500 rounded-full"></span>
            Advanced Features
            <span className="text-sm font-normal text-carbon-500">Native Rust and HTTP streaming</span>
          </h3>
          <div data-example-density={density} className={`grid md:grid-cols-2 items-start ${density==='compact'?'gap-2':'gap-4'}`}>
            {advancedExamples.map((example, index) => (
              <ExampleCard key={example.id} example={example} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-carbon-400 mb-4">
            All these endpoints are defined in <code className="text-zap-400 font-mono">app/api/</code>
          </p>
          <a
            href="https://github.com/saint0x/zapjs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-carbon-400 hover:text-white transition-colors"
          >
            Explore the framework on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
