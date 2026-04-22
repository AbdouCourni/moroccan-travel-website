// app/[lang]/blog/page.tsx
import { getBlogPosts } from '../../../../lib/firebase-server';
import { BlogCard } from '../../../../components/blog/BlogCard';
import { Language } from '../../../../types';


export default async function BlogPage({ params }: { params: { lang: Language } }) {
  const posts = await getBlogPosts(20);
  const lang = params.lang || 'en';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-amiri text-4xl md:text-5xl font-bold text-center mb-3">
        Morocco Travel Blog
      </h1>

      <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
        Expert tips, local insights, and guides to plan your Morocco trip
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <BlogCard key={post.id} post={post} lang={lang} />
        ))}
      </div>
    </div>
  );
}