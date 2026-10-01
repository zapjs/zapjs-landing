import type { ReactNode } from 'react';
import '../src/index.css';
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><head>
    <meta charSet="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ZapJS — One React application. Native Rust when you need it.</title>
    <meta name="description" content="A compiler-led React framework with Server Components, streaming, server actions and optional in-process Rust functions. Explore working examples built with ZapJS." />
    <link rel="icon" type="image/svg+xml" href="/zap.svg" />
    <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=satoshi@400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />
  </head><body>{children}</body></html>;
}
