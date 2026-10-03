import { ApiPlayground } from '../playground.client.tsx';
import { evidence } from '../content';
import { PageHero } from '../shared';

export default function ExamplesPage() {
  return <main><PageHero eyebrow="Examples" title="Interactive ZapJS examples">Click Play to call the live ZapJS server action endpoint through the generated browser action proxy.</PageHero><ApiPlayground /><section className="section"><p className="eyebrow">Latest core evidence</p><h2>Commit {evidence.commit}</h2><p className="section-lede">Latest host-backed Fozzy trace: <code>{evidence.trace}</code></p></section></main>;
}
