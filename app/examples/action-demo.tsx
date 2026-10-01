'use client';
import { useActionState } from 'react';
import { savePreference } from './actions';

export default function ActionDemo({ initialPreference }: { initialPreference?: 'compact' | 'comfortable' }) {
  const [message, action, pending] = useActionState(savePreference, initialPreference ? `Your saved example preference is ${initialPreference}.` : 'No example preference saved yet.');
  return <section id="server-action" className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-24 scroll-mt-28">
    <div className="rounded-2xl border border-carbon-800 bg-carbon-900/50 p-6 sm:p-10">
      <p className="text-sm font-medium text-zap-400 mb-3">Live server action</p>
      <h2 className="font-display font-bold text-3xl text-white mb-4">A form that reaches the server.</h2>
      <p className="text-carbon-400 leading-relaxed mb-6">Save an example display preference in an HTTP-only cookie. The server validates the form and returns the confirmation below. Your selection changes the spacing between example cards and survives a reload.</p>
      <form action={action} className="space-y-4">
        <label htmlFor="example-preference" className="block text-sm font-medium text-carbon-200">Example preference</label>
        <select id="example-preference" name="preference" defaultValue={initialPreference ?? 'comfortable'} disabled={pending} className="w-full sm:w-64 rounded-lg border border-carbon-700 bg-carbon-950 px-4 py-3 text-carbon-200">
          <option value="comfortable">Comfortable</option><option value="compact">Compact</option>
        </select>
        <div><button type="submit" disabled={pending} className="px-5 py-3 rounded-full bg-zap-500 text-white font-semibold hover:bg-zap-400 transition-colors disabled:opacity-50">{pending ? 'Saving...' : 'Save preference'}</button></div>
        <output id="preference-result" aria-live="polite" className="block text-sm text-carbon-300">{message}</output>
      </form>
      <p className="mt-6 text-xs text-carbon-500">The cookie stores only your selection and expires after 30 days.</p>
    </div>
  </section>;
}
