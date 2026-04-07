// src/app/sitemap.ts
import { MetadataRoute } from 'next';

const baseUrl = 'https://morocompase.com';
const languages = ['en', 'fr', 'ar', 'es'];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  
  for (const lang of languages) {
    // Homepage for each language
    sitemapEntries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
    
    // Discover Morocco page
    sitemapEntries.push({
      url: `${baseUrl}/${lang}/discover-morocco`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
    
    // Main sections
    const sections = ['destinations', 'recipes', 'culture', 'stays', 'transport'];
    for (const section of sections) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/${section}`,
        lastModified: new Date(),
        changeFrequency: section === 'recipes' ? 'weekly' : 'monthly',
        priority: 0.8,
      });
    }
  }
  
  return sitemapEntries;
}