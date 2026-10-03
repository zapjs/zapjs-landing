import { posts } from '../content';
import { PageHero } from '../shared';

export default function BlogPage() {
  return <main><PageHero eyebrow="Blog" title="Engineering notes">Short notes on the verified framework boundary.</PageHero><section>{posts.map(post => <article className="post-card" key={post.slug}><p className="eyebrow">{post.date}</p><h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2><p>{post.excerpt}</p></article>)}</section></main>;
}
