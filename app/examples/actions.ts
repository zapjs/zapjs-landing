'use server';
import { cookies, request } from '@zap-js/client/server';

export async function savePreference(_previous: string, form: FormData): Promise<string> {
  const preference = form.get('preference');
  if (preference !== 'comfortable' && preference !== 'compact') {
    return 'Choose either Comfortable or Compact before saving.';
  }
  cookies().set('zap-example-preference', preference, {
    httpOnly: true,
    secure: new URL(request().url).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return `Saved ${preference} as your example preference for 30 days.`;
}
