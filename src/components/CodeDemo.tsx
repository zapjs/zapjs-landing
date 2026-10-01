'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Code2, FileCode, Server, Sparkles, Copy, Check } from 'lucide-react';
import { highlightCode, tokensToHtml } from '../lib/utils';

const codeExamples = [
  {
    id: 'client', label: 'Client Component', icon: Code2,
    filename: 'app/calculator.tsx', language: 'typescript',
    code: `'use client';
import { useActionState } from 'react';
import { calculate } from './actions';

export default function Calculator() {
  const [state, action, pending] = useActionState(calculate, null);
  return (
    <form action={action}>
      <label>Numbers <input name="values" defaultValue="20,22" /></label>
      <button disabled={pending}>Calculate</button>
      <p role="status">
        {pending ? 'Calculating…' : state &&
          ('sum' in state ? state.sum : state.error)}
      </p>
    </form>
  );
}`,
  },
  {
    id: 'action', label: 'Server Action', icon: Server,
    filename: 'app/actions.ts', language: 'typescript',
    code: `'use server';
import { sumNumbers } from 'zap:native';

type State = { sum: number } | { error: string } | null;

export async function calculate(_previous: State, form: FormData): Promise<State> {
  const raw = String(form.get('values') ?? '');
  const values = raw.split(',').map(Number);
  if (raw.split(',').some(value => !value.trim()) || values.some(value =>
    !Number.isInteger(value) || value < 0 || value > 0xffffffff
  ) || values.reduce((sum, value) => sum + value, 0) > 0xffffffff) {
    return { error: 'Enter unsigned 32-bit integers whose sum fits that range.' };
  }
  return { sum: await sumNumbers(values) };
}`,
  },
  {
    id: 'rust', label: 'Native Function', icon: FileCode,
    filename: 'native/src/lib.rs', language: 'rust',
    code: `use napi_derive::napi;

#[napi(strict)]
pub async fn sum_numbers(values: Vec<f64>) -> napi::Result<u32> {
    if values.iter().any(|n| !n.is_finite() || n.fract() != 0.0
        || *n < 0.0 || *n > u32::MAX as f64) {
        return Err(napi::Error::from_reason("Expected unsigned 32-bit integers"));
    }
    let result = zap_native::compute(move |token| {
        let mut sum = 0u32;
        for value in values {
            token.check()?;
            let Some(next) = sum.checked_add(value as u32) else {
                return Ok(None);
            };
            sum = next;
        }
        Ok(Some(sum))
    }).await.map_err(|error| napi::Error::from_reason(error.to_string()))?;
    result.ok_or_else(|| napi::Error::from_reason("Sum exceeds unsigned 32-bit range"))
}`,
  },
  {
    id: 'generated', label: 'Typed Server Import', icon: Sparkles,
    filename: 'app/page.tsx', language: 'typescript',
    code: `import { sumNumbers } from 'zap:native';
import Calculator from './calculator';

// The native build generates sumNumbers(values: number[]): Promise<number>.
// Native imports are available only to server modules.
export default async function Page() {
  const sum = await sumNumbers([20, 22]);
  return (
    <main>
      <h1>Computed in Rust: {sum}</h1>
      <Calculator />
    </main>
  );
}`,
  },
];

const stepColors: Record<string, { background: string; text: string }> = {
  rust: { background: 'bg-rust-500/20 border-rust-500/30', text: 'text-rust-400' },
  zap: { background: 'bg-zap-500/20 border-zap-500/30', text: 'text-zap-400' },
  sky: { background: 'bg-sky-500/20 border-sky-500/30', text: 'text-sky-400' },
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  };

  const lang = language === 'rust' ? 'rust' : 'typescript';
  const highlighted = tokensToHtml(highlightCode(code, lang));

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        aria-label="Copy code example"
        className="absolute top-3 right-3 p-2 bg-carbon-800 hover:bg-carbon-700 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity z-10"
      >
        {copyStatus === 'copied' ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Copy className="w-4 h-4 text-carbon-400" />
        )}
      </button>
      <p role="status" className="px-4 pt-3 text-xs text-carbon-400">{copyStatus === 'copied' ? 'Code copied.' : copyStatus === 'error' ? 'Clipboard unavailable. Select the code to copy it.' : 'Illustrative files for a project created with --native.'}</p>
      <pre className="overflow-x-auto p-4 sm:p-6 text-sm leading-relaxed">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

export default function CodeDemo() {
  const [activeTab, setActiveTab] = useState('client');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const activeExample = codeExamples.find(e => e.id === activeTab)!;

  return (
    <section id="code" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Code Examples</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            Server to native,{' '}
            <span className="text-gradient">with types</span>
          </h2>

          <p className="text-lg text-carbon-400 max-w-3xl mx-auto">
            A client component calls a server action. The action imports a typed Rust function inside the managed Node process.
          </p>
        </motion.div>

        {/* Code editor mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-zap-500/20 via-violet-500/20 to-sky-500/20 rounded-3xl blur-2xl opacity-50" />

          {/* Editor window */}
          <div className="relative bg-carbon-900/80 backdrop-blur-xl border border-carbon-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Window controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-carbon-900/50 border-b border-carbon-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-carbon-800 rounded-lg">
                <activeExample.icon className="w-4 h-4 text-carbon-400" />
                <span className="text-sm text-carbon-400 font-mono">{activeExample.filename}</span>
              </div>
              <div className="w-20" />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-carbon-800 overflow-x-auto">
              {codeExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => setActiveTab(example.id)}
                  aria-pressed={activeTab === example.id}
                  aria-label={example.label}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === example.id
                      ? 'text-white bg-carbon-800/50 border-b-2 border-zap-500'
                      : 'text-carbon-500 hover:text-carbon-300 hover:bg-carbon-800/30'
                  }`}
                >
                  <example.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{example.label}</span>
                </button>
              ))}
            </div>

            {/* Code content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CodeBlock code={activeExample.code} language={activeExample.language} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Flow explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              step: '1',
              title: 'Write Rust',
              description: 'Export napi-rs functions in native/. Use bounded compute for CPU work.',
              color: 'rust',
            },
            {
              step: '2',
              title: 'Types Generated',
              description: 'Build the native library. Its declarations describe zap:native imports.',
              color: 'zap',
            },
            {
              step: '3',
              title: 'Call on the Server',
              description: 'Import from server components, actions or Web route handlers.',
              color: 'sky',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative p-6 bg-carbon-900/30 border border-carbon-800/50 rounded-xl"
            >
              <div className={`absolute -top-3 -left-3 w-8 h-8 border rounded-lg flex items-center justify-center ${stepColors[item.color].background}`}>
                <span className={`text-sm font-bold ${stepColors[item.color].text}`}>{item.step}</span>
              </div>
              <h3 className="font-semibold text-white mb-2 mt-2">{item.title}</h3>
              <p className="text-sm text-carbon-400">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
