// src/lib/markdown-service.ts
import { getDestinationBySlug } from './firebase-server';

type Locale = 'en' | 'fr' | 'ar' | 'es';

// Define the structure of markdown pages
interface MarkdownPages {
  [key: string]: string;
}

// Define destination name type
interface DestinationName {
  en: string;
  fr: string;
  ar: string;
  es: string;
}

// Define destination type with proper typing
interface Destination {
  id: string;
  slug: string;
  name: DestinationName;
  description: DestinationName;
  region: string;
  bestSeason?: string[];
  activities?: string[];
  highlights?: string[];
}

export async function generateMarkdownForPath(
  pathname: string, 
  locale: Locale
): Promise<string | null> {
  // For dynamic routes like destinations, fetch from Firebase
  if (pathname.startsWith('/destinations/')) {
    const slug = pathname.split('/').pop()
    
    // Check if slug exists
    if (!slug) return null
    
    const destination = await getDestinationBySlug(slug) as Destination | null
    if (!destination) return null
    
    // Safe access with fallbacks
    const name = destination.name?.[locale] || destination.name?.en || 'Destination'
    const description = destination.description?.[locale] || destination.description?.en || 'No description available'
    const region = destination.region || 'Morocco'
    const bestSeason = destination.bestSeason?.join(', ') || 'Year-round'
    const activities = destination.activities?.join(', ') || 'Sightseeing, Culture, Shopping'
    const highlights = destination.highlights || []
    
    let markdown = `# ${name}

${description}

## Key Information
- **Region:** ${region}
- **Best Season:** ${bestSeason}
- **Activities:** ${activities}

`

    if (highlights.length > 0) {
      markdown += `## Highlights\n${highlights.map(h => `- ${h}`).join('\n')}\n\n`
    }
    
    markdown += `---
*Source: MoroCompase Travel Guide*

[Explore more destinations →](https://morocompase.com/${locale}/destinations)`
    
    return markdown
  }
  
  // For static pages, return cached markdown with proper typing
  const markdownPages: MarkdownPages = {
    '/discover-morocco': `# Discover Morocco

Your complete guide to exploring Morocco's diverse landscapes, rich culture, and hidden treasures.

## Why Visit Morocco?
Morocco offers an incredible diversity of experiences that few countries can match. From the bustling souks of Marrakech to the tranquil Sahara Desert, every corner tells a unique story.

## Top Destinations
- **Marrakech** - The Red City with vibrant markets and historic palaces
- **Fes** - Ancient medina and cultural heart of Morocco
- **Chefchaouen** - The stunning Blue Pearl of Morocco
- **Sahara Desert** - Golden dunes and Berber camp experiences
- **Essaouira** - Coastal charm and fresh seafood

## Travel Tips
- **Best time to visit:** Spring (March-May) and Fall (September-November)
- **Getting around:** Trains connect major cities; CTM buses reach smaller towns
- **Local customs:** Dress modestly, ask permission before photos, learn basic Arabic/French phrases

## Ready to Plan Your Trip?
Use our [AI Trip Planner](https://morocompase.com/${locale}/trip-planner) to create your perfect Morocco itinerary.

---
*Source: MoroCompase - Authentic Morocco Travel Guide*`,
    
    '/blog': `# Morocco Travel Blog

Expert tips, local insights, and detailed guides to help you plan the perfect Moroccan adventure.

## Popular Topics
- Morocco Travel Guides
- Destination Itineraries
- Cultural Tips & Etiquette
- Food & Restaurant Reviews
- Accommodation Guides

## Latest Articles
Visit our [full blog](https://morocompase.com/${locale}/blog) for the latest travel tips and destination guides.

---
*Source: MoroCompase Travel Blog*`
  }
  
  return markdownPages[pathname] || null
}