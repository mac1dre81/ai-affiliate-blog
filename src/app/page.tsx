import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

export default async function Home() {
  const posts = await getBlogPosts();
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">AI Affiliate Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.slug} className="border rounded-lg overflow-hidden shadow-md">
            {post.coverImage && (
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}