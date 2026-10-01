
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Book, Layers, Zap, Workflow, Cpu, FileCode2, Rocket, Check, Copy, Terminal } from 'lucide-react';
import { cn, highlightCode, tokensToHtml } from '../../lib/utils';
import { documentation, type DocumentationBlock } from '../../content/docs';
import type { DocSection } from './DocsLayout';

function CodeBlock({ block }: { block: Extract<DocumentationBlock, { type: 'code' }> }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(block.code);
      setStatus('copied');
    } catch { setStatus('failed'); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2500);
  }
  const highlighted = block.language === 'typescript' || block.language === 'rust'
    ? tokensToHtml(highlightCode(block.code, block.language)) : undefined;
  return <div className="relative group my-6 rounded-xl overflow-hidden bg-carbon-900/50 border border-carbon-800/50">
    <div className="flex items-center justify-between gap-3 px-4 py-2 bg-carbon-900/80 border-b border-carbon-800/50">
      <span className="text-xs font-mono text-carbon-400">{block.filename ?? (block.language === 'shell' ? 'Terminal' : 'Example')}</span>
      <span className="text-xs text-carbon-500 uppercase">{block.language}</span>
    </div>
    <div className="relative">
      <pre className="p-4 pr-14 overflow-x-auto text-sm leading-relaxed text-carbon-300">
        {highlighted ? <code dangerouslySetInnerHTML={{ __html: highlighted }} /> : <code>{block.code}</code>}
      </pre>
      <button onClick={copy} type="button" aria-label={status === 'copied' ? 'Code copied' : 'Copy code'}
        className={cn('absolute top-3 right-3 p-2 rounded-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-zap-400', status === 'copied' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-carbon-800/80 text-carbon-400 hover:text-white')}>
        {status === 'copied' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
    <span aria-live="polite" className={status === 'failed' ? 'block px-4 pb-3 text-xs text-amber-300' : 'sr-only'}>
      {status === 'copied' ? 'Copied to clipboard.' : status === 'failed' ? 'Clipboard unavailable. Select the code and copy it manually.' : ''}
    </span>
  </div>;
}
function Block({ block }: { block: DocumentationBlock }) {
  if (block.type === 'code') return <CodeBlock block={block} />;
  if (block.type === 'heading') return <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-12 mb-4">{block.text}</h2>;
  if (block.type === 'paragraph') return <p className="text-carbon-300 leading-relaxed mb-4">{block.text}</p>;
  if (block.type === 'callout') return <aside className="p-4 rounded-xl border mb-6 bg-sky-500/10 border-sky-500/30 text-sky-300 leading-relaxed">{block.text}</aside>;
  return <ul className="space-y-2 mb-6">{block.items.map(item => <li key={item} className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-zap-400 flex-shrink-0" /><span className="text-carbon-300 leading-relaxed">{item}</span></li>)}</ul>;
}
const icons: Record<string, DocSection['icon']> = {
  introduction: Book, 'quick-start': Terminal, 'project-structure': FileCode2, architecture: Layers,
  status: FileCode2, runtime: Workflow, splice: Cpu, verification: Check,
  performance: Zap, deployment: Rocket,
};
function sectionContent(title: string, summary: string, blocks: DocumentationBlock[]): ReactElement {
  return <article>
    <p className="text-xs font-semibold uppercase tracking-wider text-zap-400 mb-4">ZapJS · Rust-owned implementation</p>
    <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">{title}</h1>
    <p className="text-xl text-carbon-400 leading-relaxed mb-8">{summary}</p>
    {blocks.map((block, index) => <Block key={index} block={block} />)}
  </article>;
}
export const docSections: DocSection[] = documentation.map(section => ({
  id: section.id,
  title: section.title,
  summary: section.summary,
  icon: icons[section.id] ?? Book,
  searchText: [section.title, section.summary, ...section.blocks.map(block => block.type === 'code' ? block.code : block.type === 'list' ? block.items.join(' ') : block.text)].join(' '),
  content: sectionContent(section.title, section.summary, section.blocks),
}));
