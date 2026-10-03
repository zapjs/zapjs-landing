import { evidence } from '../content';
import { PageHero } from '../shared';

export default function ExamplesPage() {
  return <main><PageHero eyebrow="Examples" title="Executable evidence">These are not product screenshots. They are the reports and traces backing the implemented framework surface.</PageHero><section className="grid">{evidence.reports.map(([title, detail, path]) => <article className="card" key={title}><h3>{title}</h3><p>{detail}</p><p><code>{path}</code></p></article>)}</section><section className="section"><p className="eyebrow">Latest core evidence</p><h2>Commit {evidence.commit}</h2><p className="section-lede">Latest host-backed Fozzy trace: <code>{evidence.trace}</code></p></section></main>;
}
