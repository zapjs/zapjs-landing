import { SiteFooter, SiteNav } from './shared';

export default function RootLayout({ children }) {
  return <html lang="en"><head><title>ZapJS — React plus Rust</title><meta name="description" content="ZapJS is a React-plus-Rust framework with Rust-owned build, runtime and deployment artifacts." /><style>{css}</style></head><body><SiteNav />{children}<SiteFooter /></body></html>;
}

const css = `
:root { color-scheme: dark; --bg:#050505; --carbon:#0d0d0e; --panel:#111113; --panel2:#18181b; --line:rgba(255,255,255,.10); --line-strong:rgba(255,255,255,.18); --text:#fff7ed; --muted:#a3a3a3; --dim:#696969; --zap:#f97316; --zap2:#fb923c; --rust:#ffb86b; --sky:#38bdf8; --green:#34d399; --violet:#a78bfa; --amber:#f59e0b; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--bg); }
body { margin:0; min-height:100vh; color:var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at 50% -10%, rgba(249,115,22,.30), transparent 34rem), radial-gradient(circle at 15% 10%, rgba(56,189,248,.10), transparent 26rem), linear-gradient(180deg,#050505,#080706 52%,#050505); }
body:before { content:""; position:fixed; inset:0; pointer-events:none; opacity:.34; background-image: linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px); background-size: 86px 86px; mask-image: linear-gradient(to bottom, black, transparent 88%); }
a { color:inherit; text-decoration:none; }
code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
.nav { position:sticky; top:0; z-index:20; backdrop-filter: blur(22px); background:rgba(5,5,5,.74); border-bottom:1px solid var(--line); }
.nav-inner { max-width:1240px; margin:0 auto; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
.brand { display:flex; align-items:center; gap:12px; font-weight:900; font-size:24px; letter-spacing:-.05em; }
.bolt { width:46px; height:46px; border-radius:15px; display:grid; place-items:center; background:linear-gradient(135deg,#ffb86b,#f97316 55%,#8a2c0b); box-shadow:0 16px 48px rgba(249,115,22,.36); }
.links { display:flex; align-items:center; gap:26px; color:var(--muted); font-size:15px; font-weight:650; }
.links a:hover { color:var(--text); }
.cta { border:1px solid rgba(249,115,22,.60); background:linear-gradient(135deg,#fb923c,#ea580c); color:white; padding:12px 18px; border-radius:999px; font-weight:850; box-shadow:0 14px 34px rgba(249,115,22,.28); }
main { max-width:1240px; margin:0 auto; padding:0 24px 84px; position:relative; z-index:1; }
.hero { min-height:82vh; display:grid; align-items:center; text-align:center; padding:86px 0 50px; }
.original-hero h1 { font-size:clamp(54px,9vw,122px); line-height:.92; letter-spacing:-.085em; }
h1 { margin:0; font-size:clamp(52px,9vw,118px); line-height:.9; letter-spacing:-.08em; }
h2 { margin:12px 0 18px; font-size:clamp(36px,6vw,72px); line-height:.95; letter-spacing:-.075em; }
h3 { margin:0; letter-spacing:-.035em; }
.badge { display:inline-flex; align-items:center; gap:10px; margin:0 auto 28px; padding:11px 17px; border:1px solid var(--line-strong); border-radius:999px; color:var(--muted); background:rgba(255,255,255,.07); box-shadow: inset 0 1px rgba(255,255,255,.10); }
.dot { width:10px; height:10px; border-radius:50%; background:#10b981; box-shadow:0 0 22px #10b981; }
.accent, .accent-text { color:transparent; background:linear-gradient(135deg,#ffedd5,#fb923c 42%,#f97316 68%,#c2410c); -webkit-background-clip:text; background-clip:text; }
.rust { color:var(--rust); font-weight:850; } .react { color:var(--sky); font-weight:850; }
.lede { max-width:900px; margin:28px auto 0; color:var(--muted); font-size:clamp(20px,2.6vw,30px); line-height:1.38; letter-spacing:-.035em; }
.section-lede { color:var(--muted); max-width:800px; font-size:20px; line-height:1.58; }
.section-lede.center { margin-left:auto; margin-right:auto; }
.actions { margin-top:36px; display:flex; justify-content:center; gap:14px; flex-wrap:wrap; }
.button { display:inline-flex; align-items:center; justify-content:center; min-height:52px; padding:15px 24px; border-radius:999px; border:1px solid var(--line-strong); background:rgba(255,255,255,.075); color:var(--text); font-weight:850; box-shadow:0 18px 42px rgba(0,0,0,.24); }
.button.primary { border-color:rgba(249,115,22,.7); background:linear-gradient(135deg,#fb923c,#ea580c); box-shadow:0 18px 44px rgba(249,115,22,.30); }
.stats { margin-top:52px; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
.stat, .card, .doc-card, .post-card, .feature-card, .example-card, .response-panel, .editor-window { border:1px solid var(--line); border-radius:26px; background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035)); box-shadow:0 22px 70px rgba(0,0,0,.28); }
.stat { padding:24px; } .stat.flat { background:transparent; border:0; box-shadow:none; }
.stat strong { display:block; font-size:38px; letter-spacing:-.06em; }
.stat span { color:var(--muted); font-size:14px; }
.section { padding:96px 0 16px; }
.section-center { text-align:center; margin-bottom:44px; }
.eyebrow, .pill { color:var(--zap); font-weight:900; letter-spacing:.14em; text-transform:uppercase; font-size:12px; }
.pill { display:inline-flex; align-items:center; justify-content:center; padding:9px 14px; border-radius:999px; background:rgba(249,115,22,.10); border:1px solid rgba(249,115,22,.24); margin:0 0 12px; }
.pill.sky { color:var(--sky); background:rgba(56,189,248,.10); border-color:rgba(56,189,248,.24); }
.pill.green { color:var(--green); background:rgba(52,211,153,.10); border-color:rgba(52,211,153,.24); }
.pill.amber { color:var(--amber); background:rgba(245,158,11,.10); border-color:rgba(245,158,11,.24); }
.grid, .feature-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-top:30px; }
.feature-card, .card { padding:28px; }
.feature-card { transition: border-color .2s ease, transform .2s ease; }
.feature-card:hover { border-color:rgba(249,115,22,.35); transform:translateY(-2px); }
.icon-box { width:46px; height:46px; display:grid; place-items:center; border-radius:14px; background:rgba(249,115,22,.12); border:1px solid rgba(249,115,22,.22); margin-bottom:18px; }
.feature-card h3, .card h3 { font-size:22px; margin-bottom:12px; }
.feature-card p, .card p, .doc-card p, .post-card p, li { color:var(--muted); line-height:1.6; }
.editor-window, .code { margin-top:30px; overflow:hidden; background:#070707; text-align:left; }
.panel-head, .code-head { padding:14px 18px; border-bottom:1px solid var(--line); color:var(--muted); font-size:13px; display:flex; align-items:center; gap:8px; }
.panel-head span, .code-head i { width:11px; height:11px; border-radius:50%; background:#ef4444; display:block; }
.panel-head span:nth-child(2), .code-head i:nth-child(2) { background:#f59e0b; } .panel-head span:nth-child(3), .code-head i:nth-child(3) { background:#22c55e; }
.panel-head strong { margin-left:auto; font-weight:700; color:#d4d4d4; }
pre { margin:0; padding:24px; overflow:auto; color:#fed7aa; font-size:14px; line-height:1.65; white-space:pre-wrap; }
.examples-shell { padding-top:106px; }
.example-layout { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(340px,.7fr); gap:18px; align-items:start; }
.example-group { margin-bottom:28px; }
.example-group h3 { display:flex; align-items:center; gap:10px; color:white; margin-bottom:12px; }
.example-group h3 small { color:var(--dim); font-size:14px; font-weight:500; letter-spacing:0; margin-left:4px; }
.status-dot { width:9px; height:9px; border-radius:999px; display:inline-block; background:var(--zap); box-shadow:0 0 18px currentColor; } .status-dot.green { background:var(--green); } .status-dot.violet { background:var(--violet); } .status-dot.orange { background:var(--zap); }
.example-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
.example-card { padding:18px; cursor:pointer; transition:border-color .2s ease, transform .2s ease, background .2s ease; }
.example-card:hover, .example-card.active { border-color:rgba(249,115,22,.40); background:linear-gradient(180deg,rgba(249,115,22,.10),rgba(255,255,255,.035)); }
.example-card:hover { transform:translateY(-2px); }
.example-card-head { display:flex; gap:14px; justify-content:space-between; align-items:flex-start; }
.example-card strong { font-size:17px; }
.example-card p { color:var(--muted); line-height:1.55; font-size:14px; }
.example-card b { color:var(--green); font-size:11px; margin-right:6px; }
.example-card code { color:#d4d4d4; font-size:12px; }
.example-card button { border:1px solid rgba(249,115,22,.30); color:#fed7aa; background:rgba(249,115,22,.16); border-radius:999px; padding:7px 10px; font-weight:850; cursor:pointer; white-space:nowrap; }
.example-card button:disabled { opacity:.55; cursor:wait; }
.response-panel { position:sticky; top:100px; overflow:hidden; }
.response-panel .eyebrow { display:block; margin:18px 22px 8px; }
.response { margin:0 18px 18px; border-radius:18px; background:#050505; border:1px solid rgba(255,255,255,.08); color:#d6d3d1; max-height:330px; }
.response.error { color:#fda4af; }
.code-sample { color:#bfdbfe; max-height:190px; }
.performance-grid { display:grid; grid-template-columns:.9fr 1.1fr; gap:24px; align-items:start; }
.evidence-list { display:grid; gap:14px; }
.card.compact { padding:22px; }
.card.compact code { color:#fed7aa; font-size:12px; }
.final-cta { text-align:center; padding-bottom:70px; }
.docs-grid { display:grid; grid-template-columns:280px 1fr; gap:26px; align-items:start; }
.side { position:sticky; top:92px; border:1px solid var(--line); border-radius:24px; padding:18px; background:rgba(255,255,255,.045); }
.side a { display:block; color:var(--muted); padding:10px 12px; border-radius:14px; }
.side a:hover { color:var(--text); background:rgba(255,255,255,.06); }
.doc-card, .post-card { padding:28px; margin-bottom:18px; }
.doc-card h2, .post-card h2 { font-size:36px; }
.footer { border-top:1px solid var(--line); color:var(--muted); padding:32px 24px; text-align:center; position:relative; z-index:1; }
@media (max-width: 980px) { .links { display:none; } .stats, .grid, .feature-grid, .example-layout, .performance-grid, .docs-grid { grid-template-columns:1fr; } .response-panel, .side { position:relative; top:0; } }
@media (max-width: 680px) { .nav-inner { padding:14px 16px; } main { padding-left:16px; padding-right:16px; } .example-grid { grid-template-columns:1fr; } .cta { display:none; } }
`;
