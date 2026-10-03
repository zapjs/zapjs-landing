'use client';

import { useMemo, useState } from 'react';

const examples = [
  {
    id: 'stats',
    name: 'Site Stats',
    method: 'ACTION',
    endpoint: '/_zap/action',
    category: 'simple',
    description: 'Returns the live ZapJS app shape reported by the current build.',
    payload: {},
    snippet: `const response = await actions.invokeAction(
  actions.actionId('actions', 'runExample'),
  [{ id: 'stats', payload: {} }]
);`,
  },
  {
    id: 'features',
    name: 'Features List',
    method: 'ACTION',
    endpoint: '/_zap/action',
    category: 'simple',
    description: 'Returns the framework capabilities shown on this page.',
    payload: {},
    snippet: `await runExample({ id: 'features', payload: {} });`,
  },
  {
    id: 'benchmarks',
    name: 'Evidence Policy',
    method: 'ACTION',
    endpoint: '/_zap/action',
    category: 'simple',
    description: 'Shows how ZapJS keeps performance claims tied to evidence.',
    payload: {},
    snippet: `await runExample({ id: 'benchmarks', payload: {} });`,
  },
  {
    id: 'users',
    name: 'Users Query',
    method: 'ACTION',
    endpoint: '/_zap/action',
    category: 'complex',
    description: 'Demonstrates structured records crossing the Rust action endpoint.',
    payload: { limit: 3 },
    snippet: `await runExample({ id: 'users', payload: { limit: 3 } });`,
  },
  {
    id: 'posts',
    name: 'Blog Posts',
    method: 'ACTION',
    endpoint: '/_zap/action',
    category: 'complex',
    description: 'Returns the same production articles linked by the ZapJS blog.',
    payload: { page: 1, limit: 3 },
    snippet: `await runExample({ id: 'posts', payload: { page: 1, limit: 3 } });`,
  },
  {
    id: 'subscribe',
    name: 'Newsletter',
    method: 'ACTION',
    endpoint: '/_zap/action',
    category: 'complex',
    description: 'Runs validation inside the server action and returns a typed JSON result.',
    payload: { email: 'reader@zapjs.dev' },
    snippet: `await runExample({ id: 'subscribe', payload: { email } });`,
  },
  {
    id: 'echo',
    name: 'Request Echo',
    method: 'ACTION',
    endpoint: '/_zap/action',
    category: 'advanced',
    description: 'Echoes a payload through the generated browser action proxy.',
    payload: { message: 'hello from ZapJS', source: 'browser' },
    snippet: `await runExample({ id: 'echo', payload: { message: 'hello' } });`,
  },
];

let actionProxy = null;

export function hydrate(context) {
  actionProxy = context && context.actions ? context.actions : null;
  window.__zapLandingActions = actionProxy;
}

export function ApiPlayground() {
  const [active, setActive] = useState('stats');
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const selected = examples.find((example) => example.id === active) || examples[0];
  const grouped = useMemo(() => ({
    simple: examples.filter((example) => example.category === 'simple'),
    complex: examples.filter((example) => example.category === 'complex'),
    advanced: examples.filter((example) => example.category === 'advanced'),
  }), []);

  async function run(example) {
    const proxy = actionProxy || window.__zapLandingActions;
    if (!proxy || typeof proxy.invokeAction !== 'function' || typeof proxy.actionId !== 'function') {
      setError('Zap action proxy has not hydrated yet.');
      return;
    }

    setError(null);
    setLoading(example.id);
    try {
      const response = await proxy.invokeAction(
        proxy.actionId('actions', 'runExample'),
        [{ id: example.id, payload: example.payload }],
        { throwOnError: false }
      );
      const text = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (_error) {
        parsed = { status: response.status, body: text };
      }
      setResponses((current) => ({ ...current, [example.id]: parsed }));
      setActive(example.id);
    } catch (caught) {
      setError(caught && caught.message ? caught.message : String(caught));
    } finally {
      setLoading(null);
    }
  }

  return <section id="examples" className="section examples-shell">
    <div className="section-center">
      <p className="pill sky">API Examples</p>
      <h2>See it in <span className="accent">action</span></h2>
      <p className="section-lede center">The original interactive route demo is back. Each Play button calls the real ZapJS server action endpoint through the generated browser action proxy.</p>
    </div>
    <div className="example-layout">
      <div className="example-groups">
        <ExampleGroup title="Simple Endpoints" note="Build and feature state" tone="green" examples={grouped.simple} active={active} loading={loading} onSelect={setActive} onRun={run} />
        <ExampleGroup title="Complex Endpoints" note="Structured JSON responses" tone="violet" examples={grouped.complex} active={active} loading={loading} onSelect={setActive} onRun={run} />
        <ExampleGroup title="Advanced Features" note="Browser to Rust action transport" tone="orange" examples={grouped.advanced} active={active} loading={loading} onSelect={setActive} onRun={run} />
      </div>
      <aside className="response-panel">
        <div className="panel-head"><span /><span /><span /><strong>{selected.endpoint}</strong></div>
        <p className="eyebrow">Live Response</p>
        {error ? <pre className="response error">{error}</pre> : <pre className="response">{JSON.stringify(responses[selected.id] || { hint: `Click Play on ${selected.name} to call the server action.` }, null, 2)}</pre>}
        <p className="eyebrow">Client Call</p>
        <pre className="response code-sample">{selected.snippet}</pre>
      </aside>
    </div>
  </section>;
}

function ExampleGroup({ title, note, tone, examples, active, loading, onSelect, onRun }) {
  return <div className="example-group">
    <h3><span className={`status-dot ${tone}`} />{title}<small>{note}</small></h3>
    <div className="example-grid">
      {examples.map((example) => <article className={`example-card ${active === example.id ? 'active' : ''}`} key={example.id} onClick={() => onSelect(example.id)}>
        <div className="example-card-head">
          <div><strong>{example.name}</strong><p><b>{example.method}</b> <code>{example.endpoint}</code></p></div>
          <button type="button" onClick={(event) => { event.stopPropagation(); onRun(example); }} disabled={loading === example.id}>{loading === example.id ? 'Running' : '▶ Play'}</button>
        </div>
        <p>{example.description}</p>
      </article>)}
    </div>
  </div>;
}
