// types/blog.ts
export type BlogBlock = 
  | HeroBlock
  | ParagraphBlock
  | HeadingBlock
  | ProTipBlock
  | InsiderTipBlock
  | DontMissBlock
  | ImageBlock
  | ImageGalleryBlock
  | ListBlock
  | TableBlock
  | FAQBlock
  | QuoteBlock
  | VideoBlock
  | MapBlock
  | CTAButtonBlock
  | NewsletterBlock;

interface HeroBlock {
  type: 'hero';
  title: string;
  subtitle: string;
  image: string;
  meta: {
    readTime: number;
    date: string;
    author: string;
  };
}

interface ParagraphBlock {
  type: 'paragraph';
  content: string;
  highlight?: boolean;
}

interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4;
  content: string;
  id?: string;
}

interface ProTipBlock {
  type: 'pro-tip';
  title: string;
  content: string;
}

interface InsiderTipBlock {
  type: 'insider-tip';
  content: string;
}

interface DontMissBlock {
  type: 'dont-miss';
  title: string;
  items: string[];
}

interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  fullWidth?: boolean;
}

interface ImageGalleryBlock {
  type: 'gallery';
  images: Array<{ src: string; alt: string; caption?: string }>;
  layout: 'grid' | 'carousel';
}

interface ListBlock {
  type: 'list';
  items: string[];
  ordered: boolean;
  variant?: 'bullet' | 'check' | 'number';
}

interface TableBlock {
  type: 'table';
  headers: string[];
  rows: Array<{ cells: string[] }>; // Updated from string[][]
  variant?: 'price' | 'comparison';
}

interface FAQBlock {
  type: 'faq';
  questions: Array<{ question: string; answer: string }>;
}

interface QuoteBlock {
  type: 'quote';
  text: string;
  author?: string;
  image?: string;
}

interface VideoBlock {
  type: 'video';
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
}

interface MapBlock {
  type: 'map';
  location: { lat: number; lng: number };
  zoom: number;
  title: string;
}

interface CTAButtonBlock {
  type: 'cta-button';
  text: string;
  url: string;
  variant: 'primary' | 'secondary';
}

interface NewsletterBlock {
  type: 'newsletter';
  title: string;
  description: string;
}