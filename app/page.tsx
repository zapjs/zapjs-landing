import { ApiPlayground } from './playground.client.tsx';
import { capabilities, codeExample, evidence } from './content';

const stats = [
  ['5', 'Verified routes'],
  ['1', 'Live server action'],
  ['19.3', 'React package path'],
  ['Rust', 'Runtime owner'],
];

export default function Page() {
  return <main>
    <section className="hero original-hero">
      <div>
        <div className="badge"><span className="dot" /> This website is a <span className="accent-text">ZapJS</span> project</div>
        <h1><span>Fullstack at the</span><br /><span className="accent">Speed of Rust</span></h1>
        <p className="lede"><span className="rust">Rust</span> server, <span className="react">React</span> frontend, one application graph. The framework now builds, checks, serves, hydrates and runs server actions through the Rust-owned ZapJS path.</p>
        <div className="stats hero-stats">{stats.map(([value, label]) => <div className="stat flat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <div className="actions"><a className="button primary" href="/docs#start">Get Started →</a><a className="button" href="#code">View Examples</a></div>
      </div>
    </section>

    <section id="features" className="section">
      <div className="section-center"><p className="pill">Features</p><h2>Ship faster, <span className="accent">run faster</span></h2><p className="section-lede center">The original product story is back, but every claim stays inside the implemented React-plus-Rust surface.</p></div>
      <div className="feature-grid">{capabilities.map(([title, description]) => <article className="feature-card" key={title}><div className="icon-box">⚡</div><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>

    <section id="code" className="section">
      <div className="section-center"><p className="pill green">Code Examples</p><h2>React to Rust, <span className="accent">through one graph</span></h2><p className="section-lede center">Pages, client references and server actions are discovered by ZapJS and packaged into one deployable artifact boundary.</p></div>
      <div className="editor-window"><div className="panel-head"><span /><span /><span /><strong>app/page.tsx + app/actions.ts</strong></div><pre>{codeExample}</pre></div>
    </section>

    <ApiPlayground />

    <section id="performance" className="section performance-grid">
      <article><p className="pill amber">Performance</p><h2>No benchmark theater.</h2><p className="section-lede">The site now presents ZapJS as production-ready only where the core repo has executable evidence: CLI checks, browser matrices, deterministic traces, hydration, navigation, route handlers and server actions.</p></article>
      <div className="evidence-list">{evidence.reports.map(([title, detail, path]) => <article className="card compact" key={title}><h3>{title}</h3><p>{detail}</p><code>{path}</code></article>)}</div>
    </section>

    <section id="get-started" className="section final-cta"><p className="pill">Get Started</p><h2>Build a ZapJS app with React and Rust.</h2><p className="section-lede center">This landing page is itself a ZapJS app: `app/` routes, server actions, a hydrated client reference and Zap CLI verification.</p><div className="actions"><a className="button primary" href="/docs#start">Read the docs</a><a className="button" href="/examples">Open examples</a></div></section>
  </main>;
}
