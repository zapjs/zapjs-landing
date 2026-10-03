import { posts } from '../../content';

export default function BlogPost({ params }) {
  const post = posts.find(item => item.slug === params.slug);
  if (!post) return <main><section className="section"><p className="eyebrow">404</p><h1>Post not found</h1><p className="lede">This ZapJS article does not exist.</p></section></main>;
  return <main><article className="section"><p className="eyebrow">{post.date}</p><h1>{post.title}</h1><p className="lede">{post.excerpt}</p>{post.paragraphs.map(text => <p className="section-lede" key={text}>{text}</p>)}</article></main>;
}
