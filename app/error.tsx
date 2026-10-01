'use client';
import { Link } from '@zap-js/client';
export default function ErrorPage({reset}:{reset:()=>void}) {return <main className="min-h-screen grid place-content-center gap-6 text-center p-8"><h1 className="text-3xl">Unable to load this page</h1><button className="text-zap-400" onClick={reset}>Try again</button><Link href="/">Back home</Link></main>;}
