"use server";

import { cookies } from 'next/headers';
import type { Language } from './language-server';

export function setLanguageCookie(language: Language) {
  const cookieStore = cookies();
  // RequestCookies in Next has a .set method
  (cookieStore as any).set('moroCompase-language', language, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}
