'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import posts from '../../content/posts';
export default function BlogIndex(){
  return (
    <div className="min-h-screen bg-carbon-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-zap-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
          <p className="text-lg text-carbon-400 mb-12">
            Read the current ZapJS architecture notes, verification policy and Rust-owned React implementation status.
          </p>
        </motion.div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <a href={`/blog/${post.slug}`}>
                <div className="p-6 bg-carbon-900/50 border border-carbon-800 rounded-xl hover:border-zap-500/50 transition-all duration-300">
                  <div className="flex items-center gap-4 text-sm text-carbon-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.publishedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <span className="text-carbon-600">by {post.author}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-zap-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-carbon-400 mb-4">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-carbon-800 text-carbon-400 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="flex items-center gap-1 text-sm text-zap-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-carbon-400 hover:text-white transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
