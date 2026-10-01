import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import posts from '../../content/posts';
export default function BlogPost({post}:{post:typeof posts[number]}){
 const relatedPosts=posts.filter(value=>value.id!==post.id);
  return (
    <div className="min-h-screen bg-carbon-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-zap-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <article className="relative z-10 max-w-3xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back link */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-carbon-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </a>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-carbon-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>

            <p className="text-lg text-carbon-400 mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-4">
              <span className="text-carbon-400">By {post.author}</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-zap-500/10 text-zap-400 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-zap max-w-none">
            {post.paragraphs.map((paragraph, index) => <p key={index} className="text-carbon-300 leading-relaxed mb-6">{paragraph}</p>)}
          </div>

          <aside aria-label="Article references" className="mt-8 text-sm text-carbon-400">
            <p className="mb-3">References and working examples</p>
            <ul className="space-y-2">{post.sources.map(source => <li key={source.href}><a href={source.href} className="text-zap-400 hover:underline">{source.label}</a></li>)}</ul>
            <p className="mt-4 text-xs text-carbon-500">Reading time is an estimate at 200 words per minute.</p>
          </aside>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-carbon-800">
              <h2 className="text-xl font-semibold text-white mb-6">Related Posts</h2>
              <div className="grid gap-4">
                {relatedPosts.map((related) => (
                  <a
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="block p-4 bg-carbon-900/50 border border-carbon-800 rounded-lg hover:border-zap-500/50 transition-all duration-300"
                  >
                    <h3 className="text-white font-medium mb-1 hover:text-zap-400 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-carbon-400">{related.excerpt}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </article>
    </div>
  );
}
