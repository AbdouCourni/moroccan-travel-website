// lib/language-server.ts
export type Language = 'en' | 'fr' | 'ar' | 'es';

export const supportedLanguages = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇲🇦', dir: 'rtl' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
} as const;

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

// Simple server-side detection (for static generation)
export async function detectLanguage(): Promise<Language> {
  return 'en'; // Default for static generation
}

// Client-side detection from search params
export function getLanguageFromSearchParams(searchParams: URLSearchParams): Language {
  const lang = searchParams.get('lang');
  if (lang && ['en', 'fr', 'ar', 'es'].includes(lang)) {
    return lang as Language;
  }
  return 'en';
}

// Get all supported languages
export function getAllLanguages() {
  return Object.entries(supportedLanguages).map(([code, info]) => ({
    code: code as Language,
    ...info,
  }));
}

// Check if text needs RTL layout
export function isRTL(language: Language): boolean {
  return supportedLanguages[language]?.dir === 'rtl';
}