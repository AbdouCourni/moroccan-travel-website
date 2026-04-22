// app/[lang]/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getBlogPostBySlug } from '../../../../../lib/firebase-server';

type Params = {
  params: { slug: string; lang: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  // ✅ Prevent crash
  if (!post) {
    return {
      title: 'Blog',
      description: 'Travel blog',
    };
  }

  const lang = (params.lang || 'en') as keyof typeof post.title;

 return {
  title: post.title?.[lang] || post.title?.en || 'Blog',
  description: post.description?.[lang] || post.description?.en || '',
  keywords: post.keywords || [],
  openGraph: {
    title: post.title?.[lang] || post.title?.en,
    description: post.description?.[lang] || post.description?.en,
    images: post.image ? [post.image] : [],
    type: 'article',
    publishedTime: post.publishedAt?.toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title?.[lang] || post.title?.en,
    description: post.description?.[lang] || post.description?.en,
    images: post.image ? [post.image] : [],
  },
};
}