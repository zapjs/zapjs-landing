
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity, BookOpen, Code2, FileJson, ShieldCheck } from 'lucide-react';

const examples = [
  {
    id: 'manifest',
    name: 'Manifest-backed routing',
    label: 'zap-runtime',
    icon: FileJson,
    description: 'The runtime loads a Rust-owned application manifest, validates references and plans static assets, pages and route handlers before dispatch.',
    evidence: 'cargo +1.96.0 test -p zap-runtime',
    codeSnippet: `let outcome = admit_request_input(&manifest, &request, &limits)?;
if let AdmissionOutcome::Dispatch(target) = outcome {
  assert!(matches!(target, RequestTarget::Page { .. }
    | RequestTarget::RouteHandler { .. }
    | RequestTarget::StaticAsset(_)));
}`,
  },
  {
    id: 'actions',
    name: 'Action admission',
    label: 'zap-runtime',
    icon: ShieldCheck,
    description: 'Known server actions are admitted through Rust with method, origin, body-size, request-context, auth-state and deadline policy checks.',
    evidence: 'request::tests::execution_admission_enforces_context_policy_before_dispatch',
    codeSnippet: `let outcome = admit_action_execution(
  &manifest,
  &action_input,
  &limits,
  &context,
  &policy,
)?;

if let AdmissionOutcome::Dispatch(plan) = outcome {
  assert_eq!(plan.target.target.action.id, action_input.action_id);
}`,
  },
  {
    id: 'splice',
    name: 'Internal worker boundary',
    label: 'zap-splice',
    icon: Activity,
    description: 'Splice is bounded Rust-to-Rust infrastructure for framework-owned worker isolation. It is not exposed as a public backend or user-operated service.',
    evidence: 'cargo +1.96.0 test -p zap-splice',
    codeSnippet: `use bytes::Bytes;
use std::time::Duration;

let client = Client::connect(stream, Config::default()).await?;
let bytes = client.invoke("render", Bytes::from(payload), Duration::from_secs(1)).await?;`,
  },
  {
    id: 'fozzy',
    name: 'Deterministic evidence',
    label: 'fozzy',
    icon: BookOpen,
    description: 'Production claims require deterministic scenario checks and host-backed traces that can be verified, replayed and accepted by Fozzy CI.',
    evidence: 'fozzy trace verify artifacts/verification/rust-only-crates-host.trace.fozzy --strict-verify --json',
    codeSnippet: `fozzy run artifacts/verification/rust-only-crates-host.fozzy.json \
  --det --seed 42 \
  --proc-backend host --fs-backend host --http-backend host \
  --record artifacts/verification/rust-only-crates-host.trace.fozzy --json`,
  },
];

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
            <span className="text-sm font-medium text-sky-400">Verified examples</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            Evidence, <span className="text-gradient">not placeholders</span>
          </h2>
          <p className="text-lg text-carbon-400 max-w-3xl mx-auto">
            These examples describe the Rust contracts currently proved by the core repository. They avoid live endpoint demos until the full React vertical slice owns them end to end.
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
                      <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-emerald-500/10 text-emerald-400">
                        {example.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-carbon-400 mb-4">{example.description}</p>
              <div className="mb-4 p-3 bg-carbon-950/60 rounded-lg border border-carbon-800">
                <p className="mb-1 text-[11px] uppercase tracking-wider text-carbon-500">Evidence</p>
                <code className="text-xs text-carbon-300 font-mono break-all">{example.evidence}</code>
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
