'use client';

import { useCallback, useEffect, useState } from 'react';
import DocsLayout from '../components/docs/DocsLayout';
import { docSections } from '../components/docs/DocsSections';

const aliases: Record<string, string> = { 'enhanced-rpc': 'native', 'native-rust': 'native', 'server-actions': 'server-functions' };
function sectionFromHash(hash: string): string {
  let id: string;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return 'introduction'; }
  id = aliases[id] ?? id;
  return docSections.some(section => section.id === id) ? id : 'introduction';
}
export default function DocsPage() {
  // The server and first browser render agree; URL state is read only after mount.
  const [currentSection, setCurrentSection] = useState('introduction');
  useEffect(() => {
    const synchronize = () => {
      setCurrentSection(sectionFromHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    synchronize();
    window.addEventListener('hashchange', synchronize);
    window.addEventListener('popstate', synchronize);
    return () => {
      window.removeEventListener('hashchange', synchronize);
      window.removeEventListener('popstate', synchronize);
    };
  }, []);
  const selectSection = useCallback((id: string) => {
    if (!docSections.some(section => section.id === id)) return;
    const url = new URL(window.location.href);
    url.hash = id;
    if (url.href !== window.location.href) window.history.pushState(window.history.state, '', url);
    setCurrentSection(id);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, []);
  return <DocsLayout sections={docSections} currentSection={currentSection} onSectionChange={selectSection} />;
}
