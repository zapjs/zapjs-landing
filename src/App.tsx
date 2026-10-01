import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import BlogIndex from './components/blog/BlogIndex';
import BlogPost from './components/blog/BlogPost';
import posts from './content/posts';
import DocsPage from './pages/DocsPage';
import ExamplesPage from './pages/ExamplesPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Performance from './components/Performance';
import CodeDemo from './components/CodeDemo';
import Architecture from './components/Architecture';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';

function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-carbon-950 overflow-x-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-zap-500/10 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-rust-500/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-zap-600/5 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </motion.div>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />

      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Performance />
          <CodeDemo />
          <Architecture />
          <GetStarted />
        </main>
        <Footer />
      </div>

    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="min-h-screen grid place-content-center gap-6 text-center p-8 bg-carbon-950">
      <h1 className="text-4xl font-display font-bold text-white">Page not found</h1>
      <p className="text-carbon-400">This address does not belong to the ZapJS website.</p>
      <a className="text-zap-400 hover:text-zap-300 transition-colors" href="/">Back to ZapJS</a>
    </main>
  );
}

export default function App() {
  const path = typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/') return <Home />;
  if (path === '/docs') return <DocsPage />;
  if (path === '/examples') return <ExamplesPage />;
  if (path === '/blog') return <BlogIndex />;
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length);
    const post = posts.find(article => article.slug === slug);
    return post ? <BlogPost post={post} /> : <NotFoundPage />;
  }
  return <NotFoundPage />;
}
