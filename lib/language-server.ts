// lib/language-server.ts
import { NextRequest } from 'next/server';

export type Language = 'en' | 'fr' | 'ar' | 'es';

// Supported languages with their codes and names
export const supportedLanguages = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇲🇦', dir: 'rtl' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
} as const;

// Language detection priorities
const LANGUAGE_PRIORITIES = {
  COOKIE: 4,      // Highest priority - explicit user choice
  URL_PARAM: 3,   // High priority - current session choice
  USER_AGENT: 2,  // Medium priority - browser preference
  DEFAULT: 1,     // Lowest priority - fallback
};

// Helper to get localized text from MultiLanguageText objects
export function getLocalizedText(
  text: string | { [key: string]: string } | undefined, 
  language: Language = 'en'
): string {
  if (!text) return '';
  
  if (typeof text === 'string') {
    return text;
  }
  
  return text[language] || text['en'] || Object.values(text)[0] || '';
}

// Detect language from Accept-Language header
function detectFromAcceptLanguage(acceptLanguage: string | null): Language | null {
  if (!acceptLanguage) return null;

  const languages = acceptLanguage.split(',').map(lang => {
    const [code, quality = 'q=1.0'] = lang.trim().split(';');
    const qualityValue = parseFloat(quality.split('=')[1]) || 1.0;
    return { code: code.split('-')[0], quality: qualityValue };
  });

  // Sort by quality (highest first)
  languages.sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const lang of languages) {
    if (supportedLanguages[lang.code as Language]) {
      return lang.code as Language;
    }
  }

  return null;
}

// Detect language from user agent (browser language)
function detectFromUserAgent(userAgent: string | null): Language | null {
  if (!userAgent) return null;

  // Common language patterns in user agents
  const languagePatterns = {
    'ar': /ar|arabic/i,
    'fr': /fr|french/i,
    'es': /es|spanish/i,
    'en': /en|english/i,
  };

  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(userAgent)) {
      return lang as Language;
    }
  }

  return null;
}

// Detect language from cookie
function detectFromCookie(cookieStore: any): Language | null {
  try {
    const langCookie = cookieStore.get('moroCompase-language');
    if (langCookie?.value && supportedLanguages[langCookie.value as Language]) {
      return langCookie.value as Language;
    }
  } catch (error) {
    console.warn('Error reading language cookie:', error);
  }
  return null;
}

// Detect language from URL search params
function detectFromURL(searchParams: URLSearchParams): Language | null {
  const langParam = searchParams.get('lang');
  if (langParam && supportedLanguages[langParam as Language]) {
    return langParam as Language;
  }
  return null;
}

// Detect language from request headers (for API routes)
function detectFromRequestHeaders(headers: Headers): Language | null {
  // Check Accept-Language header
  const acceptLanguage = headers.get('accept-language');
  const fromAcceptLang = detectFromAcceptLanguage(acceptLanguage);
  if (fromAcceptLang) return fromAcceptLang;

  // Check other headers that might indicate language
  const userAgent = headers.get('user-agent');
  return detectFromUserAgent(userAgent);
}

// Main function to detect language with priority system
// lib/language-server.ts
export async function detectLanguage(request?: NextRequest): Promise<Language> {
  let detectedLanguage: Language | null = null;
  
  try {
    // For server components
    if (!request) {
      const headersModule = await import('next/headers');
      const headers = await headersModule.headers();
      const cookieStore = headersModule.cookies();

      // 1. Check cookies first (user explicit choice)
      const cookieLang = detectFromCookie(cookieStore);
      if (cookieLang) {
        detectedLanguage = cookieLang;
      }

      // 2. Check URL parameters from current request
      if (!detectedLanguage) {
        try {
          const url = headers.get('referer') || headers.get('x-url') || '';
          if (url) {
            const searchParams = new URL(url).searchParams;
            const urlLang = detectFromURL(searchParams);
            if (urlLang) {
              detectedLanguage = urlLang;
            }
          }
        } catch (error) {
          console.warn('Error parsing URL from headers:', error);
        }
      }

      // 3. Check Accept-Language header
      if (!detectedLanguage) {
        const acceptLanguage = headers.get('accept-language');
        detectedLanguage = detectFromAcceptLanguage(acceptLanguage);
      }
    } else {
      // For API routes with NextRequest
      // 1. Check URL parameters
      const urlLang = detectFromURL(request.nextUrl.searchParams);
      if (urlLang) {
        detectedLanguage = urlLang;
      }

      // 2. Check cookies
      if (!detectedLanguage) {
        const cookieLang = detectFromCookie(request.cookies);
        if (cookieLang) {
          detectedLanguage = cookieLang;
        }
      }

      // 3. Check headers
      if (!detectedLanguage) {
        detectedLanguage = detectFromRequestHeaders(request.headers);
      }
    }
  } catch (error) {
    console.error('Error detecting language:', error);
  }

  return detectedLanguage || 'en';
}

// Note: server-only actions (like setting cookies) have been moved to a separate
// server module to avoid importing `next/headers` from client code.

// Get language info with metadata
export function getLanguageInfo(language: Language) {
  return supportedLanguages[language];
}

// Check if text needs RTL layout
export function isRTL(language: Language): boolean {
  return supportedLanguages[language]?.dir === 'rtl';
}

// Get all supported languages for language switcher
export function getAllLanguages(): Array<{ code: Language; name: string; flag: string; dir: string }> {
  return Object.entries(supportedLanguages).map(([code, info]) => ({
    code: code as Language,
    ...info,
  }));
}