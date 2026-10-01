import type { ReactNode } from 'react';
import '../src/index.css';
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><head>
    <meta charSet="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ZapJS — One React application, owned by Rust.</title>
    <meta name="description" content="A Rust-owned React framework foundation for Server Components, streaming, server actions, route handlers and managed deployment artifacts from one application graph." />
    <link rel="icon" type="image/svg+xml" href="/zap.svg" />
    <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=satoshi@400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />
  </head><body>{children}</body></html>;
}
