import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

export default async function Categories() {
  const posts = await getBlogPosts();
  
  // Extract unique categories
  const categories = Array.from(new Set(posts.map(post => post.category)));
  
  // Group posts by category
  const postsByCategory: Record<string, typeof posts> = {};
  
  for (const category of categories) {
    postsByCategory[category] = posts.filter(post => post.category === category);
  }
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Categories</h1>
      
      {categories.map(category => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{category}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsByCategory[category].map(post => (
              <div key={post.slug} className="border rounded-lg overflow-hidden shadow-md">
                {post.coverImage && (
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
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
        </div>
      ))}
    </main>
  );
}