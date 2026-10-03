export function SiteNav() {
  return <header className="nav"><div className="nav-inner"><a className="brand" href="/"><span className="bolt">⚡</span><span>Zap<span className="accent">JS</span></span></a><nav className="links"><a href="/#features">Features</a><a href="/#evidence">Evidence</a><a href="/examples">Examples</a><a href="/docs">Docs</a><a href="/blog">Blog</a><a href="https://github.com/zapjs/zapjs">GitHub</a></nav><a className="cta" href="/docs#start">Get Started</a></div></header>;
}

export function SiteFooter() {
  return <footer className="footer">© 2026 ZapJS. React authoring. Rust-owned runtime. Evidence-backed claims.</footer>;
}

export function PageHero({ eyebrow, title, children }) {
  return <section className="section"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{children}</p></section>;
}
