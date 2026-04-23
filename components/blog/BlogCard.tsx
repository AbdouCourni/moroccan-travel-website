// components/blog/BlogCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export function BlogCard({ post, lang }: { post: any; lang: string }) {
  // Get title based on language or fallback to English
  const title = post.title?.[lang] || post.title?.en || post.title || 'Untitled';
  const description = post.description?.[lang] || post.description?.en || post.description || '';
  const image = post.image || '/images/blog-placeholder.jpg';
  const slug = post.slug;
  const readTime = post.readTime || 5;
  const date = post.publishedAt?.toDate ? post.publishedAt.toDate() : new Date(post.publishedAt);

  return (
    <Link href={`/${lang}/blog/${slug}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span>{date.toLocaleDateString()}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
          <h2 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {description}
          </p>
          <div className="mt-4 text-amber-600 font-semibold text-sm group-hover:underline">
            Read More →
          </div>
        </div>
      </div>
    </Link>
  );
}