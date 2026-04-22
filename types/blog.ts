// types/blog.ts
export interface BlogPost {
  id: string;
  title: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  slug: string;
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  content: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  image: string;
  imageAlt: string;
  publishedAt: Date;
  updatedAt: Date;
  keywords: string[];
  category: 'itinerary' | 'guide' | 'tips' | 'culture' | 'food';
  readingTime: number;
  views: number;
  featured: boolean;
  status: 'draft' | 'published';
  author: {
    name: string;
    avatar?: string;
  };
  relatedPosts: string[]; // IDs of related posts
}