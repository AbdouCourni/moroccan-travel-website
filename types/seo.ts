export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    images: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
}

export interface MultiLanguageSEO {
  en: SEOConfig;
  fr?: SEOConfig;
  ar?: SEOConfig;
  es?: SEOConfig;
}