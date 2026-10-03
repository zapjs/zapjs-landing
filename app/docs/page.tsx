import { docs } from '../content';
import { PageHero } from '../shared';

export default function DocsPage() {
  return <main><PageHero eyebrow="Docs" title="ZapJS docs">The public docs describe the implemented React-plus-Rust surface and its evidence boundary.</PageHero><div className="docs-grid"><aside className="side">{docs.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</aside><section>{docs.map(section => <article id={section.id} className="doc-card" key={section.id}><p className="eyebrow">{section.summary}</p><h2>{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</article>)}</section></div></main>;
}
