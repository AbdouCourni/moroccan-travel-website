// app/[lang]/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '../../../../../lib/firebase-server';
import { JSX } from 'react';

type Params = {
  params: { slug: string; lang: string };
};

export async function generateMetadata({ params }: Params) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found',
    };
  }

  const lang = params.lang || 'en';
  const title = post.title?.[lang] || post.title?.en || 'Blog Post';
  const description = post.description?.[lang] || post.description?.en || '';

  return {
    title: `${title} | MoroCompase Blog`,
    description: description,
  };
}

export default async function BlogPostPage({ params }: Params) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const lang = params.lang || 'en';
  const title = post.title?.[lang] || post.title?.en || 'Blog Post';
  const blocks = post.blocks || [];

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Blog Header */}
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-500">
          <span>{post.author || 'MoroCompase Team'}</span>
          <span>•</span>
          <span>{post.readTime || 5} min read</span>
          <span>•</span>
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}</span>
        </div>
      </header>

      {/* Blog Content - Render blocks */}
      {blocks.length > 0 ? (
        <div className="prose prose-lg max-w-none">
          {blocks.map((block: any, index: number) => {
            switch (block.type) {
              
              case 'hero':
                return (
                  <div key={index} className="text-center mb-12">
                    {block.image && (
                      <img 
                        src={block.image} 
                        alt={block.title || 'Hero image'}
                        className="w-full rounded-2xl mb-6 max-h-[400px] object-cover"
                      />
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{block.title}</h1>
                    <p className="text-xl text-gray-600">{block.subtitle}</p>
                    {block.meta && (
                      <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
                        <span>{block.meta.author}</span>
                        <span>•</span>
                        <span>{block.meta.readTime} min read</span>
                        <span>•</span>
                        <span>{block.meta.date}</span>
                      </div>
                    )}
                  </div>
                );

              case 'heading':
                const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                return (
                  <HeadingTag key={index} id={block.id} className="font-bold text-gray-900 mt-8 mb-4">
                    {block.content}
                  </HeadingTag>
                );

              case 'paragraph':
                return (
                  <p 
                    key={index} 
                    className={`text-gray-700 leading-relaxed mb-4 ${block.highlight ? 'text-lg font-medium bg-amber-50 p-4 rounded-lg' : ''}`}
                  >
                    {block.content}
                  </p>
                );

              case 'pro-tip':
                return (
                  <div key={index} className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 my-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h4 className="font-bold text-gray-900">{block.title || 'Pro Tip'}</h4>
                        <p className="text-gray-700">{block.content}</p>
                      </div>
                    </div>
                  </div>
                );

              case 'insider-tip':
                return (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 my-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✨</span>
                      <div>
                        <h4 className="font-bold text-gray-900">Insider Tip</h4>
                        <p className="text-gray-700">{block.content}</p>
                      </div>
                    </div>
                  </div>
                );

              case 'dont-miss':
                return (
                  <div key={index} className="bg-pink-50 border-l-4 border-pink-500 rounded-r-xl p-5 my-6">
                    <h4 className="font-bold text-gray-900 mb-2">⭐ {block.title || 'Don\'t Miss'}</h4>
                    {block.items && Array.isArray(block.items) && (
                      <ul className="list-disc pl-5 space-y-1">
                        {block.items.map((item: string, i: number) => (
                          <li key={i} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    )}
                    {block.content && <p className="text-gray-700">{block.content}</p>}
                  </div>
                );

              case 'list':
                const ListTag = block.ordered ? 'ol' : 'ul';
                return (
                  <ListTag key={index} className={`${block.ordered ? 'list-decimal' : 'list-disc'} pl-6 mb-4 space-y-2`}>
                    {block.items?.map((item: string, i: number) => (
                      <li key={i} className="text-gray-700">{item}</li>
                    ))}
                  </ListTag>
                );

              case 'image':
                // ✅ FIXED: Look for both 'image' and 'src' fields
                const imageUrl = block.image || block.src;
                return (
                  <figure key={index} className="my-8">
                    <img 
                      src={imageUrl} 
                      alt={block.alt || 'Blog image'} 
                      className="rounded-xl w-full"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = 'https://placehold.co/1200x800/f5f5f5/333333?text=Image+Not+Found';
                      }}
                    />
                    {block.caption && (
                      <figcaption className="text-center text-sm text-gray-500 mt-2">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );

              case 'table':
                // ✅ FIXED: Handle both row formats
                let tableRows = block.rows || [];
                if (tableRows.length > 0 && tableRows[0].cells) {
                  // Convert {cells: [...]} format to simple array format
                  tableRows = tableRows.map((row: any) => row.cells);
                }
                return (
                  <div key={index} className="overflow-x-auto my-6">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-900 text-white">
                          {block.headers?.map((header: string, i: number) => (
                            <th key={i} className="p-3 text-left">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row: string[], i: number) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            {row.map((cell: string, j: number) => (
                              <td key={j} className="p-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );

              case 'faq':
                return (
                  <div key={index} className="my-8">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {block.questions?.map((q: any, i: number) => (
                        <details key={i} className="border rounded-xl overflow-hidden">
                          <summary className="font-semibold p-4 bg-gray-50 cursor-pointer hover:bg-gray-100">
                            {q.question}
                          </summary>
                          <div className="p-4 text-gray-700 border-t">
                            {q.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );

              case 'newsletter':
                return (
                  <div key={index} className="my-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{block.title}</h3>
                    <p className="text-gray-300 mb-4">{block.description}</p>
                    <div className="flex max-w-md mx-auto gap-3">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-1 px-4 py-2 rounded-full border-0 focus:ring-2 focus:ring-amber-400"
                      />
                      <button className="bg-amber-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-amber-700 transition">
                        Subscribe
                      </button>
                    </div>
                  </div>
                );

              case 'cta-button':
                return (
                  <div key={index} className="text-center my-8">
                    <a
                      href={block.url}
                      className="inline-block bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition"
                    >
                      {block.text} →
                    </a>
                  </div>
                );

              default:
                console.warn('Unknown block type:', block.type);
                return null;
            }
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No content available for this post yet.</p>
          <p className="text-sm mt-2">Check back soon for the complete guide!</p>
        </div>
      )}

      {/* Back to Blog Link */}
      <div className="mt-12 text-center pt-8 border-t">
        <a href={`/${lang}/blog`} className="text-amber-600 hover:underline">
          ← Back to all posts
        </a>
      </div>
    </article>
  );
}