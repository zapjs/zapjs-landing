import { SiteFooter, SiteNav } from './shared';

export default function RootLayout({ children }) {
  return <html lang="en"><head><title>ZapJS — React plus Rust</title><meta name="description" content="ZapJS is a React-plus-Rust framework with Rust-owned build, runtime and deployment artifacts." /><style>{css}</style></head><body><SiteNav />{children}<SiteFooter /></body></html>;
}

const css = `
:root { color-scheme: dark; --bg:#080706; --panel:#12100d; --panel2:#1d1712; --line:rgba(255,255,255,.12); --text:#fff7ed; --muted:#a9a29a; --zap:#f97316; --rust:#ffb86b; --cyan:#38bdf8; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin:0; min-height:100vh; background: radial-gradient(circle at 20% 0%, rgba(249,115,22,.20), transparent 34rem), radial-gradient(circle at 80% 20%, rgba(56,189,248,.12), transparent 28rem), var(--bg); color:var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
a { color:inherit; text-decoration:none; }
.nav { position:sticky; top:0; z-index:20; backdrop-filter: blur(18px); background:rgba(8,7,6,.78); border-bottom:1px solid var(--line); }
.nav-inner { max-width:1180px; margin:0 auto; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
.brand { display:flex; align-items:center; gap:12px; font-weight:850; font-size:22px; letter-spacing:-.04em; }
.bolt { width:42px; height:42px; border-radius:13px; display:grid; place-items:center; background:linear-gradient(135deg,#ffb86b,#f97316 60%,#7c2d12); box-shadow:0 14px 42px rgba(249,115,22,.32); }
.links { display:flex; align-items:center; gap:24px; color:var(--muted); font-size:15px; }
.links a:hover { color:var(--text); }
.cta { border:1px solid rgba(249,115,22,.55); background:linear-gradient(135deg,#fb923c,#ea580c); color:white; padding:10px 16px; border-radius:999px; font-weight:750; box-shadow:0 14px 34px rgba(249,115,22,.24); }
main { max-width:1180px; margin:0 auto; padding:72px 24px; }
.hero { min-height:68vh; display:grid; align-items:center; text-align:center; }
.badge { display:inline-flex; align-items:center; gap:10px; margin:0 auto 24px; padding:10px 16px; border:1px solid var(--line); border-radius:999px; color:var(--muted); background:rgba(255,255,255,.05); }
.dot { width:10px; height:10px; border-radius:50%; background:#10b981; box-shadow:0 0 22px #10b981; }
h1 { margin:0; font-size:clamp(58px,10vw,136px); line-height:.9; letter-spacing:-.085em; }
.accent { color:transparent; background:linear-gradient(135deg,#ffedd5,#f97316 55%,#c2410c); -webkit-background-clip:text; background-clip:text; }
.lede { max-width:850px; margin:28px auto 0; color:var(--muted); font-size:clamp(20px,3vw,30px); line-height:1.35; letter-spacing:-.035em; }
.actions { margin-top:34px; display:flex; justify-content:center; gap:14px; flex-wrap:wrap; }
.button { padding:15px 22px; border-radius:18px; border:1px solid var(--line); background:rgba(255,255,255,.06); color:var(--text); font-weight:780; }
.button.primary { border-color:rgba(249,115,22,.7); background:linear-gradient(135deg,#fb923c,#ea580c); }
.stats { margin-top:54px; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
.stat, .card, .doc-card, .post-card { border:1px solid var(--line); border-radius:26px; background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.035)); box-shadow:0 22px 70px rgba(0,0,0,.28); }
.stat { padding:24px; }
.stat strong { display:block; font-size:34px; letter-spacing:-.05em; }
.stat span { color:var(--muted); font-size:14px; }
.section { padding:74px 0 12px; }
.eyebrow { color:var(--zap); font-weight:850; letter-spacing:.14em; text-transform:uppercase; font-size:12px; }
h2 { margin:10px 0 18px; font-size:clamp(34px,6vw,70px); line-height:.95; letter-spacing:-.07em; }
.section-lede { color:var(--muted); max-width:760px; font-size:20px; line-height:1.55; }
.grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-top:30px; }
.card { padding:26px; }
.card h3 { margin:0 0 12px; font-size:22px; letter-spacing:-.04em; }
.card p, .doc-card p, .post-card p, li { color:var(--muted); line-height:1.6; }
.code { margin-top:30px; border:1px solid var(--line); border-radius:28px; overflow:hidden; background:#090807; text-align:left; }
.code-head { padding:14px 18px; border-bottom:1px solid var(--line); color:var(--muted); font-size:13px; display:flex; gap:8px; }
.code-head i { width:10px; height:10px; border-radius:50%; background:#f97316; display:block; }
pre { margin:0; padding:24px; overflow:auto; color:#fed7aa; font-size:14px; line-height:1.65; }
.docs-grid { display:grid; grid-template-columns:280px 1fr; gap:26px; align-items:start; }
.side { position:sticky; top:92px; border:1px solid var(--line); border-radius:24px; padding:18px; background:rgba(255,255,255,.045); }
.side a { display:block; color:var(--muted); padding:10px 12px; border-radius:14px; }
.side a:hover { color:var(--text); background:rgba(255,255,255,.06); }
.doc-card, .post-card { padding:28px; margin-bottom:18px; }
.doc-card h2, .post-card h2 { font-size:36px; }
.footer { border-top:1px solid var(--line); color:var(--muted); padding:30px 24px; text-align:center; }
@media (max-width: 860px) { .links { display:none; } .stats, .grid, .docs-grid { grid-template-columns:1fr; } main { padding-top:44px; } .side { position:relative; top:0; } }
`;
