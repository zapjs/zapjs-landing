'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity, BookOpen, Code2, Database, FileJson } from 'lucide-react';

const examples = [
  {
    id: 'features',
    name: 'Feature Manifest',
    endpoint: '/api/features',
    method: 'GET',
    icon: Database,
    description: 'Return the documented ZapJS capability list from authored content.',
    curl: 'curl "$ORIGIN/api/features"',
    codeSnippet: `export function GET() {
  return Response.json({ features, count: features.length, target: 'rust-react' });
}`,
  },
  {
    id: 'posts',
    name: 'Article Index',
    endpoint: '/api/posts',
    method: 'GET',
    icon: BookOpen,
    description: 'Serve authored articles with filtering and pagination.',
    curl: 'curl "$ORIGIN/api/posts?tag=architecture"',
    codeSnippet: `export function GET(request: Request) {
  const tag = new URL(request.url).searchParams.get('tag');
  const filtered = tag ? posts.filter(post => post.tags.includes(tag)) : posts;
  return Response.json({ posts: filtered });
}`,
  },
  {
    id: 'echo',
    name: 'JSON Route Handler',
    endpoint: '/api/echo',
    method: 'POST',
    icon: FileJson,
    description: 'Handle JSON with Web Request and Response primitives.',
    curl: 'curl -X POST "$ORIGIN/api/echo" -H "content-type: application/json" -d \'{"hello":"zap"}\'',
    codeSnippet: `export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ body, receivedAt: new Date().toISOString() });
}`,
  },
  {
    id: 'stream',
    name: 'Streaming Response',
    endpoint: '/api/stream',
    method: 'GET',
    icon: Activity,
    description: 'Stream response chunks through the framework boundary.',
    curl: 'curl -N "$ORIGIN/api/stream"',
    codeSnippet: `export function GET() {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('ready\\n'));
      controller.close();
    },
  });
  return new Response(stream);
}`,
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-400',
  POST: 'bg-sky-500/10 text-sky-400',
};

export default function Examples() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="examples" className="relative py-24 sm:py-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-sky-500/10 border border-sky-500/20 rounded-full">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-medium text-sky-400">Examples</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            Web primitives, <span className="text-gradient">framework owned</span>
          </h2>
          <p className="text-lg text-carbon-400 max-w-3xl mx-auto">
            The public examples describe the React and Web API shapes ZapJS will run through its Rust runtime. They avoid unsupported runtime claims.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {examples.map((example, index) => (
            <motion.article
              key={example.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="p-6 bg-carbon-900/60 border border-carbon-800 rounded-2xl"
            >
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-carbon-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <example.icon className="w-5 h-5 text-zap-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{example.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded ${methodColors[example.method]}`}>
                        {example.method}
                      </span>
                      <code className="text-xs text-carbon-400 font-mono">{example.endpoint}</code>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-carbon-400 mb-4">{example.description}</p>
              <div className="mb-4 p-3 bg-carbon-950/60 rounded-lg border border-carbon-800">
                <code className="text-xs text-carbon-300 font-mono break-all">{example.curl}</code>
              </div>
              <pre className="p-4 bg-carbon-950/60 rounded-lg border border-carbon-800 overflow-x-auto text-xs leading-relaxed text-carbon-300">
                <code>{example.codeSnippet}</code>
              </pre>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
