// components/blog/BlogCard.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { Language } from '../../types';




export function BlogCard({ post, lang }: { post: BlogPost; lang: Language }) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image}
            alt={post.imageAlt || post.title[lang]}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} min read
            </span>
          </div>
          <h2 className="font-amiri text-xl font-bold text-dark-charcoal mb-2 group-hover:text-primary-gold transition-colors">
            {post.title[lang]}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {post.description[lang]}
          </p>
        </div>
      </div>
    </Link>
  );
}