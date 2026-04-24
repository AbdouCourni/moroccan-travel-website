// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getBlogPosts } from '../../lib/firebase-server';

const baseUrl = 'https://morocompase.com';
const languages = ['en', 'fr', 'ar', 'es'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  
  // Fetch all published blog posts
  let blogPosts: any[] = [];
  try {
    blogPosts = await getBlogPosts(100); // Get up to 100 posts
    console.log(`📊 Sitemap: Found ${blogPosts.length} blog posts`);
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }
  
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
    
    // Blog listing page
    sitemapEntries.push({
      url: `${baseUrl}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
    
    // Individual blog posts for each language
    for (const post of blogPosts) {
      const postSlug = post.slug;
      const postDate = post.updatedAt || post.publishedAt || new Date();
      
      // Convert post date to Date object if it's a string
      let lastModified = new Date();
      if (postDate) {
        try {
          lastModified = typeof postDate === 'string' 
            ? new Date(postDate) 
            : postDate.toDate?.() || new Date(postDate);
        } catch (e) {
          lastModified = new Date();
        }
      }
      
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/blog/${postSlug}`,
        lastModified: lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }
  
  console.log(`📊 Sitemap generated with ${sitemapEntries.length} URLs`);
  return sitemapEntries;
}