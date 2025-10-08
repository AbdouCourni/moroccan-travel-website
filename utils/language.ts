// utils/language.ts
import { MultiLanguageText, Language } from '../types';

export const getLocalizedText = (
  text: MultiLanguageText | string, 
  language: Language = 'en'
): string => {
  if (typeof text === 'string') return text;
  return text[language] || text.en;
};

export const getCurrentLanguage = (): Language => {
  // You can get this from user preferences, browser language, or context
  return 'en'; // Default to English for now
};